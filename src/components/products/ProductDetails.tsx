
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ProductCardProps } from "./ProductCard";
import { ArrowLeft, Package, Tag, Info, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

type ProductDetailsProps = {
  product: ProductCardProps;
  onBack: () => void;
  onAddToOffer?: () => void;
};

type BusinessSolution = {
  id: string;
  name: string;
  description: string;
  products: {
    id: number;
    name: string;
    category: string;
    quantity?: number;
  }[];
};

const ProductDetails = ({ product, onBack, onAddToOffer }: ProductDetailsProps) => {
  const { 
    name, 
    description, 
    category, 
    subcategory, 
    partner, 
    tags, 
    image, 
    specs,
    rating
  } = product;

  const [isAddToSolutionOpen, setIsAddToSolutionOpen] = useState(false);
  const [selectedSolution, setSelectedSolution] = useState("");
  const [availableSolutions, setAvailableSolutions] = useState<BusinessSolution[]>([]);
  const { toast } = useToast();
  
  // Load solutions from localStorage
  useEffect(() => {
    // Get solutions from localStorage or use empty array if none exist
    const storedSolutions = localStorage.getItem('businessSolutions');
    if (storedSolutions) {
      try {
        const parsedSolutions = JSON.parse(storedSolutions);
        setAvailableSolutions(parsedSolutions);
      } catch (error) {
        console.error("Error parsing stored solutions:", error);
        setAvailableSolutions([]);
      }
    } else {
      // Fallback to example solutions only if no solutions exist in localStorage
      const exampleSolutions: BusinessSolution[] = [
        { 
          id: "1", 
          name: "Solution PME", 
          description: "Solution complète pour les PME",
          products: []
        },
        { 
          id: "2", 
          name: "Solution Hôtellerie", 
          description: "Solution pour l'hôtellerie",
          products: []
        },
        { 
          id: "3", 
          name: "Solution Santé", 
          description: "Solution pour le secteur de la santé",
          products: []
        }
      ];
      setAvailableSolutions(exampleSolutions);
      localStorage.setItem('businessSolutions', JSON.stringify(exampleSolutions));
    }
  }, []);

  const handleAddToSolution = () => {
    if (!selectedSolution) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez sélectionner une solution métier."
      });
      return;
    }

    // Find the selected solution
    const solutionIndex = availableSolutions.findIndex(s => s.id === selectedSolution);
    if (solutionIndex === -1) return;
    
    const solution = availableSolutions[solutionIndex];
    
    // Check if product is already in the solution
    if (solution.products.some(p => p.id === product.id)) {
      toast({
        variant: "destructive",
        title: "Produit déjà ajouté",
        description: `${name} est déjà présent dans cette solution.`
      });
      return;
    }
    
    // Add product to solution
    const updatedSolution = {
      ...solution,
      products: [
        ...solution.products,
        { 
          id: product.id || 0, 
          name: product.name,
          category: product.category,
          quantity: 1
        }
      ]
    };
    
    // Update solutions array
    const updatedSolutions = [...availableSolutions];
    updatedSolutions[solutionIndex] = updatedSolution;
    
    // Save to localStorage
    localStorage.setItem('businessSolutions', JSON.stringify(updatedSolutions));
    setAvailableSolutions(updatedSolutions);
    
    toast({
      title: "Produit ajouté",
      description: `${name} a été ajouté à la solution "${solution.name}"`
    });
    
    setIsAddToSolutionOpen(false);
    
    // Call the original onAddToOffer if it exists
    if (onAddToOffer) {
      onAddToOffer();
    }
  };

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
            {rating !== undefined && (
              <div className="flex items-center mt-1 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < Math.round(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-600">{rating.toFixed(1)}</span>
              </div>
            )}
            <p className="text-gray-700 mt-2">{description}</p>
          </div>
          
          <div className="pt-2">
            <Button className="w-full bg-paritel-primary hover:bg-paritel-dark" onClick={() => setIsAddToSolutionOpen(true)}>
              Ajouter à une solution métier
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

      {/* Add to Solution Dialog */}
      <Dialog open={isAddToSolutionOpen} onOpenChange={setIsAddToSolutionOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ajouter à une solution métier</DialogTitle>
            <DialogDescription>
              Sélectionnez la solution métier à laquelle vous souhaitez ajouter ce produit.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Select value={selectedSolution} onValueChange={setSelectedSolution}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une solution métier" />
              </SelectTrigger>
              <SelectContent>
                {availableSolutions.length > 0 ? (
                  availableSolutions.map(solution => (
                    <SelectItem key={solution.id} value={solution.id}>
                      {solution.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-solutions">Aucune solution disponible</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddToSolutionOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleAddToSolution} className="bg-paritel-primary">
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductDetails;
