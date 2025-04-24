
/**
 * Service de gestion des utilisateurs
 * @module services/UserService
 */
import { supabase } from '@/integrations/supabase/client';

/**
 * Types de statut possibles pour un utilisateur
 */
export type UserStatus = 'active' | 'inactive' | 'pending';

/**
 * Structure de données d'un utilisateur
 */
export type UserData = {
  id: string;
  full_name: string;
  email: string;
  role: string;
  status?: UserStatus;
  department?: string;
  position?: string;
  phone?: string;
  last_login?: string;
  created_at?: string;
  updated_at?: string;
};

/**
 * Récupère tous les utilisateurs
 * @returns {Promise<UserData[]>} Liste des utilisateurs
 */
export const fetchUsers = async (): Promise<UserData[]> => {
  try {
    const { data, error } = await supabase
      .from('app_users')
      .select('*')
      .order('full_name', { ascending: true });

    if (error) throw error;
    return data ?? [];
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

/**
 * Récupère un utilisateur par son ID
 * @param {string} userId - ID de l'utilisateur à récupérer
 * @returns {Promise<UserData | null>} Données de l'utilisateur ou null si non trouvé
 */
export const fetchUserById = async (userId: string): Promise<UserData | null> => {
  try {
    const { data, error } = await supabase
      .from('app_users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error in fetchUserById:', error);
    return null;
  }
};

/**
 * Crée un nouvel utilisateur
 * @param {Omit<UserData, 'created_at' | 'updated_at'> & { id: string }} userData - Données du nouvel utilisateur
 * @returns {Promise<UserData | null>} Utilisateur créé ou null en cas d'erreur
 */
export const createUser = async (
  userData: Omit<UserData, 'created_at' | 'updated_at'> & { id: string }
): Promise<UserData | null> => {
  try {
    const { data, error } = await supabase
      .from('app_users')
      .insert([userData])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error in createUser:', error);
    return null;
  }
};

/**
 * Met à jour un utilisateur existant
 * @param {string} userId - ID de l'utilisateur à mettre à jour
 * @param {Partial<UserData>} userData - Données à mettre à jour
 * @returns {Promise<UserData | null>} Utilisateur mis à jour ou null en cas d'erreur
 */
export const updateUser = async (
  userId: string,
  userData: Partial<UserData>
): Promise<UserData | null> => {
  try {
    // S'assurer que nous n'envoyons que les champs valides à Supabase
    const validFields: Partial<UserData> = {};
    
    // Copier uniquement les champs qui existent dans UserData
    if ('full_name' in userData) validFields.full_name = userData.full_name;
    if ('email' in userData) validFields.email = userData.email;
    if ('role' in userData) validFields.role = userData.role;
    if ('status' in userData) validFields.status = userData.status;
    if ('department' in userData) validFields.department = userData.department;
    if ('position' in userData) validFields.position = userData.position;
    if ('phone' in userData) validFields.phone = userData.phone;
    
    const { data, error } = await supabase
      .from('app_users')
      .update(validFields)
      .eq('id', userId)
      .select('*')
      .single();

    if (error) {
      console.error('Error updating user:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in updateUser:', error);
    return null;
  }
};

/**
 * Supprime un utilisateur
 * @param {string} userId - ID de l'utilisateur à supprimer
 * @returns {Promise<boolean>} true si succès, false sinon
 */
export const deleteUser = async (userId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('app_users')
      .delete()
      .eq('id', userId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error in deleteUser:', error);
    return false;
  }
};

/**
 * Met à jour le statut d'un utilisateur
 * @param {string} userId - ID de l'utilisateur
 * @param {UserStatus} status - Nouveau statut
 * @returns {Promise<boolean>} true si succès, false sinon
 */
export const updateUserStatus = async (
  userId: string,
  status: UserStatus
): Promise<boolean> => {
  try {
    const result = await updateUser(userId, { status });
    return result !== null;
  } catch (error) {
    console.error('Error in updateUserStatus:', error);
    return false;
  }
};
