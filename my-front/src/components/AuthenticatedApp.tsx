
import React, { Suspense, lazy } from 'react';
import { useAuth } from '@/context/AuthContext';
import LoginForm from '@/components/LoginForm';
import { Loader2 } from 'lucide-react';

// Lazy load the Dashboard component
const Dashboard = lazy(() => import('@/components/Dashboard'));

// Loading component for Dashboard
const DashboardLoading = () => (
  <div className="min-h-screen flex flex-col items-center justify-center">
    <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
    <p className="text-gray-600">Loading dashboard...</p>
  </div>
);

const AuthenticatedApp = () => {
  const { isAuthenticated } = useAuth();

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
