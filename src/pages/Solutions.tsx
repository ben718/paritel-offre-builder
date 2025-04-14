
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Building, 
  Network, 
  Phone, 
  ShieldCheck, 
  Wifi, 
  Package, 
  Plus, 
  Eye,
  Edit,
  Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import SolutionForm from "@/components/solutions/SolutionForm";
import { products } from "@/data/productData";

type SolutionCardProps = {
  id: string; // Changed from number to string to match SolutionProps
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

type SolutionCardComponentProps = SolutionCardProps & {
  onEdit?: (id: string) => void; // Changed from number to string to match SolutionProps
  onDelete?: (id: string) => void; // Changed from number to string to match SolutionProps
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
  onEdit,
  onDelete
}: SolutionCardComponentProps) => {
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
        
        <div className="flex flex-col sm:flex-row sm:justify-between mt-auto gap-2">
          {onEdit && onDelete ? (
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onEdit(id)}
                className="w-full sm:w-auto"
              >
                <Edit className="h-4 w-4 mr-1" />
                Modifier
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-600 border-red-200 hover:bg-red-50 w-full sm:w-auto"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Supprimer
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="max-w-[90vw] sm:max-w-lg">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cette solution ?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Cette action est irréversible. La solution '{name}' sera définitivement supprimée.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onDelete(id)} className="bg-red-600">
                      Supprimer
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ) : (
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              <Eye className="h-4 w-4 mr-2" />
              Détails
            </Button>
          )}
          <Button variant="default" size="sm" className="bg-paritel-primary w-full sm:w-auto">
            Utiliser
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const Solutions = () => {
  const [solutions, setSolutions] = useState<SolutionCardProps[]>([
    {
      id: "1", // Changed from number to string to match SolutionProps
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
      id: "2", // Changed from number to string to match SolutionProps
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
      id: "3", // Changed from number to string to match SolutionProps
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
      id: "4", // Changed from number to string to match SolutionProps
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
      id: "5", // Changed from number to string to match SolutionProps
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
      id: "6", // Changed from number to string to match SolutionProps
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
  ]);
  
  const [selectedTab, setSelectedTab] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingSolution, setEditingSolution] = useState<Partial<SolutionCardProps> | null>(null);
  
  // Available products for the form
  const availableProducts = products.map(p => ({
    id: p.id,
    name: p.name,
    category: p.category
  }));
  
  // Handler functions for CRUD operations
  const handleAddSolution = (data: Partial<SolutionCardProps>) => {
    const newSolution = {
      ...data,
      id: solutions.length > 0 ? String(Math.max(...solutions.map(s => Number(s.id))) + 1) : "1", // Changed to support string id
      products: data.products || [],
    } as SolutionCardProps;
    
    setSolutions([...solutions, newSolution]);
    setIsAddDialogOpen(false);
  };
  
  const handleEditSolution = (id: string) => { // Changed from number to string to match SolutionProps
    const solution = solutions.find(s => s.id === id);
    if (solution) {
      setEditingSolution(solution);
      setIsEditDialogOpen(true);
    }
  };
  
  const handleUpdateSolution = (data: Partial<SolutionCardProps>) => {
    setSolutions(solutions.map(solution => 
      solution.id === data.id ? { ...solution, ...data } as SolutionCardProps : solution
    ));
    setEditingSolution(null);
    setIsEditDialogOpen(false);
  };
  
  const handleDeleteSolution = (id: string) => { // Changed from number to string to match SolutionProps
    setSolutions(solutions.filter(solution => solution.id !== id));
  };
  
  // Filter solutions based on selected tab
  const filteredSolutions = selectedTab === "all" 
    ? solutions 
    : solutions.filter(s => {
        switch (selectedTab) {
          case "hotel": return s.industry === "Hôtellerie";
          case "health": return s.industry === "Santé";
          case "business": return s.industry === "Entreprise";
          case "education": return s.industry === "Éducation";
          case "public": return s.industry === "Secteur Public";
          default: return true;
        }
      });
  
  // Add callbacks to solutions for CRUD operations
  const solutionsWithCallbacks = filteredSolutions.map(solution => ({
    ...solution,
    onEdit: handleEditSolution,
    onDelete: handleDeleteSolution
  }));
  
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
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-paritel-primary hover:bg-paritel-dark">
                <Plus className="mr-2 h-4 w-4" />
                Créer une solution
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Créer une nouvelle solution métier</DialogTitle>
                <DialogDescription>
                  Remplissez les informations pour créer une nouvelle solution métier.
                </DialogDescription>
              </DialogHeader>
              <SolutionForm 
                onSubmit={handleAddSolution} 
                onCancel={() => setIsAddDialogOpen(false)} 
                availableProducts={availableProducts}
              />
            </DialogContent>
          </Dialog>
          
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Modifier la solution</DialogTitle>
                <DialogDescription>
                  Modifiez les informations de la solution métier.
                </DialogDescription>
              </DialogHeader>
              {editingSolution && (
                <SolutionForm 
                  solution={editingSolution} 
                  onSubmit={handleUpdateSolution} 
                  onCancel={() => {
                    setEditingSolution(null);
                    setIsEditDialogOpen(false);
                  }} 
                  availableProducts={availableProducts}
                />
              )}
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="all" onValueChange={setSelectedTab}>
          <TabsList className="flex flex-wrap">
            <TabsTrigger value="all">Tous les secteurs</TabsTrigger>
            <TabsTrigger value="hotel">Hôtellerie</TabsTrigger>
            <TabsTrigger value="health">Santé</TabsTrigger>
            <TabsTrigger value="business">Entreprise</TabsTrigger>
            <TabsTrigger value="education">Éducation</TabsTrigger>
            <TabsTrigger value="public">Secteur Public</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {solutionsWithCallbacks.map((solution) => (
                <SolutionCard key={solution.id} {...solution} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="hotel" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {solutionsWithCallbacks.map((solution) => (
                <SolutionCard key={solution.id} {...solution} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="health" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {solutionsWithCallbacks.map((solution) => (
                <SolutionCard key={solution.id} {...solution} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="business" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {solutionsWithCallbacks.map((solution) => (
                <SolutionCard key={solution.id} {...solution} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="education" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {solutionsWithCallbacks.map((solution) => (
                <SolutionCard key={solution.id} {...solution} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="public" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {solutionsWithCallbacks.map((solution) => (
                <SolutionCard key={solution.id} {...solution} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Solutions;
