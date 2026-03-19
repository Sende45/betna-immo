import React, { useState } from 'react';
import { 
  Mail, Lock, Eye, EyeOff, User, Phone, 
  Building2, ArrowRight, UserPlus, Sparkles, CheckCircle2
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import { motion, AnimatePresence } from 'framer-motion';

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
        
        // Redirection simplifiée vers le dashboard unique (qui gère les sous-vues par rôle)
        navigate('/dashboard');
      } else {
        const user = await login(email, password);
        
        // Redirection intelligente
        if (user?.role === 'admin') {
          navigate('/dashboard'); // Ou une route admin spécifique si tu préfères
        } else {
          navigate('/dashboard');
        }
      }
    } catch (error) {
      console.error("Erreur Auth:", error);
      const errorMsg = error.response?.data?.message || error.message || "Une erreur est survenue";
      alert(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-emerald-100">
      
      {/* 🌌 Background Décoratif (Optimisé v4) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-100/40 rounded-full blur-[100px]" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-100/40 rounded-full blur-[100px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        <div className="flex justify-center mb-10">
          <motion.div 
            whileHover={{ rotate: 10, scale: 1.1 }}
            className="bg-white p-5 rounded-[2.5rem] shadow-2xl shadow-emerald-200/50 border border-emerald-50"
          >
            <Building2 className="h-10 w-10 text-emerald-600" />
          </motion.div>
        </div>
        
        <h2 className="text-center text-5xl font-black text-slate-950 tracking-tighter mb-2">
          {isRegistering ? "Bienvenue." : "Bon retour."}
        </h2>
        <p className="text-center text-slate-500 font-bold text-base tracking-tight">
          {isRegistering ? "Créez votre accès privilégié" : "Reprenez là où vous vous étiez arrêté"}
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="mt-10 sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        {/* Utilisation de 'catalogue-glass' pour un rendu haut de gamme v4 */}
        <div className="catalogue-glass py-10 px-8 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] rounded-[3.5rem] border border-white">
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            <AnimatePresence mode="wait">
              {isRegistering && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-5"
                >
                  <div>
                    <span className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-1">Type de profil</span>
                    <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-100/50 rounded-2xl">
                      {['client', 'proprietaire'].map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setRole(r)}
                          className={`relative py-3 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 ${
                            role === r 
                            ? 'bg-white text-emerald-600 shadow-sm' 
                            : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          {role === r && <CheckCircle2 size={14} className="text-emerald-500" />}
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="relative group">
                      <User className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                      <input 
                        type="text" required value={fullName} 
                        onChange={e => setFullName(e.target.value)} 
                        className="w-full pl-14 pr-6 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-bold placeholder:text-slate-400"
                        placeholder="Nom complet" 
                      />
                    </div>
                    <div className="relative group">
                      <Phone className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                      <input 
                        type="tel" required value={phone} 
                        onChange={e => setPhone(e.target.value)} 
                        className="w-full pl-14 pr-6 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-bold placeholder:text-slate-400"
                        placeholder="N° de téléphone" 
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-4">
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                <input
                  type="email" required value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-bold placeholder:text-slate-400"
                  placeholder="Email"
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  required value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-14 pr-14 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-bold placeholder:text-slate-400"
                  placeholder="Mot de passe"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {!isRegistering && (
              <div className="flex items-center justify-between px-2">
                <label className="flex items-center cursor-pointer group">
                  <input type="checkbox" className="w-5 h-5 rounded-lg border-slate-200 text-emerald-600 focus:ring-emerald-500 transition-all" />
                  <span className="ml-3 text-xs font-black text-slate-500 group-hover:text-slate-900 uppercase tracking-tighter transition-all">Rester connecté</span>
                </label>
                <button type="button" className="text-xs font-black text-emerald-600 hover:text-emerald-700 tracking-tighter uppercase">Oublié ?</button>
              </div>
            )}

            <motion.button 
              whileTap={{ scale: 0.98 }}
              type="submit" 
              disabled={isLoading}
              className="w-full relative flex justify-center items-center gap-3 py-5 rounded-[1.8rem] text-white bg-slate-950 hover:bg-emerald-600 transition-all duration-300 shadow-2xl shadow-slate-200 font-black text-lg group disabled:bg-slate-300"
            >
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin text-white" />
              ) : (
                <>
                  {isRegistering ? <UserPlus size={20} /> : <Sparkles size={20} />}
                  <span>{isRegistering ? "Créer mon accès" : "Se connecter"}</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-12 pt-10 border-t border-slate-100">
            <p className="text-center font-bold text-slate-500 text-sm">
              {isRegistering ? "Déjà membre ?" : "Nouveau sur Betna Immo ?"}
              <Link 
                to={isRegistering ? "/login" : "/register"}
                className="ml-3 font-black text-emerald-600 hover:text-emerald-700 underline underline-offset-8 decoration-2 decoration-emerald-100 hover:decoration-emerald-500 transition-all"
              >
                {isRegistering ? "Connexion" : "Créer un compte"}
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;