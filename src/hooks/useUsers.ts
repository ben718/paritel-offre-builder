
import { useEffect } from 'react';
import { useUserStore } from '@/store/useUserStore';
import { useToast } from '@/hooks/use-toast';
import { UserData } from '@/services/UserService';
import { useQueryWithCache } from './useQueryWithCache';

export function useUsers() {
  const { 
    users, 
    fetchAllUsers, 
    isLoading, 
    error, 
    resetError, 
    addUser, 
    updateUserData, 
    updateUserStatus, 
    removeUser 
  } = useUserStore();
  
  const { toast } = useToast();

  // Utiliser notre hook avec cache pour optimiser les requêtes
  const { refetch } = useQueryWithCache<UserData[]>(
    'users',
    async () => {
      await fetchAllUsers();
      return users;
    },
    { staleTime: 60000 } // 1 minute avant de considérer les données obsolètes
  );

  // Gérer les erreurs automatiquement
  useEffect(() => {
    if (error) {
      toast({
        title: "Erreur",
        description: error,
        variant: "destructive"
      });
      resetError();
    }
  }, [error, toast, resetError]);

  // Fonction d'ajout avec feedback
  const handleAddUser = async (userData: Omit<UserData, 'id'>) => {
    try {
      const newUser = { ...userData, id: crypto.randomUUID() };
      await addUser(newUser);
      toast({
        title: "Succès",
        description: "Utilisateur créé avec succès",
        variant: "default"
      });
      return newUser;
    } catch (err) {
      console.error("Erreur lors de la création de l'utilisateur:", err);
      const errorMessage = err instanceof Error ? err.message : "Une erreur s'est produite";
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      });
      throw err;
    }
  };

  // Fonction de mise à jour avec feedback
  const handleUpdateUser = async (id: string, userData: Partial<UserData>) => {
    try {
      await updateUserData(id, userData);
      toast({
        title: "Succès",
        description: "Utilisateur mis à jour avec succès",
        variant: "default"
      });
    } catch (err) {
      console.error("Erreur lors de la mise à jour de l'utilisateur:", err);
      const errorMessage = err instanceof Error ? err.message : "Une erreur s'est produite";
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      });
      throw err;
    }
  };

  // Fonction de suppression avec feedback
  const handleDeleteUser = async (id: string) => {
    try {
      await removeUser(id);
      toast({
        title: "Succès",
        description: "Utilisateur supprimé avec succès",
        variant: "default"
      });
    } catch (err) {
      console.error("Erreur lors de la suppression de l'utilisateur:", err);
      const errorMessage = err instanceof Error ? err.message : "Une erreur s'est produite";
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      });
      throw err;
    }
  };

  // Fonction de changement de statut avec feedback
  const handleUpdateStatus = async (id: string, status: 'active' | 'inactive' | 'pending') => {
    try {
      await updateUserStatus(id, status);
      toast({
        title: "Succès",
        description: `Statut de l'utilisateur mis à jour: ${status}`,
        variant: "default"
      });
    } catch (err) {
      console.error("Erreur lors de la mise à jour du statut:", err);
      const errorMessage = err instanceof Error ? err.message : "Une erreur s'est produite";
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      });
      throw err;
    }
  };

  return {
    users,
    isLoading,
    error,
    refetchUsers: refetch,
    addUser: handleAddUser,
    updateUser: handleUpdateUser,
    deleteUser: handleDeleteUser,
    updateStatus: handleUpdateStatus
  };
}
