import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { createOffer, getOfferById, updateOffer, Offer } from '@/services/OfferService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea'; // Supposons que vous ayez un composant Textarea
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CustomLabel } from '@/components/ui/custom-label'; // Ou Label standard
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save } from 'lucide-react';

// Schéma de validation avec Zod
const offerFormSchema = z.object({
  market_name: z.string().min(3, { message: "Le nom du marché doit contenir au moins 3 caractères." }),
  organization: z.string().optional(),
  lot_number: z.string().optional(),
  deadline: z.string().optional(), // Pourrait être z.date() si vous utilisez un date picker qui retourne un objet Date
  status: z.string().optional(),
  commercial_manager_id: z.string().uuid({ message: "Veuillez sélectionner un responsable commercial." }).optional().or(z.literal('')), // Permet une chaîne vide si optionnel
  technical_manager_id: z.string().uuid({ message: "Veuillez sélectionner un responsable technique." }).optional().or(z.literal('')), // Permet une chaîne vide si optionnel
  // Ajouter d'autres champs ici si nécessaire (ex: description, type d'offre, etc.)
});

type OfferFormData = z.infer<typeof offerFormSchema>;

interface UserProfileSimple {
  id: string;
  full_name: string;
}

const OfferForm: React.FC = () => {
  const { offerId } = useParams<{ offerId?: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth(); // Pour created_by_id
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(!!offerId);
  const [commercialManagers, setCommercialManagers] = useState<UserProfileSimple[]>([]);
  const [technicalManagers, setTechnicalManagers] = useState<UserProfileSimple[]>([]);

  const { control, handleSubmit, reset, formState: { errors } } = useForm<OfferFormData>({
    resolver: zodResolver(offerFormSchema),
    defaultValues: {
      market_name: '',
      organization: '',
      lot_number: '',
      deadline: '',
      status: 'À étudier', // Statut par défaut
      commercial_manager_id: '',
      technical_manager_id: '',
    },
  });

  // Charger les listes des responsables (simulé pour l'instant, devrait venir de la table profiles avec un filtre sur le rôle)
  const fetchManagers = useCallback(async () => {
    // TODO: Remplacer par un appel réel à Supabase pour récupérer les utilisateurs avec les rôles appropriés
    // Exemple: récupérer les utilisateurs avec le rôle 'Commercial AO' ou 'Responsable Commercial'
    const { data: users, error } = await supabase
      .from('profiles') // ou 'users' si les rôles sont là
      .select('id, full_name')
      // .in('role', ['Commercial AO', 'Chef de projet technique']) // Exemple de filtre par rôle
      .limit(100); // Augmenter la limite si nécessaire

    if (error) {
      console.error("Erreur lors de la récupération des responsables:", error);
      toast({ title: "Erreur", description: "Impossible de charger la liste des responsables.", variant: "destructive" });
      return;
    }
    if (users) {
      // Pour la démo, on utilise la même liste pour les deux, à affiner avec les rôles
      setCommercialManagers(users as UserProfileSimple[]);
      setTechnicalManagers(users as UserProfileSimple[]);
    }
  }, [toast]);

  useEffect(() => {
    fetchManagers();
    if (offerId) {
      setIsFetchingData(true);
      getOfferById(offerId)
        .then((offer) => {
          if (offer) {
            reset({
              market_name: offer.market_name,
              organization: offer.organization || '',
              lot_number: offer.lot_number || '',
              deadline: offer.deadline ? new Date(offer.deadline).toISOString().split('T')[0] : '', // Format YYYY-MM-DD pour input type="date"
              status: offer.status || 'À étudier',
              commercial_manager_id: offer.commercial_manager_id || '',
              technical_manager_id: offer.technical_manager_id || '',
            });
          } else {
            toast({ title: "Erreur", description: "Appel d'offres non trouvé.", variant: "destructive" });
            navigate('/appels-offres');
          }
        })
        .catch(err => {
          console.error(err);
          toast({ title: "Erreur", description: "Impossible de charger les données de l'appel d'offres.", variant: "destructive" });
        })
        .finally(() => setIsFetchingData(false));
    }
  }, [offerId, reset, navigate, toast, fetchManagers]);

  const onSubmit = async (formData: OfferFormData) => {
    if (!user) {
      toast({ title: "Erreur", description: "Utilisateur non authentifié.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      const offerPayload: Partial<Offer> = {
        ...formData,
        deadline: formData.deadline ? new Date(formData.deadline).toISOString() : undefined,
        // Assurer que les champs optionnels vides ne sont pas envoyés comme des UUID invalides
        commercial_manager_id: formData.commercial_manager_id || undefined,
        technical_manager_id: formData.technical_manager_id || undefined,
      };

      if (offerId) {
        await updateOffer(offerId, offerPayload);
        toast({ title: "Succès", description: "Appel d'offres mis à jour avec succès." });
      } else {
        const newOfferData: Omit<Offer, 'id' | 'created_at' | 'updated_at'> = {
          market_name: formData.market_name,
          organization: formData.organization,
          lot_number: formData.lot_number,
          deadline: formData.deadline ? new Date(formData.deadline).toISOString() : undefined,
          status: formData.status || 'À étudier',
          commercial_manager_id: formData.commercial_manager_id || undefined,
          technical_manager_id: formData.technical_manager_id || undefined,
          created_by_id: user.id, // Ajouté automatiquement par le service createOffer
        };
        await createOffer(newOfferData);
        toast({ title: "Succès", description: "Appel d'offres créé avec succès." });
      }
      navigate('/appels-offres');
    } catch (error: any) {
      console.error("Erreur lors de la soumission du formulaire:", error);
      toast({ title: "Erreur", description: error.message || "Une erreur est survenue.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetchingData) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[calc(100vh-100px)]">
        <Loader2 className="h-12 w-12 text-paritel-primary animate-spin mb-4" />
        <p className="text-lg font-medium text-gray-700">Chargement du formulaire...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{offerId ? "Modifier l'Appel d'Offres" : "Créer un Nouvel Appel d'Offres"}</CardTitle>
          <CardDescription>
            {offerId ? "Mettez à jour les informations de ce dossier d'appel d'offres." : "Remplissez les informations ci-dessous pour créer un nouveau dossier."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <CustomLabel htmlFor="market_name">Nom du Marché *</CustomLabel>
              <Controller
                name="market_name"
                control={control}
                render={({ field }) => <Input id="market_name" {...field} />}
              />
              {errors.market_name && <p className="text-sm text-red-600 mt-1">{errors.market_name.message}</p>}
            </div>

            <div>
              <CustomLabel htmlFor="organization">Organisme</CustomLabel>
              <Controller
                name="organization"
                control={control}
                render={({ field }) => <Input id="organization" {...field} />}
              />
            </div>
            
            <div>
              <CustomLabel htmlFor="lot_number">Numéro de Lot/Référence</CustomLabel>
              <Controller
                name="lot_number"
                control={control}
                render={({ field }) => <Input id="lot_number" {...field} />}
              />
            </div>

            <div>
              <CustomLabel htmlFor="deadline">Date Limite de Réponse</CustomLabel>
              <Controller
                name="deadline"
                control={control}
                render={({ field }) => <Input id="deadline" type="date" {...field} />}
              />
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
                      <SelectItem value="À étudier">À étudier</SelectItem>
                      <SelectItem value="En cours de réponse">En cours de réponse</SelectItem>
                      <SelectItem value="Déposé">Déposé</SelectItem>
                      <SelectItem value="Gagné">Gagné</SelectItem>
                      <SelectItem value="Perdu">Perdu</SelectItem>
                      <SelectItem value="Abandonné">Abandonné</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div>
              <CustomLabel htmlFor="commercial_manager_id">Responsable Commercial</CustomLabel>
              <Controller
                name="commercial_manager_id"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value || ''}>
                    <SelectTrigger id="commercial_manager_id">
                      <SelectValue placeholder="Sélectionner un responsable" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Aucun</SelectItem>
                      {commercialManagers.map(manager => (
                        <SelectItem key={manager.id} value={manager.id}>{manager.full_name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
               {errors.commercial_manager_id && <p className="text-sm text-red-600 mt-1">{errors.commercial_manager_id.message}</p>}
            </div>

            <div>
              <CustomLabel htmlFor="technical_manager_id">Responsable Technique/Avant-Vente</CustomLabel>
              <Controller
                name="technical_manager_id"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value || ''}>
                    <SelectTrigger id="technical_manager_id">
                      <SelectValue placeholder="Sélectionner un responsable" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Aucun</SelectItem>
                      {technicalManagers.map(manager => (
                        <SelectItem key={manager.id} value={manager.id}>{manager.full_name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.technical_manager_id && <p className="text-sm text-red-600 mt-1">{errors.technical_manager_id.message}</p>}
            </div>

            {/* Ajouter d'autres champs ici, par exemple une Textarea pour la description */}

            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={() => navigate('/appels-offres')} disabled={isLoading}>
                Annuler
              </Button>
              <Button type="submit" className="bg-paritel-primary hover:bg-paritel-primary/90" disabled={isLoading || isFetchingData}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                {offerId ? 'Enregistrer les Modifications' : 'Créer le Dossier'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default OfferForm;

