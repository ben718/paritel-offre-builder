import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/context/AuthContext';
import { getDocumentTemplates, DocumentTemplate, generateDocumentFromTemplate } from '@/services/DocumentTemplateService';
import { getOffers, Offer } from '@/services/OfferService'; // Assuming you have a way to get offers
import { getProducts, Product } from '@/services/ProductService'; // Assuming you have a way to get products
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CustomLabel } from '@/components/ui/custom-label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, FileCog, Wand2, LinkIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';

const generateDocumentSchema = z.object({
  templateId: z.string().uuid({ message: "Veuillez sélectionner un modèle." }),
  outputFileName: z.string().min(3, { message: "Le nom du fichier de sortie est requis." }).refine(val => val.includes('.'), { message: "Le nom du fichier doit inclure une extension (ex: .pdf, .docx)."}),
  contextId: z.string().uuid({ message: "Veuillez sélectionner un élément de contexte." }).optional(),
});

type GenerateDocumentFormData = z.infer<typeof generateDocumentSchema>;

const GenerateDocumentPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { checkRouteAccess } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [contextItems, setContextItems] = useState<Array<{ id: string; name: string }>>([]); // For offers or products

  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<GenerateDocumentFormData>({
    resolver: zodResolver(generateDocumentSchema),
    defaultValues: {
      outputFileName: '',
    },
  });

  const watchedTemplateId = watch("templateId");

  const fetchInitialData = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedTemplates = await getDocumentTemplates();
      setTemplates(fetchedTemplates);
    } catch (error) {
      console.error("Erreur chargement des modèles:", error);
      toast({ title: "Erreur", description: "Impossible de charger les modèles.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (!checkRouteAccess(['Admin', 'Chef de produit', 'Commercial AO', 'Avant-vente'])) {
        toast({ title: "Accès refusé", description: "Vous n'avez pas les droits pour accéder à cette page.", variant: "destructive" });
        navigate('/');
        return;
    }
    fetchInitialData();
  }, [fetchInitialData, checkRouteAccess, navigate, toast]);

  useEffect(() => {
    const template = templates.find(t => t.id === watchedTemplateId);
    setSelectedTemplate(template || null);
    setValue("contextId", undefined); // Reset context when template changes
    setContextItems([]);
    if (template) {
        // Suggest a filename based on template name and output format
        const defaultFileName = `${template.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.${template.output_format}`;
        setValue("outputFileName", defaultFileName);

      // Load context items based on template type
      const loadContext = async () => {
        setIsLoading(true);
        if (template.template_type === 'offre') {
          const { offers } = await getOffers({ page: 1, pageSize: 1000 }); // Fetch all for selection for now
          setContextItems(offers.map(o => ({ id: o.id!, name: `${o.market_name} (AO)` })));
        } else if (template.template_type === 'produit') {
          const { products } = await getProducts({ page: 1, pageSize: 1000 }); // Fetch all
          setContextItems(products.map(p => ({ id: p.id!, name: `${p.name} (Produit)` })));
        }
        setIsLoading(false);
      };
      if (template.template_type !== 'general') {
        loadContext();
      }
    }
  }, [watchedTemplateId, templates, setValue]);

  const onSubmit = async (formData: GenerateDocumentFormData) => {
    if (!selectedTemplate) {
        toast({ title: "Erreur", description: "Aucun modèle sélectionné.", variant: "destructive" });
        return;
    }
    setIsLoading(true);
    try {
      const context: any = {};
      if (selectedTemplate.template_type === 'offre' && formData.contextId) {
        context.offerId = formData.contextId;
      } else if (selectedTemplate.template_type === 'produit' && formData.contextId) {
        context.productId = formData.contextId;
      }
      // Add more context if needed

      const { generatedDocument, error } = await generateDocumentFromTemplate(formData.templateId, context, formData.outputFileName);
      
      if (error || !generatedDocument) {
        throw new Error(error || "La génération du document a échoué.");
      }

      toast({ 
        title: "Succès", 
        description: (
            <span>
                Document "{generatedDocument.title}" généré avec succès! 
                <a href={`/bibliotheque/document/${generatedDocument.id}`} className='underline ml-1'>Voir dans la bibliothèque</a>
            </span>
        ),
        duration: 7000,
      });
      navigate('/bibliotheque'); 
    } catch (error: any) {
      console.error("Erreur lors de la génération du document:", error);
      toast({ title: "Erreur de Génération", description: error.message || "Une erreur est survenue.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Wand2 className="mr-2 h-6 w-6 text-paritel-primary" /> 
            Générer un Document Intelligent
          </CardTitle>
          <CardDescription>
            Sélectionnez un modèle, fournissez le contexte nécessaire et générez votre document.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <CustomLabel htmlFor="templateId">Modèle de Document *</CustomLabel>
              <Controller
                name="templateId"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="templateId">
                      <SelectValue placeholder="Sélectionner un modèle" />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map(template => (
                        <SelectItem key={template.id} value={template.id!}>
                          {template.name} ({template.template_type}, {template.output_format.toUpperCase()})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.templateId && <p className="text-sm text-red-600 mt-1">{errors.templateId.message}</p>}
            </div>

            {selectedTemplate && selectedTemplate.template_type !== 'general' && (
              <div>
                <CustomLabel htmlFor="contextId">
                  {selectedTemplate.template_type === 'offre' ? "Appel d'Offres de Contexte *" : "Produit/Service de Contexte *"}
                </CustomLabel>
                <Controller
                  name="contextId"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id="contextId">
                        <SelectValue placeholder={`Sélectionner un${selectedTemplate.template_type === 'offre' ? " appel d'offres" : " produit/service"}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {contextItems.length === 0 && <p className='p-2 text-sm text-gray-500'>Chargement...</p>}
                        {contextItems.map(item => (
                          <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.contextId && <p className="text-sm text-red-600 mt-1">{errors.contextId.message}</p>}
              </div>
            )}
            
            <div>
                <CustomLabel htmlFor="outputFileName">Nom du Fichier de Sortie *</CustomLabel>
                <Controller
                    name="outputFileName"
                    control={control}
                    render={({ field }) => <Input id="outputFileName" {...field} placeholder={`ex: Memoire_Technique_ClientX.${selectedTemplate?.output_format || 'pdf'}`} />}
                />
                {errors.outputFileName && <p className="text-sm text-red-600 mt-1">{errors.outputFileName.message}</p>}
            </div>

            {selectedTemplate && (
                <div className='text-sm p-3 bg-blue-50 border border-blue-200 rounded-md'>
                    <p><strong>Modèle:</strong> {selectedTemplate.name}</p>
                    <p><strong>Type:</strong> {selectedTemplate.template_type}</p>
                    <p><strong>Format de sortie:</strong> {selectedTemplate.output_format.toUpperCase()}</p>
                    <p className='mt-2 text-xs text-gray-600'>La génération créera un document basé sur ce modèle et le sauvegardera dans la bibliothèque.</p>
                </div>
            )}

            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={() => navigate(-1)} disabled={isLoading}>
                Annuler
              </Button>
              <Button type="submit" className="bg-paritel-primary hover:bg-paritel-primary/90" disabled={isLoading || !selectedTemplate}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileCog className="mr-2 h-4 w-4" />}
                Générer le Document
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default GenerateDocumentPage;

