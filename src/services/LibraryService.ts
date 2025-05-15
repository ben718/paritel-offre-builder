import { supabase } from "@/integrations/supabase/client";

// --- Types pour la Bibliothèque Documentaire ---

export interface LibraryCategory {
  id?: string;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface LibraryDocument {
  id?: string;
  file_name: string;
  file_path: string; // Chemin dans Supabase Storage
  file_mime_type?: string; // e.g., application/pdf
  title: string;
  description?: string;
  category_id?: string | null; // Lien vers LibraryCategory
  tags?: string[];
  version?: string; // e.g., "1.0", "2.1"
  status?: "brouillon" | "en revue" | "approuvé" | "archivé";
  uploaded_by_id?: string;
  created_at?: string;
  updated_at?: string;
  // Potentiellement: linked_offer_id, linked_product_id pour les documents générés ou liés
}

// --- Fonctions pour les Catégories de la Bibliothèque ---

export const createLibraryCategory = async (categoryData: Omit<LibraryCategory, "id" | "created_at" | "updated_at">): Promise<LibraryCategory | null> => {
  const { data, error } = await supabase
    .from("library_categories")
    .insert([categoryData])
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const getLibraryCategories = async (): Promise<LibraryCategory[]> => {
  const { data, error } = await supabase
    .from("library_categories")
    .select("*")
    .order("name", { ascending: true });
  if (error) throw error;
  return data || [];
};

export const updateLibraryCategory = async (categoryId: string, categoryData: Partial<LibraryCategory>): Promise<LibraryCategory | null> => {
  const { data, error } = await supabase
    .from("library_categories")
    .update(categoryData)
    .eq("id", categoryId)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteLibraryCategory = async (categoryId: string): Promise<void> => {
  // Gérer la réaffectation ou suppression des documents liés ?
  const { error } = await supabase.from("library_categories").delete().eq("id", categoryId);
  if (error) throw error;
};

// --- Fonctions pour les Documents de la Bibliothèque ---

export const uploadLibraryDocument = async (
  file: File,
  metadata: Omit<LibraryDocument, "id" | "file_name" | "file_path" | "file_mime_type" | "uploaded_by_id" | "created_at" | "updated_at">
): Promise<LibraryDocument | null> => {
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  if (sessionError || !sessionData.session) throw new Error("Utilisateur non authentifié pour l'upload.");
  const userId = sessionData.session.user.id;

  const filePath = `library_documents/${userId}/${Date.now()}_${file.name}`;
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("library-attachments") // Bucket dédié pour la bibliothèque
    .upload(filePath, file, {
      contentType: file.type
    });

  if (uploadError) throw uploadError;
  if (!uploadData) throw new Error("Aucune donnée retournée après l'upload du fichier.");

  const docData: Omit<LibraryDocument, "id" | "created_at" | "updated_at"> = {
    ...metadata,
    file_name: file.name,
    file_path: uploadData.path,
    file_mime_type: file.type,
    uploaded_by_id: userId,
    status: metadata.status || "brouillon",
  };

  const { data: dbData, error: dbError } = await supabase
    .from("library_documents")
    .insert([docData])
    .select("*, category:library_categories(name), uploaded_by:profiles(full_name)")
    .single();
  if (dbError) {
    // Si l'insertion échoue, tenter de supprimer le fichier uploadé
    await supabase.storage.from("library-attachments").remove([filePath]);
    throw dbError;
  }
  return dbData;
};

export const getLibraryDocuments = async (filters?: any, page: number = 1, pageSize: number = 10): Promise<{ documents: LibraryDocument[], count: number | null }> => {
  let query = supabase
    .from("library_documents")
    .select("*, category:library_categories(name), uploaded_by:profiles(full_name)", { count: "exact" });

  if (filters?.status) {
    query = query.eq("status", filters.status);
  }
  if (filters?.category_id) {
    query = query.eq("category_id", filters.category_id);
  }
  if (filters?.searchTerm) {
    query = query.or(`title.ilike.%${filters.searchTerm}%,description.ilike.%${filters.searchTerm}%,file_name.ilike.%${filters.searchTerm}%,tags.cs.{${filters.searchTerm}}`);
  }
  // TODO: Ajouter filtre par RLS/rôles utilisateurs

  const offset = (page - 1) * pageSize;
  query = query.range(offset, offset + pageSize - 1).order("updated_at", { ascending: false });

  const { data, error, count } = await query;
  if (error) throw error;
  return { documents: data || [], count };
};

export const getLibraryDocumentById = async (documentId: string): Promise<LibraryDocument | null> => {
  const { data, error } = await supabase
    .from("library_documents")
    .select("*, category:library_categories(name, id), uploaded_by:profiles(full_name)")
    .eq("id", documentId)
    .single();
  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw error;
  }
  return data;
};

export const updateLibraryDocument = async (documentId: string, metadata: Partial<Omit<LibraryDocument, "id" | "file_name" | "file_path" | "file_mime_type" | "uploaded_by_id" | "created_at">>): Promise<LibraryDocument | null> => {
  // Si un nouveau fichier est uploadé, il faudrait une logique séparée pour remplacer l'ancien
  const { data, error } = await supabase
    .from("library_documents")
    .update(metadata)
    .eq("id", documentId)
    .select("*, category:library_categories(name), uploaded_by:profiles(full_name)")
    .single();
  if (error) throw error;
  return data;
};

export const deleteLibraryDocument = async (documentId: string, filePath: string): Promise<void> => {
  // Supprimer le fichier du storage
  const { error: storageError } = await supabase.storage.from("library-attachments").remove([filePath]);
  if (storageError) console.warn("Erreur lors de la suppression du fichier du storage:", storageError.message); // Continuer même si le fichier n'est pas trouvé

  // Supprimer l'entrée de la base de données
  const { error: dbError } = await supabase.from("library_documents").delete().eq("id", documentId);
  if (dbError) throw dbError;
};

