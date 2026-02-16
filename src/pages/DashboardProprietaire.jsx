import React, { useState, useEffect } from 'react';
import { PlusCircle, Building2, CheckCircle2, Clock3, Trash2, Home, UploadCloud, Loader2, Edit3, X, CalendarDays, CalendarClock, MapPin, DollarSign, BedDouble, Bath } from 'lucide-react';
import { db } from '../firebase'; 
import { collection, addDoc, onSnapshot, deleteDoc, doc, query, where, updateDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext'; 

function DashboardPropriétaire() {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  
  // 💡 ÉTAT POUR LE FORMULAIRE
  const [formData, setFormData] = useState({ 
    title: '', location: '', price: '', description: '', 
    bedrooms: '', bathrooms: '', agentName: '', 
    agentPhone: '', agentEmail: '',
    typeSejour: ''
  });
  
  const [editingId, setEditingId] = useState(null);
  const [imageUrls, setImageUrls] = useState([]); 
  const [uploading, setUploading] = useState(false);

  // ⚠️ REMPLACE PAR TA CLÉ API IMGBB ⚠️
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

  // 💡 AFFICHAGE BADGE STATUT (Moderne)
  const getStatusBadge = (status) => {
    if (status === 'Vérifié') {
      return <span className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full text-xs font-semibold">
        <CheckCircle2 className="w-4 h-4" /> Vérifié
      </span>;
    }
    return <span className="flex items-center gap-1.5 text-yellow-700 bg-yellow-50 border border-yellow-100 px-3 py-1 rounded-full text-xs font-semibold">
      <Clock3 className="w-4 h-4" /> En attente
    </span>;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 text-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4">
              <div className='bg-emerald-100 p-3 rounded-2xl'>
                <Home className="w-8 h-8 text-emerald-600" />
              </div>
              <h1 className="text-3xl font-extrabold text-gray-950">Tableau de bord</h1>
          </div>
          <p className='text-gray-500'>Gérez vos annonces Betna Immo</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Formulaire */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 lg:col-span-1 h-fit sticky top-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-950 flex items-center gap-3">
                  <PlusCircle className="text-emerald-600 w-7 h-7" /> 
                  {editingId ? "Modifier" : "Nouveau Bien"}
                </h2>
                {editingId && (
                    <button onClick={cancelEdit} className="text-gray-400 hover:text-red-500 bg-gray-100 p-2 rounded-full">
                        <X className="w-5 h-5"/>
                    </button>
                )}
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <input type="text" placeholder="Titre (ex: Villa F4)" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300" required />
              
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" placeholder="Quartier, Ville" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-300" />
              </div>
              
              <select value={formData.typeSejour} onChange={e => setFormData({...formData, typeSejour: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-300 bg-white" required>
                <option value="">Sélectionner le type de séjour</option>
                <option value="long">Long séjour (Mensuel)</option>
                <option value="court">Court séjour (Journalier)</option>
              </select>

              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="number" placeholder="Prix (FCFA)" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-300" required />
              </div>
              
              <textarea placeholder="Description détaillée..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl h-24 focus:ring-2 focus:ring-emerald-300" />
              
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <BedDouble className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="number" placeholder="Chambres" value={formData.bedrooms} onChange={e => setFormData({...formData, bedrooms: e.target.value})} className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-300" />
                </div>
                <div className="relative">
                  <Bath className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="number" placeholder="SdB" value={formData.bathrooms} onChange={e => setFormData({...formData, bathrooms: e.target.value})} className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-300" />
                </div>
              </div>
              
              {/* Upload Images */}
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-2xl cursor-pointer border-gray-200 bg-gray-50 hover:bg-emerald-50 hover:border-emerald-300 transition">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                        {uploading ? <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" /> : <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />}
                        <p className="text-sm text-gray-600 font-medium">Glisser des photos</p>
                        <p className="text-xs text-gray-400">PNG, JPG</p>
                    </div>
                    <input type="file" className="hidden" onChange={e => handleImageUpload(e.target.files)} accept="image/*" multiple />
                </label>
              </div>

              {/* Aperçu des images */}
              <div className="grid grid-cols-4 gap-3">
                {imageUrls.map((url, index) => (
                    <div key={index} className="relative group">
                        <img src={url} alt="Aperçu" className="h-16 w-16 object-cover rounded-xl border-2 border-white shadow-md" />
                        <button type="button" onClick={() => removeImage(index)} className="absolute -top-2 -right-2 bg-white text-red-500 rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition">
                            <X size={16} />
                        </button>
                    </div>
                ))}
              </div>

              <button type="submit" disabled={uploading} className={`w-full text-white py-3.5 rounded-xl font-bold transition flex items-center justify-center gap-2 ${editingId ? 'bg-sky-600 hover:bg-sky-700' : 'bg-gray-950 hover:bg-emerald-600'} disabled:bg-gray-400`}>
                {uploading ? <Loader2 className="animate-spin w-5 h-5"/> : (editingId ? "Mettre à jour" : "Publier le bien")}
              </button>
            </form>
          </div>

          {/* Liste des biens */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-950 mb-8 flex items-center gap-3">
              <Building2 className="text-emerald-600 w-7 h-7" /> Mes annonces ({properties.length})
            </h2>
            
            <div className="space-y-6">
              {properties.map(property => (
                <div key={property.id} className="flex flex-col md:flex-row md:items-center justify-between p-5 border border-gray-100 rounded-2xl hover:border-emerald-100 hover:shadow-lg hover:shadow-emerald-50 transition-all gap-5">
                  <div className='flex gap-5 items-center'>
                    <img src={property.imageUrls && property.imageUrls[0] ? property.imageUrls[0] : "https://via.placeholder.com/150"} alt={property.title} className="w-24 h-24 rounded-2xl object-cover shadow-sm" />
                    <div>
                      <h3 className="font-bold text-gray-950 text-lg">{property.title}</h3>
                      <p className="text-sm text-gray-500 flex items-center gap-1.5 mb-2">
                        <MapPin size={14}/> {property.location}
                      </p>
                      
                      <div className='flex flex-wrap gap-2'>
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${property.typeSejour === 'long' ? 'bg-purple-50 text-purple-700 border border-purple-100' : 'bg-orange-50 text-orange-700 border border-orange-100'}`}>
                          {property.typeSejour === 'long' ? <CalendarDays size={14}/> : <CalendarClock size={14}/>}
                          {property.typeSejour === 'long' ? 'Long séjour' : 'Court séjour'}
                        </span>
                        <p className="text-emerald-700 font-bold text-lg">
                          {parseInt(property.price).toLocaleString('fr-FR')} <span className='text-sm text-gray-500'>FCFA {property.typeSejour === 'long' ? '/mois' : '/jour'}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-row md:flex-col items-center md:items-end gap-3 md:gap-2">
                    {getStatusBadge(property.status)}
                    <div className="flex gap-2">
                        <button onClick={() => startEdit(property)} className="text-gray-400 hover:text-sky-600 bg-gray-50 p-2.5 rounded-full" title="Modifier">
                            <Edit3 className="w-5 h-5" />
                        </button>
                        <button onClick={() => deleteProperty(property.id)} className="text-gray-400 hover:text-red-500 bg-gray-50 p-2.5 rounded-full" title="Supprimer">
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                  </div>
                </div>
              ))}
              {properties.length === 0 && (
                <div className='text-center py-16 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200'>
                    <Building2 className='w-16 h-16 text-gray-300 mx-auto mb-4'/>
                    <p className="text-gray-500 text-lg">Aucun bien publié pour le moment.</p>
                    <p className="text-gray-400 text-sm">Utilisez le formulaire pour ajouter votre première annonce.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPropriétaire;