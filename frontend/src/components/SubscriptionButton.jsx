import React, { useState } from 'react';
import api from '../api/axios';
import { Loader2, CreditCard } from 'lucide-react'; // ✅ Corrigé : Majuscule sur CreditCard

const SubscriptionButton = ({ priceId, className }) => {
  const [loading, setLoading] = useState(false);

  const handleSubscription = async () => {
    try {
      setLoading(true);
      // ✅ Appel à ton backend pour créer la session Checkout
      const response = await api.post('/payments/create-checkout-session', {
        priceId: priceId
      });

      // Redirection vers la page de paiement Stripe
      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (err) {
      console.error("Erreur Stripe:", err);
      // ✅ Plus précis : affiche le message du backend si disponible
      const errorMsg = err.response?.data?.message || "Impossible d'initier le paiement.";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleSubscription} 
      disabled={loading}
      className={`flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-70 ${className}`}
    >
      {loading ? (
        <>
          <Loader2 className="animate-spin" size={20} />
          <span>Traitement...</span>
        </>
      ) : (
        <>
          <CreditCard size={20} /> {/* ✅ Icône maintenant utilisée */}
          <span>Passer au Premium</span>
        </>
      )}
    </button>
  );
};

export default SubscriptionButton;