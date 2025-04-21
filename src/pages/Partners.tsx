import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Plus, Filter, X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { fetchPartners, deletePartner } from "@/services/PartnerService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import PartnerDetails from "@/components/partners/PartnerDetails";
import { useIsMobile } from "@/hooks/use-mobile";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

// Define the type here
export interface PartnerCardProps {
  id: string; // Changed to string to be consistent with UUID from database
  name: string;
  description?: string;
  industry?: string;
  logo_url?: string;
  website_url?: string;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const Partners = () => {
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<PartnerCardProps | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: partners = [], isLoading, error } = useQuery({
    queryKey: ['partners'],
    queryFn: () => fetchPartners(),
  });

  const deletePartnerMutation = useMutation({
    mutationFn: (id: string) => deletePartner(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partners'] });
      toast({
        title: "Partenaire supprimé",
        description: "Le partenaire a été supprimé avec succès.",
      });
    },
    onError: (error) => {
      console.error('Error deleting partner:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le partenaire.",
        variant: "destructive",
      });
    }
  });

  const filteredPartners = partners.filter(partner => {
    const matchesSearch =
      searchTerm === "" ||
      partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.industry?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const handleViewPartnerDetails = (id: string) => {
    const partner = partners.find(p => p.id === id);
    if (partner) {
      setSelectedPartner(partner);
      setIsDetailsDialogOpen(true);
    }
  };

  const handleDeletePartner = (id: string) => {
    deletePartnerMutation.mutate(id);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Partenaires</h1>
            <p className="text-muted-foreground mt-1">
              Gérez vos partenaires
            </p>
          </div>
          <Button
            className="bg-paritel-primary hover:bg-paritel-dark"
            onClick={() => toast({
              title: "Ajout de partenaire",
              description: "Fonctionnalité à venir.",
            })}
          >
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un partenaire
          </Button>
        </div>

        <Tabs defaultValue="all">
          <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
            <TabsList>
              <TabsTrigger value="all">Tous les partenaires</TabsTrigger>
              <TabsTrigger value="telephonie">Téléphonie</TabsTrigger>
              <TabsTrigger value="reseau">Réseau</TabsTrigger>
              <TabsTrigger value="securite">Sécurité</TabsTrigger>
            </TabsList>

            <div className="flex gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:flex-initial">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Rechercher un partenaire..."
                  className="pl-8 w-full md:w-[250px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Button
                variant="outline"
                onClick={() => setSearchTerm("")}
                className="whitespace-nowrap"
              >
                <X className="h-4 w-4 mr-2" />
                Réinitialiser
              </Button>
            </div>
          </div>

          <TabsContent value="all" className="mt-0">
            {isLoading ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin h-8 w-8 border-2 border-paritel-primary border-t-transparent rounded-full"></div>
              </div>
            ) : error ? (
              <div className="text-red-500">Error: {(error as Error).message}</div>
            ) : filteredPartners.length === 0 ? (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <p className="text-gray-500">Aucun partenaire ne correspond à vos critères</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPartners.map(partner => (
                  <Card key={partner.id} className="overflow-hidden">
                    <div className="relative h-40 sm:h-48 bg-paritel-lightgray">
                      <img
                        src={partner.logo_url}
                        alt={partner.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-medium text-base sm:text-lg mb-1 line-clamp-1">{partner.name}</h3>
                      <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-2">{partner.description}</p>
                      <div className="flex justify-between">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewPartnerDetails(partner.id)}
                        >
                          Détails
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeletePartner(partner.id)}
                        >
                          Supprimer
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="telephonie" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPartners
                .filter(partner => partner.industry === "Téléphonie d'entreprise")
                .map(partner => (
                  <Card key={partner.id} className="overflow-hidden">
                    <div className="relative h-40 sm:h-48 bg-paritel-lightgray">
                      <img
                        src={partner.logo_url}
                        alt={partner.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-medium text-base sm:text-lg mb-1 line-clamp-1">{partner.name}</h3>
                      <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-2">{partner.description}</p>
                      <div className="flex justify-between">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewPartnerDetails(partner.id)}
                        >
                          Détails
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeletePartner(partner.id)}
                        >
                          Supprimer
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="reseau" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPartners
                .filter(partner => partner.industry === "Réseau")
                .map(partner => (
                  <Card key={partner.id} className="overflow-hidden">
                    <div className="relative h-40 sm:h-48 bg-paritel-lightgray">
                      <img
                        src={partner.logo_url}
                        alt={partner.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-medium text-base sm:text-lg mb-1 line-clamp-1">{partner.name}</h3>
                      <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-2">{partner.description}</p>
                      <div className="flex justify-between">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewPartnerDetails(partner.id)}
                        >
                          Détails
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeletePartner(partner.id)}
                        >
                          Supprimer
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="securite" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPartners
                .filter(partner => partner.industry === "Sécurité")
                .map(partner => (
                  <Card key={partner.id} className="overflow-hidden">
                    <div className="relative h-40 sm:h-48 bg-paritel-lightgray">
                      <img
                        src={partner.logo_url}
                        alt={partner.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-medium text-base sm:text-lg mb-1 line-clamp-1">{partner.name}</h3>
                      <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-2">{partner.description}</p>
                      <div className="flex justify-between">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewPartnerDetails(partner.id)}
                        >
                          Détails
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeletePartner(partner.id)}
                        >
                          Supprimer
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>

        <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
          <DialogContent className={`${isMobile ? 'max-w-full p-4' : 'sm:max-w-[800px]'} max-h-[90vh] overflow-y-auto`}>
            {selectedPartner && (
              <PartnerDetails
                partner={selectedPartner}
                onBack={() => setIsDetailsDialogOpen(false)}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default Partners;
