import React, { Suspense, lazy, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import LoginForm from '@/components/LoginForm';
import { Loader2 } from 'lucide-react';

// Chargement différé du Dashboard
const Dashboard = lazy(() => import('@/components/Dashboard'));

// Composant de chargement pour le Dashboard
const DashboardLoading = () => (
  <div className="min-h-screen flex flex-col items-center justify-center">
    <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
    <p className="text-gray-600">Chargement du tableau de bord...</p>
  </div>
);

const AuthenticatedApp = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Afficher l'état d'authentification actuel pour le débogage
  useEffect(() => {
    console.log('État d\'authentification:', isAuthenticated);
    console.log('État de chargement:', isLoading);
  }, [isAuthenticated, isLoading]);

  // Afficher un écran de chargement pendant la vérification de l'authentification
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Vérification de l'authentification...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {isAuthenticated ? (
        <Suspense fallback={<DashboardLoading />}>
          <Dashboard />
        </Suspense>
      ) : (
        <div className="min-h-screen flex items-center justify-center px-4">
          <LoginForm />
        </div>
      )}
    </div>
  );
};

export default AuthenticatedApp;