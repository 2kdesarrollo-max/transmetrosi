import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Buses from './pages/Buses';
import Parqueos from './pages/Parqueos';
import Personnel from './pages/Personnel';
import RoutesPage from './pages/Routes';
import Reports from './pages/Reports';
import Reinforcements from './pages/Reinforcements';
import Users from './pages/Users';
import Login from './pages/Login.jsx';
import logoMuni from '../pictures/logomuni.png';
import { useAuth } from './context/AuthContext.jsx';

const __TW_SAFELIST = `
bg-muni-green/10 text-muni-green
bg-muni-orange/10 text-muni-orange
bg-muni-blue/10 text-muni-blue
bg-muni-cyan/10 text-muni-cyan
bg-muni-red/10 text-muni-red
bg-slate-200 text-slate-600
bg-slate-200 text-slate-500
bg-slate-200 text-slate-700
bg-muni-orange text-white
bg-muni-orange text-white animate-pulse
bg-muni-blue text-white
bg-muni-green text-white
`.trim();

const hasAnyPerm = (user, perms) => {
  if (!perms || perms.length === 0) return true;
  const userPerms = Array.isArray(user?.permisos) ? user.permisos : [];
  return perms.some((p) => userPerms.includes(p));
};

const RequirePerm = ({ perms, user, children }) => {
  if (!perms) return children;
  if (hasAnyPerm(user, perms)) return children;
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-10">
      <h2 className="text-xl font-black text-muni-blue uppercase tracking-tight italic">Acceso denegado</h2>
      <p className="mt-2 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
        No tienes permisos para ver este módulo.
      </p>
    </div>
  );
};

const IconDashboard = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path
      d="M4 13h7V4H4v9Zm9 7h7V11h-7v9ZM4 20h7v-5H4v5Zm9-11h7V4h-7v5Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
  </svg>
);

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

const IconParking = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path
      d="M6 21V3h7.2a4.8 4.8 0 0 1 0 9.6H6"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconPeople = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path
      d="M8.5 11.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4ZM16.6 10.3a2.7 2.7 0 1 0 0-5.4 2.7 2.7 0 0 0 0 5.4ZM4.8 19.6c0-2.4 2-4.3 4.4-4.3h.6c2.4 0 4.3 1.9 4.3 4.3M14.2 19.6c.2-1.8 1.7-3.2 3.6-3.2h.4c1.9 0 3.5 1.4 3.6 3.2"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconRoute = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path
      d="M7 6.8a2.8 2.8 0 1 0 0-5.6 2.8 2.8 0 0 0 0 5.6ZM17 22.8a2.8 2.8 0 1 0 0-5.6 2.8 2.8 0 0 0 0 5.6Z"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <path d="M7 6.8c0 4.1 10 2.4 10 10.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path
      d="M12.5 10.8h3.2c1.5 0 2.8-1.2 2.8-2.8V6.4"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconReport = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path
      d="M7 3.8h7.7L19 8.1V20a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5.8a2 2 0 0 1 2-2Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path d="M14.7 3.8V8H19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 12.2h8M8 15.7h8M8 19.2h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const IconBolt = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path
      d="M13 2.8 4.8 14H11l-1 7.2L19.2 10H13l0-7.2Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
  </svg>
);

const IconUsers = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path
      d="M9.2 11.4a3.1 3.1 0 1 0 0-6.2 3.1 3.1 0 0 0 0 6.2ZM5.2 20.2c0-2.5 2-4.5 4.5-4.5h.9c2.5 0 4.5 2 4.5 4.5M16.6 10.4a2.6 2.6 0 1 0 0-5.2 2.6 2.6 0 0 0 0 5.2ZM16 15.7h1c2 0 3.7 1.5 4 3.5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SidebarLink = ({ to, label, icon: Icon, perms, user }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  const IconComponent = Icon;
  
  if (perms && !hasAnyPerm(user, perms)) return null;

  return (
    <Link
      to={to}
      className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
        isActive
          ? 'bg-white/10 text-white shadow-sm'
          : 'text-white/70 hover:bg-white/5 hover:text-white'
      }`}
    >
      <span
        className={`absolute left-0 top-1/2 -translate-y-1/2 h-7 w-[3px] rounded-full transition ${
          isActive ? 'bg-muni-green' : 'bg-transparent'
        }`}
      />
      <span
        className={`h-9 w-9 rounded-lg border border-white/10 flex items-center justify-center transition ${
          isActive ? 'bg-white/10' : 'bg-white/5'
        }`}
      >
        <IconComponent className="h-5 w-5" />
      </span>
      <span className="text-[11px] font-black uppercase tracking-widest">{label}</span>
    </Link>
  );
};

function App() {
  const { isAuthenticated, user, logout } = useAuth();

  if (!isAuthenticated) return <Login />;

  const initials = (user?.nombre || user?.username || 'U')
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <Router>
      <div className="h-screen flex tm-shell text-slate-800 overflow-hidden font-sans relative">
        <div className="pointer-events-none absolute inset-0 tm-grid" />
        <div className="pointer-events-none absolute inset-0 tm-noise" />

        <aside className="w-64 tm-sidebar-gradient flex flex-col z-20 shadow-xl relative">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-muni-cyan/40 to-transparent" />
          <div className="p-8 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/90 rounded-xl p-1 flex items-center justify-center shadow-lg border border-white/20">
                <img src={logoMuni} alt="Logo Muni" className="w-full h-full object-contain" />
              </div>
              <div className="overflow-hidden">
                <h1 className="text-sm font-black tracking-tight text-white leading-none truncate uppercase text-ellipsis">
                  Municipalidad
                </h1>
                <p className="text-[10px] text-white/45 font-bold uppercase tracking-widest mt-1">Centro de Control GT</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            <SidebarLink to="/" label="Panel de Control" icon={IconDashboard} perms={['dashboard:read']} user={user} />
            <SidebarLink to="/buses" label="Flota de Buses" icon={IconBus} perms={['buses:read']} user={user} />
            <SidebarLink to="/parqueos" label="Parqueos" icon={IconParking} perms={['parqueos:read']} user={user} />
            <SidebarLink
              to="/personnel"
              label="Personal"
              icon={IconPeople}
              perms={['guardias:read', 'pilotos:read', 'operadores:read']}
              user={user}
            />
            <SidebarLink
              to="/reinforcements"
              label="Órdenes de Refuerzo"
              icon={IconBolt}
              perms={['refuerzos:read']}
              user={user}
            />
            <SidebarLink to="/routes" label="Red de Ejes" icon={IconRoute} perms={['lineas:read']} user={user} />
            <SidebarLink to="/reports" label="Reportes" icon={IconReport} perms={['reportes:read']} user={user} />
            <SidebarLink to="/users" label="Usuarios" icon={IconUsers} perms={['usuarios:read']} user={user} />
          </nav>

          <div className="p-6 border-t border-white/10">
            <div className="flex items-center space-x-3 bg-white/5 p-3 rounded-xl border border-white/10">
              <div className="w-8 h-8 rounded-lg bg-muni-green flex items-center justify-center text-white font-bold text-xs tm-glow-green">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">{user?.nombre || user?.username}</p>
                <p className="text-[9px] text-muni-green font-black uppercase tracking-tighter italic">{user?.rol}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="mt-3 w-full tm-btn tm-btn-sm tm-btn-ghost"
            >
              Cerrar Sesión
            </button>
          </div>
        </aside>

        <main className="flex-1 flex flex-col relative overflow-hidden tm-on-shell">
          <header className="h-16 tm-glass flex items-center justify-between px-8 z-10">
            <div className="flex items-center space-x-4">
              <h2 className="text-xs font-bold text-white/70 uppercase tracking-widest italic">Centro de Control</h2>
              <div className="h-4 w-px bg-white/10"></div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-muni-green rounded-full tm-glow-green"></div>
                <span className="text-[10px] font-bold text-white/70 uppercase tracking-tighter">Sistemas en Línea</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{new Date().toLocaleString()}</p>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar relative">
            <div className="max-w-6xl mx-auto">
              <Routes>
                <Route
                  path="/"
                  element={
                    <RequirePerm perms={['dashboard:read']} user={user}>
                      <Dashboard />
                    </RequirePerm>
                  }
                />
                <Route
                  path="/buses"
                  element={
                    <RequirePerm perms={['buses:read']} user={user}>
                      <Buses />
                    </RequirePerm>
                  }
                />
                <Route
                  path="/parqueos"
                  element={
                    <RequirePerm perms={['parqueos:read']} user={user}>
                      <Parqueos />
                    </RequirePerm>
                  }
                />
                <Route
                  path="/personnel"
                  element={
                    <RequirePerm perms={['guardias:read', 'pilotos:read', 'operadores:read']} user={user}>
                      <Personnel />
                    </RequirePerm>
                  }
                />
                <Route
                  path="/routes"
                  element={
                    <RequirePerm perms={['lineas:read']} user={user}>
                      <RoutesPage />
                    </RequirePerm>
                  }
                />
                <Route
                  path="/reports"
                  element={
                    <RequirePerm perms={['reportes:read']} user={user}>
                      <Reports />
                    </RequirePerm>
                  }
                />
                <Route
                  path="/reinforcements"
                  element={
                    <RequirePerm perms={['refuerzos:read']} user={user}>
                      <Reinforcements />
                    </RequirePerm>
                  }
                />
                <Route
                  path="/users"
                  element={
                    <RequirePerm perms={['usuarios:read']} user={user}>
                      <Users />
                    </RequirePerm>
                  }
                />
              </Routes>
            </div>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
