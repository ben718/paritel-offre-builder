
// Système simple de gestion des textes de l'application
// À terme, cela pourrait être remplacé par une solution plus robuste comme i18next

type TextKeys = {
  [key: string]: string | TextKeys;
};

const texts: TextKeys = {
  common: {
    loading: "Chargement en cours...",
    error: "Une erreur est survenue",
    retry: "Réessayer",
    noData: "Aucune donnée disponible",
    save: "Enregistrer",
    cancel: "Annuler",
    delete: "Supprimer",
    edit: "Modifier",
    view: "Voir",
    search: "Rechercher",
    filter: "Filtrer",
    add: "Ajouter"
  },
  products: {
    title: "Catalogue de Produits",
    addProduct: "Ajouter un produit",
    category: "Catégorie",
    subcategory: "Sous-catégorie",
    noProducts: "Aucun produit trouvé",
    searchPlaceholder: "Rechercher un produit...",
    details: "Détails du produit",
    specifications: "Spécifications",
    partner: "Partenaire"
  },
  ui: {
    loadingSpinner: {
      ariaLabel: "Chargement en cours"
    },
    emptyState: {
      title: "Aucun élément",
      message: "Il n'y a aucun élément à afficher pour le moment.",
      action: "Créer"
    },
    errorState: {
      title: "Une erreur est survenue",
      defaultMessage: "Impossible de charger les données demandées.",
      retry: "Réessayer"
    }
  }
};

// Fonction pour accéder à un texte par sa clé avec chemin en pointillés (ex: "products.title")
export function getText(path: string, fallback: string = ""): string {
  const keys = path.split(".");
  let current: any = texts;

  for (const key of keys) {
    if (current[key] === undefined) {
      console.warn(`Translation key not found: ${path}`);
      return fallback;
    }
    current = current[key];
  }

  if (typeof current !== "string") {
    console.warn(`Translation path does not lead to a string: ${path}`);
    return fallback;
  }

  return current;
}

export default getText;
