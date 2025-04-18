
import { useState, useEffect } from "react";
import { ProductCardProps } from "./ProductCard";
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
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

type ProductFormProps = {
  product?: Partial<ProductCardProps>;
  onSubmit: (data: Partial<ProductCardProps>) => void;
  onCancel: () => void;
};

type Category = {
  id: string;
  name: string;
  display_name: string;
}

type Subcategory = {
  id: string;
  name: string;
  display_name: string;
  category_id: string;
}

type Partner = {
  id: string;
  name: string;
  industry: string | null;
}

const ProductForm = ({ product, onSubmit, onCancel }: ProductFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<ProductCardProps>>(
    product || {
      name: "",
      description: "",
      category: "Téléphonie d'entreprise",
      subcategory: "",
      partner: "",
      tags: [],
      image: "https://placehold.co/600x400/1EAEDB/ffffff?text=Product",
      specs: []
    }
  );

  const [tagInput, setTagInput] = useState("");
  const [specInput, setSpecInput] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  // Fetch categories from database
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name, display_name');
      
      if (error) {
        console.error('Error fetching categories:', error);
        return [];
      }
      
      return data || [];
    }
  });
  
  // Fetch subcategories from database
  const { data: allSubcategories = [] } = useQuery<Subcategory[]>({
    queryKey: ['subcategories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subcategories')
        .select('id, name, display_name, category_id');
      
      if (error) {
        console.error('Error fetching subcategories:', error);
        return [];
      }
      
      return data || [];
    }
  });
  
  // Fetch partners from database
  const { data: partners = [] } = useQuery<Partner[]>({
    queryKey: ['partners'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('partners')
        .select('id, name, industry');
      
      if (error) {
        console.error('Error fetching partners:', error);
        return [];
      }
      
      return data || [];
    }
  });
  
  // Filter subcategories based on selected category
  const currentCategoryId = categories.find(cat => cat.display_name === formData.category)?.id;
  const subcategories = allSubcategories.filter(sub => sub.category_id === currentCategoryId);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCategoryChange = (value: string) => {
    // Find the display name from the selected value
    const category = categories.find(cat => cat.name === value);
    if (category) {
      setFormData({ 
        ...formData, 
        category: category.display_name,
        subcategory: "" // Reset subcategory when category changes
      });
    }
  };

  const handleSubcategoryChange = (value: string) => {
    // Find the display name from the selected value
    const subcategory = subcategories.find(sub => sub.name === value);
    if (subcategory) {
      setFormData({ ...formData, subcategory: subcategory.display_name });
    }
  };

  const handlePartnerChange = (value: string) => {
    setFormData({ ...formData, partner: value === "no-partner" ? "" : value });
  };

  const handleAddTag = () => {
    if (tagInput.trim()) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), tagInput.trim()]
      });
      setTagInput("");
    }
  };

  const handleRemoveTag = (index: number) => {
    const newTags = [...(formData.tags || [])];
    newTags.splice(index, 1);
    setFormData({ ...formData, tags: newTags });
  };

  const handleAddSpec = () => {
    if (specInput.trim()) {
      setFormData({
        ...formData,
        specs: [...(formData.specs || []), specInput.trim()]
      });
      setSpecInput("");
    }
  };

  const handleRemoveSpec = (index: number) => {
    const newSpecs = [...(formData.specs || [])];
    newSpecs.splice(index, 1);
    setFormData({ ...formData, specs: newSpecs });
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Pass the image file along with the form data
    onSubmit({ ...formData, imageFile });
  };
  
  // Map category names to their display names for the dropdown
  const categoryOptions = categories.map(cat => ({
    value: cat.name,
    label: cat.display_name
  }));
  
  // Map subcategory names to their display names for the dropdown
  const subcategoryOptions = subcategories.map(sub => ({
    value: sub.name,
    label: sub.display_name
  }));
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nom du produit*</Label>
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category">Catégorie*</Label>
            <Select 
              value={categoryOptions.find(opt => opt.label === formData.category)?.value || ""}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une catégorie" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map(category => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="subcategory">Sous-catégorie</Label>
            <Select 
              value={subcategoryOptions.find(opt => opt.label === formData.subcategory)?.value || ""}
              onValueChange={handleSubcategoryChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une sous-catégorie" />
              </SelectTrigger>
              <SelectContent>
                {subcategoryOptions.length > 0 ? (
                  subcategoryOptions.map(subcategory => (
                    <SelectItem key={subcategory.value} value={subcategory.value}>
                      {subcategory.label}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none-available" disabled>
                    Aucune sous-catégorie disponible
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="partner">Partenaire</Label>
          <Select 
            value={formData.partner || "no-partner"}
            onValueChange={handlePartnerChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un partenaire" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="no-partner">Aucun partenaire</SelectItem>
              {partners.map(partner => (
                <SelectItem key={partner.id} value={partner.name}>
                  {partner.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="image">Image</Label>
          <div className="flex items-center space-x-4">
            <Input
              id="imageUrl"
              name="image"
              value={typeof formData.image === 'string' && !formData.image.startsWith('data:') 
                ? formData.image 
                : ''}
              onChange={handleChange}
              placeholder="URL de l'image"
              className="flex-1"
            />
            <div className="relative">
              <input
                type="file"
                id="imageFile"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => document.getElementById('imageFile')?.click()}
                className="flex-shrink-0"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
            </div>
          </div>
          <div className="h-24 bg-gray-100 flex items-center justify-center rounded-md overflow-hidden">
            <img 
              src={formData.image} 
              alt="Image preview" 
              className="max-h-full max-w-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://placehold.co/600x400/1EAEDB/ffffff?text=Product";
              }}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Tags</Label>
          <div className="flex space-x-2">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Ajouter un tag"
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
            />
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleAddTag}
              className="flex-shrink-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.tags?.map((tag, index) => (
              <div key={index} className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm">
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(index)}
                  className="ml-2 text-gray-500 hover:text-red-500"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Spécifications</Label>
          <div className="flex space-x-2">
            <Input
              value={specInput}
              onChange={(e) => setSpecInput(e.target.value)}
              placeholder="Ajouter une spécification"
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSpec())}
            />
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleAddSpec}
              className="flex-shrink-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2 mt-2">
            {formData.specs?.map((spec, index) => (
              <div key={index} className="flex items-center">
                <div className="flex-grow bg-gray-50 p-2 rounded-md text-sm">{spec}</div>
                <button
                  type="button"
                  onClick={() => handleRemoveSpec(index)}
                  className="ml-2 text-gray-500 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" />
          Annuler
        </Button>
        <Button type="submit" className="bg-paritel-primary">
          <Check className="h-4 w-4 mr-2" />
          {product ? "Mettre à jour" : "Ajouter"}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default ProductForm;
