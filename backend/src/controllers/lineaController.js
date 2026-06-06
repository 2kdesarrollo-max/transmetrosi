const oracledb = require('oracledb');
const { query, queryOne, execute, withTransaction, toHttpError } = require('../db/db');

const list = async (req, res) => {
  try {
    const rows = await query(
      `SELECT
         l.id,
         l.nombre,
         l.color,
         l.municipalidad_id,
         m.nombre AS municipalidad_nombre,
         (SELECT COUNT(*) FROM linea_estacion le WHERE le.linea_id = l.id) AS estaciones_count,
         (SELECT COUNT(*) FROM bus b WHERE b.linea_id = l.id) AS buses_count,
         (SELECT NVL(SUM(le.distancia_siguiente_km), 0) FROM linea_estacion le WHERE le.linea_id = l.id) AS distancia_total_km
       FROM linea l
       JOIN municipalidad m ON m.id = l.municipalidad_id
       ORDER BY l.id`
    );
    return res.status(200).json(rows);
  } catch (error) {
    const out = toHttpError(error);
    return res.status(out.status).json({ message: out.message });
  }
};

const getById = async (req, res) => {
  const id = Number.parseInt(req.params.id, 10);
  if (!Number.isFinite(id)) return res.status(400).json({ message: 'Invalid id' });

  try {
    const linea = await queryOne(
      `SELECT
         l.id,
         l.nombre,
         l.color,
         l.municipalidad_id,
         m.nombre AS municipalidad_nombre
       FROM linea l
       JOIN municipalidad m ON m.id = l.municipalidad_id
       WHERE l.id = :id`,
      { id }
    );
    if (!linea) return res.status(404).json({ message: 'Not found' });

    const estaciones = await query(
      `SELECT
         e.id,
         e.nombre,
         le.orden,
         le.distancia_siguiente_km
       FROM linea_estacion le
       JOIN estacion e ON e.id = le.estacion_id
       WHERE le.linea_id = :id
       ORDER BY le.orden`,
      { id }
    );

    const estacionesCountRows = await query(
      `SELECT estacion_id, COUNT(*) AS lineas_count
       FROM linea_estacion
       GROUP BY estacion_id`
    );
    const lineCountByStation = new Map();
    for (const r of estacionesCountRows) {
      lineCountByStation.set(r.estacion_id, r.lineas_count);
    }
    const estacionesWithMeta = (estaciones || []).map((e) => ({
      ...e,
      transbordo: (lineCountByStation.get(e.id) ?? 0) > 1
    }));

    const distanciaTotal = await queryOne(
      `SELECT NVL(SUM(distancia_siguiente_km), 0) AS distancia_total_km
       FROM linea_estacion
       WHERE linea_id = :id`,
      { id }
    );

    const buses = await query(
      `SELECT
         b.id,
         b.numero_unidad,
         b.placa,
         b.capacidad_pasajeros,
         b.ocupacion_actual,
         b.estado,
         b.parqueo_id,
         p.nombre AS parqueo_nombre
       FROM bus b
       JOIN parqueo p ON p.id = b.parqueo_id
       WHERE b.linea_id = :id
       ORDER BY b.id`,
      { id }
    );

    return res.status(200).json({
      ...linea,
      estaciones: estacionesWithMeta,
      distancia_total_km: distanciaTotal?.distancia_total_km ?? 0,
      buses,
      estaciones_count: estacionesWithMeta.length,
      buses_count: buses.length
    });
  } catch (error) {
    const out = toHttpError(error);
    return res.status(out.status).json({ message: out.message });
  }
};

const create = async (req, res) => {
  const { nombre, color, municipalidad_id } = req.body ?? {};
  const municipalidadId = Number.parseInt(municipalidad_id, 10);
  if (!nombre) return res.status(400).json({ message: 'nombre is required' });
  if (!Number.isFinite(municipalidadId)) return res.status(400).json({ message: 'municipalidad_id is required' });

  try {
    await execute(
      `INSERT INTO linea (nombre, color, municipalidad_id)
       VALUES (:nombre, :color, :municipalidad_id)`,
      { nombre, color: color ?? null, municipalidad_id: municipalidadId }
    );
    const row = await queryOne(
      `SELECT id, nombre, color, municipalidad_id, created_at
       FROM linea
       WHERE nombre = :nombre`,
      { nombre }
    );
    return res.status(201).json(row);
  } catch (error) {
    const out = toHttpError(error);
    return res.status(out.status).json({ message: out.message });
  }
};

const setEstaciones = async (req, res) => {
  const id = Number.parseInt(req.params.id, 10);
  const { estaciones } = req.body ?? {};

  if (!Number.isFinite(id)) return res.status(400).json({ message: 'Invalid id' });
  if (!Array.isArray(estaciones) || estaciones.length === 0) {
    return res.status(400).json({ message: 'estaciones must be a non-empty array' });
  }

  const normalized = estaciones.map((x) => ({
    estacion_id: Number.parseInt(x.estacion_id, 10),
    orden: Number.parseInt(x.orden, 10),
    distancia_siguiente_km: x.distancia_siguiente_km === undefined || x.distancia_siguiente_km === null
      ? 0
      : Number.parseFloat(x.distancia_siguiente_km)
  }));

  if (normalized.some((x) => !Number.isFinite(x.estacion_id) || x.estacion_id <= 0)) {
    return res.status(400).json({ message: 'Invalid estacion_id' });
  }
  if (normalized.some((x) => !Number.isFinite(x.orden) || x.orden <= 0)) {
    return res.status(400).json({ message: 'Invalid orden' });
  }
  if (normalized.some((x) => !Number.isFinite(x.distancia_siguiente_km) || x.distancia_siguiente_km < 0)) {
    return res.status(400).json({ message: 'Invalid distancia_siguiente_km' });
  }
  const ordenes = normalized.map((x) => x.orden);
  const estacionesIds = normalized.map((x) => x.estacion_id);
  const ordenesUnique = new Set(ordenes);
  const estacionesUnique = new Set(estacionesIds);
  if (ordenesUnique.size !== ordenes.length) return res.status(400).json({ message: 'Orden duplicado' });
  if (estacionesUnique.size !== estacionesIds.length) return res.status(400).json({ message: 'Estación duplicada' });

  try {
    await withTransaction(async (connection) => {
      const exists = await connection.execute(
        `SELECT id FROM linea WHERE id = :id`,
        { id }
      );
      if ((exists.rows ?? []).length === 0) {
        throw new Error('LINEA_NOT_FOUND');
      }

      const lineaData = await connection.execute(
        `SELECT municipalidad_id FROM linea WHERE id = :id`,
        { id },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      const lineaMunicipalidadId = (lineaData.rows ?? [])[0]?.MUNICIPALIDAD_ID ?? null;

      const estacionesCheck = await connection.execute(
        `SELECT id, municipalidad_id FROM estacion WHERE id IN (${normalized.map((_, idx) => `:s${idx}`).join(',')})`,
        normalized.reduce((acc, x, idx) => ({ ...acc, [`s${idx}`]: x.estacion_id }), {}),
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      const stationsRows = estacionesCheck.rows ?? [];
      if (stationsRows.length !== normalized.length) {
        throw new Error('ESTACION_NOT_FOUND');
      }
      if (lineaMunicipalidadId !== null) {
        const mismatch = stationsRows.some((r) => r.MUNICIPALIDAD_ID !== lineaMunicipalidadId);
        if (mismatch) {
          throw new Error('MUNICIPALIDAD_MISMATCH');
        }
      }

      const busesCountResult = await connection.execute(
        `SELECT COUNT(*) AS buses_count FROM bus WHERE linea_id = :linea_id`,
        { linea_id: id },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      const busesCount = busesCountResult.rows?.[0]?.BUSES_COUNT ?? 0;
      const estacionesCount = normalized.length;
      if (busesCount > estacionesCount * 2) {
        throw new Error('BUSES_EXCEED_MAX');
      }

      await connection.execute(
        `DELETE FROM linea_estacion WHERE linea_id = :id`,
        { id }
      );

      for (const item of normalized) {
        await connection.execute(
          `INSERT INTO linea_estacion (linea_id, estacion_id, orden, distancia_siguiente_km)
           VALUES (:linea_id, :estacion_id, :orden, :distancia_siguiente_km)`,
          { linea_id: id, ...item }
        );
      }
    });

    return res.status(200).json({ message: 'OK' });
  } catch (error) {
    if (error?.message === 'ESTACION_NOT_FOUND') {
      return res.status(404).json({ message: 'Una o más estaciones no existen.' });
    }
    const out = toHttpError(error);
    return res.status(out.status).json({ message: out.message });
  }
};

module.exports = { list, getById, create, setEstaciones };
