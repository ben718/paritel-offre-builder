
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CustomLabel } from "@/components/ui/custom-label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Building,
  Mail,
  Phone,
  Globe,
  MapPin,
  User,
  Lock,
  Bell,
  Palette,
  HardDrive,
  Shield,
  Settings2,
  Save,
  AlertTriangle
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Settings = () => {
  const { toast } = useToast();

  // Company profile settings
  const [companySettings, setCompanySettings] = useState({
    name: "Paritel Solutions",
    email: "contact@paritel.fr",
    phone: "01 64 11 41 50",
    website: "www.paritel.fr",
    address: "12 rue Henri Becquerel, 77500 Chelles",
    logo: "/path/to/logo.png",
    description: "Paritel est un opérateur télécom B2B, spécialiste de la convergence des technologies de communication pour les entreprises."
  });

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    offerCreated: true,
    offerAccepted: true,
    offerRejected: true,
    newComment: true,
    dailyDigest: false,
    weeklyReport: true
  });

  // System settings
  const [systemSettings, setSystemSettings] = useState({
    language: "fr",
    darkMode: false,
    autoSave: true,
    autoLogout: 30,
    dataRetention: 365
  });

  // Security settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    passwordExpiry: 90,
    sessionTimeout: 60,
    loginAttempts: 5,
    ipRestriction: false
  });

  // Handle company profile updates
  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCompanySettings({
      ...companySettings,
      [name]: value
    });
  };

  // Handle notification toggle changes
  const handleNotificationToggle = (setting: keyof typeof notificationSettings) => {
    setNotificationSettings({
      ...notificationSettings,
      [setting]: !notificationSettings[setting]
    });
  };

  // Handle system settings changes
  const handleSystemChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSystemSettings({
      ...systemSettings,
      [name]: value
    });
  };

  // Handle system toggle changes
  const handleSystemToggle = (setting: keyof typeof systemSettings) => {
    if (typeof systemSettings[setting] === 'boolean') {
      setSystemSettings({
        ...systemSettings,
        [setting]: !systemSettings[setting]
      });
    }
  };

  // Handle security settings changes
  const handleSecurityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSecuritySettings({
      ...securitySettings,
      [name]: value
    });
  };

  // Handle security toggle changes
  const handleSecurityToggle = (setting: keyof typeof securitySettings) => {
    if (typeof securitySettings[setting] === 'boolean') {
      setSecuritySettings({
        ...securitySettings,
        [setting]: !securitySettings[setting]
      });
    }
  };

  // Handle settings save
  const saveSettings = (section: string) => {
    // In a real app, this would make an API call to save settings
    
    toast({
      title: "Paramètres enregistrés",
      description: `Les paramètres de ${section} ont été mis à jour avec succès.`,
    });
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Paramètres</h1>
          <p className="text-muted-foreground">
            Personnalisez et configurez les paramètres de votre application
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="flex items-center justify-center px-1 sm:px-3">
              <Building className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Profil entreprise</span>
              <span className="inline sm:hidden text-xs ml-1">Profil</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center justify-center px-1 sm:px-3">
              <Bell className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Notifications</span>
              <span className="inline sm:hidden text-xs ml-1">Notif.</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center justify-center px-1 sm:px-3">
              <Palette className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Système</span>
              <span className="inline sm:hidden text-xs ml-1">Syst.</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center justify-center px-1 sm:px-3">
              <Shield className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Sécurité</span>
              <span className="inline sm:hidden text-xs ml-1">Sécu.</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Company Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profil Entreprise</CardTitle>
                <CardDescription>
                  Ces informations sont affichées sur les documents générés et dans les communications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-1">
                  <CustomLabel>Nom de l'entreprise</CustomLabel>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input 
                      className="pl-9" 
                      placeholder="Nom de l'entreprise" 
                      name="name"
                      value={companySettings.name}
                      onChange={handleCompanyChange}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <CustomLabel>Email</CustomLabel>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input 
                        className="pl-9" 
                        placeholder="Adresse email" 
                        name="email"
                        value={companySettings.email}
                        onChange={handleCompanyChange}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <CustomLabel>Téléphone</CustomLabel>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input 
                        className="pl-9" 
                        placeholder="Numéro de téléphone" 
                        name="phone"
                        value={companySettings.phone}
                        onChange={handleCompanyChange}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <CustomLabel>Site web</CustomLabel>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input 
                      className="pl-9" 
                      placeholder="URL du site web" 
                      name="website"
                      value={companySettings.website}
                      onChange={handleCompanyChange}
                    />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <CustomLabel>Adresse</CustomLabel>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                    <Textarea 
                      className="pl-9 min-h-[80px]" 
                      placeholder="Adresse complète" 
                      name="address"
                      value={companySettings.address}
                      onChange={handleCompanyChange}
                    />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <CustomLabel>Description de l'entreprise</CustomLabel>
                  <Textarea 
                    className="min-h-[100px]" 
                    placeholder="Brève description de l'entreprise" 
                    name="description"
                    value={companySettings.description}
                    onChange={handleCompanyChange}
                  />
                </div>
                
                <Button className="bg-paritel-primary" onClick={() => saveSettings("profil entreprise")}>
                  <Save className="mr-2 h-4 w-4" />
                  Enregistrer les modifications
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Préférences de notifications</CardTitle>
                <CardDescription>
                  Configurez comment et quand vous souhaitez être notifié
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="font-medium">Notifications par email</h4>
                    <p className="text-muted-foreground text-sm">Recevoir des notifications par email</p>
                  </div>
                  <Switch 
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={() => handleNotificationToggle('emailNotifications')}
                  />
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h4 className="font-medium">Types de notifications</h4>
                  
                  <div className="grid gap-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h5 className="text-sm font-medium">Nouvelle offre créée</h5>
                        <p className="text-muted-foreground text-xs">Notification quand une offre est créée</p>
                      </div>
                      <Switch 
                        checked={notificationSettings.offerCreated}
                        onCheckedChange={() => handleNotificationToggle('offerCreated')}
                        disabled={!notificationSettings.emailNotifications}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h5 className="text-sm font-medium">Offre acceptée</h5>
                        <p className="text-muted-foreground text-xs">Notification quand une offre est acceptée</p>
                      </div>
                      <Switch 
                        checked={notificationSettings.offerAccepted}
                        onCheckedChange={() => handleNotificationToggle('offerAccepted')}
                        disabled={!notificationSettings.emailNotifications}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h5 className="text-sm font-medium">Offre refusée</h5>
                        <p className="text-muted-foreground text-xs">Notification quand une offre est refusée</p>
                      </div>
                      <Switch 
                        checked={notificationSettings.offerRejected}
                        onCheckedChange={() => handleNotificationToggle('offerRejected')}
                        disabled={!notificationSettings.emailNotifications}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h5 className="text-sm font-medium">Nouveau commentaire</h5>
                        <p className="text-muted-foreground text-xs">Notification quand un commentaire est ajouté</p>
                      </div>
                      <Switch 
                        checked={notificationSettings.newComment}
                        onCheckedChange={() => handleNotificationToggle('newComment')}
                        disabled={!notificationSettings.emailNotifications}
                      />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h4 className="font-medium">Résumés et rapports</h4>
                  
                  <div className="grid gap-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h5 className="text-sm font-medium">Résumé quotidien</h5>
                        <p className="text-muted-foreground text-xs">Recevoir un résumé quotidien des activités</p>
                      </div>
                      <Switch 
                        checked={notificationSettings.dailyDigest}
                        onCheckedChange={() => handleNotificationToggle('dailyDigest')}
                        disabled={!notificationSettings.emailNotifications}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h5 className="text-sm font-medium">Rapport hebdomadaire</h5>
                        <p className="text-muted-foreground text-xs">Recevoir un rapport hebdomadaire des performances</p>
                      </div>
                      <Switch 
                        checked={notificationSettings.weeklyReport}
                        onCheckedChange={() => handleNotificationToggle('weeklyReport')}
                        disabled={!notificationSettings.emailNotifications}
                      />
                    </div>
                  </div>
                </div>
                
                <Button className="bg-paritel-primary" onClick={() => saveSettings("notifications")}>
                  <Save className="mr-2 h-4 w-4" />
                  Enregistrer les préférences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* System Settings Tab */}
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres système</CardTitle>
                <CardDescription>
                  Personnalisez l'interface et les options système
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h4 className="font-medium">Mode sombre</h4>
                      <p className="text-muted-foreground text-sm">Activer le thème sombre pour l'interface</p>
                    </div>
                    <Switch 
                      checked={systemSettings.darkMode}
                      onCheckedChange={() => handleSystemToggle('darkMode')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h4 className="font-medium">Sauvegarde automatique</h4>
                      <p className="text-muted-foreground text-sm">Sauvegarder automatiquement les brouillons d'offres</p>
                    </div>
                    <Switch 
                      checked={systemSettings.autoSave}
                      onCheckedChange={() => handleSystemToggle('autoSave')}
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h4 className="font-medium">Préférences générales</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <CustomLabel>Langue</CustomLabel>
                      <select 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        name="language"
                        value={systemSettings.language}
                        onChange={handleSystemChange}
                      >
                        <option value="fr">Français</option>
                        <option value="en">English</option>
                        <option value="es">Español</option>
                        <option value="de">Deutsch</option>
                      </select>
                    </div>
                    
                    <div className="space-y-1">
                      <CustomLabel>Déconnexion auto (minutes)</CustomLabel>
                      <Input 
                        type="number" 
                        name="autoLogout"
                        value={systemSettings.autoLogout}
                        onChange={handleSystemChange}
                        min={5}
                        max={120}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <CustomLabel>Conservation des données (jours)</CustomLabel>
                    <Input 
                      type="number" 
                      name="dataRetention"
                      value={systemSettings.dataRetention}
                      onChange={handleSystemChange}
                      min={30}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Les données plus anciennes que cette période seront archivées
                    </p>
                  </div>
                </div>
                
                <Button className="bg-paritel-primary" onClick={() => saveSettings("système")}>
                  <Save className="mr-2 h-4 w-4" />
                  Enregistrer les paramètres
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Security Tab */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres de sécurité</CardTitle>
                <CardDescription>
                  Gérez les options de sécurité et de confidentialité
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="font-medium">Authentification à deux facteurs</h4>
                    <p className="text-muted-foreground text-sm">Renforce la sécurité de votre compte</p>
                  </div>
                  <Switch 
                    checked={securitySettings.twoFactorAuth}
                    onCheckedChange={() => handleSecurityToggle('twoFactorAuth')}
                  />
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h4 className="font-medium">Politique de mot de passe</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <CustomLabel>Expiration du mot de passe (jours)</CustomLabel>
                      <Input 
                        type="number" 
                        name="passwordExpiry"
                        value={securitySettings.passwordExpiry}
                        onChange={handleSecurityChange}
                        min={0}
                        max={365}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        0 = pas d'expiration
                      </p>
                    </div>
                    
                    <div className="space-y-1">
                      <CustomLabel>Tentatives de connexion maximum</CustomLabel>
                      <Input 
                        type="number" 
                        name="loginAttempts"
                        value={securitySettings.loginAttempts}
                        onChange={handleSecurityChange}
                        min={3}
                        max={10}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <CustomLabel>Délai d'expiration de session (minutes)</CustomLabel>
                  <Input 
                    type="number" 
                    name="sessionTimeout"
                    value={securitySettings.sessionTimeout}
                    onChange={handleSecurityChange}
                    min={15}
                    max={480}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="font-medium">Restriction par adresse IP</h4>
                    <p className="text-muted-foreground text-sm">Limite l'accès à partir d'adresses IP spécifiques</p>
                  </div>
                  <Switch 
                    checked={securitySettings.ipRestriction}
                    onCheckedChange={() => handleSecurityToggle('ipRestriction')}
                  />
                </div>
                
                <div className="bg-amber-50 border border-amber-200 rounded-md p-4 flex gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-amber-800 text-sm font-medium">Information importante</h5>
                    <p className="text-amber-800 text-xs mt-1">
                      Les modifications des paramètres de sécurité peuvent affecter l'accès des utilisateurs à la plateforme. 
                      Assurez-vous d'informer vos utilisateurs avant d'appliquer des changements majeurs.
                    </p>
                  </div>
                </div>
                
                <Button className="bg-paritel-primary" onClick={() => saveSettings("sécurité")}>
                  <Save className="mr-2 h-4 w-4" />
                  Enregistrer les paramètres de sécurité
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Settings;
