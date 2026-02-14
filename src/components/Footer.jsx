import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react'; // Icônes de contact

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 border-t-4 border-emerald-600">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          
          {/* Colonne 1 : Description */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-2xl font-bold text-white">
              Betna<span className='text-emerald-500'>Immo</span>
            </h3>
            <p className="mt-4 text-sm text-gray-400">
              La référence pour trouver un logement fiable et vérifié au Tchad.
            </p>
          </div>
          
          {/* Colonne 2 : Services */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Services</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><a href="#" className="hover:text-emerald-400 transition">Location</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition">Vente</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition">Vérification de biens</a></li>
            </ul>
          </div>
          
          {/* Colonne 3 : Entreprise */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Entreprise</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><a href="#" className="hover:text-emerald-400 transition">À propos</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition">Contact</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition">FAQ</a></li>
            </ul>
          </div>

          {/* Colonne 4 : Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Contact</h3>
            <ul className="mt-4 space-y-2 text-sm text-gray-400">
              <li className="flex items-center gap-2"><Mail size={16} /> info@betnaimmo.td</li>
              <li className="flex items-center gap-2"><Phone size={16} /> +235 00 00 00 00</li>
              <li className="flex items-center gap-2"><MapPin size={16} /> N'Djamena, Tchad</li>
            </ul>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="mt-12 border-t border-gray-700 pt-8 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Betna Immo. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}

export default Footer;