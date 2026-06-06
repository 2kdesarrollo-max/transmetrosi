const { query, execute, queryOne, toHttpError } = require('../db/db');

const list = async (req, res) => {
  try {
    const rows = await query(
      `SELECT
         a.id,
         a.tipo,
         a.mensaje,
         a.bus_id,
         b.numero_unidad AS bus_numero_unidad,
         a.estacion_id,
         e.nombre AS estacion_nombre,
         a.leida,
         a.created_at
       FROM alerta a
       LEFT JOIN bus b ON b.id = a.bus_id
       LEFT JOIN estacion e ON e.id = a.estacion_id
       ORDER BY a.id DESC`
    );
    return res.status(200).json(rows);
  } catch (error) {
    const out = toHttpError(error);
    return res.status(out.status).json({ message: out.message });
  }
};

const markRead = async (req, res) => {
  const id = Number.parseInt(req.params.id, 10);
  if (!Number.isFinite(id)) return res.status(400).json({ message: 'Invalid id' });

  try {
    await execute(
      `UPDATE alerta SET leida = 1 WHERE id = :id`,
      { id }
    );
    const row = await queryOne(
      `SELECT id, tipo, mensaje, bus_id, estacion_id, leida, created_at
       FROM alerta
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

module.exports = { list, markRead };
