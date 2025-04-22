import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CustomLabel } from "@/components/ui/custom-label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Plus,
  MoreHorizontal,
  User,
  Mail,
  Shield,
  Phone,
  UserPlus,
  UserCog,
  Lock,
  UserX,
  Trash,
  PencilLine,
  CheckCircle,
  XCircle,
  Filter
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { fetchUsers, updateUserStatus, createUser, updateUser, deleteUser as apiDeleteUser, UserData as ImportedUserData } from "@/services/UserService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Types definition
type UserRole = "admin" | "manager" | "user";
type UserStatus = "active" | "inactive" | "pending";

// Use the imported UserData type but extend it with our local requirements
interface UserData extends Omit<ImportedUserData, 'role' | 'status' | 'phone'> {
  role: UserRole;
  status: UserStatus;
  phone: string; // Make it required in our local interface
}

// Component implementation
const Users = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ImportedUserData | null>(null);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const queryClient = useQueryClient();
  
  // Fetch users from the database
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers
  });
  
  // Form state for new/edit user
  const [formData, setFormData] = useState<{
    full_name: string;
    email: string;
    phone: string;
    role: UserRole;
    department: string;
    status: UserStatus;
  }>({
    full_name: "",
    email: "",
    phone: "",
    role: "user",
    department: "Commercial",
    status: "active"
  });
  
  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: (userData: any) => {
      return createUser({ ...userData, id: crypto.randomUUID() });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: "Utilisateur ajouté",
        description: "Le nouvel utilisateur a été ajouté avec succès"
      });
      setIsAddUserOpen(false);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de l'utilisateur"
      });
      console.error("Error creating user:", error);
    }
  });
  
  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: ({ userId, userData }: { userId: string, userData: any }) => {
      return updateUser(userId, userData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: "Utilisateur mis à jour",
        description: "Les informations de l'utilisateur ont été mises à jour"
      });
      setIsEditUserOpen(false);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour de l'utilisateur"
      });
      console.error("Error updating user:", error);
    }
  });
  
  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ userId, status }: { userId: string, status: UserStatus }) => {
      return updateUserStatus(userId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: "Statut mis à jour",
        description: "Le statut de l'utilisateur a été modifié avec succès"
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du statut"
      });
      console.error("Error updating status:", error);
    }
  });
  
  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) => {
      return apiDeleteUser(userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: "Utilisateur supprimé",
        description: "L'utilisateur a été supprimé avec succès"
      });
      setShowDeleteDialog(false);
      setSelectedUser(null);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression de l'utilisateur"
      });
      console.error("Error deleting user:", error);
    }
  });
  
  // Filter users based on search term and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.department && user.department.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesStatus = filterStatus === "all" || user.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });
  
  // Handle user deletion
  const handleDeleteUser = (userId: string) => {
    deleteUserMutation.mutate(userId);
  };
  
  // Handle user form submission (add/edit)
  const handleFormSubmit = (isEdit: boolean) => {
    if (isEdit && selectedUser) {
      // Update existing user
      updateUserMutation.mutate({
        userId: selectedUser.id,
        userData: formData
      });
    } else {
      // Add new user
      createUserMutation.mutate(formData);
    }
    
    // Reset form
    setFormData({
      full_name: "",
      email: "",
      phone: "",
      role: "user",
      department: "Commercial",
      status: "active"
    });
    
    setSelectedUser(null);
  };
  
  // Handle edit user button click
  const handleEditUser = (user: ImportedUserData) => {
    setSelectedUser(user);
    setFormData({
      full_name: user.full_name,
      email: user.email,
      phone: user.phone || "",
      role: (user.role as UserRole) || "user",
      department: user.department || "Commercial",
      status: (user.status as UserStatus) || "active"
    });
    setIsEditUserOpen(true);
  };
  
  // Handle status change
  const handleChangeUserStatus = (userId: string, newStatus: UserStatus) => {
    updateStatusMutation.mutate({ userId, status: newStatus });
  };
  
  // Render role badge
  const renderRoleBadge = (role: UserRole) => {
    switch(role) {
      case "admin":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Administrateur</Badge>;
      case "manager":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Manager</Badge>;
      case "user":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Utilisateur</Badge>;
    }
  };
  
  // Render status badge
  const renderStatusBadge = (status: UserStatus) => {
    switch(status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Actif</Badge>;
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Inactif</Badge>;
      case "pending":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">En attente</Badge>;
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Gestion des Utilisateurs</h1>
            <p className="text-muted-foreground">Gérez les accès et les droits des utilisateurs de la plateforme</p>
          </div>
          <Button onClick={() => setIsAddUserOpen(true)} className="bg-paritel-primary whitespace-nowrap">
            <UserPlus className="mr-2 h-4 w-4" />
            Nouvel Utilisateur
          </Button>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
            <TabsList>
              <TabsTrigger value="all">
                Tous les utilisateurs
                <Badge className="ml-2 bg-gray-200 text-gray-800">{users.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="active">
                Actifs
                <Badge className="ml-2 bg-green-100 text-green-800">{users.filter(u => u.status === "active").length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="pending">
                En attente
                <Badge className="ml-2 bg-amber-100 text-amber-800">{users.filter(u => u.status === "pending").length}</Badge>
              </TabsTrigger>
            </TabsList>
            
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Rechercher un utilisateur..."
                  className="pl-8 w-full sm:w-[250px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Filtrer
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Filtres</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="p-2">
                    <div className="mb-2">
                      <p className="text-xs font-medium mb-1">Rôle</p>
                      <Select value={filterRole} onValueChange={setFilterRole}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Tous les rôles" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tous les rôles</SelectItem>
                          <SelectItem value="admin">Administrateur</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="user">Utilisateur</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <p className="text-xs font-medium mb-1">Statut</p>
                      <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Tous les statuts" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tous les statuts</SelectItem>
                          <SelectItem value="active">Actif</SelectItem>
                          <SelectItem value="inactive">Inactif</SelectItem>
                          <SelectItem value="pending">En attente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          <TabsContent value="all">
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="text-left font-medium p-3">Utilisateur</th>
                        <th className="text-left font-medium p-3 hidden md:table-cell">Service</th>
                        <th className="text-left font-medium p-3 hidden md:table-cell">Téléphone</th>
                        <th className="text-center font-medium p-3">Rôle</th>
                        <th className="text-center font-medium p-3">Statut</th>
                        <th className="text-right font-medium p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="border-b last:border-b-0">
                          <td className="p-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-paritel-primary text-white flex items-center justify-center font-medium">
                                {user.full_name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <div className="font-medium">{user.full_name}</div>
                                <div className="text-gray-500 text-xs">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-3 hidden md:table-cell">{user.department}</td>
                          <td className="p-3 hidden md:table-cell">{user.phone}</td>
                          <td className="p-3 text-center">{renderRoleBadge(user.role)}</td>
                          <td className="p-3 text-center">{renderStatusBadge(user.status)}</td>
                          <td className="p-3 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Options</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleEditUser(user)}>
                                  <PencilLine className="mr-2 h-4 w-4" />
                                  Modifier
                                </DropdownMenuItem>
                                {user.status !== "active" && (
                                  <DropdownMenuItem onClick={() => handleChangeUserStatus(user.id, "active")}>
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Activer
                                  </DropdownMenuItem>
                                )}
                                {user.status !== "inactive" && (
                                  <DropdownMenuItem onClick={() => handleChangeUserStatus(user.id, "inactive")}>
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Désactiver
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() => {
                                    setSelectedUser(user);
                                    setShowDeleteDialog(true);
                                  }}
                                >
                                  <Trash className="mr-2 h-4 w-4" />
                                  Supprimer
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredUsers.length === 0 && (
                    <div className="py-8 text-center text-gray-500">
                      Aucun utilisateur trouvé avec les critères spécifiés
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="active">
            <Card>
              <CardContent className="p-0">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left font-medium p-3">Utilisateur</th>
                      <th className="text-left font-medium p-3 hidden md:table-cell">Service</th>
                      <th className="text-center font-medium p-3">Rôle</th>
                      <th className="text-left font-medium p-3 hidden md:table-cell">Dernière connexion</th>
                      <th className="text-right font-medium p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers
                      .filter(u => u.status === "active")
                      .map((user) => (
                        <tr key={user.id} className="border-b last:border-b-0">
                          <td className="p-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-paritel-primary text-white flex items-center justify-center font-medium">
                                {user.full_name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <div className="font-medium">{user.full_name}</div>
                                <div className="text-gray-500 text-xs">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-3 hidden md:table-cell">{user.department}</td>
                          <td className="p-3 text-center">{renderRoleBadge(user.role)}</td>
                          <td className="p-3 hidden md:table-cell">{user.last_login ? new Date(user.last_login).toLocaleDateString('fr-FR') : "-"}</td>
                          <td className="p-3 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEditUser(user)}>
                                  <PencilLine className="mr-2 h-4 w-4" />
                                  Modifier
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleChangeUserStatus(user.id, "inactive")}>
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Désactiver
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                {filteredUsers.filter(u => u.status === "active").length === 0 && (
                  <div className="py-8 text-center text-gray-500">
                    Aucun utilisateur actif trouvé
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="pending">
            <Card>
              <CardContent className="p-0">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left font-medium p-3">Utilisateur</th>
                      <th className="text-left font-medium p-3">Service</th>
                      <th className="text-center font-medium p-3">Rôle</th>
                      <th className="text-center font-medium p-3">Créé le</th>
                      <th className="text-right font-medium p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers
                      .filter(u => u.status === "pending")
                      .map((user) => (
                        <tr key={user.id} className="border-b last:border-b-0">
                          <td className="p-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center font-medium">
                                {user.full_name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <div className="font-medium">{user.full_name}</div>
                                <div className="text-gray-500 text-xs">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-3">{user.department}</td>
                          <td className="p-3 text-center">{renderRoleBadge(user.role)}</td>
                          <td className="p-3 text-center">{new Date(user.created_at).toLocaleDateString('fr-FR')}</td>
                          <td className="p-3 text-right">
                            <div className="flex gap-2 justify-end">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="text-red-600 border-red-200 hover:bg-red-50"
                                onClick={() => handleChangeUserStatus(user.id, "inactive")}
                              >
                                <XCircle className="mr-1 h-3 w-3" />
                                Refuser
                              </Button>
                              <Button 
                                size="sm" 
                                className="bg-green-600"
                                onClick={() => handleChangeUserStatus(user.id, "active")}
                              >
                                <CheckCircle className="mr-1 h-3 w-3" />
                                Approuver
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                {filteredUsers.filter(u => u.status === "pending").length === 0 && (
                  <div className="py-8 text-center text-gray-500">
                    Aucune demande d'accès en attente
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add User Dialog */}
      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ajouter un nouvel utilisateur</DialogTitle>
            <DialogDescription>
              Remplissez les informations pour créer un nouvel accès utilisateur.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <CustomLabel>Nom complet</CustomLabel>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input 
                  className="pl-9" 
                  placeholder="Nom et prénom"
                  value={formData.full_name}
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <CustomLabel>Email</CustomLabel>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input 
                  className="pl-9" 
                  placeholder="Adresse email professionnelle"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <CustomLabel>Téléphone</CustomLabel>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input 
                  className="pl-9" 
                  placeholder="Numéro de téléphone"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <CustomLabel>Rôle</CustomLabel>
                <Select 
                  value={formData.role} 
                  onValueChange={(value: UserRole) => setFormData({...formData, role: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrateur</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="user">Utilisateur</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <CustomLabel>Service</CustomLabel>
                <Select 
                  value={formData.department} 
                  onValueChange={(value) => setFormData({...formData, department: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Direction">Direction</SelectItem>
                    <SelectItem value="Commercial">Commercial</SelectItem>
                    <SelectItem value="Technique">Technique</SelectItem>
                    <SelectItem value="Support">Support</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="RH">Ressources Humaines</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <CustomLabel>Statut initial</CustomLabel>
              <Select 
                value={formData.status} 
                onValueChange={(value: UserStatus) => setFormData({...formData, status: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="inactive">Inactif</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
              Annuler
            </Button>
            <Button 
              onClick={() => handleFormSubmit(false)}
              className="bg-paritel-primary"
              disabled={!formData.full_name || !formData.email}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Modifier l'utilisateur</DialogTitle>
            <DialogDescription>
              Modifiez les informations de l'utilisateur.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <CustomLabel>Nom complet</CustomLabel>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input 
                  className="pl-9" 
                  placeholder="Nom et prénom"
                  value={formData.full_name}
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <CustomLabel>Email</CustomLabel>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input 
                  className="pl-9" 
                  placeholder="Adresse email professionnelle"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <CustomLabel>Téléphone</CustomLabel>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input 
                  className="pl-9" 
                  placeholder="Numéro de téléphone"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <CustomLabel>Rôle</CustomLabel>
                <Select 
                  value={formData.role} 
                  onValueChange={(value: UserRole) => setFormData({...formData, role: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrateur</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="user">Utilisateur</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <CustomLabel>Service</CustomLabel>
                <Select 
                  value={formData.department} 
                  onValueChange={(value) => setFormData({...formData, department: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Direction">Direction</SelectItem>
                    <SelectItem value="Commercial">Commercial</SelectItem>
                    <SelectItem value="Technique">Technique</SelectItem>
                    <SelectItem value="Support">Support</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="RH">Ressources Humaines</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <CustomLabel>Statut</CustomLabel>
              <Select 
                value={formData.status} 
                onValueChange={(value: UserStatus) => setFormData({...formData, status: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="inactive">Inactif</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditUserOpen(false)}>
              Annuler
            </Button>
            <Button 
              onClick={() => handleFormSubmit(true)}
              className="bg-paritel-primary"
              disabled={!formData.full_name || !formData.email}
            >
              <UserCog className="mr-2 h-4 w-4" />
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      {selectedUser && (
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmer la suppression</DialogTitle>
              <DialogDescription>
                Êtes-vous sûr de vouloir supprimer l'utilisateur <span className="font-medium">{selectedUser.full_name}</span> ?
                Cette action est irréversible.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button 
                variant="outline" 
                onClick={() => setShowDeleteDialog(false)}
              >
                Annuler
              </Button>
              <Button 
                variant="destructive"
                onClick={() => handleDeleteUser(selectedUser.id)}
              >
                <Trash className="mr-2 h-4 w-4" />
                Supprimer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </MainLayout>
  );
};

export default Users;
