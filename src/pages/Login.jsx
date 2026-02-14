import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, User, Phone, Building, ArrowRight, UserPlus } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
// IMPORT DU CONTEXTE
import { useAuth } from '../context/AuthContext'; 

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  // RÉCUPÉRATION DES FONCTIONS DU CONTEXTE
  const { login, register } = useAuth(); 

  // 💡 Détermine si on est sur la page inscription selon l'URL
  const isRegistering = location.pathname === '/register';

  // États pour gérer les champs du formulaire
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  // 💡 ÉTAT POUR LE RÔLE (POUR L'INSCRIPTION)
  const [role, setRole] = useState('client'); 

  // Fonction pour gérer la soumission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegistering) {
        // A. & B. Créer l'utilisateur + document Firestore via le contexte
        await register(email, password, role, fullName, phone);
        alert("Compte créé avec succès !");
        
        // 💡 Redirection intelligente basée sur le rôle
        navigate(role === 'proprietaire' ? '/dashboard-proprio' : '/dashboard-client');
      } else {
        // Connexion via le contexte
        await login(email, password);
        
        // 💡 La redirection basée sur le rôle se fera dans le composant de tableau de bord
        // ou via le ProtectedRoute dans App.jsx
        navigate('/'); 
      }
    } catch (error) {
      console.error(error);
      alert(error.message); // Afficher l'erreur (email déjà utilisé, etc.)
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
            <Building className="h-12 w-12 text-emerald-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {isRegistering ? "Créer votre compte" : "Connectez-vous"}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {isRegistering ? "Déjà membre ?" : "Nouveau sur Betna Immo ?"}
          
          <Link 
            to={isRegistering ? "/login" : "/register"}
            className="ml-2 font-medium text-emerald-600 hover:text-emerald-500"
          >
            {isRegistering ? "Connectez-vous ici" : "Créez un compte gratuitement"}
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm rounded-2xl sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {isRegistering && (
              <>
                {/* 💡 SÉLECTEUR DE RÔLE */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Je suis un :</label>
                  <select 
                    value={role} 
                    onChange={e => setRole(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md"
                  >
                    <option value="client">Client</option>
                    <option value="proprietaire">Propriétaire</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Nom Complet</label>
                  <div className="mt-1 relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input type="text" required value={fullName} onChange={e => setFullName(e.target.value)} className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm" placeholder="Jean Dupont" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                  <div className="mt-1 relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)} className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm" placeholder="+235 99 00 00 00" />
                  </div>
                </div>
              </>
            )}

             <div>
                  <label className="block text-sm font-medium text-gray-700">Adresse Email</label>
                  <div className="mt-1 relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
                  <div className="mt-1 relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="appearance-none block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

            {!isRegistering && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input id="remember-me" type="checkbox" className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded" />
                    <label className="ml-2 block text-sm text-gray-900">Se souvenir de moi</label>
                  </div>
                  <div className="text-sm">
                    <a href="#" className="font-medium text-emerald-600 hover:text-emerald-500">Mot de passe oublié ?</a>
                  </div>
                </div>
            )}

            <div>
              <button type="submit" className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-emerald-700 transition">
                {isRegistering ? (
                    <>
                        <UserPlus size={18} />
                        S'inscrire
                    </>
                ) : (
                    <>
                        <ArrowRight size={18} />
                        Se connecter
                    </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;