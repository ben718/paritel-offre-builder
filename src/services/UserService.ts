
import { supabase } from '@/integrations/supabase/client';

export type UserData = {
  id: string;
  full_name: string;
  email: string;
  role: string;
  department?: string;
  position?: string;
  phone?: string;
  last_login?: string;
  created_at?: string;
  updated_at?: string;
  status?: string;  // Added to match table schema
}

// Récupérer tous les utilisateurs
export const fetchUsers = async (): Promise<UserData[]> => {
  try {
    const { data, error } = await supabase
      .from('app_users')
      .select('*')
      .order('full_name');

    if (error) {
      console.error('Error fetching users:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in fetchUsers:', error);
    return [];
  }
};

// Récupérer un utilisateur par ID
export const fetchUserById = async (userId: string): Promise<UserData | null> => {
  try {
    const { data, error } = await supabase
      .from('app_users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in fetchUserById:', error);
    return null;
  }
};

// Créer un nouvel utilisateur - Assurons-nous que l'ID est fourni
export const createUser = async (userData: Omit<UserData, 'created_at' | 'updated_at'> & { id: string }): Promise<UserData | null> => {
  try {
    // Insérer les données de l'utilisateur avec le champ ID requis
    const { data, error } = await supabase
      .from('app_users')
      .insert(userData)
      .select()
      .single();

    if (error) {
      console.error('Error creating user:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in createUser:', error);
    return null;
  }
};

// Mettre à jour un utilisateur existant
export const updateUser = async (userId: string, userData: Partial<Omit<UserData, 'id' | 'created_at' | 'updated_at'>>): Promise<UserData | null> => {
  try {
    const { data, error } = await supabase
      .from('app_users')
      .update(userData)
      .eq('id', userId)
      .select()
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

// Supprimer un utilisateur
export const deleteUser = async (userId: string): Promise<boolean> => {
  try {
    // Dans un système de production, on voudra peut-être désactiver l'utilisateur plutôt que le supprimer
    const { error } = await supabase
      .from('app_users')
      .delete()
      .eq('id', userId);

    if (error) {
      console.error('Error deleting user:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteUser:', error);
    return false;
  }
};

// Mettre à jour le statut d'un utilisateur (actif, inactif, en attente)
export const updateUserStatus = async (userId: string, status: 'active' | 'inactive' | 'pending'): Promise<boolean> => {
  try {
    // Update user with status field
    const { error } = await supabase
      .from('app_users')
      .update({ status }) // Status field is now in the UserData type
      .eq('id', userId);

    if (error) {
      console.error('Error updating user status:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in updateUserStatus:', error);
    return false;
  }
};
