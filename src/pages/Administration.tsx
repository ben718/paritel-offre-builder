
import MainLayout from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Users,
  Settings,
  Lock,
  FileText,
  Bell,
  Database,
  Server,
  Activity,
  HardDrive,
  ShieldCheck,
  ClipboardList
} from "lucide-react";

const Administration = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Administration</h1>
            <p className="text-muted-foreground mt-1">
              Gérez les paramètres du système et les accès utilisateurs
            </p>
          </div>
        </div>

        <Tabs defaultValue="users">
          <TabsList className="mb-4">
            <TabsTrigger value="users" className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Utilisateurs
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center">
              <Lock className="h-4 w-4 mr-2" />
              Sécurité
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center">
              <Server className="h-4 w-4 mr-2" />
              Système
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center">
              <Activity className="h-4 w-4 mr-2" />
              Journaux
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="users">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-paritel-primary" />
                    Gestion des utilisateurs
                  </CardTitle>
                  <CardDescription>
                    Gestion des comptes et des rôles utilisateurs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">JD</div>
                        <div>
                          <p className="font-medium">Jean Dupont</p>
                          <p className="text-xs text-gray-500">jean.dupont@example.com</p>
                        </div>
                      </div>
                      <Badge>Admin</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">ML</div>
                        <div>
                          <p className="font-medium">Marie Lefebvre</p>
                          <p className="text-xs text-gray-500">marie.l@example.com</p>
                        </div>
                      </div>
                      <Badge variant="outline">Éditeur</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-3">PB</div>
                        <div>
                          <p className="font-medium">Pierre Bouchard</p>
                          <p className="text-xs text-gray-500">p.bouchard@example.com</p>
                        </div>
                      </div>
                      <Badge variant="outline">Viewer</Badge>
                    </div>
                    
                    <Button className="w-full">Ajouter un utilisateur</Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="h-5 w-5 mr-2 text-paritel-primary" />
                    Rôles et permissions
                  </CardTitle>
                  <CardDescription>
                    Gestion des rôles et des droits d'accès
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-2">
                      <div>
                        <p className="font-medium">Administrateur</p>
                        <p className="text-xs text-gray-500">Accès total au système</p>
                      </div>
                      <Button variant="outline" size="sm">Configurer</Button>
                    </div>
                    
                    <div className="flex items-center justify-between border-b pb-2">
                      <div>
                        <p className="font-medium">Éditeur</p>
                        <p className="text-xs text-gray-500">Peut modifier le contenu</p>
                      </div>
                      <Button variant="outline" size="sm">Configurer</Button>
                    </div>
                    
                    <div className="flex items-center justify-between border-b pb-2">
                      <div>
                        <p className="font-medium">Viewer</p>
                        <p className="text-xs text-gray-500">Accès en lecture seule</p>
                      </div>
                      <Button variant="outline" size="sm">Configurer</Button>
                    </div>
                    
                    <Button className="w-full">Ajouter un rôle</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="security">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lock className="h-5 w-5 mr-2 text-paritel-primary" />
                    Politiques de sécurité
                  </CardTitle>
                  <CardDescription>
                    Configuration des politiques de sécurité
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Authentification à deux facteurs</p>
                      <p className="text-xs text-gray-500">Exiger 2FA pour tous les utilisateurs</p>
                    </div>
                    <div>
                      <Badge variant="outline" className="bg-green-50">Activé</Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Politique de mot de passe</p>
                      <p className="text-xs text-gray-500">Exigence de complexité élevée</p>
                    </div>
                    <div>
                      <Badge variant="outline" className="bg-yellow-50">Moyenne</Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Verrouillage de compte</p>
                      <p className="text-xs text-gray-500">Après 5 tentatives échouées</p>
                    </div>
                    <div>
                      <Badge variant="outline" className="bg-green-50">Activé</Badge>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <Button variant="outline" className="w-full">
                    <ShieldCheck className="h-4 w-4 mr-2" />
                    Configurer les politiques
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-paritel-primary" />
                    Activité de sécurité
                  </CardTitle>
                  <CardDescription>
                    Alertes et activités de sécurité récentes
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 mr-3">
                        <Lock className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">Tentative de connexion échouée</p>
                        <p className="text-xs text-gray-500">il y a 2 heures</p>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost">Détails</Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mr-3">
                        <Settings className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">Modification des paramètres de sécurité</p>
                        <p className="text-xs text-gray-500">il y a 1 jour</p>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost">Détails</Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
                        <Users className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">Nouvel utilisateur créé</p>
                        <p className="text-xs text-gray-500">il y a 3 jours</p>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost">Détails</Button>
                  </div>
                  
                  <Separator />
                  
                  <Button variant="outline" className="w-full">
                    <ClipboardList className="h-4 w-4 mr-2" />
                    Voir toutes les activités
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="system">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Server className="h-5 w-5 mr-2 text-paritel-primary" />
                    Serveurs
                  </CardTitle>
                  <CardDescription>
                    État des serveurs et services
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">API Server</p>
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                        <p className="text-xs text-gray-500">Opérationnel</p>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost">Détails</Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Database Server</p>
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                        <p className="text-xs text-gray-500">Opérationnel</p>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost">Détails</Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Storage Server</p>
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div>
                        <p className="text-xs text-gray-500">Maintenance</p>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost">Détails</Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <HardDrive className="h-5 w-5 mr-2 text-paritel-primary" />
                    Stockage
                  </CardTitle>
                  <CardDescription>
                    Utilisation et performance du stockage
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Base de données</span>
                      <span className="text-sm font-medium">75%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Fichiers média</span>
                      <span className="text-sm font-medium">45%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Logs</span>
                      <span className="text-sm font-medium">92%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-red-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="h-5 w-5 mr-2 text-paritel-primary" />
                    Notifications
                  </CardTitle>
                  <CardDescription>
                    Paramètres de notification système
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Alertes critiques</p>
                      <p className="text-xs text-gray-500">Notifications par email</p>
                    </div>
                    <div>
                      <Badge variant="outline" className="bg-green-50">Activé</Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Rapports quotidiens</p>
                      <p className="text-xs text-gray-500">Résumé du système</p>
                    </div>
                    <div>
                      <Badge variant="outline" className="bg-green-50">Activé</Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Notifications SMS</p>
                      <p className="text-xs text-gray-500">Pour incidents critiques</p>
                    </div>
                    <div>
                      <Badge variant="outline" className="bg-gray-100">Désactivé</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="logs">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-paritel-primary" />
                  Journaux système
                </CardTitle>
                <CardDescription>
                  Historique des événements et des actions système
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 mr-3">
                        <Database className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">Sauvegarde de la base de données</p>
                        <p className="text-xs text-gray-500">Aujourd'hui à 03:00</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-green-50">Succès</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 mr-3">
                        <Users className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">Mise à jour des permissions</p>
                        <p className="text-xs text-gray-500">Hier à 14:32</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-green-50">Succès</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 mr-3">
                        <Server className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">Redémarrage du serveur API</p>
                        <p className="text-xs text-gray-500">23/04/2025 à 10:15</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-yellow-50">Avertissement</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 mr-3">
                        <Activity className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">Pic d'utilisation CPU</p>
                        <p className="text-xs text-gray-500">21/04/2025 à 16:45</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-red-50">Alerte</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 mr-3">
                        <Lock className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">Mise à jour des certificats SSL</p>
                        <p className="text-xs text-gray-500">20/04/2025 à 09:30</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-green-50">Succès</Badge>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    Télécharger les journaux complets
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Administration;
