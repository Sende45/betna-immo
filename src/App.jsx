import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import PropertyDetail from './pages/PropertyDetail';
import Login from './pages/Login'; 
import Header from './components/Header';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard'; 
// 💡 CORRECTION : Nom de fichier sans accent
import DashboardProprietaire from './pages/DashboardProprietaire';
import Catalogue from './pages/Catalogue';
import DashboardAdmin from './pages/DashboardAdmin';
import DashboardClient from './pages/DashboardClient'; 
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
              
              {/* Route admin - pensez à la protéger avec ProtectedRoute si nécessaire */}
              <Route path="/admin" element={<DashboardAdmin />} /> 
              
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