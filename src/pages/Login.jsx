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
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* 🌌 Background Décoratif Dynamique */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-100/50 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        <div className="flex justify-center mb-8">
          <motion.div 
            whileHover={{ rotate: 10, scale: 1.1 }}
            className="bg-white p-4 rounded-[2rem] shadow-2xl shadow-emerald-100/50 border border-emerald-50"
          >
            <Building2 className="h-12 w-12 text-emerald-600" />
          </motion.div>
        </div>
        
        <h2 className="text-center text-5xl font-black text-slate-950 tracking-tighter mb-2">
          {isRegistering ? "Bienvenue." : "Bon retour."}
        </h2>
        <p className="text-center text-slate-500 font-medium text-lg">
          {isRegistering ? "Créez votre accès privilégié" : "Reprenez là où vous vous étiez arrêté"}
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="mt-10 sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        <div className="bg-white/80 backdrop-blur-2xl py-10 px-8 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] rounded-[3rem] border border-white">
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
                    <span className="block text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Type de compte</span>
                    <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-100/50 rounded-[1.5rem]">
                      {['client', 'proprietaire'].map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setRole(r)}
                          className={`relative py-3 rounded-2xl text-sm font-black transition-all duration-300 flex items-center justify-center gap-2 ${
                            role === r 
                            ? 'bg-white text-emerald-600 shadow-sm' 
                            : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          {role === r && <CheckCircle2 size={16} className="text-emerald-500" />}
                          {r.charAt(0).toUpperCase() + r.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                      <input 
                        type="text" required value={fullName} 
                        onChange={e => setFullName(e.target.value)} 
                        className="w-full pl-12 pr-4 py-4 bg-slate-50/50 border border-slate-100 rounded-[1.25rem] focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-medium"
                        placeholder="Votre nom complet" 
                      />
                    </div>
                    <div className="relative group">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                      <input 
                        type="tel" required value={phone} 
                        onChange={e => setPhone(e.target.value)} 
                        className="w-full pl-12 pr-4 py-4 bg-slate-50/50 border border-slate-100 rounded-[1.25rem] focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-medium"
                        placeholder="N° de téléphone" 
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-4">
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  type="email" required value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50/50 border border-slate-100 rounded-[1.25rem] focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-medium"
                  placeholder="Email professionnel"
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  required value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-12 pr-14 py-4 bg-slate-50/50 border border-slate-100 rounded-[1.25rem] focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-medium"
                  placeholder="Mot de passe"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {!isRegistering && (
              <div className="flex items-center justify-between px-2">
                <label className="flex items-center cursor-pointer group">
                  <input type="checkbox" className="w-5 h-5 rounded-lg border-slate-200 text-emerald-600 focus:ring-emerald-500 transition-all" />
                  <span className="ml-3 text-sm font-bold text-slate-500 group-hover:text-slate-800 transition-colors">Rester connecté</span>
                </label>
                <button type="button" className="text-sm font-black text-emerald-600 hover:text-emerald-700">Oublié ?</button>
              </div>
            )}

            <motion.button 
              whileTap={{ scale: 0.98 }}
              type="submit" 
              disabled={isLoading}
              className="w-full relative flex justify-center items-center gap-3 py-5 rounded-[1.25rem] text-white bg-slate-950 hover:bg-emerald-600 transition-all duration-300 shadow-xl shadow-slate-200 font-black text-lg group"
            >
              {isLoading ? (
                <div className="h-6 w-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isRegistering ? <UserPlus size={22} /> : <Sparkles size={22} />}
                  <span>{isRegistering ? "Finaliser l'inscription" : "Connexion sécurisée"}</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform" />
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-100">
            <p className="text-center font-medium text-slate-500">
              {isRegistering ? "Déjà membre ?" : "Nouveau sur Betna Immo ?"}
              <Link 
                to={isRegistering ? "/login" : "/register"}
                className="ml-2 font-black text-emerald-600 hover:text-emerald-700 underline underline-offset-8 decoration-2 decoration-emerald-200 hover:decoration-emerald-500 transition-all"
              >
                {isRegistering ? "Connectez-vous" : "Créez un compte gratuit"}
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;