import React, { useState } from 'react';
import api from '../api/axios';
import { Loader2, creditCard } from 'lucide-react';

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
      alert("Impossible d'initier le paiement. Vérifiez votre connexion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleSubscription} 
      disabled={loading}
      className={className}
    >
      {loading ? (
        <>
          <Loader2 className="animate-spin" size={20} />
          Traitement...
        </>
      ) : (
        "Passer au Premium"
      )}
    </button>
  );
};

export default SubscriptionButton;