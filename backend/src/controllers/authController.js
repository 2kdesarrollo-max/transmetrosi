const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { queryOne, execute, toHttpError } = require('../db/db');

const isOracleError = (error, errorNum) => {
  return Number(error?.errorNum) === Number(errorNum);
};

const hashRefreshToken = (token) => {
  return crypto.createHash('sha256').update(String(token)).digest('hex');
};

const createRefreshToken = async (userId) => {
  const raw = crypto.randomBytes(48).toString('base64url');
  const tokenHash = hashRefreshToken(raw);
  const days = Number.parseInt(process.env.REFRESH_TOKEN_DAYS ?? '30', 10);
  const ttlDays = Number.isFinite(days) && days > 0 ? days : 30;
  const expiresAt = new Date(Date.now() + ttlDays * 24 * 60 * 60 * 1000);

  try {
    await execute(
      `INSERT INTO refresh_token (usuario_id, token_hash, expires_at)
       VALUES (:usuario_id, :token_hash, :expires_at)`,
      { usuario_id: userId, token_hash: tokenHash, expires_at: expiresAt }
    );
  } catch (error) {
    if (isOracleError(error, 942)) return null;
    throw error;
  }

  return raw;
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body ?? {};
    if (!username || !password) {
      return res.status(400).json({ message: 'username and password are required' });
    }

    let user;
    try {
      user = await queryOne(
        `SELECT id, username, password_hash, rol_id, rol, nombre, estacion_id, activo
         FROM usuario
         WHERE username = :username`,
        { username }
      );
    } catch (error) {
      if (isOracleError(error, 904)) {
        user = await queryOne(
          `SELECT id, username, password_hash, rol, nombre, activo
           FROM usuario
           WHERE username = :username`,
          { username }
        );
      } else {
        throw error;
      }
    }

    const isActive = Number(user?.activo ?? 0) === 1;
    if (!user || !isActive) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (typeof user.password_hash !== 'string' || user.password_hash.trim() === '') {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    let ok = false;
    try {
      ok = await bcrypt.compare(password, user.password_hash);
    } catch {
      ok = false;
    }
    if (!ok) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ message: 'Server misconfigured: JWT_SECRET missing' });
    }

    const expiresIn = process.env.JWT_EXPIRES_IN || '8h';
    const rol = user.rol;
    let permisos = null;
    try {
      const rows = await execute(
        `SELECT p.codigo
         FROM rol_permiso rp
         JOIN permiso p ON p.id = rp.permiso_id
         WHERE rp.rol_id = :rol_id
         ORDER BY p.codigo`,
        { rol_id: user.rol_id }
      );
      permisos = (rows.rows ?? []).map((r) => r.CODIGO).filter(Boolean);
    } catch {
      permisos = null;
    }
    const payload = {
      sub: String(user.id),
      id: user.id,
      username: user.username,
      rol,
      rol_id: user.rol_id ?? null,
      nombre: user.nombre ?? null,
      estacion_id: user.estacion_id ?? null,
      permisos
    };

    const token = jwt.sign(payload, secret, { expiresIn });
    const refreshToken = await createRefreshToken(user.id);
    return res.status(200).json({
      token,
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
        rol,
        rol_id: user.rol_id ?? null,
        nombre: user.nombre ?? null,
        estacion_id: user.estacion_id ?? null,
        permisos
      }
    });
  } catch (error) {
    const out = toHttpError(error);
    return res.status(out.status).json({ message: out.message });
  }
};

const refresh = async (req, res) => {
  const { refreshToken } = req.body ?? {};
  if (!refreshToken) return res.status(400).json({ message: 'refreshToken is required' });

  try {
    const tokenHash = hashRefreshToken(refreshToken);
    let row;
    try {
      row = await queryOne(
        `SELECT id, usuario_id, revoked, expires_at
         FROM refresh_token
         WHERE token_hash = :token_hash`,
        { token_hash: tokenHash }
      );
    } catch (error) {
      if (isOracleError(error, 942)) {
        return res.status(501).json({ message: 'Refresh no disponible: esquema Oracle desactualizado.' });
      }
      throw error;
    }
    if (!row) return res.status(401).json({ message: 'Invalid refresh token' });
    if (row.revoked === 1) return res.status(401).json({ message: 'Invalid refresh token' });

    const valid = await queryOne(
      `SELECT CASE WHEN expires_at > SYSTIMESTAMP THEN 1 ELSE 0 END AS ok
       FROM refresh_token
       WHERE id = :id`,
      { id: row.id }
    );
    if (!valid || valid.ok !== 1) return res.status(401).json({ message: 'Refresh token expired' });

    let user;
    try {
      user = await queryOne(
        `SELECT id, username, rol_id, rol, nombre, estacion_id, activo
         FROM usuario
         WHERE id = :id`,
        { id: row.usuario_id }
      );
    } catch (error) {
      if (isOracleError(error, 904)) {
        user = await queryOne(
          `SELECT id, username, rol, nombre, estacion_id, activo
           FROM usuario
           WHERE id = :id`,
          { id: row.usuario_id }
        );
      } else {
        throw error;
      }
    }
    const isActive = Number(user?.activo ?? 0) === 1;
    if (!user || !isActive) return res.status(401).json({ message: 'Invalid refresh token' });

    await execute(
      `UPDATE refresh_token SET revoked = 1 WHERE id = :id`,
      { id: row.id }
    );

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ message: 'Server misconfigured: JWT_SECRET missing' });
    }
    const expiresIn = process.env.JWT_EXPIRES_IN || '8h';
    const rol = user.rol;
    let permisos = null;
    try {
      const rows = await execute(
        `SELECT p.codigo
         FROM rol_permiso rp
         JOIN permiso p ON p.id = rp.permiso_id
         WHERE rp.rol_id = :rol_id
         ORDER BY p.codigo`,
        { rol_id: user.rol_id }
      );
      permisos = (rows.rows ?? []).map((r) => r.CODIGO).filter(Boolean);
    } catch {
      permisos = null;
    }
    const payload = {
      sub: String(user.id),
      id: user.id,
      username: user.username,
      rol,
      rol_id: user.rol_id ?? null,
      nombre: user.nombre ?? null,
      estacion_id: user.estacion_id ?? null,
      permisos
    };
    const token = jwt.sign(payload, secret, { expiresIn });
    const newRefreshToken = await createRefreshToken(user.id);

    return res.status(200).json({
      token,
      refreshToken: newRefreshToken,
      user: {
        id: user.id,
        username: user.username,
        rol,
        rol_id: user.rol_id ?? null,
        nombre: user.nombre ?? null,
        estacion_id: user.estacion_id ?? null,
        permisos
      }
    });
  } catch (error) {
    const out = toHttpError(error);
    return res.status(out.status).json({ message: out.message });
  }
};

const me = async (req, res) => {
  return res.status(200).json({ user: req.user });
};

module.exports = { login, refresh, me };
