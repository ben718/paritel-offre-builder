import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Check, 
  Package, 
  Building
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SelectableProductCard } from "@/components/products/SelectableProductCard";
import { fetchProducts } from "@/services/ProductService";
import { createOffer, addProductToOffer } from "@/services/OfferService";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";

// Step 1: Customer Selection Component
const CustomerSelection = ({ onSelectCustomer, onNext }) => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  
  // Mock customer data - will be replaced with a real API call
  const customers = [
    { id: "cust-001", name: "Entreprise ABC", industry: "Technologie" },
    { id: "cust-002", name: "Société XYZ", industry: "Finance" },
    { id: "cust-003", name: "Groupe 123", industry: "Manufacturing" },
  ];
  
  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer);
    if (onSelectCustomer) {
      onSelectCustomer(customer);
    }
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Sélectionner un client</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {customers.map((customer) => (
          <div 
            key={customer.id}
            className={`border rounded-lg p-4 cursor-pointer transition-all ${
              selectedCustomer?.id === customer.id 
                ? "border-2 border-paritel-primary bg-paritel-light" 
                : "hover:border-gray-400"
            }`}
            onClick={() => handleSelectCustomer(customer)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <Building className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-medium">{customer.name}</h3>
                  <p className="text-sm text-gray-500">{customer.industry}</p>
                </div>
              </div>
              
              {selectedCustomer?.id === customer.id && (
                <div className="w-6 h-6 bg-paritel-primary rounded-full flex items-center justify-center">
                  <Check className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-end">
        <Button 
          className="bg-paritel-primary" 
          onClick={onNext}
          disabled={!selectedCustomer}
        >
          Continuer
        </Button>
      </div>
    </div>
  );
};

// Step 2: Product Selection Component
const ProductSelection = ({ onSelectProducts, onBack, onNext }) => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts
  });
  
  const handleProductSelection = (product, isSelected) => {
    if (isSelected) {
      setSelectedProducts(prev => [...prev, product]);
      setQuantities(prev => ({
        ...prev,
        [String(product.id)]: 1 // Ensure we convert ID to string for consistency
      }));
    } else {
      setSelectedProducts(prev => prev.filter(p => String(p.id) !== String(product.id)));
      setQuantities(prev => {
        const copy = { ...prev };
        delete copy[String(product.id)];
        return copy;
      });
    }
  };
  
  const handleQuantityChange = (productId, quantity) => {
    setQuantities(prev => ({
      ...prev,
      [String(productId)]: parseInt(quantity) // Ensure we convert ID to string for consistency
    }));
  };
  
  const handleContinue = () => {
    // Prepare products with quantities
    const productsWithQuantities = selectedProducts.map(product => ({
      ...product,
      quantity: quantities[String(product.id)] || 1 // Ensure we convert ID to string for consistency
    }));
    
    if (onSelectProducts) {
      onSelectProducts(productsWithQuantities);
    }
    
    onNext();
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Sélectionner des produits</h2>
      
      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin h-8 w-8 border-2 border-paritel-primary border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <SelectableProductCard
                key={product.id}
                {...product}
                isSelected={selectedProducts.some(p => String(p.id) === String(product.id))}
                onSelectionChange={(selected) => handleProductSelection(product, selected)}
                quantity={quantities[String(product.id)] || 1}
                onQuantityChange={(qty) => handleQuantityChange(product.id, qty)}
              />
            ))}
          </div>
          
          <Separator />
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Produits sélectionnés : {selectedProducts.length}</h3>
            
            {selectedProducts.length > 0 ? (
              <ul className="space-y-2">
                {selectedProducts.map((product) => (
                  <li key={product.id} className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Package className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{product.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">
                        Quantité: {quantities[String(product.id)] || 1}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-red-500"
                        onClick={() => handleProductSelection(product, false)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">Aucun produit sélectionné</p>
            )}
          </div>
        </div>
      )}
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Retour
        </Button>
        <Button 
          className="bg-paritel-primary" 
          onClick={handleContinue}
          disabled={selectedProducts.length === 0}
        >
          Continuer
        </Button>
      </div>
    </div>
  );
};

// Step 3: Offer Details Component
const OfferDetails = ({ customer, products, onBack, onCreateOffer }) => {
  const [offerName, setOfferName] = useState("");
  const [offerNotes, setOfferNotes] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleCreateOffer = async () => {
    if (!offerName) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez entrer un nom pour l'offre."
      });
      return;
    }
    
    if (!validUntil) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez sélectionner une date de validité."
      });
      return;
    }
    
    // Prepare offer data
    const offerData = {
      customer_id: customer.id,
      customer_name: customer.name,
      customer_industry: customer.industry,
      contact_name: "Contact Name", // Replace with actual contact name if available
      total_amount: products.reduce((sum, product) => sum + (product.quantity * 100), 0), // Replace 100 with actual product price
      valid_until: validUntil,
      notes: offerNotes,
      created_by: "user-001", // Replace with actual user ID
      status: "draft"
    };
    
    try {
      // Create offer
      const newOffer = await createOffer(offerData);
      
      if (newOffer) {
        // Add products to offer
        for (const product of products) {
          await addProductToOffer({
            offer_id: newOffer.id,
            product_id: product.id,
            quantity: product.quantity,
            unit_price: 100 // Replace 100 with actual product price
          });
        }
        
        toast({
          title: "Offre créée",
          description: "L'offre a été créée avec succès."
        });
        
        navigate('/my-offers');
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de créer l'offre."
        });
      }
    } catch (error) {
      console.error("Error creating offer:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur s'est produite lors de la création de l'offre."
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Détails de l'offre</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nom de l'offre</label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-paritel-primary focus:ring-paritel-primary sm:text-sm"
            placeholder="Nom de l'offre"
            value={offerName}
            onChange={(e) => setOfferName(e.target.value)}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Date de validité</label>
          <input
            type="date"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-paritel-primary focus:ring-paritel-primary sm:text-sm"
            value={validUntil}
            onChange={(e) => setValidUntil(e.target.value)}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Notes</label>
          <textarea
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-paritel-primary focus:ring-paritel-primary sm:text-sm"
            rows={3}
            placeholder="Notes"
            value={offerNotes}
            onChange={(e) => setOfferNotes(e.target.value)}
          />
        </div>
        
        <div>
          <h3 className="font-medium mb-2">Produits sélectionnés :</h3>
          
          {products.length > 0 ? (
            <ul className="space-y-2">
              {products.map((product) => (
                <li key={product.id} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Package className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{product.name}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    Quantité: {product.quantity}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">Aucun produit sélectionné</p>
          )}
        </div>
      </div>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Retour
        </Button>
        <Button 
          className="bg-paritel-primary" 
          onClick={handleCreateOffer}
        >
          Créer l'offre
        </Button>
      </div>
    </div>
  );
};

const CreateOffer = () => {
  const [step, setStep] = useState(1);
  const [customer, setCustomer] = useState(null);
  const [products, setProducts] = useState([]);
  
  const handleNext = () => {
    setStep(step + 1);
  };
  
  const handleBack = () => {
    setStep(step - 1);
  };
  
  const handleSelectCustomer = (customer) => {
    setCustomer(customer);
  };
  
  const handleSelectProducts = (products) => {
    setProducts(products);
  };
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <Button variant="outline" size="sm" onClick={() => window.history.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        
        {step === 1 && (
          <CustomerSelection 
            onSelectCustomer={handleSelectCustomer}
            onNext={handleNext}
          />
        )}
        
        {step === 2 && (
          <ProductSelection 
            onSelectProducts={handleSelectProducts}
            onBack={handleBack}
            onNext={handleNext}
          />
        )}
        
        {step === 3 && customer && (
          <OfferDetails 
            customer={customer}
            products={products}
            onBack={handleBack}
            onCreateOffer={() => {}}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default CreateOffer;
