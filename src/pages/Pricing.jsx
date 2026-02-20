import React from 'react';
import { motion } from 'framer-motion'; // Pour l'effet d'entrée et le hover
import SubscriptionButton from "../components/SubscriptionButton";
import { CheckCircle2, Zap, ShieldCheck, Rocket, Globe } from 'lucide-react';

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
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 py-24 md:py-32 px-6 overflow-hidden">
      <div className="container mx-auto max-w-7xl relative">
        
        {/* Cercles décoratifs en arrière-plan */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-100/40 blur-[120px] rounded-full -z-10" />
        <div className="absolute top-1/2 -right-24 w-80 h-80 bg-blue-100/30 blur-[100px] rounded-full -z-10" />

        {/* En-tête de la page */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-bold mb-6 border border-emerald-100 shadow-sm"
          >
            <Zap className="h-4 w-4 fill-emerald-500 text-emerald-500" />
            <span>OFFRE DE LANCEMENT EXCLUSIVE</span>
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-black text-slate-950 mb-8 leading-[1.1] tracking-tight">
            Boostez vos <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">locations</span>.
          </h1>
          
          <p className="text-xl text-slate-600 leading-relaxed font-medium">
            Propriétaires et agences au Tchad : rejoignez la plateforme N°1 pour digitaliser votre patrimoine et sécuriser vos revenus.
          </p>
        </motion.div>
        
        {/* Carte de tarification avec Framer Motion */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="max-w-xl mx-auto"
        >
          <div className="relative group">
            {/* Effet de lueur derrière la carte au hover */}
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-[3.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            
            <div className="relative bg-white p-8 md:p-12 rounded-[3.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100">
              
              <div className="flex justify-between items-start mb-10">
                <div>
                  <h3 className="text-emerald-600 font-black uppercase tracking-[0.2em] text-sm mb-3">Formule Pro</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-7xl font-black text-slate-950 tracking-tighter">300€</span>
                    <span className="text-xl font-bold text-slate-400">/mois</span>
                  </div>
                </div>
                <div className="bg-slate-950 text-white p-4 rounded-3xl shadow-xl">
                  <Rocket className="h-8 w-8 text-emerald-400" />
                </div>
              </div>
              
              <div className="h-px bg-slate-100 w-full mb-10" />
              
              {/* Liste des avantages animée */}
              <ul className="space-y-6 mb-12">
                {features.map((feature, index) => (
                  <motion.li 
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + (index * 0.1) }}
                    className="flex items-center gap-5 text-slate-700 text-lg font-medium"
                  >
                    <div className="bg-emerald-50 p-1.5 rounded-full">
                      <CheckCircle2 className="h-6 w-6 text-emerald-500 flex-shrink-0" />
                    </div>
                    {feature}
                  </motion.li>
                ))}
              </ul>
              
              {/* Zone d'action */}
              <div className="space-y-6">
                <div className="p-2 bg-slate-50 rounded-[2.5rem] border border-slate-100 shadow-inner">
                  <SubscriptionButton 
                    priceId={priceId} 
                    className="w-full bg-slate-950 text-white py-6 rounded-[2rem] font-black text-xl hover:bg-emerald-600 transition-all duration-500 shadow-lg shadow-slate-200 flex items-center justify-center gap-3"
                  />
                </div>
                
                <div className="flex items-center justify-center gap-6">
                   <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                     <ShieldCheck className="h-4 w-4" /> SSL SECURE
                   </div>
                   <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                     <Globe className="h-4 w-4" /> GLOBAL STRIPE
                   </div>
                </div>
              </div>

              <p className="text-center text-sm text-slate-400 mt-8 font-medium">
                Aucun engagement. Annulez en un clic depuis votre tableau de bord.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Témoignage rapide ou réassurance */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-16 text-slate-500 font-medium"
        >
          Déjà plus de <span className="text-slate-950 font-bold">50 propriétaires</span> satisfaits au Tchad.
        </motion.p>

      </div>
    </div>
  );
}

export default PricingPage;