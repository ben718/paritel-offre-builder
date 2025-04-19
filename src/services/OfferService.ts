import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

// Types pour les offres et produits d'offre
export type OfferStatus = 'draft' | 'sent' | 'in_progress' | 'accepted' | 'rejected' | 'expired';

export type OfferData = {
  id: string;
  customer_id: string;
  customer_name?: string;
  customer_industry?: string;
  contact_name?: string;
  total_amount?: number;
  valid_until?: string;
  notes?: string;
  created_by: string;
  created_at?: string;
  updated_at?: string;
  status: OfferStatus;
}

export type OfferProductData = {
  id: string;
  offer_id: string;
  product_id: string;
  quantity: number;
  unit_price?: number;
  created_at?: string;
}

// Récupérer toutes les offres
export const fetchOffers = async (): Promise<OfferData[]> => {
  try {
    const { data, error } = await supabase
      .from('offers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching offers:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in fetchOffers:', error);
    return [];
  }
};

// Get all offers (alias for fetchOffers with a more descriptive name)
export const getAllOffers = async (): Promise<OfferData[]> => {
  return fetchOffers();
};

// Récupérer les offres récentes (limité à un nombre spécifique)
export const getRecentOffers = async (limit: number = 5): Promise<OfferData[]> => {
  try {
    const { data, error } = await supabase
      .from('offers')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching recent offers:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getRecentOffers:', error);
    return [];
  }
};

// Récupérer une offre par ID
export const fetchOfferById = async (offerId: string): Promise<OfferData | null> => {
  try {
    const { data, error } = await supabase
      .from('offers')
      .select('*')
      .eq('id', offerId)
      .single();

    if (error) {
      console.error('Error fetching offer:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in fetchOfferById:', error);
    return null;
  }
};

// Récupérer les produits d'une offre
export const fetchOfferProducts = async (offerId: string): Promise<OfferProductData[]> => {
  try {
    const { data, error } = await supabase
      .from('offer_products')
      .select('*')
      .eq('offer_id', offerId);

    if (error) {
      console.error('Error fetching offer products:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in fetchOfferProducts:', error);
    return [];
  }
};

// Créer une nouvelle offre
export const createOffer = async (offerData: Omit<OfferData, 'id' | 'created_at' | 'updated_at'> & { customer_id: string }): Promise<OfferData | null> => {
  try {
    const newOffer = {
      ...offerData,
      id: uuidv4(),
    };

    const { data, error } = await supabase
      .from('offers')
      .insert(newOffer)
      .select()
      .single();

    if (error) {
      console.error('Error creating offer:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in createOffer:', error);
    return null;
  }
};

// Ajouter un produit à une offre
export const addProductToOffer = async (productData: Omit<OfferProductData, 'id' | 'created_at'>): Promise<OfferProductData | null> => {
  try {
    const { data, error } = await supabase
      .from('offer_products')
      .insert({
        ...productData,
        id: uuidv4()
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding product to offer:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in addProductToOffer:', error);
    return null;
  }
};

// Mettre à jour une offre existante
export const updateOffer = async (offerId: string, offerData: Partial<Omit<OfferData, 'id' | 'created_at' | 'updated_at'>>): Promise<OfferData | null> => {
  try {
    const { data, error } = await supabase
      .from('offers')
      .update(offerData)
      .eq('id', offerId)
      .select()
      .single();

    if (error) {
      console.error('Error updating offer:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in updateOffer:', error);
    return null;
  }
};

// Mettre à jour le statut d'une offre
export const updateOfferStatus = async (offerId: string, status: OfferStatus): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('offers')
      .update({ status })
      .eq('id', offerId);

    if (error) {
      console.error('Error updating offer status:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in updateOfferStatus:', error);
    return false;
  }
};

// Supprimer une offre
export const deleteOffer = async (offerId: string): Promise<boolean> => {
  try {
    // Supprimer les produits associés à l'offre d'abord
    const { error: productsError } = await supabase
      .from('offer_products')
      .delete()
      .eq('offer_id', offerId);

    if (productsError) {
      console.error('Error deleting offer products:', productsError);
      return false;
    }

    // Ensuite supprimer l'offre
    const { error } = await supabase
      .from('offers')
      .delete()
      .eq('id', offerId);

    if (error) {
      console.error('Error deleting offer:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteOffer:', error);
    return false;
  }
};

// Calculer le montant total d'une offre
export const calculateOfferTotal = async (offerId: string): Promise<number> => {
  try {
    const { data, error } = await supabase
      .from('offer_products')
      .select('quantity, unit_price')
      .eq('offer_id', offerId);

    if (error) {
      console.error('Error calculating offer total:', error);
      return 0;
    }

    const total = (data || []).reduce((sum, product) => {
      return sum + (product.quantity * (product.unit_price || 0));
    }, 0);

    return total;
  } catch (error) {
    console.error('Error in calculateOfferTotal:', error);
    return 0;
  }
};
