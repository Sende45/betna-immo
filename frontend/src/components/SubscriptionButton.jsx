import React, { useState } from 'react';
import api from '../api/axios';
import { Loader2, CreditCard, Sparkles } from 'lucide-react';

const SubscriptionButton = ({ priceId, className }) => {
  const [loading, setLoading] = useState(false);

  const handleSubscription = async () => {
    try {
      setLoading(true);
      
      // ✅ Appel à ton API Node.js/Stripe
      const response = await api.post('/payments/create-checkout-session', {
        priceId: priceId
      });

      // 💳 Redirection vers Stripe Checkout
      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (err) {
      console.error("Erreur Session Stripe:", err);
      const errorMsg = err.response?.data?.message || "Échec de la connexion avec Stripe.";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleSubscription} 
      disabled={loading}
      className={`
        relative overflow-hidden group
        flex items-center justify-center gap-3 
        transition-all duration-300 
        active:scale-95 disabled:active:scale-100
        disabled:cursor-not-allowed
        ${className}
      `}
    >
      {/* Effet de brillance subtil au hover (Tailwind v4 style) */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

      {loading ? (
        <>
          <Loader2 className="animate-spin" size={22} />
          <span className="font-black uppercase tracking-widest text-xs">Validation...</span>
        </>
      ) : (
        <>
          <CreditCard 
            size={22} 
            className="group-hover:-rotate-12 transition-transform duration-300" 
          />
          <span className="relative z-10">S'abonner maintenant</span>
          <Sparkles 
            size={16} 
            className="absolute right-6 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 text-emerald-400" 
          />
        </>
      )}
    </button>
  );
};

export default SubscriptionButton;