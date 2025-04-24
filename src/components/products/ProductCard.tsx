import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import OptimizedImage from '@/components/ui/optimized-image';
import LoadingSpinner from '@/components/ui/loading-spinner';

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
  onViewDetails?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
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
  onViewDetails,
  onEdit,
  onDelete,
  price,
  discountPrice,
}: ProductCardProps) => {
  const truncateDescription = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };
  
  return (
    <Card 
      className="h-full flex flex-col overflow-hidden hover:shadow-md transition-shadow duration-300"
      tabIndex={0}
      role="article"
      aria-label={`Produit : ${name}`}
    >
      <div 
        className="relative bg-gray-100 aspect-video flex items-center justify-center p-4"
        aria-hidden={!image}
      >
        <OptimizedImage
          src={image}
          alt={name}
          className="max-h-32 object-contain"
          width={200}
          height={150}
          loadingComponent={<LoadingSpinner size="md" />}
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
            <Badge className="bg-paritel-primary text-xs">
              {category}
            </Badge>
            {subcategory && (
              <Badge className="bg-gray-200 text-gray-700 text-xs">
                {subcategory}
              </Badge>
            )}
          </div>
          <h3 className="font-medium text-base line-clamp-1">
            {name}
          </h3>
          <p 
            className="text-muted-foreground text-sm mt-1 line-clamp-2"
            aria-label="Description"
          >
            {truncateDescription(description)}
          </p>
          
          {price !== undefined && (
            <div 
              className="mt-3"
              aria-label={`Prix : ${discountPrice || price}€`}
            >
              {discountPrice !== undefined ? (
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold">{discountPrice}€</span>
                  <span 
                    className="text-sm text-muted-foreground line-through"
                    aria-label="Prix initial"
                  >
                    {price}€
                  </span>
                </div>
              ) : (
                <span className="text-lg font-bold">{price}€</span>
              )}
            </div>
          )}
        </div>
        
        <div className="mt-4 pt-3 border-t flex justify-between gap-2 flex-wrap sm:flex-nowrap">
          {onViewDetails ? (
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 min-w-[120px]"
              onClick={onViewDetails}
            >
              Détails
            </Button>
          ) : onSelect && (
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 min-w-[120px]"
              onClick={() => onSelect({ id, name, description, category, subcategory, image, partner, tags })}
            >
              Détails
            </Button>
          )}
          
          {onEdit && (
            <Button 
              variant="outline"
              size="sm"
              className="flex-1 min-w-[120px]"
              onClick={onEdit}
            >
              Modifier
            </Button>
          )}
          
          {onDelete && (
            <Button
              variant="destructive"
              size="sm"
              className="flex-1 min-w-[120px]"
              onClick={onDelete}
              aria-label={`Supprimer ${name}`}
            >
              Supprimer
            </Button>
          )}
          
          {onAddToOffer && (
            <Button 
              variant="default" 
              size="sm"
              className="flex-1 min-w-[120px] bg-paritel-primary hover:bg-paritel-primary/90"
              onClick={() => onAddToOffer({ id, name, description, category, subcategory, image, partner, tags })}
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
