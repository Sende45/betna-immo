import React, { useState, useEffect } from 'react';
import PropertyCard from "../components/PropertyCard";
// ✅ Importation des icônes de lucide-react
import { Search, ShieldCheck, Building, Loader2, CalendarDays, CalendarClock } from 'lucide-react';
// 💡 IMPORT FIREBASE
import { db } from '../firebase';
import { collection, query, onSnapshot } from 'firebase/firestore';

function Catalogue() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showOnlyVerified, setShowOnlyVerified] = useState(false);
  // 🆕 ÉTAT POUR LE FILTRE DE TYPE DE SÉJOUR
  const [typeSejour, setTypeSejour] = useState('tout'); 
  // 💡 ÉTATS POUR LES DONNÉES RÉELLES
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // 💡 CHARGER TOUS LES BIENS DEPUIS FIRESTORE EN TEMPS RÉEL
  useEffect(() => {
    // 🛠️ MODIF : Requête sur la collection 'biens' (au lieu de 'properties')
    const q = query(collection(db, "biens"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      // 💡 On récupère bien l'ID ici avec doc.id
      setProperties(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Filtrage intelligent basé sur les données réelles
  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          property.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    // 💡 Filtre selon le statut renseigné dans Firestore
    // 🛠️ Modifié pour n'agir que si le bouton est activé
    const matchesVerified = showOnlyVerified ? property.status === 'Vérifié' : true;
    
    // 🆕 Filtre selon le type de séjour
    const matchesType = typeSejour === 'tout' || property.typeSejour === typeSejour;
    
    return matchesSearch && matchesVerified && matchesType;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* 🛠️ Header de page */}
        <div className="flex items-center gap-3 mb-8">
            <Building className="w-9 h-9 text-emerald-600" />
            <h1 className="text-3xl font-bold text-gray-900">Catalogue des biens</h1>
        </div>

        {/* 🔍 Barre de recherche et filtres */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8">
            <div className='flex flex-col md:flex-row gap-4 mb-4'>
                <div className="relative flex-grow">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                    <input 
                    type="text"
                    placeholder="Rechercher par ville, quartier, titre..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-5 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                    />
                </div>
                
                <button 
                    onClick={() => setShowOnlyVerified(!showOnlyVerified)}
                    className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${showOnlyVerified ? 'bg-emerald-600 text-white' : 'bg-white text-gray-800 hover:bg-gray-100 border'}`}
                >
                    <ShieldCheck className="h-5 w-5" />
                    {showOnlyVerified ? '✓ Vérifiés' : 'Logements vérifiés'}
                </button>
            </div>

            {/* 🆕 FILTRES DE TYPE DE SÉJOUR */}
            <div className="flex gap-2 pt-4 border-t border-gray-100">
                {[
                    {id: 'tout', label: 'Tous'}, 
                    {id: 'long', label: 'Long séjour', icon: CalendarDays}, 
                    {id: 'court', label: 'Court séjour', icon: CalendarClock}
                ].map(type => (
                    <button 
                        key={type.id}
                        onClick={() => setTypeSejour(type.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition ${typeSejour === type.id ? 'bg-emerald-50 text-emerald-700 ring-2 ring-emerald-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                        {type.icon && <type.icon size={16} />}
                        {type.label}
                    </button>
                ))}
            </div>
        </div>
        
        {/* 🏠 Grille de résultats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            <div className="text-center py-16 col-span-full flex flex-col items-center gap-4">
                <Loader2 className="h-10 w-10 text-emerald-600 animate-spin" />
                <p className="text-gray-500">Chargement du catalogue...</p>
            </div>
          ) : filteredProperties.length > 0 ? (
            filteredProperties.map(property => (
              // 💡 On passe l'objet property complet (avec son id) au composant
              <PropertyCard key={property.id} property={property} />
            ))
          ) : (
            <div className="text-center py-16 col-span-full bg-white rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-gray-500 text-lg">Aucun bien ne correspond à vos critères de recherche.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Catalogue;