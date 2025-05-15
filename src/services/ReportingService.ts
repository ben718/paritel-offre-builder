import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/types/supabase";

// --- Types pour les Statistiques et Rapports ---

// Types pour les données de reporting
interface ReportingData {
  report_date: string;
  status?: string;
  market_name?: string;
  category: string;
  name?: string;
  category_id?: string;
}

type Offer = Database['public']['Tables']['offers']['Row'];
type Product = Database['public']['Tables']['products']['Row'];
type Category = Database['public']['Tables']['categories']['Row'];

interface ProductData {
  created_at: string;
  name: string;
  category_id: string;
  categories?: {
    name: string;
  };
}

interface OfferData {
  created_at: string;
  status: string;
  market_name: string;
}

export interface OfferStats {
  total_offers: number;
  offers_by_status: Array<{ status: string; count: number }>;
  // ... autres statistiques sur les AO
}

export interface ProductStats {
  total_products: number;
  products_by_category: Array<{ category_name: string; count: number }>;
  // ... autres statistiques sur les produits
}

export interface DocumentStats {
  total_library_documents: number;
  documents_by_type: Array<{ type: string; count: number }>; // ex: PDF, DOCX
  documents_by_category: Array<{ category_name: string; count: number }>;
  // ... autres statistiques sur les documents
}

export interface UserActivityStats {
  active_users_last_30_days: number;
  logins_last_7_days: number;
  // ... autres statistiques d'activité
}

export interface GlobalDashboardStats {
  offer_stats: Partial<OfferStats>;
  product_stats: Partial<ProductStats>;
  document_stats: Partial<DocumentStats>;
  user_activity_stats: Partial<UserActivityStats>;
}

// --- Fonctions pour récupérer les Statistiques ---

// Exemple: Statistiques sur les Appels d'Offres
export const getOfferStatistics = async (): Promise<Partial<OfferStats>> => {
  const { count: total_offers, error: totalError } = await supabase
    .from("offers")
    .select("*", { count: "exact", head: true });
  if (totalError) console.error("Erreur stats AO (total):", totalError);

  const { data: byStatus, error: statusError } = await supabase
    .from("offers")
    .select("status, count:id") // Assurez-vous que la table `offers` a une colonne `status`
    // .group("status") // Group by n'est pas directement supporté comme ça en Supabase JS client pour count
    // Il faudrait une vue ou une fonction RPC pour un group by propre, ou traiter en JS
    ;
  if (statusError) console.error("Erreur stats AO (status):", statusError);
  
  let offers_by_status: Array<{ status: string; count: number }> = [];
  if (byStatus) {
    const statusCounts = byStatus.reduce((acc, curr) => {
        const statusKey = curr.status || "Non défini";
        acc[statusKey] = (acc[statusKey] || 0) + 1; // ou curr.count si c'était un vrai group by
        return acc;
    }, {} as Record<string, number>);
    offers_by_status = Object.entries(statusCounts).map(([status, count]) => ({ status, count }));
  }

  return {
    total_offers: total_offers || 0,
    offers_by_status,
  };
};

// Exemple: Statistiques sur les Produits
export const getProductStatistics = async (): Promise<Partial<ProductStats>> => {
  const { count: total_products, error: totalError } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true });
  if (totalError) console.error("Erreur stats Produits (total):", totalError);

  // Pour products_by_category, il faudrait une jointure ou une fonction RPC
  // Simulation simple:
  const { data: productsWithCat, error: catError } = await supabase
    .from("products")
    .select("id, category:categories(name)"); // Assurez-vous que `categories` est la table des catégories de produits
  if (catError) console.error("Erreur stats Produits (catégories):", catError);

  let products_by_category: Array<{ category_name: string; count: number }> = [];
  if (productsWithCat) {
    const categoryCounts = productsWithCat.reduce((acc, curr) => {
        const catName = (curr.category as any)?.name || "Non catégorisé";
        acc[catName] = (acc[catName] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    products_by_category = Object.entries(categoryCounts).map(([category_name, count]) => ({ category_name, count }));
  }

  return {
    total_products: total_products || 0,
    products_by_category,
  };
};

// Fonction pour agréger les statistiques du tableau de bord principal
export const getGlobalDashboardStatistics = async (): Promise<GlobalDashboardStats> => {
  // TODO: Ajouter la sécurité par rôle ici pour ne retourner que les stats autorisées
  const offer_stats = await getOfferStatistics();
  const product_stats = await getProductStatistics();
  // const document_stats = await getDocumentStatistics(); // À implémenter
  // const user_activity_stats = await getUserActivityStatistics(); // À implémenter

  return {
    offer_stats,
    product_stats,
    document_stats: { total_library_documents: 0, documents_by_type: [], documents_by_category: [] }, // Placeholder
    user_activity_stats: { active_users_last_30_days: 0, logins_last_7_days: 0 }, // Placeholder
  };
};

// Plus de fonctions peuvent être ajoutées pour des rapports spécifiques
// export const generateOfferActivityReport = async (dateRange: {from: string, to: string}) => { ... }

// Fonction pour récupérer les données de reporting
export const fetchReportingData = async (type: string): Promise<ReportingData[]> => {
  try {
    switch (type) {
      case 'sales':
        // Récupérer les statistiques des offres par période
        const { data: offersData, error: offersError } = await supabase
          .from('offers')
          .select('created_at, status, market_name')
          .order('created_at', { ascending: false });
        
        if (offersError) throw offersError;
        if (!offersData) return [];
        
        // Transformer les données pour le reporting
        return offersData.map(offer => ({
          report_date: offer.created_at,
          status: offer.status,
          market_name: offer.market_name,
          category: 'offers'
        }));

      case 'products':
        // Récupérer les statistiques des produits
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('created_at, name, category_id, categories(name)')
          .order('created_at', { ascending: false });
        
        if (productsError) throw productsError;
        if (!productsData) return [];
        
        return productsData.map(product => ({
          report_date: product.created_at,
          name: product.name,
          category: product.categories?.name || 'Non catégorisé',
          category_id: product.category_id
        }));

      default:
        throw new Error('Type de reporting non supporté');
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des données de reporting:', error);
    throw error;
  }
};

// Fonction pour récupérer les catégories de reporting
export const fetchReportingCategories = async (): Promise<string[]> => {
  try {
    // Récupérer les catégories de produits
    const { data: categories, error } = await supabase
      .from('categories')
      .select('name')
      .order('name');
    
    if (error) throw error;
    if (!categories) return [];
    
    return categories.map(cat => cat.name);
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error);
    throw error;
  }
};

// Fonction pour sauvegarder les préférences de reporting
export const saveReportingPreferences = async (preferences: { period: string, productType: string }) => {
  try {
    // Sauvegarder les préférences dans la table profiles
    const { data: user, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user.user) throw new Error('Utilisateur non authentifié');

    const { error } = await supabase
      .from('profiles')
      .update({
        preferences: preferences
      })
      .eq('id', user.user.id);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des préférences:', error);
    throw error;
  }
};

