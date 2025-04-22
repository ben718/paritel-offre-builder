
import { supabase } from '@/integrations/supabase/client';

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

export interface SecurityPreferences {
  id: string;
  user_id: string;
  two_factor_auth: boolean;
  password_expiry: number;
  login_attempts: number;
  session_timeout: number;
  ip_restriction: boolean;
}

// Récupérer les paramètres de l'entreprise
export const fetchCompanySettings = async (): Promise<CompanySettings | null> => {
  try {
    const { data, error } = await supabase
      .from('company_settings')
      .select('*')
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    
    // If no settings exist, create a default entry
    if (!data || error?.code === 'PGRST116') {
      const defaultSettings = {
        name: 'Mon Entreprise',
        email: 'contact@monentreprise.com',
        phone: '',
        website: '',
        address: '',
        description: '',
        logo_url: ''
      };
      
      const { data: newData, error: insertError } = await supabase
        .from('company_settings')
        .insert([defaultSettings])
        .select()
        .single();
        
      if (insertError) throw insertError;
      return newData;
    }

    return data;
  } catch (error) {
    console.error('Error fetching company settings:', error);
    return null;
  }
};

// Mettre à jour les paramètres de l'entreprise
export const updateCompanySettings = async (settings: Partial<CompanySettings>): Promise<CompanySettings | null> => {
  try {
    // Check if settings exist first
    const { data: existingData, error: checkError } = await supabase
      .from('company_settings')
      .select('id')
      .single();
      
    if (checkError && checkError.code === 'PGRST116') {
      // No settings exist, create a new entry
      const { data: newData, error: insertError } = await supabase
        .from('company_settings')
        .insert([{
          name: settings.name || 'Mon Entreprise',
          email: settings.email || 'contact@monentreprise.com',
          phone: settings.phone || '',
          website: settings.website || '',
          address: settings.address || '',
          description: settings.description || '',
          logo_url: settings.logo_url || ''
        }])
        .select()
        .single();
        
      if (insertError) throw insertError;
      return newData;
    } else if (checkError) {
      throw checkError;
    }
    
    // Settings exist, update them
    const { data, error } = await supabase
      .from('company_settings')
      .update(settings)
      .eq('id', existingData.id)
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
        .insert([{ 
          user_id: userId,
          email_notifications: true,
          offer_created: true,
          offer_accepted: true,
          offer_rejected: true,
          new_comment: true,
          daily_digest: false,
          weekly_report: true
        }])
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
    // Check if preferences exist first
    const { data: existingData, error: checkError } = await supabase
      .from('user_notification_preferences')
      .select('id')
      .eq('user_id', userId)
      .single();
      
    if (checkError && checkError.code === 'PGRST116') {
      // No preferences exist, create a new entry
      const newPreferences = {
        user_id: userId,
        email_notifications: preferences.email_notifications ?? true,
        offer_created: preferences.offer_created ?? true,
        offer_accepted: preferences.offer_accepted ?? true,
        offer_rejected: preferences.offer_rejected ?? true,
        new_comment: preferences.new_comment ?? true,
        daily_digest: preferences.daily_digest ?? false,
        weekly_report: preferences.weekly_report ?? true
      };
      
      const { data: newData, error: insertError } = await supabase
        .from('user_notification_preferences')
        .insert([newPreferences])
        .select()
        .single();
        
      if (insertError) throw insertError;
      return newData;
    } else if (checkError) {
      throw checkError;
    }
    
    // Preferences exist, update them
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
        .insert([{ 
          user_id: userId,
          language: 'fr',
          dark_mode: false,
          auto_save: true,
          auto_logout: 30,
          data_retention: 365
        }])
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
    // Check if preferences exist first
    const { data: existingData, error: checkError } = await supabase
      .from('user_system_preferences')
      .select('id')
      .eq('user_id', userId)
      .single();
      
    if (checkError && checkError.code === 'PGRST116') {
      // No preferences exist, create a new entry
      const newPreferences = {
        user_id: userId,
        language: preferences.language ?? 'fr',
        dark_mode: preferences.dark_mode ?? false,
        auto_save: preferences.auto_save ?? true,
        auto_logout: preferences.auto_logout ?? 30,
        data_retention: preferences.data_retention ?? 365
      };
      
      const { data: newData, error: insertError } = await supabase
        .from('user_system_preferences')
        .insert([newPreferences])
        .select()
        .single();
        
      if (insertError) throw insertError;
      return newData;
    } else if (checkError) {
      throw checkError;
    }
    
    // Preferences exist, update them
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

// Récupérer les préférences de sécurité de l'utilisateur (fonctionnalité fictive pour le moment)
export const fetchUserSecurityPreferences = async (userId: string): Promise<SecurityPreferences> => {
  // Retourner des préférences de sécurité par défaut
  return {
    id: '0',
    user_id: userId,
    two_factor_auth: false,
    password_expiry: 90,
    login_attempts: 5,
    session_timeout: 60,
    ip_restriction: false
  };
};

// Mettre à jour les préférences de sécurité (fonctionnalité fictive pour le moment)
export const updateSecurityPreferences = async (
  userId: string,
  preferences: Partial<SecurityPreferences>
): Promise<SecurityPreferences> => {
  console.log('Security preferences update requested:', preferences);
  
  // Simuler une mise à jour et retourner les préférences mises à jour
  return {
    id: '0',
    user_id: userId,
    two_factor_auth: preferences.two_factor_auth ?? false,
    password_expiry: preferences.password_expiry ?? 90,
    login_attempts: preferences.login_attempts ?? 5,
    session_timeout: preferences.session_timeout ?? 60,
    ip_restriction: preferences.ip_restriction ?? false
  };
};
