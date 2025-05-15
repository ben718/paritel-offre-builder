import { supabase } from "@/integrations/supabase/client";
import { LibraryDocument } from "./LibraryService"; // Pour lier les documents générés

// --- Types pour les Modèles de Documents ---
export interface DocumentTemplate {
  id?: string;
  name: string; // Nom du modèle, ex: "Mémoire Technique Standard"
  description?: string;
  template_type: "offre" | "produit" | "general"; // À quel type d'entité ce modèle est-il principalement lié?
  content_structure: any; // JSON définissant la structure du document, les champs à remplir, etc.
                          // Pourrait être une structure pour un éditeur riche ou des placeholders.
  // Exemple: { sections: [{ title: "Introduction", fields: ["offre.nom_marche", "client.nom"] }] }
  output_format: "pdf" | "docx" | "html"; // Format de sortie du document généré
  created_by_id?: string;
  created_at?: string;
  updated_at?: string;
}

// --- Fonctions pour les Modèles de Documents ---

export const createDocumentTemplate = async (templateData: Omit<DocumentTemplate, "id" | "created_by_id" | "created_at" | "updated_at">): Promise<DocumentTemplate | null> => {
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  if (sessionError || !sessionData.session) throw new Error("Utilisateur non authentifié.");
  const userId = sessionData.session.user.id;

  const payload = { ...templateData, created_by_id: userId };
  const { data, error } = await supabase
    .from("document_templates")
    .insert([payload])
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const getDocumentTemplates = async (filters?: any): Promise<DocumentTemplate[]> => {
  let query = supabase.from("document_templates").select("*");
  if (filters?.template_type) {
    query = query.eq("template_type", filters.template_type);
  }
  // TODO: Ajouter RLS/filtrage par rôle
  query = query.order("name", { ascending: true });
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};

export const getDocumentTemplateById = async (templateId: string): Promise<DocumentTemplate | null> => {
  const { data, error } = await supabase
    .from("document_templates")
    .select("*")
    .eq("id", templateId)
    .single();
  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw error;
  }
  return data;
};

export const updateDocumentTemplate = async (templateId: string, templateData: Partial<Omit<DocumentTemplate, "id" | "created_by_id" | "created_at">>): Promise<DocumentTemplate | null> => {
  const { data, error } = await supabase
    .from("document_templates")
    .update(templateData)
    .eq("id", templateId)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteDocumentTemplate = async (templateId: string): Promise<void> => {
  const { error } = await supabase.from("document_templates").delete().eq("id", templateId);
  if (error) throw error;
};

// --- Fonctions pour la Génération de Documents ---

interface GenerationContext {
  offerId?: string;
  productId?: string;
  // Autres données contextuelles nécessaires pour remplir le modèle
  [key: string]: any;
}

// Ceci est une maquette. La génération réelle nécessitera une logique complexe côté serveur (Edge Function)
// ou l'utilisation d'une librairie de templating et de conversion (ex: Paged.js, WeasyPrint, docx-templater).
export const generateDocumentFromTemplate = async (
  templateId: string, 
  context: GenerationContext,
  outputFileName: string // ex: "Memoire_Technique_ClientX.pdf"
): Promise<{ generatedDocument: LibraryDocument | null; error?: string }> => {
  const template = await getDocumentTemplateById(templateId);
  if (!template) return { generatedDocument: null, error: "Modèle non trouvé." };

  // 1. Récupérer les données nécessaires basées sur le context (offre, produit, etc.)
  //    Exemple: const offerData = await getOfferById(context.offerId);
  //             const productData = await getProductById(context.productId);

  // 2. Logique de "remplissage" du template avec les données contextuelles.
  //    Ceci dépendra énormément de la structure `template.content_structure`.
  //    Ex: Remplacer des placeholders {{offre.nom_marche}} par les vraies valeurs.
  let generatedContentString = `Contenu généré pour ${outputFileName} basé sur le modèle ${template.name}.\n`;
  if (context.offerId) generatedContentString += `Contexte Appel d'Offre ID: ${context.offerId}\n`;
  if (context.productId) generatedContentString += `Contexte Produit ID: ${context.productId}\n`;
  // ... ajouter plus de détails basés sur les données récupérées

  // 3. Conversion vers le format de sortie (PDF, DOCX)
  //    Ceci est la partie la plus complexe et nécessitera des outils/librairies spécifiques.
  //    Pour l'instant, on simule la création d'un fichier texte.
  const blob = new Blob([generatedContentString], { type: 'text/plain' });
  const generatedFile = new File([blob], outputFileName, { type: 'text/plain' });

  // 4. Sauvegarder le document généré dans la bibliothèque documentaire
  try {
    const libraryDocMetadata: Omit<LibraryDocument, "id" | "file_name" | "file_path" | "file_mime_type" | "uploaded_by_id" | "created_at" | "updated_at"> = {
      title: outputFileName.substring(0, outputFileName.lastIndexOf('.')) || outputFileName,
      description: `Document généré à partir du modèle "${template.name}" le ${new Date().toLocaleDateString()}.`, 
      // category_id: // Peut-être une catégorie "Documents Générés" ou liée au contexte
      tags: ["généré", template.template_type, template.name],
      version: "1.0",
      status: "approuvé", // Ou "brouillon" si une revue est nécessaire
      // linked_offer_id: context.offerId,
      // linked_product_id: context.productId,
    };
    const savedDocument = await uploadLibraryDocument(generatedFile, libraryDocMetadata);
    return { generatedDocument: savedDocument };
  } catch (uploadError: any) {
    console.error("Erreur lors de la sauvegarde du document généré:", uploadError);
    return { generatedDocument: null, error: `Erreur sauvegarde: ${uploadError.message}` };
  }
};

