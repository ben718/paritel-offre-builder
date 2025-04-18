import { supabase } from '@/integrations/supabase/client';
import type { Database } from "@/integrations/supabase/types";

type OfferStatus = Database["public"]["Enums"]["offer_status"];

export type Offer = {
  id: string;
  customer_id: string;
  customer_name?: string;
  customer_industry?: string;
  contact_name?: string;
  total_amount?: number;
  valid_until?: string;
  notes?: string;
  status: OfferStatus;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export type OfferProduct = {
  id: string;
  offer_id: string;
  product_id: string;
  quantity: number;
  unit_price?: number;
  created_at: string;
}

// Export all functions individually
export const getAllOffers = async (): Promise<Offer[]> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    
    if (!userId) {
      console.error('User not authenticated');
      return [];
    }
    
    const { data, error } = await supabase
      .from('offers')
      .select('*')
      .order('created_at', { ascending: false })
      .eq('created_by', userId);

    if (error) {
      console.error('Error fetching offers:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getAllOffers:', error);
    return [];
  }
};

export const getOfferById = async (offerId: string): Promise<Offer | null> => {
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
    console.error('Error in getOfferById:', error);
    return null;
  }
};

// Créer une nouvelle offre - FIX: Make customer_id required
export const createOffer = async (offerData: Partial<Offer> & { customer_id: string }): Promise<Offer | null> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    
    if (!userId) {
      console.error('User not authenticated');
      return null;
    }
    
    const newOffer = {
      ...offerData,
      created_by: userId,
      status: offerData.status || 'draft',
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

export const updateOffer = async (offerId: string, offerData: Partial<Offer>): Promise<Offer | null> => {
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

export const deleteOffer = async (offerId: string): Promise<boolean> => {
  try {
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

export const addProductToOffer = async (offerId: string, productId: string, quantity: number, unitPrice?: number): Promise<OfferProduct | null> => {
  try {
    const offerProduct = {
      offer_id: offerId,
      product_id: productId,
      quantity,
      unit_price: unitPrice
    };
    
    const { data, error } = await supabase
      .from('offer_products')
      .insert(offerProduct)
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

export const getOfferProducts = async (offerId: string): Promise<OfferProduct[]> => {
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
    console.error('Error in getOfferProducts:', error);
    return [];
  }
};

export const removeProductFromOffer = async (offerProductId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('offer_products')
      .delete()
      .eq('id', offerProductId);

    if (error) {
      console.error('Error removing product from offer:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in removeProductFromOffer:', error);
    return false;
  }
};

export const countOfferProducts = async (offerId: string): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from('offer_products')
      .select('*', { count: 'exact', head: true })
      .eq('offer_id', offerId);

    if (error) {
      console.error('Error counting offer products:', error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error('Error in countOfferProducts:', error);
    return 0;
  }
};

// For compatibility with existing code, export a function to get recent offers
export const getRecentOffers = async (limit: number = 4): Promise<Offer[]> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    
    if (!userId) {
      console.error('User not authenticated');
      return [];
    }
    
    const { data, error } = await supabase
      .from('offers')
      .select('*')
      .order('created_at', { ascending: false })
      .eq('created_by', userId)
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
