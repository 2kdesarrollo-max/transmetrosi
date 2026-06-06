const { query, queryOne, execute, toHttpError } = require('../db/db');

const list = async (req, res) => {
  try {
    const rows = await query(
      `SELECT id, nombre, direccion, telefono, created_at
       FROM municipalidad
       ORDER BY id`
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
      `SELECT id, nombre, direccion, telefono, created_at
       FROM municipalidad
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
  const { nombre, direccion, telefono } = req.body ?? {};
  if (!nombre) return res.status(400).json({ message: 'nombre is required' });

  try {
    await execute(
      `INSERT INTO municipalidad (nombre, direccion, telefono)
       VALUES (:nombre, :direccion, :telefono)`,
      { nombre, direccion: direccion ?? null, telefono: telefono ?? null }
    );
    const row = await queryOne(
      `SELECT id, nombre, direccion, telefono, created_at
       FROM municipalidad
       WHERE nombre = :nombre`,
      { nombre }
    );
    return res.status(201).json(row);
  } catch (error) {
    const out = toHttpError(error);
    return res.status(out.status).json({ message: out.message });
  }
};

module.exports = { list, getById, create };
