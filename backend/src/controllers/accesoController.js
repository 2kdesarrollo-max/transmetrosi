const oracledb = require('oracledb');
const { query, queryOne, withTransaction, normalizeRow, normalizeRows, toHttpError } = require('../db/db');

const list = async (req, res) => {
  const estacionId = req.query?.estacion_id === undefined ? null : Number.parseInt(req.query.estacion_id, 10);
  if (req.query?.estacion_id !== undefined && (!Number.isFinite(estacionId) || estacionId <= 0)) {
    return res.status(400).json({ message: 'Invalid estacion_id' });
  }

  try {
    const rows = await query(
      `SELECT
         a.id,
         a.nombre,
         a.estacion_id,
         e.nombre AS estacion_nombre,
         (SELECT COUNT(*) FROM guardia g WHERE g.acceso_id = a.id) AS guardias_count,
         a.created_at
       FROM acceso a
       JOIN estacion e ON e.id = a.estacion_id
       WHERE (:estacion_id IS NULL OR a.estacion_id = :estacion_id)
       ORDER BY a.id`,
      { estacion_id: estacionId }
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
    const acceso = await queryOne(
      `SELECT a.id, a.nombre, a.estacion_id, a.created_at
       FROM acceso a
       WHERE a.id = :id`,
      { id }
    );
    if (!acceso) return res.status(404).json({ message: 'Not found' });

    const guardias = await query(
      `SELECT id, nombre, apellido, dpi, turno, acceso_id, created_at
       FROM guardia
       WHERE acceso_id = :id
       ORDER BY id`,
      { id }
    );

    return res.status(200).json({ ...acceso, guardias });
  } catch (error) {
    const out = toHttpError(error);
    return res.status(out.status).json({ message: out.message });
  }
};

const create = async (req, res) => {
  const { nombre, estacion_id, guardias } = req.body ?? {};
  const estacionId = Number.parseInt(estacion_id, 10);
  if (!nombre) return res.status(400).json({ message: 'nombre is required' });
  if (!Number.isFinite(estacionId) || estacionId <= 0) return res.status(400).json({ message: 'estacion_id is required' });
  if (!Array.isArray(guardias) || guardias.length < 1) return res.status(400).json({ message: 'guardias must be a non-empty array' });

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
      const exists = await connection.execute(
        `SELECT id FROM estacion WHERE id = :id`,
        { id: estacionId }
      );
      if ((exists.rows ?? []).length === 0) {
        return { status: 404, payload: { message: 'Estación no encontrada.' } };
      }

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

      const accesoRow = await connection.execute(
        `SELECT id, nombre, estacion_id, created_at FROM acceso WHERE id = :id`,
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
        status: 201,
        payload: {
          acceso: normalizeRow(accesoRow.rows?.[0] ?? null),
          guardias: normalizeRows(guardiasRows.rows ?? [])
        }
      };
    });

    return res.status(out.status).json(out.payload);
  } catch (error) {
    const out = toHttpError(error);
    return res.status(out.status).json({ message: out.message });
  }
};

const remove = async (req, res) => {
  const id = Number.parseInt(req.params.id, 10);
  if (!Number.isFinite(id)) return res.status(400).json({ message: 'Invalid id' });

  try {
    const existing = await queryOne(
      `SELECT id FROM acceso WHERE id = :id`,
      { id }
    );
    if (!existing) return res.status(404).json({ message: 'Not found' });

    await withTransaction(async (connection) => {
      await connection.execute(`DELETE FROM acceso WHERE id = :id`, { id });
    });

    return res.status(200).json({ message: 'OK' });
  } catch (error) {
    const out = toHttpError(error);
    return res.status(out.status).json({ message: out.message });
  }
};

const meta = async (req, res) => {
  try {
    const turnosGuardia = await query(
      `SELECT codigo, nombre, ui_class, orden
       FROM cat_turno_guardia
       WHERE activo = 1
       ORDER BY orden`
    );
    return res.status(200).json({ turnos_guardia: turnosGuardia });
  } catch (error) {
    const out = toHttpError(error);
    return res.status(out.status).json({ message: out.message });
  }
};

module.exports = { list, getById, create, remove, meta };
