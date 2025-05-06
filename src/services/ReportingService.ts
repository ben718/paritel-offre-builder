
import { supabase } from '@/integrations/supabase/client';

export type ReportingData = {
  id: string;
  report_date: string;
  category: string;
  subcategory?: string;
  value: number;
  unit?: string;
  created_at?: string;
  created_by?: string;
}

export type ReportingPreference = {
  period: string;
  productType: string;
}

// Récupérer les données de reporting
export const fetchReportingData = async (category?: string): Promise<ReportingData[]> => {
  try {
    let query = supabase
      .from('reporting_data')
      .select('*')
      .order('report_date', { ascending: false });
    
    if (category) {
      query = query.eq('category', category);
    }
    
    const { data, error } = await query;

    if (error) {
      console.error('Error fetching reporting data:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in fetchReportingData:', error);
    return [];
  }
};

// Ajouter une nouvelle donnée de reporting
export const addReportingData = async (data: Omit<ReportingData, 'id' | 'created_at' | 'created_by'>): Promise<ReportingData | null> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    
    const reportData = {
      ...data,
      created_by: userData.user?.id
    };
    
    const { data: insertedData, error } = await supabase
      .from('reporting_data')
      .insert(reportData)
      .select()
      .single();

    if (error) {
      console.error('Error adding reporting data:', error);
      return null;
    }

    return insertedData;
  } catch (error) {
    console.error('Error in addReportingData:', error);
    return null;
  }
};

// Mettre à jour une donnée de reporting
export const updateReportingData = async (id: string, data: Partial<Omit<ReportingData, 'id' | 'created_at' | 'created_by'>>): Promise<ReportingData | null> => {
  try {
    const { data: updatedData, error } = await supabase
      .from('reporting_data')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating reporting data:', error);
      return null;
    }

    return updatedData;
  } catch (error) {
    console.error('Error in updateReportingData:', error);
    return null;
  }
};

// Supprimer une donnée de reporting
export const deleteReportingData = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('reporting_data')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting reporting data:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteReportingData:', error);
    return false;
  }
};

// Récupérer les catégories de reporting depuis la base de données
export const fetchReportingCategories = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('reporting_data')
      .select('category')
      .order('category');

    if (error) {
      console.error('Error fetching reporting categories:', error);
      return [];
    }

    // Supprimer les doublons
    const categories = [...new Set(data.map(item => item.category))];
    return categories;
  } catch (error) {
    console.error('Error in fetchReportingCategories:', error);
    return [];
  }
};

// Récupérer les préférences de reporting d'un utilisateur
export const fetchReportingPreferences = async (): Promise<ReportingPreference | null> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    
    if (!userData.user) {
      console.error('User not authenticated');
      return null;
    }
    
    // Essayer de récupérer depuis localStorage (solution temporaire)
    const storedPrefs = localStorage.getItem('reporting_preferences');
    if (storedPrefs) {
      const prefs = JSON.parse(storedPrefs);
      if (prefs.userId === userData.user.id) {
        return {
          period: prefs.period,
          productType: prefs.productType
        };
      }
    }
    
    return {
      period: 'month', // Valeur par défaut
      productType: 'all' // Valeur par défaut
    };
  } catch (error) {
    console.error('Error in fetchReportingPreferences:', error);
    return null;
  }
};

// Sauvegarder les préférences de reporting
export const saveReportingPreferences = async (preferences: ReportingPreference): Promise<boolean> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    
    if (!userData.user) {
      console.error('User not authenticated');
      return false;
    }
    
    // Sauvegarde les préférences en utilisant localStorage temporairement
    // puisque la table user_reporting_preferences n'existe pas dans le schéma
    localStorage.setItem('reporting_preferences', JSON.stringify({
      userId: userData.user.id,
      period: preferences.period,
      productType: preferences.productType,
      updated_at: new Date().toISOString()
    }));
    
    return true;
  } catch (error) {
    console.error('Error in saveReportingPreferences:', error);
    return false;
  }
};
