
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles = [] }: ProtectedRouteProps) => {
  const location = useLocation();
  
  // Check if user is authenticated
  const isAuthenticated = (): boolean => {
    const user = localStorage.getItem('currentUser');
    return !!user;
  };
  
  // Check if user has required role
  const hasRequiredRole = (): boolean => {
    if (!allowedRoles.length) return true;
    
    try {
      const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
      return allowedRoles.includes(user.role);
    } catch (error) {
      return false;
    }
  };
  
  if (!isAuthenticated()) {
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
