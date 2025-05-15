import React, { useEffect, useState, useCallback } from 'react';
import { 
  getLibraryCategories, 
  createLibraryCategory, 
  updateLibraryCategory, 
  deleteLibraryCategory, 
  LibraryCategory 
} from '@/services/AdminService'; // Ou LibraryService si centralisé là
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Tag, PlusCircle, Edit, Trash2, Save } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter, 
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { CustomLabel } from '@/components/ui/custom-label';

const LibraryCategoriesPage: React.FC = () => {
  const { checkRouteAccess } = useAuth();
  const { toast } = useToast();
  const [categories, setCategories] = useState<LibraryCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<LibraryCategory | null>(null);
  const [currentName, setCurrentName] = useState('');
  const [currentDescription, setCurrentDescription] = useState('');

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (!checkRouteAccess(['Admin', 'Chef de produit'])) {
        setError("Vous n'avez pas les droits pour accéder à cette page.");
        toast({ title: "Accès refusé", variant: "destructive" });
        setCategories([]);
        return;
      }
      const fetchedCategories = await getLibraryCategories();
      setCategories(fetchedCategories);
    } catch (err: any) {
      console.error("Erreur lors de la récupération des catégories:", err);
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setIsLoading(false);
    }
  }, [checkRouteAccess, toast]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleOpenDialog = (category?: LibraryCategory) => {
    if (category) {
      setEditingCategory(category);
      setCurrentName(category.name);
      setCurrentDescription(category.description || '');
    } else {
      setEditingCategory(null);
      setCurrentName('');
      setCurrentDescription('');
    }
    setIsDialogOpen(true);
  };

  const handleSaveCategory = async () => {
    if (!currentName.trim()) {
      toast({ title: "Erreur", description: "Le nom de la catégorie est requis.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      if (editingCategory) {
        await updateLibraryCategory(editingCategory.id!, { name: currentName, description: currentDescription });
        toast({ title: "Succès", description: "Catégorie mise à jour avec succès." });
      } else {
        await createLibraryCategory({ name: currentName, description: currentDescription });
        toast({ title: "Succès", description: "Catégorie créée avec succès." });
      }
      setIsDialogOpen(false);
      fetchCategories();
    } catch (err: any) {
      console.error("Erreur lors de la sauvegarde de la catégorie:", err);
      toast({ title: "Erreur de sauvegarde", description: err.message || "Impossible de sauvegarder la catégorie.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    setIsLoading(true);
    try {
      await deleteLibraryCategory(categoryId);
      toast({ title: "Succès", description: "Catégorie supprimée avec succès." });
      fetchCategories();
    } catch (err: any) {
      console.error("Erreur lors de la suppression de la catégorie:", err);
      toast({ title: "Erreur de suppression", description: err.message || "Impossible de supprimer la catégorie.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && categories.length === 0) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[calc(100vh-100px)]">
        <Loader2 className="h-12 w-12 text-paritel-primary animate-spin mb-4" />
        <p className="text-lg font-medium text-gray-700">Chargement des catégories...</p>
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
            <Tag className="mr-3 h-8 w-8" /> Gestion des Catégories de la Bibliothèque
          </h1>
          <p className="text-lg text-gray-600">Organisez les documents de la bibliothèque avec des catégories.</p>
        </div>
        {checkRouteAccess(['Admin', 'Chef de produit']) && (
          <Button onClick={() => handleOpenDialog()} className="bg-paritel-primary hover:bg-paritel-primary/90">
            <PlusCircle className="mr-2 h-5 w-5" />
            Nouvelle Catégorie
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Catégories</CardTitle>
          <CardDescription>Catégories disponibles pour classer les documents.</CardDescription>
        </CardHeader>
        <CardContent>
          {categories.length === 0 && !isLoading ? (
            <p className="text-center text-gray-500 py-8">Aucune catégorie trouvée.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom de la Catégorie</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Date de Création</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell className="text-sm text-gray-600 truncate max-w-md">{category.description || '-'}</TableCell>
                    <TableCell>{category.created_at ? new Date(category.created_at).toLocaleDateString() : '-'}</TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button variant="outline" size="icon" title="Modifier" onClick={() => handleOpenDialog(category)} disabled={isLoading}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="icon" title="Supprimer" onClick={() => handleDeleteCategory(category.id!)} disabled={isLoading}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingCategory ? 'Modifier la Catégorie' : 'Nouvelle Catégorie'}</DialogTitle>
            <DialogDescription>
              {editingCategory ? "Mettez à jour les informations de cette catégorie." : "Créez une nouvelle catégorie pour la bibliothèque."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <CustomLabel htmlFor="name" className="text-right">Nom *</CustomLabel>
              <Input id="name" value={currentName} onChange={(e) => setCurrentName(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <CustomLabel htmlFor="description" className="text-right">Description</CustomLabel>
              <Textarea id="description" value={currentDescription} onChange={(e) => setCurrentDescription(e.target.value)} className="col-span-3" rows={3}/>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant="outline" disabled={isLoading}>Annuler</Button>
            </DialogClose>
            <Button onClick={handleSaveCategory} disabled={isLoading || !currentName.trim()} className='bg-paritel-primary hover:bg-paritel-primary/90'>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {editingCategory ? 'Enregistrer' : 'Créer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LibraryCategoriesPage;

