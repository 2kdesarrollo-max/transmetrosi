const oracledb = require('oracledb');
const { withTransaction, normalizeRow, normalizeRows, toHttpError, getConfigMap } = require('../db/db');

const isOracleError = (error, errorNum) => {
  return Number(error?.errorNum) === Number(errorNum);
};

const isLineaPermitidaEnParqueo = async (connection, parqueoId, lineaId) => {
  if (!Number.isFinite(Number(parqueoId))) return true;
  if (lineaId === null || lineaId === undefined) return true;

  try {
    const totalResult = await connection.execute(
      `SELECT COUNT(*) AS cnt
       FROM parqueo_linea
       WHERE parqueo_id = :parqueo_id`,
      { parqueo_id: parqueoId },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    const total = totalResult.rows?.[0]?.CNT ?? 0;
    if (Number(total) <= 0) return true;

    const existsResult = await connection.execute(
      `SELECT 1 AS ok
       FROM parqueo_linea
       WHERE parqueo_id = :parqueo_id
         AND linea_id = :linea_id`,
      { parqueo_id: parqueoId, linea_id: lineaId },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    return (existsResult.rows ?? []).length > 0;
  } catch (error) {
    if (isOracleError(error, 942)) return true;
    throw error;
  }
};

const isEstacionPermitidaEnLinea = async (connection, lineaId, estacionId) => {
  if (lineaId === null || lineaId === undefined) return true;
  if (estacionId === null || estacionId === undefined) return true;
  try {
    const existsResult = await connection.execute(
      `SELECT 1 AS ok
       FROM linea_estacion
       WHERE linea_id = :linea_id
         AND estacion_id = :estacion_id`,
      { linea_id: lineaId, estacion_id: estacionId },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    return (existsResult.rows ?? []).length > 0;
  } catch (error) {
    if (isOracleError(error, 942)) return true;
    throw error;
  }
};

const fetchBusById = async (connection, id) => {
  let result;
  try {
    result = await connection.execute(
      `SELECT
         b.id,
         b.numero_unidad,
         b.placa,
         b.modelo,
         b.capacidad_pasajeros,
         b.ocupacion_actual,
         b.estado,
         b.linea_id,
         l.nombre AS linea_nombre,
         l.color AS linea_color,
         b.parqueo_id,
         pa.nombre AS parqueo_nombre,
         b.estacion_actual_id,
         es.nombre AS estacion_actual_nombre,
         p.id AS piloto_id,
         (p.nombre || ' ' || p.apellido) AS piloto_nombre
       FROM bus b
       LEFT JOIN linea l ON l.id = b.linea_id
       JOIN parqueo pa ON pa.id = b.parqueo_id
       LEFT JOIN estacion es ON es.id = b.estacion_actual_id
       LEFT JOIN asignacion_piloto_bus apb ON apb.bus_id = b.id AND apb.activo = 1
       LEFT JOIN piloto p ON p.id = apb.piloto_id
       WHERE b.id = :id`,
      { id },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
  } catch (error) {
    if (!isOracleError(error, 942)) throw error;
    result = await connection.execute(
      `SELECT
         b.id,
         b.numero_unidad,
         b.placa,
         b.modelo,
         b.capacidad_pasajeros,
         b.ocupacion_actual,
         b.estado,
         b.linea_id,
         l.nombre AS linea_nombre,
         l.color AS linea_color,
         b.parqueo_id,
         pa.nombre AS parqueo_nombre,
         b.estacion_actual_id,
         es.nombre AS estacion_actual_nombre,
         p.id AS piloto_id,
         (p.nombre || ' ' || p.apellido) AS piloto_nombre
       FROM bus b
       LEFT JOIN linea l ON l.id = b.linea_id
       JOIN parqueo pa ON pa.id = b.parqueo_id
       LEFT JOIN estacion es ON es.id = b.estacion_actual_id
       LEFT JOIN piloto p ON p.bus_id = b.id
       WHERE b.id = :id`,
      { id },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
  }

  return normalizeRow(result.rows?.[0] ?? null);
};

const busController = {
  getAllBuses: async (req, res) => {
    try {
      const rows = await withTransaction(async (connection) => {
        let result;
        try {
          result = await connection.execute(
            `SELECT
               b.id,
               b.numero_unidad,
               b.placa,
               b.modelo,
               b.capacidad_pasajeros,
               b.ocupacion_actual,
               b.estado,
               b.linea_id,
               l.nombre AS linea_nombre,
               l.color AS linea_color,
               b.parqueo_id,
               pa.nombre AS parqueo_nombre,
               b.estacion_actual_id,
               es.nombre AS estacion_actual_nombre,
               p.id AS piloto_id,
               (p.nombre || ' ' || p.apellido) AS piloto_nombre
             FROM bus b
             LEFT JOIN linea l ON l.id = b.linea_id
             JOIN parqueo pa ON pa.id = b.parqueo_id
             LEFT JOIN estacion es ON es.id = b.estacion_actual_id
             LEFT JOIN asignacion_piloto_bus apb ON apb.bus_id = b.id AND apb.activo = 1
             LEFT JOIN piloto p ON p.id = apb.piloto_id
             ORDER BY b.id`,
            {},
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
          );
        } catch (error) {
          if (!isOracleError(error, 942)) throw error;
          result = await connection.execute(
            `SELECT
               b.id,
               b.numero_unidad,
               b.placa,
               b.modelo,
               b.capacidad_pasajeros,
               b.ocupacion_actual,
               b.estado,
               b.linea_id,
               l.nombre AS linea_nombre,
               l.color AS linea_color,
               b.parqueo_id,
               pa.nombre AS parqueo_nombre,
               b.estacion_actual_id,
               es.nombre AS estacion_actual_nombre,
               p.id AS piloto_id,
               (p.nombre || ' ' || p.apellido) AS piloto_nombre
             FROM bus b
             LEFT JOIN linea l ON l.id = b.linea_id
             JOIN parqueo pa ON pa.id = b.parqueo_id
             LEFT JOIN estacion es ON es.id = b.estacion_actual_id
             LEFT JOIN piloto p ON p.bus_id = b.id
             ORDER BY b.id`,
            {},
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
          );
        }
        return normalizeRows(result.rows ?? []);
      });

      return res.status(200).json(rows);
    } catch (error) {
      const out = toHttpError(error);
      return res.status(out.status).json({ message: out.message });
    }
  },

  getById: async (req, res) => {
    const id = Number.parseInt(req.params.id, 10);
    if (!Number.isFinite(id)) return res.status(400).json({ message: 'Invalid id' });

    try {
      const bus = await withTransaction(async (connection) => fetchBusById(connection, id));
      if (!bus) return res.status(404).json({ message: 'Bus no encontrado' });
      return res.status(200).json(bus);
    } catch (error) {
      const out = toHttpError(error);
      return res.status(out.status).json({ message: out.message });
    }
  },

  create: async (req, res) => {
    const { numero_unidad, placa, modelo, capacidad_pasajeros, linea_id, parqueo_id, estacion_actual_id, estado } = req.body ?? {};
    const capacidad = Number.parseInt(capacidad_pasajeros, 10);
    const lineaId = linea_id === undefined || linea_id === null ? null : Number.parseInt(linea_id, 10);
    const parqueoId = Number.parseInt(parqueo_id, 10);
    const estacionActualId = estacion_actual_id === undefined || estacion_actual_id === null ? null : Number.parseInt(estacion_actual_id, 10);
    const estadoInput = estado ?? null;

    if (!numero_unidad || !placa) return res.status(400).json({ message: 'numero_unidad and placa are required' });
    if (!Number.isFinite(capacidad) || capacidad <= 0) return res.status(400).json({ message: 'capacidad_pasajeros is required' });
    if (!Number.isFinite(parqueoId) || parqueoId <= 0) return res.status(400).json({ message: 'parqueo_id is required' });
    if (lineaId !== null && (!Number.isFinite(lineaId) || lineaId <= 0)) return res.status(400).json({ message: 'Invalid linea_id' });
    if (estacionActualId !== null && (!Number.isFinite(estacionActualId) || estacionActualId <= 0)) return res.status(400).json({ message: 'Invalid estacion_actual_id' });

    try {
      const out = await withTransaction(async (connection) => {
        const cfg = await getConfigMap(connection, ['BUS_ESTADO_INICIAL']);
        const cfgInitial = cfg.BUS_ESTADO_INICIAL?.valor_text ?? null;
        const initialFromCatalog = await (async () => {
          const row = await connection.execute(
            `SELECT codigo
             FROM cat_estado_bus
             WHERE activo = 1
             ORDER BY orden
             FETCH FIRST 1 ROWS ONLY`,
            {},
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
          );
          return row.rows?.[0]?.CODIGO ?? null;
        })();

        const estadoValue = (estadoInput ?? cfgInitial ?? initialFromCatalog);
        if (!estadoValue) return { status: 409, payload: { message: 'No hay estado inicial configurado para buses.' } };

        const estadoOk = await connection.execute(
          `SELECT 1 AS ok
           FROM cat_estado_bus
           WHERE codigo = :codigo AND activo = 1`,
          { codigo: estadoValue },
          { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        if ((estadoOk.rows ?? []).length === 0) return { status: 400, payload: { message: 'Estado inválido' } };

        const parqueoExists = await connection.execute(
          `SELECT id, capacidad FROM parqueo WHERE id = :id`,
          { id: parqueoId }
        );
        if ((parqueoExists.rows ?? []).length === 0) {
          return { status: 400, payload: { message: 'Parqueo no existe' } };
        }
        const parqueoCapacidad = Number(parqueoExists.rows?.[0]?.[1] ?? parqueoExists.rows?.[0]?.CAPACIDAD ?? 0);
        if (Number.isFinite(parqueoCapacidad) && parqueoCapacidad > 0) {
          const parqueoCount = await connection.execute(
            `SELECT COUNT(*) AS cnt
             FROM bus
             WHERE parqueo_id = :parqueo_id`,
            { parqueo_id: parqueoId },
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
          );
          const cnt = parqueoCount.rows?.[0]?.CNT ?? 0;
          if (Number(cnt) + 1 > parqueoCapacidad) {
            return { status: 409, payload: { message: 'Capacidad de parqueo excedida' } };
          }
        }

        if (estacionActualId !== null) {
          const estacionExists = await connection.execute(
            `SELECT id FROM estacion WHERE id = :id`,
            { id: estacionActualId }
          );
          if ((estacionExists.rows ?? []).length === 0) {
            return { status: 400, payload: { message: 'Estación no existe' } };
          }
        }

        if (lineaId !== null) {
          const lineaExists = await connection.execute(
            `SELECT id FROM linea WHERE id = :id`,
            { id: lineaId }
          );
          if ((lineaExists.rows ?? []).length === 0) {
            return { status: 400, payload: { message: 'Línea no existe' } };
          }

          const allowed = await isLineaPermitidaEnParqueo(connection, parqueoId, lineaId);
          if (!allowed) {
            return { status: 409, payload: { message: 'Esta línea no está permitida para el parqueo seleccionado' } };
          }

          if (estacionActualId !== null) {
            const stationAllowed = await isEstacionPermitidaEnLinea(connection, lineaId, estacionActualId);
            if (!stationAllowed) {
              return { status: 409, payload: { message: 'La estación actual no pertenece a la línea seleccionada' } };
            }
          }

          const estacionesCountResult = await connection.execute(
            `SELECT COUNT(*) AS estaciones_count FROM linea_estacion WHERE linea_id = :linea_id`,
            { linea_id: lineaId },
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
          );
          const estacionesCount = estacionesCountResult.rows?.[0]?.ESTACIONES_COUNT ?? 0;
          if (estacionesCount <= 0) {
            return { status: 409, payload: { message: 'La línea no tiene estaciones configuradas' } };
          }

          const busesCountResult = await connection.execute(
            `SELECT COUNT(*) AS buses_count FROM bus WHERE linea_id = :linea_id`,
            { linea_id: lineaId },
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
          );
          const busesCount = busesCountResult.rows?.[0]?.BUSES_COUNT ?? 0;
          if (busesCount + 1 > estacionesCount * 2) {
            return { status: 409, payload: { message: 'Límite máximo de buses excedido para esta línea' } };
          }
        }

        await connection.execute(
          `INSERT INTO bus (numero_unidad, placa, modelo, capacidad_pasajeros, linea_id, parqueo_id, estacion_actual_id, estado, ocupacion_actual)
           VALUES (:numero_unidad, :placa, :modelo, :capacidad_pasajeros, :linea_id, :parqueo_id, :estacion_actual_id, :estado, 0)`,
          {
            numero_unidad,
            placa,
            modelo: modelo ?? null,
            capacidad_pasajeros: capacidad,
            linea_id: lineaId,
            parqueo_id: parqueoId,
            estacion_actual_id: estacionActualId,
            estado: estadoValue
          }
        );

        const row = await connection.execute(
          `SELECT id FROM bus WHERE numero_unidad = :numero_unidad`,
          { numero_unidad },
          { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        const id = row.rows?.[0]?.ID;
        const bus = await fetchBusById(connection, id);
        return { status: 201, payload: bus };
      });

      if (out?.status) return res.status(out.status).json(out.payload);
      return res.status(201).json(out);
    } catch (error) {
      const out = toHttpError(error);
      return res.status(out.status).json({ message: out.message });
    }
  },

  updateOcupacion: async (req, res) => {
    const id = Number.parseInt(req.params.id, 10);
    const { ocupacion_actual, estacion_id } = req.body ?? {};
    const ocupacion = Number.parseInt(ocupacion_actual, 10);
    const estacionId = estacion_id === undefined || estacion_id === null ? null : Number.parseInt(estacion_id, 10);
    const estacionProvided = Object.prototype.hasOwnProperty.call(req.body ?? {}, 'estacion_id');

    if (!Number.isFinite(id)) return res.status(400).json({ message: 'Invalid id' });
    if (!Number.isFinite(ocupacion) || ocupacion < 0) return res.status(400).json({ message: 'Invalid ocupacion_actual' });
    if (estacionId !== null && (!Number.isFinite(estacionId) || estacionId <= 0)) return res.status(400).json({ message: 'Invalid estacion_id' });

    try {
      const result = await withTransaction(async (connection) => {
        const busBefore = await fetchBusById(connection, id);
        if (!busBefore) {
          return { status: 404, payload: { message: 'Bus no encontrado' } };
        }

        if (estacionProvided && estacionId !== null) {
          const estacionExists = await connection.execute(
            `SELECT id FROM estacion WHERE id = :id`,
            { id: estacionId }
          );
          if ((estacionExists.rows ?? []).length === 0) {
            return { status: 400, payload: { message: 'Estación no existe' } };
          }
          if (busBefore.linea_id !== null && busBefore.linea_id !== undefined) {
            const okStation = await isEstacionPermitidaEnLinea(connection, Number(busBefore.linea_id), estacionId);
            if (!okStation) {
              return { status: 409, payload: { message: 'La estación no pertenece a la línea asignada al bus' } };
            }
          }
        }

        const cfg = await getConfigMap(connection, [
          'SATURATION_RATIO',
          'LOW_OCCUPANCY_RATIO',
          'LOW_OCCUPANCY_WAIT_MIN',
          'ALERTA_TIPO_SATURACION',
          'ALERTA_TIPO_BAJA_OCUPACION',
          'REFUERZO_ESTADO_INICIAL',
          'BUS_ESTADO_MANTENIMIENTO',
          'BUS_ESTADO_FUERA_SERVICIO',
          'BUS_ESTADO_EN_ESTACION',
          'BUS_ESTADO_ESPERA_PROLONGADA'
        ]);

        const getNum = (k) => {
          const v = cfg[k]?.valor_num;
          const n = v === null || v === undefined ? null : Number(v);
          return Number.isFinite(n) ? n : null;
        };
        const getText = (k) => {
          const v = cfg[k]?.valor_text;
          if (v === null || v === undefined) return null;
          const s = String(v).trim();
          return s ? s : null;
        };

        const saturationRatio = getNum('SATURATION_RATIO');
        const lowRatio = getNum('LOW_OCCUPANCY_RATIO');
        const waitMinutesCfg = getNum('LOW_OCCUPANCY_WAIT_MIN');
        const alertTipoSaturacion = getText('ALERTA_TIPO_SATURACION');
        const alertTipoBaja = getText('ALERTA_TIPO_BAJA_OCUPACION');
        const refuerzoEstadoInicial = getText('REFUERZO_ESTADO_INICIAL');
        const busEstadoMantenimiento = getText('BUS_ESTADO_MANTENIMIENTO');
        const busEstadoFueraServicio = getText('BUS_ESTADO_FUERA_SERVICIO');
        const busEstadoEnEstacion = getText('BUS_ESTADO_EN_ESTACION');
        const busEstadoEspera = getText('BUS_ESTADO_ESPERA_PROLONGADA');

        const capacidad = busBefore.capacidad_pasajeros;
        const ratio = capacidad > 0 ? ocupacion / capacidad : 0;
        const ocupacionPct = Math.round(ratio * 100);

        const alertStationId = estacionProvided ? estacionId : (busBefore.estacion_actual_id ?? null);

        let registroOcupacionId = null;
        try {
          const registroResult = await connection.execute(
            `INSERT INTO registro_ocupacion (bus_id, estacion_id, usuario_id, ocupacion_actual, capacidad_pasajeros, ocupacion_pct)
             VALUES (:bus_id, :estacion_id, :usuario_id, :ocupacion_actual, :capacidad_pasajeros, :ocupacion_pct)
             RETURNING id INTO :id`,
            {
              bus_id: id,
              estacion_id: alertStationId,
              usuario_id: req.user?.id ?? null,
              ocupacion_actual: ocupacion,
              capacidad_pasajeros: capacidad,
              ocupacion_pct: ocupacionPct,
              id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
            }
          );
          registroOcupacionId = registroResult.outBinds?.id?.[0] ?? null;
        } catch (error) {
          if (!isOracleError(error, 942)) throw error;
        }

        await connection.execute(
          `UPDATE bus
           SET ocupacion_actual = :ocupacion
           WHERE id = :id`,
          { ocupacion, id }
        );

        if (estacionProvided) {
          if (estacionId !== null) {
            await connection.execute(
              `UPDATE bus
               SET estacion_actual_id = :estacion_actual_id
               WHERE id = :id`,
              { estacion_actual_id: estacionId, id }
            );

            const protectedEstados = [busEstadoMantenimiento, busEstadoFueraServicio].filter(Boolean);
            if (busEstadoEnEstacion && protectedEstados.length > 0 && !protectedEstados.includes(busBefore.estado)) {
              const binds = { id, en_estacion: busEstadoEnEstacion };
              const notIn = protectedEstados.map((v, idx) => {
                const name = `p${idx}`;
                binds[name] = v;
                return `:${name}`;
              });
              await connection.execute(
                `UPDATE bus
                 SET estado = :en_estacion
                 WHERE id = :id AND estado NOT IN (${notIn.join(', ')})`,
                binds
              );
            }
          } else {
            await connection.execute(
              `UPDATE bus
               SET estacion_actual_id = NULL
               WHERE id = :id`,
              { id }
            );
          }
        }

        const alertas = [];

        if (Number.isFinite(saturationRatio) && ratio >= saturationRatio && alertTipoSaturacion) {
          const mensaje = `ALERTA: Saturación ${Math.round(ratio * 100)}% en bus ${busBefore.numero_unidad}. Se requiere despacho de refuerzo.`;

          await connection.execute(
            `INSERT INTO alerta (tipo, mensaje, bus_id, estacion_id)
             VALUES (:tipo, :mensaje, :bus_id, :estacion_id)`,
            { tipo: alertTipoSaturacion, mensaje, bus_id: id, estacion_id: alertStationId }
          );

          try {
            await connection.execute(
              `INSERT INTO alerta_saturacion (registro_ocupacion_id, bus_id, estacion_id, ocupacion_pct, mensaje)
               VALUES (:registro_ocupacion_id, :bus_id, :estacion_id, :ocupacion_pct, :mensaje)`,
              {
                registro_ocupacion_id: registroOcupacionId,
                bus_id: id,
                estacion_id: alertStationId,
                ocupacion_pct: ocupacionPct,
                mensaje
              }
            );
          } catch (error) {
            if (!isOracleError(error, 942)) throw error;
          }

          if (refuerzoEstadoInicial) {
            const exists = await connection.execute(
              `SELECT id
               FROM orden_refuerzo
               WHERE bus_objetivo_id = :bus_objetivo_id
                 AND estado = :estado
                 AND (estacion_id = :estacion_id OR (:estacion_id IS NULL AND estacion_id IS NULL))
                 AND ROWNUM = 1`,
              { bus_objetivo_id: id, estado: refuerzoEstadoInicial, estacion_id: alertStationId },
              { outFormat: oracledb.OUT_FORMAT_OBJECT }
            );
            if ((exists.rows ?? []).length === 0) {
              await connection.execute(
                `INSERT INTO orden_refuerzo (bus_objetivo_id, linea_id, estacion_id, estado)
                 VALUES (:bus_objetivo_id, :linea_id, :estacion_id, :estado)`,
                { bus_objetivo_id: id, linea_id: busBefore.linea_id ?? null, estacion_id: alertStationId, estado: refuerzoEstadoInicial }
              );
            }
          }

          alertas.push({ tipo: alertTipoSaturacion, mensaje });
        }

        let waitMinutes = null;
        if (Number.isFinite(lowRatio) && ratio <= lowRatio && alertTipoBaja) {
          waitMinutes = Number.isFinite(waitMinutesCfg) ? waitMinutesCfg : null;
          const waitText = waitMinutes === null ? '' : ` ${waitMinutes} min.`;
          const mensaje = `INFO: Baja ocupación ${Math.round(ratio * 100)}% en bus ${busBefore.numero_unidad}. Espera adicional recomendada:${waitText}`;

          await connection.execute(
            `INSERT INTO alerta (tipo, mensaje, bus_id, estacion_id)
             VALUES (:tipo, :mensaje, :bus_id, :estacion_id)`,
            { tipo: alertTipoBaja, mensaje, bus_id: id, estacion_id: alertStationId }
          );

          if (busEstadoEnEstacion && busEstadoEspera && busBefore.estado === busEstadoEnEstacion) {
            await connection.execute(
              `UPDATE bus SET estado = :estado WHERE id = :id`,
              { id, estado: busEstadoEspera }
            );
          }

          alertas.push({ tipo: alertTipoBaja, mensaje, wait_minutes: waitMinutes });
        } else if (busEstadoEnEstacion && busEstadoEspera && busBefore.estado === busEstadoEspera) {
          await connection.execute(
            `UPDATE bus SET estado = :estado WHERE id = :id`,
            { id, estado: busEstadoEnEstacion }
          );
        }

        const busAfter = await fetchBusById(connection, id);
        return {
          status: 200,
          payload: {
            message: 'Ocupación actualizada correctamente',
            bus: busAfter,
            alertas,
            wait_minutes: waitMinutes
          }
        };
      });

      return res.status(result.status).json(result.payload);
    } catch (error) {
      const out = toHttpError(error);
      return res.status(out.status).json({ message: out.message });
    }
  },
  setEstacionActual: async (req, res) => {
    const id = Number.parseInt(req.params.id, 10);
    const { estacion_id } = req.body ?? {};
    const estacionId = estacion_id === undefined || estacion_id === null ? null : Number.parseInt(estacion_id, 10);

    if (!Number.isFinite(id)) return res.status(400).json({ message: 'Invalid id' });
    if (estacionId !== null && (!Number.isFinite(estacionId) || estacionId <= 0)) return res.status(400).json({ message: 'Invalid estacion_id' });

    try {
      const out = await withTransaction(async (connection) => {
        const busBefore = await fetchBusById(connection, id);
        if (!busBefore) return { status: 404, payload: { message: 'Bus no encontrado' } };

        if (estacionId !== null) {
          const estacionExists = await connection.execute(
            `SELECT id FROM estacion WHERE id = :id`,
            { id: estacionId }
          );
          if ((estacionExists.rows ?? []).length === 0) {
            return { status: 400, payload: { message: 'Estación no existe' } };
          }
          if (busBefore.linea_id !== null && busBefore.linea_id !== undefined) {
            const okStation = await isEstacionPermitidaEnLinea(connection, Number(busBefore.linea_id), estacionId);
            if (!okStation) {
              return { status: 409, payload: { message: 'La estación no pertenece a la línea asignada al bus' } };
            }
          }
        }

        const cfg = await getConfigMap(connection, [
          'BUS_ESTADO_MANTENIMIENTO',
          'BUS_ESTADO_FUERA_SERVICIO',
          'BUS_ESTADO_EN_ESTACION'
        ]);
        const getText = (k) => {
          const v = cfg[k]?.valor_text;
          if (v === null || v === undefined) return null;
          const s = String(v).trim();
          return s ? s : null;
        };
        const busEstadoMantenimiento = getText('BUS_ESTADO_MANTENIMIENTO');
        const busEstadoFueraServicio = getText('BUS_ESTADO_FUERA_SERVICIO');
        const busEstadoEnEstacion = getText('BUS_ESTADO_EN_ESTACION');

        await connection.execute(
          `UPDATE bus
           SET estacion_actual_id = :estacion_actual_id
           WHERE id = :id`,
          { estacion_actual_id: estacionId, id }
        );

        if (estacionId !== null && busEstadoEnEstacion) {
          const protectedEstados = [busEstadoMantenimiento, busEstadoFueraServicio].filter(Boolean);
          if (protectedEstados.length > 0 && !protectedEstados.includes(busBefore.estado)) {
            const binds = { id, en_estacion: busEstadoEnEstacion };
            const notIn = protectedEstados.map((v, idx) => {
              const name = `p${idx}`;
              binds[name] = v;
              return `:${name}`;
            });
            await connection.execute(
              `UPDATE bus
               SET estado = :en_estacion
               WHERE id = :id AND estado NOT IN (${notIn.join(', ')})`,
              binds
            );
          }
        }

        const busAfter = await fetchBusById(connection, id);
        return { status: 200, payload: busAfter };
      });

      return res.status(out.status).json(out.payload);
    } catch (error) {
      const out = toHttpError(error);
      return res.status(out.status).json({ message: out.message });
    }
  },
  setEstado: async (req, res) => {
    const id = Number.parseInt(req.params.id, 10);
    const { estado } = req.body ?? {};
    if (!Number.isFinite(id)) return res.status(400).json({ message: 'Invalid id' });
    if (!estado) return res.status(400).json({ message: 'estado is required' });

    try {
      const out = await withTransaction(async (connection) => {
        const busBefore = await fetchBusById(connection, id);
        if (!busBefore) return { status: 404, payload: { message: 'Bus no encontrado' } };

        const estadoOk = await connection.execute(
          `SELECT 1 AS ok
           FROM cat_estado_bus
           WHERE codigo = :codigo AND activo = 1`,
          { codigo: estado },
          { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        if ((estadoOk.rows ?? []).length === 0) return { status: 400, payload: { message: 'Estado inválido' } };

        await connection.execute(
          `UPDATE bus SET estado = :estado WHERE id = :id`,
          { estado, id }
        );

        const busAfter = await fetchBusById(connection, id);
        return { status: 200, payload: busAfter };
      });

      return res.status(out.status).json(out.payload);
    } catch (error) {
      const out = toHttpError(error);
      return res.status(out.status).json({ message: out.message });
    }
  },

  setParqueo: async (req, res) => {
    const id = Number.parseInt(req.params.id, 10);
    const { parqueo_id } = req.body ?? {};
    const parqueoId = Number.parseInt(parqueo_id, 10);
    if (!Number.isFinite(id)) return res.status(400).json({ message: 'Invalid id' });
    if (!Number.isFinite(parqueoId) || parqueoId <= 0) return res.status(400).json({ message: 'parqueo_id is required' });

    try {
      const out = await withTransaction(async (connection) => {
        const busBefore = await fetchBusById(connection, id);
        if (!busBefore) return { status: 404, payload: { message: 'Bus no encontrado' } };

        const parqueoExists = await connection.execute(
          `SELECT id, capacidad FROM parqueo WHERE id = :id`,
          { id: parqueoId }
        );
        if ((parqueoExists.rows ?? []).length === 0) {
          return { status: 400, payload: { message: 'Parqueo no existe' } };
        }

        if (busBefore.linea_id !== null && busBefore.linea_id !== undefined) {
          const allowed = await isLineaPermitidaEnParqueo(connection, parqueoId, Number(busBefore.linea_id));
          if (!allowed) {
            return { status: 409, payload: { message: 'Este parqueo no está permitido para la línea actual del bus' } };
          }
        }

        const parqueoCapacidad = Number(parqueoExists.rows?.[0]?.[1] ?? parqueoExists.rows?.[0]?.CAPACIDAD ?? 0);
        if (Number.isFinite(parqueoCapacidad) && parqueoCapacidad > 0) {
          const parqueoCount = await connection.execute(
            `SELECT COUNT(*) AS cnt
             FROM bus
             WHERE parqueo_id = :parqueo_id
               AND id != :id`,
            { parqueo_id: parqueoId, id },
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
          );
          const cnt = parqueoCount.rows?.[0]?.CNT ?? 0;
          if (Number(cnt) + 1 > parqueoCapacidad) {
            return { status: 409, payload: { message: 'Capacidad de parqueo excedida' } };
          }
        }

        await connection.execute(
          `UPDATE bus SET parqueo_id = :parqueo_id WHERE id = :id`,
          { parqueo_id: parqueoId, id }
        );

        const busAfter = await fetchBusById(connection, id);
        return { status: 200, payload: busAfter };
      });

      return res.status(out.status).json(out.payload);
    } catch (error) {
      const out = toHttpError(error);
      return res.status(out.status).json({ message: out.message });
    }
  },

  setLinea: async (req, res) => {
    const id = Number.parseInt(req.params.id, 10);
    const { linea_id } = req.body ?? {};
    const lineaId = linea_id === undefined || linea_id === null ? null : Number.parseInt(linea_id, 10);
    if (!Number.isFinite(id)) return res.status(400).json({ message: 'Invalid id' });
    if (lineaId !== null && (!Number.isFinite(lineaId) || lineaId <= 0)) return res.status(400).json({ message: 'Invalid linea_id' });

    try {
      const out = await withTransaction(async (connection) => {
        const busBefore = await fetchBusById(connection, id);
        if (!busBefore) return { status: 404, payload: { message: 'Bus no encontrado' } };

        const oldLineaId = busBefore.linea_id ?? null;

        if (lineaId !== null) {
          const lineaExists = await connection.execute(
            `SELECT id FROM linea WHERE id = :id`,
            { id: lineaId }
          );
          if ((lineaExists.rows ?? []).length === 0) {
            return { status: 400, payload: { message: 'Línea no existe' } };
          }

          const allowed = await isLineaPermitidaEnParqueo(connection, Number(busBefore.parqueo_id), lineaId);
          if (!allowed) {
            return { status: 409, payload: { message: 'Esta línea no está permitida para el parqueo actual del bus' } };
          }

          if (busBefore.estacion_actual_id !== null && busBefore.estacion_actual_id !== undefined) {
            const okStation = await isEstacionPermitidaEnLinea(connection, lineaId, Number(busBefore.estacion_actual_id));
            if (!okStation) {
              return { status: 409, payload: { message: 'La estación actual no pertenece a la línea seleccionada. Limpia la estación o cámbiala primero.' } };
            }
          }

          const estacionesCountResult = await connection.execute(
            `SELECT COUNT(*) AS estaciones_count FROM linea_estacion WHERE linea_id = :linea_id`,
            { linea_id: lineaId },
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
          );
          const estacionesCount = estacionesCountResult.rows?.[0]?.ESTACIONES_COUNT ?? 0;
          if (estacionesCount <= 0) {
            return { status: 409, payload: { message: 'La línea no tiene estaciones configuradas' } };
          }

          const busesCountResult = await connection.execute(
            `SELECT COUNT(*) AS buses_count FROM bus WHERE linea_id = :linea_id AND id != :id`,
            { linea_id: lineaId, id },
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
          );
          const busesCount = busesCountResult.rows?.[0]?.BUSES_COUNT ?? 0;
          const afterCount = busesCount + 1;

          if (afterCount > estacionesCount * 2) {
            return { status: 409, payload: { message: 'Límite máximo de buses excedido para esta línea' } };
          }
        }

        if (lineaId === null && oldLineaId !== null) {
          const estacionesCountResult = await connection.execute(
            `SELECT COUNT(*) AS estaciones_count FROM linea_estacion WHERE linea_id = :linea_id`,
            { linea_id: oldLineaId },
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
          );
          const estacionesCount = estacionesCountResult.rows?.[0]?.ESTACIONES_COUNT ?? 0;

          const busesCountResult = await connection.execute(
            `SELECT COUNT(*) AS buses_count FROM bus WHERE linea_id = :linea_id`,
            { linea_id: oldLineaId },
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
          );
          const busesCount = busesCountResult.rows?.[0]?.BUSES_COUNT ?? 0;
          const afterCount = busesCount - 1;

          if (estacionesCount > 0 && busesCount >= estacionesCount && afterCount < estacionesCount) {
            return { status: 409, payload: { message: 'No se puede desasignar: la línea quedaría por debajo del mínimo de buses' } };
          }
        }

        await connection.execute(
          `UPDATE bus SET linea_id = :linea_id WHERE id = :id`,
          { linea_id: lineaId, id }
        );

        const busAfter = await fetchBusById(connection, id);
        return { status: 200, payload: busAfter };
      });

      return res.status(out.status).json(out.payload);
    } catch (error) {
      const out = toHttpError(error);
      return res.status(out.status).json({ message: out.message });
    }
  },
  setPiloto: async (req, res) => {
    const id = Number.parseInt(req.params.id, 10);
    const { piloto_id } = req.body ?? {};
    const pilotoId = Number.parseInt(piloto_id, 10);
    if (!Number.isFinite(id)) return res.status(400).json({ message: 'Invalid id' });
    if (!Number.isFinite(pilotoId) || pilotoId <= 0) return res.status(400).json({ message: 'piloto_id is required' });

    try {
      const out = await withTransaction(async (connection) => {
        const busBefore = await fetchBusById(connection, id);
        if (!busBefore) return { status: 404, payload: { message: 'Bus no encontrado' } };

        const pilotoExists = await connection.execute(
          `SELECT id FROM piloto WHERE id = :id`,
          { id: pilotoId }
        );
        if ((pilotoExists.rows ?? []).length === 0) {
          return { status: 400, payload: { message: 'Piloto no existe' } };
        }

        try {
          await connection.execute(
            `UPDATE asignacion_piloto_bus
             SET activo = 0, fecha_fin = SYSTIMESTAMP
             WHERE bus_id = :bus_id AND activo = 1`,
            { bus_id: id }
          );
          await connection.execute(
            `UPDATE asignacion_piloto_bus
             SET activo = 0, fecha_fin = SYSTIMESTAMP
             WHERE piloto_id = :piloto_id AND activo = 1`,
            { piloto_id: pilotoId }
          );
          await connection.execute(
            `INSERT INTO asignacion_piloto_bus (piloto_id, bus_id, activo)
             VALUES (:piloto_id, :bus_id, 1)`,
            { piloto_id: pilotoId, bus_id: id }
          );
        } catch (error) {
          if (!isOracleError(error, 942)) throw error;
          await connection.execute(
            `UPDATE piloto SET bus_id = NULL WHERE bus_id = :bus_id`,
            { bus_id: id }
          );
          await connection.execute(
            `UPDATE piloto SET bus_id = :bus_id WHERE id = :piloto_id`,
            { bus_id: id, piloto_id: pilotoId }
          );
        }

        const busAfter = await fetchBusById(connection, id);
        return { status: 200, payload: busAfter };
      });

      return res.status(out.status).json(out.payload);
    } catch (error) {
      const out = toHttpError(error);
      return res.status(out.status).json({ message: out.message });
    }
  }
  ,
  meta: async (req, res) => {
    try {
      const result = await withTransaction(async (connection) => {
        const estadosResult = await connection.execute(
          `SELECT codigo, nombre, ui_class, orden
           FROM cat_estado_bus
           WHERE activo = 1
           ORDER BY orden`,
          {},
          { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        const estados = normalizeRows(estadosResult.rows ?? []);

        const cfg = await getConfigMap(connection, ['BUS_ESTADO_INICIAL']);
        const busEstadoInicial = cfg.BUS_ESTADO_INICIAL?.valor_text ?? null;

        return {
          estados,
          config: { bus_estado_inicial: busEstadoInicial }
        };
      });

      return res.status(200).json(result);
    } catch (error) {
      const out = toHttpError(error);
      return res.status(out.status).json({ message: out.message });
    }
  }
};

module.exports = busController;
