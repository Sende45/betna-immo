import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase'; 
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore'; 
import { Loader2 } from 'lucide-react';

// 💡 CORRECTION : Vérifiez que les chemins sont corrects (ex: si ces fichiers sont dans src/pages/)
import DashboardAdmin from './DashboardAdmin'; // 💡 CHANGÉ : ./Dashboard -> ./DashboardAdmin
import DashboardProprietaire from './DashboardProprietaire';
import DashboardClient from './DashboardClient';
// 💡 SUPPRIMÉ : Deuxième import de DashboardProprietaire

function Dashboard() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null); 
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        
        try {
          const docRef = doc(db, "users", currentUser.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          } else {
            console.error("Aucun document utilisateur trouvé!");
          }
        } catch (error) {
          console.error("Erreur Firestore :", error);
        }
      } else {
        navigate('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe(); 
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  if (loading) return (
      <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
      </div>
  );

  if (!user || !userData) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-900">Betna <span className='text-emerald-600'>Immo</span></h1>
            <div className='flex items-center gap-4'>
                <span className='text-sm text-gray-600'>{user.email}</span>
                <button 
                onClick={handleLogout}
                className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-lg font-semibold hover:bg-red-100"
                >
                Déconnexion
                </button>
            </div>
        </div>
      </nav>

      {/* AFFICHAGE CONDITIONNEL SELON LE RÔLE */}
      {userData.role === 'admin' && <DashboardAdmin />}
      {userData.role === 'proprietaire' && <DashboardProprietaire />}
      {userData.role === 'client' && <DashboardClient />}
      
      {!['admin', 'proprietaire', 'client'].includes(userData.role) && (
          <div className='text-center py-20'>Rôle non reconnu ou en attente de validation.</div>
      )}
    </div>
  );
}

export default Dashboard;