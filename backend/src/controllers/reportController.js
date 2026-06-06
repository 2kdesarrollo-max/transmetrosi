const { query, toHttpError } = require('../db/db');

const estaciones = async (req, res) => {
  try {
    const estacionesRows = await query(
      `SELECT
         e.id,
         e.nombre,
         m.nombre AS municipalidad_nombre,
         o.id AS operador_id,
         (o.nombre || ' ' || o.apellido) AS operador_nombre,
         o.pc_nombre AS operador_pc_nombre
       FROM estacion e
       JOIN municipalidad m ON m.id = e.municipalidad_id
       LEFT JOIN operador o ON o.estacion_id = e.id
       ORDER BY e.id`
    );

    const accesoGuardiaRows = await query(
      `SELECT
         a.estacion_id,
         a.id AS acceso_id,
         a.nombre AS acceso_nombre,
         g.id AS guardia_id,
         g.nombre AS guardia_nombre,
         g.apellido AS guardia_apellido,
         g.dpi AS guardia_dpi,
         g.turno AS guardia_turno
       FROM acceso a
       LEFT JOIN guardia g ON g.acceso_id = a.id
       ORDER BY a.estacion_id, a.id, g.id`
    );

    const byStation = new Map();
    for (const e of estacionesRows) {
      byStation.set(e.id, {
        id: e.id,
        nombre: e.nombre,
        municipalidad_nombre: e.municipalidad_nombre,
        operador: e.operador_id
          ? { id: e.operador_id, nombre: e.operador_nombre, pc_nombre: e.operador_pc_nombre }
          : null,
        accesos: []
      });
    }

    const accesoByKey = new Map();
    for (const row of accesoGuardiaRows) {
      const station = byStation.get(row.estacion_id);
      if (!station) continue;

      const accesoKey = `${row.estacion_id}:${row.acceso_id}`;
      let acceso = accesoByKey.get(accesoKey);
      if (!acceso) {
        acceso = { id: row.acceso_id, nombre: row.acceso_nombre, guardias: [] };
        accesoByKey.set(accesoKey, acceso);
        station.accesos.push(acceso);
      }

      if (row.guardia_id) {
        acceso.guardias.push({
          id: row.guardia_id,
          nombre: row.guardia_nombre,
          apellido: row.guardia_apellido,
          dpi: row.guardia_dpi,
          turno: row.guardia_turno
        });
      }
    }

    return res.status(200).json({
      meta: {
        report: 'estaciones',
        query_estaciones: `SELECT e.id, e.nombre, m.nombre AS municipalidad_nombre, o.id AS operador_id, (o.nombre || ' ' || o.apellido) AS operador_nombre, o.pc_nombre AS operador_pc_nombre FROM estacion e JOIN municipalidad m ON m.id = e.municipalidad_id LEFT JOIN operador o ON o.estacion_id = e.id ORDER BY e.id`,
        query_accesos_guardias: `SELECT a.estacion_id, a.id AS acceso_id, a.nombre AS acceso_nombre, g.id AS guardia_id, g.nombre AS guardia_nombre, g.apellido AS guardia_apellido, g.dpi AS guardia_dpi, g.turno AS guardia_turno FROM acceso a LEFT JOIN guardia g ON g.acceso_id = a.id ORDER BY a.estacion_id, a.id, g.id`
      },
      data: Array.from(byStation.values())
    });
  } catch (error) {
    const out = toHttpError(error);
    return res.status(out.status).json({ message: out.message });
  }
};

const lineas = async (req, res) => {
  try {
    const lineasRows = await query(
      `SELECT
         l.id,
         l.nombre,
         l.color,
         m.nombre AS municipalidad_nombre,
         (SELECT COUNT(*) FROM linea_estacion le WHERE le.linea_id = l.id) AS estaciones_count,
         (SELECT NVL(SUM(le.distancia_siguiente_km), 0) FROM linea_estacion le WHERE le.linea_id = l.id) AS distancia_total_km
       FROM linea l
       JOIN municipalidad m ON m.id = l.municipalidad_id
       ORDER BY l.id`
    );

    const busesRows = await query(
      `SELECT
         b.id,
         b.numero_unidad,
         b.placa,
         b.capacidad_pasajeros,
         b.ocupacion_actual,
         b.estado,
         b.linea_id,
         p.nombre AS parqueo_nombre
       FROM bus b
       JOIN parqueo p ON p.id = b.parqueo_id
       WHERE b.linea_id IS NOT NULL
       ORDER BY b.linea_id, b.id`
    );

    const byLinea = new Map();
    for (const l of lineasRows) {
      byLinea.set(l.id, {
        id: l.id,
        nombre: l.nombre,
        color: l.color,
        municipalidad_nombre: l.municipalidad_nombre,
        estaciones_count: l.estaciones_count,
        distancia_total_km: l.distancia_total_km,
        buses: []
      });
    }

    for (const b of busesRows) {
      const linea = byLinea.get(b.linea_id);
      if (!linea) continue;
      linea.buses.push({
        id: b.id,
        numero_unidad: b.numero_unidad,
        placa: b.placa,
        capacidad_pasajeros: b.capacidad_pasajeros,
        ocupacion_actual: b.ocupacion_actual,
        estado: b.estado,
        parqueo_nombre: b.parqueo_nombre
      });
    }

    const data = Array.from(byLinea.values()).map((l) => ({
      ...l,
      buses_count: l.buses.length
    }));

    return res.status(200).json({
      meta: {
        report: 'lineas',
        query_lineas: `SELECT l.id, l.nombre, l.color, m.nombre AS municipalidad_nombre, (SELECT COUNT(*) FROM linea_estacion le WHERE le.linea_id = l.id) AS estaciones_count, (SELECT NVL(SUM(le.distancia_siguiente_km), 0) FROM linea_estacion le WHERE le.linea_id = l.id) AS distancia_total_km FROM linea l JOIN municipalidad m ON m.id = l.municipalidad_id ORDER BY l.id`,
        query_buses_asignados: `SELECT b.id, b.numero_unidad, b.placa, b.capacidad_pasajeros, b.ocupacion_actual, b.estado, b.linea_id, p.nombre AS parqueo_nombre FROM bus b JOIN parqueo p ON p.id = b.parqueo_id WHERE b.linea_id IS NOT NULL ORDER BY b.linea_id, b.id`
      },
      data
    });
  } catch (error) {
    const out = toHttpError(error);
    return res.status(out.status).json({ message: out.message });
  }
};

const busesPorLinea = async (req, res) => {
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

    const data = rows.map((r) => {
      const estaciones = r.estaciones_count ?? 0;
      const buses = r.buses_count ?? 0;
      const minBuses = estaciones;
      const maxBuses = estaciones * 2;
      const cumple = estaciones > 0 && buses >= minBuses && buses <= maxBuses;

      return {
        linea_id: r.id,
        linea_nombre: r.nombre,
        estaciones_count: estaciones,
        buses_count: buses,
        min_buses: minBuses,
        max_buses: maxBuses,
        cumple_regla: cumple
      };
    });

    return res.status(200).json({
      meta: {
        report: 'buses_por_linea',
        query: `SELECT l.id, l.nombre, (SELECT COUNT(*) FROM linea_estacion le WHERE le.linea_id = l.id) AS estaciones_count, (SELECT COUNT(*) FROM bus b WHERE b.linea_id = l.id) AS buses_count FROM linea l ORDER BY l.id`
      },
      data
    });
  } catch (error) {
    const out = toHttpError(error);
    return res.status(out.status).json({ message: out.message });
  }
};

module.exports = { estaciones, lineas, busesPorLinea };
