import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getOffers, Offer } from '@/services/OfferService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Eye, Edit, Trash2, Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 10;

const AppelsOffresPage: React.FC = () => {
  const { checkRouteAccess } = useAuth();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const fetchOffers = useCallback(async (page: number, term: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const filters = term ? { searchTerm: term } : {};
      const { offers: fetchedOffers, count } = await getOffers(filters, page, ITEMS_PER_PAGE);
      setOffers(fetchedOffers);
      if (count) {
        setTotalPages(Math.ceil(count / ITEMS_PER_PAGE));
      }
    } catch (err: any) {
      console.error("Erreur lors de la récupération des appels d'offres:", err);
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Vérifier l'accès avant de charger les données
    if (!checkRouteAccess(['Commercial AO', 'Avant-vente', 'Admin', 'Direction'])) {
      // Gérer le cas où l'utilisateur n'a pas accès (normalement géré par ProtectedRoute, mais double sécurité)
      setIsLoading(false);
      setError("Accès non autorisé à cette section.");
      return;
    }
    fetchOffers(currentPage, searchTerm);
  }, [fetchOffers, currentPage, searchTerm, checkRouteAccess]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
  // Fonction pour déterminer la couleur du badge en fonction du statut
  const getStatusBadgeVariant = (status?: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status?.toLowerCase()) {
      case 'gagné':
        return 'default'; // Vert (par défaut pour shadcn, à styler si besoin)
      case 'perdu':
        return 'destructive';
      case 'en cours de réponse':
        return 'secondary'; // Jaune/Orange (à styler si besoin)
      case 'déposé':
        return 'outline'; // Bleu (à styler si besoin)
      case 'à étudier':
        return 'secondary'; // Gris
      default:
        return 'outline';
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[calc(100vh-100px)]">
        <Loader2 className="h-12 w-12 text-paritel-primary animate-spin mb-4" />
        <p className="text-lg font-medium text-gray-700">Chargement des appels d'offres...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-paritel-primary">Dossiers Appels d’Offres</h1>
          <p className="text-lg text-gray-600">Suivez et gérez toutes vos opportunités commerciales.</p>
        </div>
        {checkRouteAccess(['Commercial AO', 'Admin']) && (
          <Link to="/appels-offres/nouveau">
            <Button className="bg-paritel-primary hover:bg-paritel-primary/90">
              <PlusCircle className="mr-2 h-5 w-5" />
              Nouveau Dossier AO
            </Button>
          </Link>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Appels d'Offres</CardTitle>
          <CardDescription>Consultez et gérez les appels d'offres en cours et archivés.</CardDescription>
          <div className="mt-4 flex items-center">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input 
                placeholder="Rechercher par nom de marché..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {offers.length === 0 && !isLoading ? (
            <p className="text-center text-gray-500 py-8">Aucun appel d’offre trouvé.</p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom du Marché</TableHead>
                    <TableHead>Organisme</TableHead>
                    <TableHead>Deadline</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Responsable Commercial</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {offers.map((offer) => (
                    <TableRow key={offer.id}>
                      <TableCell className="font-medium">{offer.market_name}</TableCell>
                      <TableCell>{offer.organization || '-'}</TableCell>
                      <TableCell>{offer.deadline ? new Date(offer.deadline).toLocaleDateString() : '-'}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(offer.status)}>{offer.status || 'N/D'}</Badge>
                      </TableCell>
                      <TableCell>{(offer as any).commercial_manager?.full_name || '-'}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Link to={`/appels-offres/${offer.id}"}>
                          <Button variant="outline" size="icon" title="Voir">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        {checkRouteAccess(['Commercial AO', 'Admin']) && (
                          <>
                            <Link to={`/appels-offres/modifier/${offer.id}"}>
                              <Button variant="outline" size="icon" title="Modifier">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            {/* La suppression sera une action plus sensible, à confirmer */}
                            {/* <Button variant="destructive" size="icon" title="Supprimer" onClick={() => handleDeleteOffer(offer.id!)}>
                              <Trash2 className="h-4 w-4" />
                            </Button> */}
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {totalPages > 1 && (
                <Pagination className="mt-6">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); handlePageChange(currentPage - 1); }} aria-disabled={currentPage === 1} />
                    </PaginationItem>
                    {[...Array(totalPages)].map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink href="#" onClick={(e) => { e.preventDefault(); handlePageChange(i + 1); }} isActive={currentPage === i + 1}>
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    {/* Ajouter Ellipsis si beaucoup de pages */} 
                    <PaginationItem>
                      <PaginationNext href="#" onClick={(e) => { e.preventDefault(); handlePageChange(currentPage + 1); }} aria-disabled={currentPage === totalPages} />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AppelsOffresPage;

