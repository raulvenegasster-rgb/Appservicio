import { Link, NavLink, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth.js';
import { Shield, Trophy, UserCircle2, LogOut } from 'lucide-react';

const navLinkClass = ({ isActive }) =>
  `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
    isActive ? 'bg-secondary text-black' : 'text-slate-100 hover:bg-slate-700/60'
  }`;

export default function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="backdrop-blur bg-slate-900/60 sticky top-0 z-50 border-b border-white/5">
        <div className="max-w-6xl mx-auto flex items-center justify-between py-4 px-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3"
          >
            <img src="/images/idgs-logo.svg" alt="ID Global Solutions" className="h-10" />
            <div>
              <p className="text-xl font-display tracking-wide">OfiBowlIDG</p>
              <p className="text-xs text-slate-300">Quiniela semanal NFL de ID Global Solutions</p>
            </div>
          </motion.div>
          <nav className="flex items-center gap-3">
            <NavLink to="/" className={navLinkClass}>
              Inicio
            </NavLink>
            {user && (
              <>
                <NavLink to="/dashboard" className={navLinkClass}>
                  Picks
                </NavLink>
                <NavLink to="/ranking" className={navLinkClass}>
                  Ranking
                </NavLink>
              </>
            )}
            {user?.role === 'admin' && (
              <NavLink to="/admin" className={navLinkClass}>
                Admin
              </NavLink>
            )}
          </nav>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <div className="flex items-center gap-2 text-sm text-slate-200">
                  <UserCircle2 className="w-6 h-6" />
                  <div>
                    <p className="font-semibold">{user.full_name}</p>
                    <p className="text-xs text-slate-400">{user.role === 'admin' ? 'Administrador' : 'Jugador'}</p>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-3 py-2 rounded-md bg-red-500/80 hover:bg-red-500 text-sm"
                >
                  <LogOut className="w-4 h-4" /> Salir
                </button>
              </>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/login"
                  className="px-3 py-2 rounded-md border border-white/20 text-sm hover:bg-white/10"
                >
                  Ingresar
                </Link>
                <Link to="/registro" className="px-3 py-2 rounded-md bg-secondary text-black text-sm">
                  Registrarme
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-white/10 py-6 text-center text-xs text-slate-400">
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-2">
          <Shield className="w-4 h-4" /> Proyecto interno para ID Global Solutions - NFL © {new Date().getFullYear()}
        </div>
        <div className="flex justify-center mt-2 text-xs gap-2 text-slate-500">
          <Trophy className="w-4 h-4" /> OfiBowlIDG
        </div>
      </footer>
    </div>
  );
}
