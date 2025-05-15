import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getOfferById, Offer, OfferDocument, getOfferDocuments, deleteOfferDocument, uploadOfferDocument, deleteOffer } from '@/services/OfferService';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Edit, Trash2, UploadCloud, Download, FileText, CalendarDays, UserCircle, Tag, Building, Info, AlertTriangle, CheckCircle, XCircle, Paperclip } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const OfferDetailPage: React.FC = () => {
  const { offerId } = useParams<{ offerId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { userProfile, checkRouteAccess } = useAuth();

  const [offer, setOffer] = useState<Offer | null>(null);
  const [documents, setDocuments] = useState<OfferDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<string>("Autre"); // Default document type

  const fetchOfferDetails = useCallback(async () => {
    if (!offerId) return;
    setIsLoading(true);
    setError(null);
    try {
      const offerData = await getOfferById(offerId);
      if (offerData) {
        setOffer(offerData);
        const offerDocuments = await getOfferDocuments(offerId);
        setDocuments(offerDocuments);
      } else {
        setError("Appel d'offres non trouvé.");
        toast({ title: "Erreur", description: "Appel d'offres non trouvé.", variant: "destructive" });
        navigate("/appels-offres");
      }
    } catch (err: any) {
      console.error("Erreur lors de la récupération des détails de l'AO:", err);
      setError(err.message || "Une erreur est survenue.");
      toast({ title: "Erreur", description: err.message || "Impossible de charger les détails.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [offerId, navigate, toast]);

  useEffect(() => {
    fetchOfferDetails();
  }, [fetchOfferDetails]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFileToUpload(event.target.files[0]);
    }
  };

  const handleUploadDocument = async () => {
    if (!fileToUpload || !offerId) return;
    setIsUploading(true);
    try {
      await uploadOfferDocument(offerId, fileToUpload, documentType);
      toast({ title: "Succès", description: "Document téléversé avec succès." });
      setFileToUpload(null);
      setDocumentType("Autre");
      fetchOfferDetails(); // Refresh documents list
    } catch (err: any) {
      console.error("Erreur lors du téléversement du document:", err);
      toast({ title: "Erreur d'upload", description: err.message || "Impossible de téléverser le document.", variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteDocument = async (documentId: string, filePath: string) => {
    try {
      await deleteOfferDocument(documentId, filePath);
      toast({ title: "Succès", description: "Document supprimé avec succès." });
      fetchOfferDetails(); // Refresh documents list
    } catch (err: any) {
      console.error("Erreur lors de la suppression du document:", err);
      toast({ title: "Erreur de suppression", description: err.message || "Impossible de supprimer le document.", variant: "destructive" });
    }
  };
  
  const handleDeleteOffer = async () => {
    if (!offerId) return;
    try {
      await deleteOffer(offerId);
      toast({ title: "Succès", description: "Appel d'offres supprimé avec succès." });
      navigate("/appels-offres");
    } catch (err: any) {
      console.error("Erreur lors de la suppression de l'appel d'offres:", err);
      toast({ title: "Erreur de suppression", description: err.message || "Impossible de supprimer l'appel d'offres.", variant: "destructive" });
    }
  };

  const getStatusBadgeVariant = (status?: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status?.toLowerCase()) {
      case 'gagné': return 'default'; // Vert (à styler)
      case 'perdu': return 'destructive';
      case 'en cours de réponse': return 'secondary'; // Jaune/Orange (à styler)
      case 'déposé': return 'outline'; // Bleu (à styler)
      case 'à étudier': return 'secondary'; // Gris
      default: return 'outline';
    }
  };
  
  const getStatusIcon = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'gagné': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'perdu': return <XCircle className="h-5 w-5 text-red-600" />;
      case 'abandonné': return <XCircle className="h-5 w-5 text-gray-500" />;
      default: return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[calc(100vh-100px)]">
        <Loader2 className="h-12 w-12 text-paritel-primary animate-spin mb-4" />
        <p className="text-lg font-medium text-gray-700">Chargement des détails de l'appel d'offres...</p>
      </div>
    );
  }

  if (error || !offer) {
    return (
      <div className="p-6 text-center">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error || "Impossible de charger les informations de l'appel d'offres."}</AlertDescription>
        </Alert>
        <Button onClick={() => navigate("/appels-offres")} className="mt-4">Retour à la liste</Button>
      </div>
    );
  }

  // Cast pour accéder aux noms des responsables
  const offerWithManagerNames = offer as any;

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-paritel-primary flex items-center">
            {getStatusIcon(offer.status)} <span className="ml-2">{offer.market_name}</span>
          </h1>
          <p className="text-lg text-gray-600">Détails du dossier d'appel d'offres.</p>
        </div>
        <div className="flex space-x-2">
          {checkRouteAccess(["Commercial AO", "Admin"]) && (
            <Link to={`/appels-offres/modifier/${offer.id}`}>
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
                    <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cet appel d'offres ?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Cette action est irréversible et supprimera toutes les données associées, y compris les documents.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteOffer} className="bg-destructive hover:bg-destructive/90">
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
          <TabsTrigger value="documents">Documents</TabsTrigger>
          {/* Autres onglets potentiels: Suivi, Communication, Analyse de Risque, etc. */}
        </TabsList>

        <TabsContent value="informations">
          <Card>
            <CardHeader>
              <CardTitle>Détails de l'Appel d'Offres</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                <div className="flex items-center"><Building className="h-5 w-5 mr-2 text-paritel-primary" /><strong>Organisme:</strong> <span className="ml-2">{offer.organization || 'N/A'}</span></div>
                <div className="flex items-center"><Tag className="h-5 w-5 mr-2 text-paritel-primary" /><strong>Numéro de Lot/Référence:</strong> <span className="ml-2">{offer.lot_number || 'N/A'}</span></div>
                <div className="flex items-center"><CalendarDays className="h-5 w-5 mr-2 text-paritel-primary" /><strong>Date Limite:</strong> <span className="ml-2">{offer.deadline ? new Date(offer.deadline).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}</span></div>
                <div className="flex items-center"><Info className="h-5 w-5 mr-2 text-paritel-primary" /><strong>Statut:</strong> <Badge variant={getStatusBadgeVariant(offer.status)} className="ml-2">{offer.status || 'N/D'}</Badge></div>
                <div className="flex items-center"><UserCircle className="h-5 w-5 mr-2 text-paritel-primary" /><strong>Responsable Commercial:</strong> <span className="ml-2">{offerWithManagerNames.commercial_manager?.full_name || 'Non assigné'}</span></div>
                <div className="flex items-center"><UserCircle className="h-5 w-5 mr-2 text-paritel-primary" /><strong>Responsable Technique/AVV:</strong> <span className="ml-2">{offerWithManagerNames.technical_manager?.full_name || 'Non assigné'}</span></div>
                <div className="flex items-center"><UserCircle className="h-5 w-5 mr-2 text-paritel-primary" /><strong>Créé par:</strong> <span className="ml-2">{offerWithManagerNames.created_by?.full_name || 'N/A'}</span></div>
                <div className="flex items-center"><CalendarDays className="h-5 w-5 mr-2 text-paritel-primary" /><strong>Date de Création:</strong> <span className="ml-2">{offer.created_at ? new Date(offer.created_at).toLocaleDateString('fr-FR') : 'N/A'}</span></div>
              </div>
              {/* Ajouter d'autres champs ici: description détaillée, notes, etc. */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des Documents</CardTitle>
              <CardDescription>Téléversez et gérez les documents relatifs à cet appel d'offres.</CardDescription>
            </CardHeader>
            <CardContent>
              {checkRouteAccess(["Commercial AO", "Avant-vente", "Admin"]) && (
                <div className="mb-6 p-4 border rounded-lg space-y-3">
                  <h3 class="text-lg font-medium">Téléverser un nouveau document</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div>
                      <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-1">Fichier</label>
                      <input id="file-upload" type="file" onChange={handleFileChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-paritel-primary file:text-white hover:file:bg-paritel-primary/90"/>
                    </div>
                    <div>
                      <label htmlFor="document-type" className="block text-sm font-medium text-gray-700 mb-1">Type de document</label>
                      {/* Remplacer par un Select si les types sont prédéfinis */}
                      <select id="document-type" value={documentType} onChange={(e) => setDocumentType(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-paritel-primary focus:border-paritel-primary sm:text-sm rounded-md">
                        <option>CCTP</option>
                        <option>RC (Règlement de Consultation)</option>
                        <option>AE (Acte d'Engagement)</option>
                        <option>BPU (Bordereau des Prix Unitaires)</option>
                        <option>DPGF (Décomposition du Prix Global et Forfaitaire)</option>
                        <option>Mémoire Technique</option>
                        <option>Planning</option>
                        <option>Question/Réponse</option>
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
                          {/* Idéalement, le lien pointerait vers une URL de téléchargement sécurisée via Supabase Storage */}
                          <a href={supabase.storage.from('offer-documents').getPublicUrl(doc.file_path).data.publicUrl} target="_blank" rel="noopener noreferrer" className="hover:underline text-paritel-primary">
                            {doc.file_name}
                          </a>
                        </TableCell>
                        <TableCell>{doc.file_type || 'N/A'}</TableCell>
                        <TableCell>{(doc as any).uploaded_by?.full_name || 'N/A'}</TableCell>
                        <TableCell>{doc.created_at ? new Date(doc.created_at).toLocaleDateString() : 'N/A'}</TableCell>
                        <TableCell className="text-right space-x-1">
                          <a href={supabase.storage.from('offer-documents').getPublicUrl(doc.file_path).data.publicUrl} download={doc.file_name} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="icon" title="Télécharger">
                              <Download className="h-4 w-4" />
                            </Button>
                          </a>
                          {checkRouteAccess(["Commercial AO", "Admin"]) && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="icon" title="Supprimer">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Supprimer le document "{doc.file_name}" ?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Cette action est irréversible.
                                  </AlertDialogDescription>
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
                <p className="text-center text-gray-500 py-8">Aucun document associé à cet appel d'offres pour le moment.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OfferDetailPage;

