require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const { getConnection, closePool } = require('./config/db');
const { toHttpError, execute } = require('./db/db');

const app = express();
const APP_PORT = Number.parseInt(process.env.APP_PORT ?? '5000', 10) || 5000;

app.set('trust proxy', Number.parseInt(process.env.TRUST_PROXY ?? '1', 10) || 1);

const parseCorsOrigins = () => {
  const raw = String(process.env.CORS_ORIGINS ?? '').trim();
  if (!raw) return [];
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
};

const corsOrigins = parseCorsOrigins();
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (corsOrigins.length === 0) return cb(null, true);
      return cb(null, corsOrigins.includes(origin));
    }
  })
);
app.use(express.json());
app.use(morgan('dev'));

app.use((req, res, next) => {
  const method = req.method?.toUpperCase?.() ?? req.method;
  if (['GET', 'HEAD', 'OPTIONS'].includes(method)) return next();

  res.on('finish', async () => {
    try {
      const path = req.path || '';
      const recurso = path.split('/').filter(Boolean)[0] ?? 'root';
      const firstId = req.params && Object.values(req.params)[0] ? Number.parseInt(Object.values(req.params)[0], 10) : null;
      const bodyJson = JSON.stringify(req.body ?? {});
      await execute(
        `INSERT INTO bitacora_auditoria (usuario_id, rol, accion, recurso, recurso_id, detalle_json, ip)
         VALUES (:usuario_id, :rol, :accion, :recurso, :recurso_id, :detalle_json, :ip)`,
        {
          usuario_id: req.user?.id ?? null,
          rol: req.user?.rol ?? null,
          accion: `${method} ${path}`,
          recurso,
          recurso_id: Number.isFinite(firstId) ? firstId : null,
          detalle_json: bodyJson,
          ip: req.ip ?? null
        }
      );
    } catch {
    }
  });

  return next();
});

app.get('/api/health', async (req, res) => {
  let connection;

  try {
    connection = await getConnection();
    const result = await connection.execute(
      "SELECT 'ok' AS status, SYS_CONTEXT('USERENV','DB_NAME') AS db_name FROM dual"
    );
    const row = result.rows?.[0];
    res.status(200).json({ db: 'ok', db_name: row?.DB_NAME ?? null });
  } catch (error) {
    res.status(500).json({ db: 'error', message: error?.message ?? String(error) });
  } finally {
    try {
      await connection?.close();
    } catch {
    }
  }
});

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const usuarioRoutes = require('./routes/usuarioRoutes');
app.use('/api/usuarios', usuarioRoutes);

const municipalidadRoutes = require('./routes/municipalidadRoutes');
app.use('/api/municipalidades', municipalidadRoutes);

const lineaRoutes = require('./routes/lineaRoutes');
app.use('/api/lineas', lineaRoutes);

const estacionRoutes = require('./routes/estacionRoutes');
app.use('/api/estaciones', estacionRoutes);

const accesoRoutes = require('./routes/accesoRoutes');
app.use('/api/accesos', accesoRoutes);

const operadorRoutes = require('./routes/operadorRoutes');
app.use('/api/operadores', operadorRoutes);

const parqueoRoutes = require('./routes/parqueoRoutes');
app.use('/api/parqueos', parqueoRoutes);

const pilotoRoutes = require('./routes/pilotoRoutes');
app.use('/api/pilotos', pilotoRoutes);

const asignacionRoutes = require('./routes/asignacionRoutes');
app.use('/api/asignaciones', asignacionRoutes);

const ocupacionRoutes = require('./routes/ocupacionRoutes');
app.use('/api/ocupacion', ocupacionRoutes);

const guardiaRoutes = require('./routes/guardiaRoutes');
app.use('/api', guardiaRoutes);

const refuerzoRoutes = require('./routes/refuerzoRoutes');
app.use('/api/refuerzos', refuerzoRoutes);

const alertaRoutes = require('./routes/alertaRoutes');
app.use('/api/alertas', alertaRoutes);

const reportRoutes = require('./routes/reportRoutes');
app.use('/api/reportes', reportRoutes);

const dashboardRoutes = require('./routes/dashboardRoutes');
app.use('/api/dashboard', dashboardRoutes);

const busRoutes = require('./routes/busRoutes');
app.use('/api/buses', busRoutes);

const webRoot = path.resolve(__dirname, '..', 'public');
const webIndex = path.join(webRoot, 'index.html');
const hasWeb = fs.existsSync(webIndex);

if (hasWeb) {
  app.use(express.static(webRoot));
  app.get('*', (req, res, next) => {
    const method = req.method?.toUpperCase?.() ?? req.method;
    if (!['GET', 'HEAD'].includes(method)) return next();
    if (req.path?.startsWith('/api')) return next();
    return res.sendFile(webIndex);
  });
} else {
  app.get('/', (req, res) => {
    res.json({
      message: 'Bienvenido al API del Sistema Transmetro de Guatemala',
      status: 'online',
      timestamp: new Date()
    });
  });
}

app.use((err, req, res, next) => {
  if (!req.path?.startsWith('/api')) return next(err);
  const out = toHttpError(err);
  return res.status(out.status).json({ message: out.message });
});

const startServer = async () => {
  let connection;
  try {
    connection = await getConnection();
  } catch (error) {
    if (String(process.env.NODE_ENV || '').toLowerCase() === 'production') throw error;
    console.error(`Oracle no disponible. El backend iniciará en modo degradado. ${error?.message ?? String(error)}`);
  } finally {
    try {
      await connection?.close();
    } catch {
    }
  }

  const server = app.listen(APP_PORT, '0.0.0.0', () => {
    console.log(`Servidor backend corriendo en http://0.0.0.0:${APP_PORT}`);
  });

  const shutdown = async (signal) => {
    try {
      server.close(() => {
      });
    } catch {
    }

    try {
      await closePool();
    } catch (error) {
      console.error(error);
    } finally {
      process.exit(0);
    }
  };

  process.once('SIGINT', () => shutdown('SIGINT'));
  process.once('SIGTERM', () => shutdown('SIGTERM'));
};

startServer();
