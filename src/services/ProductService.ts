
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
      imageUrl: product.image_url,
      price: product.price || 0,
      category: product.category,
      subcategory: product.subcategory || '',
      tags: product.tags || [],
      featured: product.featured || false,
      rating: product.rating || 0,
    }));
  }

  static async saveProduct(product: Partial<ProductCardProps>): Promise<string | null> {
    // Handle image upload if there's a new image (base64 string)
    let imageUrl = product.imageUrl;

    // Check if imageUrl is a base64 string (new upload)
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

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(`products/${imageId}`);

      imageUrl = publicUrl;
    }

    // Save the product data
    const { data, error } = await supabase.from('products').insert({
      name: product.name,
      description: product.description,
      image_url: imageUrl,
      price: product.price || 0,
      category: product.category,
      subcategory: product.subcategory,
      tags: product.tags,
      featured: product.featured || false,
      rating: product.rating || 0,
    }).select();

    if (error) {
      console.error('Error saving product:', error);
      return null;
    }

    return data[0].id;
  }

  static async updateProduct(id: number, product: Partial<ProductCardProps>): Promise<boolean> {
    // Handle image upload if there's a new image (base64 string)
    let imageUrl = product.imageUrl;

    // Check if imageUrl is a base64 string (new upload)
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

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(`products/${imageId}`);

      imageUrl = publicUrl;
    }

    // Update the product data
    const { error } = await supabase
      .from('products')
      .update({
        name: product.name,
        description: product.description,
        image_url: imageUrl,
        price: product.price || 0,
        category: product.category,
        subcategory: product.subcategory,
        tags: product.tags,
        featured: product.featured || false,
        rating: product.rating || 0,
      })
      .eq('id', id);

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
      .eq('id', id);

    if (error) {
      console.error('Error deleting product:', error);
      return false;
    }

    return true;
  }

  // Helper function to convert base64 to file
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

  // Helper function to get content type from base64
  private static getContentTypeFromBase64(base64String: string): string {
    return base64String.match(/:(.*?);/)?.[1] || 'image/jpeg';
  }
}
