
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CustomLabel } from "@/components/ui/custom-label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Eye, EyeOff, Lock, LogIn, Mail, ShieldCheck, User } from "lucide-react";

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  
  // Login form state
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });
  
  // Register form state
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    department: "Commercial",
    agreeTerms: false
  });
  
  // Handle login form submission
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock login - in a real app, this would make an API call
    if (loginData.email === "admin@paritel.fr" && loginData.password === "admin123") {
      // Store user info in localStorage (would use secure cookies in production)
      localStorage.setItem("currentUser", JSON.stringify({
        id: 1,
        name: "Admin User",
        email: loginData.email,
        role: "admin"
      }));
      
      toast({
        title: "Connexion réussie",
        description: "Bienvenue dans l'application Paritel AO & Catalogue",
      });
      
      // Redirect to dashboard
      navigate("/");
    } else {
      toast({
        title: "Échec de la connexion",
        description: "Email ou mot de passe incorrect",
        variant: "destructive"
      });
    }
  };
  
  // Handle register form submission
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords match
    if (registerData.password !== registerData.confirmPassword) {
      toast({
        title: "Erreur d'inscription",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive"
      });
      return;
    }
    
    // Mock registration - in a real app, this would make an API call
    toast({
      title: "Inscription réussie",
      description: "Votre compte a été créé et est en attente d'activation",
    });
    
    // Switch to login tab
    setActiveTab("login");
  };
  
  // Handle login input changes
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setLoginData({
      ...loginData,
      [name]: type === "checkbox" ? checked : value
    });
  };
  
  // Handle register input changes
  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setRegisterData({
      ...registerData,
      [name]: type === "checkbox" ? checked : value
    });
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-paritel-primary mb-2">Paritel AO & Catalogue</h1>
          <p className="text-gray-600">Plateforme de gestion des offres et du catalogue produits</p>
        </div>
        
        <Card>
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-bold text-center">
              {activeTab === "login" ? "Connexion" : "Inscription"}
            </CardTitle>
            <CardDescription className="text-center">
              {activeTab === "login" 
                ? "Connectez-vous à votre compte pour accéder à la plateforme"
                : "Créez un compte pour accéder à la plateforme Paritel"
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs 
              defaultValue="login" 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Connexion</TabsTrigger>
                <TabsTrigger value="register">Inscription</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <CustomLabel htmlFor="email">Email</CustomLabel>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="votre@email.com"
                        className="pl-9"
                        value={loginData.email}
                        onChange={handleLoginChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <CustomLabel htmlFor="password">Mot de passe</CustomLabel>
                      <Link to="/forgot-password" className="text-xs text-paritel-primary hover:underline">
                        Mot de passe oublié?
                      </Link>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-9 pr-10"
                        value={loginData.password}
                        onChange={handleLoginChange}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="remember"
                      name="rememberMe"
                      className="rounded border-gray-300 text-paritel-primary focus:ring-paritel-primary"
                      checked={loginData.rememberMe}
                      onChange={handleLoginChange}
                    />
                    <label htmlFor="remember" className="text-sm text-gray-600">
                      Rester connecté
                    </label>
                  </div>
                  
                  <Button type="submit" className="w-full bg-paritel-primary hover:bg-paritel-primary/90">
                    <LogIn className="mr-2 h-4 w-4" />
                    Se connecter
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <CustomLabel htmlFor="register-name">Nom complet</CustomLabel>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="register-name"
                        name="name"
                        placeholder="Prénom Nom"
                        className="pl-9"
                        value={registerData.name}
                        onChange={handleRegisterChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <CustomLabel htmlFor="register-email">Email professionnel</CustomLabel>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="register-email"
                        name="email"
                        type="email"
                        placeholder="votre@email.com"
                        className="pl-9"
                        value={registerData.email}
                        onChange={handleRegisterChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <CustomLabel htmlFor="register-password">Mot de passe</CustomLabel>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          id="register-password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="pl-9"
                          value={registerData.password}
                          onChange={handleRegisterChange}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <CustomLabel htmlFor="register-confirm-password">Confirmer</CustomLabel>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          id="register-confirm-password"
                          name="confirmPassword"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="pl-9"
                          value={registerData.confirmPassword}
                          onChange={handleRegisterChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <CustomLabel htmlFor="register-department">Service / Département</CustomLabel>
                    <select
                      id="register-department"
                      name="department"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={registerData.department}
                      onChange={handleRegisterChange}
                    >
                      <option value="Commercial">Commercial</option>
                      <option value="Technique">Technique</option>
                      <option value="Support">Support</option>
                      <option value="Direction">Direction</option>
                      <option value="Marketing">Marketing</option>
                      <option value="RH">Ressources Humaines</option>
                      <option value="Finance">Finance</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="terms"
                      name="agreeTerms"
                      className="rounded border-gray-300 text-paritel-primary focus:ring-paritel-primary"
                      checked={registerData.agreeTerms}
                      onChange={handleRegisterChange}
                      required
                    />
                    <label htmlFor="terms" className="text-sm text-gray-600">
                      J'accepte les <a href="#" className="text-paritel-primary hover:underline">conditions d'utilisation</a>
                    </label>
                  </div>
                  
                  <Button type="submit" className="w-full bg-paritel-primary hover:bg-paritel-primary/90">
                    <User className="mr-2 h-4 w-4" />
                    Créer un compte
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
            
            <div className="mt-4 pt-4 border-t text-center text-sm text-gray-500">
              {activeTab === "login" ? (
                <>
                  Pas encore de compte?{" "}
                  <button 
                    type="button" 
                    className="text-paritel-primary hover:underline font-medium"
                    onClick={() => setActiveTab("register")}
                  >
                    Créer un compte
                  </button>
                </>
              ) : (
                <>
                  Déjà inscrit?{" "}
                  <button 
                    type="button" 
                    className="text-paritel-primary hover:underline font-medium"
                    onClick={() => setActiveTab("login")}
                  >
                    Se connecter
                  </button>
                </>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-center border-t p-4">
            <div className="flex items-center text-sm text-gray-500">
              <ShieldCheck className="h-4 w-4 mr-1 text-paritel-primary" />
              Connexion sécurisée
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
