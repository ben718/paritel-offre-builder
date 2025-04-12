
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export type ProductCardProps = {
  id: number;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  partner?: string;
  tags: string[];
  pricing?: string;
  image: string;
  specs?: string[];
};

export const ProductCard = ({
  id,
  name,
  description,
  category,
  subcategory,
  partner,
  tags,
  pricing,
  image,
  specs,
}: ProductCardProps) => {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative h-48 bg-paritel-lightgray">
        <div className="absolute top-2 left-2">
          <Badge className="bg-paritel-primary text-white">{category}</Badge>
          {subcategory && (
            <Badge className="ml-1 bg-paritel-secondary text-white">{subcategory}</Badge>
          )}
        </div>
        {partner && (
          <div className="absolute top-2 right-2">
            <Badge variant="outline" className="bg-white border-paritel-primary">
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
      <CardContent className="p-4 flex-1 flex flex-col">
        <h3 className="font-medium text-lg mb-1">{name}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{description}</p>
        
        {specs && specs.length > 0 && (
          <ul className="text-sm text-gray-700 mb-3 list-disc pl-5">
            {specs.map((spec, i) => (
              <li key={i}>{spec}</li>
            ))}
          </ul>
        )}
        
        <div className="flex flex-wrap gap-1 mb-3">
          {tags.map((tag, i) => (
            <Badge key={i} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        {pricing && (
          <div className="text-sm text-gray-700 mb-2">
            À partir de <span className="font-semibold text-paritel-primary">{pricing}</span>
          </div>
        )}
        
        <div className="flex justify-between mt-auto pt-3">
          <Button variant="outline" size="sm">
            Détails
          </Button>
          <Button variant="default" size="sm" className="bg-paritel-primary">
            Ajouter
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
