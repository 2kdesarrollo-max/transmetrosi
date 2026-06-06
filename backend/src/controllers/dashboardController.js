const { query, queryOne, toHttpError, getConfigNum } = require('../db/db');

const overview = async (req, res) => {
  try {
    const [saturationRatio, lowRatio, lowWaitMin] = await Promise.all([
      getConfigNum('SATURATION_RATIO'),
      getConfigNum('LOW_OCCUPANCY_RATIO'),
      getConfigNum('LOW_OCCUPANCY_WAIT_MIN')
    ]);

    const stats = await queryOne(
      `SELECT
         (SELECT COUNT(*) FROM bus) AS buses_total,
         (SELECT COUNT(*) FROM linea) AS lineas_total,
         (SELECT COUNT(*) FROM estacion) AS estaciones_total,
         (SELECT COUNT(*) FROM alerta WHERE leida = 0) AS alertas_pendientes
       FROM dual`
    );

    const lineas = await query(
      `SELECT id, nombre, color
       FROM linea
       ORDER BY id`
    );

    const estacionesRows = await query(
      `SELECT
         le.linea_id,
         e.id AS estacion_id,
         e.nombre AS estacion_nombre,
         le.orden,
         le.distancia_siguiente_km
       FROM linea_estacion le
       JOIN estacion e ON e.id = le.estacion_id
       ORDER BY le.linea_id, le.orden`
    );

    const stationLineCount = new Map();
    for (const s of estacionesRows) {
      const id = s.estacion_id;
      stationLineCount.set(id, (stationLineCount.get(id) ?? 0) + 1);
    }

    const busesRows = await query(
      `SELECT
         b.id,
         b.numero_unidad,
         b.ocupacion_actual,
         b.capacidad_pasajeros,
         b.estado,
         b.linea_id,
         l.nombre AS linea_nombre,
         b.estacion_actual_id,
         e.nombre AS estacion_actual_nombre
       FROM bus b
       LEFT JOIN linea l ON l.id = b.linea_id
       LEFT JOIN estacion e ON e.id = b.estacion_actual_id
       WHERE b.linea_id IS NOT NULL
       ORDER BY b.id`
    );

    const buses = [];
    const busesByStation = new Map();
    for (const b of busesRows) {
      const ratio = b.capacidad_pasajeros > 0 ? (b.ocupacion_actual / b.capacidad_pasajeros) : 0;
      const ocupacionPct = Math.max(0, Math.round(ratio * 100));
      const item = {
        id: b.id,
        unidad: b.numero_unidad,
        ocupacion: ocupacionPct,
        estado: b.estado,
        linea_id: b.linea_id,
        linea_nombre: b.linea_nombre ?? null,
        estacion_actual_id: b.estacion_actual_id,
        estacion_actual_nombre: b.estacion_actual_nombre ?? null
      };
      buses.push(item);
      if (b.estacion_actual_id) {
        const key = `${b.linea_id}:${b.estacion_actual_id}`;
        const arr = busesByStation.get(key) ?? [];
        arr.push(item);
        busesByStation.set(key, arr);
      }
    }

    const estacionesByLinea = new Map();
    for (const s of estacionesRows) {
      const lineId = s.linea_id;
      const list = estacionesByLinea.get(lineId) ?? [];
      const key = `${lineId}:${s.estacion_id}`;
      list.push({
        id: s.estacion_id,
        nombre: s.estacion_nombre,
        orden: s.orden,
        distancia_siguiente_km: s.distancia_siguiente_km,
        transbordo: (stationLineCount.get(s.estacion_id) ?? 0) > 1,
        buses: busesByStation.get(key) ?? []
      });
      estacionesByLinea.set(lineId, list);
    }

    const ejes = lineas.map((l) => ({
      id: l.id,
      nombre: l.nombre,
      color: l.color,
      estaciones: estacionesByLinea.get(l.id) ?? []
    }));

    return res.status(200).json({
      stats: {
        buses_total: stats?.buses_total ?? 0,
        lineas_total: stats?.lineas_total ?? 0,
        estaciones_total: stats?.estaciones_total ?? 0,
        alertas_pendientes: stats?.alertas_pendientes ?? 0
      },
      config: {
        saturation_ratio: saturationRatio,
        low_occupancy_ratio: lowRatio,
        low_occupancy_wait_min: lowWaitMin,
        saturation_pct: Number.isFinite(saturationRatio) ? Math.round(saturationRatio * 100) : null,
        low_occupancy_pct: Number.isFinite(lowRatio) ? Math.round(lowRatio * 100) : null
      },
      ejes,
      buses
    });
  } catch (error) {
    const out = toHttpError(error);
    return res.status(out.status).json({ message: out.message });
  }
};

const balance = async (req, res) => {
  try {
    const rows = await query(
      `SELECT
         l.id,
         l.nombre,
         (SELECT COUNT(*) FROM linea_estacion le WHERE le.linea_id = l.id) AS estaciones_count,
         (SELECT COUNT(*) FROM bus b WHERE b.linea_id = l.id) AS buses_count
       FROM linea l
       ORDER BY l.id`
    );

    const sinLineaRow = await queryOne(
      `SELECT COUNT(*) AS buses_sin_linea
       FROM bus
       WHERE linea_id IS NULL`
    );

    const data = (rows || []).map((r) => {
      const estaciones = Number(r.estaciones_count ?? 0);
      const buses = Number(r.buses_count ?? 0);
      const minBuses = estaciones;
      const maxBuses = estaciones * 2;
      const faltan = Math.max(0, minBuses - buses);
      const exceden = Math.max(0, buses - maxBuses);
      const estado = estaciones <= 0 ? 'SIN_ESTACIONES' : faltan > 0 ? 'FALTAN' : exceden > 0 ? 'EXCESO' : 'OK';

      return {
        linea_id: r.id,
        linea_nombre: r.nombre,
        estaciones_count: estaciones,
        buses_count: buses,
        min_buses: minBuses,
        max_buses: maxBuses,
        faltan_buses: faltan,
        exceden_buses: exceden,
        estado
      };
    });

    const summary = data.reduce(
      (acc, r) => {
        acc.total_lineas += 1;
        if (r.estado === 'OK') acc.ok += 1;
        if (r.estado === 'FALTAN') acc.faltan += 1;
        if (r.estado === 'EXCESO') acc.exceden += 1;
        if (r.estado === 'SIN_ESTACIONES') acc.sin_estaciones += 1;
        return acc;
      },
      { total_lineas: 0, ok: 0, faltan: 0, exceden: 0, sin_estaciones: 0 }
    );

    return res.status(200).json({
      summary: {
        ...summary,
        buses_sin_linea: Number(sinLineaRow?.buses_sin_linea ?? 0)
      },
      data
    });
  } catch (error) {
    const out = toHttpError(error);
    return res.status(out.status).json({ message: out.message });
  }
};

module.exports = { overview, balance };
