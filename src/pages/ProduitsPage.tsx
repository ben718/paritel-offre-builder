import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getProducts, Product } from '@/services/ProductService'; // Assurez-vous que Product est bien exporté
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Eye, Edit, Trash2, Search, Loader2, Package, ListFilter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
// Importer Select pour le filtre par catégorie si nécessaire
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { getProductCategories, ProductCategory } from '@/services/ProductService';

const ITEMS_PER_PAGE = 10;

const ProduitsPage: React.FC = () => {
  const { checkRouteAccess } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  // const [categories, setCategories] = useState<ProductCategory[]>([]);
  // const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);

  const fetchProductsAndCategories = useCallback(async (page: number, term: string, categoryId?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // if (categories.length === 0) {
      //   const fetchedCategories = await getProductCategories();
      //   setCategories(fetchedCategories);
      // }

      const filters: any = {};
      if (term) filters.searchTerm = term;
      if (categoryId) filters.category_id = categoryId;
      
      const { products: fetchedProducts, count } = await getProducts(filters, page, ITEMS_PER_PAGE);
      setProducts(fetchedProducts);
      if (count) {
        setTotalPages(Math.ceil(count / ITEMS_PER_PAGE));
      }
    } catch (err: any) {
      console.error("Erreur lors de la récupération des produits:", err);
      setError(err.message || "Une erreur est survenue lors du chargement des produits.");
    } finally {
      setIsLoading(false);
    }
  }, []); // Ajoutez categories dans les dépendances si vous chargez les catégories ici

  useEffect(() => {
    // Accès pour Chef de produit, Avant-vente, Commercial AO, Admin, Direction
    if (!checkRouteAccess(['Chef de produit', 'Avant-vente', 'Commercial AO', 'Admin', 'Direction'])) {
      setIsLoading(false);
      setError("Accès non autorisé à cette section.");
      return;
    }
    fetchProductsAndCategories(currentPage, searchTerm /*, selectedCategory */);
  }, [fetchProductsAndCategories, currentPage, searchTerm /*, selectedCategory */, checkRouteAccess]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  // const handleCategoryChange = (categoryId: string) => {
  //   setSelectedCategory(categoryId === "all" ? undefined : categoryId);
  //   setCurrentPage(1);
  // };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getStatusBadgeVariant = (status?: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status?.toLowerCase()) {
      case 'actif':
        return 'default'; // Vert
      case 'obsolète':
        return 'destructive';
      case 'en développement':
        return 'secondary'; // Jaune/Orange
      default:
        return 'outline';
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[calc(100vh-100px)]">
        <Loader2 className="h-12 w-12 text-paritel-primary animate-spin mb-4" />
        <p className="text-lg font-medium text-gray-700">Chargement du catalogue produits...</p>
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
          <h1 className="text-3xl font-bold text-paritel-primary flex items-center">
            <Package className="mr-3 h-8 w-8" /> Catalogue Produits & Services
          </h1>
          <p className="text-lg text-gray-600">Gérez l'ensemble des produits et services Paritel.</p>
        </div>
        {checkRouteAccess(['Chef de produit', 'Admin']) && (
          <Link to="/catalogue/produits/nouveau">
            <Button className="bg-paritel-primary hover:bg-paritel-primary/90">
              <PlusCircle className="mr-2 h-5 w-5" />
              Nouveau Produit/Service
            </Button>
          </Link>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Produits et Services</CardTitle>
          <CardDescription>Consultez, recherchez et gérez les fiches produits/services.</CardDescription>
          <div className="mt-4 flex flex-col md:flex-row gap-4 items-center">
            <div className="relative w-full md:flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input 
                placeholder="Rechercher par nom, référence..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-9"
              />
            </div>
            {/* Filtre par catégorie (à activer si besoin) */}
            {/* <div className="w-full md:w-auto md:min-w-[200px]">
              <Select onValueChange={handleCategoryChange} value={selectedCategory || "all"}>
                <SelectTrigger className="w-full">
                  <ListFilter className="mr-2 h-4 w-4 text-gray-500" />
                  <SelectValue placeholder="Filtrer par catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id!}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div> */}
          </div>
        </CardHeader>
        <CardContent>
          {products.length === 0 && !isLoading ? (
            <p className="text-center text-gray-500 py-8">Aucun produit ou service trouvé.</p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom du Produit/Service</TableHead>
                    <TableHead>Référence</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.reference || '-'}</TableCell>
                      <TableCell>{(product as any).category?.name || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(product.status)}>{product.status || 'N/D'}</Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Link to={`/catalogue/produits/${product.id}`}>
                          <Button variant="outline" size="icon" title="Voir">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        {checkRouteAccess(['Chef de produit', 'Admin']) && (
                          <>
                            <Link to={`/catalogue/produits/modifier/${product.id}`}>
                              <Button variant="outline" size="icon" title="Modifier">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            {/* La suppression sera une action plus sensible, à confirmer */}
                            {/* <Button variant="destructive" size="icon" title="Supprimer">
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

export default ProduitsPage;

