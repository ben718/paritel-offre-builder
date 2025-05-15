import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Search, PlusCircle, ShieldCheck, BookOpen, BarChart2, Loader2 } from 'lucide-react';
import { fetchRecentOffers, fetchTechnicalAlerts, fetchKeyIndicators, Offer, TechnicalAlert } from '@/services/DashboardService';
import { useNavigate } from "react-router-dom";

interface KeyIndicators {
  delaiReponseMoyen: string;
  tauxSuccesAO: string;
  servicesPlusDemandes: string;
}

const DashboardPage: React.FC = () => {
  const { userProfile, checkRouteAccess } = useAuth();
  const navigate = useNavigate();
  const [recentOffers, setRecentOffers] = useState<Offer[]>([]);
  const [technicalAlerts, setTechnicalAlerts] = useState<TechnicalAlert[]>([]);
  const [keyIndicators, setKeyIndicators] = useState<KeyIndicators | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!userProfile) return;
      setIsLoading(true);
      try {
        const offers = await fetchRecentOffers();
        setRecentOffers(offers);

        const alerts = await fetchTechnicalAlerts();
        setTechnicalAlerts(alerts);

        const indicators = await fetchKeyIndicators();
        setKeyIndicators(indicators);

      } catch (error) {
        console.error("Erreur lors du chargement des données du dashboard:", error);
        // Gérer l'erreur, par exemple avec un toast
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [userProfile]);

  if (!userProfile || isLoading) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[calc(100vh-100px)]">
        <Loader2 className="h-12 w-12 text-paritel-primary animate-spin mb-4" />
        <p className="text-lg font-medium text-gray-700">Chargement du tableau de bord...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <h1 className="text-3xl font-bold text-paritel-primary">Tableau de Bord</h1>
      <p className="text-lg text-gray-600">Bienvenue, {userProfile.full_name || userProfile.email} !</p>

      {/* Section Accès Rapides */} 
      <Card>
        <CardHeader>
          <CardTitle>Accès Rapides</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <Button variant="outline" className="flex flex-col h-24 items-center justify-center space-y-1 text-center" onClick={() => navigate("/catalogue/produits")}>
            <Search className="h-6 w-6 mb-1" />
            <span>Rechercher Produit/Service</span>
          </Button>
          <Button variant="outline" className="flex flex-col h-24 items-center justify-center space-y-1 text-center" onClick={() => navigate("/create-offer")}>
            <PlusCircle className="h-6 w-6 mb-1" />
            <span>Créer Dossier AO</span>
          </Button>
          <Button variant="outline" className="flex flex-col h-24 items-center justify-center space-y-1 text-center" onClick={() => navigate("/generate-memoire-technique")}>
            <FileText className="h-6 w-6 mb-1" />
            <span>Générer Mémoire Technique</span>
          </Button>
          <Button variant="outline" className="flex flex-col h-24 items-center justify-center space-y-1 text-center" onClick={() => navigate("/slas")}>
            <ShieldCheck className="h-6 w-6 mb-1" />
            <span>Voir SLA par Service</span>
          </Button>
          <Button variant="outline" className="flex flex-col h-24 items-center justify-center space-y-1 text-center" onClick={() => navigate("/modele-contrat")}>
            <BookOpen className="h-6 w-6 mb-1" />
            <span>Modèle de Contrat</span>
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Section Nouveaux Appels d'Offres - Visible par Commercial AO, Avant-vente, Admin */} 
        {checkRouteAccess(['Commercial AO', 'Avant-vente', 'Admin']) && (
          <Card>
            <CardHeader>
              <CardTitle>Nouveaux Appels d'Offres</CardTitle>
              <CardDescription>Les dernières opportunités à ne pas manquer.</CardDescription>
            </CardHeader>
            <CardContent>
              {recentOffers.length > 0 ? (
                <ul className="space-y-2">
                  {recentOffers.map((ao) => (
                    <li key={ao.id} className="text-sm p-2 border rounded-md hover:bg-gray-50">
                      <p className="font-semibold">{ao.market_name}</p>
                      <p className="text-xs text-gray-500">Deadline: {new Date(ao.deadline).toLocaleDateString()}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">Aucun nouvel appel d'offre pour le moment.</p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Section Alertes Techniques - Visible par Chef de projet technique, Avant-vente, Admin */} 
        {checkRouteAccess(['Chef de projet technique', 'Avant-vente', 'Admin']) && (
          <Card>
            <CardHeader>
              <CardTitle>Alertes Techniques</CardTitle>
              <CardDescription>Informations importantes sur les produits et normes.</CardDescription>
            </CardHeader>
            <CardContent>
              {technicalAlerts.length > 0 ? (
                <ul className="space-y-2">
                  {technicalAlerts.map((alerte) => (
                    <li key={alerte.id} className={`text-sm p-2 border rounded-md ${alerte.severity === 'error' ? 'bg-red-50 border-red-200' : alerte.severity === 'warning' ? 'bg-yellow-50 border-yellow-200' : 'bg-blue-50 border-blue-200'}`}>
                      {alerte.message}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">Aucune alerte technique active.</p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Section Indicateurs Clés - Visible par Direction, Admin */} 
        {keyIndicators && checkRouteAccess(['Direction', 'Admin']) && (
          <Card>
            <CardHeader>
              <CardTitle>Indicateurs Clés</CardTitle>
              <CardDescription>Performance et tendances.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Délai de réponse moyen:</span>
                <span className="font-semibold">{keyIndicators.delaiReponseMoyen}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Taux de succès AO:</span>
                <span className="font-semibold text-green-600">{keyIndicators.tauxSuccesAO}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Services les + demandés:</span>
                <span className="font-semibold">{keyIndicators.servicesPlusDemandes}</span>
              </div>
              <Button variant="link" className="p-0 h-auto text-paritel-primary text-sm mt-2">
                <BarChart2 className="h-4 w-4 mr-1" />
                Voir le reporting détaillé
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;

