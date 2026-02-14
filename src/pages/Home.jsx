import React, { useState, useEffect } from 'react';
import PropertyCard from "../components/PropertyCard";
import { Search, ShieldCheck, Zap, ArrowRight, Building, Loader2 } from 'lucide-react';
import { db } from '../firebase';
// 🛠️ MODIF : Import de doc, updateDoc si besoin de changer le statut plus tard
import { collection, query, onSnapshot } from 'firebase/firestore';                
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [showOnlyVerified, setShowOnlyVerified] = useState(false);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // 💡 CHARGER LES BIENS DEPUIS FIRESTORE EN TEMPS RÉEL
  useEffect(() => {
    // 🛠️ MODIF : On pointe vers la collection 'biens' au lieu de 'properties'
    const q = query(collection(db, "biens"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setProperties(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleCtaClick = () => {
    if (user) {
      navigate('/dashboard-proprio');
    } else {
      navigate('/login');
    }
  };

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          property.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    // 💡 Filtre selon le statut renseigné dans Firestore
    const matchesVerified = !showOnlyVerified || property.status === 'Vérifié';
    
    return matchesSearch && matchesVerified;
  });

  return (
    <div className="min-h-screen bg-white">
      {/* 🏙️ Hero Section */}
      <header className="relative bg-gray-900 border-b border-gray-100">
        <div className="absolute inset-0 opacity-40">
          <img 
            src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1920" 
            alt="Immobilier Tchad" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative container mx-auto px-6 py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-1.5 rounded-full text-sm font-semibold mb-6 shadow-inner">
            <Zap className="h-4 w-4" />
            <span>Immobilier fiable au Tchad</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
            Votre futur <span className="text-emerald-400">chez-vous au Tchad</span>,<br /> en toute confiance.
          </h1>
          <p className="text-xl text-gray-200 mb-10 max-w-2xl mx-auto">
            Découvrez des logements vérifiés et sécurisés. Louez ou achetez sans stress avec Betna Immo.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <div className="relative w-full md:w-96 shadow-xl rounded-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
              <input 
                type="text"
                placeholder="Ville, quartier, type de bien..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-5 py-4 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            
            <button 
              onClick={() => setShowOnlyVerified(!showOnlyVerified)}
              className={`px-8 py-4 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-2 shadow-md ${showOnlyVerified ? 'bg-emerald-600 text-white' : 'bg-white text-gray-800 hover:bg-gray-100 border'}`}
            >
              <ShieldCheck className="h-5 w-5" />
              {showOnlyVerified ? '✓ Vérifiés' : 'Logements vérifiés'}
            </button>
          </div>
        </div>
      </header>

      {/* 🏠 Section Résultats */}
      <main className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
            <Building className="h-8 w-8 text-emerald-600" />
            {searchTerm ? `Résultats pour "${searchTerm}"` : "Dernières opportunités"}
          </h2>
          <span className="text-sm text-gray-600 font-medium bg-gray-100 px-5 py-2 rounded-full border">
            {filteredProperties.length} bien(s) trouvé(s)
          </span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {loading ? (
            <div className="text-center py-16 col-span-full flex flex-col items-center gap-4">
                <Loader2 className="h-10 w-10 text-emerald-600 animate-spin" />
                <p className="text-gray-500">Chargement des logements...</p>
            </div>
          ) : filteredProperties.length > 0 ? (
            filteredProperties.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))
          ) : (
            <div className="text-center py-16 col-span-full bg-gray-50 rounded-2xl border border-dashed border-gray-300">
              <p className="text-gray-500 text-lg">Aucun bien ne correspond à vos critères de recherche.</p>
            </div>
          )}
        </div>
      </main>

      {/* 📞 CTA Section */}
      <section className="bg-emerald-700 text-white mt-20">
        <div className="container mx-auto px-6 py-16 text-center">
          <h3 className="text-4xl font-extrabold mb-5">Vous avez un bien à louer ou à vendre ?</h3>
          <p className="text-emerald-100 mb-10 max-w-xl mx-auto text-lg">
            Inscrivez votre bien en quelques clics sur Betna Immo et atteignez des milliers de locataires et acheteurs potentiels.
          </p>
          <button 
            onClick={handleCtaClick}
            className="flex items-center gap-2 mx-auto bg-white text-emerald-700 px-10 py-4 rounded-full font-bold hover:bg-gray-100 transition text-lg shadow-lg"
          >
            Mettez votre bien en valeur
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </section>
    </div>
  );
}

export default Home;