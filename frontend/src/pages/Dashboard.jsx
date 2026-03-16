import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // ✅ Utilise ton nouveau context
import { Loader2, LogOut, ShieldCheck, User, LayoutDashboard, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

// Imports des composants de sous-dashboard
import DashboardAdmin from './DashboardAdmin';
import DashboardProprietaire from './DashboardProprietaire';
import DashboardClient from './DashboardClient';

function Dashboard() {
  // ✅ On récupère 'user', 'logout' et 'loading' depuis ton AuthContext MongoDB
  const { user, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Si l'authentification est finie et qu'il n'y a pas d'utilisateur, on redirige
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  const handleLogout = () => {
    logout(); // Nettoie le localStorage et l'état
    navigate('/login');
  };

  // ✅ État de chargement pendant la vérification du JWT
  if (authLoading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      >
        <Loader2 className="w-12 h-12 text-emerald-600" />
      </motion.div>
      <p className="mt-4 text-slate-400 font-bold uppercase tracking-widest text-[10px]">Sécurisation de la session...</p>
    </div>
  );

  // Sécurité supplémentaire
  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      {/* Navbar Ultra-Moderne */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 h-20 flex justify-between items-center">
          
          <div className="flex items-center gap-8">
            <motion.h1 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-2xl font-black text-slate-900 tracking-tighter"
            >
              BETNA<span className='text-emerald-500'>.IMMO</span>
            </motion.h1>

            {/* Badge de rôle dynamique */}
            <div className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-slate-50 border border-slate-100 rounded-full">
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
              <span className='text-sm font-black text-slate-900 leading-none'>
                {user.fullName || user.email?.split('@')[0]}
              </span>
              <span className='text-[10px] text-slate-400 font-bold uppercase'>{user.email}</span>
            </div>
            
            <div className="h-8 w-[1px] bg-slate-100 mx-2" />

            <button 
              onClick={handleLogout}
              className="group flex items-center gap-2 bg-rose-50 text-rose-600 p-3 md:px-5 md:py-2.5 rounded-2xl font-bold text-sm hover:bg-rose-500 hover:text-white transition-all duration-300"
            >
              <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span className="hidden md:block">Quitter</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Zone de contenu avec animation de page */}
      <motion.main 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Rendu conditionnel selon le rôle (directement depuis MongoDB via AuthContext) */}
        {user.role === 'admin' && <DashboardAdmin />}
        {user.role === 'proprietaire' && <DashboardProprietaire />}
        {user.role === 'client' && <DashboardClient />}
        
        {/* Fallback si le rôle n'est pas reconnu */}
        {!['admin', 'proprietaire', 'client'].includes(user.role) && (
          <div className='flex flex-col items-center justify-center py-40'>
            <div className='bg-amber-50 p-6 rounded-[2.5rem] border border-amber-100 text-center max-w-md'>
              <Settings className="w-12 h-12 text-amber-500 mx-auto mb-4 animate-spin" />
              <h2 className="text-xl font-black text-slate-900 mb-2">Compte en cours de configuration</h2>
              <p className='text-slate-500 text-sm font-medium'>
                Votre rôle (<span className="text-amber-600">{user.role}</span>) est en cours de validation. 
                Revenez d'ici quelques minutes !
              </p>
            </div>
          </div>
        )}
      </motion.main>
    </div>
  );
}

export default Dashboard;