
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, Edit, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export type ProductCardProps = {
  id: number;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  partner?: string;
  tags: string[];
  image: string;
  specs?: string[];
};

type ProductCardComponentProps = ProductCardProps & {
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onViewDetails?: (id: number) => void;
  isSelected?: boolean;
  onSelectionChange?: (id: number, isSelected: boolean) => void;
};

export const ProductCard = ({
  id,
  name,
  description,
  category,
  subcategory,
  partner,
  tags,
  image,
  specs,
  onEdit,
  onDelete,
  onViewDetails,
  isSelected,
  onSelectionChange
}: ProductCardComponentProps) => {
  const handleSelectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSelectionChange) {
      onSelectionChange(id, e.target.checked);
    }
  };

  return (
    <Card className="overflow-hidden h-full flex flex-col relative">
      {onSelectionChange && (
        <div className="absolute top-2 right-2 z-10">
          <input 
            type="checkbox"
            className="h-5 w-5 rounded border-gray-300 text-paritel-primary focus:ring-paritel-primary"
            checked={isSelected}
            onChange={handleSelectChange}
          />
        </div>
      )}
      <div className="relative h-40 sm:h-48 bg-paritel-lightgray">
        <div className="absolute top-2 left-2 flex flex-wrap max-w-[80%] gap-1">
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
        
        <div className="flex justify-between mt-auto pt-2 sm:pt-3">
          {onEdit && onDelete ? (
            <div className="flex space-x-1 sm:space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onEdit(id)}
                className="px-2 sm:px-3 h-8 text-xs sm:text-sm"
              >
                <Edit className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                <span className="hidden sm:inline">Modifier</span>
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-600 border-red-200 hover:bg-red-50 px-2 sm:px-3 h-8 text-xs sm:text-sm"
                  >
                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                    <span className="hidden sm:inline">Supprimer</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="max-w-[90vw] sm:max-w-lg">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ce produit ?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Cette action est irréversible. Le produit '{name}' sera définitivement supprimé.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onDelete(id)} className="bg-red-600">
                      Supprimer
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onViewDetails ? () => onViewDetails(id) : undefined}
              className="px-2 sm:px-3 h-8 text-xs sm:text-sm"
            >
              <Eye className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
              <span className="hidden sm:inline">Détails</span>
            </Button>
          )}
          <Button 
            variant="default" 
            size="sm" 
            className="bg-paritel-primary px-2 sm:px-3 h-8 text-xs sm:text-sm"
            onClick={onViewDetails ? () => onViewDetails(id) : undefined}
          >
            <span className="inline sm:hidden">Voir</span>
            <span className="hidden sm:inline">Détails</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
