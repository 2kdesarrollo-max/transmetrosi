const jwt = require('jsonwebtoken');
const { query, queryOne } = require('../db/db');

const normalizeRole = (value) => {
  if (!value) return '';
  const s = String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  return s.trim().toLowerCase();
};

const getTokenFromRequest = (req) => {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) return null;
  return token;
};

const authRequired = (req, res, next) => {
  const token = getTokenFromRequest(req);
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ message: 'Server misconfigured: JWT_SECRET missing' });
    }

    const payload = jwt.verify(token, secret);
    req.user = payload;
    return next();
  } catch {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

const requireRoles = (...roles) => {
  return (req, res, next) => {
    const rol = req.user?.rol;
    if (!rol) return res.status(401).json({ message: 'Unauthorized' });
    const allowed = roles.map(normalizeRole);
    if (!allowed.includes(normalizeRole(rol))) return res.status(403).json({ message: 'Forbidden' });
    return next();
  };
};

const permsCache = new Map();

const getPermsForUser = async ({ userId, rolId }) => {
  const key = rolId ? `rol:${rolId}` : userId ? `user:${userId}` : null;
  if (!key) return null;
  const cached = permsCache.get(key);
  if (cached && cached.expiresAt > Date.now()) return cached.perms;

  let roleId = rolId ?? null;
  if (!roleId && userId) {
    try {
      const row = await queryOne(`SELECT rol_id FROM usuario WHERE id = :id`, { id: userId });
      roleId = row?.rol_id ?? null;
    } catch {
    }
  }

  if (!roleId) return null;

  const rows = await query(
    `SELECT p.codigo
     FROM rol_permiso rp
     JOIN permiso p ON p.id = rp.permiso_id
     WHERE rp.rol_id = :rol_id
     ORDER BY p.codigo`,
    { rol_id: roleId }
  );

  const perms = (rows || []).map((r) => r.codigo).filter(Boolean);
  permsCache.set(key, { perms, expiresAt: Date.now() + 60_000 });
  return perms;
};

const requirePerms = (...perms) => {
  return async (req, res, next) => {
    try {
      const user = req.user;
      if (!user) return res.status(401).json({ message: 'Unauthorized' });

      let userPerms = Array.isArray(user.permisos) && user.permisos.length > 0 ? user.permisos : null;
      if (!userPerms) {
        userPerms = await getPermsForUser({ userId: user.id, rolId: user.rol_id });
      }
      if (!userPerms) return res.status(500).json({ message: 'RBAC misconfigured: permisos no disponibles.' });

      const needed = new Set(perms);
      const ok = userPerms.some((p) => needed.has(p));
      if (!ok) return res.status(403).json({ message: 'Forbidden' });

      return next();
    } catch {
      return res.status(500).json({ message: 'RBAC misconfigured: error al validar permisos.' });
    }
  };
};

module.exports = { authRequired, requireRoles, requirePerms };
