
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CustomLabel } from "@/components/ui/custom-label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Lock, LogIn, Mail, ShieldCheck, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Login form state
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  // Register form state
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    department: "Commercial",
    agreeTerms: false,
  });

  const { login, user, isAuthenticated, isLoading } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, user, navigate]);

  // Handle login form submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log("Attempting login with:", loginData.email);

      // Call login function from AuthContext
      const success = await login(loginData.email, loginData.password);

      if (success) {
        toast({
          title: "Connexion réussie",
          description: "Bienvenue dans l'application Paritel AO & Catalogue",
        });

        // Redirect to dashboard
        navigate("/dashboard");
      } else {
        toast({
          title: "Échec de la connexion",
          description: "Email ou mot de passe incorrect",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Login error:", error);

      // Display detailed error message from Supabase or other source
      toast({
        title: "Erreur de connexion",
        description: error.message || "Une erreur est survenue lors de la connexion",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle register form submission
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate passwords match
    if (registerData.password !== registerData.confirmPassword) {
      toast({
        title: "Erreur d'inscription",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      // Register with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: registerData.email,
        password: registerData.password,
        options: {
          data: {
            full_name: registerData.name,
            department: registerData.department,
          },
        },
      });

      if (error) {
        console.error("Registration error:", error);
        toast({
          title: "Erreur d'inscription",
          description: error.message,
          variant: "destructive",
        });
      } else {
        console.log("Registration successful:", data);
        toast({
          title: "Inscription réussie",
          description: "Votre compte a été créé. Vous pouvez maintenant vous connecter.",
        });

        // Switch to login tab
        setActiveTab("login");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        title: "Erreur d'inscription",
        description: "Une erreur est survenue lors de l'inscription",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle login input changes
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setLoginData({
      ...loginData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle register input changes
  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setRegisterData({
      ...registerData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 w-full">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-paritel-primary mb-2">Paritel AO & Catalogue</h1>
          <p className="text-gray-600">Plateforme de gestion des offres et du catalogue produits</p>
        </div>

        <Card className="w-full">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-bold text-center">
              {activeTab === "login" ? "Connexion" : "Inscription"}
            </CardTitle>
            <CardDescription className="text-center">
              {activeTab === "login"
                ? "Connectez-vous à votre compte pour accéder à la plateforme"
                : "Créez un compte pour accéder à la plateforme Paritel"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
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

                  <Button type="submit" className="w-full bg-paritel-primary hover:bg-paritel-primary/90" disabled={isSubmitting}>
                    {isSubmitting ? <>Connexion en cours...</> : <>Se connecter</>}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                {/* Registration form */}
                <form onSubmit={handleRegister} className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <CustomLabel htmlFor="name">Nom</CustomLabel>
                    <Input
                      id="name"
                      name="name"
                      value={registerData.name}
                      onChange={handleRegisterChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <CustomLabel htmlFor="email">Email</CustomLabel>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={registerData.email}
                      onChange={handleRegisterChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <CustomLabel htmlFor="password">Mot de passe</CustomLabel>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={registerData.password}
                      onChange={handleRegisterChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <CustomLabel htmlFor="confirmPassword">Confirmer le mot de passe</CustomLabel>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={registerData.confirmPassword}
                      onChange={handleRegisterChange}
                      required
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="agreeTerms"
                      name="agreeTerms"
                      checked={registerData.agreeTerms}
                      onChange={handleRegisterChange}
                    />
                    <label htmlFor="agreeTerms" className="ml-2 text-sm">
                      J'accepte les termes et conditions
                    </label>
                  </div>

                  <Button type="submit" className="w-full bg-paritel-primary hover:bg-paritel-primary/90" disabled={isSubmitting}>
                    {isSubmitting ? <>Inscription en cours...</> : <>S'inscrire</>}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>

          <CardFooter className="flex justify-center border-t p-4">
            <p className="text-xs">
              Vous avez déjà un compte?{" "}
              <span
                className="text-paritel-primary cursor-pointer"
                onClick={() => setActiveTab("login")}
              >
                Se connecter
              </span>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
