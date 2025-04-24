
/**
 * Page de gestion des utilisateurs
 * @module pages/Users
 */
import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { UserForm } from '@/components/users/UserForm';
import { UsersTable } from '@/components/users/UsersTable';
import { useUserStore } from '@/store/useUserStore';
import { UserData } from '@/services/UserService';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  Dialog,
  DialogContent,
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { UserPlus, Users as UsersIcon } from 'lucide-react';

/**
 * Page de gestion des utilisateurs avec créations, modification et suppression
 * @returns {JSX.Element} Page de gestion des utilisateurs
 */
const Users = () => {
  const { fetchAllUsers, removeUser } = useUserStore();
  const { toast } = useToast();
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  
  // Charger les utilisateurs au chargement de la page
  useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers]);

  // Gérer l'édition d'un utilisateur
  const handleEditUser = (user: UserData) => {
    setSelectedUser(user);
  };

  // Gérer l'ajout d'un utilisateur
  const handleAddUser = () => {
    setIsAddingUser(true);
  };

  // Gérer la suppression d'un utilisateur
  const handleDeleteUser = async () => {
    if (userToDelete) {
      try {
        await removeUser(userToDelete);
        toast({
          title: 'Succès',
          description: 'Utilisateur supprimé avec succès',
          variant: 'default', // Changed from "success" to "default"
        });
        setUserToDelete(null);
      } catch (error) {
        toast({
          title: 'Erreur',
          description: 'Impossible de supprimer l\'utilisateur',
          variant: 'destructive',
        });
      }
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* En-tête de la page */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gestion des utilisateurs</h1>
            <p className="text-muted-foreground mt-2">
              Gérez les utilisateurs, leurs rôles et leurs permissions.
            </p>
          </div>
          <Button onClick={handleAddUser}>
            <UserPlus className="mr-2 h-4 w-4" />
            Ajouter un utilisateur
          </Button>
        </div>

        {/* Statistiques utilisateurs */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="bg-card text-card-foreground rounded-lg border p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <UsersIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Total des utilisateurs</span>
            </div>
            <div className="mt-3 text-2xl font-bold">{useUserStore().users.length}</div>
          </div>
          {/* Autres cartes de statistiques pourraient être ajoutées ici */}
        </div>

        {/* Tableau des utilisateurs */}
        <UsersTable
          onEditUser={handleEditUser}
          onAddUser={handleAddUser}
          onDeleteUser={(userId) => setUserToDelete(userId)}
        />

        {/* Dialogue d'édition d'utilisateur */}
        <Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Modifier un utilisateur</DialogTitle>
              <DialogDescription>
                Modifiez les informations de l'utilisateur. Cliquez sur Mettre à jour lorsque vous avez terminé.
              </DialogDescription>
            </DialogHeader>
            {selectedUser && (
              <UserForm 
                user={selectedUser} 
                onSuccess={() => setSelectedUser(null)}
                onCancel={() => setSelectedUser(null)} 
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Dialogue d'ajout d'utilisateur */}
        <Dialog open={isAddingUser} onOpenChange={setIsAddingUser}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Ajouter un utilisateur</DialogTitle>
              <DialogDescription>
                Créez un nouvel utilisateur. Remplissez tous les champs nécessaires puis cliquez sur Créer.
              </DialogDescription>
            </DialogHeader>
            <UserForm 
              onSuccess={() => setIsAddingUser(false)}
              onCancel={() => setIsAddingUser(false)} 
            />
          </DialogContent>
        </Dialog>

        {/* Confirmation de suppression */}
        <AlertDialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action ne peut pas être annulée. Cet utilisateur sera définitivement supprimé
                de la base de données.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteUser} className="bg-destructive text-destructive-foreground">
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </MainLayout>
  );
};

export default Users;
