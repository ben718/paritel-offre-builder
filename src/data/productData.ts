
import { ProductCardProps } from "@/components/products/ProductCard";
import { ProductService } from "@/services/ProductService";

// Les produits sont maintenant gérés via Supabase
export const products: ProductCardProps[] = [];

// Fonction d'aide pour charger les produits
export const loadProducts = async (): Promise<ProductCardProps[]> => {
  return await ProductService.getAllProducts();
};

export default products;
