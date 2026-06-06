require('dotenv').config();

const oracledb = require('oracledb');

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
oracledb.fetchAsString = [oracledb.CLOB];

let pool;

const createPoolIfNeeded = async () => {
  if (pool) return pool;

  const required = ['ORACLE_USER', 'ORACLE_PASSWORD', 'ORACLE_CONNECT_STRING'];
  for (const key of required) {
    if (!process.env[key]) {
      throw new Error(`Missing environment variable: ${key}`);
    }
  }

  const poolMin = Number.parseInt(process.env.ORACLE_POOL_MIN ?? '2', 10);
  const poolMax = Number.parseInt(process.env.ORACLE_POOL_MAX ?? '10', 10);

  pool = await oracledb.createPool({
    user: process.env.ORACLE_USER,
    password: process.env.ORACLE_PASSWORD,
    connectString: process.env.ORACLE_CONNECT_STRING,
    poolMin: Number.isFinite(poolMin) ? poolMin : 2,
    poolMax: Number.isFinite(poolMax) ? poolMax : 10
  });

  return pool;
};

const getConnection = async () => {
  const p = await createPoolIfNeeded();
  return p.getConnection();
};

const closePool = async () => {
  if (!pool) return;
  const p = pool;
  pool = undefined;
  await p.close(10);
};

module.exports = { getConnection, closePool };
