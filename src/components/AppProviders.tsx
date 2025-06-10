import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { AdminAuthProvider } from '@/contexts/AdminAuthContext';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';

// Create a client instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error && typeof error === 'object' && 'status' in error) {
          const status = error.status as number;
          if (status >= 400 && status < 500) {
            return false;
          }
        }
        return failureCount < 3;
      },
    },
    mutations: {
      retry: false,
    },
  },
});

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AdminAuthProvider>
          <TooltipProvider>
            {children}
            <Toaster />
          </TooltipProvider>
        </AdminAuthProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default AppProviders;