import React, { useCallback, useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext.jsx';

const estadoToneClass = (codigo) => {
  const c = String(codigo ?? '');
  if (c === 'pendiente') return 'bg-muni-orange/10 text-muni-orange border border-muni-orange/20';
  if (c === 'alistando') return 'bg-muni-orange/10 text-muni-orange border border-muni-orange/20';
  if (c === 'despachado') return 'bg-muni-blue/10 text-muni-cyan border border-muni-blue/20';
  if (c === 'completado') return 'bg-muni-green/10 text-muni-green border border-muni-green/20';
  if (c === 'cancelado') return 'bg-white/8 text-white/60 border border-white/10';
  return 'bg-white/8 text-white/60 border border-white/10';
};

const estadoActionBtnClass = (codigo) => {
  const c = String(codigo ?? '');
  if (c === 'pendiente') return 'bg-white/10 text-muni-orange border border-muni-orange/25 hover:bg-white/15';
  if (c === 'alistando') return 'bg-white/10 text-muni-orange border border-muni-orange/25 hover:bg-white/15';
  if (c === 'despachado') return 'bg-white/10 text-muni-cyan border border-muni-blue/25 hover:bg-white/15';
  if (c === 'completado') return 'bg-white/10 text-muni-green border border-muni-green/25 hover:bg-white/15';
  if (c === 'cancelado') return 'bg-white/10 text-white/75 border border-white/10 hover:bg-white/15';
  return 'bg-white/10 text-white/75 border border-white/10 hover:bg-white/15';
};

const ReinforcementCard = ({ order, onSetEstado, canManage, canTransition, estados, transitions, isClosed }) => {
  const meta = (estados || []).find((s) => String(s.codigo) === String(order.estado));
  const badgeCls = estadoToneClass(order.estado);
  const badgeLabel = meta?.nombre || order.estado;
  const nextTargets = (transitions || [])
    .filter((t) => String(t.desde_estado) === String(order.estado))
    .map((t) => String(t.hacia_estado));
  const uniqueNextTargets = Array.from(new Set(nextTargets));
  const showActions = canManage && !isClosed && uniqueNextTargets.length > 0;

  return (
    <div className="tm-card tm-card-inset p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="text-lg font-black text-white/90 uppercase tracking-tighter italic">Orden #{order.id}</h4>
          <p className="text-[10px] font-bold text-white/45 uppercase tracking-widest mt-0.5">
            Bus objetivo: {order.bus_objetivo_numero_unidad || 'N/A'}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${badgeCls}`}>
          {badgeLabel}
        </span>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-bold text-white/45 uppercase tracking-widest">Línea</span>
          <span className="text-[10px] font-black text-white/85 uppercase italic">{order.linea_nombre || 'N/A'}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-bold text-white/45 uppercase tracking-widest">Estación</span>
          <span className="text-[10px] font-black text-white/85 uppercase italic">{order.estacion_nombre || 'N/A'}</span>
        </div>
      </div>

      {showActions && (
        <div className="flex space-x-2">
          {uniqueNextTargets.map((to) => {
            const toMeta = (estados || []).find((s) => String(s.codigo) === String(to));
            const btnCls = estadoActionBtnClass(to);
            const btnLabel = toMeta?.nombre || to;
            return (
              <button
                key={to}
                onClick={() => onSetEstado(order.id, to)}
                className={`tm-btn tm-btn-xs flex-1 ${btnCls}`}
                disabled={!canTransition(order.estado, to)}
              >
                {btnLabel}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default function Reinforcements() {
  const { user } = useAuth();
  const userPerms = Array.isArray(user?.permisos) ? user.permisos : [];
  const canManage = userPerms.includes('refuerzos:write');
  const [orders, setOrders] = useState([]);
  const [notification, setNotification] = useState(null);
  const [transitions, setTransitions] = useState([]);
  const [estados, setEstados] = useState([]);
  const [view, setView] = useState('activos');
  const [mode, setMode] = useState('tabla');
  const [q, setQ] = useState('');
  const [sort, setSort] = useState({ key: 'prioridad', dir: 'desc' });
  const [nowTs, setNowTs] = useState(0);

  function showNotification(msg) {
    setNotification(msg);
    setTimeout(() => setNotification(null), 5000);
  }

  const load = async () => {
    const [{ data }, { data: meta }] = await Promise.all([api.get('/refuerzos'), api.get('/refuerzos/meta')]);
    setOrders(data || []);
    setTransitions(meta?.transiciones || []);
    setEstados(meta?.estados || []);
  };

  useEffect(() => {
    let alive = true;
    const run = async () => {
      try {
        await load();
      } catch {
        if (!alive) return;
        showNotification('No se pudieron cargar las órdenes de refuerzo.');
      }
    };
    if (alive) run();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    const initial = setTimeout(() => setNowTs(Date.now()), 0);
    const interval = setInterval(() => {
      setNowTs(Date.now());
    }, 30000);
    return () => {
      clearTimeout(initial);
      clearInterval(interval);
    };
  }, []);

  const handleSetEstado = async (id, estado) => {
    try {
      await api.put(`/refuerzos/${id}/estado`, { estado });
      await load();
      showNotification(`Orden #${id} actualizada a ${estado}.`);
    } catch {
      showNotification(`No se pudo actualizar la orden #${id}.`);
    }
  };

  const canTransition = (from, to) => {
    if (!from || !to) return false;
    if (String(from) === String(to)) return true;
    return (transitions || []).some((t) => String(t.desde_estado) === String(from) && String(t.hacia_estado) === String(to));
  };

  const outgoingFrom = useMemo(() => {
    return new Set((transitions || []).map((t) => String(t.desde_estado)));
  }, [transitions]);

  const isClosedOrder = useCallback(
    (order) => {
      const estado = String(order?.estado ?? '');
      if (!estado) return false;
      return !outgoingFrom.has(estado);
    },
    [outgoingFrom]
  );

  const toDateSafe = useCallback((value) => {
    if (!value) return null;
    if (value instanceof Date) {
      if (Number.isFinite(value.getTime())) return value;
      return null;
    }
    const d1 = new Date(value);
    if (Number.isFinite(d1.getTime())) return d1;
    if (typeof value === 'string') {
      const normalized = value.replace(' ', 'T');
      const d2 = new Date(normalized);
      if (Number.isFinite(d2.getTime())) return d2;
    }
    return null;
  }, []);

  const fmtDateTime = useCallback(
    (value) => {
      const d = toDateSafe(value);
      if (!d) return '—';
      return d.toLocaleString();
    },
    [toDateSafe]
  );

  const ageMinutes = useCallback(
    (order) => {
      const d = toDateSafe(order?.created_at);
      if (!d) return null;
      const diff = nowTs - d.getTime();
      if (!Number.isFinite(diff)) return null;
      return Math.max(0, Math.floor(diff / 60000));
    },
    [nowTs, toDateSafe]
  );

  const getPriority = useCallback(
    (order) => {
      if (isClosedOrder(order)) {
        return { label: 'CERRADA', rank: 0, cls: 'bg-white/8 text-white/60 border-white/10' };
      }
      const estado = String(order?.estado ?? '');
      const age = ageMinutes(order);
      let rank = estado === 'pendiente' ? 3 : estado === 'alistando' ? 2 : 1;
      if (rank === 3 && age !== null && age >= 10) rank = 4;
      if (rank === 2 && age !== null && age >= 15) rank = 3;
      if (rank === 1 && age !== null && age >= 30) rank = 2;
      if (rank >= 4) return { label: 'CRÍTICA', rank: 4, cls: 'bg-muni-red/10 text-muni-red border-muni-red/20' };
      if (rank === 3) return { label: 'ALTA', rank: 3, cls: 'bg-muni-orange/10 text-muni-orange border-muni-orange/20' };
      if (rank === 2) return { label: 'MEDIA', rank: 2, cls: 'bg-muni-blue/10 text-muni-cyan border-muni-blue/20' };
      return { label: 'BAJA', rank: 1, cls: 'bg-muni-green/10 text-muni-green border-muni-green/20' };
    },
    [ageMinutes, isClosedOrder]
  );

  const toggleSort = (key) => {
    setSort((prev) => {
      if (prev.key !== key) {
        const defaultDir = key === 'created_at' ? 'asc' : key === 'updated_at' ? 'desc' : key === 'prioridad' ? 'desc' : 'asc';
        return { key, dir: defaultDir };
      }
      return { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' };
    });
  };

  const sortIndicator = (key) => {
    if (sort.key !== key) return '';
    return sort.dir === 'asc' ? '▲' : '▼';
  };

  const filteredOrders = useMemo(() => {
    const normalizedQuery = String(q || '').trim().toLowerCase();
    const base = Array.isArray(orders) ? orders : [];
    const filteredByView =
      view === 'activos'
        ? base.filter((o) => !isClosedOrder(o))
        : view === 'cerrados'
          ? base.filter((o) => isClosedOrder(o))
          : base;

    const filtered = !normalizedQuery
      ? filteredByView
      : filteredByView.filter((o) => {
          const unidad = String(o?.bus_objetivo_numero_unidad ?? '').toLowerCase();
          const linea = String(o?.linea_nombre ?? '').toLowerCase();
          const estacion = String(o?.estacion_nombre ?? '').toLowerCase();
          const estado = String(o?.estado ?? '').toLowerCase();
          return unidad.includes(normalizedQuery) || linea.includes(normalizedQuery) || estacion.includes(normalizedQuery) || estado.includes(normalizedQuery);
        });

    const dir = sort.dir === 'asc' ? 1 : -1;
    const mapped = filtered.map((o, idx) => ({ o, idx }));
    mapped.sort((a, c) => {
      const ao = a.o;
      const co = c.o;
      if (sort.key === 'created_at') {
        const ad = toDateSafe(ao?.created_at)?.getTime() ?? 0;
        const cd = toDateSafe(co?.created_at)?.getTime() ?? 0;
        if (ad !== cd) return (ad - cd) * dir;
      } else if (sort.key === 'updated_at') {
        const ad = toDateSafe(ao?.updated_at)?.getTime() ?? 0;
        const cd = toDateSafe(co?.updated_at)?.getTime() ?? 0;
        if (ad !== cd) return (ad - cd) * dir;
      } else if (sort.key === 'prioridad') {
        const ap = getPriority(ao).rank;
        const cp = getPriority(co).rank;
        if (ap !== cp) return (ap - cp) * dir;
        const ad = toDateSafe(ao?.created_at)?.getTime() ?? 0;
        const cd = toDateSafe(co?.created_at)?.getTime() ?? 0;
        if (ad !== cd) return (ad - cd) * 1;
      } else if (sort.key === 'estado') {
        const av = String(ao?.estado ?? '');
        const cv = String(co?.estado ?? '');
        const cmp = av.localeCompare(cv, undefined, { numeric: true, sensitivity: 'base' });
        if (cmp !== 0) return cmp * dir;
      } else if (sort.key === 'unidad') {
        const av = String(ao?.bus_objetivo_numero_unidad ?? '');
        const cv = String(co?.bus_objetivo_numero_unidad ?? '');
        const cmp = av.localeCompare(cv, undefined, { numeric: true, sensitivity: 'base' });
        if (cmp !== 0) return cmp * dir;
      } else if (sort.key === 'linea') {
        const av = String(ao?.linea_nombre ?? '');
        const cv = String(co?.linea_nombre ?? '');
        const cmp = av.localeCompare(cv, undefined, { numeric: true, sensitivity: 'base' });
        if (cmp !== 0) return cmp * dir;
      } else if (sort.key === 'estacion') {
        const av = String(ao?.estacion_nombre ?? '');
        const cv = String(co?.estacion_nombre ?? '');
        const cmp = av.localeCompare(cv, undefined, { numeric: true, sensitivity: 'base' });
        if (cmp !== 0) return cmp * dir;
      }
      return a.idx - c.idx;
    });
    return mapped.map((x) => x.o);
  }, [getPriority, isClosedOrder, orders, q, sort.dir, sort.key, toDateSafe, view]);

  const estadoMeta = useCallback(
    (codigo) => {
      return (estados || []).find((s) => String(s.codigo) === String(codigo)) ?? null;
    },
    [estados]
  );

  const nextTargetsFor = useCallback(
    (order) => {
      const nextTargets = (transitions || [])
        .filter((t) => String(t.desde_estado) === String(order?.estado))
        .map((t) => String(t.hacia_estado));
      return Array.from(new Set(nextTargets));
    },
    [transitions]
  );

  const actionBtnClass = useCallback((uiClass) => {
    const base = String(uiClass || 'bg-white/10 text-white/75 border border-white/10 hover:bg-white/15').trim();
    return `px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-colors ${base}`;
  }, []);

  const rowTone = useCallback(
    (order) => {
      const p = getPriority(order).rank;
      if (p >= 4) return 'bg-muni-red/5';
      if (p === 3) return 'bg-muni-orange/5';
      return 'bg-transparent';
    },
    [getPriority]
  );

  const counts = useMemo(() => {
    const base = Array.isArray(orders) ? orders : [];
    let activos = 0;
    let cerrados = 0;
    for (const o of base) {
      if (isClosedOrder(o)) cerrados += 1;
      else activos += 1;
    }
    return { activos, cerrados, total: base.length };
  }, [isClosedOrder, orders]);

  const filteredOrdersCount = filteredOrders.length;

  const resultsCaption = useMemo(() => {
    const t = counts.total;
    const a = counts.activos;
    const c = counts.cerrados;
    const v = view === 'activos' ? `Activas: ${a}` : view === 'cerrados' ? `Cerradas: ${c}` : `Total: ${t}`;
    return `${v} • Mostrando: ${filteredOrdersCount}`;
  }, [counts.activos, counts.cerrados, counts.total, filteredOrdersCount, view]);

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:justify-between md:items-end">
        <div>
          <h2 className="text-2xl font-black text-white/90 tracking-tight uppercase italic">Órdenes de Refuerzo</h2>
          <p className="text-[10px] text-white/45 font-bold uppercase tracking-[0.2em] mt-1">Gestión de despacho por saturación</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-muni-orange/15 border border-muni-orange/25 text-white flex flex-col items-center">
            <span className="text-[8px] font-black uppercase tracking-widest opacity-80 leading-none">Activas</span>
            <span className="text-lg font-black italic text-muni-orange">{counts.activos}</span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-white/8 text-white/80 flex flex-col items-center border border-white/10">
            <span className="text-[8px] font-black uppercase tracking-widest opacity-60 leading-none">Cerradas</span>
            <span className="text-lg font-black italic text-white/80">{counts.cerrados}</span>
          </div>
        </div>
      </div>

      {notification && (
        <div className="mb-6 p-4 bg-muni-blue-900 text-white rounded-lg shadow-xl border-l-4 border-muni-green animate-in slide-in-from-top-4">
          <div className="flex items-center space-x-3">
            <span className="text-muni-green">✓</span>
            <p className="text-[10px] font-black uppercase tracking-widest">{notification}</p>
          </div>
        </div>
      )}

      <div className="mb-6 tm-card tm-card-inset p-5 shadow-sm overflow-hidden">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-6">
            <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setView('activos')}
              className={`tm-btn tm-btn-sm ${view === 'activos' ? 'tm-btn-primary' : 'tm-btn-ghost'}`}
            >
              Activas
            </button>
            <button
              type="button"
              onClick={() => setView('cerrados')}
              className={`tm-btn tm-btn-sm ${view === 'cerrados' ? 'tm-btn-primary' : 'tm-btn-ghost'}`}
            >
              Cerradas
            </button>
            <button
              type="button"
              onClick={() => setView('todas')}
              className={`tm-btn tm-btn-sm ${view === 'todas' ? 'tm-btn-primary' : 'tm-btn-ghost'}`}
            >
              Todas
            </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMode('tabla')}
                className={`tm-btn tm-btn-sm ${mode === 'tabla' ? 'tm-btn-primary' : 'tm-btn-ghost'}`}
              >
                Tabla
              </button>
              <button
                type="button"
                onClick={() => setMode('tarjetas')}
                className={`tm-btn tm-btn-sm ${mode === 'tarjetas' ? 'tm-btn-primary' : 'tm-btn-ghost'}`}
              >
                Tarjetas
              </button>
            </div>
          </div>

          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar… (unidad / línea / estación / estado)"
            className="w-full md:w-96 tm-input"
          />
        </div>
        <div className="mt-3 text-[9px] font-bold text-white/45 uppercase tracking-widest">{resultsCaption}</div>
      </div>

      {mode === 'tabla' ? (
        <div className="tm-card tm-card-inset shadow-sm overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 text-[9px] font-black text-white/45 uppercase tracking-widest w-24">
                    <button type="button" onClick={() => toggleSort('created_at')} className="hover:text-white/75 transition-colors">
                      Entrada {sortIndicator('created_at')}
                    </button>
                  </th>
                  <th className="px-6 py-4 text-[9px] font-black text-white/45 uppercase tracking-widest w-24">
                    <button type="button" onClick={() => toggleSort('prioridad')} className="hover:text-white/75 transition-colors">
                      Prioridad {sortIndicator('prioridad')}
                    </button>
                  </th>
                  <th className="px-6 py-4 text-[9px] font-black text-white/45 uppercase tracking-widest w-24">
                    <button type="button" onClick={() => toggleSort('estado')} className="hover:text-white/75 transition-colors">
                      Estado {sortIndicator('estado')}
                    </button>
                  </th>
                  <th className="px-6 py-4 text-[9px] font-black text-white/45 uppercase tracking-widest">
                    <button type="button" onClick={() => toggleSort('unidad')} className="hover:text-white/75 transition-colors">
                      Unidad {sortIndicator('unidad')}
                    </button>
                  </th>
                  <th className="px-6 py-4 text-[9px] font-black text-white/45 uppercase tracking-widest">
                    <button type="button" onClick={() => toggleSort('linea')} className="hover:text-white/75 transition-colors">
                      Línea {sortIndicator('linea')}
                    </button>
                  </th>
                  <th className="px-6 py-4 text-[9px] font-black text-white/45 uppercase tracking-widest">
                    <button type="button" onClick={() => toggleSort('estacion')} className="hover:text-white/75 transition-colors">
                      Estación {sortIndicator('estacion')}
                    </button>
                  </th>
                  <th className="px-6 py-4 text-[9px] font-black text-white/45 uppercase tracking-widest w-40">
                    <button type="button" onClick={() => toggleSort('updated_at')} className="hover:text-white/75 transition-colors">
                      Último cambio {sortIndicator('updated_at')}
                    </button>
                  </th>
                  <th className="px-6 py-4 text-[9px] font-black text-white/45 uppercase tracking-widest w-24">Edad</th>
                  <th className="px-6 py-4 text-[9px] font-black text-white/45 uppercase tracking-widest w-64">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredOrders.map((order) => {
                  const estadoInfo = estadoMeta(order.estado);
                  const badgeCls = estadoToneClass(order.estado);
                  const badgeLabel = estadoInfo?.nombre || order.estado;
                  const isClosed = isClosedOrder(order);
                  const pr = getPriority(order);
                  const nextTargets = nextTargetsFor(order);
                  const showActions = canManage && !isClosed && nextTargets.length > 0;
                  const age = ageMinutes(order);

                  return (
                    <tr key={order.id} className={`${rowTone(order)} hover:bg-white/5 transition-colors`}>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-white/90">#{order.id}</span>
                          <span className="text-[9px] font-bold text-white/45">{fmtDateTime(order.created_at)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded border text-[9px] font-black uppercase tracking-widest ${pr.cls}`}>
                          {pr.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${badgeCls}`}>
                          {badgeLabel}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] font-black text-white/90 uppercase tracking-widest">{order.bus_objetivo_numero_unidad || 'N/A'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] font-black text-white/85 uppercase italic">{order.linea_nombre || 'N/A'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] font-black text-white/85 uppercase italic">{order.estacion_nombre || 'N/A'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[9px] font-bold text-white/55">{fmtDateTime(order.updated_at)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] font-black text-white/75">{age === null ? '—' : `${age}m`}</span>
                      </td>
                      <td className="px-6 py-4">
                        {showActions ? (
                          <div className="flex items-center gap-2">
                            {nextTargets.slice(0, 2).map((to) => {
                              const toMeta = estadoMeta(to);
                              const btnLabel = toMeta?.nombre || to;
                              const cls = estadoActionBtnClass(to);
                              return (
                                <button
                                  key={to}
                                  onClick={() => handleSetEstado(order.id, to)}
                                  className={actionBtnClass(cls)}
                                  disabled={!canTransition(order.estado, to)}
                                >
                                  {btnLabel}
                                </button>
                              );
                            })}
                          </div>
                        ) : (
                          <span className="text-[9px] font-bold text-white/45">{isClosed ? 'Cerrada' : '—'}</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {filteredOrders.length === 0 && (
                  <tr className="bg-transparent">
                    <td colSpan={9} className="px-6 py-10 text-center text-[10px] font-black text-white/55 uppercase tracking-widest italic">
                      Sin órdenes para mostrar
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.map((order) => (
            <ReinforcementCard
              key={order.id}
              order={order}
              onSetEstado={handleSetEstado}
              canManage={canManage}
              canTransition={canTransition}
              estados={estados}
              transitions={transitions}
              isClosed={isClosedOrder(order)}
            />
          ))}
          {filteredOrders.length === 0 && (
            <div className="col-span-full tm-card tm-card-inset p-10 text-center">
              <p className="text-[10px] font-black text-white/55 uppercase tracking-widest italic">Sin órdenes para mostrar</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
