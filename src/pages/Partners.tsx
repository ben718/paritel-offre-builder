import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import PartnerDetails from "@/components/partners/PartnerDetails";
import { 
  Building, 
  Globe, 
  Phone, 
  Mail, 
  MapPin, 
  Package, 
  Plus, 
  Eye,
  Edit,
  Trash2,
  X,
  Check,
  Upload
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
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
import { useToast } from "@/components/ui/use-toast";
import { 
  Partner, 
  fetchPartners, 
  createPartner, 
  updatePartner, 
  deletePartner,
  fetchPartnerProducts
} from "@/services/PartnerService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

type PartnerType = "Fournisseur" | "Revendeur" | "Technologique" | "Stratégique";

type PartnerCardProps = {
  id: string;
  name: string;
  description: string;
  type: PartnerType;
  logo: string;
  website: string;
  contact: {
    email: string;
    phone: string;
    address: string;
  };
  products: string[];
  featured?: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onViewDetails?: (id: string) => void;
};

const PartnerCard = ({
  id,
  name,
  description,
  type,
  logo,
  website,
  contact,
  products,
  featured,
  onEdit,
  onDelete,
  onViewDetails
}: PartnerCardProps) => {
  return (
    <Card className={cn(
      "overflow-hidden border-2",
      featured ? "border-paritel-primary" : "border-gray-200"
    )}>
      <div className="relative h-48 bg-gray-100">
        {featured && (
          <div className="absolute top-0 right-0 bg-paritel-primary text-white px-3 py-1 text-xs font-semibold">
            Partenaire Premium
          </div>
        )}
        <div className="absolute top-2 left-2">
          <Badge 
            className={cn(
              "bg-blue-600 text-white",
              type === "Fournisseur" && "bg-purple-600",
              type === "Revendeur" && "bg-green-600",
              type === "Technologique" && "bg-blue-600",
              type === "Stratégique" && "bg-amber-600"
            )}
          >
            {type}
          </Badge>
        </div>
        <div className="flex items-center justify-center h-full p-6">
          <img
            src={logo}
            alt={name}
            className="max-h-full max-w-full object-contain"
          />
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-medium text-lg mb-1">{name}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{description}</p>
        
        <div className="space-y-2 mb-3 text-sm">
          <div className="flex items-center">
            <Globe className="h-4 w-4 mr-2 text-gray-500" />
            <a href={website} target="_blank" rel="noopener noreferrer" className="text-paritel-primary hover:underline truncate">
              {website.replace(/^https?:\/\//, '')}
            </a>
          </div>
          <div className="flex items-center">
            <Mail className="h-4 w-4 mr-2 text-gray-500" />
            <span className="truncate">{contact.email}</span>
          </div>
          <div className="flex items-center">
            <Phone className="h-4 w-4 mr-2 text-gray-500" />
            <span>{contact.phone}</span>
          </div>
        </div>
        
        {products.length > 0 && (
          <div className="mb-3">
            <h4 className="text-sm font-medium mb-1">Produits associés :</h4>
            <div className="flex flex-wrap gap-1">
              {products.slice(0, 2).map((product, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {product}
                </Badge>
              ))}
              {products.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{products.length - 2}
                </Badge>
              )}
            </div>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row sm:justify-between mt-4 gap-2">
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" size="sm" onClick={() => onEdit(id)} className="w-full sm:w-auto">
              <Edit className="h-4 w-4 mr-1" />
              Modifier
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50 w-full sm:w-auto">
                  <Trash2 className="h-4 w-4 mr-1" />
                  Supprimer
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="max-w-[90vw] sm:max-w-lg">
                <AlertDialogHeader>
                  <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ce partenaire ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action est irréversible. Le partenaire '{name}' sera définitivement supprimé.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDelete(id)} className="bg-red-600">
                    Supprimer
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          <Button 
            variant="default" 
            size="sm" 
            className="bg-paritel-primary w-full sm:w-auto"
            onClick={onViewDetails ? () => onViewDetails(id) : undefined}
          >
            <Eye className="h-4 w-4 mr-2" />
            Détails
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const PartnerForm = ({ 
  partner, 
  onSubmit, 
  onCancel 
}: { 
  partner?: Partial<PartnerCardProps>, 
  onSubmit: (data: Partial<PartnerCardProps>, logoFile?: File | null) => void,
  onCancel: () => void
}) => {
  const [formData, setFormData] = useState<Partial<PartnerCardProps>>(
    partner || {
      name: "",
      description: "",
      type: "Technologique",
      logo: "https://placehold.co/400x200/e2e8f0/64748b?text=Logo",
      website: "",
      contact: {
        email: "",
        phone: "",
        address: "",
      },
      products: [],
      featured: false
    }
  );
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...(formData[parent as keyof typeof formData] as object),
          [child]: value
        }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleTypeChange = (value: string) => {
    setFormData({ ...formData, type: value as PartnerType });
  };

  const handleFeaturedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, featured: e.target.checked });
  };
  
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, logo: reader.result as string });
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData, logoFile);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nom du partenaire*</Label>
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
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="type">Type de partenaire*</Label>
            <Select 
              value={formData.type} 
              onValueChange={handleTypeChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Fournisseur">Fournisseur</SelectItem>
                <SelectItem value="Revendeur">Revendeur</SelectItem>
                <SelectItem value="Technologique">Technologique</SelectItem>
                <SelectItem value="Stratégique">Stratégique</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="website">Site web*</Label>
            <Input
              id="website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://example.com"
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Informations de contact</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              name="contact.email"
              value={formData.contact?.email || ""}
              onChange={handleChange}
              placeholder="Email"
              required
            />
            <Input
              name="contact.phone"
              value={formData.contact?.phone || ""}
              onChange={handleChange}
              placeholder="Téléphone"
              required
            />
          </div>
          <Input
            name="contact.address"
            value={formData.contact?.address || ""}
            onChange={handleChange}
            placeholder="Adresse"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="logo">Logo URL</Label>
          <div className="flex items-center space-x-4">
            <Input
              id="logo"
              name="logo"
              value={formData.logo}
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
              src={formData.logo} 
              alt="Logo preview" 
              className="max-h-full max-w-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://placehold.co/400x200/e2e8f0/64748b?text=Logo";
              }}
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="featured"
            checked={formData.featured}
            onChange={handleFeaturedChange}
            className="h-4 w-4 rounded border-gray-300 text-paritel-primary focus:ring-paritel-accent"
          />
          <Label htmlFor="featured" className="font-normal">Partenaire Premium</Label>
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" />
          Annuler
        </Button>
        <Button type="submit" className="bg-paritel-primary">
          <Check className="h-4 w-4 mr-2" />
          {partner ? "Mettre à jour" : "Ajouter"}
        </Button>
      </DialogFooter>
    </form>
  );
};

const Partners = () => {
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<PartnerCardProps | null>(null);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partial<PartnerCardProps> | null>(null);
  
  const { data: partnersData = [], isLoading } = useQuery({
    queryKey: ['partners'],
    queryFn: fetchPartners
  });
  
  const partners = partnersData.map(partner => ({
    id: String(partner.id),
    name: partner.name,
    description: partner.description,
    type: (partner.industry || "Technologique") as PartnerType,
    logo: partner.logo_url || "https://placehold.co/400x200/e2e8f0/64748b?text=Logo",
    website: partner.website_url || "#",
    contact: {
      email: "contact@" + partner.name.toLowerCase().replace(/\s+/g, '') + ".com",
      phone: "+33 1 23 45 67 89",
      address: "Paris, France",
    },
    products: [],
    featured: partner.industry === "Stratégique",
    onEdit: () => {},
    onDelete: () => {},
    onViewDetails: () => {}
  }));
  
  const createPartnerMutation = useMutation({
    mutationFn: (data: { formData: Partial<PartnerCardProps>, logoFile?: File | null }) => {
      return createPartner({
        name: data.formData.name || "",
        description: data.formData.description || "",
        industry: data.formData.type,
        website_url: data.formData.website,
        logo_url: typeof data.formData.logo === 'string' && !data.formData.logo.startsWith('data:') 
          ? data.formData.logo 
          : null
      }, data.logoFile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partners'] });
      toast({
        title: "Partenaire ajouté",
        description: "Le partenaire a été ajouté avec succès.",
      });
      setIsAddDialogOpen(false);
    },
    onError: (error) => {
      console.error('Error creating partner:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le partenaire.",
        variant: "destructive",
      });
    }
  });
  
  const updatePartnerMutation = useMutation({
    mutationFn: (data: { partnerId: string, formData: Partial<PartnerCardProps>, logoFile?: File | null }) => {
      return updatePartner(data.partnerId, {
        name: data.formData.name || "",
        description: data.formData.description || "",
        industry: data.formData.type,
        website_url: data.formData.website,
        logo_url: typeof data.formData.logo === 'string' && !data.formData.logo.startsWith('data:') 
          ? data.formData.logo 
          : null
      }, data.logoFile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partners'] });
      toast({
        title: "Partenaire mis à jour",
        description: "Le partenaire a été mis à jour avec succès.",
      });
      setIsEditDialogOpen(false);
      setEditingPartner(null);
    },
    onError: (error) => {
      console.error('Error updating partner:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le partenaire.",
        variant: "destructive",
      });
    }
  });
  
  const deletePartnerMutation = useMutation({
    mutationFn: (partnerId: string) => deletePartner(partnerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partners'] });
      toast({
        title: "Partenaire supprimé",
        description: "Le partenaire a été supprimé avec succès.",
      });
    },
    onError: (error) => {
      console.error('Error deleting partner:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le partenaire.",
        variant: "destructive",
      });
    }
  });
  
  const partnersWithCallbacks = partners.map(partner => ({
    ...partner,
    onEdit: (id: string) => handleEditPartner(id),
    onDelete: (id: string) => handleDeletePartner(id),
    onViewDetails: (id: string) => handleViewPartnerDetails(id)
  }));
  
  const handleAddPartner = (formData: Partial<PartnerCardProps>, logoFile?: File | null) => {
    createPartnerMutation.mutate({ formData, logoFile });
  };
  
  const handleEditPartner = (id: string) => {
    const partner = partners.find(p => p.id === id);
    if (partner) {
      setEditingPartner(partner);
      setIsEditDialogOpen(true);
    }
  };
  
  const handleUpdatePartner = (formData: Partial<PartnerCardProps>, logoFile?: File | null) => {
    if (editingPartner && editingPartner.id) {
      updatePartnerMutation.mutate({ 
        partnerId: editingPartner.id,
        formData,
        logoFile
      });
    }
  };
  
  const handleDeletePartner = (id: string) => {
    deletePartnerMutation.mutate(id);
  };
  
  const handleViewPartnerDetails = async (id: string) => {
    try {
      const partner = partners.find(p => p.id === id);
      if (partner) {
        const products = await fetchPartnerProducts(id);
        const partnerWithProducts = {
          ...partner,
          products: products.map(p => p.name)
        };
        setSelectedPartner(partnerWithProducts);
        setIsDetailsDialogOpen(true);
      }
    } catch (error) {
      console.error('Error fetching partner details:', error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les détails du partenaire.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Partenaires</h1>
            <p className="text-muted-foreground mt-1">
              Gérez vos partenaires commerciaux et technologiques
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-paritel-primary hover:bg-paritel-dark">
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un partenaire
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Ajouter un nouveau partenaire</DialogTitle>
                <DialogDescription>
                  Remplissez les informations pour créer un nouveau partenaire.
                </DialogDescription>
              </DialogHeader>
              <PartnerForm 
                onSubmit={handleAddPartner} 
                onCancel={() => setIsAddDialogOpen(false)} 
              />
            </DialogContent>
          </Dialog>
          
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Modifier le partenaire</DialogTitle>
                <DialogDescription>
                  Modifiez les informations du partenaire.
                </DialogDescription>
              </DialogHeader>
              {editingPartner && (
                <PartnerForm 
                  partner={editingPartner} 
                  onSubmit={handleUpdatePartner} 
                  onCancel={() => {
                    setEditingPartner(null);
                    setIsEditDialogOpen(false);
                  }} 
                />
              )}
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="all">
          <div className="overflow-x-auto pb-2">
            <TabsList className="flex-wrap">
              <TabsTrigger value="all">Tous</TabsTrigger>
              <TabsTrigger value="fournisseur">Fournisseurs</TabsTrigger>
              <TabsTrigger value="revendeur">Revendeurs</TabsTrigger>
              <TabsTrigger value="technologique">Technologiques</TabsTrigger>
              <TabsTrigger value="strategique">Stratégiques</TabsTrigger>
              <TabsTrigger value="premium">Premium</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {partnersWithCallbacks.map((partner) => (
                <PartnerCard key={partner.id} {...partner} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="fournisseur" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {partnersWithCallbacks
                .filter((p) => p.type === "Fournisseur")
                .map((partner) => (
                  <PartnerCard key={partner.id} {...partner} />
                ))}
            </div>
          </TabsContent>
          <TabsContent value="revendeur" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {partnersWithCallbacks
                .filter((p) => p.type === "Revendeur")
                .map((partner) => (
                  <PartnerCard key={partner.id} {...partner} />
                ))}
            </div>
          </TabsContent>
          <TabsContent value="technologique" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {partnersWithCallbacks
                .filter((p) => p.type === "Technologique")
                .map((partner) => (
                  <PartnerCard key={partner.id} {...partner} />
                ))}
            </div>
          </TabsContent>
          <TabsContent value="strategique" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {partnersWithCallbacks
                .filter((p) => p.type === "Stratégique")
                .map((partner) => (
                  <PartnerCard key={partner.id} {...partner} />
                ))}
            </div>
          </TabsContent>
          <TabsContent value="premium" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {partnersWithCallbacks
                .filter((p) => p.featured)
                .map((partner) => (
                  <PartnerCard key={partner.id} {...partner} />
                ))}
            </div>
          </TabsContent>
        </Tabs>
        
        <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
          <DialogContent className={`${isMobile ? 'max-w-full p-4' : 'sm:max-w-[800px]'} max-h-[90vh] overflow-y-auto`}>
            {selectedPartner && (
              <PartnerDetails 
                partner={selectedPartner} 
                onBack={() => setIsDetailsDialogOpen(false)}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default Partners;
