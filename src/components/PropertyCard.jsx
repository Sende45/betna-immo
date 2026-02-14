import React from 'react';
// Importation des icônes de lucide-react
import { CheckCircle, MapPin, DollarSign, Eye } from 'lucide-react';
// 💡 IMPORT LINK POUR LA NAVIGATION
import { Link } from 'react-router-dom';

function PropertyCard({ property }) {
  
  // 💡 Vérification si le statut est 'Vérifié'
  const isVerified = property.status === 'Vérifié';

  // 💡 MODIF : Gérer si on a une seule image (ancienne DB) ou un tableau (nouvelle DB)
  const mainImage = Array.isArray(property.imageUrls) ? property.imageUrls[0] : property.imageUrl;
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300 relative group">
      {/* Container pour l'image et le badge */}
      <div className="relative overflow-hidden">
        <img 
          src={mainImage} 
          alt={property.title} 
          className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Badge de vérification */}
        {isVerified && (
          <span className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            Vérifié
        </span>
        )}
      </div>

      <div className="p-5">
        <h2 className="text-lg font-semibold text-gray-900 truncate" title={property.title}>
          {property.title}
        </h2>
        
        {/* Localisation */}
        <p className="text-gray-600 text-sm mt-2 flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-emerald-500" />
          {property.location}
        </p>
        
        <div className="mt-5 pt-4 border-t border-gray-100 flex justify-between items-center">
          {/* Prix */}
          <span className="text-lg font-bold text-gray-900 flex items-center gap-1">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            {parseInt(property.price).toLocaleString('fr-FR')} FCFA
          </span>
          
          {/* 💡 MODIF : BOUTON DEVENU LINK */}
          <Link 
            to={`/property/${property.id}`} // 🔗 Lien vers la page détail
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-emerald-700 transition duration-300"
          >
            <Eye className="w-4 h-4" />
            Voir
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PropertyCard;