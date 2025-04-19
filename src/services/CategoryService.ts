
import { supabase } from '@/integrations/supabase/client';

export type Category = {
  id: string;
  name: string;
  display_name: string;
  description?: string;
  icon?: string;
  created_at?: string;
  updated_at?: string;
}

export type Subcategory = {
  id: string;
  name: string;
  display_name: string;
  description?: string;
  category_id: string;
  created_at?: string;
  updated_at?: string;
}

// Récupérer toutes les catégories
export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('display_name');

    if (error) {
      console.error('Error fetching categories:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in fetchCategories:', error);
    return [];
  }
};

// Récupérer les sous-catégories pour une catégorie spécifique
export const fetchSubcategoriesByCategory = async (categoryId: string): Promise<Subcategory[]> => {
  try {
    const { data, error } = await supabase
      .from('subcategories')
      .select('*')
      .eq('category_id', categoryId)
      .order('display_name');

    if (error) {
      console.error('Error fetching subcategories:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in fetchSubcategoriesByCategory:', error);
    return [];
  }
};

// Récupérer toutes les sous-catégories
export const fetchSubcategories = async (): Promise<Subcategory[]> => {
  try {
    const { data, error } = await supabase
      .from('subcategories')
      .select('*')
      .order('display_name');

    if (error) {
      console.error('Error fetching all subcategories:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in fetchSubcategories:', error);
    return [];
  }
};

// Créer une nouvelle catégorie
export const createCategory = async (category: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<Category | null> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .insert(category)
      .select()
      .single();

    if (error) {
      console.error('Error creating category:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in createCategory:', error);
    return null;
  }
};

// Créer une nouvelle sous-catégorie
export const createSubcategory = async (subcategory: Omit<Subcategory, 'id' | 'created_at' | 'updated_at'>): Promise<Subcategory | null> => {
  try {
    const { data, error } = await supabase
      .from('subcategories')
      .insert(subcategory)
      .select()
      .single();

    if (error) {
      console.error('Error creating subcategory:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in createSubcategory:', error);
    return null;
  }
};

// Mettre à jour une catégorie
export const updateCategory = async (id: string, category: Partial<Omit<Category, 'id' | 'created_at' | 'updated_at'>>): Promise<Category | null> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .update(category)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating category:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in updateCategory:', error);
    return null;
  }
};

// Mettre à jour une sous-catégorie
export const updateSubcategory = async (id: string, subcategory: Partial<Omit<Subcategory, 'id' | 'created_at' | 'updated_at'>>): Promise<Subcategory | null> => {
  try {
    const { data, error } = await supabase
      .from('subcategories')
      .update(subcategory)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating subcategory:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in updateSubcategory:', error);
    return null;
  }
};

// Supprimer une catégorie
export const deleteCategory = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting category:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteCategory:', error);
    return false;
  }
};

// Supprimer une sous-catégorie
export const deleteSubcategory = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('subcategories')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting subcategory:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteSubcategory:', error);
    return false;
  }
};
