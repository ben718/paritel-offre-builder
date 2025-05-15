import React, { useEffect, useState } from 'react';
import { getGlobalDashboardStatistics, GlobalDashboardStats } from '@/services/ReportingService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, BarChart2, Users, FileText, ShoppingBag } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

// Exemple de composant pour afficher une statistique simple
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, description }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
    </CardContent>
  </Card>
);

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];

const ReportingDashboardPage: React.FC = () => {
  const { checkRouteAccess } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<GlobalDashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (!checkRouteAccess(['Admin', 'Chef de produit', 'Manager Commercial'])) {
        setError("Vous n'avez pas les droits pour accéder à cette page.");
        toast({ title: "Accès refusé", variant: "destructive" });
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const data = await getGlobalDashboardStatistics();
        setStats(data);
      } catch (err: any) {
        console.error("Erreur lors de la récupération des statistiques:", err);
        setError(err.message || "Impossible de charger les statistiques.");
        toast({ title: "Erreur de chargement", description: err.message, variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, [checkRouteAccess, toast]);

  if (isLoading) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[calc(100vh-100px)]">
        <Loader2 className="h-12 w-12 text-paritel-primary animate-spin mb-4" />
        <p className="text-lg font-medium text-gray-700">Chargement des statistiques...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Aucune statistique à afficher pour le moment.</p>
      </div>
    );
  }
  
  const offerStatusData = stats.offer_stats?.offers_by_status?.map(item => ({ name: item.status, value: item.count })) || [];
  const productCategoryData = stats.product_stats?.products_by_category?.map(item => ({ name: item.category_name, value: item.count })) || [];

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-paritel-primary flex items-center">
            <BarChart2 className="mr-3 h-8 w-8" /> Tableau de Bord des Statistiques
          </h1>
          <p className="text-lg text-gray-600">Vue d'ensemble des indicateurs clés de la plateforme.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Appels d'Offres Total" 
          value={stats.offer_stats?.total_offers ?? 'N/A'} 
          icon={<ShoppingBag className="h-4 w-4 text-muted-foreground" />} 
          description="Nombre total d'AO enregistrés"
        />
        <StatCard 
          title="Produits/Services Total" 
          value={stats.product_stats?.total_products ?? 'N/A'} 
          icon={<ShoppingBag className="h-4 w-4 text-muted-foreground" />} 
          description="Nombre total de produits/services"
        />
        <StatCard 
          title="Documents Bibliothèque" 
          value={stats.document_stats?.total_library_documents ?? 'N/A'} 
          icon={<FileText className="h-4 w-4 text-muted-foreground" />} 
          description="Nombre total de documents"
        />
        <StatCard 
          title="Utilisateurs Actifs (30j)" 
          value={stats.user_activity_stats?.active_users_last_30_days ?? 'N/A'} 
          icon={<Users className="h-4 w-4 text-muted-foreground" />} 
          description="Estimation de l'activité"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Répartition des Appels d'Offres par Statut</CardTitle>
            <CardDescription>Visualisation du cycle de vie des AO.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            {offerStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={offerStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {offerStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-400 pt-10">Aucune donnée pour ce graphique.</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Répartition des Produits par Catégorie</CardTitle>
            <CardDescription>Visualisation de la structure du catalogue.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            {productCategoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={productCategoryData} layout="vertical" margin={{ right: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={120} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#82ca9d" name="Nombre de produits" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-400 pt-10">Aucune donnée pour ce graphique.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportingDashboardPage;

