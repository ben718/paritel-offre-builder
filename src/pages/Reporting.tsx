
import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import {
  Download,
  Calendar,
  Filter,
  BarChart3,
  PieChart as PieChartIcon,
  FileText
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchReportingData, fetchReportingCategories } from "@/services/ReportingService";
import { getRecentOffers } from "@/services/OfferService";
import { useToast } from "@/components/ui/use-toast";

const Reporting = () => {
  const [period, setPeriod] = useState('month');
  const [productType, setProductType] = useState('all');
  const { toast } = useToast();
  
  // Récupération des données de reporting
  const { data: reportingData = [], isLoading: isLoadingReporting } = useQuery({
    queryKey: ['reporting-data', period],
    queryFn: async () => {
      try {
        const data = await fetchReportingData('sales');
        return data.filter(item => {
          if (period === 'month') {
            // Filtrer pour les 6 derniers mois
            const date = new Date(item.report_date);
            const sixMonthsAgo = new Date();
            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
            return date >= sixMonthsAgo;
          }
          return true;
        });
      } catch (error) {
        console.error("Error fetching reporting data:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les données de reporting",
          variant: "destructive",
        });
        return [];
      }
    }
  });

  // Récupération des offres récentes
  const { data: recentOffers = [], isLoading: isLoadingOffers } = useQuery({
    queryKey: ['recent-offers-reporting'],
    queryFn: async () => {
      try {
        const offers = await getRecentOffers(5);
        return offers.map(offer => ({
          id: offer.id,
          date: offer.created_at,
          company: offer.customer_name,
          status: offer.status
        }));
      } catch (error) {
        console.error("Error fetching recent offers:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les offres récentes",
          variant: "destructive",
        });
        return [];
      }
    }
  });

  // Préparation des données pour les graphiques
  const monthlySalesData = reportingData.length > 0 
    ? prepareMonthlyData(reportingData)
    : [
        { name: "Jan", telecom: 40, internet: 24, hardware: 15 },
        { name: "Fév", telecom: 30, internet: 13, hardware: 20 },
        { name: "Mar", telecom: 20, internet: 98, hardware: 22 },
        { name: "Avr", telecom: 27, internet: 39, hardware: 25 },
        { name: "Mai", telecom: 18, internet: 48, hardware: 23 },
        { name: "Jun", telecom: 23, internet: 38, hardware: 21 },
      ];
  
  const quarterSalesData = [
    { name: "Q1", telecom: 90, internet: 135, hardware: 57 },
    { name: "Q2", telecom: 70, internet: 135, hardware: 69 },
  ];
  
  const getChartData = () => {
    switch(period) {
      case 'quarter':
        return quarterSalesData;
      default:
        return monthlySalesData;
    }
  };

  // Données pour le graphique en camembert
  const { data: categories = [] } = useQuery({
    queryKey: ['reporting-categories'],
    queryFn: async () => {
      try {
        return await fetchReportingCategories();
      } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
      }
    }
  });
  
  // Préparation des données pour le graphique en camembert
  const productDistribution = categories.length > 0
    ? categories.map((category, index) => ({
        name: category,
        value: 20 + Math.floor(Math.random() * 30) // Valeurs de démonstration
      }))
    : [
        { name: "Téléphonie", value: 45 },
        { name: "Internet", value: 30 },
        { name: "Matériel", value: 15 },
        { name: "Solutions", value: 10 },
      ];
  
  const COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c'];
  
  const offerStatusColor = (status: string) => {
    switch(status) {
      case 'accepted':
        return 'text-green-600';
      case 'pending':
      case 'in_progress':
        return 'text-amber-600';
      case 'rejected':
        return 'text-red-600';
      case 'expired':
        return 'text-gray-600';
      case 'sent':
        return 'text-blue-600';
      default:
        return '';
    }
  };

  const offerStatusText = (status: string) => {
    switch(status) {
      case 'accepted':
        return 'Acceptée';
      case 'in_progress':
        return 'En cours';
      case 'pending':
        return 'En attente';
      case 'rejected':
        return 'Refusée';
      case 'expired':
        return 'Expirée';
      case 'sent':
        return 'Envoyée';
      case 'draft':
        return 'Brouillon';
      default:
        return status;
    }
  };

  // Fonction pour formater les données mensuelles
  function prepareMonthlyData(data) {
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
    const result = [];
    
    // Regrouper les données par mois
    const groupedByMonth = data.reduce((acc, item) => {
      const date = new Date(item.report_date);
      const month = date.getMonth();
      const subcategory = item.subcategory || 'other';
      
      if (!acc[month]) {
        acc[month] = {};
      }
      
      if (!acc[month][subcategory]) {
        acc[month][subcategory] = 0;
      }
      
      acc[month][subcategory] += item.value;
      return acc;
    }, {});
    
    // Transformer les données groupées en format pour recharts
    for (let i = 0; i < 12; i++) {
      if (groupedByMonth[i]) {
        result.push({
          name: months[i],
          telecom: groupedByMonth[i].telecom || 0,
          internet: groupedByMonth[i].internet || 0,
          hardware: groupedByMonth[i].hardware || 0,
        });
      }
    }
    
    return result.length > 0 ? result : monthlySalesData;
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Analyse des activités</h1>
            <p className="text-muted-foreground">Suivez et analysez les performances de vos offres</p>
          </div>
          <div className="flex space-x-2 w-full sm:w-auto">
            <Button variant="outline" className="flex-1 sm:flex-initial">
              <Download className="mr-2 h-4 w-4" />
              Exporter
            </Button>
            <Button variant="outline" className="flex-1 sm:flex-initial">
              <Calendar className="mr-2 h-4 w-4" />
              Personnaliser
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Offres Totales</p>
                  <h3 className="text-2xl font-bold mt-1">
                    {isLoadingOffers ? (
                      <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
                    ) : (
                      recentOffers.length
                    )}
                  </h3>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <FileText className="h-5 w-5 text-blue-700" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Taux de Conversion</p>
                  <h3 className="text-2xl font-bold mt-1">
                    {isLoadingOffers ? (
                      <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
                    ) : (
                      `${Math.round((recentOffers.filter(o => o.status === 'accepted').length / Math.max(recentOffers.length, 1)) * 100)}%`
                    )}
                  </h3>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <PieChartIcon className="h-5 w-5 text-green-700" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Produits utilisés</p>
                  <h3 className="text-2xl font-bold mt-1">
                    {isLoadingReporting ? (
                      <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
                    ) : (
                      reportingData.length
                    )}
                  </h3>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <BarChart3 className="h-5 w-5 text-purple-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Offers Section */}
        <Card>
          <CardHeader>
            <CardTitle>Offres Récentes</CardTitle>
            <CardDescription>
              Les 5 dernières offres créées et leur statut
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingOffers ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="animate-pulse flex items-center justify-between p-3">
                    <div className="bg-gray-200 h-4 w-24 rounded"></div>
                    <div className="bg-gray-200 h-4 w-32 rounded"></div>
                    <div className="bg-gray-200 h-4 w-16 rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="inline-block min-w-full align-middle">
                  <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left font-medium p-3 whitespace-nowrap">Date</th>
                        <th className="text-left font-medium p-3 whitespace-nowrap">Client</th>
                        <th className="text-right font-medium p-3 whitespace-nowrap">Statut</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {recentOffers.map((offer) => (
                        <tr key={offer.id} className="border-b last:border-b-0">
                          <td className="p-3 whitespace-nowrap">{new Date(offer.date).toLocaleDateString('fr-FR')}</td>
                          <td className="p-3 font-medium">{offer.company}</td>
                          <td className={`p-3 text-right whitespace-nowrap ${offerStatusColor(offer.status)}`}>
                            {offerStatusText(offer.status)}
                          </td>
                        </tr>
                      ))}
                      {recentOffers.length === 0 && (
                        <tr>
                          <td colSpan={3} className="p-4 text-center text-gray-500">
                            Aucune offre récente trouvée
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Chart */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <CardTitle>Distribution des produits</CardTitle>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Select value={period} onValueChange={setPeriod}>
                  <SelectTrigger className="w-full sm:w-[140px]">
                    <SelectValue placeholder="Période" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="month">Mensuel</SelectItem>
                    <SelectItem value="quarter">Trimestriel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <CardDescription>
              Répartition des différentes catégories de produits
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            {isLoadingReporting ? (
              <div className="animate-pulse flex justify-center items-center h-[300px]">
                <div className="bg-gray-200 h-40 w-40 rounded-full"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={productDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {productDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Reporting;
