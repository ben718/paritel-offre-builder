
import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, ArrowLeft, ArrowRight, Check, X, Plus, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ComparisonProduct, transformProductToComparisonProduct } from "@/components/products/ExtendedProductType";
import { useToast } from "@/components/ui/use-toast";
import { products as initialProducts } from "@/data/productData";

const ProductComparison = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<ComparisonProduct[]>([]);
  const [availableProducts, setAvailableProducts] = useState<ComparisonProduct[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { toast } = useToast();

  // Initialize available products
  useEffect(() => {
    const transformedProducts = initialProducts.map(transformProductToComparisonProduct);
    setAvailableProducts(transformedProducts);
  }, []);

  // Filter available products based on search term and category
  const filteredProducts = availableProducts.filter(product => {
    const matchesSearch = searchTerm === "" || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === null || 
      product.category === selectedCategory;
    
    return matchesSearch && matchesCategory && !selectedProducts.some(p => p.id === product.id);
  });

  // Get all unique categories
  const categories = [...new Set(availableProducts.map(product => product.category))];

  // Get all unique specification keys from selected products
  const specificationKeys = Array.from(
    new Set(
      selectedProducts.flatMap(product => 
        Object.keys(product.specifications)
      )
    )
  ).sort();

  const addProductToComparison = (product: ComparisonProduct) => {
    if (selectedProducts.length >= 4) {
      toast({
        variant: "destructive",
        title: "Limite atteinte",
        description: "Vous ne pouvez comparer que 4 produits à la fois."
      });
      return;
    }
    
    setSelectedProducts([...selectedProducts, product]);
  };

  const removeProductFromComparison = (productId: string) => {
    setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
  };

  const clearComparison = () => {
    setSelectedProducts([]);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Comparaison de Produits</h1>
            <p className="text-muted-foreground mt-1">
              Comparez plusieurs produits côte à côte pour prendre la meilleure décision
            </p>
          </div>
        </div>

        {selectedProducts.length > 0 ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Button variant="outline" onClick={clearComparison}>Effacer la comparaison</Button>
              <p className="text-sm text-gray-500">{selectedProducts.length} produit(s) sélectionné(s)</p>
            </div>
            
            <Card>
              <CardHeader className="pb-4">
                <CardTitle>Comparaison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="min-w-[150px] px-4 py-2 text-left font-medium text-gray-500"></th>
                        {selectedProducts.map(product => (
                          <th key={product.id} className="min-w-[200px] px-4 py-2 text-center">
                            <div className="flex flex-col items-center space-y-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="self-end ml-auto text-gray-400 h-6 w-6 p-0"
                                onClick={() => removeProductFromComparison(product.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                              <div className="w-24 h-24 bg-gray-100 flex items-center justify-center rounded-md overflow-hidden mb-2">
                                <img 
                                  src={product.image} 
                                  alt={product.name} 
                                  className="max-w-full max-h-full object-contain"
                                />
                              </div>
                              <span className="font-semibold text-sm line-clamp-2">{product.name}</span>
                              <Badge className="bg-paritel-primary text-white text-xs">
                                {product.category}
                              </Badge>
                              {product.brand && (
                                <span className="text-xs text-gray-500">{product.brand}</span>
                              )}
                            </div>
                          </th>
                        ))}
                        {selectedProducts.length < 4 && (
                          <th className="min-w-[200px] px-4 py-2 text-center">
                            <div className="flex flex-col items-center justify-center h-full">
                              <div 
                                className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer hover:border-paritel-primary"
                                onClick={() => document.getElementById('product-selector')?.scrollIntoView({ behavior: 'smooth' })}
                              >
                                <Plus className="h-8 w-8 text-gray-400" />
                              </div>
                              <span className="text-sm text-gray-500 mt-2">Ajouter un produit</span>
                            </div>
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {/* Rating row */}
                      <tr className="border-b">
                        <td className="px-4 py-3 font-medium">Évaluation</td>
                        {selectedProducts.map(product => (
                          <td key={product.id} className="px-4 py-3 text-center">
                            {product.rating !== undefined ? (
                              <div className="flex items-center justify-center">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${i < Math.round(product.rating || 0) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                                  />
                                ))}
                                <span className="ml-1 text-sm">
                                  {product.rating.toFixed(1)}
                                </span>
                              </div>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                        ))}
                        {selectedProducts.length < 4 && <td></td>}
                      </tr>
                      
                      {/* Features row */}
                      <tr className="border-b">
                        <td className="px-4 py-3 font-medium">Caractéristiques</td>
                        {selectedProducts.map(product => (
                          <td key={product.id} className="px-4 py-3">
                            <ul className="list-disc pl-5 text-sm space-y-1">
                              {product.features.slice(0, 5).map((feature, index) => (
                                <li key={index} className="text-gray-700">{feature}</li>
                              ))}
                              {product.features.length > 5 && (
                                <li className="text-paritel-primary">+{product.features.length - 5} autres</li>
                              )}
                            </ul>
                          </td>
                        ))}
                        {selectedProducts.length < 4 && <td></td>}
                      </tr>
                      
                      {/* Specifications rows */}
                      {specificationKeys.map(key => (
                        <tr key={key} className="border-b">
                          <td className="px-4 py-2 font-medium text-sm capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </td>
                          {selectedProducts.map(product => (
                            <td key={product.id} className="px-4 py-2 text-center">
                              {typeof product.specifications[key] === 'boolean' ? (
                                product.specifications[key] === true ? (
                                  <Check className="h-5 w-5 text-green-500 mx-auto" />
                                ) : (
                                  <X className="h-5 w-5 text-red-500 mx-auto" />
                                )
                              ) : product.specifications[key] ? (
                                <span>{product.specifications[key]}</span>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                          ))}
                          {selectedProducts.length < 4 && <td></td>}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Aucun produit sélectionné</h2>
            <p className="text-gray-600 mb-4">Sélectionnez au moins deux produits pour lancer une comparaison</p>
          </div>
        )}

        <Separator />
        
        <div id="product-selector" className="space-y-4">
          <h2 className="text-xl font-semibold">Sélectionnez des produits à comparer</h2>
          
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher un produit..."
                className="w-full py-2 pl-9 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-paritel-accent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex-shrink-0">
              <Button variant="outline" className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                <div className="flex items-center gap-2">
                  <span>Catégorie:</span>
                  <select 
                    className="border-none bg-transparent focus:outline-none text-paritel-primary"
                    value={selectedCategory || ""}
                    onChange={(e) => setSelectedCategory(e.target.value === "" ? null : e.target.value)}
                  >
                    <option value="">Toutes</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
            {filteredProducts.slice(0, 12).map(product => (
              <Card key={product.id} className="overflow-hidden h-full">
                <div className="h-32 bg-gray-100 flex items-center justify-center p-4">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium line-clamp-1">{product.name}</h3>
                  <div className="flex flex-wrap gap-1 my-2">
                    <Badge variant="secondary" className="text-xs">{product.category}</Badge>
                    {product.brand && (
                      <Badge variant="outline" className="text-xs">{product.brand}</Badge>
                    )}
                  </div>
                  {product.rating !== undefined && (
                    <div className="flex items-center mb-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < Math.round(product.rating || 0) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="ml-1 text-xs text-gray-600">
                        {product.rating.toFixed(1)}
                      </span>
                    </div>
                  )}
                  <Button 
                    className="w-full mt-2" 
                    onClick={() => addProductToComparison(product)}
                    disabled={selectedProducts.length >= 4}
                  >
                    Ajouter à la comparaison
                  </Button>
                </CardContent>
              </Card>
            ))}
            
            {filteredProducts.length === 0 && (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">Aucun produit trouvé correspondant à vos critères.</p>
              </div>
            )}
          </div>
          
          {filteredProducts.length > 12 && (
            <div className="flex justify-center mt-4">
              <Button variant="outline">
                Voir plus
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

// Star component for product ratings
const Star = (props: any) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
};

export default ProductComparison;
