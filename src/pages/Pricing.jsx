import React from 'react';
import SubscriptionButton from "../components/SubscriptionButton";
import { CheckCircle2, Zap } from 'lucide-react';

function PricingPage() {
  // 💡 REMPLACE par ton vrai ID Stripe de test ou production
  const priceId = "price_1QXXXXXXXXXXXXX"; 

  const features = [
    "Publications illimitées de biens",
    "Vérification des annonces par nos experts",
    "Mise en avant sur la page d'accueil",
    "Support client prioritaire (24/7)",
    "Accès aux statistiques détaillées"
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 py-20 px-6">
      <div className="container mx-auto max-w-7xl">
        
        {/* En-tête de la page */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-4 border border-emerald-100">
            <Zap className="h-4 w-4 fill-emerald-500" />
            <span>Offre de lancement</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-950 mb-6 leading-tight">
            Boostez vos <span className="text-emerald-600">locations</span>.
          </h1>
          <p className="text-xl text-gray-600">
            Une seule formule claire pour publier vos biens immobiliers et attirer des locataires sérieux au Tchad.
          </p>
        </div>
        
        {/* Carte de tarification */}
        <div className="max-w-lg mx-auto bg-white p-10 rounded-[3rem] shadow-2xl shadow-gray-100 border border-gray-100 transform transition-all hover:scale-[1.02]">
          
          <div className="text-center mb-8">
            <h3 className="text-sm font-bold text-emerald-600 uppercase tracking-widest mb-2">Formule Pro</h3>
            <div className="flex items-center justify-center gap-2">
              <span className="text-6xl font-extrabold text-gray-950">300€</span>
              <span className="text-xl font-medium text-gray-500">/mois</span>
            </div>
          </div>
          
          {/* Liste des avantages */}
          <ul className="space-y-5 mb-10">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center gap-4 text-gray-700 text-lg">
                <CheckCircle2 className="h-7 w-7 text-emerald-500 flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
          
          {/* Bouton d'action */}
          <div className="bg-gray-50 p-4 rounded-full border border-gray-100">
            <SubscriptionButton 
              priceId={priceId} 
              className="w-full bg-gray-950 text-white py-5 rounded-full font-bold text-lg hover:bg-gray-800 transition duration-300"
            />
          </div>
          
          <p className="text-center text-sm text-gray-400 mt-6">
            Annulable à tout moment. Paiement sécurisé via Stripe.
          </p>
        </div>

      </div>
    </div>
  );
}

export default PricingPage;