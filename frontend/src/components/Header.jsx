import React, { useState, useEffect } from 'react';
import { 
  Menu, X, Home, Building, LogIn, UserCircle, LogOut, 
  LayoutGrid, CreditCard, MessageSquare, ChevronRight, ShieldCheck
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full top-0 z-50 transition-all duration-500 ${
      scrolled 
        ? "bg-white/90 backdrop-blur-xl shadow-sm py-2" 
        : "bg-white py-4"
    } border-b border-slate-50`}>
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
        <div className="flex justify-between h-12 items-center gap-4">
          
          {/* 1. LOGO (Taille réduite pour gagner de la place) */}
          <Link to="/" className="group flex items-center gap-2 flex-shrink-0">
            <div className="bg-slate-950 p-1.5 rounded-lg group-hover:bg-emerald-600 transition-colors">
                <Building className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-black text-slate-950 tracking-tighter">
              BETNA<span className='text-emerald-600'>.IMMO</span>
            </span>
          </Link>
          
          {/* 2. MENU CENTRAL (Texte plus petit pour éviter le chevauchement) */}
          <div className="hidden xl:flex items-center space-x-1 bg-slate-50/80 p-1 rounded-full border border-slate-100">
            <NavLink to="/" icon={Home} label="Accueil" active={location.pathname === "/"} />
            <NavLink to="/catalogue" icon={LayoutGrid} label="Catalogue" active={location.pathname === "/catalogue"} />
            <NavLink to="/chat" icon={MessageSquare} label="Assistant" active={location.pathname === "/chat"} />
            <NavLink to="/abonnement" icon={CreditCard} label="Tarifs" active={location.pathname === "/abonnement"} />
            
            {/* Lien Admin - Conditionnel */}
            {user?.role === 'admin' && (
              <NavLink to="/admin" icon={ShieldCheck} label="Admin" active={location.pathname.startsWith("/admin")} />
            )}
          </div>

          {/* 3. ACTIONS UTILISATEUR */}
          <div className="flex items-center gap-2">
            {user ? (
                <div className="flex items-center gap-2">
                    {/* Profil cliquable */}
                    <button 
                      onClick={() => navigate('/dashboard')} 
                      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-sm transition-all group"
                    >
                        <UserCircle size={16} className="text-emerald-600" />
                        <span className="text-[10px] font-bold uppercase tracking-tight text-slate-700">
                            {user.fullName?.split(' ')[0]}
                        </span>
                    </button>
                    {/* Logout discret */}
                    <button 
                      onClick={logout} 
                      className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                      title="Déconnexion"
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            ) : (
                <Link to="/login" className="bg-slate-950 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all">
                  Connexion
                </Link>
            )}

            {/* Menu Mobile Button */}
            <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2 text-slate-950">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-slate-50 overflow-hidden"
          >
            <div className="p-6 space-y-2">
                <MobileNavLink to="/" icon={Home} label="Accueil" onClick={() => setIsOpen(false)} />
                <MobileNavLink to="/catalogue" icon={LayoutGrid} label="Catalogue" onClick={() => setIsOpen(false)} />
                <MobileNavLink to="/chat" icon={MessageSquare} label="Assistant IA" onClick={() => setIsOpen(false)} />
                {user?.role === 'admin' && (
                    <MobileNavLink to="/admin" icon={ShieldCheck} label="Administration" onClick={() => setIsOpen(false)} />
                )}
                {user && (
                    <button onClick={() => {navigate('/dashboard'); setIsOpen(false);}} className="w-full mt-4 p-4 bg-emerald-50 text-emerald-700 rounded-2xl font-black text-[10px] uppercase tracking-widest flex justify-between items-center">
                        Mon Tableau de Bord <ChevronRight size={14} />
                    </button>
                )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

const NavLink = ({ icon: Icon, label, to, active }) => (
  <Link 
    to={to} 
    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider transition-all ${
      active ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500 hover:text-slate-900"
    }`}
  >
    <Icon size={13} />
    <span>{label}</span>
  </Link>
);

const MobileNavLink = ({ icon: Icon, label, to, onClick }) => (
  <Link to={to} onClick={onClick} className="flex items-center gap-4 p-3 text-slate-600 font-bold text-xs uppercase tracking-widest">
    <Icon size={18} /> {label}
  </Link>
);

export default Header;