import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles = [] }: ProtectedRouteProps) => {
  const location = useLocation();
  const { isAuthenticated, userProfile, isLoading } = useAuth();
  
  // While authentication is being checked, show nothing
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <p>Chargement...</p>
    </div>;
  }

  // Check if user has required role(s)
  const hasRequiredRole = (): boolean => {
    if (!allowedRoles.length) return true; // Allow access if no roles are required
    
    if (!userProfile) return false; // If no userProfile, deny access

    // Check if the user has any of the allowed roles
    return allowedRoles.some(role => userProfile.roles.includes(role));
  };

  if (!isAuthenticated) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !hasRequiredRole()) {
    // Redirect to unauthorized page if the user doesn't have required roles
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
