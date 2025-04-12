
import { ProductCardProps } from "./ProductCard";

export interface ComparisonProduct {
  id: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  rating: number;
  specifications: Record<string, string | boolean>;
  features: string[];
  image?: string;
}

export const transformProductToComparisonProduct = (product: ProductCardProps): ComparisonProduct => {
  // Extract numeric value from pricing string (e.g., "149€" -> 149)
  const extractPrice = (pricing?: string): number => {
    if (!pricing) return 0;
    const match = pricing.match(/(\d+(?:\.\d+)?)/);
    return match ? parseFloat(match[0]) : 0;
  };

  return {
    id: product.id.toString(),
    name: product.name,
    category: product.category,
    brand: product.subcategory || '',
    price: extractPrice(product.pricing),
    rating: 4, // Default rating
    specifications: product.specs?.reduce<Record<string, string | boolean>>((acc, spec) => {
      // Simplistic approach: split at colon if exists
      const colonIndex = spec.indexOf(':');
      if (colonIndex > 0) {
        const key = spec.substring(0, colonIndex).trim();
        const value = spec.substring(colonIndex + 1).trim();
        acc[key] = value;
      } else {
        // If no colon, use the whole string as both key and value
        acc[spec] = true;
      }
      return acc;
    }, {}) || {},
    features: product.specs || [],
    image: product.image
  };
};
