import React, { useState, useEffect, useCallback } from 'react';
import { 
  Users, ShieldCheck, UserX, Loader2, 
  Building2, CheckCircle2, XCircle, BarChart3, 
  Search, Filter, AlertCircle, TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios'; 

function DashboardAdmin() {
  const [users, setUsers] = useState([]);
  const [propertiesPending, setPropertiesPending] = useState([]); 
  const [totalBiens, setTotalBiens] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchAdminData = useCallback(async () => {
    try {
      setLoading(true);
      const [usersRes, pendingRes, totalRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/biens?status=En attente'),
        api.get('/admin/stats/total-biens')
      ]);

      setUsers(usersRes.data);
      setPropertiesPending(pendingRes.data);
      setTotalBiens(totalRes.data.count || 0);
    } catch (error) {
      console.error("Erreur Admin Fetch:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdminData();
  }, [fetchAdminData]);

  const toggleUserStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'actif' ? 'bloqué' : 'actif';
    try {
      await api.patch(`/admin/users/${userId}/status`, { status: newStatus });
      fetchAdminData(); 
    } catch (error) {
      console.error(error);
    }
  };

  const validateProperty = async (propertyId) => {
    try {
      await api.patch(`/admin/biens/${propertyId}/validate`);
      fetchAdminData();
    } catch (error) {
      console.error(error);
    }
  };

  const StatsCard = ({ title, value, icon: Icon, color, trend }) => (
    <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm flex items-center justify-between group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500">
      <div>
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">{title}</p>
        <div className="flex items-baseline gap-2">
            <p className="text-4xl font-black text-slate-900 tracking-tighter">{value}</p>
            {trend && <span className="text-emerald-500 text-xs font-bold flex items-center gap-0.5"><TrendingUp size={12}/> {trend}</span>}
        </div>
      </div>
      <div className={`p-5 rounded-[1.5rem] shadow-sm group-hover:scale-110 transition-transform duration-500 ${color}`}>
        <Icon size={28} />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 pt-24 md:pt-32">
      <div className="max-w-7xl mx-auto">
        
        {/* Admin Branding & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-4xl font-black text-slate-950 flex items-center gap-4 tracking-tighter">
              <div className="bg-emerald-500 p-2 rounded-xl shadow-lg shadow-emerald-200">
                <ShieldCheck className="text-white w-8 h-8" />
              </div>
              Console de Supervision
            </h1>
            <p className="text-slate-500 font-medium mt-2">Gestion du réseau immobilier de Côte d'Ivoire</p>
          </motion.div>
          
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Rechercher un membre..." 
                className="pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 outline-none w-72 font-bold text-sm transition-all"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center py-40 gap-4">
            <Loader2 className="h-12 w-12 text-emerald-500 animate-spin" />
            <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em]">Accès sécurisé en cours...</p>
          </div>
        ) : (
          <div className="space-y-10">
            
            {/* Statistiques Dynamiques */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <StatsCard title="Membres" value={users.length} icon={Users} color="bg-blue-50 text-blue-600" trend="+2%"/>
              <StatsCard title="Demandes" value={propertiesPending.length} icon={AlertCircle} color="bg-amber-50 text-amber-600" />
              <StatsCard title="Base Biens" value={totalBiens} icon={BarChart3} color="bg-emerald-50 text-emerald-600" trend="+12" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              
              {/* Validation du Catalogue (Section Gauche) */}
              <div className="lg:col-span-4 space-y-8">
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3 px-2 tracking-tight">
                  <Building2 size={24} className="text-emerald-500" /> Files d'attente
                </h2>
                <div className="space-y-5">
                  <AnimatePresence mode='popLayout'>
                    {propertiesPending.length > 0 ? (
                      propertiesPending.map(prop => (
                        <motion.div 
                          layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, x: -30 }}
                          key={prop._id || prop.id} 
                          className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/40 transition-all group"
                        >
                          <div className="flex justify-between items-start mb-6">
                            <div>
                              <p className="font-black text-slate-900 text-lg leading-tight group-hover:text-emerald-600 transition-colors">{prop.title}</p>
                              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-2">{prop.location}</p>
                            </div>
                            <div className="text-right">
                                <span className="text-emerald-600 font-black text-sm">{parseInt(prop.price).toLocaleString()}</span>
                                <p className="text-[8px] font-bold text-slate-300">FCFA</p>
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <button 
                              onClick={() => validateProperty(prop._id || prop.id)}
                              className="flex-grow flex items-center justify-center gap-2 bg-slate-900 text-white py-4 rounded-2xl text-[10px] font-black hover:bg-emerald-600 transition-all shadow-lg shadow-slate-100 tracking-[0.2em]"
                            >
                              <CheckCircle2 size={16} /> VALIDER LE BIEN
                            </button>
                            <button className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-rose-50 hover:text-rose-600 transition-all border border-transparent hover:border-rose-100">
                              <XCircle size={20} />
                            </button>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="bg-white rounded-[3rem] py-20 text-center border-2 border-dashed border-slate-100">
                        <CheckCircle2 className="mx-auto text-emerald-100 mb-4" size={48} />
                        <p className="text-slate-400 font-black text-xs uppercase tracking-widest">Aucun bien en attente</p>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Table des Utilisateurs (Section Droite) */}
              <div className="lg:col-span-8">
                <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-sm overflow-hidden">
                  <div className="p-10 border-b border-slate-50 flex items-center justify-between bg-white">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tighter">Membres du réseau</h2>
                        <p className="text-slate-400 text-xs font-medium">Gérez les accès et les statuts des comptes</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-2xl text-slate-400">
                        <Filter size={20} />
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-slate-50/50">
                          <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Identité</th>
                          <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Rôle</th>
                          <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Statut</th>
                          <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Contrôle</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {users.filter(u => u.fullName?.toLowerCase().includes(searchTerm.toLowerCase())).map(u => (
                          <tr key={u._id || u.id} className="hover:bg-slate-50/30 transition-colors group">
                            <td className="px-10 py-6">
                              <div className="flex items-center gap-5">
                                <div className="w-14 h-14 rounded-2xl bg-slate-950 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-slate-200">
                                  {u.fullName?.[0]?.toUpperCase() || 'U'}
                                </div>
                                <div>
                                  <p className="font-black text-slate-900 group-hover:text-emerald-600 transition-colors">{u.fullName || "Utilisateur"}</p>
                                  <p className="text-xs text-slate-400 font-bold mt-1">{u.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-10 py-6">
                              <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider border shadow-sm ${
                                u.role === 'proprietaire' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 
                                u.role === 'admin' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-100'
                              }`}>
                                {u.role}
                              </span>
                            </td>
                            <td className="px-10 py-6">
                              <div className="flex items-center gap-2.5">
                                <div className={`w-2.5 h-2.5 rounded-full shadow-sm animate-pulse ${u.status === 'bloqué' ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                                <span className="text-[10px] font-black text-slate-700 uppercase tracking-tighter">{u.status || 'actif'}</span>
                              </div>
                            </td>
                            <td className="px-10 py-6 text-right">
                              <button 
                                onClick={() => toggleUserStatus(u._id || u.id, u.status || 'actif')}
                                className={`p-4 rounded-2xl transition-all shadow-sm ${
                                  u.status === 'bloqué' 
                                  ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white hover:shadow-emerald-200' 
                                  : 'bg-rose-50 text-rose-500 hover:bg-rose-600 hover:text-white hover:shadow-rose-200'
                                }`}
                              >
                                {u.status === 'bloqué' ? <ShieldCheck size={22} /> : <UserX size={22} />}
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