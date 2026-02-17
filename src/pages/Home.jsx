import React, { useState, useEffect } from 'react';
import PropertyCard from "../components/PropertyCard";
import { Search, ShieldCheck, MapPin, Zap, ArrowRight, Building, ArrowUpDown, Star, Users, Clock } from 'lucide-react';
import { db } from '../firebase';
import { collection, query, onSnapshot } from 'firebase/firestore'; 
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logementImage from "../assets/logement.png"; 

function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [showOnlyVerified, setShowOnlyVerified] = useState(false);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState('newest'); 
  
  const [heroVisible, setHeroVisible] = useState(false); 

  useEffect(() => {
    const q = query(collection(db, "biens"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setProperties(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    setTimeout(() => setHeroVisible(true), 150);

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
    
    const matchesVerified = !showOnlyVerified || property.status === 'Vérifié';
    
    return matchesSearch && matchesVerified;
  }).sort((a, b) => {
    if (sortOrder === 'priceAsc') return a.price - b.price;
    if (sortOrder === 'priceDesc') return b.price - a.price;
    return 0;
  });

  const PropertySkeleton = () => (
    <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 animate-pulse">
      <div className="bg-gray-200 h-48 sm:h-52 rounded-2xl mb-5"></div>
      <div className="h-5 bg-gray-200 rounded-full w-3/4 mb-3"></div>
      <div className="h-4 bg-gray-200 rounded-full w-1/2"></div>
    </div>
  );

  const trustFeatures = [
    { icon: ShieldCheck, title: "Biens Vérifiés", description: "Inspection physique" },
    { icon: Users, title: "Propriétaires Fiables", description: "Profils vérifiés" },
    { icon: Clock, title: "Service Rapide", description: "Réponse en 24h" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 overflow-x-hidden">
      
      {/* 🏙️ Hero Section - Responsive ajusté */}
      <header className="relative bg-white border-b border-gray-100 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 py-12 md:py-16 lg:py-20 flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          
          <div className="flex-1 text-center lg:text-left z-10 w-full">
            <div className={`inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold mb-4 sm:mb-6 border border-emerald-100 transition-all duration-700
              ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-6"}`}>
              <Star className="h-4 w-4 fill-emerald-500 animate-pulse" />
              <span>N°1 de l'immobilier fiable au Tchad</span>
            </div>
            
            <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-950 mb-5 sm:mb-6 leading-[1.1] transition-all duration-1000
              ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
              Votre chez-vous au Tchad,{" "}
              <span className="text-emerald-600 inline-block animate-[pulse_3s_ease-in-out_infinite]">
                en toute confiance
              </span>.
            </h1>
            
            <p className={`text-lg sm:text-xl text-gray-600 mb-8 sm:mb-10 max-w-2xl mx-auto lg:mx-0 transition-all duration-1000 delay-200
              ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
              Louez ou achetez des biens inspectés par nos experts. Betna Immo sécurise votre recherche immobilière.
            </p>
            
            <div className={`flex flex-col sm:flex-row gap-4 justify-center lg:justify-start transition-all duration-1000 delay-300
              ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
              <button 
                onClick={handleCtaClick}
                className="flex items-center justify-center gap-2 bg-emerald-600 text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-full font-bold hover:bg-emerald-700 transition-all duration-300 text-base sm:text-lg shadow-lg shadow-emerald-200 hover:shadow-emerald-300 hover:-translate-y-0.5"
              >
                Proposer un bien
                <ArrowRight className="h-5 w-5" />
              </button>
              <a 
                href="#listings"
                className="flex items-center justify-center gap-2 bg-white text-gray-900 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full font-bold hover:bg-gray-100 transition text-base sm:text-lg border border-gray-200"
              >
                Explorer les biens
              </a>
            </div>
          </div>

          <div className="flex-1 relative w-full h-[300px] sm:h-[400px] lg:h-[500px]">
            <div className="absolute -inset-6 bg-gradient-to-tr from-emerald-200/30 via-transparent to-emerald-100/30 blur-3xl animate-pulse"></div>
            <img 
               src={logementImage}
               alt="Immobilier Betna"
               className="rounded-3xl shadow-2xl w-full h-full object-cover transition-transform duration-[4000ms] hover:scale-105"
            />
            {/* Carte flottante masquée sur petit écran pour éviter les soucis de recouvrement */}
            <div className={`absolute -bottom-6 -left-6 sm:-bottom-10 sm:-left-10 bg-white p-4 sm:p-5 rounded-2xl shadow-xl border flex items-center gap-3 sm:gap-4 transition-all duration-1000 delay-500 hidden sm:flex
              ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
              <ShieldCheck className="h-10 w-10 sm:h-14 sm:w-14 text-emerald-500 bg-emerald-100 p-2 sm:p-3 rounded-2xl" />
              <div>
                <p className="font-bold text-lg sm:text-xl">Garantie Betna</p>
                <p className="text-gray-500 text-sm sm:text-base">100% de biens vérifiés</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 🚀 Barre de recherche flottante - Responsive */}
      <section className="container mx-auto px-4 sm:px-6 -mt-8 sm:-mt-10 relative z-20">
        <div className="bg-white p-3 sm:p-4 rounded-full shadow-xl border border-gray-100 flex flex-col md:flex-row gap-2 sm:gap-4 items-center">
          <div className="relative w-full md:flex-grow">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
            <input 
              type="text"
              placeholder="Ville, quartier, type de bien..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 sm:py-4 rounded-full border border-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-300 text-base sm:text-lg"
            />
          </div>
          
          <button 
            onClick={() => setShowOnlyVerified(!showOnlyVerified)}
            className={`w-full md:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${showOnlyVerified ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
          >
            <ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6" />
            {showOnlyVerified ? '✓ Vérifiés' : 'Logements Vérifiés'}
          </button>
        </div>
      </section>

      {/* ✨ Section Confiance - Responsive */}
      <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {trustFeatures.map((feature, index) => (
            <div key={index} className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4 sm:gap-5">
              <feature.icon className="h-10 w-10 sm:h-12 sm:w-12 text-emerald-500 bg-emerald-100 p-2.5 sm:p-3 rounded-2xl" />
              <div>
                <h4 className="text-lg sm:text-xl font-bold text-gray-950">{feature.title}</h4>
                <p className="text-sm sm:text-base text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 🏠 Section Résultats - Responsive */}
      <main id="listings" className="container mx-auto px-4 sm:px-6 pb-16 sm:pb-20">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-950 flex items-center gap-3">
            <Building className="h-8 w-8 sm:h-10 sm:w-10 text-emerald-600" />
            Dernières opportunités
          </h2>
          
          <div className="flex items-center gap-2 bg-white p-1.5 sm:p-2 rounded-full border shadow-sm w-full md:w-auto justify-center">
            <ArrowUpDown className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 ml-2" />
            <select 
              value={sortOrder} 
              onChange={(e) => setSortOrder(e.target.value)}
              className="text-xs sm:text-sm text-gray-700 bg-transparent focus:outline-none pr-3 sm:pr-4 py-1"
            >
              <option value="newest">Plus récents</option>
              <option value="priceAsc">Prix croissant</option>
              <option value="priceDesc">Prix décroissant</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {loading ? (
            Array(4).fill(0).map((_, i) => <PropertySkeleton key={i} />)
          ) : filteredProperties.length > 0 ? (
            filteredProperties.map(property => (
              <div key={property.id} className="transition-all duration-300 hover:scale-[1.02] sm:hover:scale-[1.03] hover:shadow-2xl rounded-3xl">
                <PropertyCard property={property} />
              </div>
            ))
          ) : (
            <div className="text-center py-16 sm:py-20 col-span-full bg-white rounded-3xl border border-gray-100 shadow-sm px-4">
              <Building className="h-16 w-16 sm:h-20 sm:w-20 text-gray-300 mx-auto mb-4 sm:mb-6" />
              <p className="text-gray-500 text-xl sm:text-2xl font-semibold">Aucun bien ne correspond à vos critères.</p>
              <p className="text-gray-400 mt-2 text-sm sm:text-base">Essayez de modifier votre recherche ou le filtre de vérification.</p>
            </div>
          )}
        </div>
      </main>

      {/* 📞 CTA Section - Responsive */}
      <section className="bg-gray-950 text-white rounded-t-[2rem] sm:rounded-t-[3rem] mt-10">
        <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-20 md:py-24 text-center">
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 sm:mb-6">Vous avez un bien à louer ?</h3>
          <p className="text-gray-300 mb-10 sm:mb-12 max-w-2xl mx-auto text-base sm:text-lg md:text-xl leading-relaxed px-2">
            Inscrivez votre bien en quelques clics. Notre équipe s'occupe de la vérification pour vous apporter des locataires sérieux.
          </p>
          <button 
            onClick={handleCtaClick}
            className="flex items-center gap-2 mx-auto bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-8 sm:px-10 py-4 sm:py-5 rounded-full font-bold hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 text-base sm:text-lg shadow-lg shadow-emerald-950/30 hover:scale-105"
          >
            Inscrire mon bien maintenant
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </section>
    </div>
  );
}

export default Home;