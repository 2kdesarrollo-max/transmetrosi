const { query, queryOne, execute, toHttpError, getConfigText } = require('../db/db');

const list = async (req, res) => {
  try {
    const rows = await query(
      `SELECT
         r.id,
         r.bus_objetivo_id,
         bo.numero_unidad AS bus_objetivo_numero_unidad,
         r.linea_id,
         l.nombre AS linea_nombre,
         r.estacion_id,
         e.nombre AS estacion_nombre,
         r.estado,
         r.created_at,
         r.updated_at
       FROM orden_refuerzo r
       LEFT JOIN bus bo ON bo.id = r.bus_objetivo_id
       LEFT JOIN linea l ON l.id = r.linea_id
       LEFT JOIN estacion e ON e.id = r.estacion_id
       ORDER BY r.id DESC`
    );
    return res.status(200).json(rows);
  } catch (error) {
    const out = toHttpError(error);
    return res.status(out.status).json({ message: out.message });
  }
};

const create = async (req, res) => {
  const { bus_objetivo_id, linea_id, estacion_id } = req.body ?? {};
  const busObjetivoId = bus_objetivo_id === undefined || bus_objetivo_id === null ? null : Number.parseInt(bus_objetivo_id, 10);
  const lineaId = linea_id === undefined || linea_id === null ? null : Number.parseInt(linea_id, 10);
  const estacionId = estacion_id === undefined || estacion_id === null ? null : Number.parseInt(estacion_id, 10);

  if (busObjetivoId !== null && (!Number.isFinite(busObjetivoId) || busObjetivoId <= 0)) return res.status(400).json({ message: 'Invalid bus_objetivo_id' });
  if (lineaId !== null && (!Number.isFinite(lineaId) || lineaId <= 0)) return res.status(400).json({ message: 'Invalid linea_id' });
  if (estacionId !== null && (!Number.isFinite(estacionId) || estacionId <= 0)) return res.status(400).json({ message: 'Invalid estacion_id' });

  try {
    const initialEstado =
      (await getConfigText('REFUERZO_ESTADO_INICIAL')) ??
      (await (async () => {
        const row = await queryOne(
          `SELECT codigo
           FROM cat_estado_refuerzo
           WHERE activo = 1
           ORDER BY orden
           FETCH FIRST 1 ROWS ONLY`
        );
        return row?.codigo ?? null;
      })());

    if (!initialEstado) return res.status(409).json({ message: 'No hay estado inicial configurado para refuerzos.' });

    if (busObjetivoId !== null) {
      const existing = await queryOne(
        `SELECT id, bus_objetivo_id, linea_id, estacion_id, estado, created_at, updated_at
         FROM orden_refuerzo r
         WHERE r.bus_objetivo_id = :bus_objetivo_id
           AND (r.estacion_id = :estacion_id OR (:estacion_id IS NULL AND r.estacion_id IS NULL))
           AND (
             r.estado = :estado_inicial
             OR EXISTS (
               SELECT 1
               FROM cat_transicion_refuerzo t
               WHERE t.desde_estado = r.estado
             )
           )
         ORDER BY id DESC
         FETCH FIRST 1 ROWS ONLY`,
        { bus_objetivo_id: busObjetivoId, estado_inicial: initialEstado, estacion_id: estacionId }
      );
      if (existing) return res.status(200).json(existing);
    }

    await execute(
      `INSERT INTO orden_refuerzo (bus_objetivo_id, linea_id, estacion_id, estado)
       VALUES (:bus_objetivo_id, :linea_id, :estacion_id, :estado)`,
      { bus_objetivo_id: busObjetivoId, linea_id: lineaId, estacion_id: estacionId, estado: initialEstado }
    );

    const row = await queryOne(
      `SELECT id, bus_objetivo_id, linea_id, estacion_id, estado, created_at, updated_at
       FROM orden_refuerzo
       ORDER BY id DESC`,
      {}
    );

    return res.status(201).json(row);
  } catch (error) {
    const out = toHttpError(error);
    return res.status(out.status).json({ message: out.message });
  }
};

const setEstado = async (req, res) => {
  const id = Number.parseInt(req.params.id, 10);
  const { estado } = req.body ?? {};
  if (!Number.isFinite(id)) return res.status(400).json({ message: 'Invalid id' });
  if (!estado) return res.status(400).json({ message: 'estado is required' });

  try {
    const estadoOk = await queryOne(
      `SELECT 1 AS ok
       FROM cat_estado_refuerzo
       WHERE codigo = :codigo AND activo = 1`,
      { codigo: estado }
    );
    if (!estadoOk) return res.status(400).json({ message: 'Estado inválido' });

    const current = await queryOne(
      `SELECT estado FROM orden_refuerzo WHERE id = :id`,
      { id }
    );
    if (!current) return res.status(404).json({ message: 'Not found' });

    const from = current.estado;
    if (String(from) !== String(estado)) {
      const transitionOk = await queryOne(
        `SELECT 1 AS ok
         FROM cat_transicion_refuerzo
         WHERE desde_estado = :desde AND hacia_estado = :hacia`,
        { desde: from, hacia: estado }
      );
      if (!transitionOk) return res.status(409).json({ message: 'Transición de estado no permitida' });
    }

    await execute(
      `UPDATE orden_refuerzo
       SET estado = :estado, updated_at = SYSTIMESTAMP
       WHERE id = :id`,
      { estado, id }
    );

    const row = await queryOne(
      `SELECT id, bus_objetivo_id, linea_id, estacion_id, estado, created_at, updated_at
       FROM orden_refuerzo
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

const meta = async (req, res) => {
  try {
    const [estados, transiciones, initialEstado] = await Promise.all([
      query(
        `SELECT codigo, nombre, ui_class, orden
         FROM cat_estado_refuerzo
         WHERE activo = 1
         ORDER BY orden`
      ),
      query(
        `SELECT desde_estado, hacia_estado
         FROM cat_transicion_refuerzo
         ORDER BY desde_estado, hacia_estado`
      ),
      getConfigText('REFUERZO_ESTADO_INICIAL')
    ]);

    return res.status(200).json({
      estados,
      transiciones,
      config: { refuerzo_estado_inicial: initialEstado }
    });
  } catch (error) {
    const out = toHttpError(error);
    return res.status(out.status).json({ message: out.message });
  }
};

module.exports = { list, create, setEstado, meta };
