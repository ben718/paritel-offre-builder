
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import { ProductCardProps } from "./ProductCard";

type SelectableProductCardProps = ProductCardProps & {
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onViewDetails?: (id: number) => void;
  isSelected: boolean;
  onSelectionChange: (id: number, isSelected: boolean) => void;
};

export const SelectableProductCard = ({
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
  onEdit,
  onDelete,
  onViewDetails,
  isSelected,
  onSelectionChange
}: SelectableProductCardProps) => {
  return (
    <Card className="overflow-hidden h-full flex flex-col relative">
      <div className="absolute top-2 right-2 z-10">
        <Checkbox 
          checked={isSelected}
          onCheckedChange={(checked) => onSelectionChange(id, !!checked)}
          className="h-5 w-5 bg-white border-gray-300 rounded"
          aria-label={`Sélectionner ${name}`}
        />
      </div>
      <div className="relative h-48 bg-paritel-lightgray">
        <div className="absolute top-2 left-2">
          <Badge className="bg-paritel-primary text-white">{category}</Badge>
          {subcategory && (
            <Badge className="ml-1 bg-paritel-secondary text-white">{subcategory}</Badge>
          )}
        </div>
        {partner && (
          <div className="absolute top-10 right-2">
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
            {specs.slice(0, 3).map((spec, i) => (
              <li key={i}>{spec}</li>
            ))}
            {specs.length > 3 && (
              <li className="text-xs text-paritel-primary">
                +{specs.length - 3} autres spécifications
              </li>
            )}
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
          {onEdit && onDelete ? (
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onEdit(id)}
              >
                <Edit className="h-4 w-4 mr-1" />
                Modifier
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Supprimer
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
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
            >
              <Eye className="h-4 w-4 mr-2" />
              Détails
            </Button>
          )}
          <Button 
            variant="default" 
            size="sm" 
            className="bg-paritel-primary"
            onClick={onViewDetails ? () => onViewDetails(id) : undefined}
          >
            Détails
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
