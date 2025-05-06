
import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const isMobile = useIsMobile();
  const { isAuthenticated, isReady } = useAuth();

  // Afficher un indicateur de chargement pendant que l'état d'authentification est vérifié
  if (!isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 text-paritel-primary animate-spin" />
          <p className="text-lg font-medium text-gray-700">Chargement de votre session...</p>
        </div>
      </div>
    );
  }

  // Le MainLayout ne devrait pas rediriger, car la redirection est gérée par ProtectedRoute
  // Nous supprimons cette redirection pour éviter les boucles de redirection

  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden">
      {!isMobile && <Sidebar />}
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <Header />
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 w-full">
          <div className="w-full mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
