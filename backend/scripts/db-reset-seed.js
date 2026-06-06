const fs = require('fs');
const path = require('path');

require('dotenv').config();

const { getConnection, closePool } = require('../src/config/db');

const isIgnorableOracleError = (error) => {
  const n = Number(error?.errorNum);
  return [
    955,
    942,
    1430,
    2275,
    2443,
    1408,
    1418,
    1434
  ].includes(n);
};

const readStatements = (filePath) => {
  const text = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');
  const lines = text.split('\n');

  const statements = [];
  let buf = '';
  let inBlock = false;
  let keepTrailingSemicolon = false;

  const isBlockStart = (trimmed) => {
    return (
      /^(DECLARE|BEGIN)\b/i.test(trimmed) ||
      /^CREATE(\s+OR\s+REPLACE)?\s+(TRIGGER|PROCEDURE|FUNCTION|PACKAGE|TYPE)\b/i.test(trimmed)
    );
  };

  const flush = () => {
    const sql = buf.trim();
    buf = '';
    if (!sql) return;
    statements.push({ sql, keepTrailingSemicolon });
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith('--')) continue;

    if (!inBlock && buf.trim() === '' && isBlockStart(trimmed)) {
      inBlock = true;
      keepTrailingSemicolon = true;
    }

    if (inBlock) {
      if (trimmed === '/') {
        flush();
        inBlock = false;
        keepTrailingSemicolon = false;
        continue;
      }
      buf += `${line}\n`;
      continue;
    }

    buf += `${line}\n`;
    if (trimmed.endsWith(';')) {
      flush();
      keepTrailingSemicolon = false;
    }
  }

  if (buf.trim()) flush();

  return statements;
};

const runSqlFile = async (connection, filePath) => {
  const statements = readStatements(filePath);
  let executed = 0;
  let ignored = 0;

  for (let i = 0; i < statements.length; i++) {
    const { sql, keepTrailingSemicolon } = statements[i];
    const trimmed = sql.trim();
    const toRun = keepTrailingSemicolon ? trimmed : trimmed.replace(/;\s*$/, '');

    try {
      if (/^COMMIT\b/i.test(trimmed)) {
        await connection.commit();
      } else {
        await connection.execute(toRun);
      }
      executed++;
    } catch (error) {
      if (isIgnorableOracleError(error)) {
        ignored++;
        continue;
      }
      const head = trimmed.slice(0, 120).replace(/\s+/g, ' ');
      console.error(`Fallo en ${path.basename(filePath)} stmt #${i + 1}: ${head}`);
      throw error;
    }
  }

  await connection.commit();
  return { executed, ignored, total: statements.length };
};

const main = async () => {
  const schemaPath = path.resolve(__dirname, '..', '..', 'database', 'schema.sql');
  const seedPath = path.resolve(__dirname, '..', '..', 'database', 'seed.sql');

  let connection;
  try {
    connection = await getConnection();

    console.log(`DB: ${process.env.ORACLE_CONNECT_STRING}`);
    console.log('Aplicando schema.sql...');
    const schemaRes = await runSqlFile(connection, schemaPath);
    console.log(`Schema: ejecutados=${schemaRes.executed} ignorados=${schemaRes.ignored} total=${schemaRes.total}`);

    console.log('Aplicando seed.sql...');
    const seedRes = await runSqlFile(connection, seedPath);
    console.log(`Seed: ejecutados=${seedRes.executed} ignorados=${seedRes.ignored} total=${seedRes.total}`);

    console.log('OK: BD lista.');
  } finally {
    try {
      await connection?.close();
    } catch {
    }
    try {
      await closePool();
    } catch {
    }
  }
};

main().catch((e) => {
  console.error('ERROR:', e?.message ?? String(e));
  process.exit(1);
});
