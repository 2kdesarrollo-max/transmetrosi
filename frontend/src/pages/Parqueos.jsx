import React, { useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import emojitransmetro from '../../pictures/emojitransmetro.png';

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

export default function Parqueos() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const userPerms = Array.isArray(user?.permisos) ? user.permisos : [];
  const canWriteBuses = userPerms.includes('buses:write');
  const canWriteOcupacion = canWriteBuses || userPerms.includes('ocupacion:write');
  const canWriteParqueos = canWriteBuses;
  const canConfigParqueos = userPerms.includes('parqueos:write');

  const [parqueos, setParqueos] = useState([]);
  const [fleet, setFleet] = useState([]);
  const [lineas, setLineas] = useState([]);
  const [estaciones, setEstaciones] = useState([]);
  const [estadosCatalog, setEstadosCatalog] = useState([]);

  const [selectedParqueoId, setSelectedParqueoId] = useState('');
  const [viewMode, setViewMode] = useState('yard');
  const [layoutMode, setLayoutMode] = useState('map');
  const [mapZoom, setMapZoom] = useState(1);
  const [restrictByLinea, setRestrictByLinea] = useState(false);
  const [allowedLineaIds, setAllowedLineaIds] = useState([]);
  const [savingAllowed, setSavingAllowed] = useState(false);
  const [notification, setNotification] = useState({ tone: 'info', message: '' });
  const [loading, setLoading] = useState(false);
  const [lastUpdatedAt, setLastUpdatedAt] = useState(null);

  const load = async () => {
    const [{ data: parqueosData }, { data: buses }, { data: lineasData }, { data: estacionesData }, { data: meta }] = await Promise.all([
      api.get('/parqueos'),
      api.get('/buses'),
      api.get('/lineas'),
      api.get('/estaciones'),
      api.get('/buses/meta')
    ]);
    setParqueos(parqueosData || []);
    setFleet(buses || []);
    setLineas(lineasData || []);
    setEstaciones(estacionesData || []);
    setEstadosCatalog(meta?.estados || []);
    setLastUpdatedAt(new Date());
  };

  useEffect(() => {
    let alive = true;
    const run = async () => {
      try {
        setLoading(true);
        await load();
      } catch (err) {
        if (!alive) return;
        const msg = err?.response?.data?.message || 'No se pudieron cargar los parqueos.';
        setNotification({ tone: 'error', message: msg });
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
    if (selectedParqueoId) return;
    const first = parqueos?.[0]?.id;
    if (first) setSelectedParqueoId(String(first));
  }, [parqueos, selectedParqueoId]);

  useEffect(() => {
    let alive = true;
    const id = Number(selectedParqueoId);
    if (!Number.isFinite(id) || id <= 0) return;

    (async () => {
      try {
        const { data } = await api.get(`/parqueos/${id}/lineas-permitidas`);
        if (!alive) return;
        const ids = Array.isArray(data?.lineas) ? data.lineas.map((n) => Number(n)).filter((n) => Number.isFinite(n) && n > 0) : [];
        setAllowedLineaIds(ids);
        setRestrictByLinea(ids.length > 0);
      } catch (err) {
        if (!alive) return;
        const msg = err?.response?.data?.message || 'No se pudieron cargar las líneas permitidas.';
        setNotification({ tone: 'error', message: msg });
        setAllowedLineaIds([]);
        setRestrictByLinea(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [selectedParqueoId]);

  useEffect(() => {
    let alive = true;
    const interval = setInterval(() => {
      if (loading) return;
      (async () => {
        try {
          const { data } = await api.get('/buses');
          if (!alive) return;
          setFleet(data || []);
          setLastUpdatedAt(new Date());
        } catch {
          void 0;
        }
      })();
    }, 5000);
    return () => {
      alive = false;
      clearInterval(interval);
    };
  }, [loading]);

  const selectedParqueo = useMemo(() => {
    const id = Number(selectedParqueoId);
    return (parqueos || []).find((p) => Number(p.id) === id) || null;
  }, [parqueos, selectedParqueoId]);

  const assignedBuses = useMemo(() => {
    const id = Number(selectedParqueoId);
    if (!Number.isFinite(id)) return [];
    return (fleet || []).filter((b) => Number(b.parqueo_id) === id);
  }, [fleet, selectedParqueoId]);

  const yardBuses = useMemo(() => {
    return (assignedBuses || []).filter((b) => !b.estacion_actual_id);
  }, [assignedBuses]);

  const networkBuses = useMemo(() => {
    return (assignedBuses || []).filter((b) => Boolean(b.estacion_actual_id));
  }, [assignedBuses]);

  const parqueoBuses = useMemo(() => {
    if (viewMode === 'all') return assignedBuses;
    if (viewMode === 'network') return networkBuses;
    return yardBuses;
  }, [assignedBuses, networkBuses, viewMode, yardBuses]);

  const allowedLineasForSelect = useMemo(() => {
    const all = Array.isArray(lineas) ? lineas : [];
    if (!restrictByLinea) return all;
    const allowed = new Set((allowedLineaIds || []).map((n) => Number(n)));
    return all.filter((l) => allowed.has(Number(l.id)));
  }, [allowedLineaIds, lineas, restrictByLinea]);

  const columns = useMemo(() => {
    const fromCatalog = Array.isArray(estadosCatalog) ? estadosCatalog : [];
    const ordered = [...fromCatalog].sort((a, b) => Number(a.orden ?? 0) - Number(b.orden ?? 0));
    const activeCodes = new Set(parqueoBuses.map((b) => String(b.estado)));
    const filtered = ordered.filter((s) => activeCodes.has(String(s.codigo)));
    const fallback = Array.from(activeCodes).map((codigo) => ({ codigo, nombre: codigo, ui_class: 'bg-white/8 text-white/70 border border-white/10', orden: 999 }));
    const merged = filtered.length > 0 ? filtered : fallback;
    return merged.slice(0, 5);
  }, [estadosCatalog, parqueoBuses]);

  const getLineaName = (lineaId) => (lineas || []).find((l) => Number(l.id) === Number(lineaId))?.nombre || 'Sin línea';
  const getEstacionName = (estacionId) => (estaciones || []).find((e) => Number(e.id) === Number(estacionId))?.nombre || 'Sin estación';

  const applyBusUpdate = (updatedBus) => {
    if (!updatedBus || !updatedBus.id) return;
    setFleet((prev) => (prev || []).map((b) => (Number(b.id) === Number(updatedBus.id) ? { ...b, ...updatedBus } : b)));
    setLastUpdatedAt(new Date());
  };

  const setEstado = async (busId, estado) => {
    try {
      const { data } = await api.put(`/buses/${busId}/estado`, { estado });
      applyBusUpdate(data);
      setNotification({ tone: 'success', message: 'Estado actualizado.' });
    } catch (err) {
      const msg = err?.response?.data?.message || 'No se pudo actualizar el estado.';
      setNotification({ tone: 'error', message: msg });
    }
  };

  const setParqueo = async (busId, parqueoId) => {
    try {
      const { data } = await api.put(`/buses/${busId}/parqueo`, { parqueo_id: parqueoId });
      applyBusUpdate(data);
      setNotification({ tone: 'success', message: 'Parqueo actualizado.' });
    } catch (err) {
      const msg = err?.response?.data?.message || 'No se pudo actualizar el parqueo.';
      setNotification({ tone: 'error', message: msg });
    }
  };

  const setLinea = async (busId, lineaId) => {
    try {
      const { data } = await api.put(`/buses/${busId}/linea`, { linea_id: lineaId });
      applyBusUpdate(data);
      setNotification({ tone: 'success', message: 'Línea actualizada.' });
    } catch (err) {
      const msg = err?.response?.data?.message || 'No se pudo actualizar la línea.';
      setNotification({ tone: 'error', message: msg });
    }
  };

  const setEstacion = async (busId, estacionId) => {
    try {
      const { data } = await api.put(`/buses/${busId}/estacion`, { estacion_id: estacionId });
      applyBusUpdate(data);
      setNotification({ tone: 'success', message: 'Ubicación actualizada.' });
    } catch (err) {
      const msg = err?.response?.data?.message || 'No se pudo actualizar la ubicación.';
      setNotification({ tone: 'error', message: msg });
    }
  };

  const resumen = useMemo(() => {
    const total = parqueoBuses.length;
    const byEstado = new Map();
    for (const b of parqueoBuses) {
      const k = String(b.estado ?? '');
      byEstado.set(k, (byEstado.get(k) ?? 0) + 1);
    }
    return {
      total,
      byEstado,
      assigned_total: assignedBuses.length,
      yard_total: yardBuses.length,
      network_total: networkBuses.length
    };
  }, [assignedBuses, networkBuses, parqueoBuses, yardBuses]);

  const parqueoCapacidad = useMemo(() => {
    const cap = Number(selectedParqueo?.capacidad ?? 0);
    return Number.isFinite(cap) && cap > 0 ? Math.floor(cap) : 0;
  }, [selectedParqueo]);

  const parqueoUso = useMemo(() => {
    const cap = parqueoCapacidad;
    const used = assignedBuses.length;
    if (!cap) return { used, cap: 0, pct: null };
    const pct = Math.max(0, Math.min(100, Math.round((used / cap) * 100)));
    return { used, cap, pct };
  }, [assignedBuses.length, parqueoCapacidad]);

  const mapBuses = useMemo(() => {
    const items = Array.isArray(yardBuses) ? [...yardBuses] : [];
    items.sort((a, b) => String(a.numero_unidad || '').localeCompare(String(b.numero_unidad || ''), 'es', { numeric: true }));
    return items;
  }, [yardBuses]);

  const slotTone = (bus) => {
    const pct = bus?.capacidad_pasajeros > 0 ? Math.round((Number(bus.ocupacion_actual || 0) / Number(bus.capacidad_pasajeros || 0)) * 100) : 0;
    if (pct >= 80) return { card: 'bg-muni-red/20 border-muni-red/50', chip: 'bg-muni-red text-white' };
    if (pct >= 50) return { card: 'bg-muni-orange/20 border-muni-orange/50', chip: 'bg-muni-orange text-white' };
    return { card: 'bg-muni-green/20 border-muni-green/50', chip: 'bg-muni-green text-white' };
  };

  const slotSize = useMemo(() => {
    const z = Math.max(0.8, Math.min(1.6, Number(mapZoom) || 1));
    const w = Math.round(76 * z);
    const h = Math.round(36 * z);
    return { w, h, z };
  }, [mapZoom]);

  const renderStall = ({ slotIndex, bus }) => {
    const occPct = bus?.capacidad_pasajeros > 0 ? Math.round((Number(bus.ocupacion_actual || 0) / Number(bus.capacidad_pasajeros || 0)) * 100) : 0;
    const tone = bus ? slotTone(bus) : null;
    const unitLabel = String(bus?.numero_unidad || '').replace(/\s+/g, '');

    return (
      <button
        key={slotIndex}
        type="button"
        onClick={() => {
          if (!bus?.id) return;
          navigate('/buses', { state: { openBusId: bus.id } });
        }}
        className={`relative rounded-xl border shadow-sm transition-all ${
          bus
            ? `${tone.card} hover:shadow-md hover:border-white/25`
            : 'bg-white/6 border-white/10 hover:border-white/20'
        }`}
        style={{ width: `${slotSize.w}px`, height: `${slotSize.h}px` }}
        title={bus ? `${unitLabel} • ${Math.max(0, occPct)}%` : `Espacio ${slotIndex}`}
      >
        <div className="absolute inset-0 rounded-xl overflow-hidden">
          <div className="absolute left-1 top-2 bottom-2 w-[2px] bg-white/10" />
          <div className="absolute right-1 top-2 bottom-2 w-[2px] bg-white/10" />
        </div>

        <div className="absolute -top-2 left-2 px-2 py-1 rounded bg-white/10 border border-white/10 text-[8px] font-black text-white/80">
          {slotIndex.toString().padStart(2, '0')}
        </div>

        {bus ? (
          <>
            <div className="absolute left-2 top-2 flex items-center gap-2">
              <span className="h-7 w-7 rounded-lg border border-white/10 bg-white/10 flex items-center justify-center shadow-sm">
                <img src={emojitransmetro} alt="Bus" className="w-5 h-auto opacity-90" />
              </span>
              <div className="min-w-0 text-left">
                <div className="text-[10px] font-black text-white/90 uppercase tracking-widest leading-none truncate">{unitLabel}</div>
                <div className="mt-1 flex items-center gap-2">
                  <span className={`px-2 py-[2px] rounded ${tone.chip} text-[9px] font-black leading-none`}>{Math.max(0, occPct)}%</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[9px] font-black text-white/55 uppercase tracking-widest">Libre</span>
          </div>
        )}
      </button>
    );
  };

  const renderZone = (label, startIndex, count, accent) => {
    const stallsPerRow = Math.max(8, Math.min(14, Math.round(10 + (slotSize.z - 1) * 2)));
    const groupSize = stallsPerRow * 2;
    const groups = Math.ceil(count / groupSize);
    const buses = mapBuses;

    return (
      <div className="tm-card tm-card-inset shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-white/10 bg-white/4">
          <div className="flex items-end justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[9px] font-black text-white/45 uppercase tracking-widest">Zona</p>
              <div className="flex items-baseline gap-3">
                <h3 className="text-3xl font-black text-white/90 tracking-tight uppercase italic truncate">{label}</h3>
                <span className={`h-2 w-20 rounded-full ${accent}`} />
              </div>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-black text-white/45 uppercase tracking-widest">Espacios</p>
              <p className="text-xl font-black text-white/90 tracking-tighter">{count}</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {Array.from({ length: groups }).map((_, g) => {
            const groupStart = startIndex + g * groupSize;
            const remaining = Math.max(0, count - g * groupSize);
            const topCount = Math.min(stallsPerRow, remaining);
            const bottomCount = Math.min(stallsPerRow, Math.max(0, remaining - stallsPerRow));

            return (
              <div key={g} className="rounded-2xl border border-white/10 bg-white/4 overflow-hidden">
                <div className="px-4 py-3 bg-white/4 border-b border-white/10 flex items-center justify-between">
                  <p className="text-[9px] font-black text-white/55 uppercase tracking-widest">Bloque {g + 1}</p>
                  <p className="text-[9px] font-black text-white/45 uppercase tracking-widest">
                    {Math.min(remaining, groupSize)}/{groupSize}
                  </p>
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-center gap-2 flex-wrap">
                    {Array.from({ length: topCount }).map((_, i) => {
                      const slotIndex = groupStart + i + 1;
                      const bus = buses[slotIndex - 1] || null;
                      return renderStall({ slotIndex, bus });
                    })}
                  </div>

                  <div className="my-4 h-10 rounded-xl bg-white/6 border border-white/10 flex items-center justify-between px-4">
                    <span className="text-[9px] font-black text-white/45 uppercase tracking-widest">Vía de circulación</span>
                    <span className="text-[9px] font-black text-white/55 uppercase tracking-widest">←  ↔  →</span>
                  </div>

                  <div className="flex items-center justify-center gap-2 flex-wrap">
                    {Array.from({ length: bottomCount }).map((_, i) => {
                      const slotIndex = groupStart + stallsPerRow + i + 1;
                      const bus = buses[slotIndex - 1] || null;
                      return renderStall({ slotIndex, bus });
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="animate-in fade-in duration-500 pb-12">
      <Notification
        message={notification.message}
        tone={notification.tone}
        onClose={() => setNotification({ tone: 'info', message: '' })}
      />

      <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white/90 tracking-tight uppercase italic">Parqueos</h2>
          <p className="text-[10px] text-white/45 font-bold uppercase tracking-[0.2em] mt-1">
            Unidades asignadas y ubicación (patio vs red)
          </p>
          <p className="mt-2 text-[9px] font-bold text-white/45 uppercase tracking-widest">
            {lastUpdatedAt ? `Actualizado: ${lastUpdatedAt.toLocaleTimeString()}` : 'Actualizado: —'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedParqueoId}
            onChange={(e) => setSelectedParqueoId(e.target.value)}
            className="tm-select min-w-[260px]"
          >
            {(parqueos || []).map((p) => (
              <option key={p.id} value={String(p.id)}>{p.nombre}</option>
            ))}
          </select>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setLayoutMode('map')}
              className={`tm-btn tm-btn-sm ${layoutMode === 'map' ? 'tm-btn-primary' : 'tm-btn-ghost'}`}
            >
              Mapa
            </button>
            <button
              type="button"
              onClick={() => setLayoutMode('kanban')}
              className={`tm-btn tm-btn-sm ${layoutMode === 'kanban' ? 'tm-btn-primary' : 'tm-btn-ghost'}`}
            >
              Tablero
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setViewMode('yard')}
              className={`tm-btn tm-btn-sm ${viewMode === 'yard' ? 'tm-btn-primary' : 'tm-btn-ghost'}`}
            >
              En parqueo ({resumen.yard_total})
            </button>
            <button
              type="button"
              onClick={() => setViewMode('network')}
              className={`tm-btn tm-btn-sm ${viewMode === 'network' ? 'tm-btn-primary' : 'tm-btn-ghost'}`}
            >
              En red ({resumen.network_total})
            </button>
            <button
              type="button"
              onClick={() => setViewMode('all')}
              className={`tm-btn tm-btn-sm ${viewMode === 'all' ? 'tm-btn-primary' : 'tm-btn-ghost'}`}
            >
              Todas ({resumen.assigned_total})
            </button>
          </div>
          <button
            onClick={async () => {
              setNotification({ tone: 'info', message: '' });
              setLoading(true);
              try {
                await load();
              } catch {
                setNotification({ tone: 'error', message: 'No se pudo actualizar.' });
              } finally {
                setLoading(false);
              }
            }}
            disabled={loading}
            className="tm-btn tm-btn-sm tm-btn-ghost"
          >
            {loading ? 'Actualizando...' : 'Actualizar'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="tm-card tm-card-inset p-6 shadow-sm">
          <p className="text-[9px] font-black text-white/45 uppercase tracking-widest">Parqueo</p>
          <p className="text-lg font-black text-white/90 uppercase italic truncate" title={selectedParqueo?.nombre || '—'}>
            {selectedParqueo?.nombre || '—'}
          </p>
        </div>
        <div className="tm-card tm-card-inset p-6 shadow-sm">
          <p className="text-[9px] font-black text-white/45 uppercase tracking-widest">Unidades (vista)</p>
          <p className="text-3xl font-black text-muni-cyan italic tracking-tighter">{resumen.total}</p>
          <p className="mt-1 text-[10px] font-bold text-white/45">
            Asignadas: {resumen.assigned_total} • En parqueo: {resumen.yard_total} • En red: {resumen.network_total}
          </p>
        </div>
        <div className="tm-card tm-card-inset p-6 shadow-sm">
          <p className="text-[9px] font-black text-white/45 uppercase tracking-widest">En ruta</p>
          <p className="text-3xl font-black text-muni-green italic tracking-tighter">{resumen.byEstado.get('EnRuta') ?? 0}</p>
        </div>
        <div className="tm-card tm-card-inset p-6 shadow-sm">
          <p className="text-[9px] font-black text-white/45 uppercase tracking-widest">Mantenimiento</p>
          <p className="text-3xl font-black text-muni-orange italic tracking-tighter">{resumen.byEstado.get('Mantenimiento') ?? 0}</p>
        </div>
      </div>

      {layoutMode === 'map' && (
        <div className="tm-card tm-card-inset shadow-sm overflow-hidden mb-8">
          <div className="px-6 py-5 border-b border-white/10 bg-white/4">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[9px] font-black text-white/45 uppercase tracking-widest">Mapa de Parqueo</p>
                <p className="text-sm font-black text-white/80 truncate">
                  {selectedParqueo?.nombre || '—'} • Capacidad: {parqueoCapacidad || '—'} • Unidades en patio: {resumen.yard_total}
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <div className="h-2.5 w-56 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${parqueoUso.pct !== null && parqueoUso.pct >= 100 ? 'bg-muni-red' : 'bg-muni-blue'}`}
                      style={{ width: `${parqueoUso.pct ?? 0}%` }}
                    />
                  </div>
                  <div className={`text-[9px] font-black uppercase tracking-widest ${parqueoUso.pct !== null && parqueoUso.pct >= 100 ? 'text-muni-red' : 'text-white/55'}`}>
                    Ocupación parqueo: {parqueoUso.used}{parqueoUso.cap ? `/${parqueoUso.cap} (${parqueoUso.pct}%)` : ''}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-[8px] font-black text-white/45 uppercase tracking-widest">Zoom</span>
                  <input
                    type="range"
                    min="0.8"
                    max="1.6"
                    step="0.1"
                    value={mapZoom}
                    onChange={(e) => setMapZoom(Number(e.target.value))}
                    className="w-36"
                  />
                  <span className="text-[9px] font-black text-white/55 w-10 text-right">{slotSize.z.toFixed(1)}x</span>
                </div>
                <div className="h-6 w-px bg-white/10" />
                <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest">
                  <span className="px-2 py-1 rounded border border-white/10 bg-white/8 text-white/70">P libre</span>
                  <span className="px-2 py-1 rounded border border-muni-green/30 bg-muni-green/10 text-muni-green">Baja</span>
                  <span className="px-2 py-1 rounded border border-muni-orange/30 bg-muni-orange/10 text-muni-orange">Normal</span>
                  <span className="px-2 py-1 rounded border border-muni-red/30 bg-muni-red/10 text-muni-red">Alta</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white/2">
            <div className="flex items-center justify-between mb-5">
              <div className="text-white/70 text-[9px] font-black uppercase tracking-[0.3em]">
                Main entrance →
              </div>
              <div className="text-white/45 text-[9px] font-black uppercase tracking-[0.3em]">
                Vista: Patio (sin estación)
              </div>
            </div>

            {parqueoCapacidad <= 0 ? (
              <div className="tm-card tm-card-inset p-8">
                <p className="text-[10px] font-black text-white/60 uppercase tracking-widest">Este parqueo no tiene capacidad configurada.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {(() => {
                  const a = Math.ceil(parqueoCapacidad / 2);
                  const b = Math.max(0, parqueoCapacidad - a);
                  return (
                    <>
                      {renderZone('A', 0, a, 'bg-muni-green')}
                      {b > 0 && renderZone('B', a, b, 'bg-muni-orange')}
                    </>
                  );
                })()}
              </div>
            )}

            {mapBuses.length > parqueoCapacidad && (
              <div className="mt-6 rounded-2xl border border-muni-red/30 bg-muni-red/10 p-5">
                <p className="text-[10px] font-black text-muni-red uppercase tracking-widest">
                  Exceso de unidades: {mapBuses.length} en patio vs capacidad {parqueoCapacidad}.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="tm-card tm-card-inset p-6 shadow-sm mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-[9px] font-black text-white/45 uppercase tracking-widest">Regla de líneas por parqueo</p>
            <p className="text-sm font-black text-white/80">
              {restrictByLinea ? 'Restringido: solo líneas seleccionadas' : 'Sin restricción: todas las líneas'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setRestrictByLinea((v) => !v)}
              disabled={!canConfigParqueos}
              className={`tm-btn tm-btn-sm ${restrictByLinea ? 'tm-btn-primary' : 'tm-btn-ghost'} disabled:opacity-60`}
            >
              {restrictByLinea ? 'Restricción ON' : 'Restricción OFF'}
            </button>
            <button
              type="button"
              onClick={async () => {
                const id = Number(selectedParqueoId);
                if (!Number.isFinite(id) || id <= 0) return;
                if (!canConfigParqueos) return;
                if (restrictByLinea && (allowedLineaIds || []).length === 0) {
                  setNotification({ tone: 'error', message: 'Selecciona al menos una línea o desactiva la restricción.' });
                  return;
                }
                setSavingAllowed(true);
                setNotification({ tone: 'info', message: '' });
                try {
                  await api.put(`/parqueos/${id}/lineas-permitidas`, { lineas: restrictByLinea ? allowedLineaIds : [] });
                  setNotification({ tone: 'success', message: 'Líneas permitidas actualizadas.' });
                } catch (err) {
                  const msg = err?.response?.data?.message || 'No se pudo guardar.';
                  setNotification({ tone: 'error', message: msg });
                } finally {
                  setSavingAllowed(false);
                }
              }}
              disabled={!canConfigParqueos || savingAllowed}
              className="tm-btn tm-btn-sm tm-btn-secondary disabled:opacity-60"
            >
              {savingAllowed ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </div>

        {restrictByLinea && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
            {(lineas || []).map((l) => {
              const id = Number(l.id);
              const checked = (allowedLineaIds || []).includes(id);
              return (
                <label key={l.id} className={`flex items-center gap-2 p-2 rounded border ${checked ? 'border-muni-cyan bg-muni-blue/10' : 'border-white/10 bg-white/6'} ${canConfigParqueos ? 'cursor-pointer' : 'opacity-60'}`}>
                  <input
                    type="checkbox"
                    checked={checked}
                    disabled={!canConfigParqueos}
                    onChange={(e) => {
                      const next = new Set(allowedLineaIds || []);
                      if (e.target.checked) next.add(id);
                      else next.delete(id);
                      setAllowedLineaIds(Array.from(next));
                    }}
                  />
                  <span className="text-[10px] font-black text-white/80 uppercase tracking-widest truncate" title={l.nombre}>{l.nombre}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {layoutMode === 'kanban' && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {columns.map((col) => {
            const code = String(col.codigo);
            const label = String(col.nombre || col.codigo);
            const badgeCls = col.ui_class || 'bg-white/8 text-white/70 border border-white/10';
            const items = parqueoBuses.filter((b) => String(b.estado) === code);

            return (
              <div key={code} className="tm-card tm-card-inset shadow-sm overflow-hidden flex flex-col min-h-[260px]">
                <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-white/4">
                  <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border border-white/10 ${badgeCls}`}>
                    {label}
                  </span>
                  <span className="text-[10px] font-black text-white/55 uppercase tracking-widest">{items.length}</span>
                </div>

                <div className="p-4 space-y-3 flex-1 overflow-auto custom-scrollbar">
                  {items.length === 0 ? (
                    <div className="h-full min-h-[160px] flex items-center justify-center">
                      <p className="text-[9px] font-black text-white/55 uppercase tracking-widest italic">Sin unidades</p>
                    </div>
                  ) : (
                    items.map((b) => {
                      const pct = b.capacidad_pasajeros > 0 ? Math.round((b.ocupacion_actual / b.capacidad_pasajeros) * 100) : 0;
                      return (
                        <div key={b.id} className="rounded-xl border border-white/10 bg-white/6 p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <button
                                type="button"
                                onClick={() => navigate('/buses', { state: { openBusId: b.id } })}
                                className="text-left w-full"
                              >
                                <p className="text-[10px] font-black text-white/90 uppercase tracking-widest truncate">{b.numero_unidad}</p>
                                <p className="text-[10px] font-bold text-white/65 truncate">{getLineaName(b.linea_id)}</p>
                                <p className="text-[9px] font-bold text-white/45 truncate">{b.estacion_actual_id ? getEstacionName(b.estacion_actual_id) : 'Sin estación'}</p>
                              </button>
                            </div>
                            <div className="shrink-0 text-right">
                              <div className="text-[10px] font-black text-white/80">{pct}%</div>
                              <div className="text-[9px] font-bold text-white/45">{Number(b.ocupacion_actual || 0)}/{Number(b.capacidad_pasajeros || 0)}</div>
                            </div>
                          </div>

                          <div className="mt-3 h-1.5 rounded-full bg-white/10 overflow-hidden">
                            <div className="h-full rounded-full bg-muni-blue" style={{ width: `${Math.max(0, Math.min(100, pct))}%` }} />
                          </div>

                          <div className="mt-4 grid grid-cols-1 gap-2">
                            <select
                              value={String(b.estado || '')}
                              onChange={(e) => setEstado(b.id, e.target.value)}
                              disabled={!canWriteBuses}
                              className="w-full tm-select disabled:opacity-60"
                            >
                              {(estadosCatalog || []).map((s) => (
                                <option key={s.codigo} value={String(s.codigo)}>{String(s.nombre || s.codigo)}</option>
                              ))}
                            </select>

                            <select
                              value={String(b.parqueo_id || '')}
                              onChange={(e) => setParqueo(b.id, Number(e.target.value))}
                              disabled={!canWriteParqueos}
                              className="w-full tm-select disabled:opacity-60"
                            >
                              {(parqueos || []).map((p) => (
                                <option key={p.id} value={String(p.id)}>{p.nombre}</option>
                              ))}
                            </select>

                            <select
                              value={b.linea_id ? String(b.linea_id) : ''}
                              onChange={(e) => {
                                const next = e.target.value ? Number(e.target.value) : null;
                                if (restrictByLinea && next !== null && !(allowedLineaIds || []).includes(next)) {
                                  setNotification({ tone: 'error', message: 'Esa línea no está permitida en este parqueo.' });
                                  return;
                                }
                                setLinea(b.id, next);
                              }}
                              disabled={!canWriteBuses}
                              className="w-full tm-select disabled:opacity-60"
                            >
                              <option value="">Sin línea</option>
                              {(allowedLineasForSelect || []).map((l) => (
                                <option key={l.id} value={String(l.id)}>{l.nombre}</option>
                              ))}
                            </select>

                            <select
                              value={b.estacion_actual_id ? String(b.estacion_actual_id) : ''}
                              onChange={(e) => setEstacion(b.id, e.target.value ? Number(e.target.value) : null)}
                              disabled={!canWriteOcupacion}
                              className="w-full tm-select disabled:opacity-60"
                            >
                              <option value="">Sin estación</option>
                              {(estaciones || []).map((es) => (
                                <option key={es.id} value={String(es.id)}>{es.nombre}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
