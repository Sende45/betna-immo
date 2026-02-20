import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Ajout de Framer Motion
import PropertyCard from "../components/PropertyCard";
import { Search, ShieldCheck, MapPin, ArrowRight, Building, ArrowUpDown, Star, Users, Clock } from 'lucide-react';
import { db } from '../firebase';
import { collection, query, onSnapshot } from 'firebase/firestore'; 
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logementImage from "../assets/logement.png"; 

// Variantes pour les animations de liste
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
};

function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showOnlyVerified, setShowOnlyVerified] = useState(false);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState('newest'); 

  useEffect(() => {
    const q = query(collection(db, "biens"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setProperties(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleCtaClick = () => {
    user ? navigate('/dashboard-proprio') : navigate('/login');
  };

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          property.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVerified = !showOnlyVerified || property.status === 'Vérifié';
    return matchesSearch && matchesVerified;
  }).sort((a, b) => {
    if (sortOrder === 'priceAsc') return a.price - b.price;
    if (sortOrder === 'priceDesc') return b.price - a.price;
    return 0;
  });

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* 🏙️ Hero Section */}
      <header className="relative bg-white pt-10 pb-24 lg:pt-20 lg:pb-32 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 text-center lg:text-left z-10"
          >
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-bold mb-6 border border-emerald-100 shadow-sm"
            >
              <Star className="h-4 w-4 fill-emerald-500 text-emerald-500" />
              <span>N°1 de l'immobilier fiable au Tchad</span>
            </motion.div>
            
            <h1 className="text-5xl md:text-6xl lg:text-8xl font-black text-slate-950 mb-6 leading-tight tracking-tight">
              Votre chez-vous, <br />
              <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                en toute confiance
              </span>.
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Betna Immo redéfinit l'immobilier au Tchad. Trouvez des logements certifiés et sécurisés en quelques clics.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCtaClick}
                className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-emerald-200 flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors"
              >
                Proposer un bien <ArrowRight className="h-5 w-5" />
              </motion.button>
              <motion.a 
                href="#listings"
                whileHover={{ backgroundColor: "#f8fafc" }}
                className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-bold text-lg border border-slate-200 flex items-center justify-center"
              >
                Explorer les biens
              </motion.a>
            </div>
          </motion.div>

          {/* Image de droite avec animation */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="flex-1 relative w-full group"
          >
            <div className="absolute -inset-4 bg-emerald-400/20 blur-3xl rounded-full group-hover:bg-emerald-400/30 transition-all duration-700"></div>
            <img 
              src={logementImage}
              alt="Immobilier Tchad"
              className="relative rounded-[2.5rem] shadow-2xl w-full aspect-[4/3] object-cover border-8 border-white"
            />
            {/* Badge flottant interactif */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="absolute -bottom-8 -left-8 bg-white p-6 rounded-3xl shadow-2xl border border-slate-50 hidden md:flex items-center gap-4"
            >
              <div className="bg-emerald-500 p-3 rounded-2xl shadow-lg shadow-emerald-200">
                <ShieldCheck className="text-white h-8 w-8" />
              </div>
              <div>
                <p className="font-black text-xl text-slate-900 leading-none">100% Vérifié</p>
                <p className="text-slate-500 font-medium">Sécurité garantie</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </header>

      {/* 🚀 Barre de recherche avec Glassmorphism */}
      <section className="container mx-auto px-4 -mt-12 relative z-30">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/80 backdrop-blur-xl p-3 rounded-[2rem] shadow-2xl border border-white/50 flex flex-col lg:flex-row gap-3"
        >
          <div className="relative flex-grow group">
            <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-500 transition-colors group-focus-within:text-emerald-600" />
            <input 
              type="text"
              placeholder="Dans quelle zone cherchez-vous ?"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-5 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-emerald-500/20 text-lg transition-all"
            />
          </div>
          
          <motion.button 
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowOnlyVerified(!showOnlyVerified)}
            className={`px-8 py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${
              showOnlyVerified ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <ShieldCheck className="h-6 w-6" />
            {showOnlyVerified ? 'Vérifiés uniquement' : 'Tous les logements'}
          </motion.button>
        </motion.div>
      </section>

      {/* ✨ Features de confiance */}
      <section className="container mx-auto px-4 py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: ShieldCheck, title: "Inspection physique", desc: "Chaque bien est visité par nos agents." },
            { icon: Users, title: "Propriétaires certifiés", desc: "Nous vérifions l'identité des loueurs." },
            { icon: Clock, title: "Support 24/7", desc: "Une assistance locale toujours disponible." },
          ].map((f, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all"
            >
              <f.icon className="h-14 w-14 text-emerald-600 bg-emerald-50 p-3 rounded-2xl mb-6" />
              <h4 className="text-2xl font-bold mb-2">{f.title}</h4>
              <p className="text-slate-500 text-lg leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 🏠 Grid de Résultats */}
      <main id="listings" className="container mx-auto px-4 pb-32">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-16">
          <div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-950 mb-4 flex items-center gap-4">
              Dernières pépites <Building className="text-emerald-600" />
            </h2>
            <p className="text-slate-500 text-lg">Découvrez les opportunités du jour sélectionnées pour vous.</p>
          </div>
          
          <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 flex items-center gap-3 shadow-sm">
            <ArrowUpDown className="h-5 w-5 text-slate-400" />
            <select 
              value={sortOrder} 
              onChange={(e) => setSortOrder(e.target.value)}
              className="bg-transparent font-bold text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="newest">Les plus récents</option>
              <option value="priceAsc">Prix : Croissant</option>
              <option value="priceDesc">Prix : Décroissant</option>
            </select>
          </div>
        </div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          {loading ? (
            Array(4).fill(0).map((_, i) => <div key={i} className="h-80 bg-slate-100 animate-pulse rounded-3xl" />)
          ) : (
            <AnimatePresence>
              {filteredProperties.map(property => (
                <motion.div key={property.id} variants={itemVariants} layout>
                  <PropertyCard property={property} />
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </motion.div>

        {!loading && filteredProperties.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-32 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
            <Building className="h-20 w-20 text-slate-200 mx-auto mb-6" />
            <p className="text-2xl font-bold text-slate-400">Aucun bien trouvé pour cette recherche</p>
          </motion.div>
        )}
      </main>

      {/* 📞 Footer CTA Premium */}
      <section className="px-4 pb-12">
        <motion.div 
          whileHover={{ scale: 1.01 }}
          className="container mx-auto bg-slate-950 rounded-[3rem] p-12 lg:p-24 relative overflow-hidden text-center"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 blur-[100px] rounded-full"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/10 blur-[100px] rounded-full"></div>
          
          <h3 className="text-4xl md:text-6xl font-black text-white mb-8 relative">Prêt à louer votre bien ?</h3>
          <p className="text-slate-400 text-xl max-w-2xl mx-auto mb-12 relative leading-relaxed">
            Rejoignez des centaines de propriétaires qui font confiance à Betna pour trouver des locataires qualifiés et sérieux.
          </p>
          <motion.button 
            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(16, 185, 129, 0.2)" }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCtaClick}
            className="relative bg-emerald-500 text-white px-12 py-5 rounded-[2rem] font-black text-xl flex items-center gap-3 mx-auto"
          >
            Inscrire mon bien <ArrowRight />
          </motion.button>
        </motion.div>
      </section>
    </div>
  );
}

export default Home;