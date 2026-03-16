import React from 'react';
import { CheckCircle, MapPin, Eye, Heart, BedDouble, Bath } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function PropertyCard({ property }) {
  
  const isVerified = property.status === 'Vérifié';
  const mainImage = Array.isArray(property.imageUrls) ? property.imageUrls[0] : property.imageUrl;
  
  // Image par défaut si mainImage est vide
  const fallbackImage = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000&auto=format&fit=crop";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden group transition-all duration-500"
    >
      {/* Container Image avec Overlay au Hover */}
      <div className="relative h-64 overflow-hidden">
        <img 
          src={mainImage || fallbackImage} 
          alt={property.title} 
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        
        {/* Overlay dégradé pour la lisibilité */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badge de vérification stylisé */}
        {isVerified && (
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl flex items-center gap-2 shadow-xl border border-white/20">
            <CheckCircle className="w-4 h-4 text-emerald-500" fill="currentColor" fillOpacity="0.2" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-800">Certifié</span>
          </div>
        )}

        {/* Bouton Favoris (Optionnel visuellement) */}
        <button className="absolute top-4 right-4 p-2.5 bg-white/20 backdrop-blur-md rounded-2xl text-white hover:bg-rose-500 hover:text-white transition-all duration-300">
          <Heart size={18} />
        </button>

        {/* Prix flottant sur l'image (Plus moderne) */}
        <div className="absolute bottom-4 left-4">
          <p className="text-white font-black text-xl tracking-tighter drop-shadow-md">
            {parseInt(property.price).toLocaleString('fr-FR')} <span className="text-xs uppercase opacity-90">FCFA</span>
          </p>
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-lg font-black text-slate-900 leading-tight group-hover:text-emerald-600 transition-colors line-clamp-1" title={property.title}>
            {property.title}
          </h2>
        </div>
        
        <p className="text-slate-400 text-sm font-medium flex items-center gap-1.5 mb-4">
          <MapPin className="w-4 h-4 text-emerald-500/70" />
          {property.location}
        </p>

        {/* Mini caractéristiques pour remplir l'espace intelligemment */}
        <div className="flex items-center gap-4 mb-6 py-3 border-y border-slate-50">
          <div className="flex items-center gap-1.5 text-slate-500">
            <BedDouble size={16} className="text-slate-300" />
            <span className="text-xs font-bold">{property.bedrooms || '2'}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500">
            <Bath size={16} className="text-slate-300" />
            <span className="text-xs font-bold">{property.bathrooms || '1'}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between gap-3">
          <Link 
            to={`/property/${property.id}`}
            className="flex-grow flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-950 text-white text-xs font-black uppercase tracking-[0.15em] rounded-2xl hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-200 transition-all duration-300"
          >
            <Eye className="w-4 h-4" />
            Découvrir
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default PropertyCard;