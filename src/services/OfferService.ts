import { supabase } from "@/integrations/supabase/client";
import { type definitions } from "@/integrations/supabase/types"; // Assurez-vous que ce chemin est correct après la génération des types

// Utiliser les types générés par Supabase si possible, sinon définir des types locaux
// export type Offer = definitions["offers"];
// export type OfferDocument = definitions["offer_documents"];

// Types locaux en attendant la génération complète ou pour plus de flexibilité
export interface Offer {
  id?: string;
  market_name: string;
  organization?: string;
  lot_number?: string;
  deadline?: string;
  status?: string;
  commercial_manager_id?: string;
  technical_manager_id?: string;
  created_by_id?: string; // Devrait être rempli automatiquement par l'utilisateur connecté
  created_at?: string;
  updated_at?: string;
  // Potentiellement d'autres champs selon le schéma finalisé
}

export interface OfferProduct {
  id?: string;
  offer_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  // D'autres champs comme la description spécifique du produit pour cette offre, etc.
  created_at?: string;
  updated_at?: string;
}

export interface OfferDocument {
  id?: string;
  offer_id: string;
  file_name: string;
  file_path: string; // Chemin dans Supabase Storage
  file_type?: string; // Ex: "CCTP", "RC", "AE", "BPU"
  version?: number;
  uploaded_by_id?: string;
  created_at?: string;
  updated_at?: string;
}

// --- Fonctions pour les Appels d'Offres (Offers) ---

/**
 * Crée un nouvel appel d'offres.
 * @param offerData Les données de l'appel d'offres à créer.
 * @returns Le nouvel appel d'offres créé.
 */
export const createOffer = async (offerData: Omit<Offer, 'id' | 'created_at' | 'updated_at'>): Promise<Offer | null> => {
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  if (sessionError || !sessionData.session) {
    console.error("Utilisateur non authentifié", sessionError);
    throw new Error("Utilisateur non authentifié");
  }
  const userId = sessionData.session.user.id;

  const { data, error } = await supabase
    .from("offers")
    .insert([{ ...offerData, created_by_id: userId }])
    .select()
    .single();

  if (error) {
    console.error("Erreur lors de la création de l'appel d'offres:", error);
    throw error;
  }
  return data as Offer;
};

/**
 * Récupère la liste des appels d'offres, avec filtres et pagination optionnels.
 * @param filters Options de filtrage (à définir).
 * @param page Page actuelle pour la pagination.
 * @param pageSize Nombre d'éléments par page.
 * @returns Une liste d'appels d'offres.
 */
export const getOffers = async (filters?: any, page: number = 1, pageSize: number = 10): Promise<{ offers: Offer[], count: number | null }> => {
  let query = supabase
    .from("offers")
    .select("*, commercial_manager:profiles!commercial_manager_id(full_name), technical_manager:profiles!technical_manager_id(full_name)", { count: "exact" });
    // .select("*, commercial_manager_id(full_name), technical_manager_id(full_name)", { count: "exact" });

  // Gérer les filtres (exemple)
  if (filters?.status) {
    query = query.eq("status", filters.status);
  }
  if (filters?.searchTerm) {
    query = query.ilike("market_name", `%${filters.searchTerm}%`);
  }

  // Gérer la pagination
  const offset = (page - 1) * pageSize;
  query = query.range(offset, offset + pageSize - 1);
  query = query.order("created_at", { ascending: false });

  const { data, error, count } = await query;

  if (error) {
    console.error("Erreur lors de la récupération des appels d'offres:", error);
    throw error;
  }
  return { offers: data as Offer[], count };
};

/**
 * Récupère un appel d'offres spécifique par son ID.
 * @param offerId L'ID de l'appel d'offres.
 * @returns L'appel d'offres trouvé ou null.
 */
export const getOfferById = async (offerId: string): Promise<Offer | null> => {
  const { data, error } = await supabase
    .from("offers")
    .select("*, commercial_manager:profiles!commercial_manager_id(full_name, id), technical_manager:profiles!technical_manager_id(full_name, id), created_by:profiles!created_by_id(full_name, id)")
    .eq("id", offerId)
    .single();

  if (error) {
    console.error(`Erreur lors de la récupération de l'appel d'offres ${offerId}:`, error);
    // Si l'erreur est PGRST116 (not found), retourner null est approprié
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data as Offer;
};

/**
 * Met à jour un appel d'offres existant.
 * @param offerId L'ID de l'appel d'offres à mettre à jour.
 * @param offerData Les données à mettre à jour.
 * @returns L'appel d'offres mis à jour.
 */
export const updateOffer = async (offerId: string, offerData: Partial<Offer>): Promise<Offer | null> => {
  const { data, error } = await supabase
    .from("offers")
    .update(offerData)
    .eq("id", offerId)
    .select()
    .single();

  if (error) {
    console.error(`Erreur lors de la mise à jour de l'appel d'offres ${offerId}:`, error);
    throw error;
  }
  return data as Offer;
};

/**
 * Supprime un appel d'offres.
 * @param offerId L'ID de l'appel d'offres à supprimer.
 */
export const deleteOffer = async (offerId: string): Promise<void> => {
  const { error } = await supabase
    .from("offers")
    .delete()
    .eq("id", offerId);

  if (error) {
    console.error(`Erreur lors de la suppression de l'appel d'offres ${offerId}:`, error);
    throw error;
  }
};

// --- Fonctions pour les Produits d'Appels d'Offres (OfferProducts) ---

/**
 * Ajoute un produit à un appel d'offres.
 * @param offerProductData Les données du produit à ajouter à l'offre.
 * @returns Le produit ajouté à l'offre.
 */
export const addProductToOffer = async (offerProductData: Omit<OfferProduct, 'id' | 'created_at' | 'updated_at'>): Promise<OfferProduct | null> => {
  const { data, error } = await supabase
    .from("offer_products") // Assurez-vous que cette table existe
    .insert([offerProductData])
    .select()
    .single();

  if (error) {
    console.error("Erreur lors de l'ajout du produit à l'offre:", error);
    throw error;
  }
  return data as OfferProduct;
};

// --- Fonctions pour les Documents d'Appels d'Offres (OfferDocuments) ---

/**
 * Récupère les documents associés à un appel d'offres.
 * @param offerId L'ID de l'appel d'offres.
 * @returns Une liste de documents.
 */
export const getOfferDocuments = async (offerId: string): Promise<OfferDocument[]> => {
  const { data, error } = await supabase
    .from("offer_documents")
    .select("*, uploaded_by:profiles(full_name, id)")
    .eq("offer_id", offerId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(`Erreur lors de la récupération des documents pour l'AO ${offerId}:`, error);
    throw error;
  }
  return data as OfferDocument[];
};

/**
 * Upload un document pour un appel d'offres et enregistre ses métadonnées.
 * @param offerId L'ID de l'appel d'offres.
 * @param file Le fichier à uploader.
 * @param fileType Le type de document (CCTP, RC, etc.).
 * @returns Les métadonnées du document uploadé.
 */
export const uploadOfferDocument = async (offerId: string, file: File, fileType?: string): Promise<OfferDocument | null> => {
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  if (sessionError || !sessionData.session) {
    console.error("Utilisateur non authentifié pour l'upload", sessionError);
    throw new Error("Utilisateur non authentifié");
  }
  const userId = sessionData.session.user.id;

  const fileName = `${userId}/${offerId}/${Date.now()}_${file.name}`;
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("offer-documents") // Nom du bucket de stockage pour les documents d'AO
    .upload(fileName, file);

  if (uploadError) {
    console.error("Erreur lors de l'upload du fichier:", uploadError);
    throw uploadError;
  }

  if (!uploadData) {
    throw new Error("Aucune donnée retournée après l'upload du fichier.");
  }

  const documentData: Omit<OfferDocument, 'id' | 'created_at' | 'updated_at'> = {
    offer_id: offerId,
    file_name: file.name,
    file_path: uploadData.path,
    file_type: fileType,
    uploaded_by_id: userId,
    version: 1, // Gérer la version si nécessaire
  };

  const { data: dbData, error: dbError } = await supabase
    .from("offer_documents")
    .insert([documentData])
    .select()
    .single();

  if (dbError) {
    console.error("Erreur lors de l'enregistrement des métadonnées du document:", dbError);
    // Tenter de supprimer le fichier uploadé si l'enregistrement en base échoue ?
    throw dbError;
  }

  return dbData as OfferDocument;
};

/**
 * Supprime un document d'appel d'offres (fichier et métadonnées).
 * @param documentId L'ID du document à supprimer.
 * @param filePath Le chemin du fichier dans le storage.
 */
export const deleteOfferDocument = async (documentId: string, filePath: string): Promise<void> => {
  // 1. Supprimer le fichier du storage
  const { error: storageError } = await supabase.storage
    .from("offer-documents")
    .remove([filePath]);

  if (storageError) {
    console.error(`Erreur lors de la suppression du fichier ${filePath} du storage:`, storageError);
    // Continuer même si la suppression du fichier échoue pour supprimer l'entrée en base ? Ou gérer autrement ?
    // Pour l'instant, on log l'erreur et on continue.
  }

  // 2. Supprimer les métadonnées de la base
  const { error: dbError } = await supabase
    .from("offer_documents")
    .delete()
    .eq("id", documentId);

  if (dbError) {
    console.error(`Erreur lors de la suppression des métadonnées du document ${documentId}:`, dbError);
    throw dbError;
  }
};

/**
 * Récupère les 5 offres les plus récentes.
 * @param limit Nombre d'offres à retourner (par défaut 5)
 * @returns Liste des offres récentes
 */
export const getRecentOffers = async (limit: number = 5): Promise<Offer[]> => {
  const { data, error } = await supabase
    .from("offers")
    .select("id, created_at, market_name, organization, status")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Erreur lors de la récupération des offres récentes:", error);
    throw error;
  }
  return data as Offer[];
};

// Ajouter d'autres fonctions si nécessaire (ex: mise à jour de document, gestion des versions, etc.)


