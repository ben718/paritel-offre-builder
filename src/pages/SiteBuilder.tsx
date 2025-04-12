
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import {
  Wrench,
  PanelLeft,
  Palette,
  Columns,
  LayoutGrid,
  Rows,
  Type,
  Image,
  FormInput,
  FileCode,
  Database,
  Table2,
  ChartBar,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  Save,
  Trash2,
  Copy,
  Undo2,
  Redo2,
  Play,
  Plus,
  Check,
  X,
  Rocket,
  ChevronsUp,
  CircleDot,
  Square,
  PaintBucket,
} from "lucide-react";

const SiteBuilder = () => {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const handleSave = () => {
    toast({
      title: "Modifications enregistrées",
      description: "Vos modifications ont été enregistrées avec succès.",
      variant: "default",
    });
  };

  return (
    <MainLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Concepteur de Site</h1>
            <p className="text-muted-foreground">
              Modifiez l'interface utilisateur sans écrire de code
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => setViewMode('desktop')}>
              <Monitor className={`h-4 w-4 ${viewMode === 'desktop' ? 'text-primary' : 'text-muted-foreground'}`} />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setViewMode('tablet')}>
              <Tablet className={`h-4 w-4 ${viewMode === 'tablet' ? 'text-primary' : 'text-muted-foreground'}`} />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setViewMode('mobile')}>
              <Smartphone className={`h-4 w-4 ${viewMode === 'mobile' ? 'text-primary' : 'text-muted-foreground'}`} />
            </Button>
            <Button variant="outline" size="sm">
              <Undo2 className="h-4 w-4 mr-1" /> Annuler
            </Button>
            <Button variant="outline" size="sm">
              <Redo2 className="h-4 w-4 mr-1" /> Refaire
            </Button>
            <Button variant="default" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" /> Enregistrer
            </Button>
            <Button variant="outline">
              <Play className="h-4 w-4 mr-2" /> Aperçu
            </Button>
          </div>
        </div>

        <div className="flex h-[calc(100vh-200px)]">
          {/* Left sidebar - Components */}
          <div className="w-64 border-r pr-4 overflow-y-auto">
            <h3 className="text-sm font-semibold mb-3">Composants</h3>
            <div className="space-y-1">
              <div className="flex items-center p-2 rounded-md hover:bg-muted cursor-move">
                <LayoutGrid className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">Section</span>
              </div>
              <div className="flex items-center p-2 rounded-md hover:bg-muted cursor-move">
                <Columns className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">Colonnes</span>
              </div>
              <div className="flex items-center p-2 rounded-md hover:bg-muted cursor-move">
                <Type className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">Texte</span>
              </div>
              <div className="flex items-center p-2 rounded-md hover:bg-muted cursor-move">
                <Image className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">Image</span>
              </div>
              <div className="flex items-center p-2 rounded-md hover:bg-muted cursor-move">
                <Square className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">Bouton</span>
              </div>
              <div className="flex items-center p-2 rounded-md hover:bg-muted cursor-move">
                <FormInput className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">Formulaire</span>
              </div>
              <div className="flex items-center p-2 rounded-md hover:bg-muted cursor-move">
                <Table2 className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">Tableau</span>
              </div>
              <div className="flex items-center p-2 rounded-md hover:bg-muted cursor-move">
                <ChartBar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">Graphique</span>
              </div>
              <div className="flex items-center p-2 rounded-md hover:bg-muted cursor-move">
                <FileCode className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">Personnalisé</span>
              </div>
            </div>

            <Separator className="my-4" />
            
            <h3 className="text-sm font-semibold mb-3">Pages</h3>
            <div className="space-y-1">
              <div className="flex items-center justify-between p-2 rounded-md hover:bg-muted">
                <span className="text-sm">Tableau de bord</span>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between p-2 rounded-md hover:bg-muted">
                <span className="text-sm">Produits</span>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between p-2 rounded-md hover:bg-muted">
                <span className="text-sm">Solutions</span>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between p-2 rounded-md hover:bg-muted">
                <span className="text-sm">Partenaires</span>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Middle - Canvas */}
          <div className={`flex-1 border-r overflow-y-auto p-4 ${
            viewMode === 'mobile' ? 'max-w-[375px] mx-auto' : 
            viewMode === 'tablet' ? 'max-w-[768px] mx-auto' : 'w-full'
          }`}>
            <div className="border border-dashed border-gray-300 rounded-lg h-full flex items-center justify-center p-4 bg-gray-50">
              <div className="text-center">
                <LayoutGrid className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                <p className="text-muted-foreground">Glissez et déposez des composants ici pour commencer</p>
                <Button variant="outline" className="mt-4">
                  <Plus className="h-4 w-4 mr-2" /> Ajouter une section
                </Button>
              </div>
            </div>
          </div>

          {/* Right sidebar - Properties */}
          <div className="w-72 pl-4 overflow-y-auto">
            <Tabs defaultValue="properties">
              <TabsList className="w-full">
                <TabsTrigger value="properties" className="flex-1">Propriétés</TabsTrigger>
                <TabsTrigger value="styles" className="flex-1">Styles</TabsTrigger>
                <TabsTrigger value="advanced" className="flex-1">Avancé</TabsTrigger>
              </TabsList>
              
              <TabsContent value="properties">
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm">Propriétés du composant</CardTitle>
                    <CardDescription className="text-xs">Sélectionnez un élément pour modifier ses propriétés</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="element-id">ID</Label>
                      <Input id="element-id" placeholder="identifier" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="element-class">Classes CSS</Label>
                      <Input id="element-class" placeholder="class1 class2" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="element-content">Contenu</Label>
                      <Textarea id="element-content" placeholder="Texte du composant" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="element-link">Lien</Label>
                      <Input id="element-link" placeholder="https://" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="element-visible" />
                      <Label htmlFor="element-visible">Visible</Label>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="styles">
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm">Styles</CardTitle>
                    <CardDescription className="text-xs">Personnaliser l'apparence</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Couleurs</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <Label className="text-xs">Arrière-plan</Label>
                          <div className="flex">
                            <Input type="text" placeholder="#ffffff" className="rounded-r-none" />
                            <div className="w-10 h-9 border border-l-0 rounded-r-md flex items-center justify-center bg-white">
                              <PaintBucket className="h-5 w-5 text-muted-foreground" />
                            </div>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Texte</Label>
                          <div className="flex">
                            <Input type="text" placeholder="#000000" className="rounded-r-none" />
                            <div className="w-10 h-9 border border-l-0 rounded-r-md flex items-center justify-center bg-white">
                              <PaintBucket className="h-5 w-5 text-muted-foreground" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Dimensions</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <Label className="text-xs">Largeur</Label>
                          <Input type="text" placeholder="100%" />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Hauteur</Label>
                          <Input type="text" placeholder="auto" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Typographie</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Police" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sans-serif">Sans-serif</SelectItem>
                          <SelectItem value="serif">Serif</SelectItem>
                          <SelectItem value="mono">Monospace</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        <div className="space-y-1">
                          <Label className="text-xs">Taille</Label>
                          <Input type="text" placeholder="16px" />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Poids</Label>
                          <Input type="text" placeholder="400" />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Hauteur</Label>
                          <Input type="text" placeholder="1.5" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="advanced">
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm">Paramètres avancés</CardTitle>
                    <CardDescription className="text-xs">Configuration JSON et événements</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="custom-js">JavaScript personnalisé</Label>
                      <Textarea 
                        id="custom-js" 
                        className="font-mono text-xs"
                        placeholder="// Ajouter du code JavaScript"
                        rows={4}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="custom-css">CSS personnalisé</Label>
                      <Textarea 
                        id="custom-css" 
                        className="font-mono text-xs"
                        placeholder="/* Ajouter du CSS personnalisé */"
                        rows={4}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="data-binding">Liaison de données</Label>
                      <Textarea 
                        id="data-binding" 
                        className="font-mono text-xs"
                        placeholder='{"source": "api", "path": "data.items"}'
                        rows={4}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SiteBuilder;
