// src/pages/Pricing.jsx
import SubscriptionButton from "../components/SubscriptionButton";

function PricingPage() {
  // 💡 REMPLACE par ton vrai ID Stripe de test ou production
  const priceId = "price_1QXXXXXXXXXXXXX"; 

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center bg-white p-10 rounded-xl shadow-md">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">
            Nos Tarifs
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Abonnez-vous pour accéder à la publication de vos biens immobiliers.
          </p>
        </div>
        
        {/* 💡 CONTENEUR DU PRIX */}
        <div className="mt-8 bg-gray-100 p-6 rounded-lg">
          <p className="text-4xl font-bold text-blue-600">200€ <span className="text-sm font-medium text-gray-500">/mois</span></p>
          <ul className="text-left mt-4 text-sm text-gray-700 space-y-2">
            <li>✅ Publication illimitée</li>
            <li>✅ Mise en avant des annonces</li>
            <li>✅ Support prioritaire</li>
          </ul>
        </div>
        
        {/* 💡 Utilisation du composant stylisé */}
        <div className="mt-8">
          <SubscriptionButton priceId={priceId} />
        </div>
      </div>
    </div>
  );
}

export default PricingPage;