import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2, LogOut, ShieldCheck, User, LayoutDashboard, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

// Imports des sous-dashboards
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

  // ✅ Écran de chargement optimisé v4
  if (authLoading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      >
        <Loader2 className="w-12 h-12 text-emerald-600" />
      </motion.div>
      <p className="mt-4 text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">
        Sécurisation de la session...
      </p>
    </div>
  );

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Navbar Ultra-Moderne 
          Note : On utilise 'catalogue-glass' défini dans ton index.css v4 pour un blur parfait 
      */}
      <nav className="fixed top-0 left-0 right-0 z-50 catalogue-glass border-b border-slate-100 h-20">
        <div className="max-w-7xl mx-auto px-6 h-full flex justify-between items-center">
          
          <div className="flex items-center gap-8">
            <motion.h1 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-2xl font-black text-slate-900 tracking-tighter"
            >
              BETNA<span className='text-emerald-500'>.IMMO</span>
            </motion.h1>

            {/* Badge de rôle dynamique (Stylisé v4) */}
            <div className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-white border border-slate-100 rounded-full shadow-sm">
              {user.role === 'admin' && <ShieldCheck size={14} className="text-emerald-600"/>}
              {user.role === 'proprietaire' && <LayoutDashboard size={14} className="text-sky-600"/>}
              {user.role === 'client' && <User size={14} className="text-rose-600"/>}
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                Espace {user.role}
              </span>
            </div>
          </div>

          <div className='flex items-center gap-6'>
            <div className='hidden sm:flex flex-col items-end'>
              <span className='text-sm font-black text-slate-950 leading-none'>
                {user.fullName || user.email?.split('@')[0]}
              </span>
              <span className='text-[10px] text-slate-400 font-bold uppercase tracking-tight'>{user.email}</span>
            </div>
            
            <div className="h-8 w-px bg-slate-200 mx-2" />

            {/* Bouton Quitter avec effet Hover v4 */}
            <button 
              onClick={handleLogout}
              className="group flex items-center gap-2 bg-rose-50 text-rose-600 p-3 md:px-5 md:py-2.5 rounded-2xl font-bold text-sm hover:bg-rose-600 hover:text-white transition-all duration-300 shadow-sm shadow-rose-100"
            >
              <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span className="hidden md:block">Quitter</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Zone de contenu principale */}
      <motion.main 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="pt-28 pb-12 px-6"
      >
        <div className="max-w-7xl mx-auto">
          {/* Rendu conditionnel selon le rôle MongoDB */}
          {user.role === 'admin' && <DashboardAdmin />}
          {user.role === 'proprietaire' && <DashboardProprietaire />}
          {user.role === 'client' && <DashboardClient />}
          
          {/* Fallback : Rôle non reconnu ou en attente */}
          {!['admin', 'proprietaire', 'client'].includes(user.role) && (
            <div className='flex flex-col items-center justify-center py-24'>
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className='bg-white p-10 rounded-[3rem] border border-slate-100 text-center max-w-md shadow-xl shadow-slate-200/50'
              >
                <div className="w-20 h-20 bg-amber-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Settings className="w-10 h-10 text-amber-500 animate-[spin_3s_linear_infinite]" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-3">Configuration en cours</h2>
                <p className='text-slate-500 text-sm font-medium leading-relaxed'>
                  Votre rôle (<span className="text-amber-600 font-bold">{user.role}</span>) n'a pas encore été totalement activé par nos services. 
                  Un agent Betna vérifie votre profil.
                </p>
                <button 
                   onClick={() => window.location.reload()}
                   className="mt-8 px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-emerald-600 transition-colors"
                >
                  Actualiser le statut
                </button>
              </motion.div>
            </div>
          )}
        </div>
      </motion.main>
    </div>
  );
}

export default Dashboard;