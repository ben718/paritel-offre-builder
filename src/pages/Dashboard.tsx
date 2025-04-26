
import MainLayout from "@/components/layout/MainLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import RecentOffers from "@/components/dashboard/RecentOffers";
import QuickAccess from "@/components/dashboard/QuickAccess";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileSpreadsheet, Package } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/services/ProductService";

const Dashboard = () => {
  // Récupérer le nombre de produits depuis l'API
  const { data: products = [] } = useQuery({
    queryKey: ['dashboard-products'],
    queryFn: fetchProducts
  });

  return (
    <MainLayout>
      <div className="space-y-6 w-full">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tableau de bord</h1>
          <p className="text-muted-foreground mt-1">
            Bienvenue sur la plateforme Paritel AO & Catalogue
          </p>
        </div>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          <StatCard
            title="Offres en cours"
            value="Gestion des offres"
            description="Créez et gérez vos offres personnalisées"
            icon={<FileSpreadsheet className="h-4 w-4 text-paritel-primary" />}
          />
          <StatCard
            title="Catalogue produits"
            value={`${products.length} produits`}
            description="Explorez notre catalogue complet"
            icon={<Package className="h-4 w-4 text-paritel-accent" />}
          />
        </div>

        <div className="grid gap-4 grid-cols-1 md:grid-cols-7">
          <div className="col-span-1 md:col-span-5">
            <RecentOffers />
          </div>
          <div className="col-span-1 md:col-span-2">
            <div className="space-y-4">
              <QuickAccess />
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">À propos</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Catalogue de produits et services pour créer des offres personnalisées adaptées à vos besoins.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
