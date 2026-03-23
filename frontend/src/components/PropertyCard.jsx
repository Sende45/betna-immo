import React from 'react';
import { CheckCircle, MapPin, Eye, Heart, BedDouble, Bath, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function PropertyCard({ property }) {
  const isVerified = property.status === 'Vérifié';
  
  // Gestion flexible des images (MongoDB Atlas ou Fallback)
  const mainImage = Array.isArray(property.imageUrls) && property.imageUrls.length > 0 
    ? property.imageUrls[0] 
    : property.imageUrl;
  
  const fallbackImage = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000&auto=format&fit=crop";

  return (
    <motion.div 
      id={`property-${property.id || property._id}`} // <-- AJOUTÉ : Indispensable pour le scroll automatique
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 border border-slate-100 overflow-hidden group transition-all duration-500 h-full flex flex-col"
    >
      {/* Media Section */}
      <div className="relative h-72 overflow-hidden flex-shrink-0">
        <img 
          src={mainImage || fallbackImage} 
          alt={property.title} 
          className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
        />
        
        {/* Overlay progressif v4 */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Badges Flottants */}
        <div className="absolute top-5 left-5 flex flex-col gap-2">
          {isVerified && (
            <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-2 shadow-xl border border-white/20">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-800">Certifié</span>
            </div>
          )}
          <div className="bg-emerald-600/90 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-2 shadow-xl">
             <Sparkles className="w-3.5 h-3.5 text-white" />
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Nouveau</span>
          </div>
        </div>

        {/* Bouton Favoris Premium */}
        <button className="absolute top-5 right-5 p-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white hover:bg-rose-500 hover:border-rose-500 transition-all duration-300 group/heart">
          <Heart size={20} className="group-hover/heart:fill-white transition-colors" />
        </button>

        {/* Prix Tag v4 Style */}
        <div className="absolute bottom-6 left-6">
          <div className="flex items-baseline gap-1">
            <p className="text-white font-black text-3xl tracking-tighter drop-shadow-2xl">
              {parseInt(property.price).toLocaleString('fr-FR')}
            </p>
            <span className="text-[10px] font-black uppercase text-emerald-400 tracking-widest drop-shadow-md">FCFA</span>
          </div>
          <p className="text-white/70 text-[9px] font-bold uppercase tracking-widest mt-1">
            {property.typeSejour === 'court' ? 'Par nuit' : 'Par mois'}
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-8 flex flex-col flex-grow">
        <div className="mb-4">
          <h2 className="text-xl font-black text-slate-950 leading-tight group-hover:text-emerald-600 transition-colors line-clamp-1 tracking-tight" title={property.title}>
            {property.title}
          </h2>
          <p className="text-slate-400 text-sm font-bold flex items-center gap-2 mt-2 uppercase tracking-tighter">
            <MapPin className="w-4 h-4 text-emerald-500" />
            {property.location}
          </p>
        </div>

        {/* Caractéristiques avec icônes subtiles */}
        <div className="flex items-center gap-6 mb-8 py-4 border-y border-slate-50">
          <div className="flex items-center gap-2 text-slate-600">
            <div className="p-2 bg-slate-50 rounded-xl group-hover:bg-emerald-50 transition-colors">
                <BedDouble size={18} className="text-slate-400 group-hover:text-emerald-500" />
            </div>
            <span className="text-sm font-black">{property.bedrooms || '0'} <span className="text-[10px] text-slate-400 font-bold uppercase ml-0.5">Lits</span></span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <div className="p-2 bg-slate-50 rounded-xl group-hover:bg-emerald-50 transition-colors">
                <Bath size={18} className="text-slate-400 group-hover:text-emerald-500" />
            </div>
            <span className="text-sm font-black">{property.bathrooms || '0'} <span className="text-[10px] text-slate-400 font-bold uppercase ml-0.5">SdB</span></span>
          </div>
        </div>
        
        {/* Actions Button - Poussé vers le bas */}
        <div className="mt-auto">
          <Link 
            to={`/property/${property.id || property._id}`}
            className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-slate-950 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-[1.8rem] hover:bg-emerald-600 hover:shadow-xl hover:shadow-emerald-200 transition-all duration-500 active:scale-95"
          >
            <Eye className="w-4 h-4" />
            Détails du bien
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default PropertyCard;