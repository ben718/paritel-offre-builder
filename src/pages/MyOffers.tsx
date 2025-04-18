
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Plus, Filter, Building, Calendar, User, FileText, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllOffers, updateOfferStatus } from "@/services/OfferService"; // Fixed imports
import type { Database } from "@/integrations/supabase/types";

type OfferStatus = Database["public"]["Enums"]["offer_status"];

const statusLabels: Record<OfferStatus, { label: string; color: string }> = {
  draft: { label: "Brouillon", color: "bg-gray-500" },
  sent: { label: "Envoyé", color: "bg-blue-500" },
  in_progress: { label: "En cours", color: "bg-yellow-500" },
  accepted: { label: "Accepté", color: "bg-green-500" },
  rejected: { label: "Refusé", color: "bg-red-500" },
  expired: { label: "Expiré", color: "bg-gray-700" }
};

const MyOffers = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  // Mutation pour mettre à jour le statut de l'offre
  const updateStatusMutation = useMutation({
    mutationFn: ({offerId, newStatus}: {offerId: string, newStatus: OfferStatus}) => 
      updateOfferStatus(offerId, newStatus), // Fixed function call
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offers'] });
      toast({
        title: "Statut mis à jour",
        description: "Le statut de l'offre a été mis à jour avec succès.",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut de l'offre.",
        variant: "destructive",
      });
    },
  });

  const { data: allOffers = [], isLoading } = useQuery({
    queryKey: ['offers'],
    queryFn: async () => {
      const offers = await getAllOffers(); // Fixed function call
      return offers.map(offer => ({
        id: offer.id,
        customer_name: offer.customer_name,
        customer_type: offer.customer_industry,
        date: offer.created_at,
        products: 0, // Nous devrons faire une requête séparée pour compter les produits
        contact_name: offer.contact_name,
        status: offer.status as OfferStatus,
      }));
    }
  });

  const handleStatusChange = async (offerId: string, newStatus: OfferStatus) => {
    updateStatusMutation.mutate({offerId, newStatus});
  };

  const filteredOffers = allOffers.filter(offer => {
    const matchesSearch = 
      searchTerm === "" || 
      offer.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.contact_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filterStatus === null || 
      offer.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Mes Offres</h1>
            <p className="text-muted-foreground mt-1">
              Gérez vos offres commerciales et suivez leur statut
            </p>
          </div>
          <Button 
            className="bg-paritel-primary hover:bg-paritel-dark"
            onClick={() => navigate('/create-offer')}
          >
            <Plus className="mr-2 h-4 w-4" />
            Créer une offre
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher une offre..."
              className="w-full py-2 pl-9 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-paritel-accent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex-shrink-0 w-full sm:w-auto">
            <Select 
              value={filterStatus || "all"} 
              onValueChange={(value) => setFilterStatus(value === "all" ? null : value as OfferStatus)}
            >
              <SelectTrigger className="w-full sm:w-[200px]">
                <div className="flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  <span>{filterStatus ? statusLabels[filterStatus as OfferStatus].label : "Tous les statuts"}</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                {Object.entries(statusLabels).map(([key, { label }]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Offres ({filteredOffers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin h-8 w-8 border-2 border-paritel-primary border-t-transparent rounded-full"></div>
              </div>
            ) : filteredOffers.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-1">Aucune offre trouvée</h3>
                <p className="text-gray-500">
                  {searchTerm || filterStatus 
                    ? "Aucune offre ne correspond à vos critères de recherche" 
                    : "Commencez par créer une nouvelle offre"}
                </p>
                {!searchTerm && !filterStatus && (
                  <Button 
                    className="mt-4 bg-paritel-primary"
                    onClick={() => navigate('/create-offer')}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Créer une offre
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-500 text-sm border-b">
                      <th className="font-medium p-3 pl-0">Client</th>
                      <th className="font-medium p-3">Date</th>
                      <th className="font-medium p-3">Contact</th>
                      <th className="font-medium p-3">Produits</th>
                      <th className="font-medium p-3">Statut</th>
                      <th className="font-medium p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOffers.map(offer => (
                      <tr key={offer.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 pl-0">
                          <div className="flex items-start">
                            <Building className="h-4 w-4 text-gray-400 mt-0.5 mr-2" />
                            <div>
                              <div className="font-medium">{offer.customer_name}</div>
                              <div className="text-xs text-gray-500">{offer.customer_type}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                            <span>{new Date(offer.date).toLocaleDateString()}</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center">
                            <User className="h-4 w-4 text-gray-400 mr-2" />
                            <span>{offer.contact_name}</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <Badge variant="outline">{offer.products} produit{offer.products > 1 ? 's' : ''}</Badge>
                        </td>
                        <td className="p-3">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="p-0 h-auto">
                                <Badge className={`${statusLabels[offer.status].color} text-white`}>
                                  {statusLabels[offer.status].label}
                                </Badge>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                              {Object.entries(statusLabels).map(([key, { label }]) => (
                                <DropdownMenuItem 
                                  key={key}
                                  onClick={() => handleStatusChange(offer.id, key as OfferStatus)}
                                  className={offer.status === key ? "font-medium" : ""}
                                >
                                  {label}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                        <td className="p-3 text-right">
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4 mr-1" />
                            PDF
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="ml-2"
                            onClick={() => navigate(`/create-offer?edit=${offer.id}`)}
                          >
                            Voir
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="rounded-lg border border-dashed p-6 text-center">
          <h3 className="text-lg font-medium mb-2">Besoin de créer une réponse à un Appel d'Offres?</h3>
          <p className="text-gray-600 mb-4">
            Importez un document PDF ou Word pour générer automatiquement une réponse à un Appel d'Offres
          </p>
          <Button className="bg-paritel-primary">
            Importer un document AO
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default MyOffers;
