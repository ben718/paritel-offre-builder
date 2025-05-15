import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  getProductById, Product, ProductDocument, getProductDocuments, deleteProductDocument, uploadProductDocument, deleteProduct,
  ProductPrice, getProductPrices, createProductPrice, updateProductPrice, deleteProductPrice
} from '@/services/ProductService';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Loader2, Edit, Trash2, UploadCloud, Download, FileText, Package, Tag, Info, AlertTriangle, 
  CheckCircle, XCircle, Paperclip, Settings, DollarSign, ListChecks, PlusCircle 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, 
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { supabase } from '@/integrations/supabase/client'; // For public URL
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { CustomLabel } from "@/components/ui/custom-label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const priceFormSchema = z.object({
  price_ht: z.preprocess(
    (val) => parseFloat(String(val)),
    z.number().positive({ message: "Le prix HT doit être un nombre positif." })
  ),
  currency: z.string().min(3, { message: "La devise est requise." }).default("EUR"),
  price_type: z.enum(["mensuel", "annuel", "ponctuel", "sur devis"], { message: "Type de prix invalide." }),
  valid_from: z.string().optional().nullable(),
  valid_to: z.string().optional().nullable(),
});

type PriceFormData = z.infer<typeof priceFormSchema>;

const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, userProfile, checkRouteAccess } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [documents, setDocuments] = useState<ProductDocument[]>([]);
  const [prices, setPrices] = useState<ProductPrice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<string>("Fiche Technique");
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const [editingPrice, setEditingPrice] = useState<ProductPrice | null>(null);

  const { control: priceControl, handleSubmit: handlePriceSubmit, reset: resetPriceForm, formState: { errors: priceErrors } } = useForm<PriceFormData>({
    resolver: zodResolver(priceFormSchema),
    defaultValues: {
      price_ht: 0,
      currency: "EUR",
      price_type: "mensuel",
      valid_from: null,
      valid_to: null,
    }
  });

  const fetchProductDetails = useCallback(async () => {
    if (!productId) return;
    setIsLoading(true);
    setError(null);
    try {
      const productData = await getProductById(productId);
      if (productData) {
        setProduct(productData);
        const productDocs = await getProductDocuments(productId);
        setDocuments(productDocs);
        const productPrices = await getProductPrices(productId);
        setPrices(productPrices);
      } else {
        setError("Produit/Service non trouvé.");
        toast({ title: "Erreur", description: "Produit/Service non trouvé.", variant: "destructive" });
        navigate("/catalogue/produits");
      }
    } catch (err: any) {
      console.error("Erreur lors de la récupération des détails du produit:", err);
      setError(err.message || "Une erreur est survenue.");
      toast({ title: "Erreur", description: err.message || "Impossible de charger les détails.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [productId, navigate, toast]);

  useEffect(() => {
    fetchProductDetails();
  }, [fetchProductDetails]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFileToUpload(event.target.files[0]);
    }
  };

  const handleUploadDocument = async () => {
    if (!fileToUpload || !productId) return;
    setIsUploading(true);
    try {
      await uploadProductDocument(productId, fileToUpload, documentType);
      toast({ title: "Succès", description: "Document téléversé avec succès." });
      setFileToUpload(null);
      setDocumentType("Fiche Technique");
      fetchProductDetails(); // Refresh documents list
    } catch (err: any) {
      console.error("Erreur lors du téléversement du document:", err);
      toast({ title: "Erreur d'upload", description: err.message || "Impossible de téléverser le document.", variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteDocument = async (documentId: string, filePath: string) => {
    try {
      await deleteProductDocument(documentId, filePath);
      toast({ title: "Succès", description: "Document supprimé avec succès." });
      fetchProductDetails(); // Refresh documents list
    } catch (err: any) {
      console.error("Erreur lors de la suppression du document:", err);
      toast({ title: "Erreur de suppression", description: err.message || "Impossible de supprimer le document.", variant: "destructive" });
    }
  };

  const handleDeleteProduct = async () => {
    if (!productId) return;
    try {
      await deleteProduct(productId);
      toast({ title: "Succès", description: "Produit/Service supprimé avec succès." });
      navigate("/catalogue/produits");
    } catch (err: any) {
      console.error("Erreur lors de la suppression du produit:", err);
      toast({ title: "Erreur de suppression", description: err.message || "Impossible de supprimer le produit/service.", variant: "destructive" });
    }
  };

  const openPriceModal = (price?: ProductPrice) => {
    if (price) {
      setEditingPrice(price);
      resetPriceForm({
        price_ht: price.price_ht,
        currency: price.currency,
        price_type: price.price_type,
        valid_from: price.valid_from ? new Date(price.valid_from).toISOString().split('T')[0] : null,
        valid_to: price.valid_to ? new Date(price.valid_to).toISOString().split('T')[0] : null,
      });
    } else {
      setEditingPrice(null);
      resetPriceForm({
        price_ht: 0,
        currency: "EUR",
        price_type: "mensuel",
        valid_from: null,
        valid_to: null,
      });
    }
    setIsPriceModalOpen(true);
  };

  const onPriceSubmit = async (formData: PriceFormData) => {
    if (!productId || !user) return;
    try {
      const payload = {
        ...formData,
        valid_from: formData.valid_from || undefined,
        valid_to: formData.valid_to || undefined,
      };
      if (editingPrice) {
        await updateProductPrice(editingPrice.id!, payload);
        toast({ title: "Succès", description: "Prix mis à jour." });
      } else {
        await createProductPrice({ ...payload, product_id: productId });
        toast({ title: "Succès", description: "Prix ajouté." });
      }
      fetchProductDetails();
      setIsPriceModalOpen(false);
    } catch (error: any) {
      toast({ title: "Erreur", description: error.message || "Impossible de sauvegarder le prix.", variant: "destructive" });
    }
  };

  const handleDeletePrice = async (priceId: string) => {
    try {
      await deleteProductPrice(priceId);
      toast({ title: "Succès", description: "Prix supprimé." });
      fetchProductDetails();
    } catch (error: any) {
      toast({ title: "Erreur", description: error.message || "Impossible de supprimer le prix.", variant: "destructive" });
    }
  };
  
  const getStatusBadgeVariant = (status?: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status?.toLowerCase()) {
      case 'actif': return 'default';
      case 'obsolète': return 'destructive';
      case 'en développement': return 'secondary';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'actif': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'obsolète': return <XCircle className="h-5 w-5 text-red-600" />;
      case 'en développement': return <Settings className="h-5 w-5 text-yellow-600" />;
      default: return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[calc(100vh-100px)]">
        <Loader2 className="h-12 w-12 text-paritel-primary animate-spin mb-4" />
        <p className="text-lg font-medium text-gray-700">Chargement des détails du produit/service...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="p-6 text-center">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error || "Impossible de charger les informations du produit/service."}</AlertDescription>
        </Alert>
        <Button onClick={() => navigate("/catalogue/produits")} className="mt-4">Retour à la liste</Button>
      </div>
    );
  }
  
  const productWithCategory = product as any; // Pour accéder à product.category.name

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-paritel-primary flex items-center">
            {getStatusIcon(product.status)} <span className="ml-2">{product.name}</span>
          </h1>
          <p className="text-lg text-gray-600">Référence: {product.reference || 'N/A'}</p>
        </div>
        <div className="flex space-x-2">
          {checkRouteAccess(["Chef de produit", "Admin"]) && (
            <Link to={`/catalogue/produits/modifier/${product.id}`}>
              <Button variant="outline">
                <Edit className="mr-2 h-4 w-4" /> Modifier
              </Button>
            </Link>
          )}
          {checkRouteAccess(["Admin"]) && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ce produit/service ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action est irréversible et supprimera toutes les données associées.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteProduct} className="bg-destructive hover:bg-destructive/90">
                    Supprimer Définitivement
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      <Tabs defaultValue="informations" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="informations">Informations Générales</TabsTrigger>
          <TabsTrigger value="specifications">Spécifications Techniques</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="tarifs">Tarification</TabsTrigger>
        </TabsList>

        <TabsContent value="informations">
          {/* ... Contenu de l'onglet Informations ... */}
          <Card>
            <CardHeader>
              <CardTitle>Description et Catégorie</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                <div className="flex items-start"><Package className="h-5 w-5 mr-2 mt-1 text-paritel-primary flex-shrink-0" /><div><strong>Nom:</strong> <span className="ml-2">{product.name}</span></div></div>
                <div className="flex items-start"><Tag className="h-5 w-5 mr-2 mt-1 text-paritel-primary flex-shrink-0" /><div><strong>Référence:</strong> <span className="ml-2">{product.reference || 'N/A'}</span></div></div>
                <div className="flex items-start"><ListChecks className="h-5 w-5 mr-2 mt-1 text-paritel-primary flex-shrink-0" /><div><strong>Catégorie:</strong> <span className="ml-2">{productWithCategory.category?.name || 'Non catégorisé'}</span></div></div>
                <div className="flex items-start"><Info className="h-5 w-5 mr-2 mt-1 text-paritel-primary flex-shrink-0" /><div><strong>Statut:</strong> <Badge variant={getStatusBadgeVariant(product.status)} className="ml-2">{product.status || 'N/D'}</Badge></div></div>
              </div>
              <div className="mt-4">
                <h4 className="font-semibold mb-1">Description:</h4>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{product.description || 'Aucune description fournie.'}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="specifications">
          {/* ... Contenu de l'onglet Spécifications ... */}
          <Card>
            <CardHeader>
              <CardTitle>Spécifications Techniques</CardTitle>
            </CardHeader>
            <CardContent>
              {product.technical_specifications && Object.keys(product.technical_specifications).length > 0 ? (
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                  {Object.entries(product.technical_specifications).map(([key, value]) => (
                    <div key={key} className="border-b pb-1">
                      <dt className="font-medium text-gray-600">{key}:</dt>
                      <dd className="text-gray-800">{String(value)}</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p className="text-sm text-gray-500">Aucune spécification technique détaillée pour ce produit/service.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          {/* ... Contenu de l'onglet Documents ... */}
          <Card>
            <CardHeader>
              <CardTitle>Documents Associés</CardTitle>
              <CardDescription>Fiches techniques, présentations, etc.</CardDescription>
            </CardHeader>
            <CardContent>
              {checkRouteAccess(["Chef de produit", "Admin"]) && (
                <div className="mb-6 p-4 border rounded-lg space-y-3">
                  <h3 className="text-lg font-medium">Téléverser un nouveau document</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div>
                      <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-1">Fichier</label>
                      <input id="file-upload" type="file" onChange={handleFileChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-paritel-primary file:text-white hover:file:bg-paritel-primary/90"/>
                    </div>
                    <div>
                      <label htmlFor="document-type" className="block text-sm font-medium text-gray-700 mb-1">Type de document</label>
                      <select id="document-type" value={documentType} onChange={(e) => setDocumentType(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-paritel-primary focus:border-paritel-primary sm:text-sm rounded-md">
                        <option>Fiche Technique</option>
                        <option>Présentation Commerciale</option>
                        <option>Grille Tarifaire</option>
                        <option>Manuel Utilisateur</option>
                        <option>Autre</option>
                      </select>
                    </div>
                    <Button onClick={handleUploadDocument} disabled={!fileToUpload || isUploading} className="w-full md:w-auto">
                      {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
                      Téléverser
                    </Button>
                  </div>
                  {fileToUpload && <p className="text-sm text-gray-500 mt-2">Fichier sélectionné: {fileToUpload.name}</p>}
                </div>
              )}

              {documents.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom du Fichier</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Téléversé par</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documents.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell className="font-medium flex items-center">
                          <Paperclip className="h-4 w-4 mr-2 text-gray-500" />
                          <a href={supabase.storage.from('product-attachments').getPublicUrl(doc.file_path).data.publicUrl} target="_blank" rel="noopener noreferrer" className="hover:underline text-paritel-primary">
                            {doc.file_name}
                          </a>
                        </TableCell>
                        <TableCell>{doc.document_type || 'N/A'}</TableCell>
                        <TableCell>{(doc as any).uploaded_by?.full_name || 'N/A'}</TableCell>
                        <TableCell>{doc.created_at ? new Date(doc.created_at).toLocaleDateString() : 'N/A'}</TableCell>
                        <TableCell className="text-right space-x-1">
                          <a href={supabase.storage.from('product-attachments').getPublicUrl(doc.file_path).data.publicUrl} download={doc.file_name} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="icon" title="Télécharger">
                              <Download className="h-4 w-4" />
                            </Button>
                          </a>
                          {checkRouteAccess(["Chef de produit", "Admin"]) && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="icon" title="Supprimer">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Supprimer le document "{doc.file_name}" ?</AlertDialogTitle>
                                  <AlertDialogDescription>Cette action est irréversible.</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteDocument(doc.id!, doc.file_path)} className="bg-destructive hover:bg-destructive/90">
                                    Supprimer
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center text-gray-500 py-8">Aucun document associé à ce produit/service.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tarifs">
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <div>
                <CardTitle>Tarification</CardTitle>
                <CardDescription>Gérez les prix et conditions tarifaires de ce produit/service.</CardDescription>
              </div>
              {checkRouteAccess(["Chef de produit", "Admin"]) && (
                <Dialog open={isPriceModalOpen} onOpenChange={setIsPriceModalOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => openPriceModal()}>
                      <PlusCircle className="mr-2 h-4 w-4" /> Ajouter un Prix
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingPrice ? "Modifier le Prix" : "Ajouter un Nouveau Prix"}</DialogTitle>
                      <DialogDescription>
                        Remplissez les informations ci-dessous pour {editingPrice ? "mettre à jour" : "créer"} un tarif.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handlePriceSubmit(onPriceSubmit)} className="space-y-4 py-4">
                      <div>
                        <CustomLabel htmlFor="price_ht">Prix HT *</CustomLabel>
                        <Controller
                          name="price_ht"
                          control={priceControl}
                          render={({ field }) => <Input id="price_ht" type="number" step="0.01" {...field} />}
                        />
                        {priceErrors.price_ht && <p className="text-sm text-red-600 mt-1">{priceErrors.price_ht.message}</p>}
                      </div>
                      <div>
                        <CustomLabel htmlFor="currency">Devise *</CustomLabel>
                        <Controller
                          name="currency"
                          control={priceControl}
                          render={({ field }) => <Input id="currency" {...field} />}
                        />
                        {priceErrors.currency && <p className="text-sm text-red-600 mt-1">{priceErrors.currency.message}</p>}
                      </div>
                      <div>
                        <CustomLabel htmlFor="price_type">Type de Prix *</CustomLabel>
                        <Controller
                          name="price_type"
                          control={priceControl}
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger id="price_type">
                                <SelectValue placeholder="Sélectionner un type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="mensuel">Mensuel</SelectItem>
                                <SelectItem value="annuel">Annuel</SelectItem>
                                <SelectItem value="ponctuel">Ponctuel</SelectItem>
                                <SelectItem value="sur devis">Sur Devis</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {priceErrors.price_type && <p className="text-sm text-red-600 mt-1">{priceErrors.price_type.message}</p>}
                      </div>
                      <div>
                        <CustomLabel htmlFor="valid_from">Valide du</CustomLabel>
                        <Controller
                          name="valid_from"
                          control={priceControl}
                          render={({ field }) => <Input id="valid_from" type="date" {...field} value={field.value || ''} />}
                        />
                      </div>
                      <div>
                        <CustomLabel htmlFor="valid_to">Valide au</CustomLabel>
                        <Controller
                          name="valid_to"
                          control={priceControl}
                          render={({ field }) => <Input id="valid_to" type="date" {...field} value={field.value || ''} />}
                        />
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">Annuler</Button>
                        </DialogClose>
                        <Button type="submit">{editingPrice ? "Enregistrer" : "Ajouter"}</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </CardHeader>
            <CardContent>
              {prices.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Prix HT</TableHead>
                      <TableHead>Devise</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Valide du</TableHead>
                      <TableHead>Valide au</TableHead>
                      <TableHead>Créé par</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {prices.map((price) => (
                      <TableRow key={price.id}>
                        <TableCell>{price.price_ht.toLocaleString('fr-FR', { style: 'currency', currency: price.currency })}</TableCell>
                        <TableCell>{price.currency}</TableCell>
                        <TableCell>{price.price_type}</TableCell>
                        <TableCell>{price.valid_from ? new Date(price.valid_from).toLocaleDateString('fr-FR') : '-'}</TableCell>
                        <TableCell>{price.valid_to ? new Date(price.valid_to).toLocaleDateString('fr-FR') : '-'}</TableCell>
                        <TableCell>{(price as any).created_by?.full_name || 'N/A'}</TableCell>
                        <TableCell className="text-right space-x-1">
                          {checkRouteAccess(["Chef de produit", "Admin"]) && (
                            <>
                              <Button variant="outline" size="icon" title="Modifier" onClick={() => openPriceModal(price)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="destructive" size="icon" title="Supprimer">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Supprimer ce tarif ?</AlertDialogTitle>
                                    <AlertDialogDescription>Cette action est irréversible.</AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeletePrice(price.id!)} className="bg-destructive hover:bg-destructive/90">
                                      Supprimer
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center text-gray-500 py-8">Aucun tarif défini pour ce produit/service.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
};

export default ProductDetailPage;

