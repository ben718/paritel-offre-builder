
import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  FileText, Download, Eye, Trash2, Search, MoreHorizontal, Plus, Calendar, Check
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

type Offer = {
  id: number;
  customer: {
    companyName: string;
    industry: string;
    contactName: string;
  };
  date: string;
  status: "draft" | "final";
  products: Array<{
    id: number;
    name: string;
    category: string;
    quantity: number;
    price: string;
  }>;
};

const MyOffers = () => {
  const { toast } = useToast();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [drafts, setDrafts] = useState<Offer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    // Load offers from localStorage
    const savedOffers = localStorage.getItem('offers');
    const savedDrafts = localStorage.getItem('offerDrafts');
    
    if (savedOffers) {
      setOffers(JSON.parse(savedOffers));
    }
    
    if (savedDrafts) {
      setDrafts(JSON.parse(savedDrafts));
    }
  }, []);

  const downloadOffer = (offer: Offer) => {
    // In a real application, this would generate a PDF
    const element = document.createElement("a");
    const file = new Blob(
      [JSON.stringify(offer, null, 2)], 
      {type: 'application/pdf'}
    );
    element.href = URL.createObjectURL(file);
    element.download = `Offre_${offer.customer.companyName || 'Client'}_${new Date().toLocaleDateString()}.pdf`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Offre téléchargée",
      description: "Votre offre a été téléchargée avec succès",
    });
  };

  const deleteOffer = (offerId: number, type: 'offer' | 'draft') => {
    if (type === 'offer') {
      const updatedOffers = offers.filter(offer => offer.id !== offerId);
      setOffers(updatedOffers);
      localStorage.setItem('offers', JSON.stringify(updatedOffers));
    } else {
      const updatedDrafts = drafts.filter(draft => draft.id !== offerId);
      setDrafts(updatedDrafts);
      localStorage.setItem('offerDrafts', JSON.stringify(updatedDrafts));
    }
    
    setShowDeleteDialog(false);
    
    toast({
      title: type === 'offer' ? "Offre supprimée" : "Brouillon supprimé",
      description: type === 'offer' 
        ? "L'offre a été supprimée avec succès" 
        : "Le brouillon a été supprimé avec succès",
    });
  };

  const finalizeDraft = (draft: Offer) => {
    // Convert draft to finalized offer
    const finalOffer = {
      ...draft,
      id: Date.now(),
      status: "final" as const,
      date: new Date().toISOString()
    };
    
    // Add to offers
    const updatedOffers = [...offers, finalOffer];
    setOffers(updatedOffers);
    localStorage.setItem('offers', JSON.stringify(updatedOffers));
    
    // Remove from drafts
    const updatedDrafts = drafts.filter(d => d.id !== draft.id);
    setDrafts(updatedDrafts);
    localStorage.setItem('offerDrafts', JSON.stringify(updatedDrafts));
    
    toast({
      title: "Brouillon finalisé",
      description: "Le brouillon a été converti en offre finalisée",
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const filterOffers = (items: Offer[]) => {
    if (!searchTerm) return items;
    
    return items.filter(offer => 
      offer.customer.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.customer.contactName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.products.some(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  const filteredOffers = filterOffers(offers);
  const filteredDrafts = filterOffers(drafts);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Mes Offres</h1>
            <p className="text-muted-foreground">Consultez et gérez vos offres personnalisées</p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:flex-initial">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Rechercher..."
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Link to="/create-offer">
              <Button className="bg-paritel-primary whitespace-nowrap">
                <Plus className="mr-2 h-4 w-4" />
                Nouvelle offre
              </Button>
            </Link>
          </div>
        </div>

        <Tabs defaultValue="offers" className="space-y-4">
          <TabsList>
            <TabsTrigger value="offers" className="relative">
              Offres finalisées
              {offers.length > 0 && (
                <Badge className="ml-2 bg-paritel-primary text-white">{offers.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="drafts">
              Brouillons
              {drafts.length > 0 && (
                <Badge className="ml-2">{drafts.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="offers" className="space-y-4">
            {filteredOffers.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                  <FileText className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Aucune offre finalisée</h3>
                  <p className="text-muted-foreground mb-4 max-w-md">
                    Vous n'avez pas encore d'offres finalisées.
                    {searchTerm ? " Essayez avec d'autres termes de recherche." : ""}
                  </p>
                  {!searchTerm && (
                    <Link to="/create-offer">
                      <Button className="bg-paritel-primary">
                        <Plus className="mr-2 h-4 w-4" />
                        Créer ma première offre
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredOffers.map((offer) => (
                  <Card key={offer.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg truncate" title={offer.customer.companyName || "Sans titre"}>
                            {offer.customer.companyName || "Sans titre"}
                          </CardTitle>
                          <CardDescription className="flex items-center mt-1">
                            <Calendar className="mr-1 h-3 w-3" />
                            {formatDate(offer.date)}
                          </CardDescription>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Options</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => {
                              setSelectedOffer(offer);
                            }}>
                              <Eye className="mr-2 h-4 w-4" />
                              Voir les détails
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => downloadOffer(offer)}>
                              <Download className="mr-2 h-4 w-4" />
                              Télécharger
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => {
                                setSelectedOffer(offer);
                                setShowDeleteDialog(true);
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="text-sm">
                          <span className="font-medium">Contact: </span>
                          {offer.customer.contactName || "Non spécifié"}
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Produits: </span>
                          {offer.products.length} produit(s)
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => setSelectedOffer(offer)}
                          >
                            <Eye className="mr-1 h-4 w-4" />
                            Détails
                          </Button>
                          <Button 
                            size="sm"
                            className="flex-1 bg-paritel-primary"
                            onClick={() => downloadOffer(offer)}
                          >
                            <Download className="mr-1 h-4 w-4" />
                            Télécharger
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="drafts" className="space-y-4">
            {filteredDrafts.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                  <FileText className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Aucun brouillon</h3>
                  <p className="text-muted-foreground mb-4 max-w-md">
                    Vous n'avez pas encore de brouillons enregistrés.
                    {searchTerm ? " Essayez avec d'autres termes de recherche." : ""}
                  </p>
                  {!searchTerm && (
                    <Link to="/create-offer">
                      <Button className="bg-paritel-primary">
                        <Plus className="mr-2 h-4 w-4" />
                        Créer une offre
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDrafts.map((draft) => (
                  <Card key={draft.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg truncate" title={draft.customer.companyName || "Brouillon sans titre"}>
                            {draft.customer.companyName || "Brouillon sans titre"}
                          </CardTitle>
                          <CardDescription className="flex items-center mt-1">
                            <Calendar className="mr-1 h-3 w-3" />
                            {formatDate(draft.date)}
                          </CardDescription>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Options</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => {
                              setSelectedOffer(draft);
                            }}>
                              <Eye className="mr-2 h-4 w-4" />
                              Voir les détails
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => finalizeDraft(draft)}>
                              <Check className="mr-2 h-4 w-4" />
                              Finaliser
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => {
                                setSelectedOffer(draft);
                                setShowDeleteDialog(true);
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="text-sm">
                          <span className="font-medium">Contact: </span>
                          {draft.customer.contactName || "Non spécifié"}
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Produits: </span>
                          {draft.products.length} produit(s)
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => setSelectedOffer(draft)}
                          >
                            <Eye className="mr-1 h-4 w-4" />
                            Détails
                          </Button>
                          <Button 
                            size="sm"
                            className="flex-1 bg-paritel-primary"
                            onClick={() => finalizeDraft(draft)}
                          >
                            <Check className="mr-1 h-4 w-4" />
                            Finaliser
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Offer Details Dialog */}
      {selectedOffer && (
        <Dialog open={selectedOffer !== null && !showDeleteDialog} onOpenChange={(open) => {
          if (!open) setSelectedOffer(null);
        }}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Détails de l'offre</DialogTitle>
              <DialogDescription>
                Offre pour {selectedOffer.customer.companyName || "Client"}
                <span className="ml-2 text-gray-500 text-xs">
                  {formatDate(selectedOffer.date)}
                </span>
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 mt-2">
              <div className="rounded-lg border p-4">
                <h3 className="font-semibold mb-2">Détails du client</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><span className="font-medium">Société:</span> {selectedOffer.customer.companyName || "Non spécifié"}</p>
                    <p><span className="font-medium">Secteur:</span> {selectedOffer.customer.industry || "Non spécifié"}</p>
                  </div>
                  <div>
                    <p><span className="font-medium">Contact:</span> {selectedOffer.customer.contactName || "Non spécifié"}</p>
                  </div>
                </div>
              </div>
              
              <div className="rounded-lg border p-4">
                <h3 className="font-semibold mb-2">Produits et services</h3>
                {selectedOffer.products.length === 0 ? (
                  <p className="text-gray-500 italic">Aucun produit dans cette offre</p>
                ) : (
                  <div className="space-y-3">
                    {selectedOffer.products.map(product => (
                      <div key={product.id} className="flex items-start justify-between border-b pb-2">
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-xs text-gray-500">{product.category}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">Qté: {product.quantity}</p>
                          <p className="text-sm">{product.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <DialogFooter className="gap-2 sm:gap-0">
              {selectedOffer.status === "draft" ? (
                <Button 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    finalizeDraft(selectedOffer);
                    setSelectedOffer(null);
                  }}
                >
                  <Check className="mr-2 h-4 w-4" />
                  Finaliser cette offre
                </Button>
              ) : (
                <Button
                  className="bg-paritel-primary"
                  onClick={() => {
                    downloadOffer(selectedOffer);
                  }}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Télécharger
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && selectedOffer && (
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmer la suppression</DialogTitle>
              <DialogDescription>
                Êtes-vous sûr de vouloir supprimer {selectedOffer.status === "draft" ? "ce brouillon" : "cette offre"} ?
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
                onClick={() => deleteOffer(selectedOffer.id, selectedOffer.status === "draft" ? "draft" : "offer")}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </MainLayout>
  );
};

export default MyOffers;
