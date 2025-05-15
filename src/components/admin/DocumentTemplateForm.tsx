import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/context/AuthContext';
import { 
  createDocumentTemplate, 
  getDocumentTemplateById, 
  updateDocumentTemplate, 
  DocumentTemplate 
} from '@/services/DocumentTemplateService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CustomLabel } from '@/components/ui/custom-label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, FilePlus, Settings } from 'lucide-react';

// Schéma de validation avec Zod
const templateFormSchema = z.object({
  name: z.string().min(3, { message: "Le nom du modèle doit contenir au moins 3 caractères." }),
  description: z.string().optional(),
  template_type: z.enum(["offre", "produit", "general"], { message: "Type de modèle invalide." }),
  // content_structure: z.any(), // Pour l'instant, on ne gère pas l'édition de la structure JSON via UI
  output_format: z.enum(["pdf", "docx", "html"], { message: "Format de sortie invalide." }),
});

type TemplateFormData = z.infer<typeof templateFormSchema>;

const DocumentTemplateForm: React.FC = () => {
  const { templateId } = useParams<{ templateId?: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { checkRouteAccess } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(!!templateId);
  const [contentStructure, setContentStructure] = useState<any>({}); // Pour afficher la structure existante

  const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm<TemplateFormData>({
    resolver: zodResolver(templateFormSchema),
    defaultValues: {
      name: '',
      description: '',
      template_type: 'general',
      output_format: 'pdf',
    },
  });

  const fetchTemplateDetails = useCallback(async () => {
    if (!templateId) {
      setIsFetchingData(false);
      return;
    }
    setIsFetchingData(true);
    try {
      const template = await getDocumentTemplateById(templateId);
      if (template) {
        reset({
          name: template.name,
          description: template.description || '',
          template_type: template.template_type,
          output_format: template.output_format,
        });
        setContentStructure(template.content_structure || {});
      } else {
        toast({ title: "Erreur", description: "Modèle non trouvé.", variant: "destructive" });
        navigate('/administration/modeles');
      }
    } catch (error) {
      console.error("Erreur chargement détails modèle:", error);
      toast({ title: "Erreur", description: "Impossible de charger les détails du modèle.", variant: "destructive" });
    } finally {
      setIsFetchingData(false);
    }
  }, [templateId, reset, navigate, toast]);

  useEffect(() => {
    if (!checkRouteAccess(['Admin', 'Chef de produit'])) {
        toast({ title: "Accès refusé", description: "Vous n'avez pas les droits pour accéder à cette page.", variant: "destructive" });
        navigate('/administration/modeles');
        return;
    }
    fetchTemplateDetails();
  }, [fetchTemplateDetails, checkRouteAccess, navigate, toast]);

  const onSubmit = async (formData: TemplateFormData) => {
    setIsLoading(true);
    try {
      // Pour l'instant, la structure de contenu est gérée manuellement ou par un autre outil
      // On ne la modifie pas via ce formulaire simple.
      const payload: Omit<DocumentTemplate, "id" | "created_by_id" | "created_at" | "updated_at" | "content_structure"> & { content_structure?: any } = {
        ...formData,
      };

      if (templateId) {
        // Si on met à jour, on ne touche pas à content_structure ici, sauf si on ajoute un champ pour l'éditer
        const currentTemplate = await getDocumentTemplateById(templateId);
        payload.content_structure = currentTemplate?.content_structure || {}; // Conserver la structure existante
        await updateDocumentTemplate(templateId, payload as Partial<DocumentTemplate>); // Cast car content_structure est optionnel dans le payload
        toast({ title: "Succès", description: "Modèle mis à jour avec succès." });
      } else {
        // Pour un nouveau modèle, on pourrait initialiser une structure vide ou par défaut
        payload.content_structure = {}; // Ou une structure par défaut
        await createDocumentTemplate(payload as DocumentTemplate);
        toast({ title: "Succès", description: "Modèle créé avec succès." });
      }
      navigate('/administration/modeles');
    } catch (error: any) {
      console.error("Erreur lors de la soumission du formulaire de modèle:", error);
      toast({ title: "Erreur", description: error.message || "Une erreur est survenue.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetchingData && templateId) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[calc(100vh-100px)]">
        <Loader2 className="h-12 w-12 text-paritel-primary animate-spin mb-4" />
        <p className="text-lg font-medium text-gray-700">Chargement du formulaire de modèle...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="mr-2 h-6 w-6" /> 
            {templateId ? "Modifier le Modèle de Document" : "Créer un Nouveau Modèle de Document"}
          </CardTitle>
          <CardDescription>
            {templateId ? "Mettez à jour les informations de ce modèle." : "Définissez un nouveau modèle pour la génération de documents."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <CustomLabel htmlFor="name">Nom du Modèle *</CustomLabel>
              <Controller
                name="name"
                control={control}
                render={({ field }) => <Input id="name" {...field} />}
              />
              {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <CustomLabel htmlFor="description">Description</CustomLabel>
              <Controller
                name="description"
                control={control}
                render={({ field }) => <Textarea id="description" {...field} rows={3} />}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <CustomLabel htmlFor="template_type">Type de Modèle *</CustomLabel>
                <Controller
                  name="template_type"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id="template_type">
                        <SelectValue placeholder="Sélectionner un type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="offre">Appel d'Offres</SelectItem>
                        <SelectItem value="produit">Produit/Service</SelectItem>
                        <SelectItem value="general">Général</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.template_type && <p className="text-sm text-red-600 mt-1">{errors.template_type.message}</p>}
              </div>

              <div>
                <CustomLabel htmlFor="output_format">Format de Sortie *</CustomLabel>
                <Controller
                  name="output_format"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id="output_format">
                        <SelectValue placeholder="Sélectionner un format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="docx">DOCX</SelectItem>
                        <SelectItem value="html">HTML (pour prévisualisation)</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.output_format && <p className="text-sm text-red-600 mt-1">{errors.output_format.message}</p>}
              </div>
            </div>

            {templateId && (
                <div>
                    <CustomLabel>Structure du Contenu (JSON) - Lecture Seule</CustomLabel>
                    <Textarea 
                        value={JSON.stringify(contentStructure, null, 2)} 
                        readOnly 
                        rows={8}
                        className="text-xs bg-gray-50 font-mono"
                    />
                    <p className="text-xs text-gray-500 mt-1">La modification de la structure se fait actuellement en base de données ou via un outil dédié.</p>
                </div>
            )}

            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={() => navigate('/administration/modeles')} disabled={isLoading}>
                Annuler
              </Button>
              <Button type="submit" className="bg-paritel-primary hover:bg-paritel-primary/90" disabled={isLoading || (isFetchingData && !!templateId)}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (templateId ? <Save className="mr-2 h-4 w-4" /> : <FilePlus className="mr-2 h-4 w-4" />)}
                {templateId ? 'Enregistrer les Modifications' : 'Créer le Modèle'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentTemplateForm;

