import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Pour les animations fluides
import PropertyCard from "../components/PropertyCard";
import { Search, ShieldCheck, Building, Loader2, CalendarDays, CalendarClock, LayoutGrid, FilterX } from 'lucide-react';
import { db } from '../firebase';
import { collection, query, onSnapshot } from 'firebase/firestore';

// Variantes pour l'entrée des cartes
const cardVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
};

function Catalogue() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showOnlyVerified, setShowOnlyVerified] = useState(false);
  const [typeSejour, setTypeSejour] = useState('tout'); 
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "biens"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setProperties(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          property.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVerified = showOnlyVerified ? property.status === 'Vérifié' : true;
    const matchesType = typeSejour === 'tout' || property.typeSejour === typeSejour;
    return matchesSearch && matchesVerified && matchesType;
  });

  return (
    /* ✅ AJOUT : pt-24 (ou pt-32) pour éviter que le Header fixe ne cache le haut du catalogue */
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 pt-24 md:pt-32 text-slate-900">
      <div className="max-w-7xl mx-auto">
        
        {/* 🛠️ Header de page Premium */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          /* ✅ AJOUT : z-10 pour rester sous le Header principal et sous la barre de recherche sticky */
          className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm shadow-slate-200/50 relative z-10"
        >
          <div className="flex items-center gap-6">
            <div className='bg-emerald-500 p-4 rounded-3xl shadow-lg shadow-emerald-200'>
              <LayoutGrid className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-slate-950 tracking-tight">Catalogue</h1>
              <p className='text-slate-500 font-medium'>Explorez nos {properties.length} propriétés d'exception</p>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-sm font-bold text-slate-600 uppercase tracking-wider">Mise à jour en direct</span>
          </div>
        </motion.div>

        {/* 🔍 Zone de Recherche & Filtres Style "Glass" */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          /* ✅ MODIF : top-20 ou top-24 selon la taille de ton header pour un sticky parfait sans collision */
          className="bg-white/70 backdrop-blur-xl p-2 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-white mb-12 sticky top-20 md:top-24 z-40"
        >
          <div className='flex flex-col lg:flex-row gap-2'>
            <div className="relative flex-grow group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
              <input 
                type="text"
                placeholder="Où souhaitez-vous habiter ?"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-16 pr-6 py-5 rounded-[2rem] bg-transparent border-none focus:ring-0 text-lg font-medium placeholder:text-slate-400"
              />
            </div>

            <div className="flex p-2 gap-2 bg-slate-100/50 rounded-[2rem]">
              {[
                {id: 'tout', label: 'Tous', icon: null}, 
                {id: 'long', label: 'Long séjour', icon: CalendarDays}, 
                {id: 'court', label: 'Court séjour', icon: CalendarClock}
              ].map(type => (
                <button 
                  key={type.id}
                  onClick={() => setTypeSejour(type.id)}
                  className={`px-6 py-3 rounded-full text-sm font-bold flex items-center gap-2 transition-all duration-300 ${
                    typeSejour === type.id 
                    ? 'bg-white text-emerald-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {type.icon && <type.icon size={16} />}
                  {type.label}
                </button>
              ))}
            </div>
            
            <button 
              onClick={() => setShowOnlyVerified(!showOnlyVerified)}
              className={`px-8 py-5 rounded-[2rem] text-sm font-black transition-all flex items-center justify-center gap-3 ${
                showOnlyVerified 
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' 
                : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
            >
              <ShieldCheck className="h-5 w-5" />
              {showOnlyVerified ? 'VÉRIFIÉS ✓' : 'VOIR VÉRIFIÉS'}
            </button>
          </div>
        </motion.div>
        
        {/* 🏠 Grille avec AnimatePresence */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <AnimatePresence mode='popLayout'>
            {loading ? (
              <motion.div key="loader" className="col-span-full py-40 flex flex-col items-center gap-6">
                <Loader2 className="h-16 w-16 text-emerald-500 animate-spin" />
                <p className="text-slate-400 text-xl font-medium animate-pulse">Chargement de Betna Immo...</p>
              </motion.div>
            ) : filteredProperties.length > 0 ? (
              filteredProperties.map(property => (
                <motion.div 
                  key={property.id}
                  layout 
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  whileHover={{ y: -10 }}
                  className="h-full"
                >
                  <PropertyCard property={property} />
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="col-span-full py-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-200 text-center"
              >
                <FilterX className="h-20 w-20 text-slate-200 mx-auto mb-6" />
                <p className="text-2xl font-black text-slate-400">Aucun bien ne correspond.</p>
                <button 
                  onClick={() => {setSearchTerm(''); setTypeSejour('tout'); setShowOnlyVerified(false);}}
                  className="mt-4 text-emerald-600 font-bold hover:underline"
                >
                  Réinitialiser les filtres
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

export default Catalogue;