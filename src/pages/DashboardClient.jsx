import React, { useState, useEffect } from 'react';
import { Heart, CalendarCheck, User, Loader2, MapPin } from 'lucide-react';
// 💡 IMPORT FIREBASE
import { db } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext'; 

function DashboardClient() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // 💡 1. Récupérer les favoris en temps réel
    const favQuery = query(collection(db, "favoris"), where("clientId", "==", user.uid));
    const unsubscribeFavs = onSnapshot(favQuery, (snapshot) => {
      setFavorites(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // 💡 2. Récupérer les demandes de visite en temps réel
    const appQuery = query(collection(db, "visites"), where("clientId", "==", user.uid));
    const unsubscribeApps = onSnapshot(appQuery, (snapshot) => {
      setAppointments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    // Nettoyage des abonnements
    return () => {
      unsubscribeFavs();
      unsubscribeApps();
    };
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <User className="w-9 h-9 text-emerald-600" />
          <h1 className="text-3xl font-bold text-gray-900">Mon Espace Client</h1>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Favoris */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <Heart className="text-red-500" /> Mes Favoris
              </h2>
              {favorites.length > 0 ? (
                <ul className="space-y-3">
                  {favorites.map(fav => (
                    <li key={fav.id} className="p-4 border border-gray-100 rounded-lg flex justify-between items-center hover:shadow-sm transition">
                      <div>
                        <span className="font-medium text-gray-800">{fav.propertyTitle}</span>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <MapPin size={14} className="text-emerald-500"/>{fav.location}
                        </p>
                      </div>
                      <span className="text-emerald-700 font-semibold">
                        {parseInt(fav.price).toLocaleString('fr-FR')} FCFA
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-xl">
                  <Heart className="mx-auto h-12 w-12 text-gray-300" />
                  <p className="mt-2">Aucun favori pour le moment.</p>
                </div>
              )}
            </div>

            {/* Demandes de visite */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <CalendarCheck className="text-sky-600" /> Mes Visites
              </h2>
              {appointments.length > 0 ? (
                <ul className="space-y-3">
                  {appointments.map(app => (
                    <li key={app.id} className="p-4 border border-gray-100 rounded-lg flex justify-between items-center hover:shadow-sm transition">
                      <div>
                        <span className="font-medium text-gray-800">{app.propertyTitle}</span>
                        <p className="text-sm text-gray-500">
                          Date : {new Date(app.visitDate).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        app.status === 'Confirmé' ? 'bg-emerald-100 text-emerald-700' :
                        app.status === 'Annulé' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {app.status}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-xl">
                  <CalendarCheck className="mx-auto h-12 w-12 text-gray-300" />
                  <p className="mt-2">Aucune demande de visite.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardClient;