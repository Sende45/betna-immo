import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  MapPin, CheckCircle, Phone, Mail, Loader2, 
  ChevronLeft, ChevronRight, Share2, Heart, ShieldCheck, 
  BedDouble, Bath, Square, Calendar, Home
} from 'lucide-react';
import api from '../api/axios'; 
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
        const response = await api.get(`/biens/${id}`);
        setProperty(response.data);
      } catch (err) {
        console.error("Erreur Backend:", err);
        setError("Ce bien n'est plus disponible ou l'ID est invalide.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProperty();
  }, [id]);

  const images = property?.imageUrls?.length > 0 
    ? property.imageUrls 
    : ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1000&auto=format&fit=crop"];

  const nextImage = () => setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  const prevImage = () => setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <Loader2 className="w-12 h-12 animate-spin text-emerald-600 mb-4" />
      <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em]">Immersion en cours...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
      <div className="bg-white p-8 rounded-[3rem] shadow-xl shadow-slate-200/50 max-w-md">
        <div className="bg-rose-50 p-6 rounded-[2rem] mb-6 inline-block">
          <Home className="w-12 h-12 text-rose-500" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tighter">Propriété introuvable</h2>
        <p className="text-slate-500 mb-8 font-medium">{error}</p>
        <button onClick={() => navigate('/catalogue')} className="w-full bg-slate-950 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-emerald-600 transition-all">
          Retour au catalogue
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/30 pt-24 pb-20 selection:bg-emerald-100">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Navigation & Actions */}
        <div className="flex justify-between items-center mb-10">
          <button onClick={() => navigate(-1)} className="flex items-center gap-3 text-slate-400 hover:text-slate-950 transition-all font-black text-xs uppercase tracking-widest group">
            <div className="bg-white p-2 rounded-xl border border-slate-100 group-hover:shadow-md transition-all">
                <ChevronLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" /> 
            </div>
            Retour
          </button>
          <div className="flex gap-3">
            <button className="p-4 bg-white border border-slate-100 rounded-[1.25rem] text-slate-400 hover:text-rose-500 hover:shadow-xl hover:shadow-rose-100 transition-all">
              <Heart size={22} />
            </button>
            <button className="p-4 bg-white border border-slate-100 rounded-[1.25rem] text-slate-400 hover:text-emerald-500 hover:shadow-xl hover:shadow-emerald-100 transition-all">
              <Share2 size={22} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* COLONNE GAUCHE */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Showcase Carrousel v4 */}
            <div className="relative group rounded-[3.5rem] overflow-hidden bg-slate-200 aspect-video shadow-2xl shadow-slate-300/50 border-8 border-white">
              <AnimatePresence mode="wait">
                <motion.img 
                  key={currentImageIndex}
                  initial={{ opacity: 0, scale: 1.05 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  src={images[currentImageIndex]} 
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

              {images.length > 1 && (
                <>
                  <button onClick={prevImage} className="absolute left-8 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-xl p-5 rounded-full text-white hover:bg-white hover:text-slate-900 transition-all opacity-0 group-hover:opacity-100 shadow-2xl">
                    <ChevronLeft size={28} />
                  </button>
                  <button onClick={nextImage} className="absolute right-8 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-xl p-5 rounded-full text-white hover:bg-white hover:text-slate-900 transition-all opacity-0 group-hover:opacity-100 shadow-2xl">
                    <ChevronRight size={28} />
                  </button>
                  <div className="absolute bottom-8 right-10 catalogue-glass text-white px-6 py-2.5 rounded-2xl text-[10px] font-black tracking-[0.2em] uppercase border border-white/20">
                    Image {currentImageIndex + 1} / {images.length}
                  </div>
                </>
              )}
            </div>

            {/* Titre & Prix Header */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-8">
              <div className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  <span className="bg-emerald-600 text-white px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-200">
                    {property.typeSejour === 'court' ? 'Séjour Court' : 'Location Longue'}
                  </span>
                  {property.status === 'Vérifié' && (
                    <span className="flex items-center gap-2 bg-white text-blue-600 px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-50 shadow-sm">
                      <ShieldCheck size={14} /> Certifié Vérifié
                    </span>
                  )}
                </div>
                <h1 className="text-5xl md:text-6xl font-black text-slate-950 tracking-tighter leading-none">{property.title}</h1>
                <p className="text-slate-400 font-bold flex items-center gap-2.5 text-xl">
                  <MapPin size={24} className="text-emerald-500" /> {property.location}
                </p>
              </div>
              <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 text-center md:self-start">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">
                  Tarif {property.typeSejour === 'court' ? 'Journalier' : 'Mensuel'}
                </p>
                <p className="text-4xl font-black text-emerald-600 tracking-tighter">
                  {parseInt(property.price).toLocaleString('fr-FR')} 
                  <span className="text-xs ml-2 font-black text-slate-400 uppercase tracking-widest">FCFA</span>
                </p>
              </div>
            </div>

            {/* Grid des Spécifications */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: 'Chambres', value: property.bedrooms || '0', icon: BedDouble },
                { label: 'Salles de Bain', value: property.bathrooms || '0', icon: Bath },
                { label: 'Surface Totale', value: `${property.surface || 'N/A'} m²`, icon: Square },
                { label: 'Configuration', value: property.typeSejour === 'court' ? 'Meublé' : 'Standard', icon: Calendar },
              ].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 flex flex-col items-center gap-3 hover:shadow-xl hover:shadow-slate-200/50 transition-all group">
                  <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-emerald-50 transition-colors">
                    <stat.icon size={22} className="text-slate-300 group-hover:text-emerald-500" />
                  </div>
                  <span className="text-slate-950 font-black text-lg">{stat.value}</span>
                  <span className="text-slate-400 text-[9px] font-black uppercase tracking-widest">{stat.label}</span>
                </div>
              ))}
            </div>

            {/* Description Premium */}
            <div className="bg-white p-10 md:p-14 rounded-[4rem] border border-slate-50 shadow-sm relative overflow-hidden group">
              <h2 className="text-3xl font-black text-slate-950 mb-8 tracking-tighter">Description du bien</h2>
              <p className="text-slate-600 leading-relaxed text-xl font-medium opacity-90 relative z-10">
                {property.description || "Une opportunité unique à Abidjan. Ce bien a été rigoureusement sélectionné par nos équipes pour son standing et sa localisation stratégique."}
              </p>
              <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                 <Sparkles size={120} className="text-emerald-500" />
              </div>
            </div>
          </div>

          {/* COLONNE DROITE : CTA & AGENT */}
          <div className="lg:col-span-4 space-y-8">
            <div className="sticky top-28 space-y-8">
              
              {/* Carte Contact "Dark Mode" Premium */}
              <div className="bg-slate-950 p-10 rounded-[4rem] text-white shadow-2xl shadow-slate-300 relative overflow-hidden group">
                <div className="relative z-10">
                  <h3 className="text-xs font-black uppercase tracking-[0.3em] text-emerald-400 mb-10 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Contact Direct
                  </h3>
                  
                  <div className="flex items-center gap-6 mb-12">
                    <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-700 rounded-3xl flex items-center justify-center text-3xl font-black shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-500">
                      {property.agentName?.[0] || "B"}
                    </div>
                    <div>
                      <p className="font-black text-2xl tracking-tight leading-tight">{property.agentName || "Agent Betna"}</p>
                      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Partenaire Certifié</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <a href={`tel:${property.agentPhone}`} className="flex items-center justify-between w-full bg-white/5 hover:bg-white/10 p-5 rounded-2xl border border-white/10 transition-all group/link">
                      <div className="flex items-center gap-4">
                        <Phone size={20} className="text-emerald-400" />
                        <span className="text-sm font-black tracking-tight">{property.agentPhone || "Contact local"}</span>
                      </div>
                      <ChevronRight size={18} className="text-white/20 group-hover/link:translate-x-1 transition-transform" />
                    </a>
                    <a href={`mailto:${property.agentEmail}`} className="flex items-center justify-between w-full bg-white/5 hover:bg-white/10 p-5 rounded-2xl border border-white/10 transition-all group/link">
                      <div className="flex items-center gap-4">
                        <Mail size={20} className="text-emerald-400" />
                        <span className="text-sm font-black tracking-tight">Email de l'annonceur</span>
                      </div>
                      <ChevronRight size={18} className="text-white/20 group-hover/link:translate-x-1 transition-transform" />
                    </a>
                  </div>

                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full mt-10 bg-emerald-500 hover:bg-emerald-400 text-white py-6 rounded-[2.5rem] font-black text-sm tracking-[0.2em] uppercase transition-all shadow-xl shadow-emerald-500/30"
                  >
                    Réserver une visite
                  </motion.button>
                </div>
                
                {/* FX Background */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] rounded-full" />
              </div>

              {/* Security Shield Card */}
              <div className="bg-white p-8 rounded-[3rem] border border-slate-100 flex items-start gap-5 shadow-sm">
                <div className="p-4 bg-emerald-50 rounded-[1.5rem] text-emerald-600 flex-shrink-0">
                  <ShieldCheck size={28} />
                </div>
                <div>
                  <p className="text-slate-900 font-black text-base tracking-tight mb-1 uppercase">Garantie Betna</p>
                  <p className="text-slate-400 text-xs font-bold leading-relaxed">
                    Toutes nos visites sont encadrées. Aucun frais de dossier n'est requis avant la signature officielle.
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