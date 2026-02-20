import React, { useState, useEffect } from 'react';
import { 
  PlusCircle, Building2, CheckCircle2, Clock3, Trash2, Home, 
  UploadCloud, Loader2, Edit3, X, CalendarDays, CalendarClock, 
  MapPin, DollarSign, BedDouble, Bath, Sparkles, LayoutGrid
} from 'lucide-react';
import { db } from '../firebase'; 
import { collection, addDoc, onSnapshot, deleteDoc, doc, query, where, updateDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext'; 
import { motion, AnimatePresence } from 'framer-motion';

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

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "biens"), where("proprioId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setProperties(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [user]);

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
    if (!formData.title || !formData.price || !formData.typeSejour || !user || imageUrls.length === 0) {
        alert("Veuillez remplir les champs obligatoires (Titre, Prix, Type, Images).");
        return;
    }
    try {
      setUploading(true);
      const propertyData = {
        ...formData,
        imageUrls: imageUrls,
        proprioId: user.uid,
        updatedAt: new Date()
      };
      if (editingId) {
        await updateDoc(doc(db, "biens", editingId), propertyData);
        setEditingId(null);
      } else {
        await addDoc(collection(db, "biens"), {
          ...propertyData,
          status: "En attente",
          createdAt: new Date()
        });
      }
      setFormData({ title: '', location: '', price: '', description: '', bedrooms: '', bathrooms: '', agentName: '', agentPhone: '', agentEmail: '', typeSejour: '' });
      setImageUrls([]); 
    } catch (error) { console.error(error); } 
    finally { setUploading(false); }
  };

  const startEdit = (property) => {
    setEditingId(property.id);
    setFormData(property);
    setImageUrls(property.imageUrls || []); 
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ title: '', location: '', price: '', description: '', bedrooms: '', bathrooms: '', agentName: '', agentPhone: '', agentEmail: '', typeSejour: '' });
    setImageUrls([]);
  }

  const removeImage = (indexToRemove) => {
    setImageUrls(imageUrls.filter((_, index) => index !== indexToRemove));
  };

  const deleteProperty = async (id) => {
    if(!window.confirm("Êtes-vous sûr de vouloir supprimer ce bien ?")) return;
    try { await deleteDoc(doc(db, "biens", id)); } catch (error) { console.error(error); }
  };

  const getStatusBadge = (status) => {
    if (status === 'Vérifié') {
      return (
        <span className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 border border-emerald-100 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider">
          <CheckCircle2 className="w-3.5 h-3.5" /> Vérifié
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1.5 text-amber-700 bg-amber-50 border border-amber-100 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider">
        <Clock3 className="w-3.5 h-3.5" /> Examen en cours
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 pt-24 md:pt-32 text-slate-900">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50"
        >
          <div className="flex items-center gap-6">
              <div className='bg-slate-950 p-4 rounded-3xl shadow-lg shadow-slate-200'>
                <LayoutGrid className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-black text-slate-950 tracking-tight">Tableau de bord</h1>
                <p className='text-slate-500 font-medium'>Vous avez <span className="text-emerald-600 font-bold">{properties.length} propriétés</span> en ligne</p>
              </div>
          </div>
          <div className="bg-emerald-50 px-6 py-3 rounded-2xl border border-emerald-100 hidden lg:block">
            <p className="text-emerald-700 text-sm font-bold flex items-center gap-2">
              <Sparkles size={16} /> Compte Propriétaire Vérifié
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Formulaire de Publication */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-4"
          >
            <div className="bg-white p-8 rounded-[3rem] shadow-xl shadow-slate-200/40 border border-white sticky top-28">
              <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-black text-slate-950 flex items-center gap-3">
                    {editingId ? <Edit3 className="text-sky-500" /> : <PlusCircle className="text-emerald-500" />} 
                    {editingId ? "Modifier" : "Publier"}
                  </h2>
                  {editingId && (
                      <button onClick={cancelEdit} className="text-slate-400 hover:text-red-500 bg-slate-50 p-2 rounded-full transition-colors">
                          <X className="w-5 h-5"/>
                      </button>
                  )}
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <input 
                  type="text" placeholder="Titre de l'annonce" 
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})} 
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-medium" 
                  required 
                />
                
                <div className="relative group">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                  <input 
                    type="text" placeholder="Localisation (Quartier)" 
                    value={formData.location} 
                    onChange={e => setFormData({...formData, location: e.target.value})} 
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none font-medium" 
                  />
                </div>
                
                <select 
                  value={formData.typeSejour} 
                  onChange={e => setFormData({...formData, typeSejour: e.target.value})} 
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none font-bold text-slate-600" 
                  required
                >
                  <option value="">Type de location</option>
                  <option value="long">Long séjour (Mensuel)</option>
                  <option value="court">Court séjour (Journalier)</option>
                </select>

                <div className="relative group">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                  <input 
                    type="number" placeholder="Prix (FCFA)" 
                    value={formData.price} 
                    onChange={e => setFormData({...formData, price: e.target.value})} 
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none font-black text-emerald-600" 
                    required 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative group">
                    <BedDouble className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input type="number" placeholder="Chambres" value={formData.bedrooms} onChange={e => setFormData({...formData, bedrooms: e.target.value})} className="w-full pl-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none" />
                  </div>
                  <div className="relative group">
                    <Bath className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input type="number" placeholder="SdB" value={formData.bathrooms} onChange={e => setFormData({...formData, bathrooms: e.target.value})} className="w-full pl-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none" />
                  </div>
                </div>

                {/* Upload Zone */}
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-[2rem] cursor-pointer border-slate-100 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 transition-all duration-300">
                      <div className="flex flex-col items-center justify-center text-center px-4">
                          {uploading ? <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" /> : <UploadCloud className="w-8 h-8 text-slate-300 mb-2" />}
                          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Photos du bien</p>
                      </div>
                      <input type="file" className="hidden" onChange={e => handleImageUpload(e.target.files)} accept="image/*" multiple />
                  </label>
                </div>

                {/* Aperçu des images */}
                <div className="grid grid-cols-4 gap-2">
                  <AnimatePresence>
                    {imageUrls.map((url, index) => (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                          key={index} className="relative group aspect-square"
                        >
                            <img src={url} alt="Aperçu" className="h-full w-full object-cover rounded-xl border-2 border-white shadow-sm" />
                            <button type="button" onClick={() => removeImage(index)} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 shadow-lg opacity-0 group-hover:opacity-100 transition-all">
                                <X size={12} />
                            </button>
                        </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <motion.button 
                  whileTap={{ scale: 0.98 }}
                  type="submit" 
                  disabled={uploading} 
                  className={`w-full text-white py-5 rounded-[1.5rem] font-black text-lg transition-all shadow-lg flex items-center justify-center gap-2 ${editingId ? 'bg-sky-500 shadow-sky-100' : 'bg-slate-950 shadow-slate-200 hover:bg-emerald-600'} disabled:bg-slate-300`}
                >
                  {uploading ? <Loader2 className="animate-spin w-6 h-6"/> : (editingId ? "Enregistrer" : "Publier l'annonce")}
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* Liste des annonces */}
          <div className="lg:col-span-8">
            <h2 className="text-2xl font-black text-slate-950 mb-8 flex items-center gap-3">
              <Building2 className="text-emerald-500 w-7 h-7" /> Vos annonces actives
            </h2>
            
            <div className="grid grid-cols-1 gap-6">
              <AnimatePresence mode='popLayout'>
                {properties.map(property => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    key={property.id} 
                    className="flex flex-col md:flex-row items-center bg-white p-4 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-500 gap-6"
                  >
                    <div className="relative w-full md:w-48 h-40 flex-shrink-0">
                      <img 
                        src={property.imageUrls?.[0] || "https://via.placeholder.com/150"} 
                        alt={property.title} 
                        className="w-full h-full rounded-[2rem] object-cover" 
                      />
                      <div className="absolute top-3 left-3">
                        {getStatusBadge(property.status)}
                      </div>
                    </div>

                    <div className="flex-grow space-y-3 w-full">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-black text-slate-950 text-xl tracking-tight">{property.title}</h3>
                          <p className="text-slate-400 font-medium flex items-center gap-1.5">
                            <MapPin size={14} className="text-emerald-500"/> {property.location}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-black text-slate-950 tracking-tighter">
                            {parseInt(property.price).toLocaleString('fr-FR')} 
                            <span className="text-xs text-slate-400 ml-1 uppercase">FCFA</span>
                          </p>
                          <span className={`text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-widest ${property.typeSejour === 'long' ? 'text-purple-600 bg-purple-50' : 'text-orange-600 bg-orange-50'}`}>
                            {property.typeSejour === 'long' ? 'Mensuel' : 'Journalier'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                        <div className="flex gap-4 text-slate-400 text-sm font-bold">
                          <span className="flex items-center gap-1.5"><BedDouble size={16}/> {property.bedrooms || 0}</span>
                          <span className="flex items-center gap-1.5"><Bath size={16}/> {property.bathrooms || 0}</span>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => startEdit(property)} className="p-3 rounded-2xl bg-slate-50 text-slate-400 hover:bg-sky-50 hover:text-sky-600 transition-all">
                                <Edit3 className="w-5 h-5" />
                            </button>
                            <button onClick={() => deleteProperty(property.id)} className="p-3 rounded-2xl bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all">
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
                  className='text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-100'
                >
                    <Building2 className='w-20 h-20 text-slate-100 mx-auto mb-6'/>
                    <p className="text-xl font-black text-slate-300">Votre catalogue est vide</p>
                    <p className="text-slate-400 font-medium">Commencez par ajouter une propriété à gauche.</p>
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