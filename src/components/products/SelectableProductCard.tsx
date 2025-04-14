
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye } from "lucide-react";
import { ProductCardProps } from "./ProductCard";

type SelectableProductCardProps = {
  product: ProductCardProps;
  selected: boolean;
  onSelect: () => void;
  disabled?: boolean;
};

export const SelectableProductCard = ({
  product,
  selected,
  onSelect,
  disabled = false
}: SelectableProductCardProps) => {
  const {
    name,
    description,
    category,
    subcategory,
    partner,
    tags,
    image,
    specs
  } = product;

  return (
    <Card className={`overflow-hidden h-full flex flex-col relative ${disabled ? 'opacity-60' : ''}`}>
      <div className="absolute top-2 right-2 z-10">
        <Checkbox 
          checked={selected}
          onCheckedChange={() => !disabled && onSelect()}
          className="h-5 w-5 bg-white border-gray-300 rounded"
          aria-label={`Sélectionner ${name}`}
          disabled={disabled}
        />
      </div>
      <div className="relative h-40 sm:h-48 bg-paritel-lightgray">
        <div className="absolute top-2 left-2 flex flex-wrap max-w-[70%] gap-1">
          <Badge className="bg-paritel-primary text-white text-xs">{category}</Badge>
          {subcategory && (
            <Badge className="bg-paritel-secondary text-white text-xs">{subcategory}</Badge>
          )}
        </div>
        {partner && (
          <div className="absolute bottom-2 right-2">
            <Badge variant="outline" className="bg-white/80 border-paritel-primary text-xs">
              {partner}
            </Badge>
          </div>
        )}
        <img
          src={image}
          alt={name}
          className="w-full h-full object-contain"
        />
      </div>
      <CardContent className="p-3 sm:p-4 flex-1 flex flex-col">
        <h3 className="font-medium text-base sm:text-lg mb-1 line-clamp-1">{name}</h3>
        <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 line-clamp-2">{description}</p>
        
        {specs && specs.length > 0 && (
          <ul className="text-xs sm:text-sm text-gray-700 mb-2 sm:mb-3 list-disc pl-4 sm:pl-5">
            {specs.slice(0, 2).map((spec, i) => (
              <li key={i} className="line-clamp-1">{spec}</li>
            ))}
            {specs.length > 2 && (
              <li className="text-xs text-paritel-primary">
                +{specs.length - 2} autres spécifications
              </li>
            )}
          </ul>
        )}
        
        <div className="flex flex-wrap gap-1 mb-2 sm:mb-3">
          {tags.slice(0, 3).map((tag, i) => (
            <Badge key={i} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {tags.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{tags.length - 3}
            </Badge>
          )}
        </div>
        
        {/* Pricing section removed */}
        
        <div className="flex justify-end mt-auto pt-2 sm:pt-3">
          <Button 
            variant="default" 
            size="sm" 
            className="bg-paritel-primary px-2 sm:px-3 h-8 text-xs sm:text-sm"
            onClick={onSelect}
            disabled={disabled}
          >
            {selected ? 'Sélectionné' : 'Sélectionner'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
