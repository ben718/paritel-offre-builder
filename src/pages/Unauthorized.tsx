
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { ShieldAlert, Home, LogOut, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Unauthorized = () => {
  const navigate = useNavigate();
  const { logout, userProfile, session } = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Erreur de déconnexion",
        description: "Une erreur est survenue lors de la déconnexion",
        variant: "destructive",
      });
      navigate("/login");
    }
  };

  const refreshSession = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center space-y-4 max-w-md">
        <div className="flex justify-center">
          <div className="bg-red-100 p-4 rounded-full">
            <ShieldAlert className="h-16 w-16 text-red-500" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900">Accès non autorisé</h1>
        
        <p className="text-gray-600">
          Vous n'avez pas les permissions nécessaires pour accéder à cette page.
        </p>
        
        {userProfile && (
          <div className="mt-2 p-3 bg-gray-100 rounded-md">
            <p className="text-sm font-medium">Profil actuel:</p>
            <p className="text-sm">Nom: {userProfile.full_name || "Non défini"}</p>
            <p className="text-sm">Email: {userProfile.email}</p>
            <p className="text-sm">Rôles: {userProfile.roles?.join(", ") || "Aucun rôle défini"}</p>
            <p className="text-sm">ID utilisateur: {userProfile.id}</p>
          </div>
        )}
        
        <div className="mt-2 p-3 bg-yellow-50 rounded-md">
          <p className="text-sm font-medium">Informations de débogage:</p>
          <p className="text-sm">Session active: {session ? "Oui" : "Non"}</p>
          <p className="text-sm">Rôles détectés: {JSON.stringify(userProfile?.roles)}</p>
        </div>
        
        <div className="pt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            variant="outline" 
            className="w-full sm:w-auto"
            onClick={() => navigate("/")}
          >
            <Home className="mr-2 h-4 w-4" />
            Retour à l'accueil
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full sm:w-auto bg-blue-50 hover:bg-blue-100"
            onClick={refreshSession}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Actualiser la session
          </Button>
          
          <Button 
            variant="default" 
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Se déconnecter
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
