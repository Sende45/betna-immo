import React, { useState, useEffect, useCallback } from 'react';
import { Heart, CalendarCheck, Loader2, MapPin, ArrowRight, Bookmark, CheckCircle2, XCircle, Clock, Sparkles } from 'lucide-react';
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
      // Utilisation de Promise.allSettled pour que si une requête échoue, l'autre s'affiche quand même
      const [favRes, appRes] = await Promise.allSettled([
        api.get('/favoris/mes-favoris'),
        api.get('/visites/mes-visites')
      ]);

      if (favRes.status === 'fulfilled') setFavorites(favRes.value.data);
      if (appRes.status === 'fulfilled') setAppointments(appRes.value.data);

    } catch (error) {
      console.error("Erreur critique Dashboard:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchDashboardData(); }, [fetchDashboardData]);

  if (loading) return (
    <div className="flex flex-col justify-center items-center py-32 gap-4">
      <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
      <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Chargement de vos données...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-12">
        <h1 className="text-4xl font-black text-slate-950 tracking-tighter">
          Bonjour, {user?.fullName?.split(' ')[0] || 'Cher Client'} 👋
        </h1>
        <p className="text-slate-500 mt-2 font-medium">Gérez vos coups de cœur et vos visites.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Section Favoris */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
              <Bookmark className="text-rose-500 fill-rose-500" size={28} /> Favoris
            </h2>
            <span className="bg-white border border-slate-100 text-slate-500 px-4 py-1 rounded-full text-[10px] font-black">{favorites.length} Biens</span>
          </div>

          <div className="space-y-4">
            {favorites.length > 0 ? (
              favorites.map((fav) => (
                <div key={fav._id} className="bg-white p-4 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-5">
                  <div className="h-20 w-20 bg-slate-100 rounded-3xl overflow-hidden flex-shrink-0">
                    <img src={fav.propertyImage || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=200"} className="h-full w-full object-cover" alt="" />
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
              <div className="bg-white border-2 border-dashed border-slate-200 rounded-[3rem] py-16 text-center">
                <Heart className="mx-auto h-12 w-12 text-slate-100 mb-2" />
                <p className="text-slate-400 font-bold">Aucun favori pour l'instant.</p>
              </div>
            )}
          </div>
        </section>

        {/* Section Rendez-vous */}
        <section>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3 mb-8">
            <CalendarCheck className="text-sky-500" size={28} /> Vos Visites
          </h2>
          <div className="space-y-4">
            {appointments.length > 0 ? (
              appointments.map((app) => (
                <div key={app._id} className="bg-white p-5 rounded-[2.5rem] border border-slate-100 flex justify-between items-center shadow-sm">
                  <div>
                    <h3 className="font-black text-slate-900">{app.propertyTitle}</h3>
                    <p className="text-[10px] font-black uppercase text-slate-400 mt-1">{new Date(app.visitDate).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest ${app.status === 'Confirmé' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                    {app.status || 'En attente'}
                  </span>
                </div>
              ))
            ) : (
              <div className="bg-white border-2 border-dashed border-slate-200 rounded-[3rem] py-16 text-center">
                <Clock className="mx-auto h-12 w-12 text-slate-100 mb-2" />
                <p className="text-slate-400 font-bold">Pas de visites planifiées.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default DashboardClient;