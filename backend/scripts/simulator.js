require('dotenv').config();

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const toNumber = (value, fallback) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

const pick = (arr) => {
  if (!Array.isArray(arr) || arr.length === 0) return null;
  return arr[Math.floor(Math.random() * arr.length)];
};

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

const nowIso = () => new Date().toISOString().replace('T', ' ').replace('Z', '');

const baseUrl = process.env.SIM_BASE_URL || 'http://127.0.0.1:5000/api';
const mode = (process.env.SIM_MODE || 'operator').toLowerCase();
const username = process.env.SIM_USERNAME || 'superadmin';
const password = process.env.SIM_PASSWORD || 'ChangeMe2026!';
const intervalMs = toNumber(process.env.SIM_INTERVAL_MS, 1500);
const steps = toNumber(process.env.SIM_STEPS, 0);
const scenario = (process.env.SIM_SCENARIO || 'normal').toLowerCase();
const busyBusPct = toNumber(process.env.SIM_BUSY_PCT, scenario === 'peak' ? 65 : scenario === 'low' ? 15 : 35);
const saturationBurstPct = toNumber(process.env.SIM_SATURATION_PCT, scenario === 'peak' ? 20 : 6);
const minStationsPerLine = toNumber(process.env.SIM_MIN_STATIONS_PER_LINE, 1);

const slugifyStation = (name) => {
  const raw = String(name || '').trim();
  if (!raw) return '';
  return raw
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
};

const stationToOperatorUsername = (stationName) => {
  const slug = slugifyStation(stationName);
  return slug ? `op_${slug}` : '';
};

const http = async ({ token, method, path, body }) => {
  const url = `${baseUrl}${path}`;
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body)
  });

  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    const msg = typeof data === 'object' && data?.message ? data.message : String(data);
    const err = new Error(`${method} ${path} -> HTTP ${res.status}: ${msg}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
};

const buildStationsByLinea = (overview) => {
  const map = new Map();
  const ejes = Array.isArray(overview?.ejes) ? overview.ejes : [];
  for (const eje of ejes) {
    const lineaId = eje?.id;
    if (!Number.isFinite(Number(lineaId))) continue;
    const estaciones = Array.isArray(eje?.estaciones) ? eje.estaciones : [];
    const ids = estaciones.map((s) => s?.id).filter((id) => Number.isFinite(Number(id)));
    map.set(Number(lineaId), ids);
  }
  return map;
};

const computeOccupacion = ({ capacidad }) => {
  const cap = Math.max(1, Number(capacidad) || 1);
  const dice = Math.random() * 100;
  const isBurst = dice < saturationBurstPct;
  if (isBurst) {
    return Math.round(cap * (1.15 + Math.random() * 0.7));
  }

  const isBusy = dice < saturationBurstPct + busyBusPct;
  if (isBusy) {
    return Math.round(cap * (0.55 + Math.random() * 0.55));
  }

  return Math.round(cap * (0.05 + Math.random() * 0.35));
};

const main = async () => {
  const startedAt = Date.now();
  console.log(`[SIM] base=${baseUrl} mode=${mode} user=${username} scenario=${scenario} intervalMs=${intervalMs} steps=${steps || '∞'}`);

  const login = await http({
    method: 'POST',
    path: '/auth/login',
    body: { username, password }
  });

  const token = login?.token;
  if (!token) throw new Error('Login sin token.');

  let overview = await http({ token, method: 'GET', path: '/dashboard/overview' });
  let buses = await http({ token, method: 'GET', path: '/buses' });

  const eligible = (buses || []).filter((b) => Number.isFinite(Number(b?.id)) && Number.isFinite(Number(b?.linea_id)));
  if (eligible.length === 0) throw new Error('No hay buses con línea asignada.');

  const stationsByLinea = buildStationsByLinea(overview);
  const withStations = eligible.filter((b) => {
    const stations = stationsByLinea.get(Number(b.linea_id)) || [];
    return stations.length >= minStationsPerLine;
  });

  if (withStations.length === 0) throw new Error('No hay líneas con estaciones suficientes para simular.');

  const operatorTokenCache = new Map();
  const getOperatorToken = async (stationName) => {
    const opUser = stationToOperatorUsername(stationName);
    if (!opUser) return null;
    const cached = operatorTokenCache.get(opUser);
    if (cached) return cached;
    const opLogin = await http({
      method: 'POST',
      path: '/auth/login',
      body: { username: opUser, password }
    });
    const opToken = opLogin?.token;
    if (!opToken) return null;
    operatorTokenCache.set(opUser, opToken);
    return opToken;
  };

  let i = 0;
  while (steps <= 0 || i < steps) {
    i += 1;
    if (i % 20 === 0) {
      overview = await http({ token, method: 'GET', path: '/dashboard/overview' });
      buses = await http({ token, method: 'GET', path: '/buses' });
    }

    const ejes = Array.isArray(overview?.ejes) ? overview.ejes : [];
    const eje = pick(ejes);
    const lineaId = Number(eje?.id);
    const estaciones = Array.isArray(eje?.estaciones) ? eje.estaciones : [];
    const estacion = pick(estaciones);
    const estacionId = Number(estacion?.id);
    const estacionNombre = estacion?.nombre || null;
    if (!Number.isFinite(lineaId) || !Number.isFinite(estacionId) || !estacionNombre) {
      await sleep(intervalMs);
      continue;
    }

    const currentBuses = (buses || []).filter((b) => Number.isFinite(Number(b?.id)) && Number.isFinite(Number(b?.linea_id)));
    const candidates = currentBuses.filter((b) => Number(b.linea_id) === lineaId);
    const bus = pick(candidates) || pick(withStations);
    if (!bus) {
      await sleep(intervalMs);
      continue;
    }

    const ocupacion = computeOccupacion({ capacidad: bus.capacidad_pasajeros });
    const ocupacionClamped = clamp(ocupacion, 0, 9999);

    try {
      const out = mode === 'admin'
        ? await http({
            token,
            method: 'PUT',
            path: `/buses/${bus.id}/ocupacion`,
            body: { ocupacion_actual: ocupacionClamped, estacion_id: estacionId }
          })
        : await http({
            token: await getOperatorToken(estacionNombre),
            method: 'POST',
            path: '/ocupacion',
            body: { bus_id: bus.id, ocupacion_actual: ocupacionClamped }
          });

      const alertas = Array.isArray(out?.alertas) ? out.alertas : [];
      const head = alertas[0]?.tipo ? ` alerta=${alertas[0].tipo}` : '';
      console.log(`[SIM] ${nowIso()} bus=${bus.numero_unidad} linea=${bus.linea_nombre || bus.linea_id} estacion=${estacionNombre} ocup=${ocupacionClamped}/${bus.capacidad_pasajeros}${head}`);
    } catch (e) {
      console.log(`[SIM] ${nowIso()} error: ${e.message}`);
    }

    await sleep(intervalMs);
  }

  console.log(`[SIM] terminado en ${(Date.now() - startedAt) / 1000}s`);
};

main().catch((e) => {
  console.error(`[SIM] fatal: ${e.message}`);
  process.exitCode = 1;
});
