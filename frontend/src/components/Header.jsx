import React, { useState, useEffect } from 'react';
import { 
  Menu, X, Home, Building, LogIn, UserCircle, LogOut, 
  LayoutDashboard, PlusCircle, User, LayoutGrid, CreditCard, MessageSquare 
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Effet de scroll pour changer l'apparence du header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDashboardRedirect = () => {
    setIsOpen(false);
    if (!user) navigate('/login');
    else if (user.role === 'admin') navigate('/admin');
    else if (user.role === 'proprietaire') navigate('/dashboard-proprio');
    else navigate('/dashboard-client');
  };

  return (
    <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? "bg-white/80 backdrop-blur-md shadow-lg py-2" 
        : "bg-white py-4"
    } border-b border-gray-100`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-12 items-center">
          
          {/* Logo avec animation au survol */}
          <Link to="/" className="group flex-shrink-0 flex items-center gap-2">
            <div className="bg-emerald-600 p-1.5 rounded-lg group-hover:rotate-12 transition-transform duration-300">
                <Building className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900 tracking-tight">
              Betna<span className='text-emerald-600 group-hover:text-emerald-500 transition-colors'>Immo</span>
            </span>
          </Link>
          
          {/* Menu Desktop */}
          <div className="hidden md:flex items-center space-x-1">
            <NavLink to="/" icon={Home} label="Accueil" active={location.pathname === "/"} />
            <NavLink to="/catalogue" icon={LayoutGrid} label="Catalogue" active={location.pathname === "/catalogue"} />
            <NavLink to="/chat" icon={MessageSquare} label="Assistant IA" active={location.pathname === "/chat"} />
            <NavLink to="/abonnement" icon={CreditCard} label="Abonnement" active={location.pathname === "/abonnement"} />
            
            <div className="h-6 w-[1px] bg-gray-200 mx-2" /> {/* Séparateur */}

            {user ? (
                <div className="flex items-center gap-2 ml-2">
                    <button 
                      onClick={handleDashboardRedirect} 
                      className="flex items-center gap-2 px-3 py-2 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-all duration-300 border border-emerald-100"
                    >
                        <UserCircle size={18} />
                        <span className="text-sm font-semibold max-w-[100px] truncate">
                            {user.name || "Mon Compte"}
                        </span>
                    </button>
                    <button 
                      onClick={logout} 
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-300"
                      title="Déconnexion"
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            ) : (
                <Link to="/login" className="relative inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-full text-sm font-bold overflow-hidden group transition-all duration-300 hover:bg-emerald-600 hover:shadow-lg active:scale-95">
                  <LogIn className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  <span>Connexion</span>
                </Link>
            )}
          </div>

          {/* Hamburger Mobile */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className={`p-2 rounded-lg transition-colors ${isOpen ? "bg-emerald-50 text-emerald-600" : "text-gray-600"}`}
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile avec animation slide down */}
      <div className={`md:hidden absolute w-full bg-white border-b shadow-xl transition-all duration-300 ease-in-out ${
        isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"
      }`}>
        <div className="px-4 pt-2 pb-6 space-y-2">
          <MobileNavLink to="/" icon={Home} label="Accueil" onClick={() => setIsOpen(false)} />
          <MobileNavLink to="/catalogue" icon={LayoutGrid} label="Catalogue" onClick={() => setIsOpen(false)} />
          <MobileNavLink to="/chat" icon={MessageSquare} label="Assistant IA" onClick={() => setIsOpen(false)} />
          <MobileNavLink to="/abonnement" icon={CreditCard} label="Abonnement" onClick={() => setIsOpen(false)} />
          
          <div className="pt-4 border-t border-gray-100">
            {user ? (
                <div className="space-y-2">
                    <button onClick={handleDashboardRedirect} className="flex w-full items-center justify-between p-3 rounded-xl bg-gray-50 text-gray-900 font-semibold">
                        <div className="flex items-center gap-3">
                            <UserCircle className="text-emerald-600" />
                            Mon Profil
                        </div>
                        <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md uppercase tracking-wider">{user.role}</span>
                    </button>
                    <button onClick={logout} className="flex w-full items-center gap-3 p-3 rounded-xl text-red-600 hover:bg-red-50 font-semibold transition-colors">
                        <LogOut size={20} />
                        Déconnexion
                    </button>
                </div>
            ) : (
                <Link to="/login" onClick={() => setIsOpen(false)} className="flex items-center justify-center gap-2 bg-emerald-600 text-white p-4 rounded-xl font-bold shadow-md">
                  <LogIn size={20} />
                  Se connecter
                </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

// Composant NavLink Desktop avec effet de barre de soulignement animée
const NavLink = ({ icon: Icon, label, to, active }) => (
  <Link 
    to={to} 
    className={`relative group flex items-center gap-1.5 px-4 py-2 text-sm font-bold transition-all duration-300 ${
      active ? "text-emerald-600" : "text-gray-600 hover:text-emerald-600"
    }`}
  >
    <Icon className={`h-4.5 w-4.5 transition-transform duration-300 group-hover:-translate-y-0.5 ${active ? "animate-pulse" : ""}`} />
    <span>{label}</span>
    {/* Barre de soulignement */}
    <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-emerald-600 transition-all duration-300 ${
      active ? "w-2/3" : "w-0 group-hover:w-1/2"
    }`} />
  </Link>
);

const MobileNavLink = ({ icon: Icon, label, to, onClick }) => (
  <Link 
    to={to} 
    onClick={onClick} 
    className="flex items-center gap-4 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 p-3 rounded-xl transition-all duration-200"
  >
    <div className="bg-gray-100 p-2 rounded-lg group-hover:bg-white transition-colors">
        <Icon size={20} />
    </div>
    <span className="font-semibold text-lg">{label}</span>
  </Link>
);

export default Header;