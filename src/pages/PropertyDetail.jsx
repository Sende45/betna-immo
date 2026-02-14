import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, DollarSign, CheckCircle, Phone, Mail, Loader2, Home, ChevronLeft, ChevronRight } from 'lucide-react';
// 💡 IMPORT FIREBASE
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

function PropertyDetail() {
  const { id } = useParams(); // 🔗 Récupère l'ID de l'URL
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 💡 ÉTATS POUR LE CARROUSEL
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      try {
        // 💡 Cherche le document dans la collection 'biens'
        const docRef = doc(db, "biens", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProperty({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError("Bien immobilier non trouvé.");
        }
      } catch (err) {
        console.error("Erreur Firestore : ", err);
        setError("Erreur lors du chargement des données.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProperty();
  }, [id]);

  // 💡 FONCTIONS CARROUSEL
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-emerald-600" /></div>;
  }

  if (error || !property) {
    return <div className="min-h-screen flex items-center justify-center text-red-600 font-bold">{error}</div>;
  }

  // 💡 GESTION DES IMAGES (Tableau ou ancienne chaîne)
  const images = property.imageUrls || [property.imageUrl] || [];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Header du bien */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
          <div className="flex justify-between items-start gap-4">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900">{property.title}</h1>
              <p className="text-gray-600 mt-2 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-emerald-600" />
                {property.location}
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <DollarSign className="h-8 w-8 text-emerald-600" />
                {parseInt(property.price).toLocaleString('fr-FR')} FCFA/mois
              </p>
              {property.status === 'Vérifié' && (
                <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-700 text-sm font-semibold px-3 py-1 rounded-full mt-2">
                  <CheckCircle className="h-4 w-4" />
                  Bien Vérifié
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Grille Contenu : Image et Infos */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Colonne Gauche : Carrousel et Description */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* 💡 CARROUSEL D'IMAGES */}
            <div className="relative group rounded-2xl shadow-md overflow-hidden h-96">
              <img 
                src={images[currentImageIndex]} 
                alt={`${property.title} - ${currentImageIndex + 1}`} 
                className="w-full h-full object-cover"
              />
              
              {/* Flèches de navigation */}
              {images.length > 1 && (
                <>
                  <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/60 p-2 rounded-full opacity-0 group-hover:opacity-100 transition">
                    <ChevronLeft className="w-6 h-6 text-gray-900" />
                  </button>
                  <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/60 p-2 rounded-full opacity-0 group-hover:opacity-100 transition">
                    <ChevronRight className="w-6 h-6 text-gray-900" />
                  </button>
                  {/* Indicateur de position */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-xs">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                </>
              )}
            </div>
            
            {/* Vignettes du carrousel */}
            {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {images.map((img, index) => (
                        <button key={index} onClick={() => setCurrentImageIndex(index)} className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${currentImageIndex === index ? 'border-emerald-500' : 'border-transparent'}`}>
                            <img src={img} alt="miniature" className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            )}
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed">{property.description || "Aucune description fournie."}</p>
            </div>
          </div>

          {/* Colonne Droite : Contact */}
          <div className="space-y-8">
            
            {/* Contact Agent */}
            <div className="bg-gray-900 p-6 rounded-2xl shadow-lg text-white">
              <h3 className="text-xl font-bold mb-4">Contacter l'annonceur</h3>
              <p className="font-semibold text-lg">{property.agentName || "Annonceur"}</p>
              <div className="mt-4 space-y-3 text-gray-300">
                <p className="flex items-center gap-2">
                  <Phone className="h-5 w-5" /> {property.agentPhone || "N/A"}
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="h-5 w-5" /> {property.agentEmail || "N/A"}
                </p>
              </div>
              <button className="w-full mt-6 bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition">
                Envoyer un message
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default PropertyDetail;