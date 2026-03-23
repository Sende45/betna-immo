import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // <-- AJOUTÉ : Pour lire l'ID dans l'URL
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { Search, ShieldCheck, Sparkles, SlidersHorizontal, Loader2 } from 'lucide-react';
import PropertyCard from "../components/PropertyCard";
import api from "../api/axios"; 

function Catalogue() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showOnlyVerified, setShowOnlyVerified] = useState(false);
  const [typeSejour, setTypeSejour] = useState('tout');
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- LOGIQUE DE SCROLL (MODIF AJOUTÉE) ---
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const targetId = queryParams.get('id');

  useEffect(() => {
    if (!loading && targetId) {
      const timer = setTimeout(() => {
        const element = document.getElementById(`property-${targetId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 800); // Délai pour laisser le temps au layout de se stabiliser
      return () => clearTimeout(timer);
    }
  }, [loading, targetId]);
  // ------------------------------------------

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await api.get('/biens');
        const data = response.data; 
        
        // Normalisation MongoDB (_id -> id)
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
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-emerald-100">
      
      {/* --- HERO SECTION --- */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto text-center mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-emerald-100"
          >
            <Sparkles size={14} />
            {loading ? "Scan de la base..." : `${properties.length} pépites dénichées`}
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-950 tracking-tight mb-4">
            Trouvez votre <span className="text-emerald-600">havre de paix</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">
            Une sélection rigoureuse de propriétés vérifiées à Abidjan et partout en Côte d'Ivoire.
          </p>
        </div>

        {/* --- BARRE DE FILTRES STICKY --- */}
        <div className="max-w-5xl mx-auto sticky top-24 z-50">
          <div className="catalogue-glass border border-white/40 shadow-2xl shadow-slate-200/50 rounded-[2.5rem] p-3 flex flex-col md:flex-row items-center gap-3">
            
            <div className="relative flex-grow w-full">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text"
                placeholder="Rechercher par ville ou quartier..."
                className="w-full pl-14 pr-4 py-4 rounded-full bg-slate-50/50 border-none focus:ring-2 focus:ring-emerald-500/20 font-semibold transition-all placeholder:text-slate-400 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex bg-slate-100/80 p-1 rounded-full w-full md:w-auto">
              {['tout', 'long', 'court'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTypeSejour(t)}
                  className={`flex-1 md:flex-none px-6 py-3 rounded-full text-xs font-black uppercase tracking-wider transition-all ${
                    typeSejour === t ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {t === 'tout' ? 'Tous' : t === 'long' ? 'Long' : 'Court'}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowOnlyVerified(!showOnlyVerified)}
              className={`whitespace-nowrap px-8 py-4 rounded-full text-sm font-black flex items-center gap-2 transition-all ${
                showOnlyVerified 
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' 
                : 'bg-slate-950 text-white hover:bg-emerald-600'
              }`}
            >
              <ShieldCheck size={18} />
              {showOnlyVerified ? 'Vérifiés' : 'Tous les biens'}
            </button>
          </div>
        </div>
      </section>

      {/* --- GRILLE DE RÉSULTATS --- */}
      <main className="max-w-7xl mx-auto px-6 pb-24">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-emerald-500 mb-4" size={48} />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Synchronisation MongoDB...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-red-50 rounded-[3rem] border border-red-100 max-w-2xl mx-auto">
            <p className="text-red-600 font-black mb-2 uppercase tracking-tighter">Erreur de connexion</p>
            <p className="text-red-500 font-medium">{error}</p>
          </div>
        ) : (
          <LayoutGroup>
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
              <AnimatePresence mode='popLayout'>
                {filteredProperties.map((property) => (
                  <motion.div
                    id={`property-${property.id}`} // <-- AJOUTÉ : Pour cibler l'élément
                    key={property.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1,
                      // MODIF : Effet visuel si c'est le bien ciblé
                      boxShadow: targetId === property.id ? "0 0 0 4px #10b981" : "none",
                      backgroundColor: targetId === property.id ? "#f0fdf4" : "transparent",
                      borderRadius: targetId === property.id ? "2.5rem" : "0px"
                    }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
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
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="py-32 text-center bg-white rounded-[3rem] border border-slate-100 shadow-sm"
          >
            <div className="inline-flex p-8 bg-slate-50 rounded-full mb-6">
              <SlidersHorizontal className="text-slate-200" size={48} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">Aucune propriété trouvée</h3>
            <p className="text-slate-400 font-medium">Ajustez vos filtres pour explorer d'autres opportunités à Abidjan.</p>
          </motion.div>
        )}
      </main>
    </div>
  );
}

export default Catalogue;