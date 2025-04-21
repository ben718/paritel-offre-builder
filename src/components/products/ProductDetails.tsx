
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ProductCardProps } from "./ProductCard";
import { ArrowLeft, Package, Tag, Info, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
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

// Update the BusinessSolution type to use string id for consistency
type BusinessSolution = {
  id: string;
  name: string;
  description: string;
  products: {
    id: string; // Changed to string for consistency
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
  const { toast } = useToast();
  
  // Fetch business solutions from database
  const { data: availableSolutions = [], isLoading } = useQuery<BusinessSolution[]>({
    queryKey: ['business-solutions'],
    queryFn: async () => {
      try {
        // Try to get solutions from localStorage first as fallback
        const storedSolutions = localStorage.getItem('businessSolutions');
        if (storedSolutions) {
          try {
            return JSON.parse(storedSolutions);
          } catch (error) {
            console.error("Error parsing stored solutions:", error);
          }
        }
        
        // If we eventually add a business_solutions table to Supabase, we'd fetch from there
        // For now, return empty array or fallback data
        return [];
      } catch (error) {
        console.error("Error fetching business solutions:", error);
        return [];
      }
    }
  });
  
  // Check for partner info from the database if partner name is provided
  const { data: partnerInfo } = useQuery({
    queryKey: ['partner', partner],
    queryFn: async () => {
      if (!partner) return null;
      
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .eq('name', partner)
        .single();
      
      if (error) {
        console.error('Error fetching partner info:', error);
        return null;
      }
      
      return data;
    },
    enabled: !!partner
  });

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
    
    // Check if product is already in the solution - using String conversion for safe comparison
    if (solution.products.some(p => String(p.id) === String(product.id))) {
      toast({
        variant: "destructive",
        title: "Produit déjà ajouté",
        description: `${name} est déjà présent dans cette solution.`
      });
      return;
    }
    
    // Add product to solution
    const updatedSolution: BusinessSolution = {
      ...solution,
      products: [
        ...solution.products,
        { 
          id: String(product.id), // Ensure ID is stored as string 
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
              {partnerInfo ? (
                <div>
                  <p className="text-gray-700">{partner}</p>
                  {partnerInfo.description && (
                    <p className="text-sm text-gray-600 mt-1">{partnerInfo.description}</p>
                  )}
                  {partnerInfo.website_url && (
                    <a 
                      href={partnerInfo.website_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-paritel-primary hover:underline mt-1 inline-block"
                    >
                      Visiter le site web
                    </a>
                  )}
                </div>
              ) : (
                <p className="text-gray-700">{partner}</p>
              )}
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
            {isLoading ? (
              <div className="h-10 bg-gray-100 animate-pulse rounded"></div>
            ) : availableSolutions.length > 0 ? (
              <Select value={selectedSolution} onValueChange={setSelectedSolution}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une solution métier" />
                </SelectTrigger>
                <SelectContent>
                  {availableSolutions.map(solution => (
                    <SelectItem key={solution.id} value={solution.id}>
                      {solution.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <p className="text-gray-500 text-center py-2">
                Aucune solution disponible. Veuillez créer une solution métier d'abord.
              </p>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddToSolutionOpen(false)}>
              Annuler
            </Button>
            <Button 
              onClick={handleAddToSolution} 
              className="bg-paritel-primary"
              disabled={!selectedSolution || availableSolutions.length === 0}
            >
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductDetails;
