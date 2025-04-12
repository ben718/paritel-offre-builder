
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { X, Check, Upload, Plus, Trash2 } from "lucide-react";
import { DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

type ProductItem = {
  id: number;
  name: string;
  category: string;
}

type SolutionProps = {
  id: number;
  name: string;
  description: string;
  industry: string;
  products: ProductItem[];
  image: string;
  recommended?: boolean;
};

type SolutionFormProps = {
  solution?: Partial<SolutionProps>;
  onSubmit: (data: Partial<SolutionProps>) => void;
  onCancel: () => void;
  availableProducts: ProductItem[];
};

const SolutionForm = ({ 
  solution, 
  onSubmit, 
  onCancel,
  availableProducts 
}: SolutionFormProps) => {
  const [formData, setFormData] = useState<Partial<SolutionProps>>(
    solution || {
      name: "",
      description: "",
      industry: "Entreprise",
      products: [],
      image: "https://placehold.co/600x400/1e40af/ffffff?text=Solution",
      recommended: false
    }
  );

  const [selectedProductId, setSelectedProductId] = useState<number | "">("");

  const industries = [
    "Entreprise",
    "Hôtellerie",
    "Santé",
    "Éducation",
    "Secteur Public",
    "Commerce",
    "Industrie"
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleIndustryChange = (value: string) => {
    setFormData({ ...formData, industry: value });
  };

  const handleProductSelect = (value: string) => {
    setSelectedProductId(Number(value));
  };

  const handleAddProduct = () => {
    if (selectedProductId && typeof selectedProductId === "number") {
      const product = availableProducts.find(p => p.id === selectedProductId);
      if (product) {
        // Check if the product is already added
        if (!formData.products?.some(p => p.id === product.id)) {
          setFormData({
            ...formData,
            products: [...(formData.products || []), product]
          });
        }
        setSelectedProductId("");
      }
    }
  };

  const handleRemoveProduct = (productId: number) => {
    const newProducts = formData.products?.filter(p => p.id !== productId) || [];
    setFormData({ ...formData, products: newProducts });
  };

  const handleRecommendedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, recommended: e.target.checked });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nom de la solution*</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description*</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="min-h-[100px]"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="industry">Secteur d'activité*</Label>
          <Select 
            value={formData.industry} 
            onValueChange={handleIndustryChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un secteur" />
            </SelectTrigger>
            <SelectContent>
              {industries.map(industry => (
                <SelectItem key={industry} value={industry}>
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="image">Image URL</Label>
          <div className="flex items-center space-x-4">
            <Input
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="URL de l'image"
            />
            <Button type="button" variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>
          </div>
          <div className="h-24 bg-gray-100 flex items-center justify-center rounded-md overflow-hidden">
            <img 
              src={formData.image} 
              alt="Image preview" 
              className="max-h-full max-w-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://placehold.co/600x400/1e40af/ffffff?text=Solution";
              }}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Produits inclus</Label>
          <div className="flex space-x-2">
            <Select 
              value={selectedProductId ? String(selectedProductId) : ""} 
              onValueChange={handleProductSelect}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Sélectionner un produit" />
              </SelectTrigger>
              <SelectContent>
                {availableProducts.map(product => (
                  <SelectItem key={product.id} value={String(product.id)}>
                    {product.name} ({product.category})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleAddProduct}
              disabled={!selectedProductId}
              className="flex-shrink-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-2 mt-2">
            {formData.products?.map(product => (
              <div key={product.id} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                <div>
                  <span className="text-sm font-medium">{product.name}</span>
                  <Badge className="ml-2 text-xs" variant="outline">{product.category}</Badge>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveProduct(product.id)}
                  className="text-gray-500 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            {formData.products?.length === 0 && (
              <div className="text-sm text-gray-500 italic">
                Aucun produit sélectionné
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="recommended"
            checked={formData.recommended}
            onChange={handleRecommendedChange}
            className="h-4 w-4 rounded border-gray-300 text-paritel-primary focus:ring-paritel-accent"
          />
          <Label htmlFor="recommended" className="font-normal">Solution recommandée</Label>
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" />
          Annuler
        </Button>
        <Button type="submit" className="bg-paritel-primary">
          <Check className="h-4 w-4 mr-2" />
          {solution ? "Mettre à jour" : "Créer la solution"}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default SolutionForm;
