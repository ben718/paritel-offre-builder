
import { ProductCardProps } from "@/components/products/ExtendedProductType";
import { fetchProducts } from "@/services/ProductService";

// Products are now managed via Supabase
export const products: ProductCardProps[] = [];

// Helper function to load products
export const loadProducts = async (): Promise<ProductCardProps[]> => {
  console.log("Loading products from database...");
  return await fetchProducts();
};

export default products;
