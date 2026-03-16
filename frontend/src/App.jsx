import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react'; 
import Header from './components/Header';
import Footer from './components/Footer';
import { AuthProvider, useAuth } from './context/AuthContext';

// Chargement dynamique des pages pour la performance
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

// Composant pour protéger les routes
const ProtectedRoute = ({ children, allowedRole }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/" />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            {/* Suspense gère l'attente pendant que le JS de la page charge */}
            <Suspense fallback={<div className="p-10 text-center">Chargement de la page...</div>}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/property/:id" element={<PropertyDetail />} />
                <Route path="/login" element={<Login />} /> 
                <Route path="/register" element={<Login />} />
                <Route path="/catalogue" element={<Catalogue />} />
                <Route path="/abonnement" element={<PricingPage />} />
                
                <Route path="/admin" element={
                  <ProtectedRoute allowedRole="admin">
                    <DashboardAdmin />
                  </ProtectedRoute>
                } /> 

                <Route path="/chat" element={
                  <ProtectedRoute>
                    <ChatImmobilier />
                  </ProtectedRoute>
                } />
                
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                
                <Route path="/dashboard-proprio" element={
                  <ProtectedRoute allowedRole="proprietaire">
                    <DashboardProprietaire />
                  </ProtectedRoute>
                } />

                <Route path="/dashboard-client" element={
                  <ProtectedRoute allowedRole="client">
                    <DashboardClient />
                  </ProtectedRoute>
                } />
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