import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2, LogOut, ShieldCheck, User, LayoutDashboard, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

// Imports des sous-dashboards (Vérifie bien que les chemins sont exacts)
import DashboardAdmin from './DashboardAdmin';
import DashboardProprietaire from './DashboardProprietaire';
import DashboardClient from './DashboardClient';

function Dashboard() {
  const { user, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (authLoading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
        <Loader2 className="w-12 h-12 text-emerald-600" />
      </motion.div>
      <p className="mt-4 text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">Sécurisation...</p>
    </div>
  );

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Navbar Fixe */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 h-20">
        <div className="max-w-7xl mx-auto px-6 h-full flex justify-between items-center">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-black text-slate-900 tracking-tighter">
              BETNA<span className='text-emerald-500'>.IMMO</span>
            </h1>
            <div className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-white border border-slate-100 rounded-full shadow-sm">
              {user.role === 'admin' && <ShieldCheck size={14} className="text-emerald-600"/>}
              {user.role === 'proprietaire' && <LayoutDashboard size={14} className="text-sky-600"/>}
              {user.role === 'client' && <User size={14} className="text-rose-600"/>}
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Espace {user.role}</span>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 bg-rose-50 text-rose-600 px-5 py-2.5 rounded-2xl font-bold text-sm hover:bg-rose-600 hover:text-white transition-all shadow-sm">
            <LogOut size={18} /> <span className="hidden md:block">Quitter</span>
          </button>
        </div>
      </nav>

      {/* Rendu dynamique du contenu selon le rôle */}
      <motion.main initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="pt-28 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          {user.role === 'admin' && <DashboardAdmin />}
          {user.role === 'proprietaire' && <DashboardProprietaire />}
          {user.role === 'client' && <DashboardClient />}
          
          {/* Fallback si le rôle n'est pas reconnu */}
          {!['admin', 'proprietaire', 'client'].includes(user.role) && (
            <div className="text-center py-20 bg-white rounded-[3rem] border border-slate-100">
               <Settings className="mx-auto text-amber-500 mb-4 animate-spin" size={48} />
               <h2 className="text-xl font-black">Rôle "{user.role}" non configuré</h2>
            </div>
          )}
        </div>
      </motion.main>
    </div>
  );
}

export default Dashboard;