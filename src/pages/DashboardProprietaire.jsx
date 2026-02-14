import React, { useState, useEffect } from 'react';
import { PlusCircle, Building2, CheckCircle2, Clock3, Trash2, Home, UploadCloud, Loader2, Edit3, X, CalendarDays, CalendarClock } from 'lucide-react';
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
    typeSejour: '' // 🆕 Nouvel état pour le type de séjour
  });
  
  const [editingId, setEditingId] = useState(null);
  
  // 💡 ÉTATS POUR LES IMAGES (Tableau)
  const [imageUrls, setImageUrls] = useState([]); // Tableau d'images
  const [uploading, setUploading] = useState(false);

  // ⚠️ REMPLACE PAR TA CLÉ API IMGBB ⚠️
  const IMGBB_API_KEY = "35bb74e2910fc59f0f0e4e2ad6c87935";

  useEffect(() => {
    if (!user) return;
    // Requête Firestore pour ne lister que les biens du propriétaire connecté
    const q = query(collection(db, "biens"), where("proprioId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setProperties(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [user]);

  // 💡 FONCTION UPLOAD IMGBB (Gère plusieurs images)
  const handleImageUpload = async (files) => {
    if (!files.length) return;
    setUploading(true);

    const newUrls = [];

    // Boucle pour uploader chaque image
    for (let file of files) {
        const formDataUpload = new FormData();
        formDataUpload.append('image', file);

        try {
          const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
            method: 'POST',
            body: formDataUpload,
          });
          const data = await response.json();
          if (data.success) {
            newUrls.push(data.data.url);
          } else {
            alert("Erreur upload image : " + file.name);
          }
        } catch (error) {
          console.error(error);
        }
    }

    // Ajoute les nouvelles URLs au tableau existant
    setImageUrls([...imageUrls, ...newUrls]);
    setUploading(false);
  };

  // 💡 SOUMETTRE LE FORMULAIRE
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.price || !formData.typeSejour || !user || imageUrls.length === 0) {
        alert("Veuillez remplir le titre, le prix, le type de séjour, et uploader au moins une image.");
        return;
    }
    
    try {
      setUploading(true);
      
      const propertyData = {
        ...formData,
        imageUrls: imageUrls, // Stocke le tableau d'images
        proprioId: user.uid,
        updatedAt: new Date()
      };

      if (editingId) {
        await updateDoc(doc(db, "biens", editingId), propertyData);
        alert("Bien mis à jour !");
        setEditingId(null);
      } else {
        await addDoc(collection(db, "biens"), {
          ...propertyData,
          status: "En attente", // Statut initial 
          createdAt: new Date()
        });
        alert("Bien ajouté !");
      }

      // Réinitialisation du formulaire
      setFormData({ title: '', location: '', price: '', description: '', bedrooms: '', bathrooms: '', agentName: '', agentPhone: '', agentEmail: '', typeSejour: '' });
      setImageUrls([]); 
      
    } catch (error) {
      console.error(error);
      alert("Erreur base de données");
    } finally {
      setUploading(false);
    }
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

  // Fonction pour supprimer une image de la prévisualisation
  const removeImage = (indexToRemove) => {
    setImageUrls(imageUrls.filter((_, index) => index !== indexToRemove));
  };

  const deleteProperty = async (id) => {
    if(!window.confirm("Êtes-vous sûr de vouloir supprimer ce bien ?")) return;
    try { await deleteDoc(doc(db, "biens", id)); } catch (error) { console.error(error); }
  };

  // 💡 AFFICHAGE BADGE STATUT 
  const getStatusBadge = (status) => {
    if (status === 'Vérifié') {
      return <span className="flex items-center gap-1.5 text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full text-xs font-semibold">
        <CheckCircle2 className="w-4 h-4" /> Vérifié
      </span>;
    }
    return <span className="flex items-center gap-1.5 text-yellow-700 bg-yellow-100 px-3 py-1 rounded-full text-xs font-semibold">
      <Clock3 className="w-4 h-4" /> En attente
    </span>;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
            <Home className="w-9 h-9 text-emerald-600" />
            <h1 className="text-3xl font-bold text-gray-900">Tableau de bord Propriétaire</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Formulaire */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 md:col-span-1 h-fit sticky top-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <PlusCircle className="text-emerald-600" /> 
                  {editingId ? "Modifier le bien" : "Ajouter un bien"}
                </h2>
                {editingId && (
                    <button onClick={cancelEdit} className="text-gray-400 hover:text-red-500">
                        <X className="w-5 h-5"/>
                    </button>
                )}
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="Titre (ex: Villa F4)" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-300" required />
              <input type="text" placeholder="Quartier/Ville" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-300" />
              
              {/* 🆕 NOUVEAU SELECTOR TYPE DE SEJOUR */}
              <select 
                value={formData.typeSejour} 
                onChange={e => setFormData({...formData, typeSejour: e.target.value})} 
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-300 bg-white"
                required
              >
                <option value="">Sélectionner le type de séjour</option>
                <option value="long">Long séjour (Mensuel)</option>
                <option value="court">Court séjour (Journalier/Hebdo)</option>
              </select>

              <input type="number" placeholder="Prix (FCFA)" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-300" required />
              
              <textarea placeholder="Description détaillée" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 border rounded-lg h-24 focus:ring-2 focus:ring-emerald-300" />
              
              <div className="grid grid-cols-2 gap-4">
                <input type="number" placeholder="Chambres" value={formData.bedrooms} onChange={e => setFormData({...formData, bedrooms: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-300" />
                <input type="number" placeholder="SdB" value={formData.bathrooms} onChange={e => setFormData({...formData, bathrooms: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-300" />
              </div>
              
              <input type="text" placeholder="Nom de l'agent" value={formData.agentName} onChange={e => setFormData({...formData, agentName: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-300" />
              <input type="tel" placeholder="Téléphone de l'agent" value={formData.agentPhone} onChange={e => setFormData({...formData, agentPhone: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-300" />
              <input type="email" placeholder="Email de l'agent" value={formData.agentEmail} onChange={e => setFormData({...formData, agentEmail: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-300" />

              {/* 💡 UPLOAD MULTIPLE IMAGES */}
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer border-gray-300 bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {uploading ? <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" /> : <UploadCloud className="w-8 h-8 text-gray-400" />}
                        <p className="text-sm text-gray-500">Ajouter des photos (png, jpg)</p>
                    </div>
                    <input type="file" className="hidden" onChange={e => handleImageUpload(e.target.files)} accept="image/*" multiple />
                </label>
              </div>

              {/* Aperçu des images avec possibilité de supprimer */}
              <div className="grid grid-cols-4 gap-2">
                {imageUrls.map((url, index) => (
                    <div key={index} className="relative">
                        <img src={url} alt="Aperçu" className="h-16 w-16 object-cover rounded-lg" />
                        <button type="button" onClick={() => removeImage(index)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1">
                            <X size={14} />
                        </button>
                    </div>
                ))}
              </div>

              <button type="submit" disabled={uploading} className={`w-full text-white py-2.5 rounded-lg font-semibold transition ${editingId ? 'bg-sky-600 hover:bg-sky-700' : 'bg-emerald-600 hover:bg-emerald-700'} disabled:bg-gray-400`}>
                {uploading ? 'En cours...' : editingId ? "Mettre à jour" : "Soumettre le bien"}
              </button>
            </form>
          </div>

          {/* Liste des biens */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 md:col-span-2">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <Building2 className="text-emerald-600" /> Mes biens
            </h2>
            
            <div className="space-y-4">
              {properties.map(property => (
                <div key={property.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-100 rounded-xl hover:shadow-sm transition gap-4">
                  <div className='flex gap-4 items-center'>
                    {/* Affiche la première image */}
                    <img src={property.imageUrls && property.imageUrls[0] ? property.imageUrls[0] : "https://via.placeholder.com/150"} alt={property.title} className="w-20 h-20 rounded-lg object-cover" />
                    <div>
                      <h3 className="font-semibold text-gray-800 text-lg">{property.title}</h3>
                      <p className="text-sm text-gray-500">{property.location}</p>
                      
                      {/* 🆕 AFFICHAGE TYPE DE SEJOUR */}
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full mt-1 ${property.typeSejour === 'long' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'}`}>
                        {property.typeSejour === 'long' ? <CalendarDays size={14}/> : <CalendarClock size={14}/>}
                        {property.typeSejour === 'long' ? 'Long séjour' : 'Court séjour'}
                      </span>

                      <p className="text-emerald-700 font-bold mt-1 text-lg">{parseInt(property.price).toLocaleString('fr-FR')} FCFA{property.typeSejour === 'long' ? '/mois' : ''}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {getStatusBadge(property.status)}
                    <div className="flex gap-2">
                        <button onClick={() => startEdit(property)} className="text-gray-400 hover:text-sky-600 flex items-center gap-1 text-sm">
                            <Edit3 className="w-4 h-4" /> Modifier
                        </button>
                        <button onClick={() => deleteProperty(property.id)} className="text-gray-400 hover:text-red-500 flex items-center gap-1 text-sm">
                            <Trash2 className="w-4 h-4" /> Supprimer
                        </button>
                    </div>
                  </div>
                </div>
              ))}
              {properties.length === 0 && <p className="text-center text-gray-500 py-10">Aucun bien ajouté.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPropriétaire;