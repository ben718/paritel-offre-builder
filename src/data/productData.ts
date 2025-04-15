
import { ProductCardProps } from "@/components/products/ProductCard";
import { ProductService } from "@/services/ProductService";

// Products are now managed via Supabase
export const products: ProductCardProps[] = [];

// Helper function to load products
export const loadProducts = async (): Promise<ProductCardProps[]> => {
  return await ProductService.getAllProducts();
};

export default products;
