
import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import {
  Plus,
  Search,
  Calendar,
  User,
  Building,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Clock,
  Send,
  FileText,
  Download,
  Trash2,
  Eye,
  PencilLine,
  Filter
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { getAllOffers, updateOfferStatus, deleteOffer, OfferData, OfferStatus } from "@/services/OfferService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const statusLabels = {
  'draft': 'Brouillon',
  'sent': 'Envoyée',
  'in_progress': 'En cours',
  'accepted': 'Acceptée',
  'rejected': 'Refusée',
  'expired': 'Expirée'
};

const statusColors = {
  'draft': 'bg-gray-100 text-gray-800',
  'sent': 'bg-blue-100 text-blue-800',
  'in_progress': 'bg-amber-100 text-amber-800',
  'accepted': 'bg-green-100 text-green-800',
  'rejected': 'bg-red-100 text-red-800',
  'expired': 'bg-purple-100 text-purple-800'
};

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const MyOffers = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<OfferData | null>(null);
  
  const { data: offers = [], isLoading } = useQuery({
    queryKey: ['offers'],
    queryFn: getAllOffers
  });
  
  const deleteMutation = useMutation({
    mutationFn: (offerId: string) => deleteOffer(offerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offers'] });
      toast({
        title: "Offre supprimée",
        description: "L'offre a été supprimée avec succès"
      });
      setShowDeleteDialog(false);
    },
    onError: (error) => {
      console.error("Error deleting offer:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer l'offre"
      });
    }
  });
  
  const updateStatusMutation = useMutation({
    mutationFn: ({ offerId, status }: { offerId: string, status: OfferStatus }) => 
      updateOfferStatus(offerId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offers'] });
      toast({
        title: "Statut mis à jour",
        description: "Le statut de l'offre a été mis à jour avec succès"
      });
    },
    onError: (error) => {
      console.error("Error updating status:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le statut"
      });
    }
  });
  
  const filteredOffers = offers.filter(offer => 
    offer.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    offer.customer_industry?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    offer.contact_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleCreateNewOffer = () => {
    navigate('/create-offer');
  };
  
  const handleUpdateStatus = (offerId: string, status: OfferStatus) => {
    updateStatusMutation.mutate({ offerId, status });
  };
  
  const handleViewOffer = (offerId: string) => {
    toast({
      title: "Vue détaillée",
      description: "Fonctionnalité à venir"
    });
  };
  
  const handleEditOffer = (offerId: string) => {
    toast({
      title: "Édition",
      description: "Fonctionnalité à venir"
    });
  };
  
  const handleDownloadOffer = (offerId: string) => {
    toast({
      title: "Téléchargement",
      description: "Fonctionnalité à venir"
    });
  };
  
  const confirmDeleteOffer = (offer: OfferData) => {
    setSelectedOffer(offer);
    setShowDeleteDialog(true);
  };
  
  const handleDeleteOffer = () => {
    if (selectedOffer) {
      deleteMutation.mutate(selectedOffer.id);
    }
  };
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Mes Offres</h1>
            <p className="text-muted-foreground">Gérez et suivez vos offres commerciales</p>
          </div>
          <Button onClick={handleCreateNewOffer} className="bg-paritel-primary whitespace-nowrap">
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle Offre
          </Button>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
            <TabsList>
              <TabsTrigger value="all">
                Toutes
                <Badge className="ml-2 bg-gray-200 text-gray-800">{offers.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="active">
                En cours
                <Badge className="ml-2 bg-amber-100 text-amber-800">
                  {offers.filter(o => o.status === 'in_progress' || o.status === 'sent').length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="accepted">
                Acceptées
                <Badge className="ml-2 bg-green-100 text-green-800">
                  {offers.filter(o => o.status === 'accepted').length}
                </Badge>
              </TabsTrigger>
            </TabsList>
            
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Rechercher une offre..."
                className="pl-8 w-full sm:w-[250px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <TabsContent value="all">
            {isLoading ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin h-8 w-8 border-2 border-paritel-primary border-t-transparent rounded-full"></div>
              </div>
            ) : filteredOffers.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                  <div className="rounded-full bg-gray-100 p-3 mb-3">
                    <FileText className="h-6 w-6 text-gray-500" />
                  </div>
                  <h3 className="font-medium mb-1">Aucune offre trouvée</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {searchTerm ? 
                      "Essayez différents termes de recherche" : 
                      "Vous n'avez pas encore créé d'offres"}
                  </p>
                  {!searchTerm && (
                    <Button onClick={handleCreateNewOffer} className="bg-paritel-primary">
                      <Plus className="mr-2 h-4 w-4" />
                      Créer votre première offre
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredOffers.map((offer) => (
                  <Card key={offer.id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <Badge className={statusColors[offer.status]}>
                          {statusLabels[offer.status]}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Options</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleViewOffer(offer.id)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Voir
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditOffer(offer.id)}>
                              <PencilLine className="mr-2 h-4 w-4" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDownloadOffer(offer.id)}>
                              <Download className="mr-2 h-4 w-4" />
                              Télécharger
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => confirmDeleteOffer(offer)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <CardTitle className="text-lg">{offer.customer_name || "Client non spécifié"}</CardTitle>
                      <CardDescription>
                        {offer.customer_industry ? (
                          <span className="flex items-center">
                            <Building className="mr-1 h-3 w-3" /> 
                            {offer.customer_industry}
                          </span>
                        ) : null}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-3">
                      {offer.contact_name && (
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <User className="mr-1 h-3 w-3" />
                          Contact: {offer.contact_name}
                        </div>
                      )}
                      
                      {offer.created_at && (
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <Calendar className="mr-1 h-3 w-3" />
                          Créée le: {formatDate(offer.created_at)}
                        </div>
                      )}
                      
                      {offer.valid_until && (
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="mr-1 h-3 w-3" />
                          Valide jusqu'au: {formatDate(offer.valid_until)}
                        </div>
                      )}
                      
                      {offer.total_amount !== undefined && (
                        <div className="mt-3 font-semibold">
                          Montant: {offer.total_amount.toLocaleString('fr-FR')} €
                        </div>
                      )}
                    </CardContent>
                    <Separator />
                    <CardFooter className="pt-3">
                      <div className="flex gap-2 w-full">
                        {offer.status === 'draft' && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="flex-1"
                              onClick={() => handleEditOffer(offer.id)}
                            >
                              <PencilLine className="mr-1 h-4 w-4" />
                              Éditer
                            </Button>
                            <Button 
                              size="sm"
                              className="flex-1 bg-paritel-primary"
                              onClick={() => handleUpdateStatus(offer.id, 'sent')}
                            >
                              <Send className="mr-1 h-4 w-4" />
                              Envoyer
                            </Button>
                          </>
                        )}
                        
                        {offer.status === 'sent' && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="flex-1"
                              onClick={() => handleUpdateStatus(offer.id, 'in_progress')}
                            >
                              <Clock className="mr-1 h-4 w-4" />
                              En cours
                            </Button>
                            <Button 
                              size="sm"
                              className="flex-1 bg-paritel-primary"
                              onClick={() => handleDownloadOffer(offer.id)}
                            >
                              <Download className="mr-1 h-4 w-4" />
                              Télécharger
                            </Button>
                          </>
                        )}
                        
                        {offer.status === 'in_progress' && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                              onClick={() => handleUpdateStatus(offer.id, 'rejected')}
                            >
                              <XCircle className="mr-1 h-4 w-4" />
                              Refusée
                            </Button>
                            <Button 
                              size="sm"
                              className="flex-1 bg-green-600"
                              onClick={() => handleUpdateStatus(offer.id, 'accepted')}
                            >
                              <CheckCircle className="mr-1 h-4 w-4" />
                              Acceptée
                            </Button>
                          </>
                        )}
                        
                        {(offer.status === 'accepted' || offer.status === 'rejected' || offer.status === 'expired') && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="w-full"
                            onClick={() => handleViewOffer(offer.id)}
                          >
                            <Eye className="mr-1 h-4 w-4" />
                            Voir le détail
                          </Button>
                        )}
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="active">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {isLoading ? (
                <div className="col-span-full flex justify-center p-8">
                  <div className="animate-spin h-8 w-8 border-2 border-paritel-primary border-t-transparent rounded-full"></div>
                </div>
              ) : filteredOffers.filter(o => o.status === 'in_progress' || o.status === 'sent').length === 0 ? (
                <div className="col-span-full">
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                      <div className="rounded-full bg-gray-100 p-3 mb-3">
                        <Clock className="h-6 w-6 text-gray-500" />
                      </div>
                      <h3 className="font-medium mb-1">Aucune offre en cours</h3>
                      <p className="text-sm text-gray-500 mb-4">
                        Vous n'avez pas d'offres en cours de traitement
                      </p>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                filteredOffers
                  .filter(o => o.status === 'in_progress' || o.status === 'sent')
                  .map((offer) => (
                    <Card key={offer.id} className="overflow-hidden">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <Badge className={statusColors[offer.status]}>
                            {statusLabels[offer.status]}
                          </Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Options</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleViewOffer(offer.id)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Voir
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditOffer(offer.id)}>
                                <PencilLine className="mr-2 h-4 w-4" />
                                Modifier
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDownloadOffer(offer.id)}>
                                <Download className="mr-2 h-4 w-4" />
                                Télécharger
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => confirmDeleteOffer(offer)}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <CardTitle className="text-lg">{offer.customer_name || "Client non spécifié"}</CardTitle>
                        <CardDescription>
                          {offer.customer_industry ? (
                            <span className="flex items-center">
                              <Building className="mr-1 h-3 w-3" /> 
                              {offer.customer_industry}
                            </span>
                          ) : null}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-3">
                        {offer.contact_name && (
                          <div className="flex items-center text-sm text-gray-500 mb-2">
                            <User className="mr-1 h-3 w-3" />
                            Contact: {offer.contact_name}
                          </div>
                        )}
                        
                        {offer.created_at && (
                          <div className="flex items-center text-sm text-gray-500 mb-2">
                            <Calendar className="mr-1 h-3 w-3" />
                            Créée le: {formatDate(offer.created_at)}
                          </div>
                        )}
                        
                        {offer.valid_until && (
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="mr-1 h-3 w-3" />
                            Valide jusqu'au: {formatDate(offer.valid_until)}
                          </div>
                        )}
                        
                        {offer.total_amount !== undefined && (
                          <div className="mt-3 font-semibold">
                            Montant: {offer.total_amount.toLocaleString('fr-FR')} €
                          </div>
                        )}
                      </CardContent>
                      <Separator />
                      <CardFooter className="pt-3">
                        <div className="flex gap-2 w-full">
                          {offer.status === 'draft' && (
                            <>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="flex-1"
                                onClick={() => handleEditOffer(offer.id)}
                              >
                                <PencilLine className="mr-1 h-4 w-4" />
                                Éditer
                              </Button>
                              <Button 
                                size="sm"
                                className="flex-1 bg-paritel-primary"
                                onClick={() => handleUpdateStatus(offer.id, 'sent')}
                              >
                                <Send className="mr-1 h-4 w-4" />
                                Envoyer
                              </Button>
                            </>
                          )}
                          
                          {offer.status === 'sent' && (
                            <>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="flex-1"
                                onClick={() => handleUpdateStatus(offer.id, 'in_progress')}
                              >
                                <Clock className="mr-1 h-4 w-4" />
                                En cours
                              </Button>
                              <Button 
                                size="sm"
                                className="flex-1 bg-paritel-primary"
                                onClick={() => handleDownloadOffer(offer.id)}
                              >
                                <Download className="mr-1 h-4 w-4" />
                                Télécharger
                              </Button>
                            </>
                          )}
                          
                          {offer.status === 'in_progress' && (
                            <>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                                onClick={() => handleUpdateStatus(offer.id, 'rejected')}
                              >
                                <XCircle className="mr-1 h-4 w-4" />
                                Refusée
                              </Button>
                              <Button 
                                size="sm"
                                className="flex-1 bg-green-600"
                                onClick={() => handleUpdateStatus(offer.id, 'accepted')}
                              >
                                <CheckCircle className="mr-1 h-4 w-4" />
                                Acceptée
                              </Button>
                            </>
                          )}
                          
                          {(offer.status === 'accepted' || offer.status === 'rejected' || offer.status === 'expired') && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="w-full"
                              onClick={() => handleViewOffer(offer.id)}
                            >
                              <Eye className="mr-1 h-4 w-4" />
                              Voir le détail
                            </Button>
                          )}
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="accepted">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {isLoading ? (
                <div className="col-span-full flex justify-center p-8">
                  <div className="animate-spin h-8 w-8 border-2 border-paritel-primary border-t-transparent rounded-full"></div>
                </div>
              ) : filteredOffers.filter(o => o.status === 'accepted').length === 0 ? (
                <div className="col-span-full">
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                      <div className="rounded-full bg-gray-100 p-3 mb-3">
                        <CheckCircle className="h-6 w-6 text-gray-500" />
                      </div>
                      <h3 className="font-medium mb-1">Aucune offre acceptée</h3>
                      <p className="text-sm text-gray-500 mb-4">
                        Vous n'avez pas encore d'offres acceptées
                      </p>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                filteredOffers
                  .filter(o => o.status === 'accepted')
                  .map((offer) => (
                    <Card key={offer.id} className="overflow-hidden">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <Badge className={statusColors[offer.status]}>
                            {statusLabels[offer.status]}
                          </Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Options</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleViewOffer(offer.id)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Voir
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditOffer(offer.id)}>
                                <PencilLine className="mr-2 h-4 w-4" />
                                Modifier
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDownloadOffer(offer.id)}>
                                <Download className="mr-2 h-4 w-4" />
                                Télécharger
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => confirmDeleteOffer(offer)}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <CardTitle className="text-lg">{offer.customer_name || "Client non spécifié"}</CardTitle>
                        <CardDescription>
                          {offer.customer_industry ? (
                            <span className="flex items-center">
                              <Building className="mr-1 h-3 w-3" /> 
                              {offer.customer_industry}
                            </span>
                          ) : null}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-3">
                        {offer.contact_name && (
                          <div className="flex items-center text-sm text-gray-500 mb-2">
                            <User className="mr-1 h-3 w-3" />
                            Contact: {offer.contact_name}
                          </div>
                        )}
                        
                        {offer.created_at && (
                          <div className="flex items-center text-sm text-gray-500 mb-2">
                            <Calendar className="mr-1 h-3 w-3" />
                            Créée le: {formatDate(offer.created_at)}
                          </div>
                        )}
                        
                        {offer.valid_until && (
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="mr-1 h-3 w-3" />
                            Valide jusqu'au: {formatDate(offer.valid_until)}
                          </div>
                        )}
                        
                        {offer.total_amount !== undefined && (
                          <div className="mt-3 font-semibold">
                            Montant: {offer.total_amount.toLocaleString('fr-FR')} €
                          </div>
                        )}
                      </CardContent>
                      <Separator />
                      <CardFooter className="pt-3">
                        <div className="flex gap-2 w-full">
                          {offer.status === 'draft' && (
                            <>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="flex-1"
                                onClick={() => handleEditOffer(offer.id)}
                              >
                                <PencilLine className="mr-1 h-4 w-4" />
                                Éditer
                              </Button>
                              <Button 
                                size="sm"
                                className="flex-1 bg-paritel-primary"
                                onClick={() => handleUpdateStatus(offer.id, 'sent')}
                              >
                                <Send className="mr-1 h-4 w-4" />
                                Envoyer
                              </Button>
                            </>
                          )}
                          
                          {offer.status === 'sent' && (
                            <>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="flex-1"
                                onClick={() => handleUpdateStatus(offer.id, 'in_progress')}
                              >
                                <Clock className="mr-1 h-4 w-4" />
                                En cours
                              </Button>
                              <Button 
                                size="sm"
                                className="flex-1 bg-paritel-primary"
                                onClick={() => handleDownloadOffer(offer.id)}
                              >
                                <Download className="mr-1 h-4 w-4" />
                                Télécharger
                              </Button>
                            </>
                          )}
                          
                          {offer.status === 'in_progress' && (
                            <>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                                onClick={() => handleUpdateStatus(offer.id, 'rejected')}
                              >
                                <XCircle className="mr-1 h-4 w-4" />
                                Refusée
                              </Button>
                              <Button 
                                size="sm"
                                className="flex-1 bg-green-600"
                                onClick={() => handleUpdateStatus(offer.id, 'accepted')}
                              >
                                <CheckCircle className="mr-1 h-4 w-4" />
                                Acceptée
                              </Button>
                            </>
                          )}
                          
                          {(offer.status === 'accepted' || offer.status === 'rejected' || offer.status === 'expired') && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="w-full"
                              onClick={() => handleViewOffer(offer.id)}
                            >
                              <Eye className="mr-1 h-4 w-4" />
                              Voir le détail
                            </Button>
                          )}
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        {selectedOffer && (
          <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirmer la suppression</DialogTitle>
                <DialogDescription>
                  Êtes-vous sûr de vouloir supprimer cette offre ?
                  Cette action est irréversible.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-2 sm:gap-0">
                <Button 
                  variant="outline" 
                  onClick={() => setShowDeleteDialog(false)}
                >
                  Annuler
                </Button>
                <Button 
                  variant="destructive"
                  onClick={handleDeleteOffer}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </MainLayout>
  );
};

export default MyOffers;
