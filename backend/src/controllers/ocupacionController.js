const oracledb = require('oracledb');
const { withTransaction, normalizeRow, toHttpError, getConfigMap } = require('../db/db');

const isOracleError = (error, errorNum) => {
  return Number(error?.errorNum) === Number(errorNum);
};

const register = async (req, res) => {
  const { bus_id, ocupacion_actual } = req.body ?? {};
  const busId = Number.parseInt(bus_id, 10);
  const ocupacion = Number.parseInt(ocupacion_actual, 10);

  if (!Number.isFinite(busId) || busId <= 0) return res.status(400).json({ message: 'bus_id is required' });
  if (!Number.isFinite(ocupacion) || ocupacion < 0) return res.status(400).json({ message: 'Invalid ocupacion_actual' });

  const estacionId = req.user?.estacion_id;
  if (!Number.isFinite(estacionId) || estacionId <= 0) {
    return res.status(409).json({ message: 'El usuario Operador no tiene estación asignada.' });
  }

  try {
    const result = await withTransaction(async (connection) => {
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

      const busRow = await connection.execute(
        `SELECT id, numero_unidad, capacidad_pasajeros, estado, linea_id, estacion_actual_id
         FROM bus
         WHERE id = :id`,
        { id: busId },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      const bus = busRow.rows?.[0] ?? null;
      if (!bus) return { status: 404, payload: { message: 'Bus no encontrado' } };

      const capacidad = bus.CAPACIDAD_PASAJEROS;
      const ratio = capacidad > 0 ? ocupacion / capacidad : 0;
      const ocupacionPct = Math.round(ratio * 100);

      let registroOcupacionId = null;
      try {
        const registroResult = await connection.execute(
          `INSERT INTO registro_ocupacion (bus_id, estacion_id, usuario_id, ocupacion_actual, capacidad_pasajeros, ocupacion_pct)
           VALUES (:bus_id, :estacion_id, :usuario_id, :ocupacion_actual, :capacidad_pasajeros, :ocupacion_pct)
           RETURNING id INTO :id`,
          {
            bus_id: busId,
            estacion_id: estacionId,
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
         SET ocupacion_actual = :ocupacion_actual,
             estacion_actual_id = :estacion_actual_id
         WHERE id = :id`,
        { ocupacion_actual: ocupacion, estacion_actual_id: estacionId, id: busId }
      );

      const protectedEstados = [busEstadoMantenimiento, busEstadoFueraServicio].filter(Boolean);
      if (busEstadoEnEstacion && protectedEstados.length > 0 && !protectedEstados.includes(bus.ESTADO)) {
        const binds = { id: busId, en_estacion: busEstadoEnEstacion };
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

      const alertas = [];
      if (Number.isFinite(saturationRatio) && ratio >= saturationRatio && alertTipoSaturacion) {
        const mensaje = `ALERTA: Saturación ${ocupacionPct}% en bus ${bus.NUMERO_UNIDAD}. Se requiere despacho de refuerzo.`;
        await connection.execute(
          `INSERT INTO alerta (tipo, mensaje, bus_id, estacion_id)
           VALUES (:tipo, :mensaje, :bus_id, :estacion_id)`,
          { tipo: alertTipoSaturacion, mensaje, bus_id: busId, estacion_id: estacionId }
        );
        try {
          await connection.execute(
            `INSERT INTO alerta_saturacion (registro_ocupacion_id, bus_id, estacion_id, ocupacion_pct, mensaje)
             VALUES (:registro_ocupacion_id, :bus_id, :estacion_id, :ocupacion_pct, :mensaje)`,
            {
              registro_ocupacion_id: registroOcupacionId,
              bus_id: busId,
              estacion_id: estacionId,
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
            { bus_objetivo_id: busId, estado: refuerzoEstadoInicial, estacion_id: estacionId },
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
          );
          if ((exists.rows ?? []).length === 0) {
            await connection.execute(
              `INSERT INTO orden_refuerzo (bus_objetivo_id, linea_id, estacion_id, estado)
               VALUES (:bus_objetivo_id, :linea_id, :estacion_id, :estado)`,
              { bus_objetivo_id: busId, linea_id: bus.LINEA_ID ?? null, estacion_id: estacionId, estado: refuerzoEstadoInicial }
            );
          }
        }
        alertas.push({ tipo: alertTipoSaturacion, mensaje });
      }

      let waitMinutes = null;
      if (Number.isFinite(lowRatio) && ratio <= lowRatio && alertTipoBaja) {
        waitMinutes = Number.isFinite(waitMinutesCfg) ? waitMinutesCfg : null;
        const waitText = waitMinutes === null ? '' : ` ${waitMinutes} min.`;
        const mensaje = `INFO: Baja ocupación ${ocupacionPct}% en bus ${bus.NUMERO_UNIDAD}. Espera adicional recomendada:${waitText}`;
        await connection.execute(
          `INSERT INTO alerta (tipo, mensaje, bus_id, estacion_id)
           VALUES (:tipo, :mensaje, :bus_id, :estacion_id)`,
          { tipo: alertTipoBaja, mensaje, bus_id: busId, estacion_id: estacionId }
        );
        if (busEstadoEnEstacion && busEstadoEspera) {
          await connection.execute(
            `UPDATE bus SET estado = :estado WHERE id = :id AND estado = :from_estado`,
            { id: busId, estado: busEstadoEspera, from_estado: busEstadoEnEstacion }
          );
        }
        alertas.push({ tipo: alertTipoBaja, mensaje, wait_minutes: waitMinutes });
      } else {
        if (busEstadoEnEstacion && busEstadoEspera) {
          await connection.execute(
            `UPDATE bus SET estado = :estado WHERE id = :id AND estado = :from_estado`,
            { id: busId, estado: busEstadoEnEstacion, from_estado: busEstadoEspera }
          );
        }
      }

      const outBus = await connection.execute(
        `SELECT
           b.id,
           b.numero_unidad,
           b.placa,
           b.modelo,
           b.capacidad_pasajeros,
           b.ocupacion_actual,
           b.estado,
           b.linea_id,
           b.parqueo_id,
           b.estacion_actual_id
         FROM bus b
         WHERE b.id = :id`,
        { id: busId },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );

      return {
        status: 200,
        payload: {
          message: 'Ocupación registrada correctamente',
          registro_ocupacion_id: registroOcupacionId,
          bus: normalizeRow(outBus.rows?.[0] ?? null),
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
};

module.exports = { register };
