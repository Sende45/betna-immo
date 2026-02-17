import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import PropertyDetail from './pages/PropertyDetail';
import Login from './pages/Login'; 
import Header from './components/Header';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard'; 
import DashboardProprietaire from './pages/DashboardProprietaire';
import Catalogue from './pages/Catalogue';
import DashboardAdmin from './pages/DashboardAdmin';
import DashboardClient from './pages/DashboardClient';
import ChatImmobilier from './pages/ChatImmobilier';

// 💡 AJOUT : Import de la page de tarification
import PricingPage from './pages/Pricing'; 
import { AuthProvider, useAuth } from './context/AuthContext'; 

// Composant pour protéger les routes
const ProtectedRoute = ({ children, allowedRole }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/" />; // Redirige si mauvais rôle
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
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/property/:id" element={<PropertyDetail />} />
              
              <Route path="/login" element={<Login />} /> 
              <Route path="/register" element={<Login />} />
              <Route path="/catalogue" element={<Catalogue />} />
              
              {/* 💡 MODIFICATION : Route admin protégée */}
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
              
              {/* 💡 AJOUT : Route vers la page de paiement */}
              <Route path="/abonnement" element={<PricingPage />} />
              
              {/* Route Générale Dashboard */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              {/* Route spécifique Propriétaire */}
              <Route path="/dashboard-proprio" element={
                <ProtectedRoute allowedRole="proprietaire">
                  <DashboardProprietaire />
                </ProtectedRoute>
              } />

              {/* Route spécifique Client */}
              <Route path="/dashboard-client" element={
                <ProtectedRoute allowedRole="client">
                  <DashboardClient />
                </ProtectedRoute>
              } />
              
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;