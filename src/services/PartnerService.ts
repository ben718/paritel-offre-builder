
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

// Type pour les partenaires
export type Partner = {
  id: string;
  name: string;
  description: string;
  industry: string | null;
  logo_url: string | null;
  website_url: string | null;
  created_at?: string;
  updated_at?: string;
}

// Récupérer tous les partenaires
export const fetchPartners = async (): Promise<Partner[]> => {
  try {
    const { data, error } = await supabase
      .from('partners')
      .select('*');

    if (error) {
      console.error('Error fetching partners:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in fetchPartners:', error);
    return [];
  }
};

// Créer un nouveau partenaire
export const createPartner = async (partner: Partial<Partner>, logoFile?: File | null): Promise<Partner | null> => {
  try {
    let logoUrl = partner.logo_url || '';

    // Upload du logo si fourni
    if (logoFile) {
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('images')
        .upload(`partners/${uuidv4()}`, logoFile);

      if (uploadError) {
        console.error('Error uploading logo:', uploadError);
      } else if (uploadData) {
        const { data: { publicUrl } } = supabase.storage
          .from('images')
          .getPublicUrl(uploadData.path);
        
        logoUrl = publicUrl;
      }
    }

    // Préparation des données du partenaire
    const partnerData = {
      name: partner.name,
      description: partner.description,
      industry: partner.industry,
      logo_url: logoUrl,
      website_url: partner.website_url
    };

    // Insertion du partenaire dans la BDD
    const { data, error } = await supabase
      .from('partners')
      .insert(partnerData)
      .select()
      .single();

    if (error) {
      console.error('Error creating partner:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in createPartner:', error);
    return null;
  }
};

// Mettre à jour un partenaire
export const updatePartner = async (partnerId: string, partner: Partial<Partner>, logoFile?: File | null): Promise<Partner | null> => {
  try {
    let logoUrl = partner.logo_url || '';

    // Upload du logo si fourni
    if (logoFile) {
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('images')
        .upload(`partners/${uuidv4()}`, logoFile);

      if (uploadError) {
        console.error('Error uploading logo:', uploadError);
      } else if (uploadData) {
        const { data: { publicUrl } } = supabase.storage
          .from('images')
          .getPublicUrl(uploadData.path);
        
        logoUrl = publicUrl;
      }
    }

    // Préparation des données du partenaire
    const partnerData = {
      name: partner.name,
      description: partner.description,
      industry: partner.industry,
      logo_url: logoUrl,
      website_url: partner.website_url
    };

    // Mise à jour du partenaire dans la BDD
    const { data, error } = await supabase
      .from('partners')
      .update(partnerData)
      .eq('id', partnerId)
      .select()
      .single();

    if (error) {
      console.error('Error updating partner:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in updatePartner:', error);
    return null;
  }
};

// Supprimer un partenaire
export const deletePartner = async (partnerId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('partners')
      .delete()
      .eq('id', partnerId);

    if (error) {
      console.error('Error deleting partner:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deletePartner:', error);
    return false;
  }
};

// Récupérer les produits associés à un partenaire
export const fetchPartnerProducts = async (partnerId: string): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('product_partners')
      .select('product_id')
      .eq('partner_id', partnerId);

    if (error) {
      console.error('Error fetching partner products:', error);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Récupérer les détails des produits
    const productIds = data.map(item => item.product_id);
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .in('id', productIds);

    if (productsError) {
      console.error('Error fetching products details:', productsError);
      return [];
    }

    return products || [];
  } catch (error) {
    console.error('Error in fetchPartnerProducts:', error);
    return [];
  }
};
