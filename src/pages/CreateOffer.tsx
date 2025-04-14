
import { useState } from "react";
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
  quantity?: number;
  price?: string;
  notes?: string;
  showQuantity?: boolean;
  showPrice?: boolean;
};

type BusinessSolution = {
  id: string;
  name: string;
  description: string;
  products: OfferProduct[];
};

type Offer = {
  id?: number;
  customer: OfferCustomer;
  needs: OfferNeeds;
  products: OfferProduct[];
  solutions: BusinessSolution[];
  date: string;
  status: "draft" | "final";
};

const CreateOffer = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6; // Increased to include solution selection
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
    solutions: [],
    date: new Date().toISOString().split('T')[0],
    status: "draft",
  });

  // Mock solutions - in a real app, this would come from an API or context
  const availableSolutions: BusinessSolution[] = [
    {
      id: "1",
      name: "Solution PME",
      description: "Solution complète pour les PME incluant téléphonie et internet.",
      products: [
        { id: 1, name: "UCaaS", category: "Téléphonie d'entreprise", quantity: 1 },
        { id: 28, name: "Mikrotik", category: "Internet Très Haut Débit", quantity: 1 }
      ]
    },
    {
      id: "2",
      name: "Solution Hôtellerie",
      description: "Ensemble de produits adaptés au secteur de l'hôtellerie.",
      products: [
        { id: 22, name: "FTTO", category: "Internet Très Haut Débit", quantity: 1 },
        { id: 38, name: "Fortigate", category: "Cybersécurité", quantity: 1 },
        { id: 44, name: "WiFi", category: "Wi-Fi public & privé indoor outdoor", quantity: 1 }
      ]
    },
    {
      id: "3",
      name: "Solution Santé",
      description: "Produits adaptés aux besoins du secteur de la santé.",
      products: [
        { id: 1, name: "UCaaS", category: "Téléphonie d'entreprise", quantity: 1 },
        { id: 42, name: "Bitdefender", category: "Cybersécurité", quantity: 1 }
      ]
    },
    {
      id: "4",
      name: "Solution Éducation",
      description: "Services et produits pour les établissements d'enseignement.",
      products: [
        { id: 22, name: "FTTO", category: "Internet Très Haut Débit", quantity: 1 },
        { id: 44, name: "WiFi", category: "Wi-Fi public & privé indoor outdoor", quantity: 1 }
      ]
    }
  ];

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
          price: "0",
          showQuantity: true,
          showPrice: true
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
    import('html2pdf.js').then(html2pdf => {
      // Create a PDF-friendly container
      const pdfContainer = document.createElement('div');
      pdfContainer.className = 'pdf-container';
      pdfContainer.style.width = '210mm'; // A4 width
      pdfContainer.style.padding = '15mm';
      pdfContainer.style.fontFamily = 'Arial, sans-serif';
      
      // Add company info header
      const header = document.createElement('div');
      header.style.borderBottom = '1px solid #ddd';
      header.style.paddingBottom = '10mm';
      header.style.marginBottom = '10mm';
      header.style.display = 'flex';
      header.style.justifyContent = 'space-between';
      
      const companyInfo = document.createElement('div');
      companyInfo.innerHTML = `
        <h1 style="color: #6048b8; font-size: 24px; margin-bottom: 5px;">Offre commerciale</h1>
        <h2 style="font-size: 18px; margin-top: 0; color: #444;">Paritel Solutions</h2>
        <p style="color: #666; margin: 2px 0;">12 rue Henri Becquerel<br>77500 Chelles</p>
        <p style="color: #666; margin: 2px 0;">Tel: 01.64.11.41.50</p>
      `;
      
      const offerInfo = document.createElement('div');
      offerInfo.style.textAlign = 'right';
      offerInfo.innerHTML = `
        <p style="margin: 2px 0;">Référence: OFF-${Date.now().toString().slice(-6)}</p>
        <p style="margin: 2px 0;">Date: ${new Date().toLocaleDateString('fr-FR')}</p>
        <p style="margin: 2px 0; font-weight: bold;">${offer.status === 'draft' ? 'BROUILLON' : 'PROPOSITION FINALE'}</p>
      `;
      
      header.appendChild(companyInfo);
      header.appendChild(offerInfo);
      pdfContainer.appendChild(header);
      
      // Client info section
      const clientSection = document.createElement('div');
      clientSection.style.marginBottom = '10mm';
      clientSection.style.padding = '5mm';
      clientSection.style.backgroundColor = '#f9f9f9';
      clientSection.style.borderRadius = '4px';
      
      clientSection.innerHTML = `
        <h3 style="margin-top: 0; color: #6048b8;">Informations client</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="width: 50%; padding: 4px;"><strong>Société:</strong> ${offer.customer.companyName || "Non spécifié"}</td>
            <td style="width: 50%; padding: 4px;"><strong>Contact:</strong> ${offer.customer.contactName || "Non spécifié"}</td>
          </tr>
          <tr>
            <td style="padding: 4px;"><strong>Secteur:</strong> ${
              offer.customer.industry === "business" ? "Entreprise / PME" :
              offer.customer.industry === "hotel" ? "Hôtellerie" :
              offer.customer.industry === "health" ? "Santé" :
              offer.customer.industry === "education" ? "Éducation" :
              offer.customer.industry === "public" ? "Secteur Public" : "Autre"
            }</td>
            <td style="padding: 4px;"><strong>Fonction:</strong> ${offer.customer.contactRole || "Non spécifiée"}</td>
          </tr>
          <tr>
            <td style="padding: 4px;"><strong>Adresse:</strong> ${offer.customer.address || "Non spécifiée"}</td>
            <td style="padding: 4px;"><strong>Email:</strong> ${offer.customer.contactEmail || "Non spécifié"}</td>
          </tr>
          <tr>
            <td colspan="2" style="padding: 4px;"><strong>Téléphone:</strong> ${offer.customer.contactPhone || "Non spécifié"}</td>
          </tr>
        </table>
      `;
      
      pdfContainer.appendChild(clientSection);
      
      // Needs section
      if (offer.needs.context || offer.needs.needs || offer.needs.constraints) {
        const needsSection = document.createElement('div');
        needsSection.style.marginBottom = '10mm';
        
        needsSection.innerHTML = `
          <h3 style="color: #6048b8;">Expression des besoins</h3>
          ${offer.needs.context ? `<p><strong>Contexte:</strong> ${offer.needs.context}</p>` : ''}
          ${offer.needs.needs ? `<p><strong>Besoins:</strong> ${offer.needs.needs}</p>` : ''}
          ${offer.needs.constraints ? `<p><strong>Contraintes:</strong> ${offer.needs.constraints}</p>` : ''}
          ${offer.needs.budget ? `<p><strong>Budget estimé:</strong> ${offer.needs.budget}€</p>` : ''}
          ${offer.needs.deadline ? `<p><strong>Délai souhaité:</strong> ${offer.needs.deadline}</p>` : ''}
        `;
        
        pdfContainer.appendChild(needsSection);
      }
      
      // Products section
      if (offer.products.length > 0) {
        const productsSection = document.createElement('div');
        productsSection.style.marginBottom = '10mm';
        
        let productsHTML = `
          <h3 style="color: #6048b8;">Produits et services</h3>
          <table style="width: 100%; border-collapse: collapse; margin-top: 5mm;">
            <thead>
              <tr style="background-color: #6048b8; color: white;">
                <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Désignation</th>
                <th style="padding: 8px; text-align: center; border: 1px solid #ddd;">Quantité</th>
                <th style="padding: 8px; text-align: right; border: 1px solid #ddd;">Prix</th>
              </tr>
            </thead>
            <tbody>
        `;
        
        let totalAmount = 0;
        offer.products.forEach(product => {
          if (product.showPrice !== false && product.price) {
            const priceValue = parseFloat(product.price.replace(/[^\d.-]/g, '')) || 0;
            const totalPrice = priceValue * (product.showQuantity !== false && product.quantity ? product.quantity : 1);
            totalAmount += totalPrice;
          }
          
          const priceValue = product.price ? parseFloat(product.price.replace(/[^\d.-]/g, '')) || 0 : 0;
          productsHTML += `
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;">
                <strong>${product.name}</strong><br>
                <span style="color: #666; font-size: 12px;">${product.category}</span>
                ${product.notes ? `<br><span style="font-style: italic; font-size: 12px;">${product.notes}</span>` : ''}
              </td>
              <td style="padding: 8px; text-align: center; border: 1px solid #ddd;">
                ${product.showQuantity === false ? '-' : product.quantity}
              </td>
              <td style="padding: 8px; text-align: right; border: 1px solid #ddd;">
                ${product.showPrice === false ? 'Sur devis' : `${priceValue.toFixed(2)}€`}
              </td>
            </tr>
          `;
        });
        
        productsHTML += `
            </tbody>
            <tfoot>
              <tr style="background-color: #f2f2f2;">
                <td colspan="2" style="padding: 8px; text-align: right; border: 1px solid #ddd;"><strong>Total HT:</strong></td>
                <td style="padding: 8px; text-align: right; border: 1px solid #ddd;"><strong>${totalAmount.toFixed(2)}€</strong></td>
              </tr>
              <tr>
                <td colspan="2" style="padding: 8px; text-align: right; border: 1px solid #ddd;">TVA (20%):</td>
                <td style="padding: 8px; text-align: right; border: 1px solid #ddd;">${(totalAmount * 0.2).toFixed(2)}€</td>
              </tr>
              <tr style="background-color: #f2f2f2;">
                <td colspan="2" style="padding: 8px; text-align: right; border: 1px solid #ddd;"><strong>Total TTC:</strong></td>
                <td style="padding: 8px; text-align: right; border: 1px solid #ddd;"><strong>${(totalAmount * 1.2).toFixed(2)}€</strong></td>
              </tr>
            </tfoot>
          </table>
        `;
        
        productsSection.innerHTML = productsHTML;
        pdfContainer.appendChild(productsSection);
      }
      
      // Footer section
      const footerSection = document.createElement('div');
      footerSection.style.marginTop = '15mm';
      footerSection.style.borderTop = '1px solid #ddd';
      footerSection.style.paddingTop = '5mm';
      footerSection.style.fontSize = '10px';
      footerSection.style.color = '#666';
      footerSection.style.textAlign = 'center';
      
      footerSection.innerHTML = `
        <p>Paritel Solutions - SIRET: 123 456 789 00012 - TVA: FR12 123456789</p>
        <p>Conditions de vente: Paiement à 30 jours fin de mois. Validité de l'offre: 30 jours.</p>
      `;
      
      pdfContainer.appendChild(footerSection);
      
      // Generate PDF
      const pdfOptions = {
        margin: 0,
        filename: `Offre_${offer.customer.companyName || 'Client'}_${new Date().toLocaleDateString('fr-FR')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      
      html2pdf.default(pdfContainer, pdfOptions).then(() => {
        toast({
          title: "Offre téléchargée",
          description: "Votre offre a été téléchargée au format PDF",
        });
      });
    });
  };

  const filteredProducts = products.filter(
    (product) => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.subcategory && product.subcategory.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const addSolution = (solutionId: string) => {
    const solutionToAdd = availableSolutions.find(s => s.id === solutionId);
    if (!solutionToAdd) return;

    // Check if solution already exists in the offer
    if (offer.solutions.some(s => s.id === solutionId)) {
      toast({
        title: "Solution déjà ajoutée",
        description: "Cette solution est déjà présente dans l'offre",
        variant: "destructive"
      });
      return;
    }

    // Add solution to the offer
    setOffer({
      ...offer,
      solutions: [...offer.solutions, solutionToAdd]
    });

    // Add the solution's products to the offer if they don't already exist
    const newProducts = solutionToAdd.products.filter(
      product => !offer.products.some(p => p.id === product.id)
    );

    if (newProducts.length > 0) {
      setOffer(prev => ({
        ...prev,
        products: [...prev.products, ...newProducts]
      }));

      toast({
        title: "Solution ajoutée",
        description: `${solutionToAdd.name} et ${newProducts.length} produit(s) associés ont été ajoutés à l'offre`,
      });
    } else {
      toast({
        title: "Solution ajoutée",
        description: `${solutionToAdd.name} a été ajoutée à l'offre`,
      });
    }
  };

  const removeSolution = (solutionId: string) => {
    // Remove the solution
    setOffer({
      ...offer,
      solutions: offer.solutions.filter(s => s.id !== solutionId)
    });

    toast({
      title: "Solution retirée",
      description: "La solution a été retirée de l'offre",
    });
  };

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

        <div className="hidden md:flex justify-between mb-8">
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
                {index === 2 && "Solutions métiers"}
                {index === 3 && "Sélection produits"}
                {index === 4 && "Personnalisation"}
                {index === 5 && "Résumé et finalisation"}
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
        
        {/* Mobile stepper */}
        <div className="flex md:hidden justify-between items-center mb-8">
          <div className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                "bg-paritel-primary text-white"
              }`}
            >
              {currentStep}
            </div>
            <div className="ml-3">
              <div className="font-medium">
                {currentStep === 1 && "Informations client"}
                {currentStep === 2 && "Expression des besoins"}
                {currentStep === 3 && "Solutions métiers"}
                {currentStep === 4 && "Sélection produits"}
                {currentStep === 5 && "Personnalisation"}
                {currentStep === 6 && "Résumé et finalisation"}
              </div>
              <div className="text-xs text-gray-500">Étape {currentStep} sur {totalSteps}</div>
            </div>
          </div>
          <div className="text-xs font-medium bg-gray-100 py-1 px-2 rounded-full">
            {Math.round((currentStep / totalSteps) * 100)}%
          </div>
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

        {/* Step 3: Business Solutions */}
        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Solutions métiers</CardTitle>
              <CardDescription>
                Sélectionnez les solutions métiers adaptées aux besoins du client
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availableSolutions.map(solution => (
                    <div 
                      key={solution.id}
                      className={`border rounded-lg p-4 hover:border-paritel-primary cursor-pointer transition-colors
                        ${offer.solutions.some(s => s.id === solution.id) ? 'bg-paritel-accent/10 border-paritel-primary' : ''}
                      `}
                      onClick={() => offer.solutions.some(s => s.id === solution.id) 
                        ? removeSolution(solution.id) 
                        : addSolution(solution.id)
                      }
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{solution.name}</h3>
                        {offer.solutions.some(s => s.id === solution.id) ? (
                          <div className="bg-paritel-primary text-white text-xs px-2 py-1 rounded">
                            Sélectionnée
                          </div>
                        ) : null}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{solution.description}</p>
                      <div className="text-xs text-gray-500">
                        {solution.products.length} produit{solution.products.length > 1 ? 's' : ''}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          {currentStep > 1 ? (
            <Button
              variant="outline"
              onClick={goToPreviousStep}
              className="flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Précédent
            </Button>
          ) : (
            <div></div>
          )}

          {currentStep < totalSteps ? (
            <Button
              onClick={goToNextStep}
              className="bg-paritel-primary hover:bg-paritel-dark flex items-center"
            >
              Suivant <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button
                variant="default"
                onClick={finalizOffer}
                className="bg-paritel-primary hover:bg-paritel-dark flex items-center"
              >
                <FileCheck className="w-4 h-4 mr-2" /> Finaliser l'offre
              </Button>
              <Button
                variant="outline"
                onClick={downloadOffer}
                className="flex items-center"
              >
                <Download className="w-4 h-4 mr-2" /> Télécharger PDF
              </Button>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default CreateOffer;
