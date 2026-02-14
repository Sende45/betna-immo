import React, { useState, useEffect } from 'react';
import { Users, ShieldCheck, UserX, Loader2, Mail, Phone, Building2, CheckCircle2, XCircle } from 'lucide-react';
// 💡 IMPORT FIREBASE
import { db } from '../firebase';
import { collection, query, onSnapshot, doc, updateDoc, where } from 'firebase/firestore';

function DashboardAdmin() {
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]); // 🆕 État pour les biens
  const [loading, setLoading] = useState(true);

  // 💡 CHARGER UTILISATEURS ET BIENS
  useEffect(() => {
    // Requête utilisateurs
    const qUsers = query(collection(db, "users"));
    const unsubscribeUsers = onSnapshot(qUsers, (snapshot) => {
      setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // 🆕 Requête biens en attente
    const qProps = query(collection(db, "biens"), where("status", "==", "En attente"));
    const unsubscribeProps = onSnapshot(qProps, (snapshot) => {
      setProperties(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return () => {
      unsubscribeUsers();
      unsubscribeProps();
    };
  }, []);

  // 💡 FONCTION POUR VALIDER/BLOQUER UN UTILISATEUR
  const toggleUserStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'actif' ? 'bloqué' : 'actif';
    try {
      await updateDoc(doc(db, "users", userId), { status: newStatus });
    } catch (error) {
      console.error("Erreur mise à jour : ", error);
      alert("Erreur lors de la mise à jour du statut.");
    }
  };

  // 🆕 FONCTION POUR VALIDER UN BIEN
  const validateProperty = async (propertyId) => {
    try {
      await updateDoc(doc(db, "biens", propertyId), { status: 'Vérifié' });
      alert("Bien vérifié avec succès !");
    } catch (error) {
      console.error("Erreur validation : ", error);
      alert("Erreur lors de la validation.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
            <ShieldCheck className="w-9 h-9 text-emerald-600" />
            <h1 className="text-3xl font-bold text-gray-900">Administration - Betna Immo</h1>
        </div>

        {loading ? (
            <div className="text-center py-16 flex flex-col items-center gap-4">
                <Loader2 className="h-10 w-10 text-emerald-600 animate-spin" />
                <p className="text-gray-500">Chargement des données...</p>
            </div>
        ) : (
            <div className="space-y-10">
                
                {/* 🆕 SECTION VALIDATION DES BIENS */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <Building2 className="text-emerald-600" /> Validation des nouveaux biens
                    </h2>
                    {properties.length === 0 ? (
                        <p className="text-center text-gray-500 py-6">Aucun bien en attente de validation.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {properties.map(prop => (
                                <div key={prop.id} className="border rounded-xl p-4 flex justify-between items-center gap-4">
                                    <div>
                                        <p className="font-semibold text-gray-900">{prop.title}</p>
                                        <p className="text-sm text-gray-500">{prop.location} - {parseInt(prop.price).toLocaleString('fr-FR')} FCFA</p>
                                    </div>
                                    <button 
                                        onClick={() => validateProperty(prop.id)}
                                        className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-100"
                                    >
                                        <CheckCircle2 size={18} /> Valider
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* SECTION GESTION UTILISATEURS */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <h2 className="text-2xl font-bold text-gray-800 p-6 pb-0 flex items-center gap-2">
                        <Users className="text-emerald-600" /> Gestion des utilisateurs
                    </h2>
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="p-4 font-semibold text-gray-600">Nom</th>
                                <th className="p-4 font-semibold text-gray-600">Email</th>
                                <th className="p-4 font-semibold text-gray-600">Type</th>
                                <th className="p-4 font-semibold text-gray-600">Statut</th>
                                <th className="p-4 font-semibold text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {users.map(user => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="p-4 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                                            {user.name ? user.name[0].toUpperCase() : 'U'}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{user.name || "N/A"}</p>
                                            <p className="text-xs text-gray-500">{user.phone || "Pas de tel"}</p>
                                        </div>
                                    </td>
                                    <td className="p-4 text-gray-700 text-sm">{user.email}</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.role === 'proprietaire' ? 'bg-sky-100 text-sky-700' : 'bg-gray-100 text-gray-700'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.status === 'actif' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                            {user.status || 'actif'}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <button 
                                            onClick={() => toggleUserStatus(user.id, user.status || 'actif')}
                                            className={`flex items-center gap-1.5 text-sm font-medium ${user.status === 'bloqué' ? 'text-emerald-600' : 'text-red-600'}`}
                                        >
                                            {user.status === 'bloqué' ? <ShieldCheck size={18} /> : <UserX size={18} />}
                                            {user.status === 'bloqué' ? 'Débloquer' : 'Bloquer'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {users.length === 0 && <p className="text-center py-10 text-gray-500">Aucun utilisateur inscrit.</p>}
                </div>
            </div>
        )}
      </div>
    </div>
  );
}

export default DashboardAdmin;