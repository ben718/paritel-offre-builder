
import { supabase } from '@/integrations/supabase/client';
import type { ProductCardProps } from '@/components/products/ProductCard';
import { v4 as uuidv4 } from 'uuid';

export class ProductService {
  static async getAllProducts(): Promise<ProductCardProps[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*');

    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }

    return data.map((product) => ({
      id: parseInt(product.id),
      name: product.name,
      description: product.description || '',
      image: product.image_url || '',
      category: product.category,
      subcategory: product.subcategory || '',
      tags: product.tags || [],
      partner: '',
      specs: Array.isArray(product.specs) ? product.specs : []
    }));
  }

  static async saveProduct(product: Partial<ProductCardProps>): Promise<string | null> {
    let imageUrl = product.image;

    if (typeof imageUrl === 'string' && imageUrl.startsWith('data:image')) {
      const imageId = uuidv4();
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('images')
        .upload(`products/${imageId}`, this.convertBase64ToFile(imageUrl), {
          contentType: this.getContentTypeFromBase64(imageUrl),
        });

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        return null;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(`products/${imageId}`);

      imageUrl = publicUrl;
    }

    const { data, error } = await supabase.from('products').insert({
      name: product.name,
      description: product.description,
      image_url: imageUrl,
      category: product.category,
      subcategory: product.subcategory,
      tags: product.tags,
      specs: product.specs || []
    }).select();

    if (error) {
      console.error('Error saving product:', error);
      return null;
    }

    return data[0].id;
  }

  static async updateProduct(id: number, product: Partial<ProductCardProps>): Promise<boolean> {
    let imageUrl = product.image;

    if (typeof imageUrl === 'string' && imageUrl.startsWith('data:image')) {
      const imageId = uuidv4();
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('images')
        .upload(`products/${imageId}`, this.convertBase64ToFile(imageUrl), {
          contentType: this.getContentTypeFromBase64(imageUrl),
        });

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        return false;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(`products/${imageId}`);

      imageUrl = publicUrl;
    }

    const { error } = await supabase
      .from('products')
      .update({
        name: product.name,
        description: product.description,
        image_url: imageUrl,
        category: product.category,
        subcategory: product.subcategory,
        tags: product.tags,
        specs: product.specs || []
      })
      .eq('id', id.toString());

    if (error) {
      console.error('Error updating product:', error);
      return false;
    }

    return true;
  }

  static async deleteProduct(id: number): Promise<boolean> {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id.toString());

    if (error) {
      console.error('Error deleting product:', error);
      return false;
    }

    return true;
  }

  private static convertBase64ToFile(base64String: string): Blob {
    const arr = base64String.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  private static getContentTypeFromBase64(base64String: string): string {
    return base64String.match(/:(.*?);/)?.[1] || 'image/jpeg';
  }
}
