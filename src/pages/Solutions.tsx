
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, Network, Phone, ShieldCheck, Wifi, Package, Plus, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

type SolutionCardProps = {
  id: number;
  name: string;
  description: string;
  industry: string;
  products: {
    id: number;
    name: string;
    category: string;
  }[];
  image: string;
  recommended?: boolean;
};

const categoryIcons: Record<string, React.ReactNode> = {
  "Téléphonie": <Phone className="h-4 w-4" />,
  "Réseau": <Network className="h-4 w-4" />,
  "Cybersécurité": <ShieldCheck className="h-4 w-4" />,
  "Wifi": <Wifi className="h-4 w-4" />,
  "Produit": <Package className="h-4 w-4" />,
};

const SolutionCard = ({
  id,
  name,
  description,
  industry,
  products,
  image,
  recommended,
}: SolutionCardProps) => {
  return (
    <Card className={cn(
      "overflow-hidden border-2",
      recommended ? "border-paritel-primary" : "border-gray-200"
    )}>
      <div className="relative h-48 bg-gray-100">
        {recommended && (
          <div className="absolute top-0 right-0 bg-paritel-primary text-white px-3 py-1 text-xs font-semibold">
            Recommandé
          </div>
        )}
        <div className="absolute top-2 left-2">
          <Badge 
            className={cn(
              "bg-industry-business text-white",
              industry === "Hôtellerie" && "bg-industry-hotel",
              industry === "Santé" && "bg-industry-health",
              industry === "Éducation" && "bg-industry-education",
              industry === "Secteur Public" && "bg-industry-public"
            )}
          >
            {industry}
          </Badge>
        </div>
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-medium text-lg mb-1">{name}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{description}</p>
        
        <div className="mb-3">
          <h4 className="text-sm font-medium mb-2">Produits inclus :</h4>
          <div className="space-y-1">
            {products.slice(0, 3).map((product) => (
              <div key={product.id} className="flex items-center text-sm">
                {categoryIcons[product.category] || <Package className="h-4 w-4" />}
                <span className="ml-2">{product.name}</span>
              </div>
            ))}
            {products.length > 3 && (
              <div className="text-xs text-paritel-primary">
                +{products.length - 3} autres produits
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-between">
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            Détails
          </Button>
          <Button variant="default" size="sm" className="bg-paritel-primary">
            Utiliser
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const Solutions = () => {
  const solutions: SolutionCardProps[] = [
    {
      id: 1,
      name: "Pack Hôtellerie Premium",
      description: "Solution complète pour les hôtels incluant wifi, téléphonie et TV interactive.",
      industry: "Hôtellerie",
      products: [
        { id: 1, name: "Wifi Professionnel Haute Densité", category: "Wifi" },
        { id: 2, name: "IPTV Interactive", category: "Produit" },
        { id: 3, name: "Téléphonie IP Chambres", category: "Téléphonie" },
        { id: 4, name: "Hotspot Géré", category: "Wifi" },
        { id: 5, name: "Firewall UTM", category: "Cybersécurité" },
      ],
      image: "https://placehold.co/600x400/0f766e/ffffff?text=Hôtellerie+Premium",
      recommended: true
    },
    {
      id: 2,
      name: "Pack Hôtellerie Standard",
      description: "Offre essentielle pour les hôtels de petite et moyenne taille.",
      industry: "Hôtellerie",
      products: [
        { id: 1, name: "Wifi Standard", category: "Wifi" },
        { id: 2, name: "Téléphonie IP Basic", category: "Téléphonie" },
        { id: 3, name: "Firewall", category: "Cybersécurité" },
      ],
      image: "https://placehold.co/600x400/0f766e/ffffff?text=Hôtellerie+Standard",
    },
    {
      id: 3,
      name: "Pack Santé Connect",
      description: "Solution sécurisée pour les établissements de santé avec réseau cloisonné.",
      industry: "Santé",
      products: [
        { id: 1, name: "Réseau Segmenté", category: "Réseau" },
        { id: 2, name: "Téléphonie IP DECT", category: "Téléphonie" },
        { id: 3, name: "Firewall Santé", category: "Cybersécurité" },
        { id: 4, name: "Wifi Professionnel", category: "Wifi" },
        { id: 5, name: "Sauvegarde Cloud", category: "Produit" },
      ],
      image: "https://placehold.co/600x400/be123c/ffffff?text=Santé+Connect",
      recommended: true
    },
    {
      id: 4,
      name: "Pack PME Cloud",
      description: "Solution complète pour les PME avec communications unifiées et cybersécurité.",
      industry: "Entreprise",
      products: [
        { id: 1, name: "UCaaS", category: "Téléphonie" },
        { id: 2, name: "Fibre Dédiée", category: "Réseau" },
        { id: 3, name: "Email Sécurisé", category: "Cybersécurité" },
        { id: 4, name: "Wifi Professionnel", category: "Wifi" },
      ],
      image: "https://placehold.co/600x400/1e40af/ffffff?text=PME+Cloud",
    },
    {
      id: 5,
      name: "Pack Éducation Connect",
      description: "Solution adaptée aux établissements éducatifs avec wifi haute densité et filtrage.",
      industry: "Éducation",
      products: [
        { id: 1, name: "Wifi Haute Densité", category: "Wifi" },
        { id: 2, name: "Filtrage Web", category: "Cybersécurité" },
        { id: 3, name: "Fibre Mutualisée", category: "Réseau" },
        { id: 4, name: "Téléphonie IP", category: "Téléphonie" },
      ],
      image: "https://placehold.co/600x400/365314/ffffff?text=Éducation+Connect",
    },
    {
      id: 6,
      name: "Pack Secteur Public",
      description: "Solution sécurisée pour les collectivités locales avec téléphonie avancée.",
      industry: "Secteur Public",
      products: [
        { id: 1, name: "IPBX Avancé", category: "Téléphonie" },
        { id: 2, name: "SD-WAN", category: "Réseau" },
        { id: 3, name: "Cybersécurité Avancée", category: "Cybersécurité" },
        { id: 4, name: "Wifi Public RGPD", category: "Wifi" },
      ],
      image: "https://placehold.co/600x400/78350f/ffffff?text=Secteur+Public",
    },
  ];
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Solutions Métiers</h1>
            <p className="text-muted-foreground mt-1">
              Packs verticaux par secteur d'activité prêts à l'emploi
            </p>
          </div>
          <Button className="bg-paritel-primary hover:bg-paritel-dark">
            <Plus className="mr-2 h-4 w-4" />
            Créer une solution
          </Button>
        </div>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">Tous les secteurs</TabsTrigger>
            <TabsTrigger value="hotel">Hôtellerie</TabsTrigger>
            <TabsTrigger value="health">Santé</TabsTrigger>
            <TabsTrigger value="business">Entreprise</TabsTrigger>
            <TabsTrigger value="education">Éducation</TabsTrigger>
            <TabsTrigger value="public">Secteur Public</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {solutions.map((solution) => (
                <SolutionCard key={solution.id} {...solution} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="hotel" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {solutions
                .filter((s) => s.industry === "Hôtellerie")
                .map((solution) => (
                  <SolutionCard key={solution.id} {...solution} />
                ))}
            </div>
          </TabsContent>
          {/* Similar filters for other tabs */}
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Solutions;
