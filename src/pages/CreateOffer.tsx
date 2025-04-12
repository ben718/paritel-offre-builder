
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { CustomLabel } from "@/components/ui/custom-label";
import { 
  Tabs,
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  ArrowLeft,
  ArrowRight,
  Save,
  Building,
  FileText,
  User,
  Phone,
  Mail,
  Package,
  FileCheck,
  Download,
  X,
  Plus,
  Check
} from "lucide-react";
import { useState } from "react";
import { products } from "@/data/productData";
import { useToast } from "@/components/ui/use-toast";

type OfferCustomer = {
  companyName: string;
  industry: string;
  address: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  contactRole: string;
};

type OfferNeeds = {
  context: string;
  needs: string;
  constraints: string;
  budget: string;
  deadline: string;
};

type OfferProduct = {
  id: number;
  name: string;
  category: string;
  quantity: number;
  price: string;
  notes?: string;
};

type Offer = {
  id?: number;
  customer: OfferCustomer;
  needs: OfferNeeds;
  products: OfferProduct[];
  date: string;
  status: "draft" | "final";
};

const CreateOffer = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;
  const [searchTerm, setSearchTerm] = useState("");
  const [offer, setOffer] = useState<Offer>({
    customer: {
      companyName: "",
      industry: "business",
      address: "",
      contactName: "",
      contactPhone: "",
      contactEmail: "",
      contactRole: "",
    },
    needs: {
      context: "",
      needs: "",
      constraints: "",
      budget: "",
      deadline: "",
    },
    products: [],
    date: new Date().toISOString().split('T')[0],
    status: "draft",
  });

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleCustomerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setOffer({
      ...offer,
      customer: {
        ...offer.customer,
        [name]: value
      }
    });
  };

  const handleIndustryChange = (value: string) => {
    setOffer({
      ...offer,
      customer: {
        ...offer.customer,
        industry: value
      }
    });
  };

  const handleNeedsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setOffer({
      ...offer,
      needs: {
        ...offer.needs,
        [name]: value
      }
    });
  };

  const addProduct = (productId: number) => {
    const productToAdd = products.find(p => p.id === productId);
    if (productToAdd) {
      // Check if product already exists in the offer
      if (!offer.products.some(p => p.id === productId)) {
        const newProduct: OfferProduct = {
          id: productToAdd.id,
          name: productToAdd.name,
          category: productToAdd.category,
          quantity: 1,
          price: productToAdd.pricing.replace(/[^0-9,.]/g, '')
        };
        
        setOffer({
          ...offer,
          products: [...offer.products, newProduct]
        });
        
        toast({
          title: "Produit ajouté",
          description: `${productToAdd.name} a été ajouté à l'offre`,
        });
      } else {
        toast({
          title: "Produit déjà ajouté",
          description: "Ce produit est déjà présent dans l'offre",
          variant: "destructive"
        });
      }
    }
  };

  const removeProduct = (productId: number) => {
    setOffer({
      ...offer,
      products: offer.products.filter(p => p.id !== productId)
    });
    
    toast({
      title: "Produit retiré",
      description: "Le produit a été retiré de l'offre",
    });
  };

  const updateProductQuantity = (productId: number, quantity: number) => {
    setOffer({
      ...offer,
      products: offer.products.map(p => 
        p.id === productId ? { ...p, quantity } : p
      )
    });
  };

  const updateProductNotes = (productId: number, notes: string) => {
    setOffer({
      ...offer,
      products: offer.products.map(p => 
        p.id === productId ? { ...p, notes } : p
      )
    });
  };

  const saveAsDraft = () => {
    const drafts = JSON.parse(localStorage.getItem('offerDrafts') || '[]');
    const newDraft = {
      ...offer,
      id: Date.now(),
      status: "draft",
      date: new Date().toISOString()
    };
    
    localStorage.setItem('offerDrafts', JSON.stringify([...drafts, newDraft]));
    
    toast({
      title: "Brouillon enregistré",
      description: "Votre offre a été enregistrée en tant que brouillon",
    });
  };

  const finalizOffer = () => {
    const offers = JSON.parse(localStorage.getItem('offers') || '[]');
    const finalOffer = {
      ...offer,
      id: Date.now(),
      status: "final",
      date: new Date().toISOString()
    };
    
    localStorage.setItem('offers', JSON.stringify([...offers, finalOffer]));
    
    toast({
      title: "Offre finalisée",
      description: "Votre offre a été finalisée et enregistrée",
    });
  };

  const downloadOffer = () => {
    // In a real application, this would generate a PDF
    const element = document.createElement("a");
    const file = new Blob(
      [JSON.stringify(offer, null, 2)], 
      {type: 'application/pdf'}
    );
    element.href = URL.createObjectURL(file);
    element.download = `Offre_${offer.customer.companyName || 'Client'}_${new Date().toLocaleDateString()}.pdf`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Offre téléchargée",
      description: "Votre offre a été téléchargée avec succès",
    });
  };

  const filteredProducts = products.filter(
    (product) => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.subcategory && product.subcategory.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Créer une Offre Sur Mesure</h1>
            <p className="text-muted-foreground mt-1">
              Configurez une proposition commerciale personnalisée
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={saveAsDraft}>
              <Save className="mr-2 h-4 w-4" />
              Enregistrer comme brouillon
            </Button>
          </div>
        </div>

        <div className="flex justify-between mb-8">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div
              key={index}
              className="flex flex-col items-center space-y-2 relative w-full"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentStep > index + 1
                    ? "bg-green-500 text-white"
                    : currentStep === index + 1
                    ? "bg-paritel-primary text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {currentStep > index + 1 ? (
                  "✓"
                ) : (
                  index + 1
                )}
              </div>
              <div className="text-xs font-medium text-center">
                {index === 0 && "Informations client"}
                {index === 1 && "Expression des besoins"}
                {index === 2 && "Sélection produits"}
                {index === 3 && "Personnalisation"}
                {index === 4 && "Résumé et finalisation"}
              </div>
              {index < totalSteps - 1 && (
                <div
                  className={`absolute top-5 w-full h-0.5 left-1/2 ${
                    currentStep > index + 1 ? "bg-green-500" : "bg-gray-200"
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Customer Information */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Informations client</CardTitle>
              <CardDescription>
                Renseignez les informations de base du client et du contact
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <CustomLabel>Nom de la société</CustomLabel>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input 
                        className="pl-9" 
                        placeholder="Nom de la société" 
                        name="companyName"
                        value={offer.customer.companyName}
                        onChange={handleCustomerChange}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <CustomLabel>Secteur d'activité</CustomLabel>
                    <Select value={offer.customer.industry} onValueChange={handleIndustryChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un secteur" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="business">Entreprise / PME</SelectItem>
                        <SelectItem value="hotel">Hôtellerie</SelectItem>
                        <SelectItem value="health">Santé</SelectItem>
                        <SelectItem value="education">Éducation</SelectItem>
                        <SelectItem value="public">Secteur Public</SelectItem>
                        <SelectItem value="other">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-1">
                    <CustomLabel>Adresse</CustomLabel>
                    <Textarea 
                      placeholder="Adresse complète" 
                      name="address"
                      value={offer.customer.address}
                      onChange={handleCustomerChange}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-1">
                    <CustomLabel>Nom du contact</CustomLabel>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input 
                        className="pl-9" 
                        placeholder="Nom du contact" 
                        name="contactName"
                        value={offer.customer.contactName}
                        onChange={handleCustomerChange}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <CustomLabel>Téléphone</CustomLabel>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input 
                        className="pl-9" 
                        placeholder="Numéro de téléphone" 
                        name="contactPhone"
                        value={offer.customer.contactPhone}
                        onChange={handleCustomerChange}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <CustomLabel>Email</CustomLabel>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input 
                        className="pl-9" 
                        placeholder="Adresse email" 
                        name="contactEmail"
                        value={offer.customer.contactEmail}
                        onChange={handleCustomerChange}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <CustomLabel>Fonction</CustomLabel>
                    <Input 
                      placeholder="Fonction du contact" 
                      name="contactRole"
                      value={offer.customer.contactRole}
                      onChange={handleCustomerChange}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Needs Expression */}
        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Expression des besoins</CardTitle>
              <CardDescription>
                Décrivez les besoins du client et le contexte de la demande
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-1">
                <CustomLabel>Contexte de la demande</CustomLabel>
                <Textarea 
                  placeholder="Décrivez la situation actuelle et le contexte" 
                  className="min-h-[100px]"
                  name="context"
                  value={offer.needs.context}
                  onChange={handleNeedsChange}
                />
              </div>
              
              <div className="space-y-1">
                <CustomLabel>Besoins exprimés</CustomLabel>
                <Textarea 
                  placeholder="Listez les besoins exprimés par le client" 
                  className="min-h-[100px]"
                  name="needs"
                  value={offer.needs.needs}
                  onChange={handleNeedsChange}
                />
              </div>
              
              <div className="space-y-1">
                <CustomLabel>Contraintes spécifiques</CustomLabel>
                <Textarea 
                  placeholder="Précisez les contraintes à prendre en compte (budget, délais, techniques...)" 
                  className="min-h-[100px]"
                  name="constraints"
                  value={offer.needs.constraints}
                  onChange={handleNeedsChange}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <CustomLabel>Budget estimé</CustomLabel>
                  <Input 
                    placeholder="€" 
                    type="number" 
                    name="budget"
                    value={offer.needs.budget}
                    onChange={handleNeedsChange}
                  />
                </div>
                
                <div className="space-y-1">
                  <CustomLabel>Délai souhaité</CustomLabel>
                  <Input 
                    placeholder="Date souhaitée" 
                    type="date" 
                    name="deadline"
                    value={offer.needs.deadline}
                    onChange={handleNeedsChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Products Selection */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sélection des produits et services</CardTitle>
                <CardDescription>
                  Choisissez les produits et services à inclure dans l'offre
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="pack">
                  <TabsList className="mb-4">
                    <TabsTrigger value="pack">Packs métiers</TabsTrigger>
                    <TabsTrigger value="products">Produits individuels</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="pack">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div 
                        className="border border-gray-200 rounded-lg p-4 hover:border-paritel-primary cursor-pointer"
                        onClick={() => {
                          // Add multiple products that make up the pack
                          addProduct(22); // FTTO
                          addProduct(38); // Fortigate
                          addProduct(44); // WiFi
                        }}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium">Pack Hôtellerie Premium</h3>
                          <div className="bg-paritel-primary text-white text-xs px-2 py-1 rounded">Recommandé</div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">Solution complète pour les hôtels incluant wifi, téléphonie et TV interactive.</p>
                        <div className="text-xs text-gray-500">3 produits inclus</div>
                      </div>
                      
                      <div 
                        className="border border-gray-200 rounded-lg p-4 hover:border-paritel-primary cursor-pointer"
                        onClick={() => {
                          // Add multiple products that make up the pack
                          addProduct(1); // UCaaS
                          addProduct(42); // Bitdefender
                          addProduct(28); // Mikrotik
                        }}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium">Pack PME Cloud</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">Solution complète pour les PME avec communications unifiées et cybersécurité.</p>
                        <div className="text-xs text-gray-500">3 produits inclus</div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="products">
                    <div className="flex mb-4">
                      <Input 
                        className="max-w-sm" 
                        placeholder="Rechercher un produit..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2 max-h-[400px] overflow-y-auto">
                      {filteredProducts.map(product => (
                        <div key={product.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                          <div className="flex items-center">
                            <Package className="h-5 w-5 mr-3 text-paritel-primary" />
                            <div>
                              <h4 className="font-medium">{product.name}</h4>
                              <p className="text-xs text-gray-500">{product.category} - {product.subcategory}</p>
                            </div>
                          </div>
                          <Button 
                            size="sm"
                            onClick={() => addProduct(product.id)}
                            disabled={offer.products.some(p => p.id === product.id)}
                          >
                            {offer.products.some(p => p.id === product.id) ? 'Ajouté' : 'Ajouter'}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Produits sélectionnés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {offer.products.length === 0 ? (
                    <p className="text-center text-gray-500 py-4">Aucun produit sélectionné</p>
                  ) : (
                    offer.products.map(product => {
                      const productDetails = products.find(p => p.id === product.id);
                      return (
                        <div key={product.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                          <div className="flex items-center">
                            <Package className="h-5 w-5 mr-3 text-paritel-primary" />
                            <div>
                              <h4 className="font-medium">{product.name}</h4>
                              <p className="text-xs text-gray-500">{product.category}</p>
                            </div>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-destructive"
                            onClick={() => removeProduct(product.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 4: Customization */}
        {currentStep === 4 && (
          <Card>
            <CardHeader>
              <CardTitle>Personnalisation de l'offre</CardTitle>
              <CardDescription>
                Ajustez les quantités, prix et ajoutez des notes spécifiques
              </CardDescription>
            </CardHeader>
            <CardContent>
              {offer.products.length === 0 ? (
                <p className="text-center text-gray-500 py-10">
                  Aucun produit sélectionné. Veuillez revenir à l'étape précédente pour ajouter des produits.
                </p>
              ) : (
                <div className="space-y-4">
                  {offer.products.map(product => {
                    const productDetails = products.find(p => p.id === product.id);
                    return (
                      <div key={product.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="font-medium">{product.name}</h3>
                          <p className="text-sm font-medium">{productDetails?.pricing}</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                          <div>
                            <CustomLabel>Quantité</CustomLabel>
                            <div className="flex items-center mt-1">
                              <button 
                                type="button"
                                className="w-8 h-8 flex items-center justify-center border rounded-l-md"
                                onClick={() => updateProductQuantity(product.id, Math.max(1, product.quantity - 1))}
                              >
                                -
                              </button>
                              <input
                                type="number"
                                min="1"
                                value={product.quantity}
                                onChange={(e) => updateProductQuantity(product.id, parseInt(e.target.value) || 1)}
                                className="w-12 h-8 text-center border-y"
                              />
                              <button 
                                type="button"
                                className="w-8 h-8 flex items-center justify-center border rounded-r-md"
                                onClick={() => updateProductQuantity(product.id, product.quantity + 1)}
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <CustomLabel>Notes spécifiques</CustomLabel>
                          <Textarea 
                            placeholder="Ajoutez des informations spécifiques pour ce produit..." 
                            value={product.notes || ''}
                            onChange={(e) => updateProductNotes(product.id, e.target.value)}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        )}
        
        {/* Step 5: Summary and Finalization */}
        {currentStep === 5 && (
          <Card>
            <CardHeader>
              <CardTitle>Résumé et finalisation</CardTitle>
              <CardDescription>
                Vérifiez les détails de l'offre avant génération
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {offer.products.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    Aucun produit sélectionné. Veuillez revenir aux étapes précédentes pour compléter l'offre.
                  </p>
                ) : (
                  <>
                    <div className="rounded-lg border p-4">
                      <h3 className="font-semibold mb-2">Détails du client</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p><span className="font-medium">Société:</span> {offer.customer.companyName || "Non spécifié"}</p>
                          <p><span className="font-medium">Secteur:</span> {
                            offer.customer.industry === "business" ? "Entreprise / PME" :
                            offer.customer.industry === "hotel" ? "Hôtellerie" :
                            offer.customer.industry === "health" ? "Santé" :
                            offer.customer.industry === "education" ? "Éducation" :
                            offer.customer.industry === "public" ? "Secteur Public" : "Autre"
                          }</p>
                          <p><span className="font-medium">Adresse:</span> {offer.customer.address || "Non spécifiée"}</p>
                        </div>
                        <div>
                          <p><span className="font-medium">Contact:</span> {offer.customer.contactName || "Non spécifié"}</p>
                          <p><span className="font-medium">Fonction:</span> {offer.customer.contactRole || "Non spécifiée"}</p>
                          <p><span className="font-medium">Téléphone:</span> {offer.customer.contactPhone || "Non spécifié"}</p>
                          <p><span className="font-medium">Email:</span> {offer.customer.contactEmail || "Non spécifié"}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="rounded-lg border p-4">
                      <h3 className="font-semibold mb-2">Expression des besoins</h3>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Contexte:</span> {offer.needs.context || "Non spécifié"}</p>
                        <p><span className="font-medium">Besoins:</span> {offer.needs.needs || "Non spécifiés"}</p>
                        <p><span className="font-medium">Contraintes:</span> {offer.needs.constraints || "Non spécifiées"}</p>
                        <p><span className="font-medium">Budget estimé:</span> {offer.needs.budget ? `${offer.needs.budget}€` : "Non spécifié"}</p>
                        <p><span className="font-medium">Délai souhaité:</span> {offer.needs.deadline || "Non spécifié"}</p>
                      </div>
                    </div>
                    
                    <div className="rounded-lg border p-4">
                      <h3 className="font-semibold mb-2">Produits et services</h3>
                      <div className="space-y-3">
                        {offer.products.map(product => {
                          const productDetails = products.find(p => p.id === product.id);
                          return (
                            <div key={product.id} className="flex items-start justify-between border-b pb-2">
                              <div>
                                <p className="font-medium">{product.name}</p>
                                <p className="text-xs text-gray-500">{product.category}</p>
                                {product.notes && (
                                  <p className="text-xs italic mt-1">{product.notes}</p>
                                )}
                              </div>
                              <div className="text-right">
                                <p className="font-medium">Qté: {product.quantity}</p>
                                <p className="text-sm">{productDetails?.pricing}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    
                    <div className="text-center space-y-4 py-6">
                      <FileCheck className="h-16 w-16 mx-auto text-green-500" />
                      <h2 className="text-xl font-semibold">Offre prête à être générée</h2>
                      <p className="text-gray-600 max-w-md mx-auto">
                        Votre offre pour {offer.customer.companyName || "votre client"} a été configurée et est prête à être générée en document.
                      </p>
                    </div>
                    
                    <div className="flex justify-center space-x-4">
                      <Button 
                        variant="outline" 
                        className="w-40"
                        onClick={finalizOffer}
                      >
                        <Save className="mr-2 h-4 w-4" />
                        Finaliser
                      </Button>
                      <Button 
                        className="w-40 bg-paritel-primary"
                        onClick={downloadOffer}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Télécharger PDF
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={goToPreviousStep}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Précédent
          </Button>
          
          <Button
            onClick={goToNextStep}
            disabled={currentStep === totalSteps}
            className="bg-paritel-primary"
          >
            {currentStep === totalSteps - 1 ? "Finaliser" : "Suivant"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default CreateOffer;
