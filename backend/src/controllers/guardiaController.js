const { execute, query, queryOne, toHttpError } = require('../db/db');

const list = async (req, res) => {
  try {
    const rows = await query(
      `SELECT
         g.id,
         g.nombre,
         g.apellido,
         g.dpi,
         g.turno,
         g.acceso_id,
         a.nombre AS acceso_nombre,
         a.estacion_id,
         e.nombre AS estacion_nombre
       FROM guardia g
       JOIN acceso a ON a.id = g.acceso_id
       JOIN estacion e ON e.id = a.estacion_id
       ORDER BY g.id`
    );
    return res.status(200).json(rows);
  } catch (error) {
    const out = toHttpError(error);
    return res.status(out.status).json({ message: out.message });
  }
};

const create = async (req, res) => {
  const accesoId = Number.parseInt(req.params.accesoId, 10);
  const { nombre, apellido, dpi, turno } = req.body ?? {};
  if (!Number.isFinite(accesoId)) return res.status(400).json({ message: 'Invalid acceso id' });
  if (!nombre || !apellido || !dpi || !turno) {
    return res.status(400).json({ message: 'nombre, apellido, dpi, turno are required' });
  }

  try {
    await execute(
      `INSERT INTO guardia (nombre, apellido, dpi, acceso_id, turno)
       VALUES (:nombre, :apellido, :dpi, :acceso_id, :turno)`,
      { nombre, apellido, dpi, acceso_id: accesoId, turno }
    );

    const row = await queryOne(
      `SELECT id, nombre, apellido, dpi, acceso_id, turno, created_at
       FROM guardia
       WHERE dpi = :dpi`,
      { dpi }
    );

    return res.status(201).json(row);
  } catch (error) {
    const out = toHttpError(error);
    return res.status(out.status).json({ message: out.message });
  }
};

module.exports = { list, create };
