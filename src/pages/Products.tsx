import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Plus, Filter, X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductCard } from "@/components/products/ProductCard";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import ProductDetails from "@/components/products/ProductDetails";
import { CategoryFilters } from "@/components/products/CategoryFilters";
import { useToast } from "@/components/ui/use-toast";
import ProductForm from "@/components/products/ProductForm";
import { Badge } from "@/components/ui/badge";
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
import { fetchProducts, createProduct, updateProduct, deleteProduct } from "@/services/ProductService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const loadProducts = async () => {
  return await fetchProducts();
};

const Products = () => {
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();
  
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: loadProducts
  });
  
  const createProductMutation = useMutation({
    mutationFn: (data: { formData: Partial<any>, imageFile?: File | null }) => 
      createProduct(data.formData, data.imageFile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: "Produit ajouté",
        description: "Le produit a été ajouté avec succès.",
      });
      setIsAddDialogOpen(false);
    },
    onError: (error) => {
      console.error('Error creating product:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le produit.",
        variant: "destructive",
      });
    }
  });
  
  const updateProductMutation = useMutation({
    mutationFn: (data: { formData: Partial<any>, imageFile?: File | null }) => 
      updateProduct(String(data.formData.id), data.formData, data.imageFile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: "Produit mis à jour",
        description: "Le produit a été mis à jour avec succès.",
      });
      setIsEditDialogOpen(false);
      setSelectedProduct(null);
    },
    onError: (error) => {
      console.error('Error updating product:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le produit.",
        variant: "destructive",
      });
    }
  });
  
  const deleteProductMutation = useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: "Produit supprimé",
        description: "Le produit a été supprimé avec succès.",
      });
    },
    onError: (error) => {
      console.error('Error deleting product:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le produit.",
        variant: "destructive",
      });
    }
  });
  
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory(null);
    setSelectedSubcategory(null);
  };
  
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      searchTerm === "" ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = 
      selectedCategory === null || 
      product.category?.includes(selectedCategory);
    
    const matchesSubcategory = 
      selectedSubcategory === null || 
      product.subcategory?.includes(selectedSubcategory);
    
    return matchesSearch && matchesCategory && matchesSubcategory;
  });
  
  const handleAddProduct = (formData: Partial<any>, imageFile?: File | null) => {
    createProductMutation.mutate({ formData, imageFile });
  };
  
  const handleEditProduct = (id: string) => {
    const product = products.find(p => String(p.id) === id);
    if (product) {
      setSelectedProduct(product);
      setIsEditDialogOpen(true);
    }
  };
  
  const handleUpdateProduct = (formData: Partial<any>, imageFile?: File | null) => {
    updateProductMutation.mutate({ formData, imageFile });
  };
  
  const handleDeleteProduct = (id: string) => {
    deleteProductMutation.mutate(id);
  };
  
  const handleViewProductDetails = (id: string) => {
    const product = products.find(p => String(p.id) === id);
    if (product) {
      setSelectedProduct(product);
      setIsDetailsDialogOpen(true);
    }
  };
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Produits</h1>
            <p className="text-muted-foreground mt-1">
              Gérez vos produits et services
            </p>
          </div>
          <Button 
            className="bg-paritel-primary hover:bg-paritel-dark"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un produit
          </Button>
        </div>

        <Tabs defaultValue="all">
          <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
            <TabsList>
              <TabsTrigger value="all">Tous les produits</TabsTrigger>
              <TabsTrigger value="telephonie">Téléphonie</TabsTrigger>
              <TabsTrigger value="reseau">Réseau</TabsTrigger>
              <TabsTrigger value="securite">Sécurité</TabsTrigger>
            </TabsList>
            
            <div className="flex gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:flex-initial">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Rechercher un produit..."
                  className="pl-8 w-full md:w-[250px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Button 
                variant="outline"
                onClick={resetFilters}
                className="whitespace-nowrap"
              >
                <X className="h-4 w-4 mr-2" />
                Réinitialiser
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4">
            <CategoryFilters 
              selectedCategory={selectedCategory}
              selectedSubcategory={selectedSubcategory}
              onCategoryChange={setSelectedCategory}
              onSubcategoryChange={setSelectedSubcategory}
            />

            <TabsContent value="all" className="mt-6 w-full">
              {isLoading ? (
                <div className="flex justify-center p-8">
                  <div className="animate-spin h-8 w-8 border-2 border-paritel-primary border-t-transparent rounded-full"></div>
                </div>
              ) : error ? (
                <div className="text-red-500">Error: {(error as Error).message}</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredProducts.map(product => (
                    <ProductCard
                      key={product.id}
                      {...product}
                      onViewDetails={() => handleViewProductDetails(String(product.id))}
                      onEdit={() => handleEditProduct(String(product.id))}
                      onDelete={() => handleDeleteProduct(String(product.id))}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className={`${isMobile ? 'max-w-full p-4' : 'sm:max-w-[600px]'}`}>
            <DialogTitle>Ajouter un nouveau produit</DialogTitle>
            <ProductForm 
              onSubmit={handleAddProduct} 
              onCancel={() => setIsAddDialogOpen(false)} 
            />
          </DialogContent>
        </Dialog>
        
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className={`${isMobile ? 'max-w-full p-4' : 'sm:max-w-[600px]'}`}>
            <DialogTitle>Modifier le produit</DialogTitle>
            {selectedProduct && (
              <ProductForm 
                product={selectedProduct} 
                onSubmit={handleUpdateProduct} 
                onCancel={() => setIsEditDialogOpen(false)} 
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
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default Products;
