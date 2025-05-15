import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getDocumentTemplates, DocumentTemplate, deleteDocumentTemplate } from '@/services/DocumentTemplateService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Edit, Trash2, Loader2, FileText, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const DocumentTemplatesPage: React.FC = () => {
  const { checkRouteAccess } = useAuth();
  const { toast } = useToast();
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTemplates = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Accès pour Admin et Chef de produit pour la gestion des modèles
      if (!checkRouteAccess(['Admin', 'Chef de produit'])) {
        setError("Vous n'avez pas les droits pour accéder à cette page.");
        toast({ title: "Accès refusé", variant: "destructive" });
        setTemplates([]);
        return;
      }
      const fetchedTemplates = await getDocumentTemplates();
      setTemplates(fetchedTemplates);
    } catch (err: any) {
      console.error("Erreur lors de la récupération des modèles de documents:", err);
      setError(err.message || "Une erreur est survenue lors du chargement des modèles.");
    } finally {
      setIsLoading(false);
    }
  }, [checkRouteAccess, toast]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const handleDeleteTemplate = async (templateId: string) => {
    try {
      await deleteDocumentTemplate(templateId);
      toast({ title: "Succès", description: "Modèle supprimé avec succès." });
      fetchTemplates(); // Refresh list
    } catch (err: any) {
      console.error("Erreur lors de la suppression du modèle:", err);
      toast({ title: "Erreur de suppression", description: err.message || "Impossible de supprimer le modèle.", variant: "destructive" });
    }
  };
  
  const getTemplateTypeBadge = (type: DocumentTemplate['template_type']) => {
    switch(type) {
      case 'offre': return <Badge variant="secondary">Appel d'Offres</Badge>;
      case 'produit': return <Badge variant="outline">Produit/Service</Badge>;
      case 'general': return <Badge>Général</Badge>;
      default: return <Badge variant="secondary">{type}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[calc(100vh-100px)]">
        <Loader2 className="h-12 w-12 text-paritel-primary animate-spin mb-4" />
        <p className="text-lg font-medium text-gray-700">Chargement des modèles...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-paritel-primary flex items-center">
            <FileText className="mr-3 h-8 w-8" /> Gestion des Modèles de Documents
          </h1>
          <p className="text-lg text-gray-600">Créez et gérez les modèles pour la génération de documents.</p>
        </div>
        {checkRouteAccess(['Admin', 'Chef de produit']) && (
          <Link to="/administration/modeles/nouveau">
            <Button className="bg-paritel-primary hover:bg-paritel-primary/90">
              <PlusCircle className="mr-2 h-5 w-5" />
              Nouveau Modèle
            </Button>
          </Link>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Modèles</CardTitle>
          <CardDescription>Modèles disponibles pour la génération de documents.</CardDescription>
        </CardHeader>
        <CardContent>
          {templates.length === 0 && !isLoading ? (
            <p className="text-center text-gray-500 py-8">Aucun modèle de document trouvé.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom du Modèle</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Format de Sortie</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Date MàJ</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {templates.map((template) => (
                  <TableRow key={template.id}>
                    <TableCell className="font-medium">
                      <Link to={`/administration/modeles/modifier/${template.id}`} className="hover:underline text-paritel-primary">
                        {template.name}
                      </Link>
                    </TableCell>
                    <TableCell>{getTemplateTypeBadge(template.template_type)}</TableCell>
                    <TableCell><Badge variant="default">{template.output_format.toUpperCase()}</Badge></TableCell>
                    <TableCell className="text-sm text-gray-600 truncate max-w-xs">{template.description || '-'}</TableCell>
                    <TableCell>{template.updated_at ? new Date(template.updated_at).toLocaleDateString() : '-'}</TableCell>
                    <TableCell className="text-right space-x-1">
                      <Link to={`/administration/modeles/modifier/${template.id}`}>
                        <Button variant="outline" size="icon" title="Modifier">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="icon" title="Supprimer">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Supprimer le modèle "{template.name}"?</AlertDialogTitle>
                            <AlertDialogDescription>Cette action est irréversible.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteTemplate(template.id!)} className="bg-destructive hover:bg-destructive/90">
                              Supprimer
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentTemplatesPage;

