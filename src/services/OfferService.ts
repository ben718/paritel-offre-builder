
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type OfferStatus = Database["public"]["Enums"]["offer_status"];

export interface Offer {
  id: string;
  customer_id: string;
  created_at: string;
  status: OfferStatus;
  notes?: string;
  total_amount?: number;
  valid_until?: string;
}

export interface OfferWithCustomer extends Offer {
  customer_name: string;
  customer_industry: string;
  contact_name: string;
}

export class OfferService {
  static async getRecentOffers(limit: number = 4): Promise<OfferWithCustomer[]> {
    const { data, error } = await supabase
      .from('offers')
      .select(`
        id,
        customer_id,
        status,
        created_at,
        notes,
        total_amount,
        valid_until,
        customers (
          company_name,
          industry,
          contact_name
        )
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching recent offers:', error);
      return [];
    }

    return data.map((offer) => ({
      id: offer.id,
      customer_id: offer.customer_id,
      created_at: offer.created_at,
      status: offer.status,
      notes: offer.notes,
      total_amount: offer.total_amount,
      valid_until: offer.valid_until,
      customer_name: offer.customers.company_name,
      customer_industry: offer.customers.industry,
      contact_name: offer.customers.contact_name || '',
    }));
  }

  static async getAllOffers(): Promise<OfferWithCustomer[]> {
    const { data, error } = await supabase
      .from('offers')
      .select(`
        id,
        customer_id,
        status,
        created_at,
        notes,
        total_amount,
        valid_until,
        customers (
          company_name,
          industry,
          contact_name
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all offers:', error);
      return [];
    }

    return data.map((offer) => ({
      id: offer.id,
      customer_id: offer.customer_id,
      created_at: offer.created_at,
      status: offer.status,
      notes: offer.notes,
      total_amount: offer.total_amount,
      valid_until: offer.valid_until,
      customer_name: offer.customers.company_name,
      customer_industry: offer.customers.industry,
      contact_name: offer.customers.contact_name || '',
    }));
  }

  static async getOfferProducts(offerId: string) {
    const { data, error } = await supabase
      .from('offer_products')
      .select(`
        id,
        quantity,
        unit_price,
        product_id,
        products (
          id,
          name,
          description,
          image_url,
          category
        )
      `)
      .eq('offer_id', offerId);

    if (error) {
      console.error('Error fetching offer products:', error);
      return [];
    }

    return data;
  }

  static async updateOfferStatus(offerId: string, status: OfferStatus): Promise<boolean> {
    const { error } = await supabase
      .from('offers')
      .update({ status })
      .eq('id', offerId);

    if (error) {
      console.error('Error updating offer status:', error);
      return false;
    }

    return true;
  }
}
