
import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  AlertCircle, 
  ChevronLeft, 
  Download, 
  FileText, 
  Printer, 
  Search, 
  SlidersHorizontal, 
  Star, 
  Trash,
  Check,
  X,
  Plus,
  Minus
} from "lucide-react";
import { SelectableProductCard } from "@/components/products/SelectableProductCard";
import { products as productData } from "@/data/productData";

interface ComparisonProduct {
  id: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  rating: number;
  specifications: Record<string, string | boolean>;
  features: string[];
  image?: string;
}

const ProductComparison = () => {
  const [selectedProducts, setSelectedProducts] = useState<ComparisonProduct[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSelector, setShowSelector] = useState(true);
  const [specCategories, setSpecCategories] = useState<string[]>([]);
  
  // Initialize with products from data
  useEffect(() => {
    // Generate spec categories from all products
    const allSpecs = new Set<string>();
    
    productData.forEach(product => {
      if (product.specifications) {
        Object.keys(product.specifications).forEach(key => {
          allSpecs.add(key);
        });
      }
    });
    
    setSpecCategories(Array.from(allSpecs));
  }, []);
  
  // Handle adding product to comparison
  const handleAddProduct = (product: ComparisonProduct) => {
    if (selectedProducts.length < 4) {
      setSelectedProducts([...selectedProducts, product]);
    }
  };
  
  // Handle removing product from comparison
  const handleRemoveProduct = (productId: string) => {
    setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
  };
  
  // Handle clearing all products
  const handleClearAll = () => {
    setSelectedProducts([]);
    setShowSelector(true);
  };
  
  // Filter products by search term
  const filteredProducts = productData.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Determine if a product is already selected
  const isProductSelected = (productId: string) => {
    return selectedProducts.some(p => p.id === productId);
  };

  // Render specification value
  const renderSpecValue = (value: any) => {
    if (typeof value === 'boolean') {
      return value ? <Check className="h-5 w-5 text-green-500 mx-auto" /> : <X className="h-5 w-5 text-red-500 mx-auto" />;
    } else if (value === undefined || value === null) {
      return <Minus className="h-5 w-5 text-gray-400 mx-auto" />;
    } else {
      return value;
    }
  };
  
  // Find difference in specs
  const getSpecClass = (spec: string) => {
    if (selectedProducts.length < 2) return "";
    
    const values = selectedProducts.map(p => p.specifications[spec]);
    const areAllSame = values.every(v => v === values[0]);
    
    if (!areAllSame) {
      return "bg-amber-50";
    }
    
    return "";
  };
  
  // Render empty placeholder cards
  const renderEmptyCards = () => {
    const count = 4 - selectedProducts.length;
    return Array.from({ length: count }).map((_, index) => (
      <div 
        key={`empty-${index}`} 
        className="border border-dashed border-gray-200 rounded-lg flex items-center justify-center p-6 min-h-[150px]"
      >
        <Button 
          variant="outline" 
          className="text-gray-500"
          onClick={() => setShowSelector(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un produit
        </Button>
      </div>
    ));
  };
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Comparaison de produits</h1>
            <p className="text-muted-foreground">
              Comparez les spécifications et fonctionnalités de différents produits
            </p>
          </div>
        </div>
        
        {showSelector && selectedProducts.length < 4 ? (
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <CardTitle>Sélectionner des produits à comparer</CardTitle>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Rechercher un produit..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.slice(0, 12).map((product) => (
                  <SelectableProductCard
                    key={product.id}
                    product={product}
                    selected={isProductSelected(product.id)}
                    onSelect={() => handleAddProduct(product)}
                    disabled={isProductSelected(product.id) || selectedProducts.length >= 4}
                  />
                ))}
              </div>
              {filteredProducts.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Aucun produit trouvé
                </div>
              )}
              
              <div className="mt-6 flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setShowSelector(false)}
                  disabled={selectedProducts.length === 0}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Retour à la comparaison
                </Button>
                
                <div className="flex gap-2">
                  <Button
                    variant="destructive"
                    onClick={handleClearAll}
                    disabled={selectedProducts.length === 0}
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    Tout effacer
                  </Button>
                  
                  <Button
                    onClick={() => setShowSelector(false)}
                    disabled={selectedProducts.length === 0}
                    className="bg-paritel-primary"
                  >
                    Comparer {selectedProducts.length > 0 && `(${selectedProducts.length})`}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                disabled={selectedProducts.length === 0}
                onClick={() => setShowSelector(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter des produits
              </Button>
              
              <div className="flex gap-2">
                <Button variant="outline">
                  <Printer className="h-4 w-4 mr-2" />
                  Imprimer
                </Button>
                
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Exporter
                </Button>
                
                <Button 
                  variant="destructive"
                  onClick={handleClearAll} 
                  disabled={selectedProducts.length === 0}
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Tout effacer
                </Button>
              </div>
            </div>
            
            {selectedProducts.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Aucun produit sélectionné</h3>
                  <p className="text-gray-500 mb-6 text-center">
                    Veuillez sélectionner des produits pour les comparer
                  </p>
                  <Button onClick={() => setShowSelector(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Sélectionner des produits
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-0">
                  <Tabs defaultValue="specifications">
                    <div className="border-b">
                      <TabsList className="h-auto p-0">
                        <TabsTrigger 
                          value="specifications"
                          className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-paritel-primary data-[state=active]:shadow-none"
                        >
                          Spécifications
                        </TabsTrigger>
                        <TabsTrigger 
                          value="features"
                          className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-paritel-primary data-[state=active]:shadow-none"
                        >
                          Fonctionnalités
                        </TabsTrigger>
                      </TabsList>
                    </div>
                    
                    <ScrollArea className="h-[calc(100vh-300px)]">
                      <TabsContent value="specifications" className="m-0">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b bg-gray-50">
                              <th className="text-left p-4 font-medium w-[200px]">Produit</th>
                              {selectedProducts.map((product) => (
                                <th key={product.id} className="p-4 font-medium border-l">
                                  <div className="space-y-2">
                                    <div className="h-16 relative">
                                      <Button
                                        variant="ghost"
                                        className="absolute top-0 right-0 h-6 w-6 p-0 rounded-full text-gray-400 hover:text-red-500"
                                        onClick={() => handleRemoveProduct(product.id)}
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                      <div className="flex justify-center">
                                        {product.image ? (
                                          <img 
                                            src={product.image} 
                                            alt={product.name} 
                                            className="h-14 w-auto object-contain" 
                                          />
                                        ) : (
                                          <div className="h-14 w-14 bg-gray-100 rounded flex items-center justify-center text-gray-400">
                                            <FileText className="h-6 w-6" />
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                    <h3 className="font-medium text-center">
                                      {product.name}
                                    </h3>
                                    <div className="text-center">
                                      <Badge variant="outline" className="bg-gray-100 font-normal">
                                        {product.category}
                                      </Badge>
                                    </div>
                                    <div className="flex items-center justify-center text-amber-500">
                                      {Array.from({ length: 5 }).map((_, i) => (
                                        <Star
                                          key={i}
                                          className={`h-3 w-3 ${
                                            i < product.rating ? "fill-current" : "text-gray-300"
                                          }`}
                                        />
                                      ))}
                                    </div>
                                    <div className="text-center font-medium text-lg">
                                      {product.price.toLocaleString('fr-FR')} €
                                    </div>
                                  </div>
                                </th>
                              ))}
                              {renderEmptyCards().length > 0 && (
                                <th 
                                  colSpan={renderEmptyCards().length} 
                                  className="p-4 border-l font-normal text-center text-gray-500"
                                >
                                  <Button 
                                    variant="outline" 
                                    className="mx-auto"
                                    onClick={() => setShowSelector(true)}
                                  >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Ajouter un produit
                                  </Button>
                                </th>
                              )}
                            </tr>
                          </thead>
                          <tbody>
                            {specCategories.map((spec, index) => (
                              <tr 
                                key={spec} 
                                className={`border-b ${index % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'} ${getSpecClass(spec)}`}
                              >
                                <td className="p-4 font-medium">{spec}</td>
                                {selectedProducts.map((product) => (
                                  <td key={`${product.id}-${spec}`} className="p-4 text-center border-l">
                                    {renderSpecValue(product.specifications[spec])}
                                  </td>
                                ))}
                                {renderEmptyCards().length > 0 && (
                                  <td colSpan={renderEmptyCards().length} className="border-l"></td>
                                )}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </TabsContent>
                      
                      <TabsContent value="features" className="m-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
                          {selectedProducts.map((product) => (
                            <Card key={product.id}>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-lg">{product.name}</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <h4 className="font-medium mb-2">Caractéristiques principales</h4>
                                <ul className="space-y-2">
                                  {product.features.map((feature, index) => (
                                    <li key={index} className="flex">
                                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                                      <span>{feature}</span>
                                    </li>
                                  ))}
                                </ul>
                                
                                <Separator className="my-4" />
                                
                                <div className="flex justify-between items-center">
                                  <span className="font-medium text-lg">
                                    {product.price.toLocaleString('fr-FR')} €
                                  </span>
                                  <Button size="sm" className="bg-paritel-primary">
                                    Ajouter
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </TabsContent>
                    </ScrollArea>
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default ProductComparison;
