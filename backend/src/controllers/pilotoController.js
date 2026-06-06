const { query, queryOne, execute, toHttpError } = require('../db/db');

const isOracleError = (error, errorNum) => {
  return Number(error?.errorNum) === Number(errorNum);
};

const list = async (req, res) => {
  try {
    let rows;
    try {
      rows = await query(
        `SELECT
           p.id,
           p.nombre,
           p.apellido,
           p.dpi,
           p.licencia,
           p.direccion_residencia,
           p.telefono,
           b.id AS bus_id,
           b.numero_unidad AS bus_numero_unidad
         FROM piloto p
         LEFT JOIN asignacion_piloto_bus apb ON apb.piloto_id = p.id AND apb.activo = 1
         LEFT JOIN bus b ON b.id = apb.bus_id
         ORDER BY p.id`
      );
    } catch (error) {
      if (isOracleError(error, 942)) {
        rows = await query(
          `SELECT
             p.id,
             p.nombre,
             p.apellido,
             p.dpi,
             p.licencia,
             p.direccion_residencia,
             p.telefono,
             b.id AS bus_id,
             b.numero_unidad AS bus_numero_unidad
           FROM piloto p
           LEFT JOIN bus b ON b.id = p.bus_id
           ORDER BY p.id`
        );
      } else {
        throw error;
      }
    }
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
    let piloto;
    try {
      piloto = await queryOne(
        `SELECT
           p.id,
           p.nombre,
           p.apellido,
           p.dpi,
           p.licencia,
           p.direccion_residencia,
           p.telefono,
           b.id AS bus_id,
           b.numero_unidad AS bus_numero_unidad
         FROM piloto p
         LEFT JOIN asignacion_piloto_bus apb ON apb.piloto_id = p.id AND apb.activo = 1
         LEFT JOIN bus b ON b.id = apb.bus_id
         WHERE p.id = :id`,
        { id }
      );
    } catch (error) {
      if (isOracleError(error, 942)) {
        piloto = await queryOne(
          `SELECT
             p.id,
             p.nombre,
             p.apellido,
             p.dpi,
             p.licencia,
             p.direccion_residencia,
             p.telefono,
             b.id AS bus_id,
             b.numero_unidad AS bus_numero_unidad
           FROM piloto p
           LEFT JOIN bus b ON b.id = p.bus_id
           WHERE p.id = :id`,
          { id }
        );
      } else {
        throw error;
      }
    }
    if (!piloto) return res.status(404).json({ message: 'Not found' });

    let historial;
    try {
      historial = await query(
        `SELECT id, piloto_id, nivel_estudio, institucion, anio_graduacion
         FROM historial_educativo
         WHERE piloto_id = :id
         ORDER BY id`,
        { id }
      );
    } catch (error) {
      if (isOracleError(error, 942)) {
        historial = await query(
          `SELECT id, piloto_id, nivel_estudio, institucion, anio_graduacion
           FROM historial_educativo_piloto
           WHERE piloto_id = :id
           ORDER BY id`,
          { id }
        );
      } else {
        throw error;
      }
    }

    return res.status(200).json({ ...piloto, historial });
  } catch (error) {
    const out = toHttpError(error);
    return res.status(out.status).json({ message: out.message });
  }
};

const create = async (req, res) => {
  const { nombre, apellido, dpi, licencia, direccion_residencia, telefono, bus_id } = req.body ?? {};
  const busId = bus_id === undefined || bus_id === null ? null : Number.parseInt(bus_id, 10);
  if (!nombre || !apellido || !dpi || !licencia) {
    return res.status(400).json({ message: 'nombre, apellido, dpi, licencia are required' });
  }
  if (busId !== null && (!Number.isFinite(busId) || busId <= 0)) return res.status(400).json({ message: 'Invalid bus_id' });

  try {
    await execute(
      `INSERT INTO piloto (nombre, apellido, dpi, licencia, direccion_residencia, telefono)
       VALUES (:nombre, :apellido, :dpi, :licencia, :direccion_residencia, :telefono)`,
      {
        nombre,
        apellido,
        dpi,
        licencia,
        direccion_residencia: direccion_residencia ?? null,
        telefono: telefono ?? null
      }
    );

    if (busId !== null) {
      try {
        await execute(
          `UPDATE asignacion_piloto_bus
           SET activo = 0, fecha_fin = SYSTIMESTAMP
           WHERE bus_id = :bus_id AND activo = 1`,
          { bus_id: busId }
        );
        await execute(
          `UPDATE asignacion_piloto_bus
           SET activo = 0, fecha_fin = SYSTIMESTAMP
           WHERE piloto_id = (SELECT id FROM piloto WHERE dpi = :dpi) AND activo = 1`,
          { dpi }
        );
        await execute(
          `INSERT INTO asignacion_piloto_bus (piloto_id, bus_id, activo)
           VALUES ((SELECT id FROM piloto WHERE dpi = :dpi), :bus_id, 1)`,
          { dpi, bus_id: busId }
        );
      } catch (error) {
        if (isOracleError(error, 942)) {
          await execute(
            `UPDATE piloto SET bus_id = NULL WHERE bus_id = :bus_id AND dpi != :dpi`,
            { bus_id: busId, dpi }
          );
          await execute(
            `UPDATE piloto SET bus_id = :bus_id WHERE dpi = :dpi`,
            { bus_id: busId, dpi }
          );
        } else {
          throw error;
        }
      }
    }

    let row;
    try {
      row = await queryOne(
        `SELECT
           p.id,
           p.nombre,
           p.apellido,
           p.dpi,
           p.licencia,
           p.direccion_residencia,
           p.telefono,
           b.id AS bus_id,
           b.numero_unidad AS bus_numero_unidad,
           p.created_at
         FROM piloto p
         LEFT JOIN asignacion_piloto_bus apb ON apb.piloto_id = p.id AND apb.activo = 1
         LEFT JOIN bus b ON b.id = apb.bus_id
         WHERE p.dpi = :dpi`,
        { dpi }
      );
    } catch (error) {
      if (isOracleError(error, 942)) {
        row = await queryOne(
          `SELECT
             p.id,
             p.nombre,
             p.apellido,
             p.dpi,
             p.licencia,
             p.direccion_residencia,
             p.telefono,
             b.id AS bus_id,
             b.numero_unidad AS bus_numero_unidad,
             p.created_at
           FROM piloto p
           LEFT JOIN bus b ON b.id = p.bus_id
           WHERE p.dpi = :dpi`,
          { dpi }
        );
      } else {
        throw error;
      }
    }

    return res.status(201).json(row);
  } catch (error) {
    const out = toHttpError(error);
    return res.status(out.status).json({ message: out.message });
  }
};

const addHistorial = async (req, res) => {
  const pilotoId = Number.parseInt(req.params.id, 10);
  const { nivel_estudio, institucion, anio_graduacion } = req.body ?? {};
  const anio = anio_graduacion === undefined || anio_graduacion === null ? null : Number.parseInt(anio_graduacion, 10);

  if (!Number.isFinite(pilotoId)) return res.status(400).json({ message: 'Invalid piloto id' });

  try {
    let row;
    try {
      await execute(
        `INSERT INTO historial_educativo (piloto_id, nivel_estudio, institucion, anio_graduacion)
         VALUES (:piloto_id, :nivel_estudio, :institucion, :anio_graduacion)`,
        { piloto_id: pilotoId, nivel_estudio: nivel_estudio ?? null, institucion: institucion ?? null, anio_graduacion: anio }
      );
      row = await queryOne(
        `SELECT id, piloto_id, nivel_estudio, institucion, anio_graduacion
         FROM historial_educativo
         WHERE piloto_id = :piloto_id
         ORDER BY id DESC`,
        { piloto_id: pilotoId }
      );
    } catch (error) {
      if (isOracleError(error, 942)) {
        await execute(
          `INSERT INTO historial_educativo_piloto (piloto_id, nivel_estudio, institucion, anio_graduacion)
           VALUES (:piloto_id, :nivel_estudio, :institucion, :anio_graduacion)`,
          { piloto_id: pilotoId, nivel_estudio: nivel_estudio ?? null, institucion: institucion ?? null, anio_graduacion: anio }
        );
        row = await queryOne(
          `SELECT id, piloto_id, nivel_estudio, institucion, anio_graduacion
           FROM historial_educativo_piloto
           WHERE piloto_id = :piloto_id
           ORDER BY id DESC`,
          { piloto_id: pilotoId }
        );
      } else {
        throw error;
      }
    }

    return res.status(201).json(row);
  } catch (error) {
    const out = toHttpError(error);
    return res.status(out.status).json({ message: out.message });
  }
};

module.exports = { list, getById, create, addHistorial };
