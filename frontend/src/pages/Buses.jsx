import React, { useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext.jsx';
import { useLocation, useNavigate } from 'react-router-dom';

const splitStationName = (name) => {
  const full = String(name ?? '').trim();
  if (!full) return { full: '', main: '', detail: '' };
  const m = full.match(/^(.+?)\s*\((.+)\)\s*$/);
  if (!m) return { full, main: full, detail: '' };
  return { full, main: m[1].trim(), detail: m[2].trim() };
};

const looksCorrupt = (value) => {
  const s = String(value ?? '');
  return /�|Ã.|Â/.test(s);
};

const Notification = ({ message, tone, onClose }) => {
  if (!message) return null;
  const styles = tone === 'error'
    ? 'bg-muni-red text-white border-muni-red'
    : tone === 'success'
      ? 'bg-muni-green text-white border-muni-green'
      : 'bg-muni-blue text-white border-muni-blue';
  return (
    <div className={`mb-6 p-4 rounded-lg shadow-xl border-l-4 ${styles} animate-in slide-in-from-top-4`}>
      <div className="flex items-center justify-between gap-4">
        <p className="text-[10px] font-black uppercase tracking-widest">{message}</p>
        <button onClick={onClose} className="text-white/90 hover:text-white font-black text-xs">✕</button>
      </div>
    </div>
  );
};

const PilotModal = ({ isOpen, onClose, bus, pilots, onAssign }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="tm-card tm-card-inset w-full max-w-md shadow-2xl p-8 relative animate-in zoom-in-95 duration-300">
        <button onClick={onClose} className="absolute top-6 right-6 text-white/50 hover:text-white/80 font-bold transition-colors">✕</button>
        <h3 className="text-xl font-black text-white/90 uppercase tracking-tight mb-4 border-b border-white/10 pb-4">Asignar Piloto: {bus.numero_unidad}</h3>
        <p className="text-[10px] text-white/45 font-bold uppercase tracking-widest mb-6 italic">Piloto Actual: {bus.piloto_nombre || 'Sin asignar'}</p>
        
        <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar mb-8 pr-2">
          {pilots.map((pilot) => (
            <div 
              key={pilot.id} 
              className="p-4 rounded border border-white/10 bg-white/6 hover:border-white/20 hover:bg-white/8 transition-all cursor-pointer group"
              onClick={() => onAssign(bus.id, pilot.id)}
            >
              <div className="flex justify-between items-center">
                <p className="text-xs font-black text-white/80 uppercase group-hover:text-white/95">{pilot.nombre} {pilot.apellido}</p>
                <span className="text-[8px] font-bold text-muni-green uppercase tracking-widest">Disponible</span>
              </div>
            </div>
          ))}
        </div>
        
        <button onClick={onClose} className="tm-btn tm-btn-secondary w-full">Cerrar</button>
      </div>
    </div>
  );
};

const BusFormModal = ({ isOpen, onClose, parqueos, lineas, estaciones, estadosCatalog, estadoInicial, onCreate }) => {
  const [form, setForm] = useState({
    numero_unidad: '',
    placa: '',
    modelo: '',
    capacidad_pasajeros: 160,
    parqueo_id: '',
    linea_id: '',
    estacion_actual_id: '',
    estado: ''
  });
  const [saving, setSaving] = useState(false);
  const [allowedLineaIds, setAllowedLineaIds] = useState([]);
  const [allowedStations, setAllowedStations] = useState([]);

  useEffect(() => {
    if (!isOpen) return;
    const initial = estadoInicial || estadosCatalog?.[0]?.codigo || '';
    setForm({
      numero_unidad: '',
      placa: '',
      modelo: '',
      capacidad_pasajeros: 160,
      parqueo_id: parqueos?.[0]?.id ? String(parqueos[0].id) : '',
      linea_id: '',
      estacion_actual_id: '',
      estado: initial
    });
    setSaving(false);
    setAllowedLineaIds([]);
    setAllowedStations(estaciones || []);
  }, [estaciones, estadoInicial, estadosCatalog, isOpen, parqueos]);

  useEffect(() => {
    let alive = true;
    if (!isOpen) return;
    const parqueoId = form.parqueo_id ? Number(form.parqueo_id) : null;
    if (!Number.isFinite(parqueoId) || parqueoId <= 0) {
      setAllowedLineaIds([]);
      return;
    }

    (async () => {
      try {
        const { data } = await api.get(`/parqueos/${parqueoId}/lineas-permitidas`);
        if (!alive) return;
        const ids = Array.isArray(data?.lineas) ? data.lineas.map((n) => Number(n)).filter((n) => Number.isFinite(n) && n > 0) : [];
        setAllowedLineaIds(ids);
        if (ids.length > 0 && form.linea_id && !ids.includes(Number(form.linea_id))) {
          setForm((f) => ({ ...f, linea_id: '', estacion_actual_id: '' }));
        }
      } catch {
        if (!alive) return;
        setAllowedLineaIds([]);
      }
    })();

    return () => {
      alive = false;
    };
  }, [form.parqueo_id, form.linea_id, isOpen]);

  useEffect(() => {
    let alive = true;
    if (!isOpen) return;
    const lineaId = form.linea_id ? Number(form.linea_id) : null;
    if (!Number.isFinite(lineaId) || lineaId <= 0) {
      setAllowedStations(estaciones || []);
      return;
    }
    (async () => {
      try {
        const { data } = await api.get(`/lineas/${lineaId}`);
        if (!alive) return;
        const nextStations = Array.isArray(data?.estaciones) ? data.estaciones : [];
        setAllowedStations(nextStations);
        if (form.estacion_actual_id) {
          const ok = nextStations.some((s) => Number(s.id) === Number(form.estacion_actual_id));
          if (!ok) setForm((f) => ({ ...f, estacion_actual_id: '' }));
        }
      } catch {
        if (!alive) return;
        setAllowedStations(estaciones || []);
      }
    })();
    return () => {
      alive = false;
    };
  }, [estaciones, form.estacion_actual_id, form.linea_id, isOpen]);

  const lineasForSelect = useMemo(() => {
    const all = Array.isArray(lineas) ? lineas : [];
    if (!allowedLineaIds || allowedLineaIds.length === 0) return all;
    const allowed = new Set(allowedLineaIds.map((n) => Number(n)));
    return all.filter((l) => allowed.has(Number(l.id)));
  }, [allowedLineaIds, lineas]);

  if (!isOpen) return null;

  const submit = async () => {
    setSaving(true);
    try {
      await onCreate({
        ...form,
        capacidad_pasajeros: Number(form.capacidad_pasajeros),
        parqueo_id: Number(form.parqueo_id),
        linea_id: form.linea_id ? Number(form.linea_id) : null,
        estacion_actual_id: form.estacion_actual_id ? Number(form.estacion_actual_id) : null
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="tm-card tm-card-inset w-full max-w-lg shadow-2xl p-8 relative animate-in zoom-in-95 duration-300">
        <button onClick={onClose} className="absolute top-6 right-6 text-white/50 hover:text-white/80 font-bold transition-colors">✕</button>
        <h3 className="text-xl font-black text-white/90 uppercase tracking-tight mb-6 border-b border-white/10 pb-4">Registrar Nueva Unidad</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[9px] font-black text-white/45 uppercase tracking-widest mb-2">Número de unidad</label>
            <input
              value={form.numero_unidad}
              onChange={(e) => setForm((f) => ({ ...f, numero_unidad: e.target.value }))}
              className="w-full tm-input"
              placeholder="U-011"
            />
          </div>
          <div>
            <label className="block text-[9px] font-black text-white/45 uppercase tracking-widest mb-2">Placa</label>
            <input
              value={form.placa}
              onChange={(e) => setForm((f) => ({ ...f, placa: e.target.value }))}
              className="w-full tm-input"
              placeholder="P-000AAA"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-[9px] font-black text-white/45 uppercase tracking-widest mb-2">Modelo</label>
            <input
              value={form.modelo}
              onChange={(e) => setForm((f) => ({ ...f, modelo: e.target.value }))}
              className="w-full tm-input"
              placeholder="Articulado 2024"
            />
          </div>
          <div>
            <label className="block text-[9px] font-black text-white/45 uppercase tracking-widest mb-2">Capacidad</label>
            <input
              type="number"
              value={form.capacidad_pasajeros}
              onChange={(e) => setForm((f) => ({ ...f, capacidad_pasajeros: e.target.value }))}
              className="w-full tm-input"
              min={1}
            />
          </div>
          <div>
            <label className="block text-[9px] font-black text-white/45 uppercase tracking-widest mb-2">Estado</label>
            <select
              value={form.estado}
              onChange={(e) => setForm((f) => ({ ...f, estado: e.target.value }))}
              className="w-full tm-select"
            >
              {(estadosCatalog || []).map((s) => (
                <option key={s.codigo} value={s.codigo}>{s.nombre || s.codigo}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-[9px] font-black text-white/45 uppercase tracking-widest mb-2">Parqueo asignado</label>
            <select
              value={form.parqueo_id}
              onChange={(e) => setForm((f) => ({ ...f, parqueo_id: e.target.value }))}
              className="w-full tm-select"
            >
              {(parqueos || []).map((p) => (
                <option key={p.id} value={String(p.id)}>{p.nombre}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-[9px] font-black text-white/45 uppercase tracking-widest mb-2">Línea (opcional)</label>
            <select
              value={form.linea_id}
              onChange={(e) => setForm((f) => ({ ...f, linea_id: e.target.value }))}
              className="w-full tm-select"
            >
              <option value="">Sin línea</option>
              {(lineasForSelect || []).map((l) => (
                <option key={l.id} value={String(l.id)}>{l.nombre}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-[9px] font-black text-white/45 uppercase tracking-widest mb-2">Estación actual (opcional)</label>
            <select
              value={form.estacion_actual_id}
              onChange={(e) => setForm((f) => ({ ...f, estacion_actual_id: e.target.value }))}
              className="w-full tm-select"
            >
              <option value="">Sin estación</option>
              {(allowedStations || []).map((e) => (
                <option key={e.id} value={String(e.id)}>
                  {(() => {
                    const s = splitStationName(e.nombre);
                    return s.detail ? `${s.main} — ${s.detail}` : s.main;
                  })()}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <button
            onClick={submit}
            disabled={saving || !form.numero_unidad || !form.placa || !form.parqueo_id}
            className="tm-btn tm-btn-primary flex-1 disabled:opacity-60"
          >
            Guardar
          </button>
          <button
            onClick={onClose}
            className="tm-btn tm-btn-secondary flex-1"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

const BusDetailsModal = ({ isOpen, onClose, bus, parqueos, lineas, estaciones, estadosCatalog, estadoInicial, onUpdateOcupacion, onSetEstacion, onSetEstado, onSetParqueo, onSetLinea, canWriteOcupacion, canWriteBuses }) => {
  const [ocupacion, setOcupacion] = useState('');
  const [estacionId, setEstacionId] = useState('');
  const [initialEstacionId, setInitialEstacionId] = useState('');
  const [initialOcupacion, setInitialOcupacion] = useState('');
  const [estado, setEstado] = useState('');
  const [initialEstado, setInitialEstado] = useState('');
  const [parqueoId, setParqueoId] = useState('');
  const [initialParqueoId, setInitialParqueoId] = useState('');
  const [lineaId, setLineaId] = useState('');
  const [initialLineaId, setInitialLineaId] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveNote, setSaveNote] = useState('');
  const [allowedLineaIds, setAllowedLineaIds] = useState([]);
  const [allowedStations, setAllowedStations] = useState([]);

  useEffect(() => {
    if (!isOpen) return;
    const nextOcupacion = String(bus?.ocupacion_actual ?? '');
    setOcupacion(nextOcupacion);
    setInitialOcupacion(nextOcupacion);
    const nextStationId = bus?.estacion_actual_id ? String(bus.estacion_actual_id) : '';
    setEstacionId(nextStationId);
    setInitialEstacionId(nextStationId);
    const nextEstado = (bus?.estado ?? estadoInicial) || estadosCatalog?.[0]?.codigo || '';
    setEstado(nextEstado);
    setInitialEstado(nextEstado);
    const nextParqueoId = bus?.parqueo_id ? String(bus.parqueo_id) : '';
    setParqueoId(nextParqueoId);
    setInitialParqueoId(nextParqueoId);
    const nextLineaId = bus?.linea_id ? String(bus.linea_id) : '';
    setLineaId(nextLineaId);
    setInitialLineaId(nextLineaId);
    setSaving(false);
    setSaveNote('');
    setAllowedLineaIds([]);
    setAllowedStations(estaciones || []);
  }, [estaciones, estadoInicial, estadosCatalog, isOpen, bus]);

  useEffect(() => {
    let alive = true;
    if (!isOpen) return;
    const parqueo = parqueoId ? Number(parqueoId) : null;
    if (!Number.isFinite(parqueo) || parqueo <= 0) {
      setAllowedLineaIds([]);
      return;
    }
    (async () => {
      try {
        const { data } = await api.get(`/parqueos/${parqueo}/lineas-permitidas`);
        if (!alive) return;
        const ids = Array.isArray(data?.lineas) ? data.lineas.map((n) => Number(n)).filter((n) => Number.isFinite(n) && n > 0) : [];
        setAllowedLineaIds(ids);
        if (ids.length > 0 && lineaId && !ids.includes(Number(lineaId))) {
          setLineaId('');
          setEstacionId('');
          setSaveNote('La línea anterior no pertenece a este parqueo. Se limpió para evitar cruces.');
        }
      } catch {
        if (!alive) return;
        setAllowedLineaIds([]);
      }
    })();
    return () => {
      alive = false;
    };
  }, [isOpen, lineaId, parqueoId]);

  useEffect(() => {
    let alive = true;
    if (!isOpen) return;
    const id = lineaId ? Number(lineaId) : null;
    if (!Number.isFinite(id) || id <= 0) {
      setAllowedStations(estaciones || []);
      return;
    }
    (async () => {
      try {
        const { data } = await api.get(`/lineas/${id}`);
        if (!alive) return;
        const nextStations = Array.isArray(data?.estaciones) ? data.estaciones : [];
        setAllowedStations(nextStations);
        if (estacionId) {
          const ok = nextStations.some((s) => Number(s.id) === Number(estacionId));
          if (!ok) {
            setEstacionId('');
            setSaveNote('La estación no pertenece a la línea seleccionada. Se limpió para evitar cruces.');
          }
        }
      } catch {
        if (!alive) return;
        setAllowedStations(estaciones || []);
      }
    })();
    return () => {
      alive = false;
    };
  }, [estacionId, estaciones, isOpen, lineaId]);

  const lineasForSelect = useMemo(() => {
    const all = Array.isArray(lineas) ? lineas : [];
    if (!allowedLineaIds || allowedLineaIds.length === 0) return all;
    const allowed = new Set(allowedLineaIds.map((n) => Number(n)));
    return all.filter((l) => allowed.has(Number(l.id)));
  }, [allowedLineaIds, lineas]);

  if (!isOpen) return null;

  const ocupacionChanged = String(ocupacion) !== String(initialOcupacion);
  const estacionChanged = String(estacionId) !== String(initialEstacionId);
  const estadoChanged = String(estado) !== String(initialEstado);
  const parqueoChanged = String(parqueoId) !== String(initialParqueoId);
  const lineaChanged = String(lineaId) !== String(initialLineaId);

  const combinedBlocked = [];
  if ((ocupacionChanged || estacionChanged) && !canWriteOcupacion) combinedBlocked.push('Ocupación/Estación');
  if ((estadoChanged || parqueoChanged || lineaChanged) && !canWriteBuses) combinedBlocked.push('Estado/Parqueo/Línea');

  const combinedHasChanges = ocupacionChanged || estacionChanged || estadoChanged || parqueoChanged || lineaChanged;
  const allowedChangeExists =
    ((ocupacionChanged || estacionChanged) && canWriteOcupacion) ||
    ((estadoChanged || parqueoChanged || lineaChanged) && canWriteBuses);
  const canSaveCombined = combinedHasChanges && allowedChangeExists;

  const submitOcupacion = async () => {
    setSaving(true);
    try {
      const payload = { ocupacion_actual: Number(ocupacion) };
      if (estacionId !== initialEstacionId) {
        payload.estacion_id = estacionId ? Number(estacionId) : null;
      }
      await onUpdateOcupacion(bus.id, payload);
      onClose();
    } catch {
      void 0;
    } finally {
      setSaving(false);
    }
  };

  const submitAll = async () => {
    setSaving(true);
    setSaveNote('');
    try {
      if ((ocupacionChanged || estacionChanged) && canWriteOcupacion) {
        if (ocupacionChanged) {
          const payload = { ocupacion_actual: Number(ocupacion) };
          if (estacionChanged) {
            payload.estacion_id = estacionId ? Number(estacionId) : null;
          }
          await onUpdateOcupacion(bus.id, payload);
        } else if (estacionChanged) {
          await onSetEstacion(bus.id, estacionId ? Number(estacionId) : null);
        }
      }

      if (estadoChanged && canWriteBuses) {
        await onSetEstado(bus.id, estado);
      }

      if (parqueoChanged && canWriteBuses) {
        await onSetParqueo(bus.id, Number(parqueoId));
      }

      if (lineaChanged && canWriteBuses) {
        await onSetLinea(bus.id, lineaId ? Number(lineaId) : null);
      }

      if (combinedBlocked.length > 0) {
        if (!canWriteOcupacion) {
          setOcupacion(initialOcupacion);
          setEstacionId(initialEstacionId);
        }
        if (!canWriteBuses) {
          setEstado(initialEstado);
          setParqueoId(initialParqueoId);
          setLineaId(initialLineaId);
        }
        setSaveNote('Se guardaron los cambios permitidos. Los demás quedaron en solo lectura.');
        return;
      }

      onClose();
    } catch {
      void 0;
    } finally {
      setSaving(false);
    }
  };

  const submitEstado = async () => {
    setSaving(true);
    try {
      await onSetEstado(bus.id, estado);
      onClose();
    } catch {
      void 0;
    } finally {
      setSaving(false);
    }
  };

  const submitParqueo = async () => {
    setSaving(true);
    try {
      await onSetParqueo(bus.id, Number(parqueoId));
      onClose();
    } catch {
      void 0;
    } finally {
      setSaving(false);
    }
  };

  const submitLinea = async () => {
    setSaving(true);
    try {
      await onSetLinea(bus.id, lineaId ? Number(lineaId) : null);
      onClose();
    } catch {
      void 0;
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="tm-card tm-card-inset w-full max-w-2xl shadow-2xl p-8 relative animate-in zoom-in-95 duration-300">
        <button onClick={onClose} className="absolute top-6 right-6 text-white/50 hover:text-white/80 font-bold transition-colors">✕</button>
        <h3 className="text-xl font-black text-white/90 uppercase tracking-tight mb-2">Detalles: {bus.numero_unidad}</h3>
        <p className="text-[10px] text-white/45 font-bold uppercase tracking-widest mb-6 italic">{bus.placa} • {bus.modelo || 'N/A'}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-lg border border-white/10 bg-white/6 p-5">
            <h4 className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-4">Ocupación / Estación</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-[9px] font-black text-white/45 uppercase tracking-widest mb-2">Ocupación actual (personas)</label>
                <input
                  type="number"
                  value={ocupacion}
                  onChange={(e) => setOcupacion(e.target.value)}
                  className="w-full tm-input"
                  min={0}
                  disabled={!canWriteOcupacion}
                />
              </div>
              <div>
                <label className="block text-[9px] font-black text-white/45 uppercase tracking-widest mb-2">Estación (opcional)</label>
                <p className="text-[10px] font-bold text-white/45 mb-2">
                  El mapa usa la estación actual. Cambiar parqueo o estado no mueve la unidad en el mapa.
                </p>
                <select
                  value={estacionId}
                  onChange={(e) => setEstacionId(e.target.value)}
                  className="w-full tm-select"
                  disabled={!canWriteOcupacion}
                >
                  <option value="">Sin estación</option>
                  {(allowedStations || []).map((e) => (
                    <option key={e.id} value={String(e.id)}>
                      {(() => {
                        const s = splitStationName(e.nombre);
                        return s.detail ? `${s.main} — ${s.detail}` : s.main;
                      })()}
                    </option>
                  ))}
                </select>
              </div>
              {canWriteOcupacion ? (
                <button
                  onClick={submitOcupacion}
                  disabled={saving || ocupacion === '' || Number(ocupacion) < 0}
                  className="tm-btn tm-btn-primary w-full disabled:opacity-60"
                >
                  Actualizar ocupación
                </button>
              ) : (
                <p className="text-[10px] font-bold text-white/45">Solo lectura (sin permiso para ocupación).</p>
              )}
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/6 p-5">
            <h4 className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-4">Estado</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-[9px] font-black text-white/45 uppercase tracking-widest mb-2">Estado del bus</label>
                <select
                  value={estado}
                  onChange={(e) => setEstado(e.target.value)}
                  className="w-full tm-select"
                  disabled={!canWriteBuses}
                >
                  {(estadosCatalog || []).map((s) => (
                    <option key={s.codigo} value={s.codigo}>{!looksCorrupt(s.nombre) ? (s.nombre || s.codigo) : s.codigo}</option>
                  ))}
                </select>
              </div>
              {canWriteBuses ? (
                <button
                  onClick={submitEstado}
                  disabled={saving || !estado}
                  className="tm-btn tm-btn-warn w-full disabled:opacity-60"
                >
                  Cambiar estado
                </button>
              ) : (
                <p className="text-[10px] font-bold text-white/45">Solo lectura (sin permiso para buses).</p>
              )}
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/6 p-5">
            <h4 className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-4">Parqueo</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-[9px] font-black text-white/45 uppercase tracking-widest mb-2">Parqueo asignado</label>
                <select
                  value={parqueoId}
                  onChange={(e) => setParqueoId(e.target.value)}
                  className="w-full tm-select"
                  disabled={!canWriteBuses}
                >
                  {(parqueos || []).map((p) => (
                    <option key={p.id} value={String(p.id)}>{p.nombre}</option>
                  ))}
                </select>
              </div>
              {canWriteBuses ? (
                <button
                  onClick={submitParqueo}
                  disabled={saving || !parqueoId}
                  className="tm-btn tm-btn-success w-full disabled:opacity-60"
                >
                  Cambiar parqueo
                </button>
              ) : null}
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/6 p-5">
            <h4 className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-4">Línea</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-[9px] font-black text-white/45 uppercase tracking-widest mb-2">Línea asignada</label>
                <select
                  value={lineaId}
                  onChange={(e) => setLineaId(e.target.value)}
                  className="w-full tm-select"
                  disabled={!canWriteBuses}
                >
                  <option value="">Sin línea</option>
                  {(lineasForSelect || []).map((l) => (
                    <option key={l.id} value={String(l.id)}>{l.nombre}</option>
                  ))}
                </select>
              </div>
              {canWriteBuses ? (
                <button
                  onClick={submitLinea}
                  disabled={saving}
                  className="tm-btn tm-btn-primary w-full disabled:opacity-60"
                >
                  Actualizar línea
                </button>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between gap-4">
          <div className="text-[10px] font-bold text-white/45">
            {saveNote ? saveNote : combinedBlocked.length > 0 ? `Sin permiso para: ${combinedBlocked.join(', ')}.` : ' '}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={submitAll}
              disabled={saving || !canSaveCombined}
              className="tm-btn tm-btn-primary disabled:opacity-60"
            >
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </button>
            <button
              onClick={onClose}
              className="tm-btn tm-btn-secondary"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Buses = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [fleet, setFleet] = useState([]);
  const [pilots, setPilots] = useState([]);
  const [parqueos, setParqueos] = useState([]);
  const [lineas, setLineas] = useState([]);
  const [estaciones, setEstaciones] = useState([]);
  const [estadosCatalog, setEstadosCatalog] = useState([]);
  const [estadoInicial, setEstadoInicial] = useState(null);
  const [selectedBus, setSelectedBus] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [notification, setNotification] = useState({ message: '', tone: 'info' });
  const [loading, setLoading] = useState(false);
  const [lastUpdatedAt, setLastUpdatedAt] = useState(null);

  const userPerms = Array.isArray(user?.permisos) ? user.permisos : [];
  const canWriteBuses = userPerms.includes('buses:write');
  const canWriteOcupacion = canWriteBuses || userPerms.includes('ocupacion:write');
  const canManage = canWriteBuses;

  const openBusIdRaw = location?.state?.openBusId;

  useEffect(() => {
    if (!openBusIdRaw) return;
    const openBusId = Number(openBusIdRaw);
    if (!Number.isFinite(openBusId)) {
      navigate(location.pathname, { replace: true, state: null });
      return;
    }
    if (!Array.isArray(fleet) || fleet.length === 0) return;
    const bus = fleet.find((b) => Number(b.id) === openBusId);
    if (!bus) return;
    setSelectedBus(bus);
    setIsDetailsOpen(true);
    navigate(location.pathname, { replace: true, state: null });
  }, [fleet, location.pathname, navigate, openBusIdRaw]);

  useEffect(() => {
    let alive = true;
    const run = async () => {
      try {
        setLoading(true);
        const [{ data: buses }, { data: pilotos }, { data: parqueosData }, { data: lineasData }, { data: estacionesData }, { data: meta }] = await Promise.all([
          api.get('/buses'),
          api.get('/pilotos'),
          api.get('/parqueos'),
          api.get('/lineas'),
          api.get('/estaciones'),
          api.get('/buses/meta')
        ]);
        if (!alive) return;
        setFleet(buses || []);
        setPilots(pilotos || []);
        setParqueos(parqueosData || []);
        setLineas(lineasData || []);
        setEstaciones(estacionesData || []);
        setEstadosCatalog(meta?.estados || []);
        setEstadoInicial(meta?.config?.bus_estado_inicial || null);
        setLastUpdatedAt(new Date());
      } catch {
        if (!alive) return;
        setNotification({ tone: 'error', message: 'No se pudo cargar la flota.' });
      } finally {
        if (alive) setLoading(false);
      }
    };
    run();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    let alive = true;
    const interval = setInterval(() => {
      const busy = isModalOpen || isCreateOpen || isDetailsOpen;
      if (busy) return;
      (async () => {
        try {
          const { data } = await api.get('/buses');
          if (!alive) return;
          setFleet(data || []);
          setLastUpdatedAt(new Date());
        } catch (err) {
          void err;
        }
      })();
    }, 5000);
    return () => {
      alive = false;
      clearInterval(interval);
    };
  }, [isModalOpen, isCreateOpen, isDetailsOpen]);

  const getStatusBadge = (estado) => {
    const item = (estadosCatalog || []).find((s) => String(s.codigo) === String(estado));
    const cls = item?.ui_class || 'bg-white/8 text-white/60 border border-white/10';
    const label = item?.nombre && !looksCorrupt(item.nombre) ? item.nombre : (item?.codigo || estado);
    return <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${cls}`}>{label}</span>;
  };

  const handleRotatePilot = (bus) => {
    setSelectedBus(bus);
    setIsModalOpen(true);
  };

  const applyBusUpdate = (updatedBus) => {
    if (!updatedBus || !updatedBus.id) return;
    setFleet((prev) => (prev || []).map((b) => (Number(b.id) === Number(updatedBus.id) ? { ...b, ...updatedBus } : b)));
    setSelectedBus((prev) => (prev && Number(prev.id) === Number(updatedBus.id) ? { ...prev, ...updatedBus } : prev));
    setLastUpdatedAt(new Date());
  };

  const handleAssignPilot = async (busId, pilotoId) => {
    try {
      const { data } = await api.put(`/buses/${busId}/piloto`, { piloto_id: pilotoId });
      applyBusUpdate(data);
      setNotification({ tone: 'success', message: 'Piloto asignado correctamente.' });
    } catch {
      setNotification({ tone: 'error', message: 'No se pudo asignar el piloto.' });
    } finally {
      setIsModalOpen(false);
    }
  };

  const reload = async () => {
    const [{ data: buses }, { data: pilotos }, { data: parqueosData }, { data: lineasData }, { data: estacionesData }] = await Promise.all([
      api.get('/buses'),
      api.get('/pilotos'),
      api.get('/parqueos'),
      api.get('/lineas'),
      api.get('/estaciones')
    ]);
    setFleet(buses || []);
    setPilots(pilotos || []);
    setParqueos(parqueosData || []);
    setLineas(lineasData || []);
    setEstaciones(estacionesData || []);
  };

  const handleCreateBus = async (payload) => {
    try {
      await api.post('/buses', payload);
      await reload();
      setNotification({ tone: 'success', message: 'Unidad registrada correctamente.' });
    } catch (err) {
      const msg = err?.response?.data?.message || 'No se pudo registrar la unidad.';
      setNotification({ tone: 'error', message: msg });
      throw err;
    }
  };

  const handleUpdateOcupacion = async (busId, payload) => {
    try {
      const { data } = await api.put(`/buses/${busId}/ocupacion`, payload);
      if (data?.bus) applyBusUpdate(data.bus);
      const alertas = data?.alertas || [];
      if (alertas.length > 0) {
        setNotification({ tone: 'info', message: alertas[0].mensaje });
      } else {
        setNotification({ tone: 'success', message: 'Ocupación actualizada.' });
      }
    } catch (err) {
      const msg = err?.response?.data?.message || 'No se pudo actualizar la ocupación.';
      setNotification({ tone: 'error', message: msg });
      throw err;
    }
  };

  const handleSetEstacion = async (busId, estacionId) => {
    try {
      const { data } = await api.put(`/buses/${busId}/estacion`, { estacion_id: estacionId });
      applyBusUpdate(data);
      setNotification({ tone: 'success', message: 'Ubicación actualizada.' });
    } catch (err) {
      const msg = err?.response?.data?.message || 'No se pudo actualizar la ubicación.';
      setNotification({ tone: 'error', message: msg });
      throw err;
    }
  };

  const handleSetEstado = async (busId, estado) => {
    try {
      const { data } = await api.put(`/buses/${busId}/estado`, { estado });
      applyBusUpdate(data);
      setNotification({ tone: 'success', message: 'Estado actualizado.' });
    } catch (err) {
      const msg = err?.response?.data?.message || 'No se pudo actualizar el estado.';
      setNotification({ tone: 'error', message: msg });
      throw err;
    }
  };

  const handleSetParqueo = async (busId, parqueoId) => {
    try {
      const { data } = await api.put(`/buses/${busId}/parqueo`, { parqueo_id: parqueoId });
      applyBusUpdate(data);
      setNotification({ tone: 'success', message: 'Parqueo actualizado.' });
    } catch (err) {
      const msg = err?.response?.data?.message || 'No se pudo actualizar el parqueo.';
      setNotification({ tone: 'error', message: msg });
      throw err;
    }
  };

  const handleSetLinea = async (busId, lineaId) => {
    try {
      const { data } = await api.put(`/buses/${busId}/linea`, { linea_id: lineaId });
      applyBusUpdate(data);
      setNotification({ tone: 'success', message: 'Línea actualizada.' });
    } catch (err) {
      const msg = err?.response?.data?.message || 'No se pudo actualizar la línea.';
      setNotification({ tone: 'error', message: msg });
      throw err;
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <Notification
        message={notification.message}
        tone={notification.tone}
        onClose={() => setNotification({ tone: 'info', message: '' })}
      />

      <PilotModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        bus={selectedBus || {}} 
        pilots={pilots} 
        onAssign={handleAssignPilot} 
      />

      <BusFormModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        parqueos={parqueos}
        lineas={lineas}
        estaciones={estaciones}
        estadosCatalog={estadosCatalog}
        estadoInicial={estadoInicial}
        onCreate={handleCreateBus}
      />

      <BusDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        bus={selectedBus || {}}
        parqueos={parqueos}
        lineas={lineas}
        estaciones={estaciones}
        estadosCatalog={estadosCatalog}
        estadoInicial={estadoInicial}
        onUpdateOcupacion={handleUpdateOcupacion}
        onSetEstacion={handleSetEstacion}
        onSetEstado={handleSetEstado}
        onSetParqueo={handleSetParqueo}
        onSetLinea={handleSetLinea}
        canWriteOcupacion={canWriteOcupacion}
        canWriteBuses={canWriteBuses}
      />

      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-2xl font-black text-white/90 tracking-tight uppercase italic">Gestión de Flota</h2>
          <p className="text-[10px] text-white/45 font-bold uppercase tracking-[0.2em] mt-1">Diagnóstico de Unidades y Asignación de Pilotos</p>
          <p className="mt-2 text-[9px] font-bold text-white/45 uppercase tracking-widest">
            {lastUpdatedAt ? `Actualizado: ${lastUpdatedAt.toLocaleTimeString()}` : 'Actualizado: —'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={async () => {
              setNotification({ tone: 'info', message: '' });
              setLoading(true);
              try {
                await reload();
                setLastUpdatedAt(new Date());
              } catch {
                setNotification({ tone: 'error', message: 'No se pudo actualizar la flota.' });
              } finally {
                setLoading(false);
              }
            }}
            disabled={loading}
            className="tm-btn tm-btn-sm tm-btn-ghost"
          >
            {loading ? 'Actualizando...' : 'Actualizar'}
          </button>
          {canManage && (
            <button
              onClick={() => setIsCreateOpen(true)}
              className="tm-btn tm-btn-primary"
            >
              + Registrar Nueva Unidad
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="tm-card tm-card-inset shadow-sm overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="min-w-[980px] w-full text-left">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 text-[11px] font-black text-white/45 uppercase tracking-widest">Unidad</th>
                  <th className="px-6 py-4 text-[11px] font-black text-white/45 uppercase tracking-widest">Línea / Estación</th>
                  <th className="px-6 py-4 text-[11px] font-black text-white/45 uppercase tracking-widest">Parqueo</th>
                  <th className="px-6 py-4 text-[11px] font-black text-white/45 uppercase tracking-widest">Piloto</th>
                  <th className="px-6 py-4 text-[11px] font-black text-white/45 uppercase tracking-widest">Estado</th>
                  <th className="px-6 py-4 text-[11px] font-black text-white/45 uppercase tracking-widest">Ocupación</th>
                  <th className="px-6 py-4 text-[11px] font-black text-white/45 uppercase tracking-widest text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {fleet.map((unit) => {
                  const pct = unit.capacidad_pasajeros > 0 ? Math.round((unit.ocupacion_actual / unit.capacidad_pasajeros) * 100) : 0;
                  const barColor = pct >= 150 ? 'bg-muni-red' : pct > 80 ? 'bg-muni-orange' : 'bg-muni-green';
                  return (
                    <tr key={unit.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="space-y-0.5">
                          <p className="text-sm font-black text-white/90">{unit.numero_unidad}</p>
                          <p className="text-[11px] font-bold text-white/45">{unit.placa}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-white/80 truncate max-w-[320px]" title={unit.linea_nombre || 'Sin línea'}>
                            {unit.linea_nombre || 'Sin línea'}
                          </p>
                          {(() => {
                            const s = splitStationName(unit.estacion_actual_nombre);
                            if (!s.full) return <p className="text-[11px] font-bold text-white/45">Sin estación</p>;
                            return (
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-[11px] font-bold text-white/55 truncate max-w-[320px]" title={s.full}>
                                  {s.main}
                                </span>
                                {s.detail && (
                                  <span className="text-[9px] font-black text-white/55 uppercase tracking-widest bg-white/8 border border-white/10 rounded px-2 py-1">
                                    {s.detail}
                                  </span>
                                )}
                              </div>
                            );
                          })()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-white/75 truncate max-w-[220px]" title={unit.parqueo_nombre || '—'}>
                          {unit.parqueo_nombre || '—'}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-white/75">{unit.piloto_nombre || 'Sin asignar'}</p>
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(unit.estado)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-28 h-2 bg-white/10 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full transition-all duration-700 ${barColor}`} style={{ width: `${Math.min(100, pct)}%` }}></div>
                            </div>
                            <span className="text-[12px] font-black text-white/70">{pct}%</span>
                          </div>
                          <span className="text-[11px] font-bold text-white/45">
                            {Number(unit.ocupacion_actual || 0)}/{Number(unit.capacidad_pasajeros || 0)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          {canManage && (
                            <button 
                              onClick={() => handleRotatePilot(unit)}
                              className="tm-btn tm-btn-xs tm-btn-warn"
                            >
                              Rotar piloto
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setSelectedBus(unit);
                              setIsDetailsOpen(true);
                            }}
                            className="tm-btn tm-btn-xs tm-btn-secondary"
                          >
                            Detalles
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {fleet.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-sm font-bold text-white/45">
                      Sin unidades registradas.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="tm-card tm-card-inset p-8">
          <h3 className="text-[9px] font-black text-white/55 uppercase tracking-[0.3em] mb-6 italic">Resumen</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[9px] font-black text-white/55 uppercase tracking-widest">Total</p>
              <p className="text-3xl font-black text-white italic tracking-tighter">{fleet.length}</p>
            </div>
            <div>
              <p className="text-[9px] font-black text-white/55 uppercase tracking-widest">Mantenimiento</p>
              <p className="text-3xl font-black text-muni-orange italic tracking-tighter">
                {fleet.filter((b) => String(b.estado) === 'Mantenimiento').length}
              </p>
            </div>
            <div>
              <p className="text-[9px] font-black text-white/55 uppercase tracking-widest">En ruta</p>
              <p className="text-3xl font-black text-muni-green italic tracking-tighter">
                {fleet.filter((b) => String(b.estado) === 'EnRuta').length}
              </p>
            </div>
            <div>
              <p className="text-[9px] font-black text-white/55 uppercase tracking-widest">En estación</p>
              <p className="text-3xl font-black text-white italic tracking-tighter">
                {fleet.filter((b) => String(b.estado) === 'EnEstacion').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="tm-card tm-card-inset p-8">
          <h3 className="text-[9px] font-black text-white/45 uppercase tracking-[0.3em] mb-6 italic">Ocupación Promedio</h3>
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-3xl font-black text-muni-cyan italic tracking-tighter">
                {(() => {
                  const items = fleet.filter((b) => Number.isFinite(Number(b.capacidad_pasajeros)) && Number(b.capacidad_pasajeros) > 0);
                  if (items.length === 0) return '0%';
                  const avg = items.reduce((acc, b) => acc + (Number(b.ocupacion_actual) / Number(b.capacidad_pasajeros)), 0) / items.length;
                  return `${(avg * 100).toFixed(1)}%`;
                })()}
              </p>
              <p className="text-[10px] font-bold text-white/45">Basado en capacidad y ocupación actual.</p>
            </div>
            <div className="w-14 h-14 rounded-full border-2 border-white/15 border-t-muni-cyan animate-spin"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Buses;
