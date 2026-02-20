import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  MapPin, DollarSign, CheckCircle, Phone, Mail, Loader2, 
  ChevronLeft, ChevronRight, Share2, Heart, ShieldCheck, 
  BedDouble, Bath, Square, Calendar
} from 'lucide-react';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';

function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "biens", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProperty({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError("Ce bien n'est plus disponible.");
        }
      } catch (err) {
        setError("Une erreur est survenue lors de la récupération.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProperty();
  }, [id]);

  const images = property?.imageUrls || (property?.imageUrl ? [property.imageUrl] : ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1000&auto=format&fit=crop"]);

  const nextImage = () => setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  const prevImage = () => setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <Loader2 className="w-12 h-12 animate-spin text-emerald-600 mb-4" />
      <p className="text-slate-400 font-black text-xs uppercase tracking-widest">Préparation de la visite...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6 text-center">
      <div className="bg-rose-50 p-6 rounded-[2.5rem] mb-6">
        <Home className="w-12 h-12 text-rose-500 mx-auto" />
      </div>
      <h2 className="text-2xl font-black text-slate-900 mb-2">Oups !</h2>
      <p className="text-slate-500 mb-6">{error}</p>
      <button onClick={() => navigate(-1)} className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold">Retourner aux annonces</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFDFD] pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Navigation & Actions Rapides */}
        <div className="flex justify-between items-center mb-8">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-bold">
            <ChevronLeft size={20} /> Retour
          </button>
          <div className="flex gap-3">
            <button className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-rose-500 hover:shadow-md transition-all">
              <Heart size={20} />
            </button>
            <button className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-emerald-500 hover:shadow-md transition-all">
              <Share2 size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* COLONNE GAUCHE : VISUELS ET INFOS */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Showcase Carrousel */}
            <div className="relative group rounded-[3rem] overflow-hidden bg-slate-100 aspect-video shadow-2xl shadow-slate-200">
              <AnimatePresence mode="wait">
                <motion.img 
                  key={currentImageIndex}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  src={images[currentImageIndex]} 
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

              {images.length > 1 && (
                <>
                  <button onClick={prevImage} className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md p-4 rounded-full text-white hover:bg-white hover:text-slate-900 transition-all opacity-0 group-hover:opacity-100">
                    <ChevronLeft size={24} />
                  </button>
                  <button onClick={nextImage} className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md p-4 rounded-full text-white hover:bg-white hover:text-slate-900 transition-all opacity-0 group-hover:opacity-100">
                    <ChevronRight size={24} />
                  </button>
                  <div className="absolute bottom-6 right-8 bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-2xl text-xs font-black tracking-widest">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                </>
              )}
            </div>

            {/* Titre et Prix Mobile/Desktop Fusionné */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-b border-slate-100 pb-10">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                    À Louer
                  </span>
                  {property.status === 'Vérifié' && (
                    <span className="flex items-center gap-1.5 bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">
                      <ShieldCheck size={12} /> Bien Vérifié
                    </span>
                  )}
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-slate-950 tracking-tighter">{property.title}</h1>
                <p className="text-slate-400 font-medium flex items-center gap-2 text-lg">
                  <MapPin size={20} className="text-emerald-500" /> {property.location}
                </p>
              </div>
              <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm min-w-[200px] text-center">
                <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">Prix mensuel</p>
                <p className="text-3xl font-black text-emerald-600">{parseInt(property.price).toLocaleString('fr-FR')} <span className="text-sm">FCFA</span></p>
              </div>
            </div>

            {/* Caractéristiques Clés */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Chambres', value: property.bedrooms || '2', icon: BedDouble },
                { label: 'Salles de bain', value: property.bathrooms || '1', icon: Bath },
                { label: 'Surface', value: `${property.surface || '--'} m²`, icon: Square },
                { label: 'Année', value: '2023', icon: Calendar },
              ].map((stat, i) => (
                <div key={i} className="bg-white p-5 rounded-[2rem] border border-slate-100 flex flex-col items-center gap-2">
                  <stat.icon size={20} className="text-slate-300" />
                  <span className="text-slate-900 font-black">{stat.value}</span>
                  <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">{stat.label}</span>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="bg-white p-8 md:p-10 rounded-[3rem] border border-slate-100">
              <h2 className="text-2xl font-black text-slate-950 mb-6 tracking-tight">À propos de ce bien</h2>
              <p className="text-slate-600 leading-relaxed text-lg font-medium italic opacity-80">
                "{property.description || "Un espace exceptionnel situé au cœur de la ville, offrant confort et modernité."}"
              </p>
            </div>
          </div>

          {/* COLONNE DROITE : CONTACT & RÉSERVATION */}
          <div className="lg:col-span-4 space-y-6">
            <div className="sticky top-28 space-y-6">
              
              {/* Carte Contact Agent */}
              <div className="bg-slate-950 p-8 rounded-[3rem] text-white shadow-2xl shadow-slate-200 overflow-hidden relative">
                <div className="relative z-10">
                  <h3 className="text-xl font-black mb-6 tracking-tight flex items-center gap-2">
                    Annonceur
                  </h3>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-2xl">👤</div>
                    <div>
                      <p className="font-black text-lg">{property.agentName || "Agent Betna"}</p>
                      <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest">Agent Certifié</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <a href={`tel:${property.agentPhone}`} className="flex items-center justify-between w-full bg-white/5 hover:bg-white/10 p-4 rounded-2xl border border-white/10 transition-all">
                      <div className="flex items-center gap-3">
                        <Phone size={18} className="text-emerald-400" />
                        <span className="text-sm font-bold">{property.agentPhone || "Contact non spécifié"}</span>
                      </div>
                      <ChevronRight size={16} className="text-white/30" />
                    </a>
                    <a href={`mailto:${property.agentEmail}`} className="flex items-center justify-between w-full bg-white/5 hover:bg-white/10 p-4 rounded-2xl border border-white/10 transition-all">
                      <div className="flex items-center gap-3">
                        <Mail size={18} className="text-emerald-400" />
                        <span className="text-sm font-bold">Envoyer un Email</span>
                      </div>
                      <ChevronRight size={16} className="text-white/30" />
                    </a>
                  </div>

                  <button className="w-full mt-10 bg-emerald-500 hover:bg-emerald-600 text-white py-5 rounded-[2rem] font-black text-sm tracking-widest transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-emerald-500/20">
                    PLANIFIER UNE VISITE
                  </button>
                </div>
                
                {/* Décoration de fond */}
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-500/10 blur-[60px]" />
              </div>

              {/* Rappel Sécurité */}
              <div className="bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100 flex items-start gap-4">
                <div className="p-3 bg-white rounded-xl text-emerald-600 shadow-sm flex-shrink-0">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <p className="text-slate-900 font-black text-sm mb-1">Paiement Sécurisé</p>
                  <p className="text-slate-400 text-xs font-medium leading-relaxed">
                    Ne payez jamais d'acompte avant d'avoir visité le bien avec un agent certifié.
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default PropertyDetail;