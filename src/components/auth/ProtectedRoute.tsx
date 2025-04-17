
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles = [] }: ProtectedRouteProps) => {
  const location = useLocation();
  const { isAuthenticated, isReady, userProfile } = useAuth();
  
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

  // If not authenticated, redirect to login with current location
  if (!isAuthenticated) {
    console.log('Redirection vers la page de connexion - Utilisateur non authentifié', { from: location.pathname });
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  console.log('User profile in ProtectedRoute:', userProfile);
  
  // Si aucun rôle n'est requis ou si la liste est vide, autoriser l'accès
  if (!allowedRoles || allowedRoles.length === 0) {
    console.log('Aucun rôle requis, accès autorisé');
    return <>{children}</>;
  }

  // Vérifier si l'utilisateur a les rôles requis
  const userRoles = userProfile?.roles || [];
  console.log('Vérification des rôles:', { userRoles, allowedRoles });
  
  let hasAccess = false;
  
  // Convert all roles to lowercase for case-insensitive comparison
  const normalizedUserRoles = userRoles.map(role => role.toLowerCase());
  const normalizedAllowedRoles = allowedRoles.map(role => role.toLowerCase());
  
  console.log('Rôles normalisés:', { normalizedUserRoles, normalizedAllowedRoles });
  
  // Check if any user role matches any allowed role
  hasAccess = normalizedUserRoles.some(userRole => 
    normalizedAllowedRoles.includes(userRole)
  );
  
  // Detailed role matching log
  if (hasAccess) {
    console.log('Accès autorisé: rôle correspondant trouvé');
  } else {
    console.log('Accès refusé: aucun rôle correspondant trouvé');
  }
  
  if (!hasAccess) {
    console.log('Redirection vers la page non autorisée - Rôles insuffisants', { 
      userRoles, 
      allowedRoles, 
      from: location.pathname 
    });
    return <Navigate to="/unauthorized" replace />;
  }

  // User is authenticated and has the required roles, render the protected content
  console.log('Accès autorisé pour l\'utilisateur avec les rôles:', userRoles);
  return <>{children}</>;
};

export default ProtectedRoute;
