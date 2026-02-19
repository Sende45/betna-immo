import React, { useState } from 'react';
import { 
  Mail, Lock, Eye, EyeOff, User, Phone, 
  Building2, ArrowRight, UserPlus, Sparkles 
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const isRegistering = location.pathname === '/register';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('client');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isRegistering) {
        const defaultSubscription = {
          plan: "aucun",
          actif: false,
          dateDebut: null,
          dateFin: null
        };
        await register(email, password, role, fullName, phone, defaultSubscription);
        navigate(role === 'proprietaire' ? '/dashboard-proprio' : '/dashboard-client');
      } else {
        await login(email, password);
        navigate('/');
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Éléments de décoration en arrière-plan */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-100 rounded-full blur-3xl opacity-50" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center">
          <div className="bg-white p-3 rounded-2xl shadow-xl shadow-emerald-100 border border-emerald-50">
            <Building2 className="h-10 w-10 text-emerald-600" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-4xl font-extrabold text-gray-900 tracking-tight">
          {isRegistering ? "Bienvenue chez nous" : "Ravi de vous revoir"}
        </h2>
        <p className="mt-2 text-center text-gray-500 font-medium">
          {isRegistering ? "Commencez votre aventure immobilière" : "Accédez à votre espace personnel"}
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white/80 backdrop-blur-xl py-10 px-6 shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-3xl sm:px-12 border border-white">
          <form className="space-y-5" onSubmit={handleSubmit}>
            
            {isRegistering && (
              <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="mb-5">
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Vous êtes ?</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['client', 'proprietaire'].map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRole(r)}
                        className={`py-2 px-4 rounded-xl text-sm font-medium border-2 transition-all ${
                          role === r 
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-700' 
                          : 'border-gray-100 bg-gray-50 text-gray-500 hover:bg-gray-100'
                        }`}
                      >
                        {r.charAt(0).toUpperCase() + r.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="relative group">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                      <input 
                        type="text" 
                        required 
                        value={fullName} 
                        onChange={e => setFullName(e.target.value)} 
                        className="block w-full pl-11 pr-4 py-3 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none text-gray-700 placeholder-gray-400" 
                        placeholder="Nom complet" 
                      />
                    </div>
                  </div>
                  <div>
                    <div className="relative group">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                      <input 
                        type="tel" 
                        required 
                        value={phone} 
                        onChange={e => setPhone(e.target.value)} 
                        className="block w-full pl-11 pr-4 py-3 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none text-gray-700 placeholder-gray-400" 
                        placeholder="Téléphone" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none text-gray-700 placeholder-gray-400"
                  placeholder="Adresse email"
                />
              </div>
            </div>

            <div>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-12 py-3 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none text-gray-700 placeholder-gray-400"
                  placeholder="Mot de passe"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {!isRegistering && (
              <div className="flex items-center justify-between px-1">
                <label className="flex items-center cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 transition-all" />
                  <span className="ml-2 text-sm text-gray-500 group-hover:text-gray-700 transition-colors">Rester connecté</span>
                </label>
                <a href="#" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">Oublié ?</a>
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-3 py-4 px-6 rounded-xl text-white bg-gray-900 hover:bg-emerald-600 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-gray-200 font-bold overflow-hidden relative group"
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isRegistering ? <UserPlus size={20} /> : <Sparkles size={20} />}
                  <span>{isRegistering ? "Créer mon compte" : "Se connecter"}</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-center text-sm text-gray-500">
              {isRegistering ? "Vous avez déjà un compte ?" : "Pas encore de compte ?"}
              <Link 
                to={isRegistering ? "/login" : "/register"}
                className="ml-2 font-bold text-emerald-600 hover:text-emerald-700 underline-offset-4 hover:underline transition-all"
              >
                {isRegistering ? "Connectez-vous" : "Inscrivez-vous gratuitement"}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;