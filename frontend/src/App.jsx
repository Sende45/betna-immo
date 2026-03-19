import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react'; 
import Header from './components/Header';
import Footer from './components/Footer';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Loader2 } from 'lucide-react';

// Chargement dynamique (Code Splitting)
const Home = lazy(() => import('./pages/Home'));
const PropertyDetail = lazy(() => import('./pages/PropertyDetail'));
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const DashboardProprietaire = lazy(() => import('./pages/DashboardProprietaire'));
const Catalogue = lazy(() => import('./pages/Catalogue'));
const DashboardAdmin = lazy(() => import('./pages/DashboardAdmin'));
const DashboardClient = lazy(() => import('./pages/DashboardClient'));
const ChatImmobilier = lazy(() => import('./pages/ChatImmobilier'));
const PricingPage = lazy(() => import('./pages/Pricing'));

/**
 * 🛡️ Composant de Protection des Routes
 * Gère l'attente du chargement de l'auth et les restrictions par rôle.
 */
const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, loading } = useAuth();
  
  // 1. On attend que l'auth vérifie le token avant de décider du sort de l'user
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
      </div>
    );
  }
  
  // 2. Si pas d'utilisateur après chargement -> Direction Login
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // 3. Si un rôle spécifique est requis (ex: admin)
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

/**
 * 🔄 Loader de secours pour Suspense (Transition fluide entre les pages)
 */
const PageLoader = () => (
  <div className="flex flex-col items-center justify-center py-40">
    <Loader2 className="w-10 h-10 animate-spin text-emerald-600 mb-4" />
    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
      Chargement de l'espace...
    </p>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-white selection:bg-emerald-100 selection:text-emerald-900">
          <Header />
          
          <main className="flex-grow pt-16"> {/* Padding-top pour ne pas être sous le header fixe */}
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* 🌏 Routes Publiques */}
                <Route path="/" element={<Home />} />
                <Route path="/catalogue" element={<Catalogue />} />
                <Route path="/property/:id" element={<PropertyDetail />} />
                <Route path="/login" element={<Login />} /> 
                <Route path="/register" element={<Login />} />
                <Route path="/abonnement" element={<PricingPage />} />
                
                {/* 🛡️ Routes Sécurisées - Dashboard Global */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />

                {/* 💬 Chat en temps réel */}
                <Route path="/chat" element={
                  <ProtectedRoute>
                    <Suspense fallback={<PageLoader />}>
                      <ChatImmobilier />
                    </Suspense>
                  </ProtectedRoute>
                } />

                {/* 👑 Espace Administration */}
                <Route path="/admin" element={
                  <ProtectedRoute allowedRole="admin">
                    <DashboardAdmin />
                  </ProtectedRoute>
                } /> 
                
                {/* 🏘️ Espace Propriétaire */}
                <Route path="/dashboard-proprio" element={
                  <ProtectedRoute allowedRole="proprietaire">
                    <DashboardProprietaire />
                  </ProtectedRoute>
                } />

                {/* 👤 Espace Client */}
                <Route path="/dashboard-client" element={
                  <ProtectedRoute allowedRole="client">
                    <DashboardClient />
                  </ProtectedRoute>
                } />

                {/* 🚪 Fallback 404 - Redirige vers l'accueil */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </main>

          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;