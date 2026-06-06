const oracledb = require('oracledb');
const { query, queryOne, execute, toHttpError, withTransaction, normalizeRows } = require('../db/db');

const list = async (req, res) => {
  try {
    const rows = await query(
      `SELECT id, nombre, ubicacion, capacidad, created_at
       FROM parqueo
       ORDER BY id`
    );
    return res.status(200).json(rows);
  } catch (error) {
    const out = toHttpError(error);
    return res.status(out.status).json({ message: out.message });
  }
};

const listAllowedLineas = async (req, res) => {
  const parqueoId = Number.parseInt(req.params.id, 10);
  if (!Number.isFinite(parqueoId) || parqueoId <= 0) return res.status(400).json({ message: 'Invalid id' });

  try {
    const result = await withTransaction(async (connection) => {
      const parqueo = await connection.execute(
        `SELECT id FROM parqueo WHERE id = :id`,
        { id: parqueoId },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      if ((parqueo.rows ?? []).length === 0) return { status: 404, payload: { message: 'Parqueo no encontrado' } };

      try {
        const rows = await connection.execute(
          `SELECT linea_id
           FROM parqueo_linea
           WHERE parqueo_id = :parqueo_id
           ORDER BY linea_id`,
          { parqueo_id: parqueoId },
          { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        const normalized = normalizeRows(rows.rows ?? []);
        return { status: 200, payload: { parqueo_id: parqueoId, lineas: (normalized || []).map((r) => r.linea_id) } };
      } catch (error) {
        if (Number(error?.errorNum) === 942) {
          return { status: 200, payload: { parqueo_id: parqueoId, lineas: [] } };
        }
        throw error;
      }
    });

    return res.status(result.status).json(result.payload);
  } catch (error) {
    const out = toHttpError(error);
    return res.status(out.status).json({ message: out.message });
  }
};

const setAllowedLineas = async (req, res) => {
  const parqueoId = Number.parseInt(req.params.id, 10);
  const input = req.body ?? {};
  const lineas = Array.isArray(input.lineas) ? input.lineas : [];
  const lineaIds = [...new Set(lineas.map((v) => Number.parseInt(v, 10)).filter((n) => Number.isFinite(n) && n > 0))];
  if (!Number.isFinite(parqueoId) || parqueoId <= 0) return res.status(400).json({ message: 'Invalid id' });

  try {
    const result = await withTransaction(async (connection) => {
      const parqueo = await connection.execute(
        `SELECT id FROM parqueo WHERE id = :id`,
        { id: parqueoId },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      if ((parqueo.rows ?? []).length === 0) return { status: 404, payload: { message: 'Parqueo no encontrado' } };

      try {
        if (lineaIds.length > 0) {
          const binds = {};
          const placeholders = lineaIds.map((id, idx) => {
            const k = `l${idx}`;
            binds[k] = id;
            return `:${k}`;
          });
          const existing = await connection.execute(
            `SELECT id FROM linea WHERE id IN (${placeholders.join(', ')})`,
            binds,
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
          );
          const existingIds = new Set((existing.rows ?? []).map((r) => Number(r.ID)));
          const missing = lineaIds.filter((id) => !existingIds.has(Number(id)));
          if (missing.length > 0) {
            return { status: 400, payload: { message: `Línea no existe: ${missing[0]}` } };
          }
        }

        await connection.execute(
          `DELETE FROM parqueo_linea WHERE parqueo_id = :parqueo_id`,
          { parqueo_id: parqueoId }
        );

        for (const lineaId of lineaIds) {
          await connection.execute(
            `INSERT INTO parqueo_linea (parqueo_id, linea_id)
             VALUES (:parqueo_id, :linea_id)`,
            { parqueo_id: parqueoId, linea_id: lineaId }
          );
        }

        return { status: 200, payload: { parqueo_id: parqueoId, lineas: lineaIds } };
      } catch (error) {
        if (Number(error?.errorNum) === 942) {
          return { status: 501, payload: { message: 'Falta la tabla parqueo_linea en la base de datos. Aplica el schema actualizado.' } };
        }
        throw error;
      }
    });

    return res.status(result.status).json(result.payload);
  } catch (error) {
    const out = toHttpError(error);
    return res.status(out.status).json({ message: out.message });
  }
};

const create = async (req, res) => {
  const { nombre, ubicacion, capacidad } = req.body ?? {};
  const cap = Number.parseInt(capacidad, 10);
  if (!nombre) return res.status(400).json({ message: 'nombre is required' });
  if (!Number.isFinite(cap) || cap <= 0) return res.status(400).json({ message: 'capacidad is required' });

  try {
    await execute(
      `INSERT INTO parqueo (nombre, ubicacion, capacidad)
       VALUES (:nombre, :ubicacion, :capacidad)`,
      { nombre, ubicacion: ubicacion ?? null, capacidad: cap }
    );

    const row = await queryOne(
      `SELECT id, nombre, ubicacion, capacidad, created_at
       FROM parqueo
       WHERE nombre = :nombre`,
      { nombre }
    );

    return res.status(201).json(row);
  } catch (error) {
    const out = toHttpError(error);
    return res.status(out.status).json({ message: out.message });
  }
};

module.exports = { list, listAllowedLineas, setAllowedLineas, create };
