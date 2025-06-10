import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Navigate } from 'react-router-dom';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute = ({ children }: AdminProtectedRouteProps) => {
  const { adminUser, isAdminLoading } = useAdminAuth();

  if (isAdminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!adminUser) {
    return <Navigate to="/admin-setup" replace />;
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;