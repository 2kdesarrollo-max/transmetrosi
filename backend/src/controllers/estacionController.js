const oracledb = require('oracledb');
const { query, queryOne, execute, withTransaction, normalizeRow, normalizeRows, toHttpError } = require('../db/db');

const list = async (req, res) => {
  try {
    const rows = await query(
      `SELECT
         e.id,
         e.nombre,
         e.capacidad_max,
         e.municipalidad_id,
         m.nombre AS municipalidad_nombre,
         (SELECT COUNT(*) FROM acceso a WHERE a.estacion_id = e.id) AS accesos_count,
         (SELECT COUNT(*)
            FROM acceso a
            JOIN guardia g ON g.acceso_id = a.id
           WHERE a.estacion_id = e.id) AS guardias_count,
         (SELECT o.id FROM operador o WHERE o.estacion_id = e.id) AS operador_id,
         (SELECT (o.nombre || ' ' || o.apellido) FROM operador o WHERE o.estacion_id = e.id) AS operador_nombre,
         (SELECT o.pc_nombre FROM operador o WHERE o.estacion_id = e.id) AS pc_nombre
       FROM estacion e
       JOIN municipalidad m ON m.id = e.municipalidad_id
       ORDER BY e.id`
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
    const estacion = await queryOne(
      `SELECT
         e.id,
         e.nombre,
         e.capacidad_max,
         e.municipalidad_id,
         m.nombre AS municipalidad_nombre
       FROM estacion e
       JOIN municipalidad m ON m.id = e.municipalidad_id
       WHERE e.id = :id`,
      { id }
    );
    if (!estacion) return res.status(404).json({ message: 'Not found' });

    const operador = await queryOne(
      `SELECT id, nombre, apellido, dpi, estacion_id, pc_nombre, created_at
       FROM operador
       WHERE estacion_id = :id`,
      { id }
    );

    const accesoRows = await query(
      `SELECT
         a.id AS acceso_id,
         a.nombre AS acceso_nombre,
         g.id AS guardia_id,
         g.nombre AS guardia_nombre,
         g.apellido AS guardia_apellido,
         g.dpi AS guardia_dpi,
         g.turno AS guardia_turno
       FROM acceso a
       LEFT JOIN guardia g ON g.acceso_id = a.id
       WHERE a.estacion_id = :id
       ORDER BY a.id, g.id`,
      { id }
    );

    const accesos = [];
    const byAcceso = new Map();
    for (const row of accesoRows) {
      const accesoId = row.acceso_id;
      let acceso = byAcceso.get(accesoId);
      if (!acceso) {
        acceso = { id: accesoId, nombre: row.acceso_nombre, guardias: [] };
        byAcceso.set(accesoId, acceso);
        accesos.push(acceso);
      }
      if (row.guardia_id) {
        acceso.guardias.push({
          id: row.guardia_id,
          nombre: row.guardia_nombre,
          apellido: row.guardia_apellido,
          dpi: row.guardia_dpi,
          turno: row.guardia_turno
        });
      }
    }

    const lineas = await query(
      `SELECT
         l.id,
         l.nombre,
         l.color,
         le.orden
       FROM linea_estacion le
       JOIN linea l ON l.id = le.linea_id
       WHERE le.estacion_id = :id
       ORDER BY l.id`,
      { id }
    );

    return res.status(200).json({ ...estacion, operador, accesos, lineas });
  } catch (error) {
    const out = toHttpError(error);
    return res.status(out.status).json({ message: out.message });
  }
};

const create = async (req, res) => {
  const { nombre, capacidad_max, municipalidad_id } = req.body ?? {};
  const capacidad = Number.parseInt(capacidad_max, 10);
  const municipalidadId = Number.parseInt(municipalidad_id, 10);

  if (!nombre) return res.status(400).json({ message: 'nombre is required' });
  if (!Number.isFinite(capacidad) || capacidad <= 0) return res.status(400).json({ message: 'capacidad_max is required' });
  if (!Number.isFinite(municipalidadId)) return res.status(400).json({ message: 'municipalidad_id is required' });

  try {
    await execute(
      `INSERT INTO estacion (nombre, capacidad_max, municipalidad_id)
       VALUES (:nombre, :capacidad_max, :municipalidad_id)`,
      { nombre, capacidad_max: capacidad, municipalidad_id: municipalidadId }
    );

    const row = await queryOne(
      `SELECT id, nombre, capacidad_max, municipalidad_id, created_at
       FROM estacion
       WHERE nombre = :nombre`,
      { nombre }
    );

    return res.status(201).json(row);
  } catch (error) {
    const out = toHttpError(error);
    return res.status(out.status).json({ message: out.message });
  }
};

const addAcceso = async (req, res) => {
  const estacionId = Number.parseInt(req.params.id, 10);
  const { nombre, guardias } = req.body ?? {};
  if (!Number.isFinite(estacionId)) return res.status(400).json({ message: 'Invalid estacion id' });
  if (!nombre) return res.status(400).json({ message: 'nombre is required' });
  if (!Array.isArray(guardias) || guardias.length < 1) {
    return res.status(400).json({ message: 'guardias must be a non-empty array' });
  }

  const normalizedGuardias = guardias.map((g) => ({
    nombre: g?.nombre,
    apellido: g?.apellido,
    dpi: g?.dpi,
    turno: g?.turno
  }));
  if (normalizedGuardias.some((g) => !g.nombre || !g.apellido || !g.dpi || !g.turno)) {
    return res.status(400).json({ message: 'Cada guardia requiere nombre, apellido, dpi y turno' });
  }

  try {
    const out = await withTransaction(async (connection) => {
      const insertResult = await connection.execute(
        `INSERT INTO acceso (nombre, estacion_id)
         VALUES (:nombre, :estacion_id)
         RETURNING id INTO :id`,
        {
          nombre,
          estacion_id: estacionId,
          id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
        }
      );

      const accesoId = insertResult.outBinds?.id?.[0];

      for (const g of normalizedGuardias) {
        await connection.execute(
          `INSERT INTO guardia (nombre, apellido, dpi, acceso_id, turno)
           VALUES (:nombre, :apellido, :dpi, :acceso_id, :turno)`,
          { ...g, acceso_id: accesoId }
        );
      }

      const acceso = await connection.execute(
        `SELECT id, nombre, estacion_id, created_at
         FROM acceso
         WHERE id = :id`,
        { id: accesoId },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );

      const guardiasRows = await connection.execute(
        `SELECT id, nombre, apellido, dpi, turno, acceso_id, created_at
         FROM guardia
         WHERE acceso_id = :acceso_id
         ORDER BY id`,
        { acceso_id: accesoId },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );

      return {
        acceso: normalizeRow(acceso.rows?.[0] ?? null),
        guardias: normalizeRows(guardiasRows.rows ?? [])
      };
    });

    return res.status(201).json(out);
  } catch (error) {
    const out = toHttpError(error);
    return res.status(out.status).json({ message: out.message });
  }
};

const upsertOperador = async (req, res) => {
  const estacionId = Number.parseInt(req.params.id, 10);
  const { nombre, apellido, dpi, pc_nombre } = req.body ?? {};
  if (!Number.isFinite(estacionId)) return res.status(400).json({ message: 'Invalid estacion id' });
  if (!nombre || !apellido || !dpi) return res.status(400).json({ message: 'nombre, apellido, dpi are required' });

  try {
    const out = await withTransaction(async (connection) => {
      const existing = await connection.execute(
        `SELECT id FROM operador WHERE estacion_id = :estacion_id`,
        { estacion_id: estacionId }
      );

      if ((existing.rows ?? []).length > 0) {
        await connection.execute(
          `UPDATE operador
           SET nombre = :nombre, apellido = :apellido, dpi = :dpi, pc_nombre = :pc_nombre
           WHERE estacion_id = :estacion_id`,
          { nombre, apellido, dpi, pc_nombre: pc_nombre ?? null, estacion_id: estacionId }
        );
      } else {
        await connection.execute(
          `INSERT INTO operador (nombre, apellido, dpi, estacion_id, pc_nombre)
           VALUES (:nombre, :apellido, :dpi, :estacion_id, :pc_nombre)`,
          { nombre, apellido, dpi, estacion_id: estacionId, pc_nombre: pc_nombre ?? null }
        );
      }

      const row = await connection.execute(
        `SELECT id, nombre, apellido, dpi, estacion_id, pc_nombre, created_at
         FROM operador
         WHERE estacion_id = :estacion_id`,
        { estacion_id: estacionId }
      );
      return row.rows?.[0] ?? null;
    });

    return res.status(200).json(out);
  } catch (error) {
    const out = toHttpError(error);
    return res.status(out.status).json({ message: out.message });
  }
};

module.exports = { list, getById, create, addAcceso, upsertOperador };
