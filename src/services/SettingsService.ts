
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

export interface CompanySettings {
  id: string;
  name: string;
  email: string;
  phone?: string;
  website?: string;
  address?: string;
  description?: string;
  logo_url?: string;
}

export interface NotificationPreferences {
  id: string;
  user_id: string;
  email_notifications: boolean;
  offer_created: boolean;
  offer_accepted: boolean;
  offer_rejected: boolean;
  new_comment: boolean;
  daily_digest: boolean;
  weekly_report: boolean;
}

export interface SystemPreferences {
  id: string;
  user_id: string;
  language: string;
  dark_mode: boolean;
  auto_save: boolean;
  auto_logout: number;
  data_retention: number;
}

// Récupérer les paramètres de l'entreprise
export const fetchCompanySettings = async (): Promise<CompanySettings | null> => {
  try {
    const { data, error } = await supabase
      .from('company_settings')
      .select('*')
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching company settings:', error);
    return null;
  }
};

// Mettre à jour les paramètres de l'entreprise
export const updateCompanySettings = async (settings: Partial<CompanySettings>): Promise<CompanySettings | null> => {
  try {
    const { data, error } = await supabase
      .from('company_settings')
      .update(settings)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating company settings:', error);
    return null;
  }
};

// Récupérer les préférences de notification de l'utilisateur
export const fetchUserNotificationPreferences = async (userId: string): Promise<NotificationPreferences | null> => {
  try {
    const { data, error } = await supabase
      .from('user_notification_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    
    if (!data) {
      // Create default preferences if none exist
      const { data: newData, error: insertError } = await supabase
        .from('user_notification_preferences')
        .insert([{ user_id: userId }])
        .select()
        .single();

      if (insertError) throw insertError;
      return newData;
    }

    return data;
  } catch (error) {
    console.error('Error fetching notification preferences:', error);
    return null;
  }
};

// Mettre à jour les préférences de notification
export const updateNotificationPreferences = async (
  userId: string,
  preferences: Partial<NotificationPreferences>
): Promise<NotificationPreferences | null> => {
  try {
    const { data, error } = await supabase
      .from('user_notification_preferences')
      .update(preferences)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating notification preferences:', error);
    return null;
  }
};

// Récupérer les préférences système de l'utilisateur
export const fetchUserSystemPreferences = async (userId: string): Promise<SystemPreferences | null> => {
  try {
    const { data, error } = await supabase
      .from('user_system_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    
    if (!data) {
      // Create default preferences if none exist
      const { data: newData, error: insertError } = await supabase
        .from('user_system_preferences')
        .insert([{ user_id: userId }])
        .select()
        .single();

      if (insertError) throw insertError;
      return newData;
    }

    return data;
  } catch (error) {
    console.error('Error fetching system preferences:', error);
    return null;
  }
};

// Mettre à jour les préférences système
export const updateSystemPreferences = async (
  userId: string,
  preferences: Partial<SystemPreferences>
): Promise<SystemPreferences | null> => {
  try {
    const { data, error } = await supabase
      .from('user_system_preferences')
      .update(preferences)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating system preferences:', error);
    return null;
  }
};
