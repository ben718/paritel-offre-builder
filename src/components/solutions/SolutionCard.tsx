
import { Building } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye } from "lucide-react";
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

export type SolutionCardProps = {
  id: string;
  name: string;
  description: string;
  industry: string;
  products: {
    id: string;
    name: string;
    category: string;
  }[];
  image_url: string;
  recommended?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
};

const SolutionCard = ({
  id,
  name,
  description,
  industry,
  products,
  image_url,
  recommended,
  onEdit,
  onDelete
}: SolutionCardProps) => {
  return (
    <Card className={`overflow-hidden border-2 ${
      recommended ? "border-paritel-primary" : "border-gray-200"
    }`}>
      <div className="relative h-48 bg-gray-100">
        {recommended && (
          <div className="absolute top-0 right-0 bg-paritel-primary text-white px-3 py-1 text-xs font-semibold">
            Recommandé
          </div>
        )}
        <div className="absolute top-2 left-2">
          <Badge 
            className={`
              ${industry === "Hôtellerie" && "bg-industry-hotel"}
              ${industry === "Santé" && "bg-industry-health"}
              ${industry === "Entreprise" && "bg-industry-business"}
              ${industry === "Éducation" && "bg-industry-education"}
              ${industry === "Secteur Public" && "bg-industry-public"}
              text-white
            `}
          >
            {industry}
          </Badge>
        </div>
        <img
          src={image_url}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-medium text-lg mb-1">{name}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{description}</p>
        
        <div className="mb-3">
          <h4 className="text-sm font-medium mb-2">Produits inclus :</h4>
          <div className="space-y-1">
            {products.slice(0, 3).map((product) => (
              <div key={product.id} className="flex items-center text-sm">
                <Building className="h-4 w-4 mr-2" />
                <span>{product.name}</span>
              </div>
            ))}
            {products.length > 3 && (
              <div className="text-xs text-paritel-primary">
                +{products.length - 3} autres produits
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:justify-between mt-auto gap-2">
          {onEdit && onDelete ? (
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onEdit(id)}
                className="w-full sm:w-auto"
              >
                <Edit className="h-4 w-4 mr-1" />
                Modifier
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-600 border-red-200 hover:bg-red-50 w-full sm:w-auto"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Supprimer
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cette solution ?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Cette action est irréversible. La solution '{name}' sera définitivement supprimée.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={() => onDelete(id)} 
                      className="bg-red-600"
                    >
                      Supprimer
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ) : (
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              <Eye className="h-4 w-4 mr-2" />
              Détails
            </Button>
          )}
          
          <Button 
            variant="default" 
            size="sm" 
            className="bg-paritel-primary w-full sm:w-auto"
          >
            Utiliser
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SolutionCard;
