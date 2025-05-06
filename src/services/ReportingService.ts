
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

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

// Récupérer les données de reporting depuis la base de données
export const fetchReportingData = async (category?: string): Promise<ReportingData[]> => {
  try {
    console.log(`Fetching reporting data${category ? ` for category: ${category}` : ''}`);
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
      toast(`Erreur: ${error.message}`);
      return [];
    }

    console.log(`Fetched ${data?.length || 0} reporting data items`);
    return data || [];
  } catch (error) {
    console.error('Error in fetchReportingData:', error);
    toast(`Erreur lors de la récupération des données de reporting`);
    return [];
  }
};

// Ajouter une nouvelle donnée de reporting
export const addReportingData = async (data: Omit<ReportingData, 'id' | 'created_at' | 'created_by'>): Promise<ReportingData | null> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('Error getting user:', userError);
      toast(`Erreur d'authentification: ${userError.message}`);
      return null;
    }

    if (!userData.user) {
      console.error('No authenticated user found');
      toast(`Utilisateur non authentifié`);
      return null;
    }
    
    const reportData = {
      ...data,
      created_by: userData.user.id
    };
    
    console.log('Adding reporting data:', reportData);
    const { data: insertedData, error } = await supabase
      .from('reporting_data')
      .insert(reportData)
      .select()
      .single();

    if (error) {
      console.error('Error adding reporting data:', error);
      toast(`Erreur: ${error.message}`);
      return null;
    }

    console.log('Successfully added reporting data:', insertedData);
    toast(`Données ajoutées avec succès`);
    return insertedData;
  } catch (error) {
    console.error('Error in addReportingData:', error);
    toast(`Erreur lors de l'ajout des données`);
    return null;
  }
};

// Mettre à jour une donnée de reporting
export const updateReportingData = async (id: string, data: Partial<Omit<ReportingData, 'id' | 'created_at' | 'created_by'>>): Promise<ReportingData | null> => {
  try {
    console.log('Updating reporting data:', id, data);
    const { data: updatedData, error } = await supabase
      .from('reporting_data')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating reporting data:', error);
      toast(`Erreur: ${error.message}`);
      return null;
    }

    console.log('Successfully updated reporting data:', updatedData);
    toast(`Données mises à jour avec succès`);
    return updatedData;
  } catch (error) {
    console.error('Error in updateReportingData:', error);
    toast(`Erreur lors de la mise à jour des données`);
    return null;
  }
};

// Supprimer une donnée de reporting
export const deleteReportingData = async (id: string): Promise<boolean> => {
  try {
    console.log('Deleting reporting data:', id);
    const { error } = await supabase
      .from('reporting_data')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting reporting data:', error);
      toast(`Erreur: ${error.message}`);
      return false;
    }

    console.log('Successfully deleted reporting data');
    toast(`Données supprimées avec succès`);
    return true;
  } catch (error) {
    console.error('Error in deleteReportingData:', error);
    toast(`Erreur lors de la suppression des données`);
    return false;
  }
};

// Récupérer les catégories de reporting depuis la base de données
export const fetchReportingCategories = async (): Promise<string[]> => {
  try {
    console.log('Fetching reporting categories');
    const { data, error } = await supabase
      .from('reporting_data')
      .select('category')
      .order('category');

    if (error) {
      console.error('Error fetching reporting categories:', error);
      toast(`Erreur: ${error.message}`);
      return [];
    }

    // Supprimer les doublons
    const categories = [...new Set(data.map(item => item.category))];
    console.log('Fetched categories:', categories);
    return categories;
  } catch (error) {
    console.error('Error in fetchReportingCategories:', error);
    toast(`Erreur lors de la récupération des catégories`);
    return [];
  }
};

// Récupérer les préférences de reporting d'un utilisateur
export const fetchReportingPreferences = async (): Promise<ReportingPreference | null> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('Error getting user:', userError);
      return null;
    }
    
    if (!userData.user) {
      console.error('User not authenticated');
      return null;
    }
    
    console.log('Fetching reporting preferences for user:', userData.user.id);
    
    // Essayer de récupérer depuis localStorage (solution temporaire)
    const storedPrefs = localStorage.getItem('reporting_preferences');
    if (storedPrefs) {
      try {
        const prefs = JSON.parse(storedPrefs);
        if (prefs.userId === userData.user.id) {
          console.log('Found preferences in localStorage:', prefs);
          return {
            period: prefs.period,
            productType: prefs.productType
          };
        }
      } catch (e) {
        console.error('Error parsing stored preferences:', e);
      }
    }
    
    // Valeurs par défaut
    console.log('Using default preferences');
    return {
      period: 'month', 
      productType: 'all'
    };
  } catch (error) {
    console.error('Error in fetchReportingPreferences:', error);
    return null;
  }
};

// Sauvegarder les préférences de reporting
export const saveReportingPreferences = async (preferences: ReportingPreference): Promise<boolean> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('Error getting user:', userError);
      toast(`Erreur d'authentification: ${userError.message}`);
      return false;
    }
    
    if (!userData.user) {
      console.error('User not authenticated');
      toast(`Utilisateur non authentifié`);
      return false;
    }
    
    console.log('Saving preferences for user:', userData.user.id, preferences);
    
    // Sauvegarde les préférences en utilisant localStorage
    localStorage.setItem('reporting_preferences', JSON.stringify({
      userId: userData.user.id,
      period: preferences.period,
      productType: preferences.productType,
      updated_at: new Date().toISOString()
    }));
    
    toast(`Préférences enregistrées avec succès`);
    return true;
  } catch (error) {
    console.error('Error in saveReportingPreferences:', error);
    toast(`Erreur lors de l'enregistrement des préférences`);
    return false;
  }
};
