
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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
  Download
} from "lucide-react";
import { useState } from "react";

const CreateOffer = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

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
            <Button variant="outline">
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
                    <FormLabel>Nom de la société</FormLabel>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input className="pl-9" placeholder="Nom de la société" />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <FormLabel>Secteur d'activité</FormLabel>
                    <Select defaultValue="business">
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
                    <FormLabel>Adresse</FormLabel>
                    <Textarea placeholder="Adresse complète" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-1">
                    <FormLabel>Nom du contact</FormLabel>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input className="pl-9" placeholder="Nom du contact" />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <FormLabel>Téléphone</FormLabel>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input className="pl-9" placeholder="Numéro de téléphone" />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <FormLabel>Email</FormLabel>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input className="pl-9" placeholder="Adresse email" />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <FormLabel>Fonction</FormLabel>
                    <Input placeholder="Fonction du contact" />
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
                <FormLabel>Contexte de la demande</FormLabel>
                <Textarea 
                  placeholder="Décrivez la situation actuelle et le contexte" 
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="space-y-1">
                <FormLabel>Besoins exprimés</FormLabel>
                <Textarea 
                  placeholder="Listez les besoins exprimés par le client" 
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="space-y-1">
                <FormLabel>Contraintes spécifiques</FormLabel>
                <Textarea 
                  placeholder="Précisez les contraintes à prendre en compte (budget, délais, techniques...)" 
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <FormLabel>Budget estimé</FormLabel>
                  <Input placeholder="€" type="number" />
                </div>
                
                <div className="space-y-1">
                  <FormLabel>Délai souhaité</FormLabel>
                  <Input placeholder="Date souhaitée" type="date" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Products Selection (simplified) */}
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
                      <div className="border border-gray-200 rounded-lg p-4 hover:border-paritel-primary cursor-pointer">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium">Pack Hôtellerie Premium</h3>
                          <div className="bg-paritel-primary text-white text-xs px-2 py-1 rounded">Recommandé</div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">Solution complète pour les hôtels incluant wifi, téléphonie et TV interactive.</p>
                        <div className="text-xs text-gray-500">5 produits inclus</div>
                      </div>
                      
                      <div className="border border-gray-200 rounded-lg p-4 hover:border-paritel-primary cursor-pointer">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium">Pack PME Cloud</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">Solution complète pour les PME avec communications unifiées et cybersécurité.</p>
                        <div className="text-xs text-gray-500">4 produits inclus</div>
                      </div>
                      
                      {/* More packs would go here */}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="products">
                    <div className="flex mb-4">
                      <Input 
                        className="max-w-sm" 
                        placeholder="Rechercher un produit..." 
                      />
                    </div>
                    <div className="space-y-2">
                      {/* Sample products - would be populated dynamically */}
                      <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div className="flex items-center">
                          <Package className="h-5 w-5 mr-3 text-paritel-primary" />
                          <div>
                            <h4 className="font-medium">FTTO Dédie 1Gb/s</h4>
                            <p className="text-xs text-gray-500">Réseau - Fibre</p>
                          </div>
                        </div>
                        <Button size="sm">Ajouter</Button>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div className="flex items-center">
                          <Package className="h-5 w-5 mr-3 text-paritel-primary" />
                          <div>
                            <h4 className="font-medium">Firewall Fortinet UTM</h4>
                            <p className="text-xs text-gray-500">Cybersécurité</p>
                          </div>
                        </div>
                        <Button size="sm">Ajouter</Button>
                      </div>
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
                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center">
                      <Package className="h-5 w-5 mr-3 text-paritel-primary" />
                      <div>
                        <h4 className="font-medium">Pack Hôtellerie Premium</h4>
                        <p className="text-xs text-gray-500">Pack complet - 5 produits</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="text-destructive">Retirer</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Steps 4-5 would be added in a similar way but omitting for brevity */}
        {currentStep === 4 && (
          <Card>
            <CardHeader>
              <CardTitle>Personnalisation de l'offre</CardTitle>
              <CardDescription>
                Ajustez les quantités, prix et ajoutez des notes spécifiques
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-500 py-10">
                Interface de personnalisation (simplifiée pour cet exemple)
              </p>
            </CardContent>
          </Card>
        )}
        
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
                <div className="text-center space-y-4 py-8">
                  <FileCheck className="h-16 w-16 mx-auto text-green-500" />
                  <h2 className="text-xl font-semibold">Offre prête à être générée</h2>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Votre offre pour Hôtel Le Majestic a été configurée et est prête à être générée en document.
                  </p>
                </div>
                
                <div className="flex justify-center space-x-4">
                  <Button variant="outline" className="w-40">
                    <Save className="mr-2 h-4 w-4" />
                    Enregistrer
                  </Button>
                  <Button className="w-40 bg-paritel-primary">
                    <Download className="mr-2 h-4 w-4" />
                    Générer PDF
                  </Button>
                </div>
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
