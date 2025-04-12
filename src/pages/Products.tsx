
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, Filter, ArrowUpDown } from "lucide-react";
import { useState } from "react";

type ProductCardProps = {
  id: number;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  partner?: string;
  tags: string[];
  pricing?: string;
  image: string;
};

const ProductCard = ({
  id,
  name,
  description,
  category,
  subcategory,
  partner,
  tags,
  pricing,
  image,
}: ProductCardProps) => {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-48 bg-gray-100">
        <div className="absolute top-2 left-2">
          <Badge className="bg-gray-800 text-white">{category}</Badge>
          {subcategory && (
            <Badge className="ml-1 bg-gray-600 text-white">{subcategory}</Badge>
          )}
        </div>
        {partner && (
          <div className="absolute top-2 right-2">
            <Badge variant="outline" className="bg-white">
              {partner}
            </Badge>
          </div>
        )}
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-medium text-lg mb-1">{name}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{description}</p>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {tags.map((tag, i) => (
            <Badge key={i} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        {pricing && (
          <div className="text-sm text-gray-700 mb-2">
            À partir de <span className="font-semibold text-paritel-primary">{pricing}</span>
          </div>
        )}
        
        <div className="flex justify-between">
          <Button variant="outline" size="sm">
            Détails
          </Button>
          <Button variant="default" size="sm" className="bg-paritel-primary">
            Ajouter
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const Products = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const products: ProductCardProps[] = [
    {
      id: 1,
      name: "FTTO Dédie 1Gb/s",
      description: "Fibre optique dédiée entreprise avec garantie de débit symétrique et GTR 4h 24/7.",
      category: "Réseau",
      subcategory: "Fibre",
      partner: "Fortinet",
      tags: ["Haute disponibilité", "Sur site"],
      pricing: "599€/mois",
      image: "https://placehold.co/600x400/252f3f/ffffff?text=FTTO",
    },
    {
      id: 2,
      name: "Firewall Fortinet UTM",
      description: "Solution de pare-feu nouvelle génération avec fonctionnalités UTM avancées.",
      category: "Cybersécurité",
      partner: "Fortinet",
      tags: ["Sécurité", "Sur site"],
      pricing: "99€/mois",
      image: "https://placehold.co/600x400/252f3f/ffffff?text=Firewall",
    },
    {
      id: 3,
      name: "Neoconnect+ UCaaS",
      description: "Solution de communications unifiées as a Service incluant téléphonie, visio et messagerie.",
      category: "Téléphonie",
      subcategory: "UCaaS",
      tags: ["Cloud", "Licence", "IPBX"],
      pricing: "15€/utilisateur/mois",
      image: "https://placehold.co/600x400/252f3f/ffffff?text=UCaaS",
    },
    {
      id: 4,
      name: "Wifi Entreprise",
      description: "Solution Wifi professionnelle avec contrôleur centralisé et points d'accès haute densité.",
      category: "Wifi",
      partner: "Cambium Networks",
      tags: ["Hôtellerie", "Sur site", "Réseau"],
      pricing: "45€/mois",
      image: "https://placehold.co/600x400/252f3f/ffffff?text=WiFi",
    },
    {
      id: 5,
      name: "Support IT Niveau 1",
      description: "Service de support informatique de premier niveau avec hotline dédiée 7/7.",
      category: "Services managés",
      tags: ["Support", "Service", "Maintenance"],
      pricing: "49€/utilisateur/mois",
      image: "https://placehold.co/600x400/252f3f/ffffff?text=Support",
    },
    {
      id: 6,
      name: "Solution Hôtelière Intégrée",
      description: "Offre complète pour l'hôtellerie incluant WiFi, IPTV et téléphonie.",
      category: "Verticaux métiers",
      partner: "Cambium Networks",
      tags: ["Hôtellerie", "IPTV", "Wifi"],
      pricing: "Sur devis",
      image: "https://placehold.co/600x400/252f3f/ffffff?text=Hotel",
    },
  ];
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Catalogue Produits et Services</h1>
            <p className="text-muted-foreground mt-1">
              Consultez notre catalogue complet de produits, services et partenaires
            </p>
          </div>
          <Button className="bg-paritel-primary hover:bg-paritel-dark">
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un produit
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher un produit ou service..."
              className="w-full py-2 pl-9 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-paritel-accent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex gap-2">
              <Filter className="h-4 w-4" />
              Filtres avancés
            </Button>
            <Button variant="outline" className="flex gap-2">
              <ArrowUpDown className="h-4 w-4" />
              Trier
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">Tous les produits</TabsTrigger>
            <TabsTrigger value="telephony">Téléphonie</TabsTrigger>
            <TabsTrigger value="network">Réseau</TabsTrigger>
            <TabsTrigger value="cybersecurity">Cybersécurité</TabsTrigger>
            <TabsTrigger value="wifi">Wifi</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="telephony" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products
                .filter((p) => p.category === "Téléphonie")
                .map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
            </div>
          </TabsContent>
          {/* Similar for other tabs */}
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Products;
