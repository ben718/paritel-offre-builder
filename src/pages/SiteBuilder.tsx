
import React, { useState, useRef, useEffect } from "react";
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
  Move,
  Pencil,
} from "lucide-react";

// Types for our components
interface PageComponent {
  id: string;
  type: string;
  content: string;
  styles: {
    backgroundColor?: string;
    color?: string;
    width?: string;
    height?: string;
    fontSize?: string;
    fontWeight?: string;
    lineHeight?: string;
    fontFamily?: string;
  };
  properties: {
    id?: string;
    className?: string;
    link?: string;
    visible?: boolean;
  };
}

interface Section {
  id: string;
  components: PageComponent[];
}

// Component Type Definitions
const componentTypes = [
  { type: "section", icon: LayoutGrid, label: "Section" },
  { type: "columns", icon: Columns, label: "Colonnes" },
  { type: "text", icon: Type, label: "Texte" },
  { type: "image", icon: Image, label: "Image" },
  { type: "button", icon: Square, label: "Bouton" },
  { type: "form", icon: FormInput, label: "Formulaire" },
  { type: "table", icon: Table2, label: "Tableau" },
  { type: "chart", icon: ChartBar, label: "Graphique" },
  { type: "custom", icon: FileCode, label: "Personnalisé" },
];

// Initial component templates
const initialComponentTemplates = {
  section: {
    type: "section",
    content: "",
    styles: {
      backgroundColor: "#f9fafb",
      width: "100%",
      height: "auto",
      padding: "20px"
    },
    properties: {
      className: "section",
      visible: true
    }
  },
  text: {
    type: "text",
    content: "Texte par défaut",
    styles: {
      color: "#000000",
      fontSize: "16px",
      fontWeight: "400",
      lineHeight: "1.5",
      fontFamily: "sans-serif"
    },
    properties: {
      className: "text",
      visible: true
    }
  },
  button: {
    type: "button",
    content: "Bouton",
    styles: {
      backgroundColor: "#3b82f6",
      color: "#ffffff",
      fontSize: "14px",
      fontWeight: "500",
      padding: "8px 16px",
      borderRadius: "4px"
    },
    properties: {
      className: "button",
      link: "#",
      visible: true
    }
  },
  image: {
    type: "image",
    content: "https://via.placeholder.com/300x200",
    styles: {
      width: "300px",
      height: "auto"
    },
    properties: {
      className: "image",
      visible: true
    }
  }
};

const SiteBuilder = () => {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<PageComponent | null>(null);
  const [history, setHistory] = useState<Section[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedComponent, setDraggedComponent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  
  // Initialize with saved sections or a demo section
  useEffect(() => {
    const savedLayout = localStorage.getItem('siteBuilderLayout');
    if (savedLayout) {
      try {
        const parsedLayout = JSON.parse(savedLayout);
        setSections(parsedLayout);
        saveToHistory(parsedLayout);
      } catch (error) {
        console.error('Error loading saved layout:', error);
        addNewSection();
      }
    } else if (sections.length === 0) {
      addNewSection();
    }
  }, []);
  
  // Save history for undo/redo
  const saveToHistory = (newSections: Section[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(newSections)));
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };
  
  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setSections(JSON.parse(JSON.stringify(history[historyIndex - 1])));
    }
  };
  
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setSections(JSON.parse(JSON.stringify(history[historyIndex + 1])));
    }
  };
  
  // Add a new section
  const addNewSection = () => {
    const newSection: Section = {
      id: `section-${Date.now()}`,
      components: []
    };
    
    const newSections = [...sections, newSection];
    setSections(newSections);
    saveToHistory(newSections);
    
    toast({
      title: "Section ajoutée",
      description: "Une nouvelle section a été ajoutée",
    });
  };
  
  // Add a component to a section
  const addComponent = (sectionId: string, componentType: string) => {
    const template = initialComponentTemplates[componentType as keyof typeof initialComponentTemplates];
    if (!template) return;
    
    const newComponent: PageComponent = {
      id: `${componentType}-${Date.now()}`,
      ...JSON.parse(JSON.stringify(template))
    };
    
    const newSections = sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          components: [...section.components, newComponent]
        };
      }
      return section;
    });
    
    setSections(newSections);
    saveToHistory(newSections);
    setSelectedComponent(newComponent);
  };
  
  // Handle component selection
  const selectComponent = (component: PageComponent) => {
    setSelectedComponent(component);
  };
  
  // Update component properties
  const updateComponentProperties = (field: string, value: any) => {
    if (!selectedComponent) return;
    
    const newSections = sections.map(section => {
      return {
        ...section,
        components: section.components.map(component => {
          if (component.id === selectedComponent.id) {
            return {
              ...component,
              properties: {
                ...component.properties,
                [field]: value
              }
            };
          }
          return component;
        })
      };
    });
    
    setSections(newSections);
    setSelectedComponent(prevSelected => {
      if (!prevSelected) return null;
      return {
        ...prevSelected,
        properties: {
          ...prevSelected.properties,
          [field]: value
        }
      };
    });
  };
  
  // Update component styles
  const updateComponentStyles = (field: string, value: any) => {
    if (!selectedComponent) return;
    
    const newSections = sections.map(section => {
      return {
        ...section,
        components: section.components.map(component => {
          if (component.id === selectedComponent.id) {
            return {
              ...component,
              styles: {
                ...component.styles,
                [field]: value
              }
            };
          }
          return component;
        })
      };
    });
    
    setSections(newSections);
    setSelectedComponent(prevSelected => {
      if (!prevSelected) return null;
      return {
        ...prevSelected,
        styles: {
          ...prevSelected.styles,
          [field]: value
        }
      };
    });
  };
  
  // Update component content
  const updateComponentContent = (content: string) => {
    if (!selectedComponent) return;
    
    const newSections = sections.map(section => {
      return {
        ...section,
        components: section.components.map(component => {
          if (component.id === selectedComponent.id) {
            return {
              ...component,
              content
            };
          }
          return component;
        })
      };
    });
    
    setSections(newSections);
    setSelectedComponent(prevSelected => {
      if (!prevSelected) return null;
      return {
        ...prevSelected,
        content
      };
    });
  };
  
  // Delete a component
  const deleteComponent = (componentId: string) => {
    const newSections = sections.map(section => {
      return {
        ...section,
        components: section.components.filter(component => component.id !== componentId)
      };
    });
    
    setSections(newSections);
    saveToHistory(newSections);
    setSelectedComponent(null);
    
    toast({
      title: "Composant supprimé",
      description: "Le composant a été supprimé",
    });
  };
  
  // Handle drag start for component palette
  const handleDragStart = (e: React.DragEvent, componentType: string) => {
    setIsDragging(true);
    setDraggedComponent(componentType);
    e.dataTransfer.setData('componentType', componentType);
  };
  
  // Handle drag over for sections
  const handleDragOver = (e: React.DragEvent, sectionId: string) => {
    e.preventDefault();
  };
  
  // Handle drop for sections
  const handleDrop = (e: React.DragEvent, sectionId: string) => {
    e.preventDefault();
    const componentType = e.dataTransfer.getData('componentType');
    if (componentType) {
      addComponent(sectionId, componentType);
    }
    setIsDragging(false);
    setDraggedComponent(null);
  };
  
  // Save the current layout
  const handleSave = () => {
    setIsLoading(true);
    
    // Simulate saving to server
    setTimeout(() => {
      localStorage.setItem('siteBuilderLayout', JSON.stringify(sections));
      
      setIsLoading(false);
      toast({
        title: "Modifications enregistrées",
        description: "Vos modifications ont été enregistrées avec succès.",
        variant: "default",
      });
    }, 800);
  };
  
  // Render a component based on its type
  const renderComponent = (component: PageComponent) => {
    const isSelected = selectedComponent?.id === component.id;
    const styleObj = component.styles || {};
    const className = `relative ${isSelected ? 'ring-2 ring-primary' : ''}`;
    
    switch (component.type) {
      case 'text':
        return (
          <div 
            className={className}
            style={styleObj}
            onClick={() => selectComponent(component)}
          >
            {component.content}
            {isSelected && (
              <div className="absolute top-0 right-0 flex bg-primary text-white text-xs">
                <button
                  className="p-1"
                  onClick={() => setSelectedComponent(component)}
                >
                  <Pencil size={12} />
                </button>
                <button
                  className="p-1"
                  onClick={() => deleteComponent(component.id)}
                >
                  <Trash2 size={12} />
                </button>
              </div>
            )}
          </div>
        );
      case 'button':
        return (
          <div
            className={className}
            onClick={() => selectComponent(component)}
          >
            <button
              style={styleObj}
              className="py-2 px-4 rounded"
            >
              {component.content}
            </button>
            {isSelected && (
              <div className="absolute top-0 right-0 flex bg-primary text-white text-xs">
                <button
                  className="p-1"
                  onClick={() => setSelectedComponent(component)}
                >
                  <Pencil size={12} />
                </button>
                <button
                  className="p-1"
                  onClick={() => deleteComponent(component.id)}
                >
                  <Trash2 size={12} />
                </button>
              </div>
            )}
          </div>
        );
      case 'image':
        return (
          <div
            className={className}
            onClick={() => selectComponent(component)}
          >
            <img
              src={component.content}
              alt="Component"
              style={styleObj}
            />
            {isSelected && (
              <div className="absolute top-0 right-0 flex bg-primary text-white text-xs">
                <button
                  className="p-1"
                  onClick={() => setSelectedComponent(component)}
                >
                  <Pencil size={12} />
                </button>
                <button
                  className="p-1"
                  onClick={() => deleteComponent(component.id)}
                >
                  <Trash2 size={12} />
                </button>
              </div>
            )}
          </div>
        );
      default:
        return (
          <div 
            className={className}
            style={styleObj}
            onClick={() => selectComponent(component)}
          >
            {component.content || `Composant ${component.type}`}
            {isSelected && (
              <div className="absolute top-0 right-0 flex bg-primary text-white text-xs">
                <button
                  className="p-1"
                  onClick={() => setSelectedComponent(component)}
                >
                  <Pencil size={12} />
                </button>
                <button
                  className="p-1"
                  onClick={() => deleteComponent(component.id)}
                >
                  <Trash2 size={12} />
                </button>
              </div>
            )}
          </div>
        );
    }
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
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleUndo}
              disabled={historyIndex <= 0}
            >
              <Undo2 className="h-4 w-4 mr-1" /> Annuler
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
            >
              <Redo2 className="h-4 w-4 mr-1" /> Refaire
            </Button>
            <Button variant="default" onClick={handleSave} disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="h-4 w-4 mr-2 animate-spin border-2 border-current border-t-transparent rounded-full" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" /> Enregistrer
                </>
              )}
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
              {componentTypes.map((component) => (
                <div 
                  key={component.type}
                  className="flex items-center p-2 rounded-md hover:bg-muted cursor-move"
                  draggable
                  onDragStart={(e) => handleDragStart(e, component.type)}
                >
                  <component.icon className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{component.label}</span>
                </div>
              ))}
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
          <div 
            ref={canvasRef}
            className={`flex-1 border-r overflow-y-auto p-4 ${
              viewMode === 'mobile' ? 'max-w-[375px] mx-auto' : 
              viewMode === 'tablet' ? 'max-w-[768px] mx-auto' : 'w-full'
            }`}
          >
            {sections.length > 0 ? (
              sections.map((section) => (
                <div 
                  key={section.id}
                  className="border border-dashed border-gray-300 rounded-lg mb-4 p-4 bg-gray-50 min-h-[100px]"
                  onDragOver={(e) => handleDragOver(e, section.id)}
                  onDrop={(e) => handleDrop(e, section.id)}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-muted-foreground">Section</span>
                    <div className="flex space-x-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-5 w-5 p-0"
                        onClick={() => {
                          // Handle section settings
                        }}
                      >
                        <ChevronsUp className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-5 w-5 p-0"
                        onClick={() => {
                          // Handle delete section
                          const newSections = sections.filter(s => s.id !== section.id);
                          setSections(newSections);
                          saveToHistory(newSections);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  {section.components.length > 0 ? (
                    <div className="space-y-2">
                      {section.components.map((component) => (
                        <div key={component.id} className="p-1">
                          {renderComponent(component)}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div 
                      className="flex flex-col items-center justify-center text-center p-4"
                      onClick={() => {
                        // Open component menu
                      }}
                    >
                      <Plus className="h-8 w-8 text-gray-300 mb-2" />
                      <p className="text-sm text-muted-foreground">Déposez des composants ici ou cliquez pour ajouter</p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="border border-dashed border-gray-300 rounded-lg h-full flex items-center justify-center p-4 bg-gray-50">
                <div className="text-center">
                  <LayoutGrid className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-muted-foreground">Glissez et déposez des composants ici pour commencer</p>
                  <Button variant="outline" className="mt-4" onClick={addNewSection}>
                    <Plus className="h-4 w-4 mr-2" /> Ajouter une section
                  </Button>
                </div>
              </div>
            )}
            
            {/* Add section button at the bottom */}
            {sections.length > 0 && (
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={addNewSection}
              >
                <Plus className="h-4 w-4 mr-2" /> Ajouter une section
              </Button>
            )}
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
                    <CardDescription className="text-xs">
                      {selectedComponent 
                        ? `Édition de ${componentTypes.find(c => c.type === selectedComponent.type)?.label || selectedComponent.type}`
                        : "Sélectionnez un élément pour modifier ses propriétés"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {selectedComponent ? (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="element-id">ID</Label>
                          <Input 
                            id="element-id" 
                            value={selectedComponent.properties.id || ""} 
                            onChange={(e) => updateComponentProperties('id', e.target.value)}
                            placeholder="identifier" 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="element-class">Classes CSS</Label>
                          <Input 
                            id="element-class" 
                            value={selectedComponent.properties.className || ""} 
                            onChange={(e) => updateComponentProperties('className', e.target.value)}
                            placeholder="class1 class2" 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="element-content">Contenu</Label>
                          <Textarea 
                            id="element-content" 
                            value={selectedComponent.content || ""} 
                            onChange={(e) => updateComponentContent(e.target.value)}
                            placeholder="Texte du composant" 
                          />
                        </div>
                        {selectedComponent.type === 'button' && (
                          <div className="space-y-2">
                            <Label htmlFor="element-link">Lien</Label>
                            <Input 
                              id="element-link" 
                              value={selectedComponent.properties.link || ""} 
                              onChange={(e) => updateComponentProperties('link', e.target.value)}
                              placeholder="https://" 
                            />
                          </div>
                        )}
                        <div className="flex items-center space-x-2">
                          <Switch 
                            id="element-visible" 
                            checked={selectedComponent.properties.visible !== false}
                            onCheckedChange={(checked) => updateComponentProperties('visible', checked)}
                          />
                          <Label htmlFor="element-visible">Visible</Label>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center p-4 text-muted-foreground">
                        <Type className="h-8 w-8 mb-2" />
                        <p>Sélectionnez un élément dans la zone d'édition pour modifier ses propriétés</p>
                      </div>
                    )}
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
                    {selectedComponent ? (
                      <>
                        <div className="space-y-2">
                          <Label>Couleurs</Label>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                              <Label className="text-xs">Arrière-plan</Label>
                              <div className="flex">
                                <Input 
                                  type="text" 
                                  value={selectedComponent.styles.backgroundColor || ""}
                                  onChange={(e) => updateComponentStyles('backgroundColor', e.target.value)}
                                  placeholder="#ffffff" 
                                  className="rounded-r-none" 
                                />
                                <div className="w-10 h-9 border border-l-0 rounded-r-md flex items-center justify-center bg-white">
                                  <input 
                                    type="color"
                                    value={selectedComponent.styles.backgroundColor || "#ffffff"}
                                    onChange={(e) => updateComponentStyles('backgroundColor', e.target.value)}
                                    className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                                  />
                                  <PaintBucket className="h-5 w-5 text-muted-foreground" />
                                </div>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Texte</Label>
                              <div className="flex">
                                <Input 
                                  type="text" 
                                  value={selectedComponent.styles.color || ""}
                                  onChange={(e) => updateComponentStyles('color', e.target.value)}
                                  placeholder="#000000" 
                                  className="rounded-r-none" 
                                />
                                <div className="w-10 h-9 border border-l-0 rounded-r-md flex items-center justify-center bg-white">
                                  <input 
                                    type="color"
                                    value={selectedComponent.styles.color || "#000000"}
                                    onChange={(e) => updateComponentStyles('color', e.target.value)}
                                    className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                                  />
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
                              <Input 
                                type="text" 
                                value={selectedComponent.styles.width || ""}
                                onChange={(e) => updateComponentStyles('width', e.target.value)}
                                placeholder="100%" 
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Hauteur</Label>
                              <Input 
                                type="text" 
                                value={selectedComponent.styles.height || ""}
                                onChange={(e) => updateComponentStyles('height', e.target.value)}
                                placeholder="auto" 
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Typographie</Label>
                          <Select 
                            value={selectedComponent.styles.fontFamily || "sans-serif"}
                            onValueChange={(value) => updateComponentStyles('fontFamily', value)}
                          >
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
                              <Input 
                                type="text" 
                                value={selectedComponent.styles.fontSize || ""}
                                onChange={(e) => updateComponentStyles('fontSize', e.target.value)}
                                placeholder="16px" 
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Poids</Label>
                              <Input 
                                type="text" 
                                value={selectedComponent.styles.fontWeight || ""}
                                onChange={(e) => updateComponentStyles('fontWeight', e.target.value)}
                                placeholder="400" 
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Hauteur</Label>
                              <Input 
                                type="text" 
                                value={selectedComponent.styles.lineHeight || ""}
                                onChange={(e) => updateComponentStyles('lineHeight', e.target.value)}
                                placeholder="1.5" 
                              />
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center p-4 text-muted-foreground">
                        <Palette className="h-8 w-8 mb-2" />
                        <p>Sélectionnez un élément dans la zone d'édition pour modifier ses styles</p>
                      </div>
                    )}
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
                    {selectedComponent ? (
                      <>
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
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center p-4 text-muted-foreground">
                        <Wrench className="h-8 w-8 mb-2" />
                        <p>Sélectionnez un élément dans la zone d'édition pour accéder aux paramètres avancés</p>
                      </div>
                    )}
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
