
import { useState } from "react";
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

type ProductFormProps = {
  product?: Partial<ProductCardProps>;
  onSubmit: (data: Partial<ProductCardProps>) => void;
  onCancel: () => void;
};

const ProductForm = ({ product, onSubmit, onCancel }: ProductFormProps) => {
  const [formData, setFormData] = useState<Partial<ProductCardProps>>(
    product || {
      name: "",
      description: "",
      category: "Téléphonie d'entreprise",
      subcategory: "",
      partner: "",
      tags: [],
      pricing: "",
      image: "https://placehold.co/600x400/1EAEDB/ffffff?text=Product",
      specs: []
    }
  );

  const [tagInput, setTagInput] = useState("");
  const [specInput, setSpecInput] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCategoryChange = (value: string) => {
    setFormData({ ...formData, category: value });
  };

  const handleSubcategoryChange = (value: string) => {
    setFormData({ ...formData, subcategory: value });
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
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Categories and subcategories mapping
  const categories = [
    "Téléphonie d'entreprise",
    "Internet Très Haut Débit",
    "Wi-Fi public & privé indoor outdoor",
    "Cybersécurité",
    "Infogérance",
    "Sécurisation du poste de travail",
    "Solutions collaboratives",
    "TVCast Téléviseur connecté",
    "Mobiles",
    "Monétique",
    "Surveillance"
  ];

  const subcategories: Record<string, string[]> = {
    "Téléphonie d'entreprise": [
      "UCaaS", 
      "PBX On Premise", 
      "Cloud PBX", 
      "Trunk SIP",
      "Number Hosting",
      "Yealink",
      "Telephone IP WiFi",
      "DECT Unify",
      "Telephone IP Fixe",
      "Matériel téléphonie",
      "Accessoires"
    ],
    "Internet Très Haut Débit": [
      "Fibre optique (Actif/Passif)",
      "4G/5G",
      "Cuivre (xDSL)",
      "Satellite",
      "Mikrotik",
      "TP-Link 5G",
      "TP-Link 4G",
      "Switch"
    ],
    "Wi-Fi public & privé indoor outdoor": [
      "Wifi Privé",
      "Wifi Public"
    ],
    "Cybersécurité": [
      "Firewall",
      "Advanced Adware Protection"
    ],
    "Infogérance": [
      "Sauvegarde"
    ],
    "Mobiles": [
      "Tout type de forfait mobile",
      "Enveloppe DATA"
    ],
    "Surveillance": [
      "NVR",
      "Caméras"
    ]
  };
  
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
              value={formData.category} 
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une catégorie" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="subcategory">Sous-catégorie</Label>
            <Select 
              value={formData.subcategory || ""}
              onValueChange={handleSubcategoryChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une sous-catégorie" />
              </SelectTrigger>
              <SelectContent>
                {(formData.category && subcategories[formData.category]) 
                  ? subcategories[formData.category].map(subcat => (
                      <SelectItem key={subcat} value={subcat}>
                        {subcat}
                      </SelectItem>
                    ))
                  : <SelectItem value="">Aucune sous-catégorie disponible</SelectItem>
                }
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="partner">Partenaire (optionnel)</Label>
          <Input
            id="partner"
            name="partner"
            value={formData.partner || ""}
            onChange={handleChange}
            placeholder="Ex: Fortinet, TP-Link, etc."
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="pricing">Prix</Label>
          <Input
            id="pricing"
            name="pricing"
            value={formData.pricing || ""}
            onChange={handleChange}
            placeholder="Ex: 15€/mois, À partir de 149€, etc."
          />
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
