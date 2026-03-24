import React, { useState, useEffect, useCallback } from 'react';
// AJOUT BIEN VÉRIFIÉ DE Loader2 ICI
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
      
      // On utilise Promise.allSettled pour éviter que le crash d'une route API (404) 
      // ne bloque l'affichage du reste de la page
      const [favRes, appRes] = await Promise.allSettled([
        api.get('/favoris/mes-favoris'),
        api.get('/visites/mes-visites')
      ]);

      if (favRes.status === 'fulfilled') {
        setFavorites(favRes.value.data);
      } else {
        console.warn("Route favoris non trouvée (404)");
        setFavorites([]);
      }

      if (appRes.status === 'fulfilled') {
        setAppointments(appRes.value.data);
      } else {
        console.warn("Route visites non trouvée (404)");
        setAppointments([]);
      }

    } catch (error) {
      console.error("Erreur lors du chargement des données client:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Si Loader2 n'est pas importé, cette ligne fait crash l'appli (Écran blanc)
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-32 gap-4">
        <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
        <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">
          Chargement de votre espace...
        </p>
      </div>
    );
  }

  return (
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
        <p className="text-slate-500 mt-2 font-medium text-lg">Retrouvez vos coups de cœur et gérez vos rendez-vous.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Section Favoris */}
        <section>
          <div className="flex items-center justify-between mb-8 px-2">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
              <Bookmark className="text-rose-500 fill-rose-500" size={28} /> Mes Coups de Cœur
            </h2>
            <span className="bg-white border border-slate-100 text-slate-500 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider">
              {favorites.length} Biens
            </span>
          </div>

          <div className="space-y-4">
            {favorites.length > 0 ? (
              favorites.map((fav) => (
                <div key={fav._id} className="group bg-white p-4 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-5">
                  <div className="h-20 w-20 bg-slate-100 rounded-3xl overflow-hidden flex-shrink-0">
                    <img 
                      src={fav.propertyImage || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=200"} 
                      className="h-full w-full object-cover" 
                      alt="" 
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-black text-slate-900 leading-tight">{fav.propertyTitle}</h3>
                    <p className="text-emerald-600 font-black text-sm mt-1">
                      {fav.price ? parseInt(fav.price).toLocaleString() : '0'} FCFA
                    </p>
                  </div>
                  <ArrowRight className="text-slate-300" size={20} />
                </div>
              ))
            ) : (
              <div className="bg-white border-2 border-dashed border-slate-200 rounded-[3rem] py-20 text-center">
                <Heart className="mx-auto h-16 w-16 text-slate-100 mb-4" />
                <p className="text-slate-400 font-bold">Votre liste est vide.</p>
              </div>
            )}
          </div>
        </section>

        {/* Section Rendez-vous */}
        <section>
          <div className="flex items-center justify-between mb-8 px-2">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
              <CalendarCheck className="text-sky-500" size={28} /> Agenda des Visites
            </h2>
          </div>

          <div className="space-y-4">
            {appointments.length > 0 ? (
              appointments.map((app) => (
                <div key={app._id} className="bg-white p-6 rounded-[3rem] border border-slate-100 shadow-sm flex justify-between items-center">
                  <div>
                    <h3 className="font-black text-slate-900">{app.propertyTitle}</h3>
                    <p className="text-[10px] font-black uppercase text-slate-400 mt-1">
                      {new Date(app.visitDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    app.status === 'Confirmé' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {app.status || 'En attente'}
                  </span>
                </div>
              ))
            ) : (
              <div className="bg-white border-2 border-dashed border-slate-200 rounded-[3rem] py-20 text-center">
                <Clock className="mx-auto h-16 w-16 text-slate-100 mb-4" />
                <p className="text-slate-400 font-bold">Aucune visite planifiée.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default DashboardClient;