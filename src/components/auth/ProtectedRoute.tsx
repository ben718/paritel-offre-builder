
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles = [] }: ProtectedRouteProps) => {
  const location = useLocation();
  const { isAuthenticated, isReady, checkRouteAccess } = useAuth();
  
  // Show loading indicator while auth state is being determined
  if (!isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 text-paritel-primary animate-spin" />
          <p className="text-lg font-medium text-gray-700">Chargement de votre session...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    console.log('Redirection vers la page de connexion - Utilisateur non authentifié');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if the user has the required roles
  const hasAccess = checkRouteAccess(allowedRoles);
  
  if (!hasAccess) {
    console.log('Redirection vers la page non autorisée - Rôles insuffisants', { allowedRoles });
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  // User is authenticated and has the required roles, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
