import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Search, Plus, Filter, ArrowUpDown, CheckSquare, Square, X, FileCheck } from "lucide-react";
import { ProductCard, ProductCardProps } from "@/components/products/ProductCard";
import { SelectableProductCard } from "@/components/products/SelectableProductCard";
import { GlobalOfferingCircle } from "@/components/products/GlobalOfferingCircle";
import { CategoryFilters, CategoryTabsList } from "@/components/products/CategoryFilters";
import { DownloadMenu } from "@/components/products/DownloadMenu";
import { loadProducts } from "@/data/productData";
import ProductForm from "@/components/products/ProductForm";
import ProductDetails from "@/components/products/ProductDetails";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { 
  createProduct, 
  updateProduct, 
  deleteProduct 
} from "@/services/ProductService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";

const Products = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<ProductCardProps> | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ProductCardProps | null>(null);
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);
  const [selectionMode, setSelectionMode] = useState(false);
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();
  
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: loadProducts
  });
  
  const createProductMutation = useMutation({
    mutationFn: (data: { formData: Partial<ProductCardProps>, imageFile?: File | null }) => 
      createProduct(data.formData, data.imageFile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: "Produit créé",
        description: "Le produit a été créé avec succès.",
      });
      setIsAddDialogOpen(false);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: `Erreur lors de la création du produit: ${error.message}`,
      });
    }
  });
  
  const updateProductMutation = useMutation({
    mutationFn: (data: { formData: Partial<ProductCardProps>, imageFile?: File | null }) => 
      updateProduct(String(data.formData.id), data.formData, data.imageFile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: "Produit mis à jour",
        description: "Le produit a été mis à jour avec succès.",
      });
      setIsEditDialogOpen(false);
      setEditingProduct(null);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: `Erreur lors de la mise à jour du produit: ${error.message}`,
      });
    }
  });
  
  const deleteProductMutation = useMutation({
    mutationFn: (id: number) => deleteProduct(String(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: "Produit supprimé",
        description: "Le produit a été supprimé avec succès.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: `Erreur lors de la suppression du produit: ${error.message}`,
      });
    }
  });
  
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setSelectedSubcategory("all");
  };
  
  const filteredProducts = products.filter((product) => {
    const matchesSearch = 
      searchQuery === "" || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = 
      selectedCategory === "all" ||
      (selectedCategory === "telephony" && product.category === "Téléphonie d'entreprise") ||
      (selectedCategory === "internet-network" && product.category === "Internet Très Haut Débit") ||
      (selectedCategory === "wifi" && product.category === "Wi-Fi public & privé indoor outdoor") ||
      (selectedCategory === "cybersecurity" && product.category === "Cybersécurité") ||
      (selectedCategory === "infogérance" && product.category === "Infogérance") ||
      (selectedCategory === "poste-travail" && product.category === "Sécurisation du poste de travail") ||
      (selectedCategory === "collaborative" && product.category === "Solutions collaboratives") ||
      (selectedCategory === "tvcast" && product.category === "TVCast Téléviseur connecté") ||
      (selectedCategory === "mobility" && product.category === "Mobiles") ||
      (selectedCategory === "monétique" && product.category === "Monétique") ||
      (selectedCategory === "surveillance" && product.category === "Surveillance");
    
    const matchesSubcategory = 
      selectedSubcategory === "all" ||
      product.subcategory === selectedSubcategory;
    
    return matchesSearch && matchesCategory && matchesSubcategory;
  });
  
  const handleAddProduct = (formData: Partial<ProductCardProps>, imageFile?: File | null) => {
    createProductMutation.mutate({ formData, imageFile });
  };
  
  const handleEditProduct = (id: number) => {
    const product = products.find(p => p.id === id);
    if (product) {
      setEditingProduct(product);
      setIsEditDialogOpen(true);
    }
  };
  
  const handleUpdateProduct = (formData: Partial<ProductCardProps>, imageFile?: File | null) => {
    updateProductMutation.mutate({ formData, imageFile });
  };
  
  const handleDeleteProduct = (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      deleteProductMutation.mutate(id.toString());
    }
  };
  
  const handleViewProductDetails = (id: number) => {
    const product = products.find(p => p.id === id);
    if (product) {
      setSelectedProduct(product);
      setIsDetailsDialogOpen(true);
    }
  };
  
  const handleAddToOffer = () => {
    if (selectedProduct) {
      toast({
        title: "Produit ajouté",
        description: `${selectedProduct.name} a été ajouté à votre offre.`,
      });
    }
  };
  
  const handleCompareSelected = () => {
    if (selectedProductIds.length < 2) {
      toast({
        variant: "destructive",
        title: "Sélection insuffisante",
        description: "Veuillez sélectionner au moins 2 produits à comparer."
      });
      return;
    }
    
    if (selectedProductIds.length > 4) {
      toast({
        title: "Trop de produits",
        description: "Seuls les 4 premiers produits sélectionnés seront comparés.",
      });
    }
    
    localStorage.setItem('productsToCompare', JSON.stringify(selectedProductIds.slice(0, 4)));
    navigate('/product-comparison');
  };
  
  const handleProductSelection = (id: number, isSelected: boolean) => {
    if (isSelected) {
      setSelectedProductIds(prev => [...prev, id]);
    } else {
      setSelectedProductIds(prev => prev.filter(productId => productId !== id));
    }
  };
  
  const handleSelectAll = () => {
    setSelectedProductIds(filteredProducts.map(product => product.id));
  };
  
  const handleDeselectAll = () => {
    setSelectedProductIds([]);
  };
  
  const toggleSelectionMode = () => {
    setSelectionMode(prev => !prev);
    if (selectionMode) {
      setSelectedProductIds([]);
    }
  };
  
  const handleDownloadMenu = () => {
    const selectedProductsToExport = selectedProductIds.length > 0
      ? products.filter(p => selectedProductIds.includes(p.id))
      : filteredProducts;
    
    localStorage.setItem('productsToExport', JSON.stringify(selectedProductsToExport));
    navigate('/product-export');
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-paritel-primary"></div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex flex-col justify-center items-center h-[60vh] space-y-4">
          <h2 className="text-xl font-bold text-red-600">Erreur lors du chargement des produits</h2>
          <p className="text-gray-600">Veuillez réessayer plus tard ou contacter le support.</p>
          <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['products'] })}>
            Réessayer
          </Button>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Catalogue Produits et Services</h1>
            <p className="text-muted-foreground mt-1">
              Consultez notre catalogue complet de produits, services et partenaires
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-paritel-primary hover:bg-paritel-dark">
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un produit
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Ajouter un nouveau produit</DialogTitle>
                <DialogDescription>
                  Remplissez les informations pour créer un nouveau produit ou service.
                </DialogDescription>
              </DialogHeader>
              <ProductForm 
                onSubmit={handleAddProduct} 
                onCancel={() => setIsAddDialogOpen(false)} 
              />
            </DialogContent>
          </Dialog>
          
          <Button 
            variant="outline" 
            className="flex gap-2"
            onClick={() => navigate('/product-comparison')}
          >
            <FileCheck className="h-4 w-4" />
            Comparer des produits
          </Button>
          
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Modifier le produit</DialogTitle>
                <DialogDescription>
                  Modifiez les informations du produit.
                </DialogDescription>
              </DialogHeader>
              {editingProduct && (
                <ProductForm 
                  product={editingProduct} 
                  onSubmit={handleUpdateProduct} 
                  onCancel={() => {
                    setEditingProduct(null);
                    setIsEditDialogOpen(false);
                  }} 
                />
              )}
            </DialogContent>
          </Dialog>
          
          <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
            <DialogContent className={`${isMobile ? 'max-w-full p-4' : 'sm:max-w-[800px]'} max-h-[90vh] overflow-y-auto`}>
              {selectedProduct && (
                <ProductDetails 
                  product={selectedProduct} 
                  onBack={() => setIsDetailsDialogOpen(false)}
                  onAddToOffer={handleAddToOffer}
                />
              )}
            </DialogContent>
          </Dialog>
        </div>

        <GlobalOfferingCircle />

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher un produit ou service..."
              className="w-full py-2 pl-9 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-paritel-accent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex gap-2">
              <Filter className="h-4 w-4" />
              Filtres avancés
            </Button>
            <Button variant="outline" className="flex gap-2">
              <ArrowUpDown className="h-4 w-4" />
              Trier
            </Button>
            <Button 
              variant={selectionMode ? "default" : "outline"} 
              className={`flex gap-2 ${selectionMode ? "bg-paritel-primary" : ""}`}
              onClick={toggleSelectionMode}
            >
              {selectionMode ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
              {selectionMode ? "Mode sélection" : "Sélectionner"}
            </Button>
            {selectionMode && selectedProductIds.length >= 2 && (
              <Button 
                className="bg-paritel-primary"
                onClick={handleCompareSelected}
              >
                Comparer ({selectedProductIds.length})
              </Button>
            )}
            <DownloadMenu 
              products={filteredProducts}
              selectedProducts={selectedProductIds.length > 0 
                ? products.filter(p => selectedProductIds.includes(p.id))
                : filteredProducts}
              hasSelection={selectedProductIds.length > 0}
              onDownload={handleDownloadMenu}
            />
          </div>
        </div>

        <Tabs defaultValue="all" onValueChange={handleCategoryChange}>
          <div className="overflow-x-auto pb-2">
            <CategoryTabsList />
          </div>
          
          <CategoryFilters 
            selectedCategory={selectedCategory} 
            selectedSubcategory={selectedSubcategory}
            setSelectedSubcategory={setSelectedSubcategory}
          />
          
          {selectionMode && selectedProductIds.length > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm font-medium">{selectedProductIds.length} produit(s) sélectionné(s)</span>
              <Button variant="outline" size="sm" onClick={handleSelectAll}>
                Tout sélectionner
              </Button>
              <Button variant="outline" size="sm" onClick={handleDeselectAll}>
                Tout désélectionner
              </Button>
            </div>
          )}
          
          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.length === 0 ? (
                <div className="col-span-3 text-center py-12">
                  <p className="text-gray-500">Aucun produit ne correspond à votre recherche.</p>
                </div>
              ) : selectionMode ? (
                filteredProducts.map((product) => (
                  <SelectableProductCard 
                    key={product.id}
                    product={product}
                    selected={selectedProductIds.includes(product.id)}
                    onSelect={() => handleProductSelection(product.id, !selectedProductIds.includes(product.id))}
                  />
                ))
              ) : (
                filteredProducts.map((product) => (
                  <ProductCard 
                    key={product.id}
                    {...product}
                    onEdit={handleEditProduct}
                    onDelete={handleDeleteProduct}
                    onViewDetails={handleViewProductDetails}
                  />
                ))
              )}
            </div>
          </TabsContent>
          
          {["telephony", "internet-network", "wifi", "cybersecurity", 
            "infogérance", "poste-travail", "collaborative", "tvcast", "mobility", 
            "monétique", "surveillance"].map(category => (
            <TabsContent value={category} key={category} className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.length === 0 ? (
                  <div className="col-span-3 text-center py-12">
                    <p className="text-gray-500">Aucun produit ne correspond à votre recherche.</p>
                  </div>
                ) : selectionMode ? (
                  filteredProducts.map((product) => (
                    <SelectableProductCard 
                      key={product.id}
                      product={product}
                      selected={selectedProductIds.includes(product.id)}
                      onSelect={() => handleProductSelection(product.id, !selectedProductIds.includes(product.id))}
                    />
                  ))
                ) : (
                  filteredProducts.map((product) => (
                    <ProductCard 
                      key={product.id}
                      {...product}
                      onEdit={handleEditProduct}
                      onDelete={handleDeleteProduct}
                      onViewDetails={handleViewProductDetails}
                    />
                  ))
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Products;
