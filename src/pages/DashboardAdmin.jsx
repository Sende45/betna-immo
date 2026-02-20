import React, { useState, useEffect } from 'react';
import { 
  Users, ShieldCheck, UserX, Loader2, Mail, Phone, 
  Building2, CheckCircle2, XCircle, BarChart3, 
  Search, Filter, MoreVertical, AlertCircle
} from 'lucide-react';
import { db } from '../firebase';
import { collection, query, onSnapshot, doc, updateDoc, where } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';

function DashboardAdmin() {
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const qUsers = query(collection(db, "users"));
    const unsubscribeUsers = onSnapshot(qUsers, (snapshot) => {
      setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

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

  const toggleUserStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'actif' ? 'bloqué' : 'actif';
    try {
      await updateDoc(doc(db, "users", userId), { status: newStatus });
    } catch (error) {
      console.error(error);
    }
  };

  const validateProperty = async (propertyId) => {
    try {
      await updateDoc(doc(db, "biens", propertyId), { status: 'Vérifié' });
    } catch (error) {
      console.error(error);
    }
  };

  const StatsCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">{title}</p>
        <p className="text-3xl font-black text-slate-900">{value}</p>
      </div>
      <div className={`p-4 rounded-2xl ${color}`}>
        <Icon size={24} />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 pt-24 md:pt-32">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Admin */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-black text-slate-950 flex items-center gap-3 tracking-tight">
              <ShieldCheck className="text-emerald-500 w-10 h-10" /> Console Admin
            </h1>
            <p className="text-slate-500 font-medium mt-1">Supervision de l'écosystème Betna Immo</p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Rechercher..." 
                className="pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 outline-none w-64"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center py-40 gap-4">
            <Loader2 className="h-12 w-12 text-emerald-500 animate-spin" />
            <p className="text-slate-400 font-black text-xs uppercase tracking-widest">Initialisation sécurisée...</p>
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* Statistiques Rapides */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatsCard title="Utilisateurs" value={users.length} icon={Users} color="bg-blue-50 text-blue-600" />
              <StatsCard title="En attente" value={properties.length} icon={AlertCircle} color="bg-amber-50 text-amber-600" />
              <StatsCard title="Biens Totaux" value="--" icon={BarChart3} color="bg-emerald-50 text-emerald-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Validation des Biens (Gauche) */}
              <div className="lg:col-span-4 space-y-6">
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2 px-2">
                  <Building2 size={20} className="text-emerald-500" /> À Approuver
                </h2>
                <div className="space-y-4">
                  <AnimatePresence>
                    {properties.length > 0 ? (
                      properties.map(prop => (
                        <motion.div 
                          layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, x: -20 }}
                          key={prop.id} 
                          className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <p className="font-black text-slate-900">{prop.title}</p>
                              <p className="text-xs text-slate-400 font-bold uppercase tracking-tight">{prop.location}</p>
                            </div>
                            <span className="text-emerald-600 font-black text-xs">{parseInt(prop.price).toLocaleString()} FCFA</span>
                          </div>
                          <div className="flex gap-2 mt-4">
                            <button 
                              onClick={() => validateProperty(prop.id)}
                              className="flex-grow flex items-center justify-center gap-2 bg-emerald-500 text-white py-3 rounded-xl text-xs font-black hover:bg-emerald-600 transition-colors"
                            >
                              <CheckCircle2 size={16} /> APPROUVER
                            </button>
                            <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-rose-50 hover:text-rose-500 transition-colors">
                              <XCircle size={18} />
                            </button>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="bg-slate-50 rounded-[2rem] py-12 text-center border-2 border-dashed border-slate-200">
                        <CheckCircle2 className="mx-auto text-slate-200 mb-2" size={32} />
                        <p className="text-slate-400 font-bold text-sm">Tout est en ordre !</p>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Gestion Utilisateurs (Droite) */}
              <div className="lg:col-span-8">
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                  <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                    <h2 className="text-xl font-black text-slate-900">Membres du réseau</h2>
                    <Filter className="text-slate-300" size={20} />
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50/50">
                          <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Utilisateur</th>
                          <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Rôle</th>
                          <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">État</th>
                          <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {users.filter(u => u.name?.toLowerCase().includes(searchTerm.toLowerCase())).map(user => (
                          <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="p-6">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-600 font-black shadow-inner">
                                  {user.name?.[0]?.toUpperCase() || 'U'}
                                </div>
                                <div>
                                  <p className="font-black text-slate-900 leading-none">{user.name || "Anonyme"}</p>
                                  <p className="text-xs text-slate-400 font-medium mt-1">{user.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-6">
                              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                                user.role === 'proprietaire' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-600'
                              }`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="p-6">
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${user.status === 'bloqué' ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                                <span className="text-xs font-bold text-slate-700 capitalize">{user.status || 'actif'}</span>
                              </div>
                            </td>
                            <td className="p-6 text-right">
                              <button 
                                onClick={() => toggleUserStatus(user.id, user.status || 'actif')}
                                className={`p-3 rounded-2xl transition-all ${
                                  user.status === 'bloqué' 
                                  ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' 
                                  : 'bg-rose-50 text-rose-500 hover:bg-rose-100'
                                }`}
                                title={user.status === 'bloqué' ? 'Débloquer' : 'Bloquer'}
                              >
                                {user.status === 'bloqué' ? <ShieldCheck size={20} /> : <UserX size={20} />}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardAdmin;