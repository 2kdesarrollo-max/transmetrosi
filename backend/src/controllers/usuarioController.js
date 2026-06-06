const bcrypt = require('bcryptjs');
const { query, queryOne, execute, toHttpError } = require('../db/db');

const isOracleError = (error, errorNum) => {
  return Number(error?.errorNum) === Number(errorNum);
};

const list = async (req, res) => {
  try {
    let rows;
    try {
      rows = await query(
        `SELECT id, username, rol_id, rol, nombre, estacion_id, activo, created_at
         FROM usuario
         ORDER BY id`
      );
    } catch (error) {
      if (isOracleError(error, 904)) {
        rows = await query(
          `SELECT id, username, rol, nombre, activo, created_at
           FROM usuario
           ORDER BY id`
        );
      } else {
        throw error;
      }
    }
    return res.status(200).json(rows || []);
  } catch (error) {
    const out = toHttpError(error);
    return res.status(out.status).json({ message: out.message });
  }
};

const create = async (req, res) => {
  const { username, password, rol, rol_id, nombre, estacion_id, activo } = req.body ?? {};
  const rolId = rol_id === undefined || rol_id === null ? null : Number.parseInt(rol_id, 10);
  const estacionId = estacion_id === undefined || estacion_id === null ? null : Number.parseInt(estacion_id, 10);
  const activoValue = activo === undefined || activo === null ? 1 : Number.parseInt(activo, 10);

  if (!username || !password || (!rol && rolId === null)) return res.status(400).json({ message: 'username, password, rol/rol_id are required' });
  if (rolId !== null && (!Number.isFinite(rolId) || rolId <= 0)) return res.status(400).json({ message: 'Invalid rol_id' });
  if (estacionId !== null && (!Number.isFinite(estacionId) || estacionId <= 0)) return res.status(400).json({ message: 'Invalid estacion_id' });
  if (!Number.isFinite(activoValue) || ![0, 1].includes(activoValue)) return res.status(400).json({ message: 'Invalid activo' });

  try {
    let rolNombre = rol ?? null;
    if (rolId !== null) {
      const rolRow = await queryOne(
        `SELECT id, nombre FROM rol WHERE id = :id AND activo = 1`,
        { id: rolId }
      );
      if (!rolRow) return res.status(400).json({ message: 'Rol no existe' });
      rolNombre = rolRow.nombre;
    }

    const passwordHash = await bcrypt.hash(String(password), 10);
    try {
      await execute(
        `INSERT INTO usuario (username, password_hash, rol_id, rol, nombre, estacion_id, activo)
         VALUES (:username, :password_hash, :rol_id, :rol, :nombre, :estacion_id, :activo)`,
        {
          username,
          password_hash: passwordHash,
          rol_id: rolId,
          rol: rolNombre,
          nombre: nombre ?? null,
          estacion_id: estacionId,
          activo: activoValue
        }
      );
    } catch (error) {
      if (isOracleError(error, 904)) {
        await execute(
          `INSERT INTO usuario (username, password_hash, rol, nombre, activo)
           VALUES (:username, :password_hash, :rol, :nombre, :activo)`,
          {
            username,
            password_hash: passwordHash,
            rol: rolNombre,
            nombre: nombre ?? null,
            activo: activoValue
          }
        );
      } else {
        throw error;
      }
    }

    let row;
    try {
      row = await queryOne(
        `SELECT id, username, rol_id, rol, nombre, estacion_id, activo, created_at
         FROM usuario
         WHERE username = :username`,
        { username }
      );
    } catch (error) {
      if (isOracleError(error, 904)) {
        row = await queryOne(
          `SELECT id, username, rol, nombre, activo, created_at
           FROM usuario
           WHERE username = :username`,
          { username }
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

const update = async (req, res) => {
  const id = Number.parseInt(req.params.id, 10);
  const { rol, rol_id, nombre, estacion_id, activo } = req.body ?? {};
  const rolId = rol_id === undefined || rol_id === null ? null : Number.parseInt(rol_id, 10);
  const estacionId = estacion_id === undefined || estacion_id === null ? null : Number.parseInt(estacion_id, 10);
  const activoValue = activo === undefined || activo === null ? null : Number.parseInt(activo, 10);

  if (!Number.isFinite(id)) return res.status(400).json({ message: 'Invalid id' });
  if (rolId !== null && (!Number.isFinite(rolId) || rolId <= 0)) return res.status(400).json({ message: 'Invalid rol_id' });
  if (estacionId !== null && (!Number.isFinite(estacionId) || estacionId <= 0)) return res.status(400).json({ message: 'Invalid estacion_id' });
  if (activoValue !== null && (!Number.isFinite(activoValue) || ![0, 1].includes(activoValue))) {
    return res.status(400).json({ message: 'Invalid activo' });
  }

  try {
    const existing = await queryOne(
      `SELECT id FROM usuario WHERE id = :id`,
      { id }
    );
    if (!existing) return res.status(404).json({ message: 'Not found' });

    let rolNombre = rol ?? null;
    let rolIdValue = rolId;
    if (rolId !== null) {
      const rolRow = await queryOne(
        `SELECT id, nombre FROM rol WHERE id = :id AND activo = 1`,
        { id: rolId }
      );
      if (!rolRow) return res.status(400).json({ message: 'Rol no existe' });
      rolNombre = rolRow.nombre;
      rolIdValue = rolRow.id;
    }

    try {
      await execute(
        `UPDATE usuario
         SET rol_id = CASE WHEN :rol_set = 1 THEN :rol_id ELSE rol_id END,
             rol = COALESCE(:rol, rol),
             nombre = COALESCE(:nombre, nombre),
             estacion_id = CASE WHEN :estacion_set = 1 THEN :estacion_id ELSE estacion_id END,
             activo = COALESCE(:activo, activo)
         WHERE id = :id`,
        {
          id,
          rol_set: rol_id === undefined ? 0 : 1,
          rol_id: rolIdValue,
          rol: rolNombre,
          nombre: nombre ?? null,
          estacion_set: estacion_id === undefined ? 0 : 1,
          estacion_id: estacionId,
          activo: activoValue
        }
      );
    } catch (error) {
      if (isOracleError(error, 904)) {
        await execute(
          `UPDATE usuario
           SET rol = COALESCE(:rol, rol),
               nombre = COALESCE(:nombre, nombre),
               activo = COALESCE(:activo, activo)
           WHERE id = :id`,
          {
            id,
            rol: rolNombre,
            nombre: nombre ?? null,
            activo: activoValue
          }
        );
      } else {
        throw error;
      }
    }

    let row;
    try {
      row = await queryOne(
        `SELECT id, username, rol_id, rol, nombre, estacion_id, activo, created_at
         FROM usuario
         WHERE id = :id`,
        { id }
      );
    } catch (error) {
      if (isOracleError(error, 904)) {
        row = await queryOne(
          `SELECT id, username, rol, nombre, activo, created_at
           FROM usuario
           WHERE id = :id`,
          { id }
        );
      } else {
        throw error;
      }
    }
    return res.status(200).json(row);
  } catch (error) {
    const out = toHttpError(error);
    return res.status(out.status).json({ message: out.message });
  }
};

const meta = async (req, res) => {
  try {
    const roles = await query(
      `SELECT id, codigo, nombre
       FROM rol
       WHERE activo = 1
       ORDER BY id`
    );
    return res.status(200).json({ roles });
  } catch (error) {
    const out = toHttpError(error);
    return res.status(out.status).json({ message: out.message });
  }
};

const setPassword = async (req, res) => {
  const id = Number.parseInt(req.params.id, 10);
  const { password } = req.body ?? {};
  if (!Number.isFinite(id)) return res.status(400).json({ message: 'Invalid id' });
  if (!password) return res.status(400).json({ message: 'password is required' });

  try {
    const existing = await queryOne(
      `SELECT id FROM usuario WHERE id = :id`,
      { id }
    );
    if (!existing) return res.status(404).json({ message: 'Not found' });

    const passwordHash = await bcrypt.hash(String(password), 10);
    await execute(
      `UPDATE usuario SET password_hash = :password_hash WHERE id = :id`,
      { id, password_hash: passwordHash }
    );
    return res.status(200).json({ message: 'OK' });
  } catch (error) {
    const out = toHttpError(error);
    return res.status(out.status).json({ message: out.message });
  }
};

module.exports = { list, create, update, meta, setPassword };
