import React, { useEffect, useState } from 'react';
import api from '../services/api';

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

const Reports = () => {
  const [estacionesReport, setEstacionesReport] = useState(null);
  const [lineasReport, setLineasReport] = useState(null);
  const [busesPorLineaReport, setBusesPorLineaReport] = useState(null);
  const [notification, setNotification] = useState({ message: '', tone: 'info' });

  useEffect(() => {
    let alive = true;
    const run = async () => {
      try {
        const [estaciones, lineas, busesPorLinea] = await Promise.all([
          api.get('/reportes/estaciones'),
          api.get('/reportes/lineas'),
          api.get('/reportes/buses-por-linea')
        ]);
        if (!alive) return;
        setEstacionesReport(estaciones.data);
        setLineasReport(lineas.data);
        setBusesPorLineaReport(busesPorLinea.data);
      } catch {
        if (!alive) return;
        setNotification({ tone: 'error', message: 'No se pudieron cargar los reportes.' });
      }
    };
    run();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="animate-in fade-in duration-500">
      <Notification
        message={notification.message}
        tone={notification.tone}
        onClose={() => setNotification({ tone: 'info', message: '' })}
      />
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-2xl font-black text-white/90 tracking-tight uppercase italic">Centro de Reportes</h2>
          <p className="text-[10px] text-white/45 font-bold uppercase tracking-[0.2em] mt-1">Análisis Operativo y Exportación de Datos</p>
        </div>
        <div className="flex space-x-2">
          <button className="tm-btn tm-btn-sm tm-btn-primary">
            Exportar Excel
          </button>
          <button className="tm-btn tm-btn-sm tm-btn-secondary">
            Descargar PDF
          </button>
        </div>
      </div>

      <div className="tm-card tm-card-inset shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-white/10 flex justify-between items-center bg-white/4">
          <h3 className="text-xs font-black text-white/85 uppercase tracking-widest italic">Reporte: Estaciones</h3>
          <span className="text-[8px] font-black text-white/45 uppercase tracking-widest italic">Accesos • Guardias • Operador</span>
        </div>
        <table className="w-full text-left">
          <thead className="bg-white/5 border-b border-white/10">
            <tr>
              <th className="px-8 py-5 text-[9px] font-black text-white/45 uppercase tracking-widest">Estación</th>
              <th className="px-8 py-5 text-[9px] font-black text-white/45 uppercase tracking-widest">Operador</th>
              <th className="px-8 py-5 text-[9px] font-black text-white/45 uppercase tracking-widest">Accesos</th>
              <th className="px-8 py-5 text-[9px] font-black text-white/45 uppercase tracking-widest text-right">Guardias</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {(estacionesReport?.data || []).map((e) => {
              const accesos = e.accesos || [];
              const guardias = accesos.reduce((acc, a) => acc + (a.guardias || []).length, 0);
              return (
                <tr key={e.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-8 py-5 text-xs font-black text-white/90 tracking-tight uppercase italic">{e.nombre}</td>
                  <td className="px-8 py-5 text-xs font-bold text-white/70">{e.operador?.nombre || 'N/A'}</td>
                  <td className="px-8 py-5 text-xs font-bold text-white/70">{accesos.length}</td>
                  <td className="px-8 py-5 text-right text-xs font-black text-muni-cyan">{guardias}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="tm-card tm-card-inset shadow-sm overflow-hidden mt-8">
        <div className="px-8 py-6 border-b border-white/10 flex justify-between items-center bg-white/4">
          <h3 className="text-xs font-black text-white/85 uppercase tracking-widest italic">Reporte: Líneas</h3>
          <span className="text-[8px] font-black text-white/45 uppercase tracking-widest italic">Buses asignados • Distancia total</span>
        </div>
        <table className="w-full text-left">
          <thead className="bg-white/5 border-b border-white/10">
            <tr>
              <th className="px-8 py-5 text-[9px] font-black text-white/45 uppercase tracking-widest">Línea</th>
              <th className="px-8 py-5 text-[9px] font-black text-white/45 uppercase tracking-widest">Buses</th>
              <th className="px-8 py-5 text-[9px] font-black text-white/45 uppercase tracking-widest text-right">Distancia (km)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {(lineasReport?.data || []).map((l) => (
              <tr key={l.id} className="hover:bg-white/5 transition-colors">
                <td className="px-8 py-5 text-xs font-black text-white/90 tracking-tight uppercase italic">{l.nombre}</td>
                <td className="px-8 py-5 text-xs font-bold text-white/70">{l.buses_count}</td>
                <td className="px-8 py-5 text-right text-xs font-black text-muni-cyan">{Number(l.distancia_total_km || 0).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="tm-card tm-card-inset shadow-sm overflow-hidden mt-8">
        <div className="px-8 py-6 border-b border-white/10 flex justify-between items-center bg-white/4">
          <h3 className="text-xs font-black text-white/85 uppercase tracking-widest italic">Reporte: Buses por Línea</h3>
          <span className="text-[8px] font-black text-white/45 uppercase tracking-widest italic">Regla N a 2N</span>
        </div>
        <table className="w-full text-left">
          <thead className="bg-white/5 border-b border-white/10">
            <tr>
              <th className="px-8 py-5 text-[9px] font-black text-white/45 uppercase tracking-widest">Línea</th>
              <th className="px-8 py-5 text-[9px] font-black text-white/45 uppercase tracking-widest">Estaciones</th>
              <th className="px-8 py-5 text-[9px] font-black text-white/45 uppercase tracking-widest">Buses</th>
              <th className="px-8 py-5 text-[9px] font-black text-white/45 uppercase tracking-widest text-right">Cumple</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {(busesPorLineaReport?.data || []).map((r) => (
              <tr key={r.linea_id} className="hover:bg-white/5 transition-colors">
                <td className="px-8 py-5 text-xs font-black text-white/90 tracking-tight uppercase italic">{r.linea_nombre}</td>
                <td className="px-8 py-5 text-xs font-bold text-white/70">{r.estaciones_count}</td>
                <td className="px-8 py-5 text-xs font-bold text-white/70">{r.buses_count}</td>
                <td className="px-8 py-5 text-right text-xs font-black">
                  <span className={r.cumple_regla ? 'text-muni-green' : 'text-muni-red'}>{r.cumple_regla ? 'OK' : 'NO'}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;
