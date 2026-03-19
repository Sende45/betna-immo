import React from 'react';
import { motion } from 'framer-motion';
import SubscriptionButton from "../components/SubscriptionButton";
import { CheckCircle2, Zap, ShieldCheck, Rocket, Globe } from 'lucide-react';

function PricingPage() {
  // ✅ ID Stripe réel pour Betna Immo
  const priceId = "price_1TBf2mIImwaKuwtjmI7PshwC"; 

  const features = [
    "Publications illimitées de biens",
    "Vérification prioritaire (Badge Vérifié)",
    "Mise en avant dans le Catalogue",
    "Support client prioritaire à Abidjan",
    "Accès aux statistiques de vues"
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-24 md:py-32 px-6 overflow-hidden selection:bg-emerald-100">
      <div className="container mx-auto max-w-7xl relative">
        
        {/* Cercles décoratifs (Optimisés v4) */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-100/40 blur-[120px] rounded-full -z-10" />
        <div className="absolute top-1/2 -right-24 w-80 h-80 bg-blue-100/30 blur-[100px] rounded-full -z-10" />

        {/* En-tête de la page */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8 border border-emerald-100 shadow-sm"
          >
            <Zap className="h-4 w-4 fill-emerald-500 text-emerald-500" />
            <span>Offre de lancement</span>
          </motion.div>
          
          <h1 className="text-5xl md:text-8xl font-black text-slate-950 mb-8 leading-none tracking-tighter">
            Boostez vos <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">locations</span>.
          </h1>
          
          <p className="text-xl text-slate-500 leading-relaxed font-bold max-w-2xl mx-auto">
            Digitalisez votre patrimoine immobilier à Abidjan et sécurisez vos revenus avec notre formule Pro.
          </p>
        </motion.div>
        
        {/* Carte de tarification Premium */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="max-w-xl mx-auto relative"
        >
          <div className="relative group">
            {/* Glow effect v4 */}
            <div className="absolute -inset-2 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-[4rem] blur-2xl opacity-10 group-hover:opacity-30 transition-all duration-1000" />
            
            <div className="relative bg-white p-10 md:p-14 rounded-[3.5rem] shadow-2xl shadow-slate-200/60 border border-white">
              
              <div className="flex justify-between items-start mb-12">
                <div>
                  <h3 className="text-emerald-600 font-black uppercase tracking-[0.3em] text-[11px] mb-4">Formule Partenaire</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-7xl font-black text-slate-950 tracking-tighter">25.000</span>
                    <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-400 uppercase tracking-widest">FCFA</span>
                        <span className="text-xs font-bold text-slate-300">/ mois</span>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-950 text-white p-5 rounded-[2rem] shadow-xl shadow-slate-200">
                  <Rocket className="h-8 w-8 text-emerald-400" />
                </div>
              </div>
              
              <div className="h-px bg-slate-100 w-full mb-12" />
              
              {/* Avantages */}
              <ul className="space-y-6 mb-16">
                {features.map((feature, index) => (
                  <motion.li 
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + (index * 0.1) }}
                    className="flex items-center gap-6 text-slate-600 text-lg font-bold tracking-tight"
                  >
                    <div className="bg-emerald-50 p-2 rounded-xl border border-emerald-100">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                    </div>
                    {feature}
                  </motion.li>
                ))}
              </ul>
              
              {/* Checkout Section */}
              <div className="space-y-8">
                <div className="p-3 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 shadow-inner group-hover:bg-white transition-colors duration-500">
                  <SubscriptionButton 
                    priceId={priceId} 
                    className="w-full bg-slate-950 text-white py-6 rounded-[2rem] font-black text-xl hover:bg-emerald-600 transition-all duration-500 shadow-xl shadow-slate-200 flex items-center justify-center gap-4 group/btn"
                  >
                    <span>Passer en Pro</span>
                    <Zap className="h-5 w-5 group-hover/btn:fill-white transition-all" />
                  </SubscriptionButton>
                </div>
                
                <div className="flex items-center justify-center gap-8">
                   <div className="flex items-center gap-2 text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">
                     <ShieldCheck className="h-4 w-4" /> Sécurité SSL
                   </div>
                   <div className="flex items-center gap-2 text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">
                     <Globe className="h-4 w-4" /> Stripe Gateway
                   </div>
                </div>
              </div>

              <p className="text-center text-[11px] text-slate-400 mt-10 font-bold uppercase tracking-widest leading-relaxed">
                Sans engagement. Annulation en 1 clic <br /> depuis votre espace propriétaire.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-20 text-slate-400 font-black text-[10px] uppercase tracking-[0.3em]"
        >
          Déjà <span className="text-slate-950 font-black underline decoration-emerald-400 decoration-4 underline-offset-4">150+ Agences</span> nous font confiance à Abidjan.
        </motion.p>

      </div>
    </div>
  );
}

export default PricingPage;