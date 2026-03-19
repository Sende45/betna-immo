import React, { useState, useEffect, useCallback } from 'react';
import { 
  PlusCircle, Building2, CheckCircle2, Clock3, Trash2, 
  UploadCloud, Loader2, Edit3, X, 
  MapPin, DollarSign, BedDouble, Bath, Sparkles, LayoutGrid
} from 'lucide-react';
import { useAuth } from '../context/AuthContext'; 
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios'; 

function DashboardPropriétaire() {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [formData, setFormData] = useState({ 
    title: '', location: '', price: '', description: '', 
    bedrooms: '', bathrooms: '', agentName: '', 
    agentPhone: '', agentEmail: '',
    typeSejour: ''
  });
  
  const [editingId, setEditingId] = useState(null);
  const [imageUrls, setImageUrls] = useState([]); 
  const [uploading, setUploading] = useState(false);

  const IMGBB_API_KEY = "35bb74e2910fc59f0f0e4e2ad6c87935";

  const fetchProperties = useCallback(async () => {
    try {
      if (!user) return;
      const response = await api.get('/biens/mes-annonces'); 
      setProperties(response.data);
    } catch (error) {
      console.error("Erreur chargement:", error);
    }
  }, [user]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const handleImageUpload = async (files) => {
    if (!files.length) return;
    setUploading(true);
    const newUrls = [];
    for (let file of files) {
      const formDataUpload = new FormData();
      formDataUpload.append('image', file);
      try {
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
          method: 'POST',
          body: formDataUpload,
        });
        const data = await response.json();
        if (data.success) newUrls.push(data.data.url);
      } catch (error) { console.error(error); }
    }
    setImageUrls([...imageUrls, ...newUrls]);
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.price || !formData.typeSejour || imageUrls.length === 0) {
        alert("Veuillez remplir les champs obligatoires (Titre, Prix, Type, Images).");
        return;
    }
    try {
      setUploading(true);
      const propertyData = { ...formData, imageUrls };

      if (editingId) {
        await api.put(`/biens/${editingId}`, propertyData);
        setEditingId(null);
      } else {
        await api.post('/biens', propertyData);
      }

      setFormData({ title: '', location: '', price: '', description: '', bedrooms: '', bathrooms: '', agentName: '', agentPhone: '', agentEmail: '', typeSejour: '' });
      setImageUrls([]); 
      fetchProperties();
    } catch (error) { 
      console.error(error);
      alert("Erreur lors de la sauvegarde.");
    } finally { setUploading(false); }
  };

  const startEdit = (property) => {
    setEditingId(property._id || property.id);
    setFormData(property);
    setImageUrls(property.imageUrls || []); 
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ title: '', location: '', price: '', description: '', bedrooms: '', bathrooms: '', agentName: '', agentPhone: '', agentEmail: '', typeSejour: '' });
    setImageUrls([]);
  };

  const removeImage = (indexToRemove) => {
    setImageUrls(imageUrls.filter((_, index) => index !== indexToRemove));
  };

  const deleteProperty = async (id) => {
    if(!window.confirm("Êtes-vous sûr de vouloir supprimer ce bien ?")) return;
    try { 
      await api.delete(`/biens/${id}`);
      fetchProperties();
    } catch (error) { console.error(error); }
  };

  const getStatusBadge = (status) => {
    const isVerified = status === 'Vérifié';
    return (
      <span className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.1em] border shadow-sm ${
        isVerified ? 'text-emerald-700 bg-emerald-50 border-emerald-100' : 'text-amber-700 bg-amber-50 border-amber-100'
      }`}>
        {isVerified ? <CheckCircle2 className="w-3 h-3" /> : <Clock3 className="w-3 h-3" />}
        {isVerified ? 'Vérifié' : 'Examen'}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 pt-24 md:pt-32 text-slate-900">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section Premium */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40"
        >
          <div className="flex items-center gap-6">
              <div className='bg-slate-950 p-4 rounded-[1.5rem] shadow-lg shadow-slate-300'>
                <LayoutGrid className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-black text-slate-950 tracking-tighter">Mes Annonces</h1>
                <p className='text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1'>
                   Gérez vos <span className="text-emerald-600">{properties.length} propriétés</span> actives
                </p>
              </div>
          </div>
          <div className="bg-emerald-50 px-6 py-3 rounded-2xl border border-emerald-100 hidden lg:block">
            <p className="text-emerald-700 text-xs font-black uppercase tracking-wider flex items-center gap-2">
              <Sparkles size={14} /> Certifié Partenaire Betna
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Formulaire de Publication (Sticky) */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-4"
          >
            <div className="bg-white p-8 rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-white sticky top-28">
              <div className="flex justify-between items-center mb-10">
                  <h2 className="text-2xl font-black text-slate-950 flex items-center gap-3">
                    {editingId ? <Edit3 className="text-sky-500" /> : <PlusCircle className="text-emerald-500" />} 
                    {editingId ? "Édition" : "Publier"}
                  </h2>
                  {editingId && (
                      <button onClick={cancelEdit} className="text-slate-400 hover:text-rose-500 bg-slate-50 p-2 rounded-xl transition-colors">
                          <X className="w-5 h-5"/>
                      </button>
                  )}
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <input 
                  type="text" placeholder="Titre (ex: Villa duplex Cocody)" 
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})} 
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none font-bold" 
                  required 
                />
                
                <div className="relative group">
                  <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="text" placeholder="Quartier / Zone" 
                    value={formData.location} 
                    onChange={e => setFormData({...formData, location: e.target.value})} 
                    className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none font-bold" 
                  />
                </div>
                
                <select 
                  value={formData.typeSejour} 
                  onChange={e => setFormData({...formData, typeSejour: e.target.value})} 
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white transition-all outline-none font-black text-slate-600 text-sm uppercase tracking-widest" 
                  required
                >
                  <option value="">Type de séjour</option>
                  <option value="long">Long (Mensuel)</option>
                  <option value="court">Court (Journalier)</option>
                </select>

                <div className="relative group">
                  <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-600" />
                  <input 
                    type="number" placeholder="Loyer (FCFA)" 
                    value={formData.price} 
                    onChange={e => setFormData({...formData, price: e.target.value})} 
                    className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none font-black text-emerald-600 text-lg" 
                    required 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative group">
                    <BedDouble className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="number" placeholder="Lits" value={formData.bedrooms} onChange={e => setFormData({...formData, bedrooms: e.target.value})} className="w-full pl-10 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-sm" />
                  </div>
                  <div className="relative group">
                    <Bath className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="number" placeholder="SdB" value={formData.bathrooms} onChange={e => setFormData({...formData, bathrooms: e.target.value})} className="w-full pl-10 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-sm" />
                  </div>
                </div>

                {/* Upload Section v4 */}
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-[2rem] cursor-pointer border-slate-200 bg-slate-50 hover:bg-emerald-50/50 hover:border-emerald-300 transition-all duration-300">
                      <div className="flex flex-col items-center justify-center text-center px-4">
                          {uploading ? <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" /> : <UploadCloud className="w-8 h-8 text-slate-300 mb-2" />}
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Galerie Photos</p>
                      </div>
                      <input type="file" className="hidden" onChange={e => handleImageUpload(e.target.files)} accept="image/*" multiple />
                  </label>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  <AnimatePresence>
                    {imageUrls.map((url, index) => (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                          key={index} className="relative group aspect-square"
                        >
                            <img src={url} alt="Pre-upload" className="h-full w-full object-cover rounded-xl border border-white shadow-sm" />
                            <button type="button" onClick={() => removeImage(index)} className="absolute -top-1 -right-1 bg-rose-500 text-white rounded-full p-1.5 shadow-lg opacity-0 group-hover:opacity-100 transition-all">
                                <X size={10} />
                            </button>
                        </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <motion.button 
                  whileTap={{ scale: 0.98 }}
                  type="submit" 
                  disabled={uploading} 
                  className={`w-full text-white py-5 rounded-[1.8rem] font-black text-lg transition-all shadow-xl flex items-center justify-center gap-3 ${editingId ? 'bg-sky-500 shadow-sky-100' : 'bg-slate-950 shadow-slate-200 hover:bg-emerald-600'} disabled:bg-slate-300`}
                >
                  {uploading ? <Loader2 className="animate-spin w-6 h-6"/> : (editingId ? "Mettre à jour" : "Mettre en ligne")}
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* Liste des annonces (Scroll Area) */}
          <div className="lg:col-span-8">
            <h2 className="text-2xl font-black text-slate-950 mb-8 flex items-center gap-3">
              <Building2 className="text-emerald-500 w-7 h-7" /> Votre Parc Immobilier
            </h2>
            
            <div className="grid grid-cols-1 gap-6">
              <AnimatePresence mode='popLayout'>
                {properties.map(property => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    key={property._id || property.id} 
                    className="flex flex-col md:flex-row items-center bg-white p-5 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 gap-8 group"
                  >
                    <div className="relative w-full md:w-56 h-44 flex-shrink-0">
                      <img 
                        src={property.imageUrls?.[0] || "https://via.placeholder.com/300"} 
                        alt={property.title} 
                        className="w-full h-full rounded-[2.2rem] object-cover border border-slate-50" 
                      />
                      <div className="absolute top-4 left-4">
                        {getStatusBadge(property.status)}
                      </div>
                    </div>

                    <div className="flex-grow space-y-4 w-full">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h3 className="font-black text-slate-950 text-2xl tracking-tighter group-hover:text-emerald-600 transition-colors">{property.title}</h3>
                          <p className="text-slate-400 font-bold flex items-center gap-2 mt-1">
                            <MapPin size={14} className="text-emerald-500"/> {property.location}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-black text-slate-950 tracking-tighter">
                            {parseInt(property.price).toLocaleString('fr-FR')} 
                            <span className="text-[10px] text-slate-400 ml-1.5 font-bold">FCFA</span>
                          </p>
                          <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest mt-2 inline-block border ${property.typeSejour === 'long' ? 'text-indigo-600 bg-indigo-50 border-indigo-100' : 'text-orange-600 bg-orange-50 border-orange-100'}`}>
                            {property.typeSejour === 'long' ? 'Mensuel' : 'Journalier'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-5 border-t border-slate-50">
                        <div className="flex gap-6 text-slate-400 font-black text-[11px] uppercase tracking-wider">
                          <span className="flex items-center gap-2"><BedDouble size={16} className="text-slate-300"/> {property.bedrooms || 0} CH.</span>
                          <span className="flex items-center gap-2"><Bath size={16} className="text-slate-300"/> {property.bathrooms || 0} SDB</span>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => startEdit(property)} className="p-4 rounded-2xl bg-slate-50 text-slate-400 hover:bg-sky-50 hover:text-sky-600 transition-all shadow-sm">
                                <Edit3 className="w-5 h-5" />
                            </button>
                            <button onClick={() => deleteProperty(property._id || property.id)} className="p-4 rounded-2xl bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all shadow-sm">
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {properties.length === 0 && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className='text-center py-32 bg-white rounded-[4rem] border-2 border-dashed border-slate-100'
                >
                    <Building2 className='w-20 h-20 text-slate-100 mx-auto mb-6'/>
                    <p className="text-2xl font-black text-slate-200">Aucune propriété enregistrée</p>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">Démarrer votre business sur Betna Immo</p>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPropriétaire;