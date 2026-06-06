import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import api from '../services/api';
import emojitransmetro from '../../pictures/emojitransmetro.png';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

const IconBus = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path
      d="M6.5 16.5h11m-10.5 0V6.8c0-1.1.9-2 2-2h6c1.1 0 2 .9 2 2V16.5m-14 0v2.2c0 .8.7 1.5 1.5 1.5h.5m12 0h.5c.8 0 1.5-.7 1.5-1.5v-2.2M7.8 10.2h8.4M8 19.8a.9.9 0 1 0 0-1.8.9.9 0 0 0 0 1.8Zm8 0a.9.9 0 1 0 0-1.8.9.9 0 0 0 0 1.8Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ActionModal = ({ isOpen, onClose, title, content, actions }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="tm-card tm-card-inset w-full max-w-lg shadow-2xl p-8 relative animate-in zoom-in-95 duration-300">
        <button onClick={onClose} className="absolute top-6 right-6 text-white/50 hover:text-white/80 font-bold transition-colors">✕</button>
        <h3 className="text-xl font-black text-white/90 uppercase tracking-tight mb-4 border-b border-white/10 pb-4">{title}</h3>
        <div className="text-white/70 font-medium mb-8 text-sm leading-relaxed">{content}</div>
        <div className="flex flex-col space-y-3">
          {actions ? actions : (
            <button onClick={onClose} className="tm-btn tm-btn-secondary w-full">
              Cerrar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const StationBusesModal = ({ isOpen, ejeNombre, station, onClose, onSelectBus }) => {
  const [q, setQ] = useState('');
  const [sortKey, setSortKey] = useState('ocupacion');
  const [sortDir, setSortDir] = useState('desc');

  const title = useMemo(() => {
    if (!isOpen || !station) return '';
    return `${ejeNombre}: ${station.nombre}`;
  }, [ejeNombre, isOpen, station]);

  const items = useMemo(() => {
    return Array.isArray(station?.buses) ? station.buses : [];
  }, [station]);

  const visibleItems = useMemo(() => {
    const normalizedQuery = String(q || '').trim().toLowerCase();
    const filtered = normalizedQuery
      ? items.filter((b) => {
          const unidad = String(b?.unidad ?? '').toLowerCase();
          return unidad.includes(normalizedQuery);
        })
      : items.slice();

    const dir = sortDir === 'asc' ? 1 : -1;
    const mapped = filtered.map((b, idx) => ({ b, idx }));
    mapped.sort((a, c) => {
      if (sortKey === 'unidad') {
        const av = String(a.b?.unidad ?? '');
        const cv = String(c.b?.unidad ?? '');
        const cmp = av.localeCompare(cv, undefined, { numeric: true, sensitivity: 'base' });
        if (cmp !== 0) return cmp * dir;
      } else {
        const ap = Number(a.b?.ocupacion ?? 0) || 0;
        const cp = Number(c.b?.ocupacion ?? 0) || 0;
        if (ap !== cp) return (ap - cp) * dir;
      }
      return a.idx - c.idx;
    });
    return mapped.map((x) => x.b);
  }, [items, q, sortDir, sortKey]);

  if (!isOpen || !station) return null;

  return (
    <ActionModal
      isOpen={true}
      onClose={onClose}
      title={title}
      content={
        <div className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Filtrar por unidad…"
              className="w-full md:w-64 tm-input"
            />
            <div className="flex items-center gap-2">
              <select
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value)}
                className="tm-select"
              >
                <option value="ocupacion">Ocupación</option>
                <option value="unidad">Unidad</option>
              </select>
              <button
                type="button"
                onClick={() => setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))}
                className="tm-btn tm-btn-ghost"
                title="Cambiar dirección"
              >
                {sortDir === 'asc' ? 'Asc' : 'Desc'}
              </button>
            </div>
          </div>

          {visibleItems.map((bus) => (
            <button
              key={bus.id}
              type="button"
              onClick={() => {
                onClose();
                onSelectBus(bus, station.nombre);
              }}
              className="w-full text-left rounded-xl border border-white/10 bg-white/6 px-4 py-3 hover:border-white/20 hover:bg-white/8 transition"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="h-8 w-8 rounded-lg border border-white/10 bg-white/10 flex items-center justify-center">
                    <img src={emojitransmetro} alt="Bus" className="w-5 h-auto opacity-90" />
                  </span>
                  <div className="min-w-0">
                    <div className="text-[10px] font-black text-white/90 uppercase tracking-widest truncate">{bus.unidad}</div>
                    <div className="text-[9px] font-bold text-white/65 truncate">{station.nombre}</div>
                  </div>
                </div>
                <div className="shrink-0 text-[10px] font-black text-white/80">{Number(bus.ocupacion) || 0}%</div>
              </div>
            </button>
          ))}
          {visibleItems.length === 0 && (
            <div className="rounded-xl border border-white/10 bg-white/6 px-4 py-3">
              <p className="text-[10px] font-bold text-white/60">{items.length === 0 ? 'Sin unidades.' : 'Sin resultados.'}</p>
            </div>
          )}
        </div>
      }
      actions={
        <button
          onClick={onClose}
          className="tm-btn tm-btn-secondary w-full"
        >
          Cerrar
        </button>
      }
    />
  );
};

const BusesTable = ({ buses, ejes, onSelectBus }) => {
  const allBuses = Array.isArray(buses) ? buses : [];
  const allEjes = Array.isArray(ejes) ? ejes : [];
  const [q, setQ] = useState('');
  const [lineaId, setLineaId] = useState('all');
  const [sort, setSort] = useState({ key: 'ocupacion', dir: 'desc' });

  const lineasOptions = useMemo(() => {
    return allEjes.map((e) => ({ id: Number(e.id), nombre: e.nombre }));
  }, [allEjes]);

  const filteredSorted = useMemo(() => {
    const normalizedQuery = String(q || '').trim().toLowerCase();
    const lineaIdNum = lineaId === 'all' ? null : Number(lineaId);

    const filtered = allBuses.filter((b) => {
      if (lineaIdNum !== null && Number(b?.linea_id) !== lineaIdNum) return false;
      if (!normalizedQuery) return true;
      const unidad = String(b?.unidad ?? '').toLowerCase();
      const linea = String(b?.linea_nombre ?? '').toLowerCase();
      const estacion = String(b?.estacion_actual_nombre ?? '').toLowerCase();
      return unidad.includes(normalizedQuery) || linea.includes(normalizedQuery) || estacion.includes(normalizedQuery);
    });

    const dir = sort.dir === 'asc' ? 1 : -1;
    const mapped = filtered.map((b, idx) => ({ b, idx }));
    mapped.sort((a, c) => {
      const ab = a.b;
      const cb = c.b;
      if (sort.key === 'unidad') {
        const av = String(ab?.unidad ?? '');
        const cv = String(cb?.unidad ?? '');
        const cmp = av.localeCompare(cv, undefined, { numeric: true, sensitivity: 'base' });
        if (cmp !== 0) return cmp * dir;
      } else if (sort.key === 'linea') {
        const av = String(ab?.linea_nombre ?? '');
        const cv = String(cb?.linea_nombre ?? '');
        const cmp = av.localeCompare(cv, undefined, { numeric: true, sensitivity: 'base' });
        if (cmp !== 0) return cmp * dir;
      } else if (sort.key === 'estacion') {
        const av = String(ab?.estacion_actual_nombre ?? '');
        const cv = String(cb?.estacion_actual_nombre ?? '');
        const cmp = av.localeCompare(cv, undefined, { numeric: true, sensitivity: 'base' });
        if (cmp !== 0) return cmp * dir;
      } else if (sort.key === 'estado') {
        const av = String(ab?.estado ?? '');
        const cv = String(cb?.estado ?? '');
        const cmp = av.localeCompare(cv, undefined, { numeric: true, sensitivity: 'base' });
        if (cmp !== 0) return cmp * dir;
      } else {
        const ap = Number(ab?.ocupacion ?? 0) || 0;
        const cp = Number(cb?.ocupacion ?? 0) || 0;
        if (ap !== cp) return (ap - cp) * dir;
      }
      return a.idx - c.idx;
    });

    return mapped.map((x) => x.b);
  }, [allBuses, lineaId, q, sort.dir, sort.key]);

  const top10 = useMemo(() => {
    const mapped = allBuses.map((b) => ({ b, pct: Math.max(0, Number(b?.ocupacion ?? 0) || 0) }));
    mapped.sort((a, c) => c.pct - a.pct);
    return mapped.slice(0, 10);
  }, [allBuses]);

  const bottom10 = useMemo(() => {
    const mapped = allBuses.map((b) => ({ b, pct: Math.max(0, Number(b?.ocupacion ?? 0) || 0) }));
    mapped.sort((a, c) => a.pct - c.pct);
    return mapped.slice(0, 10);
  }, [allBuses]);

  const toggleSort = (key) => {
    setSort((prev) => {
      if (prev.key !== key) return { key, dir: key === 'ocupacion' ? 'desc' : 'asc' };
      return { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' };
    });
  };

  const sortIndicator = (key) => {
    if (sort.key !== key) return '';
    return sort.dir === 'asc' ? '▲' : '▼';
  };

  return (
    <div className="tm-card tm-card-inset p-8 shadow-sm mb-8 overflow-hidden">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-6">
        <div className="min-w-0">
          <h3 className="text-xs font-black text-white/90 uppercase tracking-widest italic">Ranking de Ocupación (por unidad)</h3>
          <p className="mt-2 text-[10px] font-bold text-white/65 tracking-wide">
            Ordena por columnas y filtra por unidad/línea/estación. Click en una fila para abrir diagnóstico.
          </p>
        </div>
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar… (unidad / línea / estación)"
            className="w-full md:w-80 tm-input"
          />
          <select
            value={lineaId}
            onChange={(e) => setLineaId(e.target.value)}
            className="w-full md:w-64 tm-select"
          >
            <option value="all">Todas las líneas</option>
            {lineasOptions.map((l) => (
              <option key={l.id} value={String(l.id)}>
                {l.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="tm-card tm-card-inset overflow-hidden">
          <div className="px-5 py-4 bg-white/4 border-b border-white/10 flex items-center justify-between">
            <div className="text-[10px] font-black uppercase tracking-widest text-white/85">Top 10</div>
            <div className="text-[10px] font-black uppercase tracking-widest text-muni-red">{top10.length}</div>
          </div>
          <div className="p-4 bg-transparent">
            <div className="space-y-2">
              {top10.map(({ b, pct }) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => onSelectBus(b, b.estacion_actual_nombre || 'En ruta')}
                  className="w-full text-left rounded-xl border border-white/15 bg-white/8 px-4 py-3 hover:border-white/25 hover:bg-white/10 transition"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="h-8 w-8 rounded-lg border border-white/10 bg-white/10 flex items-center justify-center">
                        <img src={emojitransmetro} alt="Bus" className="w-5 h-auto opacity-90" />
                      </span>
                      <div className="min-w-0">
                        <div className="text-[10px] font-black text-white/90 uppercase tracking-widest truncate">{b.unidad}</div>
                        <div className="text-[9px] font-bold text-white/70 truncate">{b.estacion_actual_nombre || 'En ruta'}</div>
                      </div>
                    </div>
                    <div className="shrink-0">
                      <span className="inline-flex items-center px-2 py-1 rounded border border-muni-red/35 bg-muni-red/25 text-[10px] font-black text-white">
                        {pct}%
                      </span>
                    </div>
                  </div>
                </button>
              ))}
              {top10.length === 0 && (
                <div className="rounded-xl border border-white/10 bg-white/6 px-4 py-3">
                  <p className="text-[10px] font-bold text-white/60">Sin unidades.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="tm-card tm-card-inset overflow-hidden">
          <div className="px-5 py-4 bg-white/4 border-b border-white/10 flex items-center justify-between">
            <div className="text-[10px] font-black uppercase tracking-widest text-white/85">Bottom 10</div>
            <div className="text-[10px] font-black uppercase tracking-widest text-muni-green">{bottom10.length}</div>
          </div>
          <div className="p-4 bg-transparent">
            <div className="space-y-2">
              {bottom10.map(({ b, pct }) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => onSelectBus(b, b.estacion_actual_nombre || 'En ruta')}
                  className="w-full text-left rounded-xl border border-white/15 bg-white/8 px-4 py-3 hover:border-white/25 hover:bg-white/10 transition"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="h-8 w-8 rounded-lg border border-white/10 bg-white/10 flex items-center justify-center">
                        <img src={emojitransmetro} alt="Bus" className="w-5 h-auto opacity-90" />
                      </span>
                      <div className="min-w-0">
                        <div className="text-[10px] font-black text-white/90 uppercase tracking-widest truncate">{b.unidad}</div>
                        <div className="text-[9px] font-bold text-white/70 truncate">{b.estacion_actual_nombre || 'En ruta'}</div>
                      </div>
                    </div>
                    <div className="shrink-0">
                      <span className="inline-flex items-center px-2 py-1 rounded border border-muni-green/35 bg-muni-green/25 text-[10px] font-black text-white">
                        {pct}%
                      </span>
                    </div>
                  </div>
                </button>
              ))}
              {bottom10.length === 0 && (
                <div className="rounded-xl border border-white/10 bg-white/6 px-4 py-3">
                  <p className="text-[10px] font-bold text-white/60">Sin unidades.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="tm-card tm-card-inset overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 text-[9px] font-black text-white/70 uppercase tracking-widest w-16">#</th>
                <th className="px-6 py-4 text-[9px] font-black text-white/70 uppercase tracking-widest">
                  <button type="button" onClick={() => toggleSort('unidad')} className="hover:text-white/90 transition-colors">
                    Unidad {sortIndicator('unidad')}
                  </button>
                </th>
                <th className="px-6 py-4 text-[9px] font-black text-white/70 uppercase tracking-widest">
                  <button type="button" onClick={() => toggleSort('linea')} className="hover:text-white/90 transition-colors">
                    Línea {sortIndicator('linea')}
                  </button>
                </th>
                <th className="px-6 py-4 text-[9px] font-black text-white/70 uppercase tracking-widest">
                  <button type="button" onClick={() => toggleSort('estacion')} className="hover:text-white/90 transition-colors">
                    Estación {sortIndicator('estacion')}
                  </button>
                </th>
                <th className="px-6 py-4 text-[9px] font-black text-white/70 uppercase tracking-widest w-28">
                  <button type="button" onClick={() => toggleSort('ocupacion')} className="hover:text-white/90 transition-colors">
                    Ocupación {sortIndicator('ocupacion')}
                  </button>
                </th>
                <th className="px-6 py-4 text-[9px] font-black text-white/70 uppercase tracking-widest w-32">
                  <button type="button" onClick={() => toggleSort('estado')} className="hover:text-white/90 transition-colors">
                    Estado {sortIndicator('estado')}
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredSorted.map((b, idx) => {
                const pct = Math.max(0, Number(b?.ocupacion ?? 0) || 0);
                const pctTone =
                  pct >= 100
                    ? 'bg-muni-red/25 text-white border-muni-red/35'
                    : pct >= 50
                      ? 'bg-muni-orange/25 text-white border-muni-orange/35'
                      : 'bg-muni-green/25 text-white border-muni-green/35';
                return (
                  <tr
                    key={b.id}
                    className="hover:bg-white/5 transition-colors cursor-pointer"
                    onClick={() => onSelectBus(b, b.estacion_actual_nombre || 'En ruta')}
                    title="Click para diagnóstico"
                  >
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-black text-white/70">{idx + 1}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="h-8 w-8 rounded-lg border border-white/10 bg-white/10 flex items-center justify-center">
                          <img src={emojitransmetro} alt="Bus" className="w-5 h-auto opacity-90" />
                        </span>
                        <div className="min-w-0">
                          <div className="text-[10px] font-black text-white/90 uppercase tracking-widest truncate">{b.unidad}</div>
                          <div className="text-[9px] font-bold text-white/70 truncate">{b.linea_nombre || '—'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-black text-white/70">{b.linea_nombre || '—'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-black text-white/70">{b.estacion_actual_nombre || 'En ruta'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded border text-[10px] font-black ${pctTone}`}>{pct}%</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-1 rounded border border-white/10 bg-white/6 text-[10px] font-black text-white/70">
                        {b.estado || '—'}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {filteredSorted.length === 0 && (
                <tr className="bg-transparent">
                  <td colSpan={6} className="px-6 py-10 text-center text-[10px] font-black text-white/55 uppercase tracking-widest italic">
                    Sin resultados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const OccupancyBoard = ({ buses, onSelectBus, config }) => {
  const allBuses = Array.isArray(buses) ? buses : [];

  const lowPct = Number.isFinite(config?.low_occupancy_pct) ? config.low_occupancy_pct : null;
  const saturationPct = Number.isFinite(config?.saturation_pct) ? config.saturation_pct : null;

  const categories = [
    {
      label: 'Baja',
      tone: 'green',
      belongs: (b) => lowPct !== null && b.ocupacion <= lowPct
    },
    {
      label: 'Normal',
      tone: 'orange',
      belongs: (b) => (lowPct === null || b.ocupacion > lowPct) && (saturationPct === null || b.ocupacion < saturationPct)
    },
    {
      label: 'Saturación',
      tone: 'red',
      belongs: (b) => saturationPct !== null && b.ocupacion >= saturationPct
    }
  ];

  return (
    <div className="tm-card tm-card-inset p-8 shadow-sm mb-8 overflow-hidden">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xs font-black text-white/90 uppercase tracking-widest italic">Clasificación de Unidades por Ocupación</h3>
        <div className="flex items-center gap-3">
          <div className="h-2 w-64 bg-gradient-to-r from-muni-green via-muni-orange to-muni-red rounded-full" />
          <div className="text-[9px] font-black uppercase tracking-widest text-white/65">
            {lowPct !== null ? `${lowPct}%` : '—'} / {saturationPct !== null ? `${saturationPct}%` : '—'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {categories.map((cat, idx) => {
          const catBuses = allBuses.filter((b) => cat.belongs(b));
          const tone =
            cat.tone === 'green'
              ? { border: 'border-muni-green/30', text: 'text-muni-green', chip: 'border-muni-green/25 hover:border-muni-green/50' }
              : cat.tone === 'orange'
                ? { border: 'border-muni-orange/30', text: 'text-muni-orange', chip: 'border-muni-orange/25 hover:border-muni-orange/50' }
                : { border: 'border-muni-red/30', text: 'text-muni-red', chip: 'border-muni-red/25 hover:border-muni-red/50' };
          return (
            <div key={idx} className={`flex flex-col h-full min-h-[220px] rounded-xl border ${tone.border} overflow-hidden`}>
              <div className="px-5 py-4 bg-white/4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`h-2.5 w-2.5 rounded-full ${cat.tone === 'green' ? 'bg-muni-green' : cat.tone === 'orange' ? 'bg-muni-orange' : 'bg-muni-red'}`} />
                  <div className="text-[10px] font-black uppercase tracking-widest text-white/75">{cat.label}</div>
                </div>
                <div className={`text-[10px] font-black uppercase tracking-widest ${tone.text}`}>{catBuses.length}</div>
              </div>

              <div className="flex-1 bg-transparent p-4">
                {catBuses.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {catBuses.map((bus) => (
                      <button
                        key={bus.id}
                        type="button"
                        onClick={() => onSelectBus(bus, bus.estacion_actual_nombre || 'En ruta')}
                        className={`text-left rounded-xl border bg-white/6 backdrop-blur-sm px-3 py-3 shadow-sm transition-all hover:bg-white/8 ${tone.chip}`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="h-8 w-8 rounded-lg border border-white/10 bg-white/10 flex items-center justify-center">
                              <img src={emojitransmetro} alt="Bus" className="w-5 h-auto opacity-90" />
                            </span>
                            <div className="min-w-0">
                              <div className="text-[10px] font-black text-white/90 uppercase tracking-widest truncate">{bus.unidad}</div>
                              <div className="text-[9px] font-bold text-white/65 truncate">{bus.estacion_actual_nombre || 'En ruta'}</div>
                            </div>
                          </div>
                          <div className={`shrink-0 text-[10px] font-black ${tone.text}`}>{bus.ocupacion}%</div>
                        </div>
                        <div className="mt-3 h-1.5 rounded-full bg-white/10 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${cat.tone === 'green' ? 'bg-muni-green' : cat.tone === 'orange' ? 'bg-muni-orange' : 'bg-muni-red'}`}
                            style={{ width: `${Math.max(0, Math.min(100, Number(bus.ocupacion) || 0))}%` }}
                          />
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="w-full h-full min-h-[160px] flex items-center justify-center">
                    <p className="text-[9px] font-black text-white/55 uppercase tracking-widest italic">Sin unidades</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const EjeMonitor = ({ eje, buses, onSelectBus }) => {
  const colorMap = {
    'muni-orange': 'bg-muni-orange',
    'muni-green': 'bg-muni-green',
    'muni-blue': 'bg-muni-blue'
  };

  const allBuses = Array.isArray(buses) ? buses : [];
  const estaciones = Array.isArray(eje?.estaciones) ? eje.estaciones : [];
  const [zoom, setZoom] = useState(1);
  const [showLabels, setShowLabels] = useState('auto');
  const [expandedStation, setExpandedStation] = useState(null);
  const [hovered, setHovered] = useState(null);

  const lineaId = Number(eje?.id);
  const lineBuses = useMemo(() => {
    if (!Number.isFinite(lineaId)) return [];
    return allBuses.filter((b) => Number(b?.linea_id) === lineaId);
  }, [allBuses, lineaId]);

  const stationIds = useMemo(() => new Set(estaciones.map((s) => Number(s?.id))), [estaciones]);
  const inRouteBuses = useMemo(() => {
    return lineBuses
      .filter((b) => !b?.estacion_actual_id)
      .sort((a, c) => String(a?.unidad ?? '').localeCompare(String(c?.unidad ?? ''), 'es', { numeric: true }));
  }, [lineBuses]);

  const outOfLineStationBuses = useMemo(() => {
    return lineBuses.filter((b) => b?.estacion_actual_id && !stationIds.has(Number(b?.estacion_actual_id)));
  }, [lineBuses, stationIds]);

  const displayStations = useMemo(() => {
    const out = [];
    if (inRouteBuses.length > 0) {
      out.push({ id: `route-${lineaId}`, nombre: 'En ruta', transbordo: false, buses: inRouteBuses, kind: 'route' });
    }
    if (outOfLineStationBuses.length > 0) {
      out.push({ id: `out-${lineaId}`, nombre: 'Fuera de eje', transbordo: false, buses: outOfLineStationBuses, kind: 'out' });
    }
    for (const s of estaciones) out.push({ ...s, kind: 'station' });
    return out;
  }, [estaciones, inRouteBuses, lineaId, outOfLineStationBuses]);

  const baseCount = estaciones.length;
  const count = displayStations.length;

  const labelStep =
    showLabels === 'off'
      ? Number.POSITIVE_INFINITY
      : showLabels === 'all'
        ? 1
        : count <= 18
          ? 1
          : count <= 30
            ? 2
            : count <= 45
              ? 3
              : 4;

  const stationWidth = Math.round(110 * Math.max(0.75, Math.min(1.6, zoom)));

  const occTone = (pct) => {
    const p = Number(pct) || 0;
    if (p >= 80) return 'ring-muni-red/40';
    if (p >= 50) return 'ring-muni-orange/40';
    return 'ring-muni-green/40';
  };

  return (
    <div className="tm-card tm-card-inset p-8 shadow-sm mb-6">
      <StationBusesModal
        isOpen={Boolean(expandedStation)}
        ejeNombre={eje.nombre}
        station={expandedStation}
        onClose={() => setExpandedStation(null)}
        onSelectBus={onSelectBus}
      />

      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-6">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <div className={`w-1.5 h-6 rounded-full ${colorMap[eje.color]}`}></div>
            <h3 className="text-lg font-black text-white/90 tracking-tight uppercase italic truncate">{eje.nombre}</h3>
          </div>
          <div className="mt-2 flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full border border-white/35"></div>
              <span className="text-[8px] font-bold text-white/65 uppercase tracking-wider">Estación</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-2 rounded-full border-2 border-white/70"></div>
              <span className="text-[8px] font-bold text-white/65 uppercase tracking-wider">Transbordo</span>
            </div>
            <span className="text-[9px] font-bold text-white/65 uppercase tracking-widest truncate">
              {hovered ? hovered : 'Hover: —'}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="px-2 py-1 rounded border border-white/10 bg-white/6 text-[8px] font-black text-white/80 uppercase tracking-widest">
              Unidades: {lineBuses.length}
            </span>
            <span className="px-2 py-1 rounded border border-white/10 bg-white/6 text-[8px] font-black text-white/80 uppercase tracking-widest">
              En ruta: {inRouteBuses.length}
            </span>
            {outOfLineStationBuses.length > 0 && (
              <span className="px-2 py-1 rounded border border-muni-orange/30 bg-muni-orange/10 text-[8px] font-black text-muni-orange uppercase tracking-widest">
                Fuera de eje: {outOfLineStationBuses.length}
              </span>
            )}

            {inRouteBuses.slice(0, 6).map((bus) => (
              <button
                key={`route-${bus.id}`}
                type="button"
                onClick={() => onSelectBus(bus, 'En ruta')}
                className="inline-flex items-center gap-2 px-2 py-1 rounded-full border border-white/12 bg-white/8 hover:bg-white/10 hover:border-white/20 transition"
                title={`${bus.unidad} • ${Number(bus.ocupacion) || 0}% • En ruta`}
              >
                <span className="text-[8px] font-black text-white/90 uppercase tracking-widest">{String(bus.unidad || '').replace(/\s+/g, '')}</span>
                <span className="px-1.5 py-[1px] rounded border border-white/10 bg-white/10 text-[8px] font-black text-white/90 leading-none">
                  {Math.max(0, Number(bus.ocupacion) || 0)}%
                </span>
              </button>
            ))}
            {inRouteBuses.length > 6 && (
              <span className="px-2 py-1 rounded-full border border-white/10 bg-white/6 text-[8px] font-black text-white/70 uppercase tracking-widest">
                +{inRouteBuses.length - 6}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[8px] font-black text-white/65 uppercase tracking-widest">Zoom</span>
            <input
              type="range"
              min="0.8"
              max="1.6"
              step="0.1"
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-32"
            />
            <span className="text-[9px] font-black text-white/55 w-10 text-right">{zoom.toFixed(1)}x</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setShowLabels('auto')}
              className={`tm-btn tm-btn-sm ${
                showLabels === 'auto'
                  ? 'tm-btn-primary'
                  : 'tm-btn-ghost'
              }`}
            >
              Auto
            </button>
            <button
              type="button"
              onClick={() => setShowLabels('off')}
              className={`tm-btn tm-btn-sm ${
                showLabels === 'off'
                  ? 'tm-btn-primary'
                  : 'tm-btn-ghost'
              }`}
            >
              Etiquetas off
            </button>
            <button
              type="button"
              onClick={() => setShowLabels('all')}
              className={`tm-btn tm-btn-sm ${
                showLabels === 'all'
                  ? 'tm-btn-primary'
                  : 'tm-btn-ghost'
              }`}
            >
              Todas
            </button>
          </div>
        </div>
      </div>

      {count === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/4 backdrop-blur-md p-6 tm-card-inset">
          <p className="text-[10px] font-black text-white/80 uppercase tracking-widest">No hay estaciones ni unidades para mostrar en este eje.</p>
        </div>
      ) : (
        <>
          {baseCount === 0 && (
            <div className="mb-4 rounded-2xl border border-white/10 bg-white/4 backdrop-blur-md p-6 tm-card-inset">
              <p className="text-[10px] font-black text-white/80 uppercase tracking-widest">Este eje no tiene estaciones configuradas.</p>
              <p className="mt-2 text-[10px] font-bold text-white/65">Se muestran unidades “En ruta” o “Fuera de eje” como columnas especiales.</p>
            </div>
          )}
        <div className="relative rounded-2xl border border-white/10 bg-white/4 backdrop-blur-md overflow-hidden tm-card-inset">
          <div className="absolute inset-0 opacity-[0.25]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(15,23,42,0.14) 1px, transparent 0)', backgroundSize: '18px 18px' }} />
          <div className="relative overflow-x-auto custom-scrollbar">
            <div
              className="relative py-10"
              style={{ width: `${Math.max(1, count) * stationWidth}px` }}
            >
              <div className={`absolute top-[52px] left-10 right-10 h-1 ${colorMap[eje.color]} rounded-full`} />

              <div className="flex items-start px-10">
                {displayStations.map((estacion, idx) => {
                  const busesAt = Array.isArray(estacion.buses) ? estacion.buses : [];
                  const visible = busesAt.slice(0, 3);
                  const hidden = busesAt.length - visible.length;
                  const showName = estacion.transbordo || idx % labelStep === 0;

                  return (
                    <div
                      key={estacion.id}
                      className="flex flex-col items-center"
                      style={{ width: `${stationWidth}px` }}
                      onMouseEnter={() => setHovered(estacion.nombre)}
                      onMouseLeave={() => setHovered(null)}
                    >
                      <div className="h-12 mb-4 flex items-end justify-center gap-1">
                        {visible.map((bus) => (
                          (() => {
                            const stationLabel = estacion.kind === 'route'
                              ? 'En ruta'
                              : estacion.kind === 'out'
                                ? (bus.estacion_actual_nombre || 'Fuera de eje')
                                : estacion.nombre;
                            return (
                          <button
                            key={bus.id}
                            type="button"
                            onClick={() => onSelectBus(bus, stationLabel)}
                            title={`${bus.unidad} • ${Number(bus.ocupacion) || 0}% • ${stationLabel}`}
                            className={`relative h-9 w-9 rounded-xl bg-white/10 border border-white/10 shadow-sm flex items-center justify-center ring-2 ${occTone(bus.ocupacion)} hover:border-white/20 hover:shadow-md transition`}
                          >
                            <img src={emojitransmetro} alt="Bus" className="w-5 h-auto opacity-90" />
                            <span className="absolute top-0.5 right-0.5 px-1 py-[1px] rounded bg-white/10 border border-white/10 text-[7px] font-black text-white/85 leading-none">
                              {Math.max(0, Number(bus.ocupacion) || 0)}%
                            </span>
                            <span className="absolute bottom-0.5 left-0.5 right-0.5 px-1 py-[1px] rounded bg-black/50 border border-white/10 text-[7px] font-black text-white leading-none truncate">
                              {String(bus.unidad || '').replace(/\s+/g, '')}
                            </span>
                          </button>
                            );
                          })()
                        ))}
                        {hidden > 0 && (
                          <button
                            type="button"
                            onClick={() => setExpandedStation(estacion)}
                            className="h-9 px-2 rounded-xl bg-white/10 border border-white/10 shadow-sm text-[9px] font-black text-white/70 uppercase tracking-widest hover:border-white/20 hover:bg-white/15 hover:shadow-md transition"
                            title={`Ver ${hidden} unidades`}
                          >
                            +{hidden}
                          </button>
                        )}
                      </div>

                      {estacion.kind === 'route' ? (
                        <div className="w-4 h-4 rotate-45 rounded border-2 border-muni-cyan bg-muni-cyan/20 shadow-sm transition-all hover:scale-110 cursor-default" />
                      ) : estacion.kind === 'out' ? (
                        <div className="w-4 h-4 rotate-45 rounded border-2 border-muni-orange bg-muni-orange/20 shadow-sm transition-all hover:scale-110 cursor-default" />
                      ) : estacion.transbordo ? (
                        <div className="w-9 h-5 rounded-full border-2 border-white/70 bg-white/10 shadow-sm transition-all hover:scale-110 cursor-default flex items-center justify-center gap-1">
                          <div className={`w-1.5 h-1.5 rounded-full ${colorMap[eje.color]}`}></div>
                          <div className={`w-1.5 h-1.5 rounded-full ${colorMap[eje.color]}`}></div>
                        </div>
                      ) : (
                        <div className={`w-4 h-4 rounded-full border-2 border-white shadow-sm transition-all hover:scale-110 cursor-default ${colorMap[eje.color]}`}></div>
                      )}

                      <div className="mt-4 w-full px-2">
                        {showName ? (
                          <div
                            className={`text-[9px] font-black uppercase tracking-tighter leading-none ${
                              estacion.kind === 'route'
                                ? 'text-muni-cyan'
                                : estacion.kind === 'out'
                                  ? 'text-muni-orange'
                                  : estacion.transbordo
                                    ? 'text-white/90'
                                    : 'text-white/55'
                            } text-center truncate`}
                            title={estacion.nombre}
                          >
                            {estacion.nombre}
                          </div>
                        ) : (
                          <div className="h-[10px]" />
                        )}
                        {estacion.transbordo && (
                          <div className="mt-2 flex items-center justify-center gap-1">
                            <div className="w-1 h-1 bg-muni-cyan rounded-full"></div>
                            <span className="text-[6px] font-bold text-muni-cyan uppercase tracking-widest">T</span>
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
        </>
      )}
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const aliveRef = useRef(true);
  const [modal, setModal] = useState({ open: false, title: '', content: '', actions: null });
  const [ejes, setEjes] = useState([]);
  const [buses, setBuses] = useState([]);
  const [config, setConfig] = useState(null);
  const [alertas, setAlertas] = useState([]);
  const [refuerzos, setRefuerzos] = useState([]);
  const [notification, setNotification] = useState({ message: '', tone: 'info' });
  const [loading, setLoading] = useState(false);
  const [lastUpdatedAt, setLastUpdatedAt] = useState(null);

  const userPerms = Array.isArray(user?.permisos) ? user.permisos : [];
  const canReadAlertas = userPerms.includes('alertas:read');
  const canWriteAlertas = userPerms.includes('alertas:write');
  const canReadRefuerzos = userPerms.includes('refuerzos:read');
  const canWriteRefuerzos = userPerms.includes('refuerzos:write');

  useEffect(() => {
    aliveRef.current = true;
    return () => {
      aliveRef.current = false;
    };
  }, []);

  const refresh = useCallback(async ({ silent } = { silent: false }) => {
    try {
      if (!silent) setLoading(true);

      const { data: overview } = await api.get('/dashboard/overview');
      let alertasData = [];
      if (canReadAlertas) {
        try {
          const res = await api.get('/alertas');
          alertasData = res.data || [];
        } catch (err) {
          if (!aliveRef.current) return;
          const status = err?.response?.status;
          const apiMsg = err?.response?.data?.message;
          const suffix = status ? ` (HTTP ${status}${apiMsg ? `: ${apiMsg}` : ''})` : '';
          setNotification({ tone: 'error', message: `No se pudieron cargar las alertas.${suffix}` });
        }
      }
      let refuerzosData = [];
      if (canReadRefuerzos) {
        try {
          const res = await api.get('/refuerzos');
          refuerzosData = res.data || [];
        } catch (err) {
          if (!aliveRef.current) return;
          const status = err?.response?.status;
          const apiMsg = err?.response?.data?.message;
          const suffix = status ? ` (HTTP ${status}${apiMsg ? `: ${apiMsg}` : ''})` : '';
          setNotification({ tone: 'error', message: `No se pudieron cargar las órdenes de refuerzo.${suffix}` });
        }
      }
      if (!aliveRef.current) return;
      setEjes(overview.ejes || []);
      setBuses(overview.buses || []);
      setConfig(overview.config || null);
      setAlertas((alertasData || []).slice(0, 8));
      setRefuerzos(refuerzosData || []);
      setLastUpdatedAt(new Date());
    } catch (err) {
      if (!aliveRef.current) return;
      const status = err?.response?.status;
      const apiMsg = err?.response?.data?.message;
      const suffix = status ? ` (HTTP ${status}${apiMsg ? `: ${apiMsg}` : ''})` : '';
      setNotification({ tone: 'error', message: `No se pudo cargar el panel de control.${suffix}` });
    } finally {
      if (aliveRef.current) setLoading(false);
    }
  }, [canReadAlertas, canReadRefuerzos]);

  useEffect(() => {
    refresh();
    const interval = setInterval(() => {
      refresh({ silent: true });
    }, 5000);
    return () => {
      clearInterval(interval);
    };
  }, [refresh]);

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

  const requestRefuerzo = async (bus, stationLabel) => {
    if (!canWriteRefuerzos) {
      setModal({
        open: true,
        title: 'Acceso denegado',
        content: 'No tienes permisos para crear órdenes de refuerzo.',
        actions: (
          <div className="space-y-3">
            <button onClick={() => setModal((m) => ({ ...m, open: false }))} className="tm-btn tm-btn-secondary w-full">
              Cerrar
            </button>
          </div>
        )
      });
      return;
    }

    try {
      const res = await api.post('/refuerzos', {
        bus_objetivo_id: bus.id,
        linea_id: bus.linea_id || null,
        estacion_id: bus.estacion_actual_id || null
      });
      const order = res?.data;
      setModal({
        open: true,
        title: 'Orden de Refuerzo',
        content: `Unidad ${bus.unidad} • ${stationLabel || 'En ruta'} • Orden #${order?.id ?? '—'} (${order?.estado ?? '—'}).`,
        actions: (
          <div className="space-y-3">
            <button
              onClick={() => {
                setModal((m) => ({ ...m, open: false }));
                navigate('/reinforcements');
              }}
              className="w-full py-3 rounded bg-muni-blue text-white font-bold text-[10px] uppercase tracking-widest shadow-lg hover:bg-muni-blue-light transition-all"
            >
              Ver órdenes de refuerzo
            </button>
            <button onClick={() => setModal((m) => ({ ...m, open: false }))} className="tm-btn tm-btn-secondary w-full">
              Cerrar
            </button>
          </div>
        )
      });
      refresh({ silent: true });
    } catch (err) {
      const msg = err?.response?.data?.message || 'No se pudo crear la orden de refuerzo';
      setModal({
        open: true,
        title: 'Error',
        content: msg,
        actions: (
          <button onClick={() => setModal((m) => ({ ...m, open: false }))} className="tm-btn tm-btn-secondary w-full">Cerrar</button>
        )
      });
    }
  };

  const dispatchRefuerzo = async (bus, stationLabel) => {
    if (!canWriteRefuerzos) {
      setModal({
        open: true,
        title: 'Acceso denegado',
        content: 'No tienes permisos para despachar órdenes de refuerzo.',
        actions: (
          <div className="space-y-3">
            <button onClick={() => setModal((m) => ({ ...m, open: false }))} className="tm-btn tm-btn-secondary w-full">
              Cerrar
            </button>
          </div>
        )
      });
      return;
    }

    try {
      const res = await api.post('/refuerzos', {
        bus_objetivo_id: bus.id,
        linea_id: bus.linea_id || null,
        estacion_id: bus.estacion_actual_id || null
      });
      const order = res?.data;
      let current = order;
      if (current?.id) {
        const from = String(current?.estado ?? '');
        if (from === 'pendiente') {
          const r1 = await api.put(`/refuerzos/${current.id}/estado`, { estado: 'alistando' });
          current = r1?.data ?? current;
        }
        if (String(current?.estado ?? '') === 'alistando') {
          const r2 = await api.put(`/refuerzos/${current.id}/estado`, { estado: 'despachado' });
          current = r2?.data ?? current;
        }
      }

      setModal({
        open: true,
        title: 'Refuerzo Despachado',
        content: `Unidad ${bus.unidad} • ${stationLabel || 'En ruta'} • Orden #${current?.id ?? '—'} (${current?.estado ?? '—'}).`,
        actions: (
          <div className="space-y-3">
            <button
              onClick={() => {
                setModal((m) => ({ ...m, open: false }));
                navigate('/reinforcements');
              }}
              className="w-full py-3 rounded bg-muni-blue text-white font-bold text-[10px] uppercase tracking-widest shadow-lg hover:bg-muni-blue-light transition-all"
            >
              Ver órdenes de refuerzo
            </button>
            <button onClick={() => setModal((m) => ({ ...m, open: false }))} className="tm-btn tm-btn-secondary w-full">
              Cerrar
            </button>
          </div>
        )
      });
      refresh({ silent: true });
    } catch (err) {
      const msg = err?.response?.data?.message || 'No se pudo despachar la orden de refuerzo';
      setModal({
        open: true,
        title: 'Error',
        content: msg,
        actions: (
          <button onClick={() => setModal((m) => ({ ...m, open: false }))} className="tm-btn tm-btn-secondary w-full">Cerrar</button>
        )
      });
    }
  };

  const handleSelectBus = (bus, station) => {
    const criticalPct = Number.isFinite(config?.saturation_pct) ? config.saturation_pct : Number.POSITIVE_INFINITY;
    const isCritical = bus.ocupacion >= criticalPct;

    const goToFleet = () => {
      setModal((m) => ({ ...m, open: false }));
      navigate('/buses', { state: { openBusId: bus.id } });
    };

    setModal({
      open: true,
      title: `Diagnóstico de Unidad: ${bus.unidad}`,
      content: isCritical 
        ? `ALERTA CRÍTICA (R-01): La unidad ${bus.unidad} en ${station} reporta ${bus.ocupacion}% de ocupación. Se requiere despacho de refuerzo.`
        : `ESTADO ÓPTIMO: La unidad ${bus.unidad} en ${station} reporta ${bus.ocupacion}% de ocupación. No se requiere acción inmediata.`,
      actions: (
        <div className="space-y-3">
          {isCritical && (
            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={() => requestRefuerzo(bus, station)}
                disabled={!canWriteRefuerzos}
                className={`tm-btn tm-btn-primary w-full ${canWriteRefuerzos ? '' : ''}`}
              >
                {canWriteRefuerzos ? 'Solicitar Refuerzo (Orden)' : 'Sin permiso para refuerzo'}
              </button>
              <button
                onClick={() => dispatchRefuerzo(bus, station)}
                disabled={!canWriteRefuerzos}
                className={`tm-btn tm-btn-warn w-full ${canWriteRefuerzos ? '' : ''}`}
              >
                {canWriteRefuerzos ? 'Enviar / Despachar Refuerzo' : 'Sin permiso para refuerzo'}
              </button>
            </div>
          )}
          <button
            onClick={goToFleet}
            className="tm-btn tm-btn-success w-full"
          >
            Ver detalles en Flota
          </button>
          <button onClick={() => setModal((m) => ({ ...m, open: false }))} className="tm-btn tm-btn-secondary w-full">
            Cerrar
          </button>
        </div>
      )
    });
  };

  const handleSelectAlert = (alerta) => {
    setModal({
      open: true,
      title: `Alerta de Sistema: ${alerta.tipo.toUpperCase()}`,
      content: alerta.mensaje,
      actions: null
    });

    const id = alerta?.id;
    if (!id) return;
    if (alerta?.leida) return;
    if (!canWriteAlertas) {
      setNotification({ tone: 'info', message: 'No tienes permisos para marcar alertas como leídas.' });
      return;
    }

    setAlertas((prev) => prev.map((a) => (a.id === id ? { ...a, leida: 1 } : a)));
    (async () => {
      try {
        await api.put(`/alertas/${id}/leida`);
      } catch (err) {
        setAlertas((prev) => prev.map((a) => (a.id === id ? { ...a, leida: 0 } : a)));
        const msg = err?.response?.data?.message || 'No se pudo marcar la alerta como leída.';
        setNotification({ tone: 'error', message: msg });
      }
    })();
  };

  return (
    <div className="animate-in fade-in duration-500 pb-12">
      <Notification
        message={notification.message}
        tone={notification.tone}
        onClose={() => setNotification({ tone: 'info', message: '' })}
      />
      <ActionModal 
        isOpen={modal.open} 
        onClose={() => setModal({ ...modal, open: false })} 
        title={modal.title} 
        content={modal.content} 
        actions={modal.actions}
      />
      
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black text-white/90 tracking-tight uppercase italic">Monitoreo Operativo</h2>
          <p className="text-[10px] text-white/65 font-bold uppercase tracking-[0.2em] mt-1">Consola de Mando de Ejes Transmetro</p>
          <div className="mt-2 flex items-center gap-3">
            <span className="text-[9px] font-bold text-white/65 uppercase tracking-widest">
              {lastUpdatedAt ? `Actualizado: ${lastUpdatedAt.toLocaleTimeString()}` : 'Actualizado: —'}
            </span>
          </div>
        </div>
        <div className="flex items-end gap-6">
          <button
            onClick={() => {
              setNotification({ tone: 'info', message: '' });
              refresh({ silent: false });
            }}
            disabled={loading}
            className="tm-btn tm-btn-ghost tm-btn-sm"
          >
            {loading ? 'Actualizando...' : 'Actualizar'}
          </button>
          <div className="text-right">
            <p className="text-[8px] font-black text-white/65 uppercase tracking-widest">Ocupación Promedio</p>
            <p className="text-xl font-black text-muni-cyan tracking-tighter">
              {(() => {
                const all = Array.isArray(buses) ? buses : [];
                if (all.length === 0) return '0%';
                const avg = all.reduce((acc, b) => acc + (b.ocupacion || 0), 0) / all.length;
                return `${avg.toFixed(1)}%`;
              })()}
            </p>
          </div>
          <div className="w-px h-8 bg-white/10"></div>
          <div className="text-right">
            <p className="text-[8px] font-black text-white/65 uppercase tracking-widest">Unidades en Ruta</p>
            <p className="text-xl font-black text-muni-green tracking-tighter">
              {(() => {
                const all = Array.isArray(buses) ? buses : [];
                return all.filter((b) => b.estado === 'EnRuta').length;
              })()}
            </p>
          </div>
          {canReadRefuerzos && (
            <>
              <div className="w-px h-8 bg-white/10"></div>
              <div className="text-right">
                <p className="text-[8px] font-black text-white/65 uppercase tracking-widest">Refuerzos (abiertos)</p>
                <p className="text-xl font-black text-muni-orange tracking-tighter">
                  {(() => {
                    const all = Array.isArray(refuerzos) ? refuerzos : [];
                    const abiertos = new Set(['pendiente', 'alistando', 'despachado']);
                    return all.filter((r) => abiertos.has(String(r.estado))).length;
                  })()}
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Tablero de Clasificación por Ocupación */}
      <OccupancyBoard buses={buses} config={config} onSelectBus={handleSelectBus} />

      <BusesTable buses={buses} ejes={ejes} onSelectBus={handleSelectBus} />

      <div className="space-y-4">
        {ejes.length > 0 ? ejes.map((eje) => (
          <EjeMonitor key={eje.id} eje={eje} buses={buses} onSelectBus={handleSelectBus} />
        )) : (
          <div className="tm-card tm-card-inset p-8 shadow-sm">
            <p className="text-sm font-bold text-white/60">Sin ejes para mostrar.</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-1 tm-card tm-card-inset p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xs font-black text-white/85 uppercase tracking-widest italic">Alertas Críticas</h3>
            <span className="w-1.5 h-1.5 bg-muni-red rounded-full animate-pulse"></span>
          </div>

          <div className="space-y-4">
            {alertas.length > 0 ? alertas.map(alerta => (
              <div 
                key={alerta.id} 
                className={`p-4 rounded border border-white/10 bg-white/6 hover:border-white/20 transition-all cursor-pointer group ${alerta.leida ? 'opacity-60' : ''}`}
                onClick={() => handleSelectAlert(alerta)}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[9px] font-black text-white/80 tracking-widest mb-1 uppercase group-hover:text-white/95">{alerta.tipo}</p>
                  {!alerta.leida && <span className="text-[8px] font-black text-muni-red uppercase tracking-widest">Nueva</span>}
                </div>
                <p className="text-[10px] font-bold text-white/60 leading-snug">{alerta.mensaje}</p>
              </div>
            )) : (
              <div className="p-4 rounded border border-white/10 bg-white/6">
                <p className="text-sm font-bold text-white/60">Sin alertas.</p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 bg-muni-blue-900 rounded-xl p-8 relative overflow-hidden shadow-lg border border-white/5">
          <div className="relative z-10 h-full flex flex-col">
            <h3 className="text-[9px] font-black text-white/55 uppercase tracking-[0.3em] mb-8 italic">Eficiencia de Red</h3>
            <div className="flex-1 flex items-end space-x-2">
              {[60, 40, 85, 30, 95, 70, 50, 80, 90, 45, 75, 55, 80, 65, 90].map((h, i) => (
                <div key={i} className="flex-1 bg-white/10 rounded-t transition-all hover:bg-muni-green group relative cursor-pointer" style={{ height: `${h}%` }}>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-muni-blue-900 text-[8px] font-black px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {h}%
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 flex justify-between items-center border-t border-white/5 pt-6">
              <p className="text-3xl font-black text-white italic tracking-tighter">94.2%</p>
              <div className="text-right">
                <p className="text-[9px] font-black text-muni-green uppercase tracking-widest">Rendimiento Peak</p>
                <p className="text-[7px] font-bold text-white/65 uppercase tracking-tighter">
                  {lastUpdatedAt ? `Sincronizado: ${lastUpdatedAt.toLocaleTimeString()}` : 'Sincronizado: —'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
