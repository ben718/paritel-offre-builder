import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { performGlobalSearch, SearchResult, SearchFilters } from '@/services/SearchService';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Loader2, Search, FileText, Package, Briefcase, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ITEMS_PER_PAGE = 10;

const GlobalSearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1', 10));
  const [totalPages, setTotalPages] = useState(0);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(searchParams.getAll('type') || []);

  const fetchResults = useCallback(async (page: number, term: string, types: string[]) => {
    if (!term.trim()) {
      setResults([]);
      setTotalPages(0);
      setError(null);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const filters: SearchFilters = {
        searchTerm: term,
        types: types.length > 0 ? types as Array<'appel_offre' | 'produit_service' | 'document'> : undefined,
      };
      const { results: fetchedResults, count } = await performGlobalSearch(filters, page, ITEMS_PER_PAGE);
      setResults(fetchedResults);
      if (count) {
        setTotalPages(Math.ceil(count / ITEMS_PER_PAGE));
      }
    } catch (err: any) {
      console.error("Erreur lors de la recherche globale:", err);
      setError(err.message || "Une erreur est survenue lors de la recherche.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const term = searchParams.get('q') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const types = searchParams.getAll('type');
    setSearchTerm(term);
    setCurrentPage(page);
    setSelectedTypes(types);
    fetchResults(page, term, types);
  }, [searchParams, fetchResults]);

  const handleSearchSubmit = (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    setCurrentPage(1);
    const params = new URLSearchParams();
    if (searchTerm.trim()) {
      params.set('q', searchTerm.trim());
    }
    selectedTypes.forEach(type => params.append('type', type));
    params.set('page', '1');
    setSearchParams(params);
  };
  
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      const params = new URLSearchParams(searchParams);
      params.set('page', String(page));
      setSearchParams(params);
    }
  };

  const handleTypeChange = (types: string[]) => {
    setSelectedTypes(types);
    setCurrentPage(1);
    const params = new URLSearchParams();
    if (searchTerm.trim()) {
      params.set('q', searchTerm.trim());
    }
    types.forEach(type => params.append('type', type));
    params.set('page', '1');
    setSearchParams(params);
  };

  const getResultIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'appel_offre': return <Briefcase className="h-5 w-5 mr-2 text-paritel-primary" />;
      case 'produit_service': return <Package className="h-5 w-5 mr-2 text-paritel-primary" />;
      case 'document_offre':
      case 'document_produit':
      case 'document_bibliotheque': 
        return <FileText className="h-5 w-5 mr-2 text-paritel-primary" />;
      default: return <Search className="h-5 w-5 mr-2 text-gray-500" />;
    }
  };
  
  const getResultTypeLabel = (type: SearchResult['type']): string => {
    switch (type) {
      case 'appel_offre': return "Appel d'Offres";
      case 'produit_service': return "Produit/Service";
      case 'document_offre': return "Document d'AO";
      case 'document_produit': return "Document Produit";
      case 'document_bibliotheque': return "Document (Bibliothèque)";
      default: return "Résultat";
    }
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-paritel-primary flex items-center">
            <Search className="mr-3 h-8 w-8" /> Recherche Globale
          </h1>
          <p className="text-lg text-gray-600">Recherchez dans l'ensemble des données de l'application.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <form onSubmit={handleSearchSubmit} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-3">
              <Input 
                type="search"
                placeholder="Entrez vos mots-clés..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-grow"
              />
              <Button type="submit" className="bg-paritel-primary hover:bg-paritel-primary/90 w-full md:w-auto">
                <Search className="mr-2 h-4 w-4" /> Rechercher
              </Button>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 items-center">
                <span className="text-sm font-medium text-gray-700"><Filter className="inline h-4 w-4 mr-1"/>Filtrer par type:</span>
                <div className="flex flex-wrap gap-2">
                    {/* Utilisation de boutons pour simuler des checkboxes pour une meilleure UI */} 
                    {[ 
                        { label: "Appels d'Offres", value: "appel_offre" },
                        { label: "Produits/Services", value: "produit_service" },
                        { label: "Documents", value: "document" }, // Type générique pour tous les documents
                    ].map(typeOption => (
                        <Button 
                            key={typeOption.value}
                            variant={selectedTypes.includes(typeOption.value) ? "default" : "outline"}
                            size="sm"
                            onClick={() => {
                                const newTypes = selectedTypes.includes(typeOption.value)
                                    ? selectedTypes.filter(t => t !== typeOption.value)
                                    : [...selectedTypes, typeOption.value];
                                handleTypeChange(newTypes);
                            }}
                            className={selectedTypes.includes(typeOption.value) ? "bg-paritel-primary text-white" : ""}
                        >
                            {typeOption.label}
                        </Button>
                    ))}
                </div>
            </div>
          </form>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-12 w-12 text-paritel-primary animate-spin" />
            </div>
          ) : error ? (
            <p className="text-center text-red-600 py-8">{error}</p>
          ) : !searchTerm.trim() && results.length === 0 ? (
             <p className="text-center text-gray-500 py-8">Veuillez entrer des termes de recherche pour commencer.</p>
          ) : results.length === 0 && searchTerm.trim() ? (
            <p className="text-center text-gray-500 py-8">Aucun résultat trouvé pour "{searchTerm}"{selectedTypes.length > 0 ? ` dans les types sélectionnés` : ''}.</p>
          ) : (
            <div className="space-y-4">
              {results.map((result) => (
                <Card key={`${result.type}-${result.id}`} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      <Link to={result.link} className="hover:underline flex items-center">
                        {getResultIcon(result.type)}
                        {result.title}
                      </Link>
                    </CardTitle>
                    <Badge variant="outline" className="mt-1 w-fit">{getResultTypeLabel(result.type)}</Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 line-clamp-2">{result.description || 'Aucune description disponible.'}</p>
                    {result.created_at && <p className="text-xs text-gray-400 mt-2">Créé le: {new Date(result.created_at).toLocaleDateString()}</p>}
                  </CardContent>
                </Card>
              ))}
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
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GlobalSearchPage;

