import { supabase } from "@/integrations/supabase/client";
import { Offer, Product } from "./types"; // Supposons que ces types existent ou seront créés

// Exemple de type pour les alertes (à affiner)
export interface TechnicalAlert {
  id: string;
  message: string;
  severity: "info" | "warning" | "error";
  product_id?: string; // Lié à un produit spécifique
  created_at: string;
}

// Récupérer les derniers appels d'offres (exemple: les 5 plus récents)
export const fetchRecentOffers = async (): Promise<Offer[]> => {
  const { data, error } = await supabase
    .from("offers") // Assurez-vous que la table s'appelle bien 'offers'
    .select("id, market_name, deadline, status") // Adaptez les champs selon votre table 'offers'
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) {
    console.error("Erreur lors de la récupération des appels d'offres:", error);
    return [];
  }
  // Mapper les données si nécessaire pour correspondre au type Offer
  return data as Offer[];
};

// Récupérer les alertes techniques (exemple: les 5 plus récentes)
export const fetchTechnicalAlerts = async (): Promise<TechnicalAlert[]> => {
  // Cette table 'technical_alerts' est un exemple et doit être créée dans votre schéma Supabase
  // Si les alertes sont stockées différemment (ex: dans une table 'notifications' avec un type 'technique'), adaptez la requête.
  const { data, error } = await supabase
    .from("technical_alerts") // Nom de table hypothétique
    .select("id, message, severity, product_id, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) {
    console.error("Erreur lors de la récupération des alertes techniques:", error);
    // Il faudrait peut-être créer la table si elle n'existe pas, ou gérer l'erreur autrement
    // Pour l'instant, on retourne un tableau vide
    return [];
  }
  return data as TechnicalAlert[];
};

// Récupérer les indicateurs clés (ceci sera plus complexe et dépendra de multiples tables et agrégations)
// Pour l'instant, c'est une placeholder.
export const fetchKeyIndicators = async () => {
  // Exemple: Taux de succès des AO (nécessite de compter les AO gagnés / total déposés)
  // Exemple: Délai moyen de réponse (nécessite de calculer la différence entre deadline et date de soumission)
  // Exemple: Services les plus demandés (nécessite d'analyser les produits/services dans les AO gagnés ou les devis)
  
  // Ces requêtes peuvent devenir complexes et pourraient nécessiter des fonctions PostgreSQL ou des vues matérialisées.
  // Pour la démo, nous allons retourner des données statiques.
  return {
    delaiReponseMoyen: "N/A", // À calculer
    tauxSuccesAO: "N/A", // À calculer
    servicesPlusDemandes: "N/A", // À calculer
  };
};

// Types de base pour l'exemple (à placer dans un fichier de types partagé, ex: src/types/index.ts ou via génération Supabase)
// export interface Offer {
//   id: string;
//   market_name: string; // titre dans le composant Dashboard
//   deadline: string;
//   status?: string;
// }

// export interface Product {
//   id: string;
//   name: string;
//   // ... autres champs
// }

