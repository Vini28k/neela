import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import LoadingSpinner from '@/components/ui/loading-spinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  console.log('🔍 ProtectedRoute: Checking authentication', {
    isAuthenticated,
    isLoading,
    path: location.pathname
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    // Redirect to auth page with return URL
    return <Navigate to="/auth\" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;