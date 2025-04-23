
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

// Fonction pour récupérer le contenu dynamique du site
const fetchSiteContent = async (page: string) => {
  const { data, error } = await supabase
    .from("site_content")
    .select("*")
    .eq("page", page);
  
  if (error) throw error;
  
  // Transformer les données en un objet plus facile à utiliser
  const contentMap: Record<string, Record<string, string>> = {};
  data?.forEach(item => {
    if (!contentMap[item.section]) contentMap[item.section] = {};
    contentMap[item.section][item.key] = item.content;
  });
  
  return contentMap;
};

// Fonction pour récupérer les sections de la page d'accueil
const fetchHomeSections = async () => {
  const { data, error } = await supabase
    .from("home_sections")
    .select("*")
    .eq("is_active", true)
    .order("order_index");
  
  if (error) throw error;
  return data || [];
};

const Index = () => {
  // Récupérer le contenu dynamique
  const { data: content = {}, isLoading: isLoadingContent } = useQuery({
    queryKey: ["site-content", "home"],
    queryFn: () => fetchSiteContent("home"),
  });

  // Récupérer les sections dynamiques
  const { data: sections = [], isLoading: isLoadingSections } = useQuery({
    queryKey: ["home-sections"],
    queryFn: fetchHomeSections,
  });

  // Récupérer les paramètres du site
  const { data: settings, isLoading: isLoadingSettings } = useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*");
      
      if (error) throw error;
      
      // Transformer en objet clé-valeur
      const settingsMap: Record<string, string> = {};
      data?.forEach(item => {
        settingsMap[item.key] = item.value;
      });
      
      return settingsMap;
    }
  });

  // Valeurs par défaut au cas où les données ne sont pas encore chargées
  const heroTitle = content.hero?.title || "Paritel | Outil de Création d'Offres";
  const heroSubtitle = content.hero?.subtitle || "Simplifiez la création et la gestion de vos offres commerciales avec notre plateforme intuitive.";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center max-w-3xl px-4">
        <h1 className="text-4xl font-bold mb-4 text-paritel-primary">{heroTitle}</h1>
        <p className="text-xl text-gray-600 mb-8">
          {heroSubtitle}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-paritel-primary hover:bg-paritel-dark">
            <Link to="/login">Se connecter</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/dashboard">Tableau de bord</Link>
          </Button>
        </div>
        
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {isLoadingSections ? (
            // Afficher un placeholder pendant le chargement
            Array(3).fill(0).map((_, index) => (
              <div key={index} className="p-6 bg-white rounded-lg shadow-sm border border-gray-200 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
            ))
          ) : sections.length > 0 ? (
            // Afficher les sections dynamiques
            sections.map(section => (
              <div key={section.id} className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-medium mb-2">{section.title}</h3>
                <p className="text-gray-600">{section.content}</p>
                {section.button_text && section.button_url && (
                  <Button variant="link" asChild className="mt-2 p-0">
                    <Link to={section.button_url}>{section.button_text}</Link>
                  </Button>
                )}
              </div>
            ))
          ) : (
            // Sections par défaut si aucune n'est définie
            <>
              <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-medium mb-2">Catalogue Produit</h3>
                <p className="text-gray-600">Accédez à notre catalogue complet de solutions télécom et IT.</p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-medium mb-2">Création Facile</h3>
                <p className="text-gray-600">Créez des offres personnalisées en quelques clics.</p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-medium mb-2">Suivi Commercial</h3>
                <p className="text-gray-600">Suivez l'évolution de vos propositions commerciales.</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
