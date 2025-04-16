
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { ShieldAlert, Home, LogOut } from "lucide-react";

const Unauthorized = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      navigate("/login");
    }
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
          Veuillez contacter votre administrateur si vous pensez qu'il s'agit d'une erreur.
        </p>
        
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
