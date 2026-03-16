import React, { useState, useEffect, useCallback } from 'react';
import { 
  Heart, CalendarCheck, Loader2, MapPin, 
  ArrowRight, Bookmark, CheckCircle2, XCircle, Clock, Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext'; 
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios'; // ✅ Ton instance Axios automatique

function DashboardClient() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Chargement des données depuis le backend
  const fetchDashboardData = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      // On lance les deux requêtes en parallèle pour plus de rapidité
      const [favRes, appRes] = await Promise.all([
        api.get('/favoris/mes-favoris'), // Backend filtrera par req.user.id
        api.get('/visites/mes-visites')   // Backend filtrera par req.user.id
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
    <div className="min-h-screen bg-[#FDFDFD] p-4 md:p-8 pt-24 md:pt-32">
      <div className="max-w-6xl mx-auto">
        
        {/* En-tête de bienvenue personnalisé */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-2">
            <div className="h-1 w-12 bg-emerald-500 rounded-full" />
            <span className="text-emerald-600 font-bold uppercase tracking-widest text-xs">Espace Personnel</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-950 tracking-tight flex items-center gap-4">
            Bonjour, {user?.fullName?.split(' ')[0] || 'Cher Client'} <span className="animate-bounce">👋</span>
          </h1>
          <p className="text-slate-500 mt-2 font-medium text-lg">Retrouvez vos coups de cœur et gérez vos rendez-vous.</p>
        </motion.div>

        {loading ? (
          <div className="flex flex-col justify-center items-center py-32 gap-4">
            <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
            <p className="text-slate-400 font-bold animate-pulse uppercase tracking-widest text-xs">Chargement de votre espace...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            
            {/* Section Favoris */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center justify-between mb-6 px-2">
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                  <Bookmark className="text-rose-500 fill-rose-500" size={28} /> Mes Coups de Cœur
                </h2>
                <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">
                  {favorites.length} Biens
                </span>
              </div>

              <div className="space-y-4">
                <AnimatePresence>
                  {favorites.length > 0 ? (
                    favorites.map((fav, index) => (
                      <motion.div 
                        key={fav._id || fav.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ x: 5 }}
                        className="group bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all flex items-center gap-5"
                      >
                        <div className="h-20 w-20 bg-slate-100 rounded-2xl overflow-hidden flex-shrink-0">
                          <img 
                            src={fav.propertyImage || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000&auto=format&fit=crop"} 
                            alt="" 
                            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" 
                          />
                        </div>
                        <div className="flex-grow">
                          <h3 className="font-black text-slate-900 leading-tight group-hover:text-emerald-600 transition-colors">{fav.propertyTitle}</h3>
                          <p className="text-slate-400 text-sm flex items-center gap-1 font-medium mt-1">
                            <MapPin size={14} className="text-slate-300"/> {fav.location}
                          </p>
                          <p className="text-emerald-600 font-black text-sm mt-1">
                            {parseInt(fav.price).toLocaleString('fr-FR')} FCFA
                          </p>
                        </div>
                        <button className="p-3 bg-slate-50 rounded-full text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-all">
                          <ArrowRight size={20} />
                        </button>
                      </motion.div>
                    ))
                  ) : (
                    <div className="bg-white border-2 border-dashed border-slate-100 rounded-[2.5rem] py-16 text-center">
                      <Heart className="mx-auto h-12 w-12 text-slate-200 mb-4" />
                      <p className="text-slate-400 font-bold">Aucun bien enregistré.</p>
                      <button className="mt-4 text-emerald-600 font-black text-sm hover:underline">Parcourir les annonces</button>
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
              <div className="flex items-center justify-between mb-6 px-2">
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
                      className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-4 rounded-2xl ${
                          app.status === 'Confirmé' ? 'bg-emerald-50 text-emerald-600' : 
                          app.status === 'Annulé' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
                        }`}>
                          <Clock size={24} />
                        </div>
                        <div>
                          <h3 className="font-black text-slate-900 text-lg leading-tight">{app.propertyTitle}</h3>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-slate-500 font-bold text-xs uppercase tracking-wider bg-slate-50 px-2 py-0.5 rounded-md">
                              {new Date(app.visitDate).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <span className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${
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
                  <div className="bg-white border-2 border-dashed border-slate-100 rounded-[2.5rem] py-16 text-center">
                    <CalendarCheck className="mx-auto h-12 w-12 text-slate-200 mb-4" />
                    <p className="text-slate-400 font-bold">Aucune visite planifiée.</p>
                  </div>
                )}
              </div>
              
              {/* Carte de réassurance Client */}
              <div className="mt-10 p-8 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-[3rem] text-white relative overflow-hidden shadow-xl shadow-emerald-200">
                <div className="relative z-10">
                  <h4 className="text-xl font-black mb-2">Besoin d'aide ?</h4>
                  <p className="text-emerald-50 text-sm font-medium opacity-90 leading-relaxed mb-6">
                    Nos experts Betna sont là pour vous accompagner dans la négociation et la signature de votre contrat de bail.
                  </p>
                  <button className="bg-white text-emerald-600 px-6 py-3 rounded-2xl font-black text-sm hover:scale-105 transition-transform active:scale-95">
                    Contacter le support 24/7
                  </button>
                </div>
                <Sparkles className="absolute -bottom-4 -right-4 w-32 h-32 text-white/10 rotate-12" />
              </div>

            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardClient;