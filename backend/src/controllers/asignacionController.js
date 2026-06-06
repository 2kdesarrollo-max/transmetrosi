const { query, queryOne, withTransaction, toHttpError } = require('../db/db');

const list = async (req, res) => {
  const activo = req.query?.activo === undefined ? null : Number.parseInt(req.query.activo, 10);
  if (req.query?.activo !== undefined && (!Number.isFinite(activo) || ![0, 1].includes(activo))) {
    return res.status(400).json({ message: 'Invalid activo' });
  }

  try {
    const rows = await query(
      `SELECT
         apb.id,
         apb.piloto_id,
         (p.nombre || ' ' || p.apellido) AS piloto_nombre,
         apb.bus_id,
         b.numero_unidad AS bus_numero_unidad,
         apb.activo,
         apb.fecha_inicio,
         apb.fecha_fin,
         apb.created_at
       FROM asignacion_piloto_bus apb
       JOIN piloto p ON p.id = apb.piloto_id
       JOIN bus b ON b.id = apb.bus_id
       WHERE (:activo IS NULL OR apb.activo = :activo)
       ORDER BY apb.id DESC`,
      { activo }
    );
    return res.status(200).json(rows);
  } catch (error) {
    const out = toHttpError(error);
    return res.status(out.status).json({ message: out.message });
  }
};

const create = async (req, res) => {
  const { piloto_id, bus_id } = req.body ?? {};
  const pilotoId = Number.parseInt(piloto_id, 10);
  const busId = Number.parseInt(bus_id, 10);
  if (!Number.isFinite(pilotoId) || pilotoId <= 0) return res.status(400).json({ message: 'piloto_id is required' });
  if (!Number.isFinite(busId) || busId <= 0) return res.status(400).json({ message: 'bus_id is required' });

  try {
    const out = await withTransaction(async (connection) => {
      const pilotoExists = await connection.execute(`SELECT id FROM piloto WHERE id = :id`, { id: pilotoId });
      if ((pilotoExists.rows ?? []).length === 0) return { status: 404, payload: { message: 'Piloto no existe' } };

      const busExists = await connection.execute(`SELECT id FROM bus WHERE id = :id`, { id: busId });
      if ((busExists.rows ?? []).length === 0) return { status: 404, payload: { message: 'Bus no existe' } };

      await connection.execute(
        `UPDATE asignacion_piloto_bus
         SET activo = 0, fecha_fin = SYSTIMESTAMP
         WHERE bus_id = :bus_id AND activo = 1`,
        { bus_id: busId }
      );
      await connection.execute(
        `UPDATE asignacion_piloto_bus
         SET activo = 0, fecha_fin = SYSTIMESTAMP
         WHERE piloto_id = :piloto_id AND activo = 1`,
        { piloto_id: pilotoId }
      );
      await connection.execute(
        `INSERT INTO asignacion_piloto_bus (piloto_id, bus_id, activo)
         VALUES (:piloto_id, :bus_id, 1)`,
        { piloto_id: pilotoId, bus_id: busId }
      );

      const row = await queryOne(
        `SELECT
           apb.id,
           apb.piloto_id,
           (p.nombre || ' ' || p.apellido) AS piloto_nombre,
           apb.bus_id,
           b.numero_unidad AS bus_numero_unidad,
           apb.activo,
           apb.fecha_inicio,
           apb.fecha_fin,
           apb.created_at
         FROM asignacion_piloto_bus apb
         JOIN piloto p ON p.id = apb.piloto_id
         JOIN bus b ON b.id = apb.bus_id
         WHERE apb.bus_id = :bus_id AND apb.activo = 1`,
        { bus_id: busId }
      );
      return { status: 201, payload: row };
    });

    return res.status(out.status).json(out.payload);
  } catch (error) {
    const out = toHttpError(error);
    return res.status(out.status).json({ message: out.message });
  }
};

const finish = async (req, res) => {
  const id = Number.parseInt(req.params.id, 10);
  if (!Number.isFinite(id)) return res.status(400).json({ message: 'Invalid id' });

  try {
    const existing = await queryOne(
      `SELECT id, activo FROM asignacion_piloto_bus WHERE id = :id`,
      { id }
    );
    if (!existing) return res.status(404).json({ message: 'Not found' });
    if (existing.activo !== 1) return res.status(409).json({ message: 'La asignación ya está finalizada' });

    await withTransaction(async (connection) => {
      await connection.execute(
        `UPDATE asignacion_piloto_bus
         SET activo = 0, fecha_fin = SYSTIMESTAMP
         WHERE id = :id`,
        { id }
      );
    });

    const row = await queryOne(
      `SELECT id, piloto_id, bus_id, activo, fecha_inicio, fecha_fin, created_at
       FROM asignacion_piloto_bus
       WHERE id = :id`,
      { id }
    );
    return res.status(200).json(row);
  } catch (error) {
    const out = toHttpError(error);
    return res.status(out.status).json({ message: out.message });
  }
};

module.exports = { list, create, finish };
