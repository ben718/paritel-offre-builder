
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { ProductCardProps } from '@/components/products/ProductCard';

// Convert database product to ProductCardProps format
const mapDbProductToProductCardProps = (dbProduct: any): ProductCardProps => {
  return {
    id: String(dbProduct.id), // Convertir explicitement en string
    name: dbProduct.name,
    description: dbProduct.description || '',
    image: dbProduct.image_url || '',
    category: dbProduct.category,
    subcategory: dbProduct.subcategory || '',
    tags: dbProduct.tags || [],
    partner: '',  // Default value as it might not be in the database
    specs: dbProduct.specs ? Array.isArray(dbProduct.specs) ? dbProduct.specs : [dbProduct.specs] : [],
    rating: dbProduct.rating,
  };
};

// Fetch products from Supabase
export const fetchProducts = async (): Promise<ProductCardProps[]> => {
  try {
    console.log('Fetching products from database...');
    const { data, error } = await supabase
      .from('products')
      .select('*');

    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }

    console.log('Products fetched:', data.length);
    
    // Map database products to ProductCardProps format
    return data.map(mapDbProductToProductCardProps);
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

// Create a new product in Supabase
export const createProduct = async (product: Partial<ProductCardProps>, imageFile?: File | null): Promise<ProductCardProps | null> => {
  try {
    let imageUrl = product.image || '';

    // Upload image if provided
    if (imageFile) {
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('images')
        .upload(`products/${uuidv4()}`, imageFile);

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
      } else if (uploadData) {
        const { data: { publicUrl } } = supabase.storage
          .from('images')
          .getPublicUrl(uploadData.path);
        
        imageUrl = publicUrl;
      }
    }

    // Prepare product data for database
    const productData = {
      name: product.name,
      description: product.description,
      image_url: imageUrl,
      category: product.category,
      subcategory: product.subcategory,
      tags: product.tags,
      specs: product.specs,
      rating: product.rating
    };

    console.log('Creating product in database:', productData);

    // Insert product into database
    const { data, error } = await supabase
      .from('products')
      .insert(productData)
      .select()
      .single();

    if (error) {
      console.error('Error creating product:', error);
      return null;
    }

    console.log('Product created:', data);
    return mapDbProductToProductCardProps(data);
  } catch (error) {
    console.error('Error creating product:', error);
    return null;
  }
};

// Update an existing product in Supabase
export const updateProduct = async (productId: string, product: Partial<ProductCardProps>, imageFile?: File | null): Promise<ProductCardProps | null> => {
  try {
    let imageUrl = product.image || '';

    // Upload image if provided
    if (imageFile) {
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('images')
        .upload(`products/${uuidv4()}`, imageFile);

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
      } else if (uploadData) {
        const { data: { publicUrl } } = supabase.storage
          .from('images')
          .getPublicUrl(uploadData.path);
        
        imageUrl = publicUrl;
      }
    }

    // Prepare product data for database
    const productData = {
      name: product.name,
      description: product.description,
      image_url: imageUrl,
      category: product.category,
      subcategory: product.subcategory,
      tags: product.tags,
      specs: product.specs,
      rating: product.rating
    };

    console.log('Updating product in database:', productId, productData);

    // Update product in database
    const { data, error } = await supabase
      .from('products')
      .update(productData)
      .eq('id', productId)
      .select()
      .single();

    if (error) {
      console.error('Error updating product:', error);
      return null;
    }

    console.log('Product updated:', data);
    return mapDbProductToProductCardProps(data);
  } catch (error) {
    console.error('Error updating product:', error);
    return null;
  }
};

// Delete a product from Supabase
export const deleteProduct = async (productId: string): Promise<boolean> => {
  try {
    console.log('Deleting product from database:', productId);
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) {
      console.error('Error deleting product:', error);
      return false;
    }

    console.log('Product deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    return false;
  }
};
