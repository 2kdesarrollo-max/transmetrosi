import React, { useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext.jsx';

const splitStationName = (name) => {
  const full = String(name ?? '').trim();
  if (!full) return { full: '', main: '', detail: '' };
  const m = full.match(/^(.+?)\s*\((.+)\)\s*$/);
  if (!m) return { full, main: full, detail: '' };
  return { full, main: m[1].trim(), detail: m[2].trim() };
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

const EditStationsModal = ({ isOpen, onClose, linea, allStations, onSave }) => {
  const [draft, setDraft] = useState([]);
  const [newStationId, setNewStationId] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const rows = (linea?.estaciones || []).map((s) => ({
      estacion_id: s.id,
      nombre: s.nombre,
      orden: s.orden,
      distancia_siguiente_km: s.distancia_siguiente_km ?? 0
    }));
    setDraft(rows);
    setNewStationId('');
    setSaving(false);
  }, [isOpen, linea]);

  const availableStations = useMemo(() => {
    const used = new Set(draft.map((d) => d.estacion_id));
    return (allStations || []).filter((s) => !used.has(s.id));
  }, [allStations, draft]);

  if (!isOpen) return null;

  const updateRow = (idx, patch) => {
    setDraft((prev) => prev.map((r, i) => (i === idx ? { ...r, ...patch } : r)));
  };

  const addStation = () => {
    const id = Number(newStationId);
    if (!Number.isFinite(id) || id <= 0) return;
    const station = (allStations || []).find((s) => s.id === id);
    if (!station) return;
    const maxOrden = draft.reduce((acc, x) => Math.max(acc, Number(x.orden) || 0), 0);
    setDraft((prev) => [
      ...prev,
      { estacion_id: station.id, nombre: station.nombre, orden: maxOrden + 1, distancia_siguiente_km: 0 }
    ]);
    setNewStationId('');
  };

  const removeStation = (idx) => {
    setDraft((prev) => prev.filter((_, i) => i !== idx));
  };

  const submit = async () => {
    setSaving(true);
    try {
      const payload = draft
        .map((d) => ({
          estacion_id: Number(d.estacion_id),
          orden: Number(d.orden),
          distancia_siguiente_km: Number(d.distancia_siguiente_km)
        }))
        .sort((a, b) => a.orden - b.orden);
      await onSave(linea.id, payload);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="tm-card tm-card-inset w-full max-w-3xl shadow-2xl p-8 relative animate-in zoom-in-95 duration-300">
        <button onClick={onClose} className="absolute top-6 right-6 text-white/50 hover:text-white/80 font-bold transition-colors">✕</button>
        <h3 className="text-xl font-black text-white/90 uppercase tracking-tight mb-2">Configurar Estaciones</h3>
        <p className="text-[10px] text-white/45 font-bold uppercase tracking-widest mb-6 italic">{linea?.nombre}</p>

        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <select
            value={newStationId}
            onChange={(e) => setNewStationId(e.target.value)}
            className="flex-1 tm-select"
          >
            <option value="">Agregar estación...</option>
            {availableStations.map((s) => (
              <option key={s.id} value={String(s.id)}>
                {(() => {
                  const x = splitStationName(s.nombre);
                  return x.detail ? `${x.main} — ${x.detail}` : x.main;
                })()}
              </option>
            ))}
          </select>
          <button
            onClick={addStation}
            className="tm-btn tm-btn-primary"
            disabled={!newStationId}
          >
            Agregar
          </button>
        </div>

        <div className="tm-card tm-card-inset shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 text-[9px] font-black text-white/45 uppercase tracking-widest">Estación</th>
                <th className="px-6 py-4 text-[9px] font-black text-white/45 uppercase tracking-widest">Orden</th>
                <th className="px-6 py-4 text-[9px] font-black text-white/45 uppercase tracking-widest">Distancia (km)</th>
                <th className="px-6 py-4 text-[9px] font-black text-white/45 uppercase tracking-widest text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {draft.map((row, idx) => (
                <tr key={`${row.estacion_id}:${idx}`} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    {(() => {
                      const x = splitStationName(row.nombre);
                      return (
                        <div className="flex flex-col gap-1">
                          <span className="text-[11px] font-black text-white/90 uppercase truncate" title={x.full}>
                            {x.main}
                          </span>
                          {x.detail && (
                            <span className="text-[9px] font-black text-white/55 uppercase tracking-widest bg-white/8 border border-white/10 rounded px-2 py-1 w-fit">
                              {x.detail}
                            </span>
                          )}
                        </div>
                      );
                    })()}
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="number"
                      min={1}
                      value={row.orden}
                      onChange={(e) => updateRow(idx, { orden: e.target.value })}
                      className="w-24 tm-input"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="number"
                      min={0}
                      step="0.1"
                      value={row.distancia_siguiente_km}
                      onChange={(e) => updateRow(idx, { distancia_siguiente_km: e.target.value })}
                      className="w-32 tm-input"
                    />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => removeStation(idx)}
                      className="tm-btn tm-btn-xs tm-btn-danger"
                    >
                      Quitar
                    </button>
                  </td>
                </tr>
              ))}
              {draft.length === 0 && (
                <tr className="bg-transparent">
                  <td colSpan={4} className="px-6 py-10 text-center text-[10px] font-black text-white/55 uppercase tracking-widest italic">
                    Sin estaciones configuradas
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-8 flex gap-3">
          <button
            onClick={submit}
            disabled={saving || draft.length === 0}
            className="tm-btn tm-btn-primary flex-1"
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

const RoutesPage = () => {
  const { user } = useAuth();
  const userPerms = Array.isArray(user?.permisos) ? user.permisos : [];
  const canManage = ['lineas:write', 'estaciones:write'].some((p) => userPerms.includes(p));
  const [ejes, setEjes] = useState([]);
  const [allStations, setAllStations] = useState([]);
  const [notification, setNotification] = useState({ message: '', tone: 'info' });
  const [editing, setEditing] = useState({ open: false, linea: null });
  const [focusMode, setFocusMode] = useState('stations');
  const [viewMode, setViewMode] = useState('list');

  const transfers = useMemo(() => {
    const counts = new Map();
    for (const eje of ejes || []) {
      for (const s of eje?.estaciones || []) {
        const id = Number(s?.id);
        if (!Number.isFinite(id)) continue;
        counts.set(id, (counts.get(id) || 0) + 1);
      }
    }
    const set = new Set();
    for (const [id, count] of counts.entries()) {
      if (count > 1) set.add(id);
    }
    return set;
  }, [ejes]);

  useEffect(() => {
    let alive = true;
    const run = async () => {
      try {
        const [{ data: lineas }, { data: estaciones }] = await Promise.all([
          api.get('/lineas'),
          api.get('/estaciones')
        ]);
        const details = await Promise.all(
          (lineas || []).map(async (l) => {
            const { data } = await api.get(`/lineas/${l.id}`);
            return data;
          })
        );
        if (!alive) return;
        setEjes(details);
        setAllStations(estaciones || []);
      } catch {
        if (!alive) return;
        setNotification({ tone: 'error', message: 'No se pudo cargar la red de ejes.' });
      }
    };
    run();
    return () => {
      alive = false;
    };
  }, []);

  const reloadLine = async (id) => {
    const { data } = await api.get(`/lineas/${id}`);
    setEjes((prev) => prev.map((x) => (x.id === id ? data : x)));
    return data;
  };

  const saveStations = async (lineaId, estaciones) => {
    try {
      await api.put(`/lineas/${lineaId}/estaciones`, { estaciones });
      await reloadLine(lineaId);
      setNotification({ tone: 'success', message: 'Estaciones actualizadas.' });
    } catch (err) {
      const msg = err?.response?.data?.message || 'No se pudieron guardar las estaciones.';
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

      <EditStationsModal
        isOpen={editing.open}
        onClose={() => setEditing({ open: false, linea: null })}
        linea={editing.linea}
        allStations={allStations}
        onSave={saveStations}
      />

      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-2xl font-black text-white/90 tracking-tight uppercase italic">Red de Ejes</h2>
          <p className="text-[10px] text-white/45 font-bold uppercase tracking-[0.2em] mt-1">Estructura de Ejes y Secuencia de Estaciones</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10">
        {ejes.map((eje) => (
          <div key={eje.id} className="tm-card tm-card-inset p-10 shadow-sm">
            <div className="flex items-center space-x-4 mb-10">
              <div className={`w-2 h-8 rounded-full ${eje.color === 'muni-orange' ? 'bg-muni-orange' : eje.color === 'muni-green' ? 'bg-muni-green' : 'bg-muni-blue'}`}></div>
              <div>
                <h3 className="text-xl font-black text-white/90 italic tracking-tight uppercase">{eje.nombre}</h3>
                <p className="text-[9px] font-black text-white/45 uppercase tracking-widest">{(eje.estaciones || []).length} Estaciones en Línea</p>
                <p className="text-[9px] font-black text-white/55 uppercase tracking-widest mt-1">
                  Distancia total: {Number(eje.distancia_total_km || 0).toFixed(2)} km
                </p>
              </div>
              <div className="ml-auto">
                <div className="flex items-center gap-2">
                  <div className="inline-flex rounded-lg border border-white/10 bg-white/6 p-1">
                    <button
                      type="button"
                      onClick={() => setViewMode('list')}
                      className={`px-3 py-2 rounded-md text-[9px] font-black uppercase tracking-widest transition ${
                        viewMode === 'list' ? 'bg-muni-blue text-white' : 'text-white/60 hover:bg-white/8'
                      }`}
                    >
                      Lista
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode('map')}
                      className={`px-3 py-2 rounded-md text-[9px] font-black uppercase tracking-widest transition ${
                        viewMode === 'map' ? 'bg-muni-blue text-white' : 'text-white/60 hover:bg-white/8'
                      }`}
                    >
                      Mapa
                    </button>
                  </div>
                  <div className="inline-flex rounded-lg border border-white/10 bg-white/6 p-1">
                    <button
                      type="button"
                      onClick={() => setFocusMode('stations')}
                      className={`px-3 py-2 rounded-md text-[9px] font-black uppercase tracking-widest transition ${
                        focusMode === 'stations' ? 'bg-white/15 text-white' : 'text-white/60 hover:bg-white/8'
                      }`}
                      title="Muestra todas las estaciones de la línea"
                    >
                      Todas
                    </button>
                    <button
                      type="button"
                      onClick={() => setFocusMode('transfers')}
                      className={`px-3 py-2 rounded-md text-[9px] font-black uppercase tracking-widest transition ${
                        focusMode === 'transfers' ? 'bg-white/15 text-white' : 'text-white/60 hover:bg-white/8'
                      }`}
                      title="Muestra solo estaciones compartidas con otras líneas (puntos de intercambio)"
                    >
                      Transbordos
                    </button>
                  </div>
                {canManage && (
                  <button
                    onClick={() => setEditing({ open: true, linea: eje })}
                    className="tm-btn tm-btn-primary"
                  >
                    Configurar
                  </button>
                )}
                </div>
              </div>
            </div>

            {viewMode === 'list' ? (
              <div className="tm-card tm-card-inset shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-white/10 bg-white/4">
                  <p className="text-[10px] font-bold text-white/55 tracking-wide">
                    Transbordos: estaciones compartidas con otra línea. Dist. a siguiente: distancia estimada hasta la siguiente estación (si no está configurada se muestra —).
                  </p>
                </div>
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left">
                    <thead className="bg-white/5 border-b border-white/10">
                      <tr>
                        <th className="px-6 py-4 text-[9px] font-black text-white/45 uppercase tracking-widest w-16">#</th>
                        <th className="px-6 py-4 text-[9px] font-black text-white/45 uppercase tracking-widest">Estación</th>
                        <th
                          className="px-6 py-4 text-[9px] font-black text-white/45 uppercase tracking-widest w-48"
                          title="Distancia estimada desde esta estación hacia la siguiente estación de la secuencia"
                        >
                          Dist. a siguiente (km)
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {(eje.estaciones || [])
                        .filter((s) => (focusMode === 'transfers' ? transfers.has(Number(s.id)) : true))
                        .map((estacion) => {
                          const isTransfer = transfers.has(Number(estacion.id));
                          const x = splitStationName(estacion.nombre);
                          return (
                            <tr key={estacion.id} className="hover:bg-white/5 transition-colors">
                              <td className="px-6 py-4">
                                <div className="inline-flex items-center gap-2">
                                  <span className="text-[10px] font-black text-white/60">{estacion.orden}</span>
                                  {isTransfer && (
                                    <span className="text-[8px] font-black text-white/70 uppercase tracking-widest bg-white/8 border border-white/10 rounded px-2 py-1">
                                      T
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex flex-col gap-1 min-w-0">
                                  <span className="text-[11px] font-black text-white/90 uppercase truncate" title={x.full}>
                                    {x.main}
                                  </span>
                                  {x.detail && (
                                    <span className="text-[9px] font-black text-white/55 uppercase tracking-widest bg-white/8 border border-white/10 rounded px-2 py-1 w-fit">
                                      {x.detail}
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                {Number(estacion.distancia_siguiente_km || 0) > 0 ? (
                                  <span className="text-[10px] font-black text-white/70">
                                    {Number(estacion.distancia_siguiente_km || 0).toFixed(2)}
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-black text-white/55">—</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      {(eje.estaciones || []).filter((s) => (focusMode === 'transfers' ? transfers.has(Number(s.id)) : true)).length === 0 && (
                        <tr className="bg-transparent">
                          <td colSpan={3} className="px-6 py-10 text-center text-[10px] font-black text-white/55 uppercase tracking-widest italic">
                            Sin estaciones para mostrar
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="tm-card tm-card-inset shadow-sm overflow-hidden">
                <div className="overflow-x-auto custom-scrollbar">
                  <div className="relative min-w-max px-10 pt-10 pb-10">
                    <div
                      className={`absolute left-10 right-10 top-[68px] h-1 rounded-full ${
                        eje.color === 'muni-orange' ? 'bg-muni-orange' : eje.color === 'muni-green' ? 'bg-muni-green' : 'bg-muni-blue'
                      }`}
                    />
                    <div className="flex items-start gap-8">
                      {(eje.estaciones || []).map((estacion) => {
                        const isTransfer = transfers.has(Number(estacion.id));
                        const dim = focusMode === 'transfers' && !isTransfer;
                        const x = splitStationName(estacion.nombre);
                        return (
                          <div key={estacion.id} className={`w-32 shrink-0 ${dim ? 'opacity-30' : 'opacity-100'} transition-opacity`}>
                            <div className="flex justify-center">
                              <div
                                className={`h-5 w-5 rounded-full bg-white/10 border-4 ${
                                  eje.color === 'muni-orange'
                                    ? 'border-muni-orange'
                                    : eje.color === 'muni-green'
                                      ? 'border-muni-green'
                                      : 'border-muni-blue'
                                } ${isTransfer ? 'ring-4 ring-white/70 shadow-md' : ''}`}
                                title={x.full}
                              />
                            </div>
                            <div className="mt-3 text-center">
                              <div className="text-[10px] font-black text-white/70">{estacion.orden}</div>
                              <div className="mt-1 text-[10px] font-black text-white/70 uppercase tracking-wider truncate" title={x.full}>
                                {x.main}
                              </div>
                              {x.detail && focusMode !== 'transfers' && (
                                <div className="mt-2">
                                  <span className="text-[8px] font-black text-white/60 uppercase tracking-widest bg-white/8 border border-white/10 rounded px-2 py-1">
                                    {x.detail}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoutesPage;
