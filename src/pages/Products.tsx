
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Search, Plus, Filter, ArrowUpDown } from "lucide-react";
import { ProductCard, ProductCardProps } from "@/components/products/ProductCard";
import { GlobalOfferingCircle } from "@/components/products/GlobalOfferingCircle";
import { CategoryFilters, CategoryTabsList } from "@/components/products/CategoryFilters";
import { products as initialProducts } from "@/data/productData";
import ProductForm from "@/components/products/ProductForm";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";

const Products = () => {
  const [products, setProducts] = useState<ProductCardProps[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<ProductCardProps> | null>(null);
  
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setSelectedSubcategory("all");
  };
  
  // Filter products based on search query and selected category/subcategory
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
  
  // Handler functions for CRUD operations
  const handleAddProduct = (data: Partial<ProductCardProps>) => {
    const newProduct = {
      ...data,
      id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
      tags: data.tags || [],
    } as ProductCardProps;
    
    setProducts([...products, newProduct]);
    setIsAddDialogOpen(false);
  };
  
  const handleEditProduct = (id: number) => {
    const product = products.find(p => p.id === id);
    if (product) {
      setEditingProduct(product);
      setIsEditDialogOpen(true);
    }
  };
  
  const handleUpdateProduct = (data: Partial<ProductCardProps>) => {
    setProducts(products.map(product => 
      product.id === data.id ? { ...product, ...data } as ProductCardProps : product
    ));
    setEditingProduct(null);
    setIsEditDialogOpen(false);
  };
  
  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter(product => product.id !== id));
  };
  
  // Add callbacks to products for CRUD operations
  const productsWithCallbacks = filteredProducts.map(product => ({
    ...product,
    onEdit: handleEditProduct,
    onDelete: handleDeleteProduct
  }));
  
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
        </div>

        {/* Visualisation graphique de l'offre globale */}
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
          </div>
        </div>

        <Tabs defaultValue="all" onValueChange={handleCategoryChange}>
          <CategoryTabsList />
          
          <CategoryFilters 
            selectedCategory={selectedCategory} 
            selectedSubcategory={selectedSubcategory}
            setSelectedSubcategory={setSelectedSubcategory}
          />
          
          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {productsWithCallbacks.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </TabsContent>
          
          {/* Unique tab content for each category to avoid duplicate code */}
          {["telephony", "internet-network", "wifi", "cybersecurity", 
            "infogérance", "poste-travail", "collaborative", "tvcast", "mobility", 
            "monétique", "surveillance"].map(category => (
            <TabsContent value={category} key={category} className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {productsWithCallbacks.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Products;
