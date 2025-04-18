
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SolutionForm from "@/components/solutions/SolutionForm";
import SolutionCard from "@/components/solutions/SolutionCard";
import type { SolutionCardProps } from "@/components/solutions/SolutionCard";
import type { Database } from "@/integrations/supabase/types";

const Solutions = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingSolution, setEditingSolution] = useState<Partial<SolutionCardProps> | null>(null);

  // Fetch solutions from database
  const { data: solutions = [], isLoading } = useQuery({
    queryKey: ['solutions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('business_solutions')
        .select(`
          *,
          products:solution_products (
            product:products (
              id,
              name,
              category
            )
          )
        `);
        
      if (error) throw error;
      
      return data.map(solution => ({
        ...solution,
        products: solution.products.map((p: any) => p.product)
      }));
    }
  });

  // Mutation to add/update solution
  const mutation = useMutation({
    mutationFn: async (solution: Partial<SolutionCardProps>) => {
      if (solution.id) {
        // Update
        const { error } = await supabase
          .from('business_solutions')
          .update({
            name: solution.name,
            description: solution.description,
            industry: solution.industry,
            image_url: solution.image_url,
            recommended: solution.recommended
          })
          .eq('id', solution.id);
          
        if (error) throw error;
        
        // Update products
        await supabase
          .from('solution_products')
          .delete()
          .eq('solution_id', solution.id);
          
        if (solution.products?.length) {
          const { error: productsError } = await supabase
            .from('solution_products')
            .insert(
              solution.products.map(product => ({
                solution_id: solution.id,
                product_id: product.id
              }))
            );
            
          if (productsError) throw productsError;
        }
      } else {
        // Insert
        const { data: newSolution, error } = await supabase
          .from('business_solutions')
          .insert({
            name: solution.name,
            description: solution.description,
            industry: solution.industry,
            image_url: solution.image_url,
            recommended: solution.recommended
          })
          .select()
          .single();
          
        if (error) throw error;
        
        if (solution.products?.length) {
          const { error: productsError } = await supabase
            .from('solution_products')
            .insert(
              solution.products.map(product => ({
                solution_id: newSolution.id,
                product_id: product.id
              }))
            );
            
          if (productsError) throw productsError;
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['solutions'] });
      toast({
        title: "Succès",
        description: "La solution a été sauvegardée"
      });
      setIsAddDialogOpen(false);
      setIsEditDialogOpen(false);
      setEditingSolution(null);
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la solution",
        variant: "destructive"
      });
    }
  });

  // Filter solutions based on selected tab
  const filteredSolutions = selectedTab === "all" 
    ? solutions 
    : solutions.filter(s => {
        switch (selectedTab) {
          case "hotel": return s.industry === "Hôtellerie";
          case "health": return s.industry === "Santé";
          case "business": return s.industry === "Entreprise";
          case "education": return s.industry === "Éducation";
          case "public": return s.industry === "Secteur Public";
          default: return true;
        }
      });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('business_solutions')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['solutions'] });
      toast({
        title: "Succès",
        description: "La solution a été supprimée"
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la solution",
        variant: "destructive"
      });
    }
  });

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Solutions Métiers</h1>
            <p className="text-muted-foreground mt-1">
              Packs verticaux par secteur d'activité prêts à l'emploi
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-paritel-primary hover:bg-paritel-dark">
                <Plus className="mr-2 h-4 w-4" />
                Créer une solution
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Créer une nouvelle solution métier</DialogTitle>
                <DialogDescription>
                  Remplissez les informations pour créer une nouvelle solution métier.
                </DialogDescription>
              </DialogHeader>
              <SolutionForm 
                onSubmit={(data) => mutation.mutate(data)} 
                onCancel={() => setIsAddDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="all" onValueChange={setSelectedTab}>
          <TabsList className="flex flex-wrap">
            <TabsTrigger value="all">Tous les secteurs</TabsTrigger>
            <TabsTrigger value="hotel">Hôtellerie</TabsTrigger>
            <TabsTrigger value="health">Santé</TabsTrigger>
            <TabsTrigger value="business">Entreprise</TabsTrigger>
            <TabsTrigger value="education">Éducation</TabsTrigger>
            <TabsTrigger value="public">Secteur Public</TabsTrigger>
          </TabsList>
          
          {Object.entries({
            all: "Tous les secteurs",
            hotel: "Hôtellerie",
            health: "Santé",
            business: "Entreprise",
            education: "Éducation",
            public: "Secteur Public"
          }).map(([value, label]) => (
            <TabsContent key={value} value={value} className="mt-6">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="h-[400px] bg-gray-100 animate-pulse rounded-lg" />
                  ))}
                </div>
              ) : filteredSolutions.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Aucune solution trouvée pour ce secteur</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredSolutions.map((solution) => (
                    <SolutionCard 
                      key={solution.id} 
                      {...solution} 
                      onEdit={(id) => {
                        const solution = solutions.find(s => s.id === id);
                        if (solution) {
                          setEditingSolution(solution);
                          setIsEditDialogOpen(true);
                        }
                      }}
                      onDelete={(id) => deleteMutation.mutate(id)}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier la solution</DialogTitle>
            <DialogDescription>
              Modifiez les informations de la solution métier.
            </DialogDescription>
          </DialogHeader>
          {editingSolution && (
            <SolutionForm 
              solution={editingSolution} 
              onSubmit={(data) => mutation.mutate(data)} 
              onCancel={() => {
                setEditingSolution(null);
                setIsEditDialogOpen(false);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Solutions;
