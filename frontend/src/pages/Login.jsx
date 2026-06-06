import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login({ username, password });
    } catch (err) {
      const msg = err?.response?.data?.message || 'No se pudo iniciar sesión';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center tm-shell p-6 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 tm-grid" />
      <div className="pointer-events-none absolute inset-0 tm-noise" />

      <div className="w-full max-w-md tm-card tm-card-inset p-8 relative">
        <h1 className="text-xl font-black text-white/90 uppercase tracking-tight mb-2">Transmetro</h1>
        <p className="text-[10px] font-bold text-white/45 uppercase tracking-[0.2em] mb-8">Acceso al Sistema de Gestión</p>

        {error && (
          <div className="mb-6 p-3 rounded border border-muni-red/20 bg-muni-red/10 text-muni-red text-xs font-bold">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-[9px] font-black text-white/45 uppercase tracking-widest mb-2">Usuario</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full tm-input"
              placeholder="superadmin"
              autoComplete="username"
            />
          </div>
          <div>
            <label className="block text-[9px] font-black text-white/45 uppercase tracking-widest mb-2">Contraseña</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="w-full tm-input"
              placeholder="ChangeMe2026!"
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full tm-btn tm-btn-primary"
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
}
