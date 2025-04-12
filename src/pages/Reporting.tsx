
import React, { useState } from "react";
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
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";
import {
  Download,
  Calendar,
  TrendingUp,
  Filter,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  FileText
} from "lucide-react";

const Reporting = () => {
  const [period, setPeriod] = useState('month');
  const [productType, setProductType] = useState('all');
  
  // Sample data - in a real application, this would come from an API or database
  const monthlySalesData = [
    { name: "Jan", telecom: 4000, internet: 2400, hardware: 1500 },
    { name: "Fév", telecom: 3000, internet: 1398, hardware: 2000 },
    { name: "Mar", telecom: 2000, internet: 9800, hardware: 2200 },
    { name: "Avr", telecom: 2780, internet: 3908, hardware: 2500 },
    { name: "Mai", telecom: 1890, internet: 4800, hardware: 2300 },
    { name: "Jun", telecom: 2390, internet: 3800, hardware: 2100 },
    { name: "Jul", telecom: 3490, internet: 4300, hardware: 2400 },
    { name: "Aoû", telecom: 2000, internet: 9800, hardware: 2800 },
    { name: "Sep", telecom: 2780, internet: 3908, hardware: 2700 },
    { name: "Oct", telecom: 1890, internet: 4800, hardware: 2900 },
    { name: "Nov", telecom: 2390, internet: 3800, hardware: 2100 },
    { name: "Déc", telecom: 3490, internet: 4300, hardware: 2400 },
  ];
  
  const quarterSalesData = [
    { name: "Q1", telecom: 9000, internet: 13598, hardware: 5700 },
    { name: "Q2", telecom: 7060, internet: 13508, hardware: 6900 },
    { name: "Q3", telecom: 8270, internet: 17908, hardware: 7900 },
    { name: "Q4", telecom: 7770, internet: 12900, hardware: 7400 },
  ];
  
  const yearSalesData = [
    { name: "2021", telecom: 24000, internet: 35000, hardware: 22000 },
    { name: "2022", telecom: 32100, internet: 42000, hardware: 27000 },
    { name: "2023", telecom: 37000, internet: 55000, hardware: 34000 },
    { name: "2024", telecom: 32100, internet: 58000, hardware: 27500 },
  ];
  
  const getChartData = () => {
    switch(period) {
      case 'quarter':
        return quarterSalesData;
      case 'year':
        return yearSalesData;
      default:
        return monthlySalesData;
    }
  };

  const productDistribution = [
    { name: "Téléphonie", value: 45 },
    { name: "Internet", value: 30 },
    { name: "Matériel", value: 15 },
    { name: "Solutions", value: 10 },
  ];
  
  const COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c'];
  
  // Sample offers data
  const recentOffers = [
    { id: 1, date: "2024-04-10", company: "Hotel Luxe Paris", amount: 24500, status: "accepted" },
    { id: 2, date: "2024-04-08", company: "Clinique Saint-Marc", amount: 18750, status: "pending" },
    { id: 3, date: "2024-04-05", company: "Bureau Experts Comptables", amount: 9320, status: "accepted" },
    { id: 4, date: "2024-04-02", company: "Restaurant Le Gourmet", amount: 7645, status: "declined" },
    { id: 5, date: "2024-03-28", company: "École Internationale", amount: 32100, status: "accepted" },
  ];

  const offerStatusColor = (status: string) => {
    switch(status) {
      case 'accepted':
        return 'text-green-600';
      case 'pending':
        return 'text-amber-600';
      case 'declined':
        return 'text-red-600';
      default:
        return '';
    }
  };

  const offerStatusText = (status: string) => {
    switch(status) {
      case 'accepted':
        return 'Acceptée';
      case 'pending':
        return 'En attente';
      case 'declined':
        return 'Refusée';
      default:
        return status;
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Reporting & Analyse</h1>
            <p className="text-muted-foreground">Suivez et analysez les performances de vos offres et ventes</p>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Offres Totales</p>
                  <h3 className="text-2xl font-bold mt-1">145</h3>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +12.5% vs mois dernier
                  </p>
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
                  <h3 className="text-2xl font-bold mt-1">68%</h3>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +5.2% vs mois dernier
                  </p>
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
                  <p className="text-sm font-medium text-muted-foreground">Revenu Total</p>
                  <h3 className="text-2xl font-bold mt-1">872 354 €</h3>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +18.3% vs mois dernier
                  </p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <BarChart3 className="h-5 w-5 text-purple-700" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Panier Moyen</p>
                  <h3 className="text-2xl font-bold mt-1">6 016 €</h3>
                  <p className="text-xs text-red-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1 rotate-180" />
                    -2.1% vs mois dernier
                  </p>
                </div>
                <div className="bg-amber-100 p-3 rounded-full">
                  <LineChartIcon className="h-5 w-5 text-amber-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="col-span-1 lg:col-span-2">
            <CardHeader className="pb-2">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <CardTitle>Évolution des Ventes</CardTitle>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <Select value={period} onValueChange={setPeriod}>
                    <SelectTrigger className="w-full sm:w-[140px]">
                      <SelectValue placeholder="Période" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="month">Mensuel</SelectItem>
                      <SelectItem value="quarter">Trimestriel</SelectItem>
                      <SelectItem value="year">Annuel</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={productType} onValueChange={setProductType}>
                    <SelectTrigger className="w-full sm:w-[140px]">
                      <SelectValue placeholder="Produits" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les produits</SelectItem>
                      <SelectItem value="telecom">Téléphonie</SelectItem>
                      <SelectItem value="internet">Internet</SelectItem>
                      <SelectItem value="hardware">Matériel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <CardDescription>
                Évolution des ventes par catégorie de produits
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getChartData()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {(productType === 'all' || productType === 'telecom') && (
                    <Bar dataKey="telecom" name="Téléphonie" fill="#8884d8" />
                  )}
                  {(productType === 'all' || productType === 'internet') && (
                    <Bar dataKey="internet" name="Internet" fill="#82ca9d" />
                  )}
                  {(productType === 'all' || productType === 'hardware') && (
                    <Bar dataKey="hardware" name="Matériel" fill="#ffc658" />
                  )}
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Répartition des Produits</CardTitle>
              <CardDescription>
                Distribution des ventes par catégorie
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={productDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
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
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left font-medium p-3 whitespace-nowrap">Date</th>
                      <th className="text-left font-medium p-3 whitespace-nowrap">Client</th>
                      <th className="text-right font-medium p-3 whitespace-nowrap">Montant</th>
                      <th className="text-right font-medium p-3 whitespace-nowrap">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {recentOffers.map((offer) => (
                      <tr key={offer.id} className="border-b last:border-b-0">
                        <td className="p-3 whitespace-nowrap">{new Date(offer.date).toLocaleDateString('fr-FR')}</td>
                        <td className="p-3 font-medium">{offer.company}</td>
                        <td className="p-3 text-right whitespace-nowrap">{offer.amount.toLocaleString('fr-FR')} €</td>
                        <td className={`p-3 text-right whitespace-nowrap ${offerStatusColor(offer.status)}`}>
                          {offerStatusText(offer.status)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Reporting;
