import React, { useState, useEffect } from 'react';
import PropertyCard from "../components/PropertyCard";
// ✅ Importation des icônes de lucide-react
import { Search, ShieldCheck, Building, Loader2, CalendarDays, CalendarClock, LayoutGrid } from 'lucide-react';
// 💡 IMPORT FIREBASE
import { db } from '../firebase';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';

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
    // 🛠️ MODIF : Requête avec tri par date de création (nécessite un index dans Firestore si non trié par défaut)
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
    const matchesVerified = showOnlyVerified ? property.status === 'Vérifié' : true;
    
    // 🆕 Filtre selon le type de séjour
    const matchesType = typeSejour === 'tout' || property.typeSejour === typeSejour;
    
    return matchesSearch && matchesVerified && matchesType;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 text-gray-900">
      <div className="max-w-7xl mx-auto">
        
        {/* 🛠️ Header de page Moderne */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4">
              <div className='bg-emerald-100 p-3 rounded-2xl'>
                <LayoutGrid className="w-8 h-8 text-emerald-600" />
              </div>
              <h1 className="text-3xl font-extrabold text-gray-950">Catalogue</h1>
          </div>
          <p className='text-gray-500'>Trouvez votre prochain logement</p>
        </div>

        {/* 🔍 Barre de recherche et filtres */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-8">
            <div className='flex flex-col md:flex-row gap-4 mb-6'>
                <div className="relative flex-grow">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input 
                    type="text"
                    placeholder="Quartier, ville, titre..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-5 py-3.5 rounded-full border border-gray-100 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-300 text-lg"
                    />
                </div>
                
                <button 
                    onClick={() => setShowOnlyVerified(!showOnlyVerified)}
                    className={`px-8 py-3.5 rounded-full text-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${showOnlyVerified ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                >
                    <ShieldCheck className="h-5 w-5" />
                    {showOnlyVerified ? '✓ Vérifiés' : 'Biens Vérifiés'}
                </button>
            </div>

            {/* 🆕 FILTRES DE TYPE DE SÉJOUR */}
            <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-100">
                {[
                    {id: 'tout', label: 'Tous'}, 
                    {id: 'long', label: 'Long séjour', icon: CalendarDays}, 
                    {id: 'court', label: 'Court séjour', icon: CalendarClock}
                ].map(type => (
                    <button 
                        key={type.id}
                        onClick={() => setTypeSejour(type.id)}
                        className={`px-5 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2 transition duration-300 ${typeSejour === type.id ? 'bg-gray-950 text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                        {type.icon && <type.icon size={18} className={typeSejour === type.id ? 'text-emerald-400' : 'text-emerald-600'} />}
                        {type.label}
                    </button>
                ))}
            </div>
        </div>
        
        {/* 🏠 Grille de résultats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {loading ? (
            <div className="text-center py-20 col-span-full flex flex-col items-center gap-4">
                <Loader2 className="h-12 w-12 text-emerald-600 animate-spin" />
                <p className="text-gray-500 text-lg">Chargement du catalogue...</p>
            </div>
          ) : filteredProperties.length > 0 ? (
            filteredProperties.map(property => (
              // 💡 On passe l'objet property complet (avec son id) au composant
              <PropertyCard key={property.id} property={property} />
            ))
          ) : (
            <div className="text-center py-20 col-span-full bg-white rounded-3xl border border-gray-100 shadow-sm">
              <Building className="h-16 w-16 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-600 text-xl font-semibold">Aucun résultat trouvé.</p>
              <p className="text-gray-500 mt-2">Essayez de modifier vos filtres ou votre recherche.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Catalogue;