import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CustomLabel } from "@/components/ui/custom-label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import {
  Building,
  Mail,
  Phone,
  Globe,
  MapPin,
  Bell,
  Settings2,
  Save,
  AlertTriangle
} from "lucide-react";
import {
  fetchCompanySettings,
  updateCompanySettings,
  fetchUserNotificationPreferences,
  updateNotificationPreferences,
  fetchUserSystemPreferences,
  updateSystemPreferences,
  type CompanySettings,
  type NotificationPreferences,
  type SystemPreferences
} from "@/services/SettingsService";

const Settings = () => {
  const { toast } = useToast();
  const { userProfile } = useAuth();

  // State for settings
  const [companySettings, setCompanySettings] = useState<CompanySettings>({
    id: '',
    name: '',
    email: '',
    phone: '',
    website: '',
    address: '',
    description: '',
    logo_url: ''
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationPreferences>({
    id: '',
    user_id: '',
    email_notifications: true,
    offer_created: true,
    offer_accepted: true,
    offer_rejected: true,
    new_comment: true,
    daily_digest: false,
    weekly_report: true
  });

  const [systemSettings, setSystemSettings] = useState<SystemPreferences>({
    id: '',
    user_id: '',
    language: 'fr',
    dark_mode: false,
    auto_save: true,
    auto_logout: 30,
    data_retention: 365
  });

  // Fetch settings on component mount
  useEffect(() => {
    const loadSettings = async () => {
      if (userProfile?.id) {
        const [company, notifications, system] = await Promise.all([
          fetchCompanySettings(),
          fetchUserNotificationPreferences(userProfile.id),
          fetchUserSystemPreferences(userProfile.id)
        ]);

        if (company) setCompanySettings(company);
        if (notifications) setNotificationSettings(notifications);
        if (system) setSystemSettings(system);
      }
    };

    loadSettings();
  }, [userProfile?.id]);

  // Handle company profile updates
  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCompanySettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle notification toggle changes
  const handleNotificationToggle = (setting: keyof Omit<NotificationPreferences, 'id' | 'user_id'>) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  // Handle system settings changes
  const handleSystemChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSystemSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle system toggle changes
  const handleSystemToggle = (setting: keyof Omit<SystemPreferences, 'id' | 'user_id' | 'language' | 'auto_logout' | 'data_retention'>) => {
    setSystemSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  // Handle settings save
  const saveSettings = async (section: string) => {
    if (!userProfile?.id) return;

    try {
      let success = false;

      switch (section) {
        case "company":
          const updatedCompany = await updateCompanySettings(companySettings);
          success = !!updatedCompany;
          break;
        case "notifications":
          const updatedNotifications = await updateNotificationPreferences(userProfile.id, notificationSettings);
          success = !!updatedNotifications;
          break;
        case "system":
          const updatedSystem = await updateSystemPreferences(userProfile.id, systemSettings);
          success = !!updatedSystem;
          break;
      }

      if (success) {
        toast({
          title: "Paramètres enregistrés",
          description: `Les paramètres de ${section} ont été mis à jour avec succès.`,
        });
      } else {
        throw new Error("Échec de la mise à jour");
      }
    } catch (error) {
      console.error(`Error saving ${section} settings:`, error);
      toast({
        title: "Erreur",
        description: `Une erreur est survenue lors de la mise à jour des paramètres de ${section}.`,
        variant: "destructive",
      });
    }
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
                    checked={notificationSettings.email_notifications}
                    onCheckedChange={() => handleNotificationToggle('email_notifications')}
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
                        checked={notificationSettings.offer_created}
                        onCheckedChange={() => handleNotificationToggle('offer_created')}
                        disabled={!notificationSettings.email_notifications}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h5 className="text-sm font-medium">Offre acceptée</h5>
                        <p className="text-muted-foreground text-xs">Notification quand une offre est acceptée</p>
                      </div>
                      <Switch 
                        checked={notificationSettings.offer_accepted}
                        onCheckedChange={() => handleNotificationToggle('offer_accepted')}
                        disabled={!notificationSettings.email_notifications}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h5 className="text-sm font-medium">Offre refusée</h5>
                        <p className="text-muted-foreground text-xs">Notification quand une offre est refusée</p>
                      </div>
                      <Switch 
                        checked={notificationSettings.offer_rejected}
                        onCheckedChange={() => handleNotificationToggle('offer_rejected')}
                        disabled={!notificationSettings.email_notifications}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h5 className="text-sm font-medium">Nouveau commentaire</h5>
                        <p className="text-muted-foreground text-xs">Notification quand un commentaire est ajouté</p>
                      </div>
                      <Switch 
                        checked={notificationSettings.new_comment}
                        onCheckedChange={() => handleNotificationToggle('new_comment')}
                        disabled={!notificationSettings.email_notifications}
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
                        checked={notificationSettings.daily_digest}
                        onCheckedChange={() => handleNotificationToggle('daily_digest')}
                        disabled={!notificationSettings.email_notifications}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h5 className="text-sm font-medium">Rapport hebdomadaire</h5>
                        <p className="text-muted-foreground text-xs">Recevoir un rapport hebdomadaire des performances</p>
                      </div>
                      <Switch 
                        checked={notificationSettings.weekly_report}
                        onCheckedChange={() => handleNotificationToggle('weekly_report')}
                        disabled={!notificationSettings.email_notifications}
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
                      checked={systemSettings.dark_mode}
                      onCheckedChange={() => handleSystemToggle('dark_mode')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h4 className="font-medium">Sauvegarde automatique</h4>
                      <p className="text-muted-foreground text-sm">Sauvegarder automatiquement les brouillons d'offres</p>
                    </div>
                    <Switch 
                      checked={systemSettings.auto_save}
                      onCheckedChange={() => handleSystemToggle('auto_save')}
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
                        name="auto_logout"
                        value={systemSettings.auto_logout}
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
                      name="data_retention"
                      value={systemSettings.data_retention}
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
                    checked={securitySettings.two_factor_auth}
                    onCheckedChange={() => handleSecurityToggle('two_factor_auth')}
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
                        name="password_expiry"
                        value={securitySettings.password_expiry}
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
                        name="login_attempts"
                        value={securitySettings.login_attempts}
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
                    name="session_timeout"
                    value={securitySettings.session_timeout}
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
                    checked={securitySettings.ip_restriction}
                    onCheckedChange={() => handleSecurityToggle('ip_restriction')}
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
