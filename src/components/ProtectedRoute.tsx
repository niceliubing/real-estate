import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
  const { user } = useAuth();

  // Only require login for admin routes
  if (requireAdmin) {
    if (!user) {
      return <Navigate to="/login" />;
    }

    if (user.role !== 'admin') {
      return <Navigate to="/" />;
    }
  }

  // Non-admin routes don't require authentication
  return <>{children}</>;
};

export default ProtectedRoute;
