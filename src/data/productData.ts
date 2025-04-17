
import { ProductCardProps } from "@/components/products/ExtendedProductType";
import { fetchProducts } from "@/services/ProductService";

// Remove hardcoded products and only load them from the database
export const products: ProductCardProps[] = [];

// Helper function to load products from the database
export const loadProducts = async (): Promise<ProductCardProps[]> => {
  console.log("Loading products from database...");
  return await fetchProducts();
};

export default products;
