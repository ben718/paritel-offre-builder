
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CustomLabel } from "@/components/ui/custom-label";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  Cell,
  AreaChart,
  Area,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from "recharts";
import {
  Download,
  Calendar,
  Filter,
  RefreshCw,
  Share2,
  PieChart as PieChartIcon,
  BarChart3,
  LineChart as LineChartIcon,
  ListFilter,
  Map,
  Percent,
  Activity,
  FileText,
  Users,
  Building,
  ArrowRight
} from "lucide-react";

const AdvancedReporting = () => {
  const [period, setPeriod] = useState('month');
  const [comparisonMode, setComparisonMode] = useState(false);
  
  // Sample data
  const monthlyData = [
    { name: "Jan", current: 4000, previous: 3200 },
    { name: "Fév", current: 3000, previous: 2900 },
    { name: "Mar", current: 2000, previous: 2500 },
    { name: "Avr", current: 2780, previous: 2400 },
    { name: "Mai", current: 1890, previous: 1800 },
    { name: "Jun", current: 2390, previous: 2100 },
    { name: "Jul", current: 3490, previous: 3000 },
    { name: "Aoû", current: 3090, previous: 3200 },
    { name: "Sep", current: 2590, previous: 2300 },
    { name: "Oct", current: 3490, previous: 3100 },
    { name: "Nov", current: 3290, previous: 2800 },
    { name: "Déc", current: 3890, previous: 3400 },
  ];
  
  // Conversion rate data
  const conversionData = [
    { name: "Prospection", value: 100, conversion: 100 },
    { name: "Qualification", value: 68, conversion: 68 },
    { name: "Proposition", value: 42, conversion: 62 },
    { name: "Négociation", value: 30, conversion: 71 },
    { name: "Conclusion", value: 22, conversion: 73 },
  ];
  
  // Customer segmentation data
  const segmentationData = [
    { name: "Hôtellerie", value: 32 },
    { name: "Santé", value: 25 },
    { name: "Commercial", value: 18 },
    { name: "Éducation", value: 15 },
    { name: "Industrie", value: 10 },
  ];
  
  // KPI trends
  const kpiTrends = [
    { name: "Jan", ca: 80, marge: 60, satisfaction: 85 },
    { name: "Fév", ca: 83, marge: 63, satisfaction: 87 },
    { name: "Mar", ca: 86, marge: 66, satisfaction: 90 },
    { name: "Avr", ca: 89, marge: 68, satisfaction: 88 },
    { name: "Mai", ca: 87, marge: 65, satisfaction: 87 },
    { name: "Jun", ca: 90, marge: 70, satisfaction: 91 },
  ];
  
  // Performance radar data
  const performanceData = [
    { subject: 'Prospection', A: 85, B: 70, fullMark: 100 },
    { subject: 'Relance', A: 68, B: 75, fullMark: 100 },
    { subject: 'Négociation', A: 90, B: 80, fullMark: 100 },
    { subject: 'Fidélisation', A: 72, B: 65, fullMark: 100 },
    { subject: 'Support', A: 78, B: 82, fullMark: 100 },
    { subject: 'Documentation', A: 65, B: 60, fullMark: 100 },
  ];
  
  // Top performing products
  const topProducts = [
    { id: 1, name: "Téléphonie IP PRO", revenue: 125750, growth: 12.5 },
    { id: 2, name: "Fibre optique 1 Gb/s", revenue: 98500, growth: 8.3 },
    { id: 3, name: "Réseau Wi-Fi Entreprise", revenue: 76320, growth: 15.2 },
    { id: 4, name: "VPN Sécurisé", revenue: 65800, growth: -2.1 },
    { id: 5, name: "Visioconférence PRO", revenue: 58900, growth: 22.4 },
  ];
  
  // Colors
  const COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c'];
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };
  
  // Format percent
  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  // Custom tooltip for conversion funnel
  const CustomFunnelTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 shadow-md rounded border text-xs">
          <p className="font-medium">{payload[0].payload.name}</p>
          <p>Nombre: {payload[0].payload.value}</p>
          <p>Taux: {payload[0].payload.conversion}%</p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Analyse Avancée</h1>
            <p className="text-muted-foreground">Outils d'analyse approfondie et tableaux de bord interactifs</p>
          </div>
          <div className="flex space-x-2 w-full sm:w-auto">
            <Button variant="outline" className="flex-1 sm:flex-initial">
              <Filter className="mr-2 h-4 w-4" />
              Filtres
            </Button>
            <Button variant="outline" className="flex-1 sm:flex-initial">
              <Calendar className="mr-2 h-4 w-4" />
              Période
            </Button>
            <Button variant="outline" className="flex-1 sm:flex-initial">
              <Download className="mr-2 h-4 w-4" />
              Exporter
            </Button>
          </div>
        </div>

        <Tabs defaultValue="performance" className="space-y-6">
          <TabsList className="bg-transparent border-b rounded-none h-auto p-0 w-full justify-start">
            <TabsTrigger 
              value="performance" 
              className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-paritel-primary data-[state=active]:shadow-none"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Performance commerciale
            </TabsTrigger>
            <TabsTrigger 
              value="funnel" 
              className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-paritel-primary data-[state=active]:shadow-none"
            >
              <Percent className="h-4 w-4 mr-2" />
              Entonnoir de conversion
            </TabsTrigger>
            <TabsTrigger 
              value="segmentation" 
              className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-paritel-primary data-[state=active]:shadow-none"
            >
              <PieChartIcon className="h-4 w-4 mr-2" />
              Segmentation clients
            </TabsTrigger>
          </TabsList>
          
          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Chiffre d'affaires</p>
                      <h3 className="text-2xl font-bold mt-1">872 354 €</h3>
                      <p className="text-xs text-green-600 flex items-center mt-1">
                        <Activity className="h-3 w-3 mr-1" />
                        +18.3% vs année précédente
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
                      <p className="text-sm font-medium text-muted-foreground">Marge brute</p>
                      <h3 className="text-2xl font-bold mt-1">392 559 €</h3>
                      <p className="text-xs text-green-600 flex items-center mt-1">
                        <Activity className="h-3 w-3 mr-1" />
                        +12.7% vs année précédente
                      </p>
                    </div>
                    <div className="bg-green-100 p-3 rounded-full">
                      <Percent className="h-5 w-5 text-green-700" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Nouveaux clients</p>
                      <h3 className="text-2xl font-bold mt-1">87</h3>
                      <p className="text-xs text-green-600 flex items-center mt-1">
                        <Activity className="h-3 w-3 mr-1" />
                        +9.5% vs année précédente
                      </p>
                    </div>
                    <div className="bg-purple-100 p-3 rounded-full">
                      <Users className="h-5 w-5 text-purple-700" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Taux de satisfaction</p>
                      <h3 className="text-2xl font-bold mt-1">91%</h3>
                      <p className="text-xs text-green-600 flex items-center mt-1">
                        <Activity className="h-3 w-3 mr-1" />
                        +4.5% vs année précédente
                      </p>
                    </div>
                    <div className="bg-amber-100 p-3 rounded-full">
                      <LineChartIcon className="h-5 w-5 text-amber-700" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="col-span-1 lg:col-span-2">
                <CardHeader className="pb-2">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div>
                      <CardTitle>Évolution du chiffre d'affaires</CardTitle>
                      <CardDescription>
                        Comparaison avec l'année précédente
                      </CardDescription>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                      <Button 
                        variant={comparisonMode ? "default" : "outline"}
                        className={comparisonMode ? "bg-paritel-primary" : ""}
                        onClick={() => setComparisonMode(!comparisonMode)}
                        size="sm"
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Comparaison
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-2">
                  <ResponsiveContainer width="100%" height={300}>
                    {comparisonMode ? (
                      <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value) => formatCurrency(Number(value))}
                          labelFormatter={(label) => `Mois: ${label}`}
                        />
                        <Legend />
                        <Bar dataKey="current" name="Année en cours" fill="#8884d8" />
                        <Bar dataKey="previous" name="Année précédente" fill="#82ca9d" />
                      </BarChart>
                    ) : (
                      <LineChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value) => formatCurrency(Number(value))}
                          labelFormatter={(label) => `Mois: ${label}`}
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="current" 
                          name="Année en cours" 
                          stroke="#8884d8" 
                          activeDot={{ r: 8 }} 
                        />
                      </LineChart>
                    )}
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Top 5 produits</CardTitle>
                  <CardDescription>
                    Produits les plus performants en termes de CA
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topProducts.map((product) => (
                      <div key={product.id} className="flex justify-between items-center">
                        <div className="space-y-1">
                          <div className="flex items-center">
                            <span className="font-medium">{product.name}</span>
                          </div>
                          <span className="text-sm text-gray-500">
                            {formatCurrency(product.revenue)}
                          </span>
                        </div>
                        <Badge className={product.growth >= 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                          {product.growth >= 0 ? '+' : ''}{product.growth}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tendances des KPIs</CardTitle>
                  <CardDescription>
                    Évolution des indicateurs clés sur 6 mois
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={kpiTrends} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorCA" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorMarge" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorSatisfaction" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#ffc658" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Tooltip 
                        formatter={(value) => `${value}%`}
                        labelFormatter={(label) => `Mois: ${label}`}
                      />
                      <Area type="monotone" dataKey="ca" name="CA" stroke="#8884d8" fillOpacity={1} fill="url(#colorCA)" />
                      <Area type="monotone" dataKey="marge" name="Marge" stroke="#82ca9d" fillOpacity={1} fill="url(#colorMarge)" />
                      <Area type="monotone" dataKey="satisfaction" name="Satisfaction" stroke="#ffc658" fillOpacity={1} fill="url(#colorSatisfaction)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Profil de performance</CardTitle>
                  <CardDescription>
                    Comparaison entre équipes commerciales
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart outerRadius={90} data={performanceData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar name="Équipe Paris" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                      <Radar name="Équipe Lyon" dataKey="B" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                      <Legend />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Funnel Analysis Tab */}
          <TabsContent value="funnel" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="col-span-1 lg:col-span-2">
                <CardHeader>
                  <CardTitle>Entonnoir de conversion</CardTitle>
                  <CardDescription>
                    Analyse des étapes du processus de vente
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] flex items-center">
                    <ResponsiveContainer width="100%" height={350}>
                      <BarChart
                        layout="vertical"
                        data={conversionData.slice().reverse()}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="name" />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip content={<CustomFunnelTooltip />} />
                        <Bar dataKey="value" fill="#8884d8">
                          {conversionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Metrics de conversion</CardTitle>
                  <CardDescription>
                    Taux de conversion par étape
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {conversionData.map((step, index) => (
                      <div key={index}>
                        <div className="flex justify-between items-center mb-1">
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                            <span className="font-medium">{step.name}</span>
                          </div>
                          <span className="text-sm">{step.conversion}%</span>
                        </div>
                        
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full" 
                            style={{ 
                              width: `${step.conversion}%`,
                              backgroundColor: COLORS[index % COLORS.length]
                            }}
                          ></div>
                        </div>
                        
                        {index < conversionData.length - 1 && (
                          <div className="flex justify-center my-2">
                            <ArrowRight className="h-4 w-4 text-gray-400" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="pt-2">
                    <h4 className="font-medium mb-3">Conversion globale</h4>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm">Prospects → Clients</span>
                      <span className="font-medium">22%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="h-2 rounded-full bg-green-500" style={{ width: '22%' }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Analyse des pertes</CardTitle>
                <CardDescription>
                  Raisons principales de non-conversion
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">Qualification → Proposition</h3>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm">Budget insuffisant</span>
                        <span className="text-sm font-medium">38%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="h-2 rounded-full bg-red-500" style={{ width: '38%' }}></div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm">Besoin mal défini</span>
                        <span className="text-sm font-medium">29%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="h-2 rounded-full bg-red-500" style={{ width: '29%' }}></div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm">Autres raisons</span>
                        <span className="text-sm font-medium">33%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="h-2 rounded-full bg-red-500" style={{ width: '33%' }}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">Proposition → Négociation</h3>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm">Prix trop élevé</span>
                        <span className="text-sm font-medium">45%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="h-2 rounded-full bg-orange-500" style={{ width: '45%' }}></div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm">Concurrence</span>
                        <span className="text-sm font-medium">32%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="h-2 rounded-full bg-orange-500" style={{ width: '32%' }}></div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm">Fonctionnalités</span>
                        <span className="text-sm font-medium">23%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="h-2 rounded-full bg-orange-500" style={{ width: '23%' }}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">Négociation → Conclusion</h3>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm">Délai décision</span>
                        <span className="text-sm font-medium">41%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="h-2 rounded-full bg-yellow-500" style={{ width: '41%' }}></div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm">Changement priorités</span>
                        <span className="text-sm font-medium">35%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="h-2 rounded-full bg-yellow-500" style={{ width: '35%' }}></div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm">Conditions contractuelles</span>
                        <span className="text-sm font-medium">24%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="h-2 rounded-full bg-yellow-500" style={{ width: '24%' }}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">Actions recommandées</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <div className="bg-green-100 p-1 rounded-full mr-2 mt-0.5 flex items-center justify-center">
                          <div className="h-3 w-3 text-green-600">✓</div>
                        </div>
                        <span>Améliorer la qualification initiale des prospects</span>
                      </li>
                      <li className="flex items-start">
                        <div className="bg-green-100 p-1 rounded-full mr-2 mt-0.5 flex items-center justify-center">
                          <div className="h-3 w-3 text-green-600">✓</div>
                        </div>
                        <span>Réviser la grille tarifaire pour rester compétitif</span>
                      </li>
                      <li className="flex items-start">
                        <div className="bg-green-100 p-1 rounded-full mr-2 mt-0.5 flex items-center justify-center">
                          <div className="h-3 w-3 text-green-600">✓</div>
                        </div>
                        <span>Améliorer le processus de suivi durant la phase de négociation</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Segmentation Tab */}
          <TabsContent value="segmentation" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="col-span-1 lg:col-span-2">
                <CardHeader>
                  <CardTitle>Répartition par secteur d'activité</CardTitle>
                  <CardDescription>
                    Distribution des clients par secteur
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] flex items-center justify-center">
                    <ResponsiveContainer width="100%" height={350}>
                      <PieChart>
                        <Pie
                          data={segmentationData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                          outerRadius={130}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {segmentationData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value}%`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Analyse sectorielle</CardTitle>
                  <CardDescription>
                    Performance par secteur
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-6">
                      <div>
                        <div className="flex items-center mb-2">
                          <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[0] }}></div>
                          <h3 className="font-medium">Hôtellerie (32%)</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          Premier secteur en termes de CA avec une forte croissance sur les solutions de connectivité.
                        </p>
                        <div className="flex justify-between text-sm mb-1">
                          <span>CA moyen par client</span>
                          <span className="font-medium">12 750 €</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Taux de fidélisation</span>
                          <span className="font-medium">93%</span>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <div className="flex items-center mb-2">
                          <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[1] }}></div>
                          <h3 className="font-medium">Santé (25%)</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          Forte croissance dans ce secteur, notamment sur les solutions sécurisées et de téléphonie.
                        </p>
                        <div className="flex justify-between text-sm mb-1">
                          <span>CA moyen par client</span>
                          <span className="font-medium">18 320 €</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Taux de fidélisation</span>
                          <span className="font-medium">89%</span>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <div className="flex items-center mb-2">
                          <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[2] }}></div>
                          <h3 className="font-medium">Commercial (18%)</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          Secteur stable avec une demande forte en solutions de mobilité et communications unifiées.
                        </p>
                        <div className="flex justify-between text-sm mb-1">
                          <span>CA moyen par client</span>
                          <span className="font-medium">9 845 €</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Taux de fidélisation</span>
                          <span className="font-medium">78%</span>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <div className="flex items-center mb-2">
                          <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[3] }}></div>
                          <h3 className="font-medium">Éducation (15%)</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          Secteur en développement avec des besoins spécifiques en wifi et solutions collaboratives.
                        </p>
                        <div className="flex justify-between text-sm mb-1">
                          <span>CA moyen par client</span>
                          <span className="font-medium">22 150 €</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Taux de fidélisation</span>
                          <span className="font-medium">91%</span>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <div className="flex items-center mb-2">
                          <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[4] }}></div>
                          <h3 className="font-medium">Industrie (10%)</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          Secteur avec des exigences élevées en termes de fiabilité et de résilience des solutions.
                        </p>
                        <div className="flex justify-between text-sm mb-1">
                          <span>CA moyen par client</span>
                          <span className="font-medium">26 730 €</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Taux de fidélisation</span>
                          <span className="font-medium">85%</span>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Cartographie des clients</CardTitle>
                <CardDescription>
                  Analyse géographique de la clientèle
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center py-8 text-gray-500">
                  <div className="text-center">
                    <Map className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Cartographie interactive</h3>
                    <p className="max-w-md mx-auto">
                      La visualisation cartographique sera disponible dans la prochaine mise à jour.
                      Cette fonctionnalité permettra d'analyser la répartition géographique des clients.
                    </p>
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="font-medium mb-3">Top régions</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span>Île-de-France</span>
                        <Badge>32%</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Auvergne-Rhône-Alpes</span>
                        <Badge>18%</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Provence-Alpes-Côte d'Azur</span>
                        <Badge>14%</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Occitanie</span>
                        <Badge>11%</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Hauts-de-France</span>
                        <Badge>8%</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-3">Croissance par région</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span>Grand Est</span>
                        <Badge className="bg-green-100 text-green-800">+25%</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Bretagne</span>
                        <Badge className="bg-green-100 text-green-800">+18%</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Nouvelle-Aquitaine</span>
                        <Badge className="bg-green-100 text-green-800">+15%</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Île-de-France</span>
                        <Badge className="bg-green-100 text-green-800">+9%</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Centre-Val de Loire</span>
                        <Badge className="bg-red-100 text-red-800">-3%</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-3">Taille des entreprises</h3>
                    <ResponsiveContainer width="100%" height={150}>
                      <PieChart>
                        <Pie
                          data={[
                            { name: "TPE", value: 28 },
                            { name: "PME", value: 45 },
                            { name: "ETI", value: 22 },
                            { name: "GE", value: 5 },
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={30}
                          outerRadius={60}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {segmentationData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value}%`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default AdvancedReporting;
