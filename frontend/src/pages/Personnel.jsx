import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext.jsx';

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

const ModalShell = ({ title, isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="tm-card tm-card-inset w-full max-w-lg shadow-2xl p-8 relative animate-in zoom-in-95 duration-300">
        <button onClick={onClose} className="absolute top-6 right-6 text-white/50 hover:text-white/80 font-bold transition-colors">✕</button>
        <h3 className="text-xl font-black text-white/90 uppercase tracking-tight mb-6 border-b border-white/10 pb-4">{title}</h3>
        {children}
      </div>
    </div>
  );
};

const OperadorModal = ({ isOpen, onClose, estaciones, onSave, initialForm }) => {
  const [form, setForm] = useState({ estacion_id: '', nombre: '', apellido: '', dpi: '', pc_nombre: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    if (initialForm) {
      setForm({
        estacion_id: String(initialForm.estacion_id ?? (estaciones?.[0]?.id ?? '')),
        nombre: initialForm.nombre ?? '',
        apellido: initialForm.apellido ?? '',
        dpi: initialForm.dpi ?? '',
        pc_nombre: initialForm.pc_nombre ?? ''
      });
    } else {
      setForm({
        estacion_id: estaciones?.[0]?.id ? String(estaciones[0].id) : '',
        nombre: '',
        apellido: '',
        dpi: '',
        pc_nombre: ''
      });
    }
    setSaving(false);
  }, [isOpen, estaciones, initialForm]);

  const submit = async () => {
    setSaving(true);
    try {
      await onSave({
        estacion_id: Number(form.estacion_id),
        nombre: form.nombre,
        apellido: form.apellido,
        dpi: form.dpi,
        pc_nombre: form.pc_nombre
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalShell title="Registrar / Actualizar Operador" isOpen={isOpen} onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="block text-[9px] font-black text-white/45 uppercase tracking-widest mb-2">Estación</label>
          <select
            value={form.estacion_id}
            onChange={(e) => setForm((f) => ({ ...f, estacion_id: e.target.value }))}
            className="w-full tm-select"
          >
            {(estaciones || []).map((e) => (
              <option key={e.id} value={String(e.id)}>{e.nombre}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[9px] font-black text-white/45 uppercase tracking-widest mb-2">Nombre</label>
            <input
              value={form.nombre}
              onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
              className="w-full tm-input"
            />
          </div>
          <div>
            <label className="block text-[9px] font-black text-white/45 uppercase tracking-widest mb-2">Apellido</label>
            <input
              value={form.apellido}
              onChange={(e) => setForm((f) => ({ ...f, apellido: e.target.value }))}
              className="w-full tm-input"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[9px] font-black text-white/45 uppercase tracking-widest mb-2">DPI</label>
            <input
              value={form.dpi}
              onChange={(e) => setForm((f) => ({ ...f, dpi: e.target.value }))}
              className="w-full tm-input"
            />
          </div>
          <div>
            <label className="block text-[9px] font-black text-white/45 uppercase tracking-widest mb-2">PC</label>
            <input
              value={form.pc_nombre}
              onChange={(e) => setForm((f) => ({ ...f, pc_nombre: e.target.value }))}
              className="w-full tm-input"
              placeholder="PC-ESTACION-01"
            />
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button
            onClick={submit}
            disabled={saving || !form.estacion_id || !form.nombre || !form.apellido || !form.dpi}
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
    </ModalShell>
  );
};

const AccesoConGuardiaModal = ({ isOpen, onClose, estaciones, onSave, turnosGuardia }) => {
  const defaultTurno = turnosGuardia?.[0]?.codigo ? String(turnosGuardia[0].codigo) : '';
  const [form, setForm] = useState({
    estacion_id: '',
    acceso_nombre: '',
    guardia_nombre: '',
    guardia_apellido: '',
    guardia_dpi: '',
    guardia_turno: defaultTurno
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setForm({
      estacion_id: estaciones?.[0]?.id ? String(estaciones[0].id) : '',
      acceso_nombre: '',
      guardia_nombre: '',
      guardia_apellido: '',
      guardia_dpi: '',
      guardia_turno: defaultTurno
    });
    setSaving(false);
  }, [isOpen, estaciones, defaultTurno]);

  const submit = async () => {
    setSaving(true);
    try {
      await onSave({
        estacion_id: Number(form.estacion_id),
        nombre: form.acceso_nombre,
        guardias: [
          {
            nombre: form.guardia_nombre,
            apellido: form.guardia_apellido,
            dpi: form.guardia_dpi,
            turno: form.guardia_turno
          }
        ]
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalShell title="Crear Acceso (con guardia obligatorio)" isOpen={isOpen} onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="block text-[9px] font-black text-white/45 uppercase tracking-widest mb-2">Estación</label>
          <select
            value={form.estacion_id}
            onChange={(e) => setForm((f) => ({ ...f, estacion_id: e.target.value }))}
            className="w-full tm-select"
          >
            {(estaciones || []).map((e) => (
              <option key={e.id} value={String(e.id)}>{e.nombre}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[9px] font-black text-white/45 uppercase tracking-widest mb-2">Nombre del acceso</label>
          <input
            value={form.acceso_nombre}
            onChange={(e) => setForm((f) => ({ ...f, acceso_nombre: e.target.value }))}
            className="w-full tm-input"
            placeholder="Acceso Norte"
          />
        </div>
        <div className="pt-4 border-t border-white/10">
          <h4 className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-3">Guardia asignado</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[9px] font-black text-white/45 uppercase tracking-widest mb-2">Nombre</label>
              <input
                value={form.guardia_nombre}
                onChange={(e) => setForm((f) => ({ ...f, guardia_nombre: e.target.value }))}
                className="w-full tm-input"
              />
            </div>
            <div>
              <label className="block text-[9px] font-black text-white/45 uppercase tracking-widest mb-2">Apellido</label>
              <input
                value={form.guardia_apellido}
                onChange={(e) => setForm((f) => ({ ...f, guardia_apellido: e.target.value }))}
                className="w-full tm-input"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-[9px] font-black text-white/45 uppercase tracking-widest mb-2">DPI</label>
              <input
                value={form.guardia_dpi}
                onChange={(e) => setForm((f) => ({ ...f, guardia_dpi: e.target.value }))}
                className="w-full tm-input"
              />
            </div>
            <div>
              <label className="block text-[9px] font-black text-white/45 uppercase tracking-widest mb-2">Turno</label>
              <select
                value={form.guardia_turno}
                onChange={(e) => setForm((f) => ({ ...f, guardia_turno: e.target.value }))}
                className="w-full tm-select"
              >
                {(turnosGuardia || []).map((t) => (
                  <option key={t.codigo} value={String(t.codigo)}>{t.nombre}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button
            onClick={submit}
            disabled={
              saving ||
              !form.estacion_id ||
              !form.acceso_nombre ||
              !form.guardia_nombre ||
              !form.guardia_apellido ||
              !form.guardia_dpi ||
              !form.guardia_turno
            }
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
    </ModalShell>
  );
};

const PilotoModal = ({ isOpen, onClose, buses, onSave }) => {
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    dpi: '',
    licencia: '',
    direccion_residencia: '',
    telefono: '',
    bus_id: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setForm({
      nombre: '',
      apellido: '',
      dpi: '',
      licencia: '',
      direccion_residencia: '',
      telefono: '',
      bus_id: ''
    });
    setSaving(false);
  }, [isOpen]);

  const submit = async () => {
    setSaving(true);
    try {
      await onSave({
        ...form,
        bus_id: form.bus_id ? Number(form.bus_id) : null
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalShell title="Registrar Piloto" isOpen={isOpen} onClose={onClose}>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[9px] font-black text-white/45 uppercase tracking-widest mb-2">Nombre</label>
            <input value={form.nombre} onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))} className="w-full tm-input" />
          </div>
          <div>
            <label className="block text-[9px] font-black text-white/45 uppercase tracking-widest mb-2">Apellido</label>
            <input value={form.apellido} onChange={(e) => setForm((f) => ({ ...f, apellido: e.target.value }))} className="w-full tm-input" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[9px] font-black text-white/45 uppercase tracking-widest mb-2">DPI</label>
            <input value={form.dpi} onChange={(e) => setForm((f) => ({ ...f, dpi: e.target.value }))} className="w-full tm-input" />
          </div>
          <div>
            <label className="block text-[9px] font-black text-white/45 uppercase tracking-widest mb-2">Licencia</label>
            <input value={form.licencia} onChange={(e) => setForm((f) => ({ ...f, licencia: e.target.value }))} className="w-full tm-input" placeholder="Tipo A" />
          </div>
        </div>
        <div>
          <label className="block text-[9px] font-black text-white/45 uppercase tracking-widest mb-2">Dirección</label>
          <input value={form.direccion_residencia} onChange={(e) => setForm((f) => ({ ...f, direccion_residencia: e.target.value }))} className="w-full tm-input" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[9px] font-black text-white/45 uppercase tracking-widest mb-2">Teléfono</label>
            <input value={form.telefono} onChange={(e) => setForm((f) => ({ ...f, telefono: e.target.value }))} className="w-full tm-input" />
          </div>
          <div>
            <label className="block text-[9px] font-black text-white/45 uppercase tracking-widest mb-2">Bus (opcional)</label>
            <select value={form.bus_id} onChange={(e) => setForm((f) => ({ ...f, bus_id: e.target.value }))} className="w-full tm-select">
              <option value="">Sin asignar</option>
              {(buses || []).map((b) => (
                <option key={b.id} value={String(b.id)}>{b.numero_unidad}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button
            onClick={submit}
            disabled={saving || !form.nombre || !form.apellido || !form.dpi || !form.licencia}
            className="tm-btn tm-btn-primary flex-1 disabled:opacity-60"
          >
            Guardar
          </button>
          <button onClick={onClose} className="tm-btn tm-btn-secondary flex-1">
            Cancelar
          </button>
        </div>
      </div>
    </ModalShell>
  );
};

const PilotoDetalleModal = ({ isOpen, onClose, pilotoId, onAddHistorial }) => {
  const [piloto, setPiloto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ nivel_estudio: '', institucion: '', anio_graduacion: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let alive = true;
    const run = async () => {
      if (!isOpen || !pilotoId) return;
      setLoading(true);
      try {
        const { data } = await api.get(`/pilotos/${pilotoId}`);
        if (!alive) return;
        setPiloto(data);
      } finally {
        if (alive) setLoading(false);
      }
    };
    run();
    return () => {
      alive = false;
    };
  }, [isOpen, pilotoId]);

  useEffect(() => {
    if (!isOpen) return;
    setForm({ nivel_estudio: '', institucion: '', anio_graduacion: '' });
    setSaving(false);
  }, [isOpen]);

  const submit = async () => {
    setSaving(true);
    try {
      await onAddHistorial(pilotoId, { ...form, anio_graduacion: form.anio_graduacion ? Number(form.anio_graduacion) : null });
      const { data } = await api.get(`/pilotos/${pilotoId}`);
      setPiloto(data);
      setForm({ nivel_estudio: '', institucion: '', anio_graduacion: '' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalShell title="Detalle de Piloto" isOpen={isOpen} onClose={onClose}>
      {loading ? (
        <div className="text-[10px] font-black text-white/60 uppercase tracking-widest">Cargando...</div>
      ) : (
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-black text-white/90 uppercase tracking-tight">{piloto?.nombre} {piloto?.apellido}</h4>
            <p className="text-[10px] text-white/45 font-bold uppercase tracking-widest mt-1 italic">
              DPI: {piloto?.dpi} • Licencia: {piloto?.licencia} • Bus: {piloto?.bus_numero_unidad || 'Sin asignar'}
            </p>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/6 p-4">
            <h5 className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-3">Historial educativo</h5>
            <div className="space-y-2">
              {(piloto?.historial || []).length === 0 ? (
                <p className="text-[10px] font-bold text-white/55 uppercase tracking-widest italic">Sin registros</p>
              ) : (
                (piloto?.historial || []).map((h) => (
                  <div key={h.id} className="bg-white/6 border border-white/10 rounded p-3">
                    <p className="text-[10px] font-black text-white/80 uppercase">{h.nivel_estudio || 'N/A'}</p>
                    <p className="text-[9px] font-bold text-white/55 uppercase tracking-widest">{h.institucion || 'N/A'} • {h.anio_graduacion || 'N/A'}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-white/10">
            <h5 className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-3">Agregar registro</h5>
            <div className="space-y-3">
              <input value={form.nivel_estudio} onChange={(e) => setForm((f) => ({ ...f, nivel_estudio: e.target.value }))} className="w-full tm-input" placeholder="Nivel de estudio" />
              <input value={form.institucion} onChange={(e) => setForm((f) => ({ ...f, institucion: e.target.value }))} className="w-full tm-input" placeholder="Institución" />
              <input type="number" value={form.anio_graduacion} onChange={(e) => setForm((f) => ({ ...f, anio_graduacion: e.target.value }))} className="w-full tm-input" placeholder="Año graduación" />
              <button
                onClick={submit}
                disabled={saving}
                className="tm-btn tm-btn-primary w-full disabled:opacity-60"
              >
                Guardar registro
              </button>
            </div>
          </div>
        </div>
      )}
    </ModalShell>
  );
};

const Personnel = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('operadores');
  const [estaciones, setEstaciones] = useState([]);
  const [guardias, setGuardias] = useState([]);
  const [pilotos, setPilotos] = useState([]);
  const [buses, setBuses] = useState([]);
  const [turnosGuardia, setTurnosGuardia] = useState([]);
  const userPerms = Array.isArray(user?.permisos) ? user.permisos : [];
  const canManage = ['guardias:write', 'pilotos:write', 'operadores:write', 'buses:write', 'estaciones:write'].some((p) => userPerms.includes(p));
  const [notification, setNotification] = useState({ message: '', tone: 'info' });
  const [operadorModalOpen, setOperadorModalOpen] = useState(false);
  const [operadorInitialForm, setOperadorInitialForm] = useState(null);
  const [accesoModalOpen, setAccesoModalOpen] = useState(false);
  const [pilotoModalOpen, setPilotoModalOpen] = useState(false);
  const [pilotoDetalleOpen, setPilotoDetalleOpen] = useState(false);
  const [selectedPilotoId, setSelectedPilotoId] = useState(null);

  useEffect(() => {
    let alive = true;
    const run = async () => {
      try {
        const [{ data: estacionesData }, { data: guardiasData }, { data: pilotosData }, { data: busesData }, { data: accesosMeta }] = await Promise.all([
          api.get('/estaciones'),
          api.get('/guardias'),
          api.get('/pilotos'),
          api.get('/buses'),
          api.get('/accesos/meta')
        ]);

        if (!alive) return;
        setEstaciones(estacionesData || []);
        setGuardias(guardiasData || []);
        setPilotos(pilotosData || []);
        setBuses(busesData || []);
        setTurnosGuardia(accesosMeta?.turnos_guardia || []);
      } catch {
        if (!alive) return;
        setNotification({ tone: 'error', message: 'No se pudo cargar el módulo de personal.' });
      }
    };
    run();
    return () => {
      alive = false;
    };
  }, []);

  const reload = async () => {
    const [{ data: estacionesData }, { data: guardiasData }, { data: pilotosData }, { data: busesData }, { data: accesosMeta }] = await Promise.all([
      api.get('/estaciones'),
      api.get('/guardias'),
      api.get('/pilotos'),
      api.get('/buses'),
      api.get('/accesos/meta')
    ]);
    setEstaciones(estacionesData || []);
    setGuardias(guardiasData || []);
    setPilotos(pilotosData || []);
    setBuses(busesData || []);
    setTurnosGuardia(accesosMeta?.turnos_guardia || []);
  };

  const saveOperador = async ({ estacion_id, nombre, apellido, dpi, pc_nombre }) => {
    try {
      await api.put(`/estaciones/${estacion_id}/operador`, { nombre, apellido, dpi, pc_nombre });
      await reload();
      setNotification({ tone: 'success', message: 'Operador actualizado.' });
    } catch (err) {
      const msg = err?.response?.data?.message || 'No se pudo actualizar el operador.';
      setNotification({ tone: 'error', message: msg });
      throw err;
    }
  };

  const saveAccesoConGuardia = async ({ estacion_id, nombre, guardias: payloadGuardias }) => {
    try {
      await api.post(`/estaciones/${estacion_id}/accesos`, { nombre, guardias: payloadGuardias });
      await reload();
      setNotification({ tone: 'success', message: 'Acceso y guardia creados.' });
    } catch (err) {
      const msg = err?.response?.data?.message || 'No se pudo crear el acceso.';
      setNotification({ tone: 'error', message: msg });
      throw err;
    }
  };

  const savePiloto = async (payload) => {
    try {
      await api.post('/pilotos', payload);
      await reload();
      setNotification({ tone: 'success', message: 'Piloto creado.' });
    } catch (err) {
      const msg = err?.response?.data?.message || 'No se pudo crear el piloto.';
      setNotification({ tone: 'error', message: msg });
      throw err;
    }
  };

  const addHistorial = async (pilotoId, payload) => {
    try {
      await api.post(`/pilotos/${pilotoId}/historial`, payload);
      setNotification({ tone: 'success', message: 'Historial agregado.' });
    } catch (err) {
      const msg = err?.response?.data?.message || 'No se pudo agregar historial.';
      setNotification({ tone: 'error', message: msg });
      throw err;
    }
  };

  const openOperador = async (estacionId) => {
    if (!estacionId) {
      setOperadorInitialForm(null);
      setOperadorModalOpen(true);
      return;
    }

    try {
      const { data } = await api.get(`/estaciones/${estacionId}`);
      const op = data?.operador;
      setOperadorInitialForm({
        estacion_id: estacionId,
        nombre: op?.nombre ?? '',
        apellido: op?.apellido ?? '',
        dpi: op?.dpi ?? '',
        pc_nombre: op?.pc_nombre ?? ''
      });
      setOperadorModalOpen(true);
    } catch (err) {
      const msg = err?.response?.data?.message || 'No se pudo cargar la estación.';
      setNotification({ tone: 'error', message: msg });
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <Notification
        message={notification.message}
        tone={notification.tone}
        onClose={() => setNotification({ tone: 'info', message: '' })}
      />

      <OperadorModal
        isOpen={operadorModalOpen}
        onClose={() => setOperadorModalOpen(false)}
        estaciones={estaciones}
        onSave={saveOperador}
        initialForm={operadorInitialForm}
      />
      <AccesoConGuardiaModal
        isOpen={accesoModalOpen}
        onClose={() => setAccesoModalOpen(false)}
        estaciones={estaciones}
        turnosGuardia={turnosGuardia}
        onSave={saveAccesoConGuardia}
      />
      <PilotoModal
        isOpen={pilotoModalOpen}
        onClose={() => setPilotoModalOpen(false)}
        buses={buses}
        onSave={savePiloto}
      />
      <PilotoDetalleModal
        isOpen={pilotoDetalleOpen}
        onClose={() => setPilotoDetalleOpen(false)}
        pilotoId={selectedPilotoId}
        onAddHistorial={addHistorial}
      />

      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-2xl font-black text-white/90 tracking-tight uppercase italic">Personal de Estación</h2>
          <p className="text-[10px] text-white/45 font-bold uppercase tracking-[0.2em] mt-1">Gestión de Staff Operativo y Seguridad</p>
        </div>
        <div className="flex space-x-2">
          {canManage && (
            <>
              <button
                onClick={() => openOperador(null)}
                className="tm-btn tm-btn-sm tm-btn-secondary"
              >
                + Operador
              </button>
              <button
                onClick={() => setAccesoModalOpen(true)}
                className="tm-btn tm-btn-sm tm-btn-primary"
              >
                + Acceso/Guardia
              </button>
              <button
                onClick={() => setPilotoModalOpen(true)}
                className="tm-btn tm-btn-sm tm-btn-warn"
              >
                + Piloto
              </button>
            </>
          )}
        </div>
      </div>

      <div className="tm-card tm-card-inset shadow-sm overflow-hidden mb-8">
        <div className="flex">
          {[
            { key: 'operadores', label: 'Operadores' },
            { key: 'guardias', label: 'Guardias' },
            { key: 'pilotos', label: 'Pilotos' }
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest border-b-2 transition-colors ${
                activeTab === t.key ? 'border-muni-cyan text-white/90 bg-white/5' : 'border-transparent text-white/45 hover:text-white/75'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'operadores' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {estaciones.map((e) => (
            <div key={e.id} className="tm-card tm-card-inset p-8 hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-black text-white/90 uppercase tracking-tight">{e.nombre}</h3>
                <span className={`px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest border ${e.operador_id ? 'bg-muni-green/10 text-muni-green border-muni-green/20' : 'bg-white/8 text-white/45 border-white/10'}`}>
                  {e.operador_id ? 'Asignado' : 'Sin operador'}
                </span>
              </div>
              <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">
                Operador: {e.operador_nombre || 'N/A'}
              </p>
              <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mt-2">
                PC: {e.pc_nombre || 'N/A'}
              </p>
              {canManage && (
                <button
                  onClick={() => openOperador(e.id)}
                  className="w-full mt-6 tm-btn tm-btn-sm tm-btn-secondary"
                >
                  Editar operador
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'guardias' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guardias.map((g) => (
            <div key={g.id} className="tm-card tm-card-inset p-8 hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-black text-white/90 uppercase tracking-tight">{g.nombre} {g.apellido}</h3>
                <span className="px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest bg-muni-green/10 text-muni-green border border-muni-green/20">Activo</span>
              </div>
              <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">DPI: {g.dpi}</p>
              <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mt-2">Turno: {g.turno}</p>
              <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mt-2">Acceso: {g.acceso_nombre} • {g.estacion_nombre}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'pilotos' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pilotos.map((p) => (
            <div key={p.id} className="tm-card tm-card-inset p-8 hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-black text-white/90 uppercase tracking-tight">{p.nombre} {p.apellido}</h3>
                <span className={`px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest border ${p.bus_id ? 'bg-muni-blue/10 text-muni-cyan border-muni-blue/25' : 'bg-white/8 text-white/45 border-white/10'}`}>
                  {p.bus_id ? 'Asignado' : 'Disponible'}
                </span>
              </div>
              <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">DPI: {p.dpi}</p>
              <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mt-2">Licencia: {p.licencia}</p>
              <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mt-2">Bus: {p.bus_numero_unidad || 'Sin asignar'}</p>
              <button
                onClick={() => {
                  setSelectedPilotoId(p.id);
                  setPilotoDetalleOpen(true);
                }}
                className="w-full mt-6 tm-btn tm-btn-sm tm-btn-secondary"
              >
                Ver historial
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Personnel;
