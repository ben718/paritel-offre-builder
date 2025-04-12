
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles = [] }: ProtectedRouteProps) => {
  const location = useLocation();
  const { isAuthenticated, user, isLoading } = useAuth();
  
  // While authentication is being checked, show nothing
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <p>Chargement...</p>
    </div>;
  }
  
  // Check if user has required role
  const hasRequiredRole = (): boolean => {
    if (!allowedRoles.length) return true;
    
    if (!user) return false;
    
    return allowedRoles.includes(user.role);
  };
  
  if (!isAuthenticated) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (allowedRoles.length > 0 && !hasRequiredRole()) {
    // Redirect to unauthorized page
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
