import React, { useState } from 'react';
// 💡 IMPORT de CreditCard pour l'icône de l'abonnement
import { Menu, X, Home, Building, LogIn, UserCircle, LogOut, LayoutDashboard, PlusCircle, User, LayoutGrid, CreditCard } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleDashboardRedirect = () => {
    if (!user) {
      navigate('/login');
    } else if (user.role === 'admin') {
      navigate('/admin');
    } else if (user.role === 'proprietaire') {
      navigate('/dashboard-proprio');
    } else {
      navigate('/dashboard-client');
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <Building className="h-8 w-8 text-emerald-600" />
              <span className="text-2xl font-bold text-gray-900">
                Betna<span className='text-emerald-700'>Immo</span>
              </span>
            </Link>
          </div>
          
          {/* Menu Desktop */}
          <div className="hidden md:flex items-center space-x-2">
            <NavLink to="/" icon={Home} label="Accueil" />
            
            <NavLink to="/catalogue" icon={LayoutGrid} label="Catalogue" />
            
            {/* 💡 LIEN ABONNEMENT DESKTOP */}
            <NavLink to="/abonnement" icon={CreditCard} label="Abonnement" />
            
            {user && user.role === 'admin' && (
                <NavLink to="/admin" icon={LayoutDashboard} label="Admin" />
            )}
            
            {user && user.role === 'proprietaire' && (
                <NavLink to="/dashboard-proprio" icon={PlusCircle} label="Mes Biens" />
            )}
            
            {user && user.role === 'client' && (
                <NavLink to="/dashboard-client" icon={User} label="Mes Activités" />
            )}

            {user ? (
                <div className="flex items-center gap-3 ml-4">
                    <button onClick={handleDashboardRedirect} className="text-sm font-medium text-gray-700 flex items-center gap-2 hover:text-emerald-600">
                        <UserCircle className="text-emerald-600" />
                        {user.name || user.email}
                    </button>
                    <button onClick={logout} className="text-gray-600 hover:text-red-600">
                        <LogOut size={20} />
                    </button>
                </div>
            ) : (
                <Link to="/login" className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-emerald-700 transition duration-300">
                  <LogIn className="h-4 w-4" />
                  Connexion
                </Link>
            )}
          </div>

          {/* Bouton Hamburger Mobile */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-900 hover:text-emerald-600 focus:outline-none">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <MobileNavLink to="/" icon={Home} label="Accueil" />
            
            <MobileNavLink to="/catalogue" icon={LayoutGrid} label="Catalogue" />

            {/* 💡 LIEN ABONNEMENT MOBILE */}
            <MobileNavLink to="/abonnement" icon={CreditCard} label="Abonnement" />
            
            {user ? (
                <>
                    <button onClick={handleDashboardRedirect} className="flex w-full items-center gap-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 block px-3 py-2 rounded-md text-base font-medium">
                        <UserCircle className="h-5 w-5" />
                        Mon Compte
                    </button>
                    <div className="px-3 py-2 text-sm text-gray-500">Connecté en tant que {user.name || user.email}</div>
                    <button onClick={logout} className="flex w-full items-center gap-2 text-red-600 hover:bg-red-50 block px-3 py-2 rounded-md text-base font-medium">
                        <LogOut className="h-5 w-5" />
                        Déconnexion
                    </button>
                </>
            ) : (
                <Link to="/login" className="flex items-center gap-2 bg-emerald-600 text-white block px-4 py-3 rounded-md text-base font-semibold">
                  <UserCircle className="h-5 w-5" />
                  Connexion
                </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

const NavLink = ({ icon: Icon, label, to }) => (
  <Link to={to} className="flex items-center gap-1.5 text-gray-700 hover:text-emerald-600 px-3 py-2 rounded-md text-sm font-medium transition">
    <Icon className="h-4 w-4" />
    {label}
  </Link>
);

const MobileNavLink = ({ icon: Icon, label, to }) => (
  <Link to={to} className="flex items-center gap-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 block px-3 py-2 rounded-md text-base font-medium">
    <Icon className="h-5 w-5" />
    {label}
  </Link>
);

export default Header;