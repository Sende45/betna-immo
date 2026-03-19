import React, { useState, useEffect, useCallback } from 'react';
import { 
  Heart, CalendarCheck, Loader2, MapPin, 
  ArrowRight, Bookmark, CheckCircle2, XCircle, Clock, Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext'; 
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';

function DashboardClient() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const [favRes, appRes] = await Promise.all([
        api.get('/favoris/mes-favoris'),
        api.get('/visites/mes-visites')
      ]);
      setFavorites(favRes.data);
      setAppointments(appRes.data);
    } catch (error) {
      console.error("Erreur lors du chargement des données client:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return (
    <div className="min-h-screen bg-slate-50/30 p-4 md:p-8 pt-24 md:pt-32">
      <div className="max-w-6xl mx-auto">
        
        {/* En-tête de bienvenue */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-2">
            <div className="h-1 w-12 bg-emerald-500 rounded-full" />
            <span className="text-emerald-600 font-black uppercase tracking-[0.2em] text-[10px]">Espace Personnel</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-950 tracking-tighter flex items-center gap-4">
            Bonjour, {user?.fullName?.split(' ')[0] || 'Cher Client'} <span className="animate-bounce">👋</span>
          </h1>
          <p className="text-slate-500 mt-2 font-medium text-lg leading-relaxed">Retrouvez vos coups de cœur et gérez vos rendez-vous.</p>
        </motion.div>

        {loading ? (
          <div className="flex flex-col justify-center items-center py-32 gap-4">
            <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
            <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Chargement de votre espace...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            
            {/* Section Favoris */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center justify-between mb-8 px-2">
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                  <Bookmark className="text-rose-500 fill-rose-500" size={28} /> Mes Coups de Cœur
                </h2>
                <span className="bg-white border border-slate-100 text-slate-500 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm">
                  {favorites.length} Biens
                </span>
              </div>

              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {favorites.length > 0 ? (
                    favorites.map((fav, index) => (
                      <motion.div 
                        key={fav._id || fav.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ x: 5 }}
                        className="group bg-white p-4 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/40 transition-all flex items-center gap-5"
                      >
                        <div className="h-24 w-24 bg-slate-100 rounded-3xl overflow-hidden flex-shrink-0 border border-slate-50">
                          <img 
                            src={fav.propertyImage || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000&auto=format&fit=crop"} 
                            alt="" 
                            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" 
                          />
                        </div>
                        <div className="flex-grow">
                          <h3 className="font-black text-slate-900 text-lg leading-tight group-hover:text-emerald-600 transition-colors">{fav.propertyTitle}</h3>
                          <p className="text-slate-400 text-sm flex items-center gap-1 font-bold mt-1.5">
                            <MapPin size={14} className="text-slate-300"/> {fav.location}
                          </p>
                          <p className="text-emerald-600 font-black text-base mt-2">
                            {parseInt(fav.price).toLocaleString('fr-FR')} FCFA
                          </p>
                        </div>
                        <button className="p-4 bg-slate-50 rounded-full text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-all border border-transparent group-hover:border-emerald-100">
                          <ArrowRight size={20} />
                        </button>
                      </motion.div>
                    ))
                  ) : (
                    <div className="bg-white border-2 border-dashed border-slate-200 rounded-[3rem] py-20 text-center">
                      <Heart className="mx-auto h-16 w-16 text-slate-100 mb-4" />
                      <p className="text-slate-400 font-bold text-lg">Votre liste est vide.</p>
                      <button className="mt-4 text-emerald-600 font-black text-sm uppercase tracking-widest hover:text-emerald-700">Explorer Abidjan</button>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Section Rendez-vous */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-8 px-2">
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                  <CalendarCheck className="text-sky-500" size={28} /> Agenda des Visites
                </h2>
              </div>

              <div className="space-y-4">
                {appointments.length > 0 ? (
                  appointments.map((app, index) => (
                    <motion.div 
                      key={app._id || app.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white p-6 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-sky-100 transition-colors"
                    >
                      <div className="flex items-center gap-5">
                        <div className={`p-5 rounded-[1.5rem] shadow-sm ${
                          app.status === 'Confirmé' ? 'bg-emerald-50 text-emerald-600' : 
                          app.status === 'Annulé' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
                        }`}>
                          <Clock size={28} />
                        </div>
                        <div>
                          <h3 className="font-black text-slate-900 text-lg leading-tight">{app.propertyTitle}</h3>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-slate-500 font-black text-[10px] uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
                              {new Date(app.visitDate).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <span className={`flex items-center gap-1.5 px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] border shadow-sm ${
                          app.status === 'Confirmé' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                          app.status === 'Annulé' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                          'bg-amber-50 text-amber-700 border-amber-100'
                        }`}>
                          {app.status === 'Confirmé' ? <CheckCircle2 size={12}/> : 
                           app.status === 'Annulé' ? <XCircle size={12}/> : <Clock size={12}/>}
                          {app.status || 'En attente'}
                        </span>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="bg-white border-2 border-dashed border-slate-200 rounded-[3rem] py-20 text-center">
                    <CalendarCheck className="mx-auto h-16 w-16 text-slate-100 mb-4" />
                    <p className="text-slate-400 font-bold text-lg">Aucune visite planifiée.</p>
                  </div>
                )}
              </div>
              
              {/* Carte de support (Gradient v4) */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="mt-12 p-10 bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 rounded-[3.5rem] text-white relative overflow-hidden shadow-2xl shadow-emerald-200"
              >
                <div className="relative z-10">
                  <h4 className="text-2xl font-black mb-3">Besoin d'un expert ?</h4>
                  <p className="text-emerald-50 text-base font-medium opacity-90 leading-relaxed mb-8 max-w-sm">
                    Nos agents Betna vous accompagnent physiquement lors des visites pour sécuriser votre futur bail.
                  </p>
                  <button className="bg-white text-emerald-700 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-50 transition-colors shadow-lg shadow-emerald-900/20">
                    Contacter le support
                  </button>
                </div>
                <Sparkles className="absolute -bottom-6 -right-6 w-48 h-48 text-white/10 rotate-12" />
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent)]" />
              </motion.div>

            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardClient;