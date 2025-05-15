import React, { useEffect, useState, useCallback } from 'react';
import { getAllUsers, AppUser, updateUserRoles, getAppRoles, Role } from '@/services/AdminService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Users, ShieldCheck, Save } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const UserManagementPage: React.FC = () => {
  const { checkRouteAccess } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<AppUser[]>([]);
  const [appRoles, setAppRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<Record<string, boolean>>({});

  const fetchUsersAndRoles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (!checkRouteAccess(['Admin'])) {
        setError("Vous n'avez pas les droits pour accéder à cette page.");
        toast({ title: "Accès refusé", variant: "destructive" });
        setUsers([]);
        setAppRoles([]);
        return;
      }
      const fetchedUsers = await getAllUsers();
      const fetchedRoles = await getAppRoles();
      setUsers(fetchedUsers);
      setAppRoles(fetchedRoles);
    } catch (err: any) {
      console.error("Erreur lors de la récupération des utilisateurs ou des rôles:", err);
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setIsLoading(false);
    }
  }, [checkRouteAccess, toast]);

  useEffect(() => {
    fetchUsersAndRoles();
  }, [fetchUsersAndRoles]);

  const handleEditRoles = (user: AppUser) => {
    setEditingUserId(user.id);
    const initialRoles: Record<string, boolean> = {};
    appRoles.forEach(role => {
      initialRoles[role.name] = user.roles?.includes(role.name) || false;
    });
    setSelectedRoles(initialRoles);
  };

  const handleRoleChange = (roleName: string, checked: boolean) => {
    setSelectedRoles(prev => ({ ...prev, [roleName]: checked }));
  };

  const handleSaveRoles = async (userId: string) => {
    const rolesToSave = Object.entries(selectedRoles)
      .filter(([,isSelected]) => isSelected)
      .map(([roleName]) => roleName);
    
    setIsLoading(true);
    try {
      await updateUserRoles(userId, rolesToSave);
      toast({ title: "Succès", description: "Rôles mis à jour avec succès." });
      setEditingUserId(null);
      fetchUsersAndRoles(); // Refresh users list
    } catch (err: any) {
      console.error("Erreur lors de la mise à jour des rôles:", err);
      toast({ title: "Erreur de mise à jour", description: err.message || "Impossible de mettre à jour les rôles.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && users.length === 0) { // Show main loader only if no users yet
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[calc(100vh-100px)]">
        <Loader2 className="h-12 w-12 text-paritel-primary animate-spin mb-4" />
        <p className="text-lg font-medium text-gray-700">Chargement de la gestion des utilisateurs...</p>
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
            <Users className="mr-3 h-8 w-8" /> Gestion des Utilisateurs
          </h1>
          <p className="text-lg text-gray-600">Administrez les utilisateurs et leurs droits d'accès.</p>
        </div>
        {/* Bouton pour inviter/créer un utilisateur pourrait être ajouté ici */}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Utilisateurs</CardTitle>
          <CardDescription>Utilisateurs enregistrés sur la plateforme.</CardDescription>
        </CardHeader>
        <CardContent>
          {users.length === 0 && !isLoading ? (
            <p className="text-center text-gray-500 py-8">Aucun utilisateur trouvé.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom Complet</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rôles</TableHead>
                  <TableHead>Date d'Inscription</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.full_name || user.email?.split('@')[0] || 'N/A'}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {editingUserId === user.id ? (
                        <div className="space-y-2">
                          {appRoles.map(role => (
                            <div key={role.id} className="flex items-center space-x-2">
                              <Checkbox 
                                id={`role-${user.id}-${role.id}`}
                                checked={selectedRoles[role.name] || false}
                                onCheckedChange={(checked) => handleRoleChange(role.name, !!checked)}
                              />
                              <label htmlFor={`role-${user.id}-${role.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                {role.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      ) : (
                        user.roles?.join(', ') || 'Utilisateur'
                      )}
                    </TableCell>
                    <TableCell>{user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</TableCell>
                    <TableCell className="text-right">
                      {editingUserId === user.id ? (
                        <div className='flex gap-2 justify-end'>
                          <Button variant="outline" size="sm" onClick={() => setEditingUserId(null)} disabled={isLoading && editingUserId === user.id}>
                            Annuler
                          </Button>
                          <Button size="sm" onClick={() => handleSaveRoles(user.id)} disabled={isLoading && editingUserId === user.id} className='bg-paritel-primary hover:bg-paritel-primary/90'>
                            {isLoading && editingUserId === user.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Enregistrer
                          </Button>
                        </div>
                      ) : (
                        <Button variant="outline" size="sm" onClick={() => handleEditRoles(user)} disabled={isLoading && editingUserId === user.id}>
                          <ShieldCheck className="mr-2 h-4 w-4" /> Gérer les Rôles
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagementPage;

