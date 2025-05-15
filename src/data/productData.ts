
import { ProductCardProps } from "@/components/products/ExtendedProductType";
import { getProducts, Product } from "@/services/ProductService";

// Remove hardcoded products and only load them from the database
export const products: ProductCardProps[] = [];

// Helper function to load products from the database
export const loadProducts = async (): Promise<ProductCardProps[]> => {
  console.log("Loading products from database...");
  const { products: fetched, count } = await getProducts(undefined, 1, 1000); // Load up to 1000 products
  // TODO: Map 'Product' to 'ProductCardProps' if necessary, or adjust ProductCardProps
  return fetched as ProductCardProps[]; // This might need adjustment based on actual types
};

export default products;
