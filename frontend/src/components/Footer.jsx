import React from 'react';
import { Mail, Phone, MapPin, Building, Facebook, Instagram, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900">
      <div className="max-w-7xl mx-auto py-16 px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          
          {/* Colonne 1 : Identité & Vision */}
          <div className="col-span-1 md:col-span-1 space-y-6">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-emerald-600 p-1.5 rounded-lg group-hover:rotate-12 transition-transform duration-500">
                <Building className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-black text-white tracking-tighter">
                BETNA<span className='text-emerald-500'>.IMMO</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed font-medium">
              La plateforme de référence pour l'immobilier certifié en Côte d'Ivoire. Nous connectons propriétaires et locataires en toute confiance.
            </p>
            {/* Réseaux Sociaux */}
            <div className="flex gap-4">
               <a href="#" className="p-2 bg-slate-900 rounded-xl hover:text-emerald-500 transition-colors"><Facebook size={18} /></a>
               <a href="#" className="p-2 bg-slate-900 rounded-xl hover:text-emerald-500 transition-colors"><Instagram size={18} /></a>
               <a href="#" className="p-2 bg-slate-900 rounded-xl hover:text-emerald-500 transition-colors"><Twitter size={18} /></a>
            </div>
          </div>
          
          {/* Colonne 2 : Navigation */}
          <div>
            <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-6">Navigation</h3>
            <ul className="space-y-4 text-sm font-bold">
              <li><Link to="/catalogue" className="hover:text-emerald-500 transition-colors">Explorer les biens</Link></li>
              <li><Link to="/abonnement" className="hover:text-emerald-500 transition-colors">Tarifs Propriétaires</Link></li>
              <li><Link to="/chat" className="hover:text-emerald-500 transition-colors">Assistant IA</Link></li>
              <li><Link to="/register" className="hover:text-emerald-500 transition-colors">Devenir Partenaire</Link></li>
            </ul>
          </div>
          
          {/* Colonne 3 : Support & Légal */}
          <div>
            <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-6">Support</h3>
            <ul className="space-y-4 text-sm font-bold">
              <li><a href="#" className="hover:text-emerald-500 transition-colors">Centre d'aide</a></li>
              <li><a href="#" className="hover:text-emerald-500 transition-colors">Guide de location</a></li>
              <li><a href="#" className="hover:text-emerald-500 transition-colors">Confidentialité</a></li>
              <li><a href="#" className="hover:text-emerald-500 transition-colors">CGU / Mentions</a></li>
            </ul>
          </div>

          {/* Colonne 4 : Bureau Local */}
          <div>
            <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-6">Contact</h3>
            <ul className="space-y-4 text-sm font-bold">
              <li className="flex items-center gap-3 group">
                <div className="p-2 bg-slate-900 rounded-lg group-hover:bg-emerald-500/10 group-hover:text-emerald-500 transition-colors">
                    <Mail size={16} />
                </div>
                <span>contact@betnaimmo.ci</span>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="p-2 bg-slate-900 rounded-lg group-hover:bg-emerald-500/10 group-hover:text-emerald-500 transition-colors">
                    <Phone size={16} />
                </div>
                <span>+225 00 00 00 00 00</span>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="p-2 bg-slate-900 rounded-lg group-hover:bg-emerald-500/10 group-hover:text-emerald-500 transition-colors">
                    <MapPin size={16} />
                </div>
                <span>Abidjan, Cocody Riviera</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Copyright & Crédits */}
        <div className="mt-16 pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-600">
          <p>&copy; {new Date().getFullYear()} BETNA IMMO GROUP. TOUS DROITS RÉSERVÉS.</p>
          <p className="flex items-center gap-2">
            DESIGNED BY <span className="text-white">SENDE STUDIO</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;