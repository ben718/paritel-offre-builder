import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getLibraryDocuments, LibraryDocument, getLibraryCategories, LibraryCategory } from '@/services/LibraryService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Eye, Edit, Trash2, Search, Loader2, BookOpen, ListFilter, UploadCloud, Download, Paperclip } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from '@/integrations/supabase/client'; // For public URL
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const ITEMS_PER_PAGE = 10;

const BibliothequePage: React.FC = () => {
  const { checkRouteAccess } = useAuth();
  const { toast } = useToast();
  const [documents, setDocuments] = useState<LibraryDocument[]>([]);
  const [categories, setCategories] = useState<LibraryCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(undefined);

  const fetchDocumentsAndCategories = useCallback(async (page: number, term: string, categoryId?: string, status?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      if (categories.length === 0) {
        const fetchedCategories = await getLibraryCategories();
        setCategories(fetchedCategories);
      }

      const filters: any = {};
      if (term) filters.searchTerm = term;
      if (categoryId) filters.category_id = categoryId;
      if (status) filters.status = status;
      
      const { documents: fetchedDocs, count } = await getLibraryDocuments(filters, page, ITEMS_PER_PAGE);
      setDocuments(fetchedDocs);
      if (count) {
        setTotalPages(Math.ceil(count / ITEMS_PER_PAGE));
      }
    } catch (err: any) {
      console.error("Erreur lors de la récupération des documents de la bibliothèque:", err);
      setError(err.message || "Une erreur est survenue lors du chargement des documents.");
    } finally {
      setIsLoading(false);
    }
  }, [categories.length]);

  useEffect(() => {
    // Accès pour tous les utilisateurs connectés pour la consultation de base
    // Des droits plus fins seront appliqués pour l'édition/suppression
    fetchDocumentsAndCategories(currentPage, searchTerm, selectedCategory, selectedStatus);
  }, [fetchDocumentsAndCategories, currentPage, searchTerm, selectedCategory, selectedStatus]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId === "all" ? undefined : categoryId);
    setCurrentPage(1);
  };
  
  const handleStatusChange = (statusValue: string) => {
    setSelectedStatus(statusValue === "all" ? undefined : statusValue);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getStatusBadgeVariant = (status?: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status?.toLowerCase()) {
      case 'approuvé': return 'default'; // Vert
      case 'en revue': return 'secondary'; // Jaune/Orange
      case 'brouillon': return 'outline'; // Gris
      case 'archivé': return 'destructive';
      default: return 'outline';
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[calc(100vh-100px)]">
        <Loader2 className="h-12 w-12 text-paritel-primary animate-spin mb-4" />
        <p className="text-lg font-medium text-gray-700">Chargement de la bibliothèque...</p>
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
            <BookOpen className="mr-3 h-8 w-8" /> Bibliothèque Documentaire
          </h1>
          <p className="text-lg text-gray-600">Accédez à tous les documents importants de Paritel.</p>
        </div>
        {checkRouteAccess(['Chef de produit', 'Admin', 'Commercial AO', 'Avant-vente']) && (
          <Link to="/bibliotheque/nouveau">
            <Button className="bg-paritel-primary hover:bg-paritel-primary/90">
              <UploadCloud className="mr-2 h-5 w-5" />
              Téléverser un Document
            </Button>
          </Link>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Documents de la Bibliothèque</CardTitle>
          <CardDescription>Consultez, recherchez et gérez les documents centralisés.</CardDescription>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div className="relative md:col-span-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input 
                placeholder="Rechercher par titre, nom de fichier, tags..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-9"
              />
            </div>
            <div className="w-full md:col-span-1">
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
            </div>
            <div className="w-full md:col-span-1">
              <Select onValueChange={handleStatusChange} value={selectedStatus || "all"}>
                <SelectTrigger className="w-full">
                  <ListFilter className="mr-2 h-4 w-4 text-gray-500" />
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="brouillon">Brouillon</SelectItem>
                  <SelectItem value="en revue">En Revue</SelectItem>
                  <SelectItem value="approuvé">Approuvé</SelectItem>
                  <SelectItem value="archivé">Archivé</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {documents.length === 0 && !isLoading ? (
            <p className="text-center text-gray-500 py-8">Aucun document trouvé dans la bibliothèque.</p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Titre / Nom du Fichier</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead>Téléversé par</TableHead>
                    <TableHead>Date MàJ</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">
                        <Link to={`/bibliotheque/document/${doc.id}`} className="hover:underline text-paritel-primary flex items-center">
                          <Paperclip className="h-4 w-4 mr-2 text-gray-500 flex-shrink-0" />
                          {doc.title || doc.file_name}
                        </Link>
                        {doc.title && <span className="text-xs text-gray-500 block">{doc.file_name}</span>}
                      </TableCell>
                      <TableCell>{(doc as any).category?.name || 'N/C'}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(doc.status)}>{doc.status || 'N/D'}</Badge>
                      </TableCell>
                      <TableCell>{doc.version || '-'}</TableCell>
                      <TableCell>{(doc as any).uploaded_by?.full_name || 'N/A'}</TableCell>
                      <TableCell>{doc.updated_at ? new Date(doc.updated_at).toLocaleDateString() : '-'}</TableCell>
                      <TableCell className="text-right space-x-1">
                        <a href={supabase.storage.from('library-attachments').getPublicUrl(doc.file_path).data.publicUrl} download={doc.file_name} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="icon" title="Télécharger">
                            <Download className="h-4 w-4" />
                          </Button>
                        </a>
                        <Link to={`/bibliotheque/document/${doc.id}`}>
                          <Button variant="outline" size="icon" title="Voir Détails">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        {/* TODO: Ajouter bouton Modifier et Supprimer avec gestion des droits */}
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

export default BibliothequePage;

