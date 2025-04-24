
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import OptimizedImage from '@/components/ui/optimized-image';

export interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  image?: string;
  partner?: string;
  tags?: string[];
  specs?: string[];
  rating?: number;
  price?: number;
  discountPrice?: number;
  onSelect?: (product: ProductCardProps) => void;
  onAddToOffer?: (product: ProductCardProps) => void;
}

const ProductCard = ({
  id,
  name,
  description,
  category,
  subcategory,
  image = '/placeholder.svg',
  partner,
  tags,
  onSelect,
  onAddToOffer,
  price,
  discountPrice,
}: ProductCardProps) => {
  const truncateDescription = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };
  
  return (
    <Card className="h-full flex flex-col overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="relative bg-gray-100 aspect-video flex items-center justify-center p-4">
        <OptimizedImage
          src={image}
          alt={name}
          className="max-h-32 object-contain"
          width={200}
          height={150}
          loadingComponent={
            <div className="w-full h-32 bg-gray-200 animate-pulse rounded flex items-center justify-center">
              <span className="text-gray-400 text-sm">Chargement...</span>
            </div>
          }
          errorComponent={
            <div className="w-full h-32 bg-gray-100 flex items-center justify-center">
              <span className="text-gray-400 text-sm">Image non disponible</span>
            </div>
          }
        />
        
        {partner && (
          <Badge 
            variant="outline" 
            className="absolute top-3 right-3 bg-white/80 border-none text-xs"
          >
            {partner}
          </Badge>
        )}
      </div>
      <CardContent className="flex flex-col flex-grow p-4">
        <div className="flex-grow">
          <div className="flex flex-wrap gap-1 mb-2">
            <Badge className="bg-paritel-primary text-xs">{category}</Badge>
            {subcategory && (
              <Badge className="bg-gray-200 text-gray-700 text-xs">{subcategory}</Badge>
            )}
          </div>
          <h3 className="font-medium text-base line-clamp-1">{name}</h3>
          <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
            {truncateDescription(description)}
          </p>
          
          {/* Affichage du prix si disponible */}
          {price !== undefined && (
            <div className="mt-3">
              {discountPrice !== undefined ? (
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold">{discountPrice}€</span>
                  <span className="text-sm text-muted-foreground line-through">{price}€</span>
                </div>
              ) : (
                <span className="text-lg font-bold">{price}€</span>
              )}
            </div>
          )}
        </div>
        
        <div className="mt-4 pt-3 border-t flex justify-between gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onSelect?.({ id, name, description, category, subcategory, image, partner, tags })}
          >
            Détails
          </Button>
          
          {onAddToOffer && (
            <Button 
              variant="default" 
              size="sm"
              className="flex-1 bg-paritel-primary hover:bg-paritel-primary/90"
              onClick={() => onAddToOffer?.({ id, name, description, category, subcategory, image, partner, tags })}
            >
              Ajouter
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
