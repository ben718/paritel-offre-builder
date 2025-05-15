import { supabase } from "@/integrations/supabase/client";
// import { type definitions } from "@/integrations/supabase/types"; // Assurez-vous que ce chemin est correct

// --- Types de Base (à affiner et potentiellement générer depuis Supabase) ---

export interface ProductCategory {
  id?: string;
  name: string;
  description?: string;
  parent_category_id?: string | null; // Pour les sous-catégories
  created_at?: string;
  updated_at?: string;
}

export interface Product {
  id?: string;
  name: string;
  reference?: string; // Référence interne Paritel
  description?: string;
  category_id?: string; // Lien vers ProductCategory
  status?: "actif" | "obsolète" | "en développement";
  // Champs techniques spécifiques (pourraient être dans une table séparée ou un JSONB)
  technical_specifications?: Record<string, any>; // ex: { "bande_passante": "1Gbps", "technologie": "Fibre" }
  sla_details_id?: string; // Lien vers une table de SLA si complexe
  created_at?: string;
  updated_at?: string;
}

export interface Service extends Product { // Les services peuvent hériter des produits ou être une entité distincte
  service_type?: "managed" | "unmanaged" | "consulting";
  // Champs spécifiques aux services
}

export interface ProductDocument {
  id?: string;
  product_id: string; // Lien vers Product ou Service
  file_name: string;
  file_path: string; // Chemin dans Supabase Storage
  document_type?: string; // Ex: "Fiche Technique", "Présentation Commerciale", "Grille Tarifaire"
  version?: number;
  uploaded_by_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProductPrice {
  id?: string;
  product_id: string;
  price_ht: number;
  price_ttc?: number; // Calculé ou stocké
  currency: string; // Ex: "EUR"
  price_type: "mensuel" | "annuel" | "ponctuel" | "sur devis";
  valid_from?: string | null;
  valid_to?: string | null;
  created_at?: string;
  updated_at?: string;
  created_by_id?: string;
}

// --- Fonctions pour les Catégories de Produits/Services ---

export const createProductCategory = async (categoryData: Omit<ProductCategory, "id" | "created_at" | "updated_at">): Promise<ProductCategory | null> => {
  const { data, error } = await supabase
    .from("product_categories")
    .insert([categoryData])
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const getProductCategories = async (): Promise<ProductCategory[]> => {
  const { data, error } = await supabase
    .from("product_categories")
    .select("*, parent_category:product_categories!parent_category_id(name)")
    .order("name", { ascending: true });
  if (error) throw error;
  return data || [];
};

// --- Fonctions pour les Produits/Services (CRUD de base) ---

export const createProduct = async (productData: Omit<Product, "id" | "created_at" | "updated_at">): Promise<Product | null> => {
  const { data, error } = await supabase
    .from("products") // Assurez-vous que la table s'appelle bien 'products'
    .insert([productData])
    .select()
    .single();
  if (error) {
    console.error("Erreur lors de la création du produit:", error);
    throw error;
  }
  return data;
};

export const getProducts = async (filters?: any, page: number = 1, pageSize: number = 10): Promise<{ products: Product[], count: number | null }> => {
  let query = supabase
    .from("products")
    .select("*, category:product_categories(name)", { count: "exact" });

  if (filters?.status) {
    query = query.eq("status", filters.status);
  }
  if (filters?.category_id) {
    query = query.eq("category_id", filters.category_id);
  }
  if (filters?.searchTerm) {
    query = query.or(`name.ilike.%${filters.searchTerm}%,reference.ilike.%${filters.searchTerm}%`);
  }

  const offset = (page - 1) * pageSize;
  query = query.range(offset, offset + pageSize - 1).order("name", { ascending: true });

  const { data, error, count } = await query;
  if (error) {
    console.error("Erreur lors de la récupération des produits:", error);
    throw error;
  }
  return { products: data || [], count };
};

export const getProductById = async (productId: string): Promise<Product | null> => {
  const { data, error } = await supabase
    .from("products")
    .select("*, category:product_categories(name, id)")
    .eq("id", productId)
    .single();
  if (error) {
    if (error.code === 'PGRST116') return null;
    console.error(`Erreur lors de la récupération du produit ${productId}:`, error);
    throw error;
  }
  return data;
};

export const updateProduct = async (productId: string, productData: Partial<Product>): Promise<Product | null> => {
  const { data, error } = await supabase
    .from("products")
    .update(productData)
    .eq("id", productId)
    .select()
    .single();
  if (error) {
    console.error(`Erreur lors de la mise à jour du produit ${productId}:`, error);
    throw error;
  }
  return data;
};

export const deleteProduct = async (productId: string): Promise<void> => {
  // Gérer la suppression des documents et prix associés avant de supprimer le produit
  // TODO: Supprimer les documents et prix associés
  const { error } = await supabase.from("products").delete().eq("id", productId);
  if (error) {
    console.error(`Erreur lors de la suppression du produit ${productId}:`, error);
    throw error;
  }
};

// --- Fonctions pour les Documents Produits/Services ---

export const getProductDocuments = async (productId: string): Promise<ProductDocument[]> => {
  const { data, error } = await supabase
    .from("product_documents")
    .select("*, uploaded_by:profiles(full_name)")
    .eq("product_id", productId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
};

export const uploadProductDocument = async (productId: string, file: File, documentType?: string): Promise<ProductDocument | null> => {
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  if (sessionError || !sessionData.session) throw new Error("Utilisateur non authentifié");
  const userId = sessionData.session.user.id;

  const filePath = `product_documents/${productId}/${Date.now()}_${file.name}`;
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("product-attachments") // Bucket dédié pour les documents produits
    .upload(filePath, file);

  if (uploadError) throw uploadError;
  if (!uploadData) throw new Error("Aucune donnée retournée après l'upload.");

  const docData: Omit<ProductDocument, "id" | "created_at" | "updated_at"> = {
    product_id: productId,
    file_name: file.name,
    file_path: uploadData.path,
    document_type: documentType,
    uploaded_by_id: userId,
    version: 1,
  };

  const { data: dbData, error: dbError } = await supabase
    .from("product_documents")
    .insert([docData])
    .select()
    .single();
  if (dbError) throw dbError;
  return dbData;
};

export const deleteProductDocument = async (documentId: string, filePath: string): Promise<void> => {
  await supabase.storage.from("product-attachments").remove([filePath]);
  const { error } = await supabase.from("product_documents").delete().eq("id", documentId);
  if (error) throw error;
};

// --- Fonctions pour les Prix Produits/Services ---

export const getProductPrices = async (productId: string): Promise<ProductPrice[]> => {
  const { data, error } = await supabase
    .from("product_prices")
    .select("*, created_by:profiles!created_by_id(full_name)")
    .eq("product_id", productId)
    .order("created_at", { ascending: false });
  if (error) {
    console.error(`Erreur lors de la récupération des prix pour le produit ${productId}:`, error);
    throw error;
  }
  return data || [];
};

export const createProductPrice = async (priceData: Omit<ProductPrice, "id" | "created_at" | "updated_at" | "created_by_id">): Promise<ProductPrice | null> => {
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  if (sessionError || !sessionData.session) throw new Error("Utilisateur non authentifié");
  const userId = sessionData.session.user.id;

  const { data, error } = await supabase
    .from("product_prices")
    .insert([{ ...priceData, created_by_id: userId }])
    .select()
    .single();
  if (error) {
    console.error("Erreur lors de la création du prix:", error);
    throw error;
  }
  return data;
};

export const updateProductPrice = async (priceId: string, priceData: Partial<Omit<ProductPrice, "id" | "product_id" | "created_at" | "updated_at" | "created_by_id">>): Promise<ProductPrice | null> => {
  const { data, error } = await supabase
    .from("product_prices")
    .update(priceData)
    .eq("id", priceId)
    .select()
    .single();
  if (error) {
    console.error(`Erreur lors de la mise à jour du prix ${priceId}:`, error);
    throw error;
  }
  return data;
};

export const deleteProductPrice = async (priceId: string): Promise<void> => {
  const { error } = await supabase
    .from("product_prices")
    .delete()
    .eq("id", priceId);
  if (error) {
    console.error(`Erreur lors de la suppression du prix ${priceId}:`, error);
    throw error;
  }
};

// --- Fonctions pour les Spécifications Techniques (si stockées séparément) ---
// ...

