import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";

// --- Types pour l'Administration ---

export interface AppUser extends User {
  // raw_user_meta_data peut contenir des infos comme le nom complet, rôle initial, etc.
  // raw_app_meta_data peut contenir les rôles assignés par l'application
  full_name?: string;
  roles?: string[]; // Rôles applicatifs
}

export interface Role {
  id?: string; // Peut être le nom du rôle si unique
  name: string;
  description?: string;
  permissions?: string[]; // Liste des permissions associées à ce rôle
}

// --- Fonctions pour la Gestion des Utilisateurs (Admin) ---

// Récupérer tous les utilisateurs (nécessite des droits admin Supabase ou une fonction Edge sécurisée)
export const getAllUsers = async (): Promise<AppUser[]> => {
  // ATTENTION: L'appel direct à supabase.auth.admin.listUsers() n'est pas disponible côté client.
  // Il faut créer une Edge Function Supabase qui utilise le service_role key pour cela.
  // Pour l'instant, on simule ou on utilise une table `profiles` si elle existe et est synchronisée.

  // Tentative via une table `profiles` qui aurait une colonne `user_id` (UUID) et `roles` (array de text)
  const { data, error } = await supabase
    .from("profiles") // Assurez-vous que cette table existe et est peuplée
    .select(`
      user_id, 
      email,
      full_name,
      roles,
      created_at,
      last_sign_in_at
    `);

  if (error) {
    console.error("Erreur lors de la récupération des utilisateurs (via profiles):", error);
    // Fallback si la table profiles n'est pas configurée comme attendu
    // On pourrait appeler une Edge Function ici.
    // Pour la démo, on retourne un tableau vide ou une erreur claire.
    // throw new Error("Impossible de lister les utilisateurs. Configuration de la table 'profiles' ou Edge Function requise.");
    return []; // Retourner vide pour l'instant pour ne pas bloquer l'UI
  }
  
  // Mapper les données de `profiles` vers `AppUser`
  // Ceci est une simplification, car `User` de Supabase contient plus de champs.
  const users: AppUser[] = data?.map(profile => ({
    id: profile.user_id, // `id` est l'UUID de l'utilisateur
    email: profile.email,
    full_name: profile.full_name,
    roles: profile.roles || ["Utilisateur"], // Rôle par défaut si non spécifié
    created_at: profile.created_at,
    last_sign_in_at: profile.last_sign_in_at,
    // Les autres champs de `User` (app_metadata, user_metadata, etc.) ne sont pas directement dans `profiles`
    // Il faudrait les récupérer via `auth.admin` dans une Edge Function.
    app_metadata: { provider: '', providers: [] }, // Placeholder
    user_metadata: {}, // Placeholder
    aud: '', // Placeholder
    confirmed_at: profile.created_at, // Approximation
    email_confirmed_at: profile.created_at, // Approximation
    phone: '', // Placeholder
    updated_at: profile.created_at, // Approximation
  })) || [];

  return users;
};

// Mettre à jour le rôle d'un utilisateur (nécessite une Edge Function ou droits admin)
export const updateUserRoles = async (userId: string, roles: string[]): Promise<AppUser | null> => {
  // Encore une fois, cela devrait passer par une Edge Function sécurisée.
  // Simulation: mise à jour de la table `profiles`
  const { data, error } = await supabase
    .from("profiles")
    .update({ roles: roles, updated_at: new Date().toISOString() })
    .eq("user_id", userId)
    .select()
    .single();

  if (error) {
    console.error("Erreur lors de la mise à jour des rôles (via profiles):", error);
    throw error;
  }
  // Remapper vers AppUser si nécessaire, ou juste retourner les données du profil mises à jour.
  // Pour la simplicité, on ne remappe pas complètement ici.
  return data ? { ...data, id: data.user_id } as AppUser : null;
};

// --- Fonctions pour la Gestion des Rôles Applicatifs (si stockés en DB) ---
// Si les rôles sont juste des chaînes de caractères, pas besoin de les gérer en DB.
// Mais si les rôles ont des permissions associées, une table `roles` est utile.

export const getAppRoles = async (): Promise<Role[]> => {
  // Simuler des rôles fixes pour l'instant, ou lire d'une table `app_roles`
  // TODO: Lire depuis une table `app_roles` si elle existe
  return [
    { id: "Admin", name: "Admin", description: "Accès total à l'administration.", permissions: ["manage_users", "manage_roles", "manage_settings"] },
    { id: "Chef de produit", name: "Chef de produit", description: "Gère le catalogue produits et les modèles de documents.", permissions: ["manage_products", "manage_templates"] },
    { id: "Manager Commercial", name: "Manager Commercial", description: "Supervise les appels d'offres et l'activité commerciale.", permissions: ["view_all_offers", "view_reports"] },
    { id: "Commercial AO", name: "Commercial AO", description: "Travaille sur les appels d'offres.", permissions: ["manage_own_offers", "generate_documents"] },
    { id: "Avant-vente", name: "Avant-vente", description: "Supporte la création des réponses aux AO.", permissions: ["view_offers", "generate_documents"] },
    { id: "Utilisateur", name: "Utilisateur", description: "Accès de base à la consultation.", permissions: ["view_library"] },
  ];
};

// --- Fonctions pour la Gestion des Catégories de la Bibliothèque (Admin) ---
// (Déjà en partie dans LibraryService, mais pourrait être centralisé ici pour l'admin)

export interface LibraryCategory {
  id?: string;
  name: string;
  description?: string;
  created_by_id?: string;
  created_at?: string;
  updated_at?: string;
}

export const getLibraryCategories = async (): Promise<LibraryCategory[]> => {
    const { data, error } = await supabase.from("library_categories").select("*").order("name");
    if (error) throw error;
    return data || [];
};

export const createLibraryCategory = async (categoryData: Omit<LibraryCategory, "id" | "created_by_id" | "created_at" | "updated_at">): Promise<LibraryCategory | null> => {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !sessionData.session) throw new Error("Utilisateur non authentifié.");
    const userId = sessionData.session.user.id;

    const payload = { ...categoryData, created_by_id: userId };
    const { data, error } = await supabase.from("library_categories").insert([payload]).select().single();
    if (error) throw error;
    return data;
};

export const updateLibraryCategory = async (categoryId: string, categoryData: Partial<Omit<LibraryCategory, "id" | "created_by_id" | "created_at">>): Promise<LibraryCategory | null> => {
    const { data, error } = await supabase.from("library_categories").update(categoryData).eq("id", categoryId).select().single();
    if (error) throw error;
    return data;
};

export const deleteLibraryCategory = async (categoryId: string): Promise<void> => {
    const { error } = await supabase.from("library_categories").delete().eq("id", categoryId);
    if (error) throw error;
};

// TODO: Ajouter des fonctions pour d'autres configurations globales (ex: paramètres de l'application)

