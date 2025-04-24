
import { supabase } from '@/integrations/supabase/client';

export type UserStatus = 'active' | 'inactive' | 'pending';

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

// Récupérer tous les utilisateurs
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

// Récupérer un utilisateur par ID
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

// Créer un nouvel utilisateur
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

// Mettre à jour un utilisateur existant
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

// Supprimer un utilisateur
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

// Mettre à jour le statut d'un utilisateur
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
