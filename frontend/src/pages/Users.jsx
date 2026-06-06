import React, { useEffect, useMemo, useState } from 'react';
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

const ModalShell = ({ isOpen, title, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="tm-card tm-card-inset w-full max-w-lg shadow-2xl p-8 relative animate-in zoom-in-95 duration-300">
        <button onClick={onClose} className="absolute top-6 right-6 text-white/50 hover:text-white/80 font-bold transition-colors">✕</button>
        <h3 className="text-xl font-black text-white/90 uppercase tracking-tight mb-6 border-b border-white/10 pb-4">{title}</h3>
        {children}
      </div>
    </div>
  );
};

export default function Users() {
  const { user } = useAuth();
  const userPerms = Array.isArray(user?.permisos) ? user.permisos : [];
  const canWrite = userPerms.includes('usuarios:write');
  const [users, setUsers] = useState([]);
  const [stations, setStations] = useState([]);
  const [roles, setRoles] = useState([]);
  const [notification, setNotification] = useState({ tone: 'info', message: '' });

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({ username: '', password: '', rol_id: '', nombre: '', estacion_id: '', activo: 1 });
  const [edit, setEdit] = useState({ id: null, rol_id: '', nombre: '', estacion_id: '', activo: 1 });
  const [password, setPassword] = useState({ id: null, value: '' });

  const getDefaultRolId = useMemo(() => {
    const operador = roles.find((r) => String(r.codigo || '').toUpperCase() === 'OPERADOR')?.id;
    return operador ? String(operador) : (roles?.[0]?.id ? String(roles[0].id) : '');
  }, [roles]);

  const load = async () => {
    const [{ data: u }, { data: s }, { data: meta }] = await Promise.all([api.get('/usuarios'), api.get('/estaciones'), api.get('/usuarios/meta')]);
    setUsers(u || []);
    setStations(s || []);
    setRoles(meta?.roles || []);
  };

  useEffect(() => {
    let alive = true;
    const run = async () => {
      try {
        await load();
      } catch (err) {
        if (!alive) return;
        const msg = err?.response?.data?.message || 'No se pudo cargar usuarios.';
        setNotification({ tone: 'error', message: msg });
      }
    };
    run();
    return () => {
      alive = false;
    };
  }, []);

  const openCreate = () => {
    setForm({ username: '', password: '', rol_id: getDefaultRolId, nombre: '', estacion_id: '', activo: 1 });
    setCreateOpen(true);
  };

  const openEdit = (u) => {
    setEdit({
      id: u.id,
      rol_id: u?.rol_id ? String(u.rol_id) : getDefaultRolId,
      nombre: u.nombre || '',
      estacion_id: u.estacion_id ? String(u.estacion_id) : '',
      activo: u.activo
    });
    setEditOpen(true);
  };

  const openPassword = (u) => {
    setPassword({ id: u.id, value: '' });
    setPasswordOpen(true);
  };

  const submitCreate = async () => {
    if (!canWrite) {
      setNotification({ tone: 'error', message: 'No tienes permisos para crear usuarios.' });
      return;
    }
    if (!form.username || !form.password || !form.rol_id) {
      setNotification({ tone: 'error', message: 'Completa usuario, contraseña y rol.' });
      return;
    }
    setSaving(true);
    try {
      await api.post('/usuarios', {
        username: form.username,
        password: form.password,
        rol_id: Number(form.rol_id),
        nombre: form.nombre || null,
        estacion_id: form.estacion_id ? Number(form.estacion_id) : null,
        activo: Number(form.activo)
      });
      await load();
      setCreateOpen(false);
      setNotification({ tone: 'success', message: 'Usuario creado.' });
    } catch (err) {
      const msg = err?.response?.data?.message || 'No se pudo crear el usuario.';
      setNotification({ tone: 'error', message: msg });
    } finally {
      setSaving(false);
    }
  };

  const submitEdit = async () => {
    if (!canWrite) {
      setNotification({ tone: 'error', message: 'No tienes permisos para editar usuarios.' });
      return;
    }
    if (!edit.id) return;
    setSaving(true);
    try {
      await api.put(`/usuarios/${edit.id}`, {
        rol_id: edit.rol_id ? Number(edit.rol_id) : null,
        nombre: edit.nombre || null,
        estacion_id: edit.estacion_id ? Number(edit.estacion_id) : null,
        activo: Number(edit.activo)
      });
      await load();
      setEditOpen(false);
      setNotification({ tone: 'success', message: 'Usuario actualizado.' });
    } catch (err) {
      const msg = err?.response?.data?.message || 'No se pudo actualizar el usuario.';
      setNotification({ tone: 'error', message: msg });
    } finally {
      setSaving(false);
    }
  };

  const submitPassword = async () => {
    if (!canWrite) {
      setNotification({ tone: 'error', message: 'No tienes permisos para cambiar contraseñas.' });
      return;
    }
    if (!password.id || !password.value) {
      setNotification({ tone: 'error', message: 'Ingresa la nueva contraseña.' });
      return;
    }
    setSaving(true);
    try {
      await api.put(`/usuarios/${password.id}/password`, { password: password.value });
      setPasswordOpen(false);
      setNotification({ tone: 'success', message: 'Contraseña actualizada.' });
    } catch (err) {
      const msg = err?.response?.data?.message || 'No se pudo actualizar la contraseña.';
      setNotification({ tone: 'error', message: msg });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <Notification
        message={notification.message}
        tone={notification.tone}
        onClose={() => setNotification({ tone: 'info', message: '' })}
      />

      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-2xl font-black text-white/90 tracking-tight uppercase italic">Usuarios</h2>
          <p className="text-[10px] text-white/45 font-bold uppercase tracking-[0.2em] mt-1">Gestión de acceso y roles (Super Admin)</p>
        </div>
        {canWrite && (
          <button
            onClick={openCreate}
            className="tm-btn tm-btn-primary"
          >
            Nuevo Usuario
          </button>
        )}
      </div>

      <div className="tm-card tm-card-inset shadow-sm overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="min-w-full text-left">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 text-[9px] font-black text-white/45 uppercase tracking-widest">Usuario</th>
                <th className="px-6 py-4 text-[9px] font-black text-white/45 uppercase tracking-widest">Nombre</th>
                <th className="px-6 py-4 text-[9px] font-black text-white/45 uppercase tracking-widest">Rol</th>
                <th className="px-6 py-4 text-[9px] font-black text-white/45 uppercase tracking-widest">Estación</th>
                <th className="px-6 py-4 text-[9px] font-black text-white/45 uppercase tracking-widest">Activo</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-white/10 hover:bg-white/5">
                  <td className="px-6 py-4 text-sm font-black text-white/90">{u.username}</td>
                  <td className="px-6 py-4 text-sm font-bold text-white/70">{u.nombre || '-'}</td>
                  <td className="px-6 py-4 text-[11px] font-black text-white/85 uppercase">
                    {(roles.find((r) => String(r.id) === String(u.rol_id))?.nombre) || (u.rol || '')}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-white/70">{u.estacion_id || '-'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${u.activo === 1 ? 'bg-muni-green/10 text-muni-green border-muni-green/20' : 'bg-white/8 text-white/60 border-white/10'}`}>
                      {u.activo === 1 ? 'Sí' : 'No'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {canWrite && (
                      <>
                        <button
                          onClick={() => openEdit(u)}
                          className="tm-btn tm-btn-xs tm-btn-secondary"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => openPassword(u)}
                          className="tm-btn tm-btn-xs tm-btn-warn"
                        >
                          Contraseña
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-[10px] font-bold text-white/45 uppercase tracking-widest">
                    Sin usuarios
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ModalShell isOpen={createOpen} title="Crear Usuario" onClose={() => setCreateOpen(false)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[9px] font-black text-white/45 uppercase tracking-widest mb-2">Usuario</label>
            <input value={form.username} onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))} className="w-full tm-input" />
          </div>
          <div>
            <label className="block text-[9px] font-black text-white/45 uppercase tracking-widest mb-2">Contraseña</label>
            <input type="password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} className="w-full tm-input" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-[9px] font-black text-white/45 uppercase tracking-widest mb-2">Nombre</label>
            <input value={form.nombre} onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))} className="w-full tm-input" />
          </div>
          <div>
            <label className="block text-[9px] font-black text-white/45 uppercase tracking-widest mb-2">Rol</label>
            <select value={form.rol_id} onChange={(e) => setForm((f) => ({ ...f, rol_id: e.target.value }))} className="w-full tm-select">
              {(roles || []).map((r) => <option key={r.id} value={String(r.id)}>{r.nombre}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[9px] font-black text-white/45 uppercase tracking-widest mb-2">Activo</label>
            <select value={String(form.activo)} onChange={(e) => setForm((f) => ({ ...f, activo: Number(e.target.value) }))} className="w-full tm-select">
              <option value="1">Sí</option>
              <option value="0">No</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-[9px] font-black text-white/45 uppercase tracking-widest mb-2">Estación (solo Operador)</label>
            <select value={form.estacion_id} onChange={(e) => setForm((f) => ({ ...f, estacion_id: e.target.value }))} className="w-full tm-select">
              <option value="">Sin estación</option>
              {(stations || []).map((s) => <option key={s.id} value={String(s.id)}>{s.nombre}</option>)}
            </select>
          </div>
        </div>
        <div className="mt-8 space-y-3">
          <button disabled={saving} onClick={submitCreate} className="tm-btn tm-btn-success w-full disabled:opacity-60">Guardar</button>
          <button onClick={() => setCreateOpen(false)} className="tm-btn tm-btn-secondary w-full">Cancelar</button>
        </div>
      </ModalShell>

      <ModalShell isOpen={editOpen} title="Editar Usuario" onClose={() => setEditOpen(false)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[9px] font-black text-white/45 uppercase tracking-widest mb-2">Rol</label>
            <select value={edit.rol_id} onChange={(e) => setEdit((f) => ({ ...f, rol_id: e.target.value }))} className="w-full tm-select">
              {(roles || []).map((r) => <option key={r.id} value={String(r.id)}>{r.nombre}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[9px] font-black text-white/45 uppercase tracking-widest mb-2">Activo</label>
            <select value={String(edit.activo)} onChange={(e) => setEdit((f) => ({ ...f, activo: Number(e.target.value) }))} className="w-full tm-select">
              <option value="1">Sí</option>
              <option value="0">No</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-[9px] font-black text-white/45 uppercase tracking-widest mb-2">Nombre</label>
            <input value={edit.nombre} onChange={(e) => setEdit((f) => ({ ...f, nombre: e.target.value }))} className="w-full tm-input" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-[9px] font-black text-white/45 uppercase tracking-widest mb-2">Estación (solo Operador)</label>
            <select value={edit.estacion_id} onChange={(e) => setEdit((f) => ({ ...f, estacion_id: e.target.value }))} className="w-full tm-select">
              <option value="">Sin estación</option>
              {(stations || []).map((s) => <option key={s.id} value={String(s.id)}>{s.nombre}</option>)}
            </select>
          </div>
        </div>
        <div className="mt-8 space-y-3">
          <button disabled={saving} onClick={submitEdit} className="tm-btn tm-btn-success w-full disabled:opacity-60">Guardar</button>
          <button onClick={() => setEditOpen(false)} className="tm-btn tm-btn-secondary w-full">Cancelar</button>
        </div>
      </ModalShell>

      <ModalShell isOpen={passwordOpen} title="Cambiar Contraseña" onClose={() => setPasswordOpen(false)}>
        <div>
          <label className="block text-[9px] font-black text-white/45 uppercase tracking-widest mb-2">Nueva contraseña</label>
          <input type="password" value={password.value} onChange={(e) => setPassword((p) => ({ ...p, value: e.target.value }))} className="w-full tm-input" />
        </div>
        <div className="mt-8 space-y-3">
          <button disabled={saving} onClick={submitPassword} className="tm-btn tm-btn-warn w-full disabled:opacity-60">Actualizar</button>
          <button onClick={() => setPasswordOpen(false)} className="tm-btn tm-btn-secondary w-full">Cancelar</button>
        </div>
      </ModalShell>
    </div>
  );
}
