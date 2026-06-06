const { query, queryOne, execute, toHttpError } = require('../db/db');

const list = async (req, res) => {
  try {
    const rows = await query(
      `SELECT
         o.id,
         o.nombre,
         o.apellido,
         o.dpi,
         o.estacion_id,
         e.nombre AS estacion_nombre,
         o.pc_nombre,
         o.created_at
       FROM operador o
       JOIN estacion e ON e.id = o.estacion_id
       ORDER BY o.id`
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
    const row = await queryOne(
      `SELECT id, nombre, apellido, dpi, estacion_id, pc_nombre, created_at
       FROM operador
       WHERE id = :id`,
      { id }
    );
    if (!row) return res.status(404).json({ message: 'Not found' });
    return res.status(200).json(row);
  } catch (error) {
    const out = toHttpError(error);
    return res.status(out.status).json({ message: out.message });
  }
};

const create = async (req, res) => {
  const { nombre, apellido, dpi, estacion_id, pc_nombre } = req.body ?? {};
  const estacionId = Number.parseInt(estacion_id, 10);
  if (!nombre || !apellido || !dpi) return res.status(400).json({ message: 'nombre, apellido, dpi are required' });
  if (!Number.isFinite(estacionId) || estacionId <= 0) return res.status(400).json({ message: 'estacion_id is required' });

  try {
    await execute(
      `INSERT INTO operador (nombre, apellido, dpi, estacion_id, pc_nombre)
       VALUES (:nombre, :apellido, :dpi, :estacion_id, :pc_nombre)`,
      { nombre, apellido, dpi, estacion_id: estacionId, pc_nombre: pc_nombre ?? null }
    );
    const row = await queryOne(
      `SELECT id, nombre, apellido, dpi, estacion_id, pc_nombre, created_at
       FROM operador
       WHERE dpi = :dpi`,
      { dpi }
    );
    return res.status(201).json(row);
  } catch (error) {
    const out = toHttpError(error);
    return res.status(out.status).json({ message: out.message });
  }
};

const update = async (req, res) => {
  const id = Number.parseInt(req.params.id, 10);
  const { nombre, apellido, dpi, pc_nombre } = req.body ?? {};
  if (!Number.isFinite(id)) return res.status(400).json({ message: 'Invalid id' });

  try {
    const existing = await queryOne(
      `SELECT id FROM operador WHERE id = :id`,
      { id }
    );
    if (!existing) return res.status(404).json({ message: 'Not found' });

    await execute(
      `UPDATE operador
       SET nombre = COALESCE(:nombre, nombre),
           apellido = COALESCE(:apellido, apellido),
           dpi = COALESCE(:dpi, dpi),
           pc_nombre = COALESCE(:pc_nombre, pc_nombre)
       WHERE id = :id`,
      { id, nombre: nombre ?? null, apellido: apellido ?? null, dpi: dpi ?? null, pc_nombre: pc_nombre ?? null }
    );

    const row = await queryOne(
      `SELECT id, nombre, apellido, dpi, estacion_id, pc_nombre, created_at
       FROM operador
       WHERE id = :id`,
      { id }
    );
    return res.status(200).json(row);
  } catch (error) {
    const out = toHttpError(error);
    return res.status(out.status).json({ message: out.message });
  }
};

module.exports = { list, getById, create, update };
