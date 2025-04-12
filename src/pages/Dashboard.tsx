
import MainLayout from "@/components/layout/MainLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import RecentOffers from "@/components/dashboard/RecentOffers";
import QuickAccess from "@/components/dashboard/QuickAccess";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, FileSpreadsheet, Package, Percent } from "lucide-react";

const Dashboard = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tableau de bord</h1>
          <p className="text-muted-foreground mt-1">
            Bienvenue sur la plateforme Paritel AO & Catalogue
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Offres ce mois"
            value="24"
            description="+12% par rapport au mois dernier"
            icon={<FileSpreadsheet className="h-4 w-4 text-paritel-primary" />}
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="Produits au catalogue"
            value="156"
            description="14 nouveaux produits ce mois-ci"
            icon={<Package className="h-4 w-4 text-paritel-accent" />}
          />
          <StatCard
            title="Offres acceptées"
            value="68%"
            description="+5% par rapport au trimestre précédent"
            icon={<Percent className="h-4 w-4 text-paritel-success" />}
            trend={{ value: 5, isPositive: true }}
          />
          <StatCard
            title="Taux de conversion"
            value="31%"
            description="Basé sur les 30 derniers jours"
            icon={<BarChart3 className="h-4 w-4 text-paritel-warning" />}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-7">
          <div className="col-span-7 md:col-span-5">
            <RecentOffers />
          </div>
          <div className="col-span-7 md:col-span-2">
            <div className="space-y-4">
              <QuickAccess />
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">À venir prochainement</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Mise à jour du catalogue prévue pour le 20/04/2025, avec l'intégration de nouveaux partenaires et produits.
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
