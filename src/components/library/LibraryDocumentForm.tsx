import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { 
  uploadLibraryDocument, 
  getLibraryDocumentById, 
  updateLibraryDocument, 
  LibraryDocument, 
  LibraryCategory, 
  getLibraryCategories 
} from '@/services/LibraryService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CustomLabel } from '@/components/ui/custom-label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, UploadCloud, Tag } from 'lucide-react';
import { MultiSelect } from '@/components/ui/multi-select'; // Supposons un composant MultiSelect pour les tags

// Schéma de validation avec Zod
const documentFormSchema = z.object({
  title: z.string().min(3, { message: "Le titre du document doit contenir au moins 3 caractères." }),
  description: z.string().optional(),
  category_id: z.string().uuid({ message: "Veuillez sélectionner une catégorie." }).optional().nullable(),
  tags: z.array(z.string()).optional(),
  version: z.string().optional(),
  status: z.enum(["brouillon", "en revue", "approuvé", "archivé"]).default("brouillon"),
  file: z.instanceof(File).optional().nullable(), // Pour l'upload initial
});

type DocumentFormData = z.infer<typeof documentFormSchema>;

const LibraryDocumentForm: React.FC = () => {
  const { documentId } = useParams<{ documentId?: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, checkRouteAccess } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(!!documentId);
  const [categories, setCategories] = useState<LibraryCategory[]>([]);
  const [currentFile, setCurrentFile] = useState<{ name: string; path: string } | null>(null);

  const { control, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<DocumentFormData>({
    resolver: zodResolver(documentFormSchema),
    defaultValues: {
      title: '',
      description: '',
      category_id: null,
      tags: [],
      version: '1.0',
      status: 'brouillon',
      file: null,
    },
  });

  const watchedFile = watch("file");

  const fetchCategoriesAndDocument = useCallback(async () => {
    setIsFetchingData(true);
    try {
      const fetchedCategories = await getLibraryCategories();
      setCategories(fetchedCategories);

      if (documentId) {
        const doc = await getLibraryDocumentById(documentId);
        if (doc) {
          reset({
            title: doc.title,
            description: doc.description || '',
            category_id: doc.category_id || null,
            tags: doc.tags || [],
            version: doc.version || '1.0',
            status: doc.status || 'brouillon',
            file: null, // On ne recharge pas le fichier, on affiche son nom
          });
          setCurrentFile({ name: doc.file_name, path: doc.file_path });
        } else {
          toast({ title: "Erreur", description: "Document non trouvé.", variant: "destructive" });
          navigate('/bibliotheque');
        }
      }
    } catch (error) {
      console.error("Erreur chargement données formulaire document:", error);
      toast({ title: "Erreur", description: "Impossible de charger les données.", variant: "destructive" });
    } finally {
      setIsFetchingData(false);
    }
  }, [documentId, reset, navigate, toast]);

  useEffect(() => {
    if (!checkRouteAccess(['Chef de produit', 'Admin', 'Commercial AO', 'Avant-vente'])) {
        toast({ title: "Accès refusé", description: "Vous n'avez pas les droits pour accéder à cette page.", variant: "destructive" });
        navigate('/bibliotheque');
        return;
    }
    fetchCategoriesAndDocument();
  }, [fetchCategoriesAndDocument, checkRouteAccess, navigate, toast]);

  const onSubmit = async (formData: DocumentFormData) => {
    if (!user) {
      toast({ title: "Erreur", description: "Utilisateur non authentifié.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      const metadataToSave: Omit<LibraryDocument, "id" | "file_name" | "file_path" | "file_mime_type" | "uploaded_by_id" | "created_at" | "updated_at"> = {
        title: formData.title,
        description: formData.description,
        category_id: formData.category_id || undefined,
        tags: formData.tags,
        version: formData.version,
        status: formData.status,
      };

      if (documentId) {
        // Mise à jour des métadonnées. La gestion du remplacement de fichier serait plus complexe.
        await updateLibraryDocument(documentId, metadataToSave);
        toast({ title: "Succès", description: "Document mis à jour avec succès." });
      } else {
        if (!formData.file) {
          toast({ title: "Erreur", description: "Un fichier est requis pour créer un nouveau document.", variant: "destructive" });
          setIsLoading(false);
          return;
        }
        await uploadLibraryDocument(formData.file, metadataToSave);
        toast({ title: "Succès", description: "Document téléversé et créé avec succès." });
      }
      navigate('/bibliotheque');
    } catch (error: any) {
      console.error("Erreur lors de la soumission du formulaire de document:", error);
      toast({ title: "Erreur", description: error.message || "Une erreur est survenue.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetchingData && documentId) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[calc(100vh-100px)]">
        <Loader2 className="h-12 w-12 text-paritel-primary animate-spin mb-4" />
        <p className="text-lg font-medium text-gray-700">Chargement du formulaire...</p>
      </div>
    );
  }

  // TODO: Remplacer MultiSelect par un vrai composant ou une gestion de tags simple (Input + affichage)
  const availableTags = ["Contrat", "Technique", "Commercial", "Marketing", "Juridique", "SLA"];

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{documentId ? "Modifier le Document" : "Téléverser un Nouveau Document"}</CardTitle>
          <CardDescription>
            {documentId ? "Mettez à jour les informations de ce document." : "Remplissez les informations et sélectionnez un fichier."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <CustomLabel htmlFor="title">Titre du Document *</CustomLabel>
              <Controller
                name="title"
                control={control}
                render={({ field }) => <Input id="title" {...field} />}
              />
              {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>}
            </div>

            <div>
              <CustomLabel htmlFor="description">Description</CustomLabel>
              <Controller
                name="description"
                control={control}
                render={({ field }) => <Textarea id="description" {...field} rows={3} />}
              />
            </div>

            {!documentId && (
              <div>
                <CustomLabel htmlFor="file">Fichier *</CustomLabel>
                <Controller
                  name="file"
                  control={control}
                  render={({ field: { onChange, value, ...restField } }) => (
                    <Input 
                      id="file" 
                      type="file" 
                      onChange={(e) => onChange(e.target.files ? e.target.files[0] : null)} 
                      {...restField} 
                    />
                  )}
                />
                {watchedFile && <p className="text-sm text-gray-500 mt-1">Fichier sélectionné: {watchedFile.name}</p>}
                {errors.file && <p className="text-sm text-red-600 mt-1">{errors.file.message}</p>}
              </div>
            )}
            {documentId && currentFile && (
                <div className="text-sm">
                    <CustomLabel>Fichier Actuel</CustomLabel>
                    <p className='p-2 border rounded-md bg-gray-50'>{currentFile.name} <span className='text-gray-400 text-xs'>(Pour remplacer, supprimez et recréez le document)</span></p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <SelectItem value="brouillon">Brouillon</SelectItem>
                        <SelectItem value="en revue">En Revue</SelectItem>
                        <SelectItem value="approuvé">Approuvé</SelectItem>
                        <SelectItem value="archivé">Archivé</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            <div>
              <CustomLabel htmlFor="version">Version</CustomLabel>
              <Controller
                name="version"
                control={control}
                render={({ field }) => <Input id="version" {...field} placeholder="ex: 1.0, 2.1b" />}
              />
            </div>
            
            <div>
              <CustomLabel htmlFor="tags">Tags</CustomLabel>
              <Controller
                name="tags"
                control={control}
                render={({ field }) => (
                  <MultiSelect
                    options={availableTags.map(tag => ({ label: tag, value: tag }))}
                    selected={field.value || []}
                    onChange={field.onChange}
                    placeholder="Sélectionner ou ajouter des tags..."
                    creatable // Permet d'ajouter de nouveaux tags
                  />
                )}
              />
              {errors.tags && <p className="text-sm text-red-600 mt-1">{Array.isArray(errors.tags) ? errors.tags.map(e => e.message).join(', ') : errors.tags.message}</p>}
              <p className="text-xs text-gray-500 mt-1">Séparez les tags par une virgule ou utilisez la sélection multiple.</p>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={() => navigate('/bibliotheque')} disabled={isLoading}>
                Annuler
              </Button>
              <Button type="submit" className="bg-paritel-primary hover:bg-paritel-primary/90" disabled={isLoading || (isFetchingData && !!documentId)}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (documentId ? <Save className="mr-2 h-4 w-4" /> : <UploadCloud className="mr-2 h-4 w-4" />)}
                {documentId ? 'Enregistrer les Modifications' : 'Téléverser et Créer'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LibraryDocumentForm;

