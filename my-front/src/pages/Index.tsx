
import React, { Suspense } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { TransactionProvider } from '@/context/TransactionContext';
import { Loader2 } from 'lucide-react';
import AuthenticatedApp from '@/components/AuthenticatedApp';

// Loading component
const AppLoading = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
  </div>
);

const Index = () => {
  return (
    <Suspense fallback={<AppLoading />}>
      <AuthProvider>
        <TransactionProvider>
          <AuthenticatedApp />
        </TransactionProvider>
      </AuthProvider>
    </Suspense>
  );
};

export default Index;
