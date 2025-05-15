import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
// Idéalement, avoir une icône Microsoft
// import { MicrosoftIcon } from "@/components/icons/MicrosoftIcon"; 

export const LoginButtonAzure = () => {
  async function signInWithAzure() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "azure",
        options: {
          scopes: "email User.Read", // Assurez-vous que ces scopes sont configurés dans Azure AD
          redirectTo: `${window.location.origin}/dashboard`, // Redirige vers le dashboard après connexion
        },
      });

      if (error) {
        console.error("Erreur lors de la connexion avec Azure:", error.message);
        // Afficher une notification d'erreur à l'utilisateur
        // Par exemple, avec le système de toast existant
        // toast({ title: "Erreur de connexion", description: error.message, variant: "destructive" });
      } else {
        // La redirection vers Azure devrait se produire automatiquement
        // Pas besoin de gérer 'data' ici directement, la session sera établie après le callback
        console.log("Initiation de la connexion avec Azure...", data);
      }
    } catch (err) {
      console.error("Exception lors de la tentative de connexion Azure:", err);
      // toast({ title: "Erreur inattendue", description: "Une erreur inattendue s'est produite.", variant: "destructive" });
    }
  }

  return (
    <Button onClick={signInWithAzure} className="w-full">
      {/* <MicrosoftIcon className="mr-2 h-4 w-4" /> */}
      Se connecter avec Microsoft (Paritel)
    </Button>
  );
};

