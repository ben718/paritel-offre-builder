
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, Filter, ArrowUpDown } from "lucide-react";
import { useState } from "react";

type ProductCardProps = {
  id: number;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  partner?: string;
  tags: string[];
  pricing?: string;
  image: string;
};

const ProductCard = ({
  id,
  name,
  description,
  category,
  subcategory,
  partner,
  tags,
  pricing,
  image,
}: ProductCardProps) => {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-48 bg-paritel-lightgray">
        <div className="absolute top-2 left-2">
          <Badge className="bg-paritel-primary text-white">{category}</Badge>
          {subcategory && (
            <Badge className="ml-1 bg-paritel-secondary text-white">{subcategory}</Badge>
          )}
        </div>
        {partner && (
          <div className="absolute top-2 right-2">
            <Badge variant="outline" className="bg-white border-paritel-primary">
              {partner}
            </Badge>
          </div>
        )}
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-medium text-lg mb-1">{name}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{description}</p>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {tags.map((tag, i) => (
            <Badge key={i} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        {pricing && (
          <div className="text-sm text-gray-700 mb-2">
            À partir de <span className="font-semibold text-paritel-primary">{pricing}</span>
          </div>
        )}
        
        <div className="flex justify-between">
          <Button variant="outline" size="sm">
            Détails
          </Button>
          <Button variant="default" size="sm" className="bg-paritel-primary">
            Ajouter
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const Products = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState("all");
  
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setSelectedSubcategory("all");
  };
  
  const products: ProductCardProps[] = [
    // TÉLÉPHONIE
    {
      id: 1,
      name: "UCaaS",
      description: "Solution de communications unifiées as a Service incluant téléphonie, visio et messagerie.",
      category: "Téléphonie",
      subcategory: "UCaaS",
      tags: ["Cloud", "Téléphonie", "Communication unifiée"],
      pricing: "15€/utilisateur/mois",
      image: "https://placehold.co/600x400/1EAEDB/ffffff?text=UCaaS",
    },
    {
      id: 2,
      name: "PBX On Premise",
      description: "Centrale téléphonique physique installée dans vos locaux pour une maîtrise totale de votre téléphonie.",
      category: "Téléphonie",
      subcategory: "PBX On Premise",
      tags: ["Sur site", "Téléphonie", "Matériel"],
      pricing: "À partir de 1500€",
      image: "https://placehold.co/600x400/1EAEDB/ffffff?text=PBX",
    },
    {
      id: 3,
      name: "Cloud PBX",
      description: "Solution de téléphonie hébergée dans le cloud avec toutes les fonctionnalités d'un standard téléphonique.",
      category: "Téléphonie",
      subcategory: "Cloud PBX",
      tags: ["Cloud", "Téléphonie", "IPBX"],
      pricing: "12€/utilisateur/mois",
      image: "https://placehold.co/600x400/1EAEDB/ffffff?text=CloudPBX",
    },
    {
      id: 4,
      name: "Trunk SIP",
      description: "Solution pour connecter votre IPBX au réseau téléphonique public via Internet.",
      category: "Téléphonie",
      subcategory: "Trunk SIP",
      tags: ["VoIP", "SIP", "Interconnexion"],
      pricing: "À partir de 10€/canal/mois",
      image: "https://placehold.co/600x400/1EAEDB/ffffff?text=TrunkSIP",
    },
    {
      id: 5,
      name: "Number Hosting",
      description: "Service d'hébergement de numéros de téléphone avec redirection vers vos lignes existantes.",
      category: "Téléphonie",
      subcategory: "Number Hosting",
      tags: ["Numérotation", "Portabilité", "Téléphonie"],
      pricing: "2€/numéro/mois",
      image: "https://placehold.co/600x400/1EAEDB/ffffff?text=NumberHosting",
    },
    
    // TÉLÉPHONIE AVANCÉE
    {
      id: 6,
      name: "POPC (Poste Opérateur)",
      description: "Solution évoluée pour les standardistes avec gestion avancée des appels entrants et sortants.",
      category: "Téléphonie Avancée",
      subcategory: "POPC",
      tags: ["Standardiste", "Gestion d'appels", "Téléphonie professionnelle"],
      pricing: "25€/poste/mois",
      image: "https://placehold.co/600x400/33C3F0/ffffff?text=POPC",
    },
    {
      id: 7,
      name: "Intégration CRM",
      description: "Synchronisation de votre téléphonie avec votre CRM pour une gestion client optimisée.",
      category: "Téléphonie Avancée",
      subcategory: "Intégration CRM",
      tags: ["CRM", "CTI", "Productivité"],
      pricing: "Sur devis",
      image: "https://placehold.co/600x400/33C3F0/ffffff?text=CRM",
    },
    {
      id: 8,
      name: "Analyse de Traffic",
      description: "Outils d'analyse et de reporting pour optimiser votre trafic téléphonique.",
      category: "Téléphonie Avancée",
      subcategory: "Analyse de Traffic",
      tags: ["Statistiques", "Optimisation", "Reporting"],
      pricing: "8€/utilisateur/mois",
      image: "https://placehold.co/600x400/33C3F0/ffffff?text=Analytics",
    },
    {
      id: 9,
      name: "Système Appel Malade",
      description: "Solution dédiée aux établissements de santé pour la gestion des appels patients.",
      category: "Téléphonie Avancée",
      subcategory: "Système Appel Malade",
      tags: ["Santé", "EHPAD", "Hôpitaux"],
      pricing: "Sur devis",
      image: "https://placehold.co/600x400/33C3F0/ffffff?text=AppelMalade",
    },
    {
      id: 10,
      name: "ACD (Distribution automatique d'appels)",
      description: "Système de répartition intelligente des appels vers les bons interlocuteurs.",
      category: "Téléphonie Avancée",
      subcategory: "ACD",
      tags: ["Call center", "Distribution", "File d'attente"],
      pricing: "10€/agent/mois",
      image: "https://placehold.co/600x400/33C3F0/ffffff?text=ACD",
    },
    {
      id: 11,
      name: "SVI (Serveur Vocal Interactif)",
      description: "Menu vocal automatisé pour orienter vos appelants vers le bon service.",
      category: "Téléphonie Avancée",
      subcategory: "SVI",
      tags: ["Menu vocal", "Orientation", "Automatisation"],
      pricing: "15€/mois",
      image: "https://placehold.co/600x400/33C3F0/ffffff?text=SVI",
    },
    {
      id: 12,
      name: "Call Recorder",
      description: "Enregistrement de vos appels pour formation, qualité ou conformité légale.",
      category: "Téléphonie Avancée",
      subcategory: "Call Recorder",
      tags: ["Enregistrement", "Conformité", "Formation"],
      pricing: "7€/poste/mois",
      image: "https://placehold.co/600x400/33C3F0/ffffff?text=CallRecorder",
    },
    
    // INTERNET & RÉSEAU
    {
      id: 13,
      name: "Fibre optique Dédiée",
      description: "Connexion fibre optique dédiée avec débits symétriques garantis et GTR 4h 24/7.",
      category: "Internet & Réseau",
      subcategory: "Fibre optique (Actif/Passif)",
      tags: ["Haute disponibilité", "Débit garanti", "GTR 4h"],
      pricing: "599€/mois",
      image: "https://placehold.co/600x400/2A4B8D/ffffff?text=FibreDédiée",
    },
    {
      id: 14,
      name: "Fibre optique Mutualisée",
      description: "Fibre optique professionnelle avec débits mutualisés et GTR adaptée à vos besoins.",
      category: "Internet & Réseau",
      subcategory: "Fibre optique (Actif/Passif)",
      tags: ["Fibre", "Débit élevé", "GTR 4h"],
      pricing: "189€/mois",
      image: "https://placehold.co/600x400/2A4B8D/ffffff?text=FibreMutualisée",
    },
    {
      id: 15,
      name: "ADSL/VDSL Professionnel",
      description: "Connexion internet sur cuivre adaptée aux professionnels avec option GTR.",
      category: "Internet & Réseau",
      subcategory: "Cuivre (xDSL)",
      tags: ["ADSL", "VDSL", "Connexion professionnelle"],
      pricing: "45€/mois",
      image: "https://placehold.co/600x400/2A4B8D/ffffff?text=xDSL",
    },
    {
      id: 16,
      name: "Box Internet 4G/5G",
      description: "Solution internet mobile pour sites isolés ou en secours de votre connexion principale.",
      category: "Internet & Réseau",
      subcategory: "4G/5G",
      tags: ["Mobile", "4G", "5G", "Secours"],
      pricing: "49€/mois",
      image: "https://placehold.co/600x400/2A4B8D/ffffff?text=Box4G5G",
    },
    
    // WIFI INDOOR/OUTDOOR
    {
      id: 17,
      name: "Wifi Entreprise Privé",
      description: "Solution Wifi professionnelle sécurisée pour vos collaborateurs avec contrôleur centralisé.",
      category: "Wifi Indoor/Outdoor",
      subcategory: "Wifi Privé",
      partner: "Cambium Networks",
      tags: ["Wifi", "Entreprise", "Sécurité"],
      pricing: "45€/mois",
      image: "https://placehold.co/600x400/3B82F6/ffffff?text=WifiPrivé",
    },
    {
      id: 18,
      name: "Wifi Public",
      description: "Hotspot Wifi pour vos clients et visiteurs conforme aux obligations légales (RGPD).",
      category: "Wifi Indoor/Outdoor",
      subcategory: "Wifi Public",
      partner: "Cambium Networks",
      tags: ["Hotspot", "Public", "RGPD"],
      pricing: "59€/mois",
      image: "https://placehold.co/600x400/3B82F6/ffffff?text=WifiPublic",
    },
    
    // CYBERSÉCURITÉ
    {
      id: 19,
      name: "Solution Anti-Virus / Anti-Malware",
      description: "Protection avancée contre les menaces informatiques pour vos postes et serveurs.",
      category: "Cybersécurité",
      subcategory: "Advanced Adware Protection",
      partner: "Fortinet",
      tags: ["Sécurité", "Anti-virus", "Protection"],
      pricing: "5€/poste/mois",
      image: "https://placehold.co/600x400/7c2d12/ffffff?text=AntiVirus",
    },
    {
      id: 20,
      name: "Firewall Fortinet UTM",
      description: "Solution de pare-feu nouvelle génération avec fonctionnalités UTM avancées.",
      category: "Cybersécurité",
      subcategory: "Poste de Travail / Réseau LAN",
      partner: "Fortinet",
      tags: ["Sécurité", "Firewall", "UTM"],
      pricing: "99€/mois",
      image: "https://placehold.co/600x400/7c2d12/ffffff?text=Firewall",
    },
    {
      id: 21,
      name: "VPN Sécurisé",
      description: "Accès sécurisé à distance à votre réseau d'entreprise via SD-WAN ou MPLS.",
      category: "Cybersécurité",
      subcategory: "VPN (SD-WAN/MPLS)",
      tags: ["VPN", "SD-WAN", "MPLS", "Télétravail"],
      pricing: "25€/utilisateur/mois",
      image: "https://placehold.co/600x400/7c2d12/ffffff?text=VPN",
    },
    {
      id: 22,
      name: "Anti-Spam Professionnel",
      description: "Filtrage avancé des emails indésirables pour protéger votre messagerie professionnelle.",
      category: "Cybersécurité",
      subcategory: "Anti-Spam",
      tags: ["Email", "Filtrage", "Spam"],
      pricing: "3€/boîte mail/mois",
      image: "https://placehold.co/600x400/7c2d12/ffffff?text=AntiSpam",
    },
    {
      id: 23,
      name: "Filtrage Web Sécurisé",
      description: "Solution de filtrage de contenu web pour protéger votre réseau et vos collaborateurs.",
      category: "Cybersécurité",
      subcategory: "Web Security",
      tags: ["Filtrage", "Web", "Protection"],
      pricing: "4€/utilisateur/mois",
      image: "https://placehold.co/600x400/7c2d12/ffffff?text=WebSecurity",
    },
    {
      id: 24,
      name: "Infogérance IT",
      description: "Gestion externalisée de votre parc informatique et de votre sécurité.",
      category: "Cybersécurité",
      subcategory: "Infogérance",
      tags: ["Gestion", "IT", "Externalisation"],
      pricing: "49€/utilisateur/mois",
      image: "https://placehold.co/600x400/7c2d12/ffffff?text=Infogérance",
    },
    {
      id: 25,
      name: "Solution d'Accès à Distance",
      description: "Accès sécurisé à distance pour vos collaborateurs en mobilité ou télétravail.",
      category: "Cybersécurité",
      subcategory: "Remote Access",
      tags: ["Accès distant", "Télétravail", "Sécurité"],
      pricing: "15€/utilisateur/mois",
      image: "https://placehold.co/600x400/7c2d12/ffffff?text=RemoteAccess",
    },
    {
      id: 26,
      name: "IPS (Système de Prévention d'Intrusion)",
      description: "Protection avancée contre les tentatives d'intrusion sur votre réseau.",
      category: "Cybersécurité",
      subcategory: "IPS",
      tags: ["Intrusion", "Prévention", "Protection réseau"],
      pricing: "75€/mois",
      image: "https://placehold.co/600x400/7c2d12/ffffff?text=IPS",
    },
    
    // MOBILITÉ
    {
      id: 27,
      name: "Forfaits Mobiles Professionnels",
      description: "Gamme complète de forfaits mobiles adaptés aux besoins des professionnels.",
      category: "Mobilité",
      subcategory: "Tout type de forfait mobile",
      tags: ["Mobile", "Voix", "Data", "SMS"],
      pricing: "À partir de 9,90€/mois",
      image: "https://placehold.co/600x400/4338ca/ffffff?text=ForfaitMobile",
    },
    {
      id: 28,
      name: "Service de Destination d'Appels",
      description: "Gestion intelligente des destinations d'appels pour vos collaborateurs mobiles.",
      category: "Mobilité",
      subcategory: "Destination d'Appels",
      tags: ["Routage", "Mobilité", "Gestion d'appels"],
      pricing: "10€/ligne/mois",
      image: "https://placehold.co/600x400/4338ca/ffffff?text=DestinationAppels",
    },
    {
      id: 29,
      name: "Forfaits DATA Entreprise",
      description: "Enveloppes DATA dédiées à vos usages professionnels sur mobile ou tablette.",
      category: "Mobilité",
      subcategory: "Enveloppe DATA",
      tags: ["Data", "Internet mobile", "Professionnel"],
      pricing: "À partir de 15€/mois",
      image: "https://placehold.co/600x400/4338ca/ffffff?text=DATA",
    },
    {
      id: 30,
      name: "Solution Sur Mesure",
      description: "Création de forfaits mobiles sur mesure adaptés aux besoins spécifiques de votre entreprise.",
      category: "Mobilité",
      subcategory: "Sur Mesure",
      tags: ["Personnalisation", "Adaptabilité", "Spécifique"],
      pricing: "Sur devis",
      image: "https://placehold.co/600x400/4338ca/ffffff?text=SurMesure",
    },
    
    // SÉCURITÉ
    {
      id: 31,
      name: "Télésurveillance Professionnelle",
      description: "Service de télésurveillance 24/7 pour la protection de vos locaux.",
      category: "Sécurité",
      subcategory: "Télésurveillance",
      tags: ["Surveillance", "Alarme", "Intervention"],
      pricing: "39€/mois",
      image: "https://placehold.co/600x400/78350f/ffffff?text=Télésurveillance",
    },
    {
      id: 32,
      name: "Vidéosurveillance IP",
      description: "Système de vidéosurveillance connecté avec stockage cloud et accès à distance.",
      category: "Sécurité",
      subcategory: "Vidéosurveillance",
      tags: ["Caméras", "IP", "Cloud"],
      pricing: "À partir de 29€/mois",
      image: "https://placehold.co/600x400/78350f/ffffff?text=Vidéosurveillance",
    },
    {
      id: 33,
      name: "Terminal de Paiement Électronique",
      description: "Solution monétique complète pour la gestion de vos paiements clients.",
      category: "Sécurité",
      subcategory: "Monétique",
      tags: ["TPE", "Paiement", "Sans contact"],
      pricing: "19€/mois",
      image: "https://placehold.co/600x400/78350f/ffffff?text=TPE",
    },
    {
      id: 34,
      name: "Solution de Paiement Sécurisé",
      description: "Système de paiement sécurisé en ligne conforme aux normes PCI-DSS.",
      category: "Sécurité",
      subcategory: "Paiement sécurisé",
      tags: ["E-commerce", "Paiement", "Sécurité"],
      pricing: "25€/mois",
      image: "https://placehold.co/600x400/78350f/ffffff?text=PaiementSécurisé",
    },
    
    // Produits spécifiques déjà présents
    {
      id: 35,
      name: "Solution Hôtelière Intégrée",
      description: "Offre complète pour l'hôtellerie incluant WiFi, IPTV et téléphonie.",
      category: "Verticaux métiers",
      subcategory: "Hôtellerie",
      partner: "Cambium Networks",
      tags: ["Hôtellerie", "IPTV", "Wifi"],
      pricing: "Sur devis",
      image: "https://placehold.co/600x400/0f766e/ffffff?text=Hotel",
    },
    {
      id: 36,
      name: "Support IT Niveau 1",
      description: "Service de support informatique de premier niveau avec hotline dédiée 7/7.",
      category: "Services managés",
      tags: ["Support", "Service", "Maintenance"],
      pricing: "49€/utilisateur/mois",
      image: "https://placehold.co/600x400/64748B/ffffff?text=Support",
    },
  ];
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Catalogue Produits et Services</h1>
            <p className="text-muted-foreground mt-1">
              Consultez notre catalogue complet de produits, services et partenaires
            </p>
          </div>
          <Button className="bg-paritel-primary hover:bg-paritel-dark">
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un produit
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher un produit ou service..."
              className="w-full py-2 pl-9 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-paritel-accent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex gap-2">
              <Filter className="h-4 w-4" />
              Filtres avancés
            </Button>
            <Button variant="outline" className="flex gap-2">
              <ArrowUpDown className="h-4 w-4" />
              Trier
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" onValueChange={handleCategoryChange}>
          <TabsList className="flex flex-wrap">
            <TabsTrigger value="all">Tous les produits</TabsTrigger>
            <TabsTrigger value="telephony">Téléphonie</TabsTrigger>
            <TabsTrigger value="advanced-telephony">Téléphonie Avancée</TabsTrigger>
            <TabsTrigger value="internet-network">Internet & Réseau</TabsTrigger>
            <TabsTrigger value="wifi">Wifi Indoor/Outdoor</TabsTrigger>
            <TabsTrigger value="cybersecurity">Cybersécurité</TabsTrigger>
            <TabsTrigger value="mobility">Mobilité</TabsTrigger>
            <TabsTrigger value="security">Sécurité</TabsTrigger>
            <TabsTrigger value="verticals">Verticaux métiers</TabsTrigger>
          </TabsList>
          
          {selectedCategory === "telephony" && (
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge 
                variant={selectedSubcategory === "all" ? "default" : "outline"} 
                className="cursor-pointer bg-paritel-primary"
                onClick={() => setSelectedSubcategory("all")}
              >
                Toutes les solutions
              </Badge>
              <Badge 
                variant={selectedSubcategory === "UCaaS" ? "default" : "outline"} 
                className="cursor-pointer hover:bg-paritel-primary"
                onClick={() => setSelectedSubcategory("UCaaS")}
              >
                UCaaS
              </Badge>
              <Badge 
                variant={selectedSubcategory === "PBX On Premise" ? "default" : "outline"} 
                className="cursor-pointer hover:bg-paritel-primary"
                onClick={() => setSelectedSubcategory("PBX On Premise")}
              >
                PBX On Premise
              </Badge>
              <Badge 
                variant={selectedSubcategory === "Cloud PBX" ? "default" : "outline"} 
                className="cursor-pointer hover:bg-paritel-primary"
                onClick={() => setSelectedSubcategory("Cloud PBX")}
              >
                Cloud PBX
              </Badge>
              <Badge 
                variant={selectedSubcategory === "Trunk SIP" ? "default" : "outline"} 
                className="cursor-pointer hover:bg-paritel-primary"
                onClick={() => setSelectedSubcategory("Trunk SIP")}
              >
                Trunk SIP
              </Badge>
              <Badge 
                variant={selectedSubcategory === "Number Hosting" ? "default" : "outline"} 
                className="cursor-pointer hover:bg-paritel-primary"
                onClick={() => setSelectedSubcategory("Number Hosting")}
              >
                Number Hosting
              </Badge>
            </div>
          )}
          
          {selectedCategory === "advanced-telephony" && (
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge 
                variant={selectedSubcategory === "all" ? "default" : "outline"} 
                className="cursor-pointer bg-paritel-primary"
                onClick={() => setSelectedSubcategory("all")}
              >
                Toutes les solutions
              </Badge>
              <Badge 
                variant={selectedSubcategory === "POPC" ? "default" : "outline"} 
                className="cursor-pointer hover:bg-paritel-primary"
                onClick={() => setSelectedSubcategory("POPC")}
              >
                POPC (Poste Opérateur)
              </Badge>
              <Badge 
                variant={selectedSubcategory === "Intégration CRM" ? "default" : "outline"} 
                className="cursor-pointer hover:bg-paritel-primary"
                onClick={() => setSelectedSubcategory("Intégration CRM")}
              >
                Intégration CRM
              </Badge>
              <Badge 
                variant={selectedSubcategory === "Analyse de Traffic" ? "default" : "outline"} 
                className="cursor-pointer hover:bg-paritel-primary"
                onClick={() => setSelectedSubcategory("Analyse de Traffic")}
              >
                Analyse de Traffic
              </Badge>
              <Badge 
                variant={selectedSubcategory === "Système Appel Malade" ? "default" : "outline"} 
                className="cursor-pointer hover:bg-paritel-primary"
                onClick={() => setSelectedSubcategory("Système Appel Malade")}
              >
                Système Appel Malade
              </Badge>
              <Badge 
                variant={selectedSubcategory === "ACD" ? "default" : "outline"} 
                className="cursor-pointer hover:bg-paritel-primary"
                onClick={() => setSelectedSubcategory("ACD")}
              >
                ACD
              </Badge>
              <Badge 
                variant={selectedSubcategory === "SVI" ? "default" : "outline"} 
                className="cursor-pointer hover:bg-paritel-primary"
                onClick={() => setSelectedSubcategory("SVI")}
              >
                SVI
              </Badge>
              <Badge 
                variant={selectedSubcategory === "Call Recorder" ? "default" : "outline"} 
                className="cursor-pointer hover:bg-paritel-primary"
                onClick={() => setSelectedSubcategory("Call Recorder")}
              >
                Call Recorder
              </Badge>
            </div>
          )}
          
          {selectedCategory === "internet-network" && (
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge 
                variant={selectedSubcategory === "all" ? "default" : "outline"} 
                className="cursor-pointer bg-paritel-primary"
                onClick={() => setSelectedSubcategory("all")}
              >
                Toutes les solutions
              </Badge>
              <Badge 
                variant={selectedSubcategory === "Fibre optique (Actif/Passif)" ? "default" : "outline"} 
                className="cursor-pointer hover:bg-paritel-primary"
                onClick={() => setSelectedSubcategory("Fibre optique (Actif/Passif)")}
              >
                Fibre optique (Actif/Passif)
              </Badge>
              <Badge 
                variant={selectedSubcategory === "Cuivre (xDSL)" ? "default" : "outline"} 
                className="cursor-pointer hover:bg-paritel-primary"
                onClick={() => setSelectedSubcategory("Cuivre (xDSL)")}
              >
                Cuivre (xDSL)
              </Badge>
              <Badge 
                variant={selectedSubcategory === "4G/5G" ? "default" : "outline"} 
                className="cursor-pointer hover:bg-paritel-primary"
                onClick={() => setSelectedSubcategory("4G/5G")}
              >
                4G/5G
              </Badge>
            </div>
          )}
          
          {selectedCategory === "wifi" && (
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge 
                variant={selectedSubcategory === "all" ? "default" : "outline"} 
                className="cursor-pointer bg-paritel-primary"
                onClick={() => setSelectedSubcategory("all")}
              >
                Toutes les solutions
              </Badge>
              <Badge 
                variant={selectedSubcategory === "Wifi Privé" ? "default" : "outline"} 
                className="cursor-pointer hover:bg-paritel-primary"
                onClick={() => setSelectedSubcategory("Wifi Privé")}
              >
                Wifi Privé
              </Badge>
              <Badge 
                variant={selectedSubcategory === "Wifi Public" ? "default" : "outline"} 
                className="cursor-pointer hover:bg-paritel-primary"
                onClick={() => setSelectedSubcategory("Wifi Public")}
              >
                Wifi Public
              </Badge>
            </div>
          )}
          
          {selectedCategory === "cybersecurity" && (
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge 
                variant={selectedSubcategory === "all" ? "default" : "outline"} 
                className="cursor-pointer bg-paritel-primary"
                onClick={() => setSelectedSubcategory("all")}
              >
                Toutes les solutions
              </Badge>
              <Badge 
                variant={selectedSubcategory === "Advanced Adware Protection" ? "default" : "outline"} 
                className="cursor-pointer hover:bg-paritel-primary"
                onClick={() => setSelectedSubcategory("Advanced Adware Protection")}
              >
                Advanced Adware Protection
              </Badge>
              <Badge 
                variant={selectedSubcategory === "Poste de Travail / Réseau LAN" ? "default" : "outline"} 
                className="cursor-pointer hover:bg-paritel-primary"
                onClick={() => setSelectedSubcategory("Poste de Travail / Réseau LAN")}
              >
                Poste de Travail / Réseau LAN
              </Badge>
              <Badge 
                variant={selectedSubcategory === "VPN (SD-WAN/MPLS)" ? "default" : "outline"} 
                className="cursor-pointer hover:bg-paritel-primary"
                onClick={() => setSelectedSubcategory("VPN (SD-WAN/MPLS)")}
              >
                VPN (SD-WAN/MPLS)
              </Badge>
              <Badge 
                variant={selectedSubcategory === "Anti-Spam" ? "default" : "outline"} 
                className="cursor-pointer hover:bg-paritel-primary"
                onClick={() => setSelectedSubcategory("Anti-Spam")}
              >
                Anti-Spam
              </Badge>
              <Badge 
                variant={selectedSubcategory === "Web Security" ? "default" : "outline"} 
                className="cursor-pointer hover:bg-paritel-primary"
                onClick={() => setSelectedSubcategory("Web Security")}
              >
                Web Security
              </Badge>
              <Badge 
                variant={selectedSubcategory === "Infogérance" ? "default" : "outline"} 
                className="cursor-pointer hover:bg-paritel-primary"
                onClick={() => setSelectedSubcategory("Infogérance")}
              >
                Infogérance
              </Badge>
              <Badge 
                variant={selectedSubcategory === "Remote Access" ? "default" : "outline"} 
                className="cursor-pointer hover:bg-paritel-primary"
                onClick={() => setSelectedSubcategory("Remote Access")}
              >
                Remote Access
              </Badge>
              <Badge 
                variant={selectedSubcategory === "IPS" ? "default" : "outline"} 
                className="cursor-pointer hover:bg-paritel-primary"
                onClick={() => setSelectedSubcategory("IPS")}
              >
                IPS
              </Badge>
            </div>
          )}
          
          {selectedCategory === "mobility" && (
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge 
                variant={selectedSubcategory === "all" ? "default" : "outline"} 
                className="cursor-pointer bg-paritel-primary"
                onClick={() => setSelectedSubcategory("all")}
              >
                Toutes les solutions
              </Badge>
              <Badge 
                variant={selectedSubcategory === "Tout type de forfait mobile" ? "default" : "outline"} 
                className="cursor-pointer hover:bg-paritel-primary"
                onClick={() => setSelectedSubcategory("Tout type de forfait mobile")}
              >
                Forfaits mobiles
              </Badge>
              <Badge 
                variant={selectedSubcategory === "Destination d'Appels" ? "default" : "outline"} 
                className="cursor-pointer hover:bg-paritel-primary"
                onClick={() => setSelectedSubcategory("Destination d'Appels")}
              >
                Destination d'Appels
              </Badge>
              <Badge 
                variant={selectedSubcategory === "Enveloppe DATA" ? "default" : "outline"} 
                className="cursor-pointer hover:bg-paritel-primary"
                onClick={() => setSelectedSubcategory("Enveloppe DATA")}
              >
                Enveloppe DATA
              </Badge>
              <Badge 
                variant={selectedSubcategory === "Sur Mesure" ? "default" : "outline"} 
                className="cursor-pointer hover:bg-paritel-primary"
                onClick={() => setSelectedSubcategory("Sur Mesure")}
              >
                Sur Mesure
              </Badge>
            </div>
          )}
          
          {selectedCategory === "security" && (
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge 
                variant={selectedSubcategory === "all" ? "default" : "outline"} 
                className="cursor-pointer bg-paritel-primary"
                onClick={() => setSelectedSubcategory("all")}
              >
                Toutes les solutions
              </Badge>
              <Badge 
                variant={selectedSubcategory === "Télésurveillance" ? "default" : "outline"} 
                className="cursor-pointer hover:bg-paritel-primary"
                onClick={() => setSelectedSubcategory("Télésurveillance")}
              >
                Télésurveillance
              </Badge>
              <Badge 
                variant={selectedSubcategory === "Vidéosurveillance" ? "default" : "outline"} 
                className="cursor-pointer hover:bg-paritel-primary"
                onClick={() => setSelectedSubcategory("Vidéosurveillance")}
              >
                Vidéosurveillance
              </Badge>
              <Badge 
                variant={selectedSubcategory === "Monétique" ? "default" : "outline"} 
                className="cursor-pointer hover:bg-paritel-primary"
                onClick={() => setSelectedSubcategory("Monétique")}
              >
                Monétique
              </Badge>
              <Badge 
                variant={selectedSubcategory === "Paiement sécurisé" ? "default" : "outline"} 
                className="cursor-pointer hover:bg-paritel-primary"
                onClick={() => setSelectedSubcategory("Paiement sécurisé")}
              >
                Paiement sécurisé
              </Badge>
            </div>
          )}
          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="telephony" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products
                .filter((p) => p.category === "Téléphonie")
                .filter((p) => selectedSubcategory === "all" || p.subcategory === selectedSubcategory)
                .map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
            </div>
          </TabsContent>
          <TabsContent value="advanced-telephony" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products
                .filter((p) => p.category === "Téléphonie Avancée")
                .filter((p) => selectedSubcategory === "all" || p.subcategory === selectedSubcategory)
                .map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
            </div>
          </TabsContent>
          <TabsContent value="internet-network" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products
                .filter((p) => p.category === "Internet & Réseau")
                .filter((p) => selectedSubcategory === "all" || p.subcategory === selectedSubcategory)
                .map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
            </div>
          </TabsContent>
          <TabsContent value="wifi" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products
                .filter((p) => p.category === "Wifi Indoor/Outdoor")
                .filter((p) => selectedSubcategory === "all" || p.subcategory === selectedSubcategory)
                .map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
            </div>
          </TabsContent>
          <TabsContent value="cybersecurity" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products
                .filter((p) => p.category === "Cybersécurité")
                .filter((p) => selectedSubcategory === "all" || p.subcategory === selectedSubcategory)
                .map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
            </div>
          </TabsContent>
          <TabsContent value="mobility" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products
                .filter((p) => p.category === "Mobilité")
                .filter((p) => selectedSubcategory === "all" || p.subcategory === selectedSubcategory)
                .map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
            </div>
          </TabsContent>
          <TabsContent value="security" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products
                .filter((p) => p.category === "Sécurité")
                .filter((p) => selectedSubcategory === "all" || p.subcategory === selectedSubcategory)
                .map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
            </div>
          </TabsContent>
          <TabsContent value="verticals" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products
                .filter((p) => p.category === "Verticaux métiers")
                .filter((p) => selectedSubcategory === "all" || p.subcategory === selectedSubcategory)
                .map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Products;
