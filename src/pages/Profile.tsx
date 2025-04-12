
import MainLayout from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { CustomLabel } from "@/components/ui/custom-label";
import { Switch } from "@/components/ui/switch";
import {
  User,
  Settings,
  Bell,
  Key,
  Shield,
  Clock,
  LogOut,
  Save,
  Upload,
  Mail,
  Phone,
  Building,
  FileText
} from "lucide-react";
import { useState } from "react";

const Profile = () => {
  const [profileImage, setProfileImage] = useState("/lovable-uploads/b639a193-20d7-416a-8e45-c55deeeaecca.png");
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Profil Utilisateur</h1>
            <p className="text-muted-foreground mt-1">
              Gérez votre compte et vos préférences
            </p>
          </div>
          <Button variant="destructive" className="flex items-center">
            <LogOut className="h-4 w-4 mr-2" />
            Déconnexion
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="relative">
                    <img 
                      src={profileImage} 
                      alt="Profile" 
                      className="w-32 h-32 rounded-full border-2 border-gray-200 object-cover"
                    />
                    <Button 
                      variant="secondary" 
                      size="icon" 
                      className="absolute bottom-0 right-0 rounded-full h-8 w-8"
                    >
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-center">
                    <h3 className="font-medium text-lg">Jean Dupont</h3>
                    <p className="text-sm text-gray-500">Administrateur</p>
                  </div>
                  <div className="w-full flex flex-col space-y-2 mt-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span>jean.dupont@example.com</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>+33 1 23 45 67 89</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Building className="h-4 w-4 text-gray-400" />
                      <span>Paritel SAS</span>
                    </div>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Bell className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">Statut</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">En ligne</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">Dernière connexion</span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Aujourd'hui, 10:30</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">2FA</span>
                    </div>
                    <div>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Activé</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:w-2/3">
            <Tabs defaultValue="personal">
              <TabsList className="mb-4">
                <TabsTrigger value="personal" className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Informations personnelles
                </TabsTrigger>
                <TabsTrigger value="security" className="flex items-center">
                  <Key className="h-4 w-4 mr-2" />
                  Sécurité
                </TabsTrigger>
                <TabsTrigger value="preferences" className="flex items-center">
                  <Settings className="h-4 w-4 mr-2" />
                  Préférences
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="personal">
                <Card>
                  <CardHeader>
                    <CardTitle>Informations personnelles</CardTitle>
                    <CardDescription>
                      Mettez à jour vos informations personnelles
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <CustomLabel>Prénom</CustomLabel>
                          <Input defaultValue="Jean" />
                        </div>
                        <div className="space-y-1">
                          <CustomLabel>Nom</CustomLabel>
                          <Input defaultValue="Dupont" />
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <CustomLabel>Email</CustomLabel>
                        <Input defaultValue="jean.dupont@example.com" />
                      </div>
                      
                      <div className="space-y-1">
                        <CustomLabel>Téléphone</CustomLabel>
                        <Input defaultValue="+33 1 23 45 67 89" />
                      </div>
                      
                      <div className="space-y-1">
                        <CustomLabel>Fonction</CustomLabel>
                        <Input defaultValue="Responsable commercial" />
                      </div>
                      
                      <div className="space-y-1">
                        <CustomLabel>À propos</CustomLabel>
                        <Textarea 
                          defaultValue="Responsable commercial chez Paritel depuis 2020, spécialisé dans les solutions télécom pour les PME." 
                          className="min-h-[100px]"
                        />
                      </div>
                      
                      <div className="flex justify-end">
                        <Button className="bg-paritel-primary">
                          <Save className="h-4 w-4 mr-2" />
                          Enregistrer
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="security">
                <Card>
                  <CardHeader>
                    <CardTitle>Sécurité du compte</CardTitle>
                    <CardDescription>
                      Gérez les paramètres de sécurité de votre compte
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="font-medium">Modifier le mot de passe</h3>
                      <div className="space-y-2">
                        <div className="space-y-1">
                          <CustomLabel>Mot de passe actuel</CustomLabel>
                          <Input type="password" />
                        </div>
                        <div className="space-y-1">
                          <CustomLabel>Nouveau mot de passe</CustomLabel>
                          <Input type="password" />
                        </div>
                        <div className="space-y-1">
                          <CustomLabel>Confirmer le nouveau mot de passe</CustomLabel>
                          <Input type="password" />
                        </div>
                      </div>
                      <Button variant="outline">Mettre à jour le mot de passe</Button>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <h3 className="font-medium">Authentification à deux facteurs</h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Authentification par application</p>
                          <p className="text-xs text-gray-500">Utiliser une application comme Google Authenticator</p>
                        </div>
                        <Switch checked={true} />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Authentification par SMS</p>
                          <p className="text-xs text-gray-500">Recevoir un code par SMS</p>
                        </div>
                        <Switch checked={false} />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Authentification par email</p>
                          <p className="text-xs text-gray-500">Recevoir un code par email</p>
                        </div>
                        <Switch checked={false} />
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <h3 className="font-medium">Sessions</h3>
                      <div>
                        <p className="text-sm font-medium">Appareils connectés</p>
                        <div className="space-y-2 mt-2">
                          <div className="flex items-center justify-between border-b pb-2">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 mr-3">
                                <FileText className="h-4 w-4" />
                              </div>
                              <div>
                                <p className="font-medium">Chrome - Windows</p>
                                <p className="text-xs text-gray-500">Paris, France • Aujourd'hui, 10:30</p>
                              </div>
                            </div>
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Actuelle</span>
                          </div>
                          
                          <div className="flex items-center justify-between border-b pb-2">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 mr-3">
                                <FileText className="h-4 w-4" />
                              </div>
                              <div>
                                <p className="font-medium">Firefox - MacOS</p>
                                <p className="text-xs text-gray-500">Paris, France • Hier, 15:45</p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">Déconnecter</Button>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full">Déconnecter toutes les autres sessions</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="preferences">
                <Card>
                  <CardHeader>
                    <CardTitle>Préférences</CardTitle>
                    <CardDescription>
                      Personnalisez votre expérience
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="font-medium">Notifications</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Notifications par email</p>
                            <p className="text-xs text-gray-500">Recevoir des notifications par email</p>
                          </div>
                          <Switch checked={true} />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Notifications dans l'application</p>
                            <p className="text-xs text-gray-500">Recevoir des notifications dans l'application</p>
                          </div>
                          <Switch checked={true} />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Notifications marketing</p>
                            <p className="text-xs text-gray-500">Recevoir des offres et des mises à jour</p>
                          </div>
                          <Switch checked={false} />
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <h3 className="font-medium">Interface</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Mode sombre</p>
                            <p className="text-xs text-gray-500">Activer le mode sombre</p>
                          </div>
                          <Switch checked={false} />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Animations</p>
                            <p className="text-xs text-gray-500">Activer les animations d'interface</p>
                          </div>
                          <Switch checked={true} />
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <h3 className="font-medium">Langue et région</h3>
                      <div className="space-y-2">
                        <div className="space-y-1">
                          <CustomLabel>Langue</CustomLabel>
                          <div className="relative">
                            <select className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-paritel-accent appearance-none pr-8">
                              <option value="fr">Français</option>
                              <option value="en">English</option>
                              <option value="es">Español</option>
                              <option value="de">Deutsch</option>
                            </select>
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                                <path d="m6 9 6 6 6-6"/>
                              </svg>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <CustomLabel>Fuseau horaire</CustomLabel>
                          <div className="relative">
                            <select className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-paritel-accent appearance-none pr-8">
                              <option value="europe-paris">Europe/Paris (GMT+2)</option>
                              <option value="europe-london">Europe/London (GMT+1)</option>
                              <option value="america-new_york">America/New_York (GMT-4)</option>
                              <option value="asia-tokyo">Asia/Tokyo (GMT+9)</option>
                            </select>
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                                <path d="m6 9 6 6 6-6"/>
                              </svg>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <CustomLabel>Format de date</CustomLabel>
                          <div className="relative">
                            <select className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-paritel-accent appearance-none pr-8">
                              <option value="dd-mm-yyyy">DD/MM/YYYY</option>
                              <option value="mm-dd-yyyy">MM/DD/YYYY</option>
                              <option value="yyyy-mm-dd">YYYY-MM-DD</option>
                            </select>
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                                <path d="m6 9 6 6 6-6"/>
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button className="bg-paritel-primary">
                        <Save className="h-4 w-4 mr-2" />
                        Enregistrer les préférences
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
