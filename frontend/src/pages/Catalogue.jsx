import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { Search, ShieldCheck, Sparkles, SlidersHorizontal, Loader2 } from 'lucide-react';
import PropertyCard from "../components/PropertyCard";
import api from "../api/axios"; // ✅ MODIF : Import de l'instance axios centralisée

function Catalogue() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showOnlyVerified, setShowOnlyVerified] = useState(false);
  const [typeSejour, setTypeSejour] = useState('tout');
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 💡 L'URL de base est maintenant gérée dans src/api/axios.js

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        
        // ✅ MODIF : Utilisation de l'instance API automatique
        const response = await api.get('/biens');
        const data = response.data; // Axios met les données dans .data
        
        // MongoDB retourne souvent _id au lieu de id, on normalise ici si besoin
        const normalizedData = data.map(item => ({
          ...item,
          id: item._id || item.id 
        }));
        
        setProperties(normalizedData);
      } catch (err) {
        console.error("Erreur Backend:", err);
        setError("Impossible de charger le catalogue. Vérifiez que votre serveur est lancé.");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const filteredProperties = properties.filter(p => {
    const titleMatch = p.title?.toLowerCase().includes(searchTerm.toLowerCase()) || '';
    const locationMatch = p.location?.toLowerCase().includes(searchTerm.toLowerCase()) || '';
    const matchesSearch = titleMatch || locationMatch;
    
    const matchesVerified = showOnlyVerified ? p.status === 'Vérifié' : true;
    const matchesType = typeSejour === 'tout' || p.typeSejour === typeSejour;
    
    return matchesSearch && matchesVerified && matchesType;
  });

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 selection:bg-emerald-100">
      
      {/* --- HERO SECTION --- */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto text-center mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-widest mb-6"
          >
            <Sparkles size={14} />
            {loading ? "Recherche de pépites..." : `${properties.length} propriétés disponibles`}
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-950 tracking-tight mb-4">
            Trouvez votre <span className="text-emerald-600">havre de paix</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Une sélection rigoureuse de propriétés vérifiées sur MongoDB Atlas.
          </p>
        </div>

        {/* --- BARRE DE FILTRES --- */}
        <div className="max-w-5xl mx-auto sticky top-24 z-50">
          <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 shadow-2xl shadow-slate-200/50 rounded-[2.5rem] p-3 flex flex-col md:flex-row items-center gap-3">
            
            <div className="relative flex-grow w-full">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text"
                placeholder="Rechercher par ville ou quartier..."
                className="w-full pl-14 pr-4 py-4 rounded-full bg-slate-50 border-none focus:ring-2 focus:ring-emerald-500/20 font-medium transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex bg-slate-100 p-1 rounded-full w-full md:w-auto">
              {['tout', 'long', 'court'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTypeSejour(t)}
                  className={`flex-1 md:flex-none px-6 py-3 rounded-full text-sm font-bold transition-all ${
                    typeSejour === t ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {t === 'tout' ? 'Tous' : t === 'long' ? 'Long' : 'Court'}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowOnlyVerified(!showOnlyVerified)}
              className={`whitespace-nowrap px-6 py-4 rounded-full text-sm font-bold flex items-center gap-2 transition-all ${
                showOnlyVerified 
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' 
                : 'bg-slate-950 text-white hover:bg-slate-800'
              }`}
            >
              <ShieldCheck size={18} />
              {showOnlyVerified ? 'Vérifiés uniquement' : 'Tous les biens'}
            </button>
          </div>
        </div>
      </section>

      {/* --- GRILLE DE RÉSULTATS --- */}
      <main className="max-w-7xl mx-auto px-6 pb-24">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-emerald-500 mb-4" size={48} />
            <p className="text-slate-500 font-medium text-lg">Chargement de votre catalogue MongoDB...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-red-50 rounded-3xl border border-red-100 max-w-2xl mx-auto">
            <p className="text-red-600 font-bold mb-2">Oups !</p>
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <LayoutGroup>
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
              <AnimatePresence mode='popLayout'>
                {filteredProperties.map((property) => (
                  <motion.div
                    key={property.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <PropertyCard property={property} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </LayoutGroup>
        )}

        {/* État vide */}
        {!loading && !error && filteredProperties.length === 0 && (
          <div className="py-20 text-center">
            <div className="inline-flex p-6 bg-slate-50 rounded-full mb-4">
              <SlidersHorizontal className="text-slate-300" size={40} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Aucun résultat trouvé</h3>
            <p className="text-slate-500">Essayez d'ajuster vos filtres de recherche.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default Catalogue;