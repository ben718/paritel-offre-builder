import { supabase } from "@/integrations/supabase/client";

export interface SearchResult {
  id: string;
  type: "appel_offre" | "produit_service" | "document_offre" | "document_produit" | "document_bibliotheque";
  title: string;
  description?: string;
  link: string; // Lien vers la page de détail
  raw_data?: any; // Données brutes pour un affichage plus riche si besoin
  created_at?: string;
  updated_at?: string; // Pour un tri par pertinence/fraîcheur
  relevance_score?: number; // Pour un tri par pertinence
}

export interface SearchFilters {
  searchTerm: string;
  types?: Array<"appel_offre" | "produit_service" | "document">; 
  // TODO: Ajouter des filtres avancés: dateRange, category, status, etc.
  // TODO: Ajouter userId et userRoles pour filtrage basé sur les droits d'accès
}

// OPTIMISATION FUTURE: 
// Cette fonction devrait idéalement être une Edge Function Supabase ou une fonction SQL complexe pour:
// 1. Performance: Exécuter la recherche combinée et le tri côté serveur.
// 2. Sécurité: Appliquer les filtres de droits d'accès (RLS ou logique métier) côté serveur.
// 3. Pertinence: Utiliser les capacités de recherche plein texte avancées de PostgreSQL (tsvector, tsquery, ranking).

export const performGlobalSearch = async (
  filters: SearchFilters,
  page: number = 1,
  pageSize: number = 10
  // userId?: string, // Pourrait être passé pour la sécurité
  // userRoles?: string[] // Pourrait être passé pour la sécurité
): Promise<{ results: SearchResult[]; count: number | null }> => {
  const { searchTerm, types } = filters;
  let allResults: SearchResult[] = [];

  // --- Recherche dans les Appels d'Offres ---
  if (!types || types.includes("appel_offre")) {
    const { data: offers, error: offersError } = await supabase
      .from("offers") // TODO: Appliquer RLS ou filtre par rôle ici
      .select("id, market_name, organization, lot_number, created_at, updated_at")
      .or(`market_name.ilike.%${searchTerm}%,organization.ilike.%${searchTerm}%,lot_number.ilike.%${searchTerm}%`);

    if (offersError) console.error("Erreur recherche AO:", offersError);
    if (offers) {
      allResults.push(...offers.map(o => ({
        id: o.id,
        type: "appel_offre" as const,
        title: o.market_name,
        description: `${o.organization || ''} - Lot: ${o.lot_number || 'N/A'}`,
        link: `/appels-offres/${o.id}`,
        created_at: o.created_at,
        updated_at: o.updated_at,
        relevance_score: 1, // Score de base, à affiner
        raw_data: o,
      })));
    }
  }

  // --- Recherche dans les Produits/Services ---
  if (!types || types.includes("produit_service")) {
    const { data: products, error: productsError } = await supabase
      .from("products") // TODO: Appliquer RLS ou filtre par rôle ici
      .select("id, name, reference, description, created_at, updated_at")
      .or(`name.ilike.%${searchTerm}%,reference.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
    
    if (productsError) console.error("Erreur recherche Produits:", productsError);
    if (products) {
      allResults.push(...products.map(p => ({
        id: p.id,
        type: "produit_service" as const,
        title: p.name,
        description: p.reference || p.description?.substring(0,100),
        link: `/catalogue/produits/${p.id}`,
        created_at: p.created_at,
        updated_at: p.updated_at,
        relevance_score: 1,
        raw_data: p,
      })));
    }
  }
  
  // --- Recherche dans les Documents (combiné pour l'instant) ---
  // Idéalement, il faudrait aussi rechercher dans le contenu des documents si possible (nécessite une indexation)
  if (!types || types.includes("document")) {
    // Documents d'Appels d'Offres
    const { data: offerDocs, error: offerDocsError } = await supabase
      .from("offer_documents") // TODO: Appliquer RLS ou filtre par rôle ici (via l'offre parente)
      .select("id, file_name, file_type, offer_id, created_at, updated_at, offer:offers(market_name)")
      .ilike("file_name", `%${searchTerm}%`);

    if (offerDocsError) console.error("Erreur recherche Documents AO:", offerDocsError);
    if (offerDocs) {
      allResults.push(...offerDocs.map(d => ({
        id: d.id,
        type: "document_offre" as const,
        title: d.file_name,
        description: `Document d'AO: ${(d as any).offer?.market_name || 'Appel d'offre inconnu'} - Type: ${d.file_type || 'N/A'}`,
        link: `/appels-offres/${d.offer_id}?tab=documents`,
        created_at: d.created_at,
        updated_at: d.updated_at,
        relevance_score: 0.8, // Moins pertinent que l'objet principal par défaut
        raw_data: d,
      })));
    }

    // Documents Produits/Services
    const { data: productDocs, error: productDocsError } = await supabase
      .from("product_documents") // TODO: Appliquer RLS ou filtre par rôle ici (via le produit parent)
      .select("id, file_name, document_type, product_id, created_at, updated_at, product:products(name)")
      .ilike("file_name", `%${searchTerm}%`);

    if (productDocsError) console.error("Erreur recherche Documents Produits:", productDocsError);
    if (productDocs) {
      allResults.push(...productDocs.map(d => ({
        id: d.id,
        type: "document_produit" as const,
        title: d.file_name,
        description: `Document Produit: ${(d as any).product?.name || 'Produit inconnu'} - Type: ${d.document_type || 'N/A'}`,
        link: `/catalogue/produits/${d.product_id}?tab=documents`,
        created_at: d.created_at,
        updated_at: d.updated_at,
        relevance_score: 0.8,
        raw_data: d,
      })));
    }
    
    // TODO: Ajouter la recherche dans la Bibliothèque Documentaire (table `library_documents`?)
  }

  // Tri des résultats (simulation de pertinence simple)
  // Un vrai tri par pertinence se ferait avec des scores de recherche plein texte (pg_search)
  allResults.sort((a, b) => {
    // Priorité aux titres contenant le terme exact (simplifié)
    const titleAMatch = a.title.toLowerCase().includes(searchTerm.toLowerCase());
    const titleBMatch = b.title.toLowerCase().includes(searchTerm.toLowerCase());
    if (titleAMatch && !titleBMatch) return -1;
    if (!titleAMatch && titleBMatch) return 1;

    // Ensuite par score de pertinence (si défini)
    if ((a.relevance_score || 0) !== (b.relevance_score || 0)) {
      return (b.relevance_score || 0) - (a.relevance_score || 0);
    }
    // Enfin par date de mise à jour (plus récent en premier)
    return new Date(b.updated_at || b.created_at || 0).getTime() - new Date(a.updated_at || a.created_at || 0).getTime();
  });

  // Pagination
  const offset = (page - 1) * pageSize;
  const paginatedResults = allResults.slice(offset, offset + pageSize);
  const count = allResults.length; // Le count total avant pagination

  return { results: paginatedResults, count };
};

