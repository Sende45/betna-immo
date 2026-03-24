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

  const handleDashboardRedirect = () => {
    setIsOpen(false);
    if (!user) navigate('/login');
    else navigate('/dashboard');
  };

  return (
    <nav className={`fixed w-full top-0 z-50 transition-all duration-500 ${
      scrolled 
        ? "bg-white/80 backdrop-blur-xl shadow-2xl shadow-slate-200/50 py-3" 
        : "bg-white py-5"
    } border-b border-slate-50`}>
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="flex justify-between h-12 items-center">
          
          {/* Logo Premium */}
          <Link to="/" className="group flex items-center gap-3">
            <div className="bg-slate-950 p-2 rounded-xl group-hover:bg-emerald-600 group-hover:rotate-12 transition-all duration-500 shadow-lg shadow-slate-200">
                <Building className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-black text-slate-950 tracking-tighter">
              BETNA<span className='text-emerald-600'>.IMMO</span>
            </span>
          </Link>
          
          {/* Menu Desktop */}
          <div className="hidden lg:flex items-center space-x-1 bg-slate-50/50 p-1 rounded-full border border-slate-100">
            <NavLink to="/" icon={Home} label="Accueil" active={location.pathname === "/"} />
            <NavLink to="/catalogue" icon={LayoutGrid} label="Catalogue" active={location.pathname === "/catalogue"} />
            <NavLink to="/chat" icon={MessageSquare} label="Assistant" active={location.pathname === "/chat"} />
            <NavLink to="/abonnement" icon={CreditCard} label="Abonnement" active={location.pathname === "/abonnement"} />
            
            {/* Lien Admin - Uniquement si user est admin */}
            {user?.role === 'admin' && (
              <NavLink 
                to="/admin" 
                icon={ShieldCheck} 
                label="Admin" 
                active={location.pathname.startsWith("/admin")} 
              />
            )}
          </div>

          {/* Actions Utilisateur */}
          <div className="hidden lg:flex items-center gap-4">
            {user ? (
                <div className="flex items-center gap-3">
                    <button 
                      onClick={handleDashboardRedirect} 
                      className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white text-slate-900 hover:bg-slate-50 transition-all duration-300 border border-slate-100 shadow-sm group"
                    >
                        <UserCircle size={18} className="text-emerald-600" />
                        <span className="text-xs font-black uppercase tracking-widest">
                            {user.fullName?.split(' ')[0] || "Compte"}
                        </span>
                    </button>
                    <button 
                      onClick={logout} 
                      className="p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all duration-300"
                      title="Déconnexion"
                    >
                        <LogOut size={20} />
                    </button>
                </div>
            ) : (
                <Link to="/login" className="bg-slate-950 text-white px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:bg-emerald-600 hover:shadow-xl hover:shadow-emerald-200 transition-all duration-300 active:scale-95 flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  Connexion
                </Link>
            )}
          </div>

          {/* Hamburger Mobile */}
          <div className="lg:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className={`p-3 rounded-2xl transition-all ${isOpen ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-600"}`}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden absolute w-full bg-white border-b border-slate-100 shadow-2xl p-6 space-y-3"
          >
            <MobileNavLink to="/" icon={Home} label="Accueil" onClick={() => setIsOpen(false)} />
            <MobileNavLink to="/catalogue" icon={LayoutGrid} label="Catalogue" onClick={() => setIsOpen(false)} />
            <MobileNavLink to="/chat" icon={MessageSquare} label="Assistant IA" onClick={() => setIsOpen(false)} />
            <MobileNavLink to="/abonnement" icon={CreditCard} label="Tarifs" onClick={() => setIsOpen(false)} />
            
            {/* Lien Admin Mobile */}
            {user?.role === 'admin' && (
              <MobileNavLink to="/admin" icon={ShieldCheck} label="Administration" onClick={() => setIsOpen(false)} />
            )}
            
            <div className="pt-6 mt-6 border-t border-slate-50">
              {user ? (
                  <div className="space-y-3">
                      <button onClick={handleDashboardRedirect} className="flex w-full items-center justify-between p-5 rounded-[1.5rem] bg-slate-50 text-slate-900 group">
                          <div className="flex items-center gap-4">
                              <UserCircle className="text-emerald-600" size={24} />
                              <span className="font-black text-sm uppercase tracking-widest">Tableau de Bord</span>
                          </div>
                          <ChevronRight size={18} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                      </button>
                      <button onClick={logout} className="flex w-full items-center gap-4 p-5 rounded-[1.5rem] text-rose-500 hover:bg-rose-50 font-black text-sm uppercase tracking-widest transition-all">
                          <LogOut size={22} />
                          Déconnexion
                      </button>
                  </div>
              ) : (
                  <Link to="/login" onClick={() => setIsOpen(false)} className="flex items-center justify-center gap-3 bg-slate-950 text-white p-5 rounded-[1.5rem] font-black uppercase tracking-widest text-sm shadow-xl">
                    <LogIn size={20} />
                    Accès Membre
                  </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

// Composants utilitaires pour la clarté
const NavLink = ({ icon: Icon, label, to, active }) => (
  <Link 
    to={to} 
    className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-300 ${
      active 
        ? "bg-white text-emerald-600 shadow-sm" 
        : "text-slate-400 hover:text-slate-900 hover:bg-white/50"
    }`}
  >
    <Icon size={16} className={active ? "animate-pulse" : ""} />
    <span>{label}</span>
  </Link>
);

const MobileNavLink = ({ icon: Icon, label, to, onClick }) => (
  <Link 
    to={to} 
    onClick={onClick} 
    className="flex items-center gap-5 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 p-5 rounded-[1.5rem] transition-all group"
  >
    <div className="bg-slate-50 p-3 rounded-2xl group-hover:bg-white transition-colors">
        <Icon size={22} />
    </div>
    <span className="font-black uppercase tracking-widest text-sm">{label}</span>
  </Link>
);

export default Header;