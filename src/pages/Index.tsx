
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center max-w-3xl px-4">
        <h1 className="text-4xl font-bold mb-4 text-paritel-primary">Paritel | Outil de Création d'Offres</h1>
        <p className="text-xl text-gray-600 mb-8">
          Simplifiez la création et la gestion de vos offres commerciales avec notre plateforme intuitive.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-paritel-primary hover:bg-paritel-dark">
            <Link to="/login">Se connecter</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/dashboard">Tableau de bord</Link>
          </Button>
        </div>
        
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium mb-2">Catalogue Produit</h3>
            <p className="text-gray-600">Accédez à notre catalogue complet de solutions télécom et IT.</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium mb-2">Création Facile</h3>
            <p className="text-gray-600">Créez des offres personnalisées en quelques clics.</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium mb-2">Suivi Commercial</h3>
            <p className="text-gray-600">Suivez l'évolution de vos propositions commerciales.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
