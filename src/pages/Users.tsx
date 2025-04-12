
import React, { useState } from "react";
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

// Types definition
type UserRole = "admin" | "manager" | "user";

type UserStatus = "active" | "inactive" | "pending";

interface UserData {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  department: string;
  createdAt: string;
  lastLogin?: string;
}

// Component implementation
const Users = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  
  // Mock user data
  const [users, setUsers] = useState<UserData[]>([
    {
      id: 1,
      name: "Jean Dupont",
      email: "jean.dupont@paritel.fr",
      phone: "06 12 34 56 78",
      role: "admin",
      status: "active",
      department: "Direction",
      createdAt: "2023-02-15",
      lastLogin: "2024-04-11"
    },
    {
      id: 2,
      name: "Marie Durand",
      email: "marie.durand@paritel.fr",
      phone: "06 23 45 67 89",
      role: "manager",
      status: "active",
      department: "Commercial",
      createdAt: "2023-05-20",
      lastLogin: "2024-04-10"
    },
    {
      id: 3,
      name: "Philippe Martin",
      email: "philippe.martin@paritel.fr",
      phone: "07 34 56 78 90",
      role: "user",
      status: "active",
      department: "Technique",
      createdAt: "2023-08-30",
      lastLogin: "2024-04-09"
    },
    {
      id: 4,
      name: "Sophie Petit",
      email: "sophie.petit@paritel.fr",
      phone: "06 45 67 89 01",
      role: "user",
      status: "inactive",
      department: "Commercial",
      createdAt: "2023-10-12"
    },
    {
      id: 5,
      name: "Lucas Bernard",
      email: "lucas.bernard@paritel.fr",
      phone: "07 56 78 90 12",
      role: "manager",
      status: "active",
      department: "Support",
      createdAt: "2023-12-05",
      lastLogin: "2024-04-08"
    },
    {
      id: 6,
      name: "Emma Lefebvre",
      email: "emma.lefebvre@paritel.fr",
      phone: "06 67 89 01 23",
      role: "user",
      status: "pending",
      department: "Marketing",
      createdAt: "2024-02-28"
    }
  ]);
  
  // Form state for new/edit user
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "user" as UserRole,
    department: "Commercial",
    status: "active" as UserStatus
  });
  
  // Filter users based on search term and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesStatus = filterStatus === "all" || user.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });
  
  // Handle user deletion
  const deleteUser = (userId: number) => {
    setUsers(users.filter(user => user.id !== userId));
    setShowDeleteDialog(false);
    setSelectedUser(null);
    
    toast({
      title: "Utilisateur supprimé",
      description: "L'utilisateur a été supprimé avec succès",
    });
  };
  
  // Handle user form submission (add/edit)
  const handleFormSubmit = (isEdit: boolean) => {
    if (isEdit && selectedUser) {
      // Update existing user
      setUsers(users.map(user => 
        user.id === selectedUser.id ? 
          { ...user, ...formData } : 
          user
      ));
      
      toast({
        title: "Utilisateur mis à jour",
        description: `Les informations de ${formData.name} ont été mises à jour avec succès`,
      });
      
      setIsEditUserOpen(false);
    } else {
      // Add new user
      const newUser: UserData = {
        id: Math.max(...users.map(u => u.id)) + 1,
        ...formData,
        createdAt: new Date().toISOString().split('T')[0]
      };
      
      setUsers([...users, newUser]);
      
      toast({
        title: "Utilisateur ajouté",
        description: `${formData.name} a été ajouté à la liste des utilisateurs`,
      });
      
      setIsAddUserOpen(false);
    }
    
    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      role: "user",
      department: "Commercial",
      status: "active"
    });
    
    setSelectedUser(null);
  };
  
  // Handle edit user button click
  const handleEditUser = (user: UserData) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      department: user.department,
      status: user.status
    });
    setIsEditUserOpen(true);
  };
  
  // Handle status change
  const changeUserStatus = (userId: number, newStatus: UserStatus) => {
    setUsers(users.map(user => 
      user.id === userId ? 
        { ...user, status: newStatus } : 
        user
    ));
    
    toast({
      title: "Statut mis à jour",
      description: `Le statut de l'utilisateur a été modifié avec succès`,
    });
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
                                {user.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <div className="font-medium">{user.name}</div>
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
                                  <DropdownMenuItem onClick={() => changeUserStatus(user.id, "active")}>
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Activer
                                  </DropdownMenuItem>
                                )}
                                {user.status !== "inactive" && (
                                  <DropdownMenuItem onClick={() => changeUserStatus(user.id, "inactive")}>
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
                                {user.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <div className="font-medium">{user.name}</div>
                                <div className="text-gray-500 text-xs">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-3 hidden md:table-cell">{user.department}</td>
                          <td className="p-3 text-center">{renderRoleBadge(user.role)}</td>
                          <td className="p-3 hidden md:table-cell">{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('fr-FR') : "-"}</td>
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
                                <DropdownMenuItem onClick={() => changeUserStatus(user.id, "inactive")}>
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
                                {user.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <div className="font-medium">{user.name}</div>
                                <div className="text-gray-500 text-xs">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-3">{user.department}</td>
                          <td className="p-3 text-center">{renderRoleBadge(user.role)}</td>
                          <td className="p-3 text-center">{new Date(user.createdAt).toLocaleDateString('fr-FR')}</td>
                          <td className="p-3 text-right">
                            <div className="flex gap-2 justify-end">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="text-red-600 border-red-200 hover:bg-red-50"
                                onClick={() => changeUserStatus(user.id, "inactive")}
                              >
                                <XCircle className="mr-1 h-3 w-3" />
                                Refuser
                              </Button>
                              <Button 
                                size="sm" 
                                className="bg-green-600"
                                onClick={() => changeUserStatus(user.id, "active")}
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
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
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
              disabled={!formData.name || !formData.email}
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
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
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
              disabled={!formData.name || !formData.email}
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
                Êtes-vous sûr de vouloir supprimer l'utilisateur <span className="font-medium">{selectedUser.name}</span> ?
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
                onClick={() => deleteUser(selectedUser.id)}
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
