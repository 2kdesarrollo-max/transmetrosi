const oracledb = require('oracledb');
const { getConnection } = require('../config/db');

const normalizeRow = (row) => {
  if (!row || typeof row !== 'object') return row;
  const out = {};
  for (const [key, value] of Object.entries(row)) {
    out[key.toLowerCase()] = value;
  }
  return out;
};

const normalizeRows = (rows) => {
  if (!Array.isArray(rows)) return [];
  return rows.map(normalizeRow);
};

const toHttpError = (error) => {
  const rawMessage = error?.message ?? String(error);
  const rawCode = error?.code ?? null;

  switch (rawMessage) {
    case 'LINEA_NOT_FOUND':
      return { status: 404, message: 'Línea no encontrada.' };
    case 'ESTACION_NOT_FOUND':
      return { status: 404, message: 'Estación no encontrada.' };
    case 'MUNICIPALIDAD_MISMATCH':
      return { status: 409, message: 'La estación no pertenece a la misma municipalidad que la línea.' };
    case 'BUSES_EXCEED_MAX':
      return { status: 409, message: 'No se puede reducir estaciones porque la línea violaría la regla de 2N buses.' };
    default:
      break;
  }

  if (typeof rawCode === 'string' && /^NJS-\d+$/i.test(rawCode)) {
    return { status: 503, message: 'Base de datos no disponible. Verifica ORACLE_CONNECT_STRING y que Oracle esté en línea.' };
  }
  if (typeof rawMessage === 'string' && /\bNJS-\d+\b/i.test(rawMessage)) {
    return { status: 503, message: 'Base de datos no disponible. Verifica ORACLE_CONNECT_STRING y que Oracle esté en línea.' };
  }

  const errorNum = error?.errorNum;
  if (errorNum === 1) return { status: 409, message: 'Registro duplicado.' };
  if (errorNum === 1400) return { status: 400, message: 'Faltan campos obligatorios.' };
  if (errorNum === 1722) return { status: 400, message: 'Tipo de dato inválido.' };
  if (errorNum === 12899) return { status: 400, message: 'Un campo excede la longitud permitida.' };
  if (errorNum === 2291) return { status: 409, message: 'Referencia inválida (registro relacionado no existe).' };
  if (errorNum === 2292) return { status: 409, message: 'No se puede eliminar/actualizar por dependencias relacionadas.' };

  return { status: 500, message: 'Error interno del servidor.' };
};

const execute = async (sql, binds = {}, options = {}) => {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(sql, binds, {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
      autoCommit: true,
      ...options
    });
    return result;
  } finally {
    try {
      await connection?.close();
    } catch {
    }
  }
};

const query = async (sql, binds = {}, options = {}) => {
  const result = await execute(sql, binds, options);
  return normalizeRows(result.rows ?? []);
};

const queryOne = async (sql, binds = {}, options = {}) => {
  const rows = await query(sql, binds, options);
  return rows[0] ?? null;
};

const getConfigMap = async (connection, keys) => {
  const uniq = Array.from(new Set((keys ?? []).filter(Boolean).map((k) => String(k))));
  if (uniq.length === 0) return {};

  const binds = {};
  const placeholders = uniq.map((k, idx) => {
    const name = `k${idx}`;
    binds[name] = k;
    return `:${name}`;
  });

  const result = await connection.execute(
    `SELECT clave, valor_num, valor_text
     FROM config_param
     WHERE activo = 1 AND clave IN (${placeholders.join(', ')})`,
    binds,
    { outFormat: oracledb.OUT_FORMAT_OBJECT }
  );

  const map = {};
  for (const row of result.rows ?? []) {
    map[String(row.CLAVE)] = { valor_num: row.VALOR_NUM, valor_text: row.VALOR_TEXT };
  }
  return map;
};

const getConfigNum = async (clave) => {
  const row = await queryOne(
    `SELECT valor_num
     FROM config_param
     WHERE activo = 1 AND clave = :clave`,
    { clave }
  );
  const value = row?.valor_num;
  const num = value === null || value === undefined ? null : Number(value);
  return Number.isFinite(num) ? num : null;
};

const getConfigText = async (clave) => {
  const row = await queryOne(
    `SELECT valor_text
     FROM config_param
     WHERE activo = 1 AND clave = :clave`,
    { clave }
  );
  const value = row?.valor_text;
  if (value === null || value === undefined) return null;
  const s = String(value).trim();
  return s ? s : null;
};

const withTransaction = async (fn) => {
  let connection;
  try {
    connection = await getConnection();
    const result = await fn(connection);
    await connection.commit();
    return result;
  } catch (error) {
    try {
      await connection?.rollback();
    } catch {
    }
    throw error;
  } finally {
    try {
      await connection?.close();
    } catch {
    }
  }
};

module.exports = { execute, query, queryOne, withTransaction, normalizeRow, normalizeRows, toHttpError, getConfigMap, getConfigNum, getConfigText };
