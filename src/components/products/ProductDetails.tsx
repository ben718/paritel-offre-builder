
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ProductCardProps } from "./ProductCard";
import { ArrowLeft, Package, Tag, Info, DollarSign } from "lucide-react";

type ProductDetailsProps = {
  product: ProductCardProps;
  onBack: () => void;
  onAddToOffer?: () => void;
};

const ProductDetails = ({ product, onBack, onAddToOffer }: ProductDetailsProps) => {
  const { 
    name, 
    description, 
    category, 
    subcategory, 
    partner, 
    tags, 
    pricing, 
    image, 
    specs 
  } = product;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <Button variant="outline" size="sm" onClick={onBack} className="mb-2">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Retour
      </Button>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center p-6 h-64 md:h-auto">
          <img 
            src={image} 
            alt={name} 
            className="max-w-full max-h-full object-contain"
          />
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge className="bg-paritel-primary text-white">{category}</Badge>
              {subcategory && (
                <Badge className="bg-paritel-secondary text-white">{subcategory}</Badge>
              )}
              {partner && (
                <Badge variant="outline" className="border-paritel-primary">
                  Partenaire: {partner}
                </Badge>
              )}
            </div>
            <h1 className="text-2xl font-bold">{name}</h1>
            <p className="text-gray-700 mt-2">{description}</p>
          </div>
          
          {pricing && (
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-paritel-primary mr-2" />
              <span className="text-lg font-medium">
                Prix  <span className="text-paritel-primary font-semibold">{pricing}</span>
              </span>
            </div>
          )}
          
          <div className="pt-2">
            <Button className="w-full bg-paritel-primary hover:bg-paritel-dark" onClick={onAddToOffer}>
              Ajouter à l'offre
            </Button>
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {specs && specs.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center">
              <Info className="h-5 w-5 text-paritel-primary mr-2" />
              <h2 className="text-xl font-semibold">Spécifications</h2>
            </div>
            <ul className="space-y-2 pl-6 list-disc">
              {specs.map((spec, i) => (
                <li key={i} className="text-gray-700">{spec}</li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="space-y-3">
          {tags && tags.length > 0 && (
            <div>
              <div className="flex items-center mb-3">
                <Tag className="h-5 w-5 text-paritel-primary mr-2" />
                <h2 className="text-xl font-semibold">Tags</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, i) => (
                  <Badge key={i} variant="secondary" className="text-sm">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {partner && (
            <div className="mt-6">
              <div className="flex items-center mb-3">
                <Package className="h-5 w-5 text-paritel-primary mr-2" />
                <h2 className="text-xl font-semibold">Partenaire</h2>
              </div>
              <p className="text-gray-700">{partner}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
