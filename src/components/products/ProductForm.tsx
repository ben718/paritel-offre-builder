import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { createProduct, getProductById, updateProduct, Product, ProductCategory, getProductCategories } from '@/services/ProductService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CustomLabel } from '@/components/ui/custom-label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, PlusCircle, Trash2 } from 'lucide-react';

// Schéma de validation avec Zod
const productFormSchema = z.object({
  name: z.string().min(3, { message: "Le nom du produit/service doit contenir au moins 3 caractères." }),
  reference: z.string().optional(),
  description: z.string().optional(),
  category_id: z.string().uuid({ message: "Veuillez sélectionner une catégorie." }).optional().or(z.literal("")),
  status: z.enum(["actif", "obsolète", "en développement"]).optional().default("actif"),
  technical_specifications: z.array(z.object({
    key: z.string().min(1, "La clé ne peut être vide."),
    value: z.string().min(1, "La valeur ne peut être vide.")
  })).optional(),
  // service_type: z.enum(["managed", "unmanaged", "consulting"]).optional(), // Si c'est un service
});

type ProductFormData = z.infer<typeof productFormSchema>;

const ProductForm: React.FC = () => {
  const { productId } = useParams<{ productId?: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth(); // Pour created_by_id si nécessaire, ou pour les droits
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(!!productId);
  const [categories, setCategories] = useState<ProductCategory[]>([]);

  const { control, handleSubmit, reset, formState: { errors } } = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: '',
      reference: '',
      description: '',
      category_id: '',
      status: 'actif',
      technical_specifications: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "technical_specifications"
  });

  const fetchProductCategories = useCallback(async () => {
    try {
      const fetchedCategories = await getProductCategories();
      setCategories(fetchedCategories);
    } catch (error) {
      console.error("Erreur lors de la récupération des catégories:", error);
      toast({ title: "Erreur", description: "Impossible de charger les catégories de produits.", variant: "destructive" });
    }
  }, [toast]);

  useEffect(() => {
    fetchProductCategories();
    if (productId) {
      setIsFetchingData(true);
      getProductById(productId)
        .then((product) => {
          if (product) {
            const specs = product.technical_specifications ? 
              Object.entries(product.technical_specifications).map(([key, value]) => ({ key, value: String(value) })) : [];
            reset({
              name: product.name,
              reference: product.reference || '',
              description: product.description || '',
              category_id: product.category_id || '',
              status: product.status || 'actif',
              technical_specifications: specs,
            });
          } else {
            toast({ title: "Erreur", description: "Produit/Service non trouvé.", variant: "destructive" });
            navigate('/catalogue/produits');
          }
        })
        .catch(err => {
          console.error(err);
          toast({ title: "Erreur", description: "Impossible de charger les données du produit/service.", variant: "destructive" });
        })
        .finally(() => setIsFetchingData(false));
    }
  }, [productId, reset, navigate, toast, fetchProductCategories]);

  const onSubmit = async (formData: ProductFormData) => {
    if (!user) {
      toast({ title: "Erreur", description: "Utilisateur non authentifié.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      const specsObject = formData.technical_specifications?.reduce((acc, spec) => {
        acc[spec.key] = spec.value;
        return acc;
      }, {} as Record<string, any>) || {};

      const productPayload: Partial<Product> = {
        ...formData,
        category_id: formData.category_id || undefined,
        technical_specifications: specsObject,
      };

      if (productId) {
        await updateProduct(productId, productPayload);
        toast({ title: "Succès", description: "Produit/Service mis à jour avec succès." });
      } else {
        // Assurer que tous les champs requis pour la création sont présents
        const newProductData: Omit<Product, 'id' | 'created_at' | 'updated_at'> = {
            name: formData.name,
            reference: formData.reference,
            description: formData.description,
            category_id: formData.category_id || undefined,
            status: formData.status,
            technical_specifications: specsObject,
            // created_by_id: user.id, // Si vous suivez qui a créé le produit
        };
        await createProduct(newProductData);
        toast({ title: "Succès", description: "Produit/Service créé avec succès." });
      }
      navigate('/catalogue/produits');
    } catch (error: any) {
      console.error("Erreur lors de la soumission du formulaire:", error);
      toast({ title: "Erreur", description: error.message || "Une erreur est survenue.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetchingData && productId) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[calc(100vh-100px)]">
        <Loader2 className="h-12 w-12 text-paritel-primary animate-spin mb-4" />
        <p className="text-lg font-medium text-gray-700">Chargement du formulaire produit...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>{productId ? "Modifier le Produit/Service" : "Créer un Nouveau Produit/Service"}</CardTitle>
          <CardDescription>
            {productId ? "Mettez à jour les informations de ce produit ou service." : "Remplissez les informations ci-dessous."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <CustomLabel htmlFor="name">Nom du Produit/Service *</CustomLabel>
              <Controller
                name="name"
                control={control}
                render={({ field }) => <Input id="name" {...field} />}
              />
              {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <CustomLabel htmlFor="reference">Référence Interne</CustomLabel>
              <Controller
                name="reference"
                control={control}
                render={({ field }) => <Input id="reference" {...field} />}
              />
            </div>

            <div>
              <CustomLabel htmlFor="description">Description</CustomLabel>
              <Controller
                name="description"
                control={control}
                render={({ field }) => <Textarea id="description" {...field} rows={4} />}
              />
            </div>
            
            <div>
              <CustomLabel htmlFor="category_id">Catégorie</CustomLabel>
              <Controller
                name="category_id"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value || ''}>
                    <SelectTrigger id="category_id">
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Aucune catégorie</SelectItem>
                      {categories.map(cat => (
                        <SelectItem key={cat.id} value={cat.id!}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.category_id && <p className="text-sm text-red-600 mt-1">{errors.category_id.message}</p>}
            </div>

            <div>
              <CustomLabel htmlFor="status">Statut</CustomLabel>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Sélectionner un statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="actif">Actif</SelectItem>
                      <SelectItem value="en développement">En développement</SelectItem>
                      <SelectItem value="obsolète">Obsolète</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Spécifications Techniques */}
            <div className="space-y-3">
              <CustomLabel>Spécifications Techniques</CustomLabel>
              {fields.map((item, index) => (
                <div key={item.id} className="flex items-center gap-3 p-3 border rounded-md">
                  <div className="flex-grow">
                    <CustomLabel htmlFor={`spec-key-${index}`} className="sr-only">Clé</CustomLabel>
                    <Controller
                      name={`technical_specifications.${index}.key` as const}
                      control={control}
                      render={({ field }) => <Input {...field} placeholder="Caractéristique (ex: Bande passante)" id={`spec-key-${index}`} />}
                    />
                    {errors.technical_specifications?.[index]?.key && <p className="text-sm text-red-600 mt-1">{errors.technical_specifications[index]?.key?.message}</p>}
                  </div>
                  <div className="flex-grow">
                    <CustomLabel htmlFor={`spec-value-${index}`} className="sr-only">Valeur</CustomLabel>
                    <Controller
                      name={`technical_specifications.${index}.value` as const}
                      control={control}
                      render={({ field }) => <Input {...field} placeholder="Valeur (ex: 1 Gbps)" id={`spec-value-${index}`} />}
                    />
                    {errors.technical_specifications?.[index]?.value && <p className="text-sm text-red-600 mt-1">{errors.technical_specifications[index]?.value?.message}</p>}
                  </div>
                  <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} title="Supprimer la spécification">
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ key: '', value: '' })}
                className="mt-2"
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Ajouter une Spécification
              </Button>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={() => navigate('/catalogue/produits')} disabled={isLoading}>
                Annuler
              </Button>
              <Button type="submit" className="bg-paritel-primary hover:bg-paritel-primary/90" disabled={isLoading || (isFetchingData && !!productId)}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                {productId ? 'Enregistrer les Modifications' : 'Créer le Produit/Service'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductForm;

