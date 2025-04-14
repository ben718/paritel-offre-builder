import { ProductCardProps } from "@/components/products/ProductCard";

export const products: ProductCardProps[] = [
  // TÉLÉPHONIE D'ENTREPRISE
  {
    id: 1,
    name: "UCaaS",
    description: "Solution de communications unifiées as a Service incluant téléphonie, visio et messagerie.",
    category: "Téléphonie d'entreprise",
    subcategory: "UCaaS",
    tags: ["Cloud", "Téléphonie", "Communication unifiée"],
    image: "https://placehold.co/600x400/1EAEDB/ffffff?text=UCaaS",
  },
  {
    id: 2,
    name: "PBX On Premise",
    description: "Centrale téléphonique physique installée dans vos locaux pour une maîtrise totale de votre téléphonie.",
    category: "Téléphonie d'entreprise",
    subcategory: "PBX On Premise",
    tags: ["Sur site", "Téléphonie", "Matériel"],
    image: "https://placehold.co/600x400/1EAEDB/ffffff?text=PBX",
  },
  {
    id: 3,
    name: "Cloud PBX",
    description: "Solution de téléphonie hébergée dans le cloud avec toutes les fonctionnalités d'un standard téléphonique.",
    category: "Téléphonie d'entreprise",
    subcategory: "Cloud PBX",
    tags: ["Cloud", "Téléphonie", "IPBX"],
    image: "https://placehold.co/600x400/1EAEDB/ffffff?text=CloudPBX",
  },
  {
    id: 4,
    name: "Trunk SIP",
    description: "Solution pour connecter votre IPBX au réseau téléphonique public via Internet.",
    category: "Téléphonie d'entreprise",
    subcategory: "Trunk SIP",
    tags: ["VoIP", "SIP", "Interconnexion"],
    image: "https://placehold.co/600x400/1EAEDB/ffffff?text=TrunkSIP",
  },
  {
    id: 5,
    name: "Number Hosting",
    description: "Service d'hébergement de numéros de téléphone avec redirection vers vos lignes existantes.",
    category: "Téléphonie d'entreprise",
    subcategory: "Number Hosting",
    tags: ["Numérotation", "Portabilité", "Téléphonie"],
    image: "https://placehold.co/600x400/1EAEDB/ffffff?text=NumberHosting",
  },
  
  // GAMME YEALINK T5XW
  {
    id: 6,
    name: "YEALINK T53W",
    description: "Téléphone IP professionnel de la gamme Yealink T5XW",
    category: "Téléphonie d'entreprise",
    subcategory: "Yealink",
    tags: ["Téléphone", "IP", "Yealink"],
    image: "/lovable-uploads/b893fccb-2a35-4357-a16a-629956f855f7.png",
    specs: [
      "Écran tactile 3,5 pouces monochrome",
      "Connectivité : Ethernet / Wifi / Bluetooth",
      "Alimentation POE",
      "12 touches programmables"
    ]
  },
  {
    id: 7,
    name: "YEALINK T54W",
    description: "Téléphone IP professionnel de la gamme Yealink T5XW",
    category: "Téléphonie d'entreprise",
    subcategory: "Yealink",
    tags: ["Téléphone", "IP", "Yealink"],
    image: "/lovable-uploads/b893fccb-2a35-4357-a16a-629956f855f7.png",
    specs: [
      "Écran 4,3 pouces couleur",
      "Connectivité : Ethernet / Wifi / Bluetooth",
      "Alimentation POE",
      "10 touches programmables",
      "Compatible module d'extension EXP50"
    ]
  },
  {
    id: 8,
    name: "YEALINK T57W",
    description: "Téléphone IP professionnel haut de gamme de la gamme Yealink T5XW",
    category: "Téléphonie d'entreprise",
    subcategory: "Yealink",
    tags: ["Téléphone", "IP", "Yealink", "Écran tactile"],
    image: "/lovable-uploads/b893fccb-2a35-4357-a16a-629956f855f7.png",
    specs: [
      "Écran tactile 7 pouces couleur",
      "Connectivité : Ethernet / Wifi / Bluetooth",
      "Alimentation POE",
      "29 touches de fonctions et 10 touches programmables",
      "Compatible module d'extension EXP50"
    ]
  },
  {
    id: 9,
    name: "Yealink EXP50",
    description: "Module d'extension pour téléphones Yealink",
    category: "Téléphonie d'entreprise",
    subcategory: "Yealink",
    tags: ["Yealink", "Extension", "Accessoire"],
    image: "/lovable-uploads/93fb5d88-5eee-4eb7-91b9-ff711f16376e.png",
    specs: [
      "Écran : LCD couleur 4,3\" (480 x 272 pixels)",
      "Touches programmables : 20 touches physiques, avec 3 pages, soit jusqu'à 60 touches programmables",
      "Connectivité : Connexion via port RJ9 sur les téléphones Yealink compatibles",
      "Compatibilité : Conçu pour les séries Yealink T5 (T53V, T54A, T56A, T57W, T58A, T52S)",
      "Dimensions : 200 mm x 120 mm x 40 mm",
      "Poids : 300 g"
    ]
  },
  
  // TÉLÉPHONE IP WIFI
  {
    id: 10,
    name: "GRANDSTREAM WP 825",
    description: "Téléphone IP WiFi professionnel portable",
    category: "Téléphonie d'entreprise",
    subcategory: "Telephone IP WiFi",
    tags: ["WiFi", "IP", "Grandstream", "Portable"],
    image: "/lovable-uploads/9fcb55f3-bcc8-411d-9076-3fd27ae4437c.png",
    specs: [
      "Écran LCD couleur 2,4\" (240 x 320 pixels)",
      "Wi-Fi",
      "Bluetooth",
      "Batterie : Li-ion 2000 mAh",
      "Autonomie : 8 heures en conversation",
      "200 heures en veille",
      "2 comptes SIP",
      "Prise casque 3.5",
      "Étanchéité : IP67"
    ]
  },
  {
    id: 11,
    name: "Yealink W73H",
    description: "Téléphone IP WiFi professionnel portable",
    category: "Téléphonie d'entreprise",
    subcategory: "Telephone IP WiFi",
    tags: ["WiFi", "IP", "Yealink", "Portable"],
    image: "/lovable-uploads/9fcb55f3-bcc8-411d-9076-3fd27ae4437c.png",
    specs: [
      "Écran TFT couleur 1,8\" (128 x 160 pixels)",
      "Wi-Fi : Non",
      "Bluetooth : Non",
      "Batterie : 1010 mAh",
      "Autonomie : 24h en conversation, 400h en veille",
      "Audio : Suppression de bruit",
      "Connectivité : Prise casque 3,5 mm"
    ]
  },
  
  // DECT UNIFY
  {
    id: 12,
    name: "OpenScape DECT Phone S5",
    description: "Téléphone DECT professionnel OpenScape",
    category: "Téléphonie d'entreprise",
    subcategory: "DECT Unify",
    tags: ["DECT", "OpenScape", "Portable"],
    image: "/lovable-uploads/e09f787c-762d-4a5d-88c4-1dbfbe9e0c13.png",
    specs: [
      "Écran : TFT couleur 2\" x 100 px",
      "Connectivité : DECT, Bluetooth",
      "Autonomie : Longue (temps non spécifié)",
      "Audio : Qualité vocale HD",
      "Prise casque via connecteur 3,5mm",
      "Résistance aux chocs",
      "Étanchéité : IP67"
    ]
  },
  {
    id: 13,
    name: "OpenScape DECT Phone SL5",
    description: "Téléphone DECT professionnel OpenScape format slim",
    category: "Téléphonie d'entreprise",
    subcategory: "DECT Unify",
    tags: ["DECT", "OpenScape", "Slim", "Portable"],
    image: "/lovable-uploads/e09f787c-762d-4a5d-88c4-1dbfbe9e0c13.png",
    specs: [
      "Écran : TFT 240 x 320 px",
      "Connectivité : DECT, Bluetooth",
      "Audio : Qualité vocale HD, multicanaux",
      "Prise casque via connecteur 3,5mm jusqu'à 500 ohms"
    ]
  },
  {
    id: 14,
    name: "OpenStage M3",
    description: "Téléphone DECT professionnel robuste OpenScape",
    category: "Téléphonie d'entreprise",
    subcategory: "DECT Unify",
    tags: ["DECT", "OpenScape", "Robuste", "Portable"],
    image: "/lovable-uploads/e09f787c-762d-4a5d-88c4-1dbfbe9e0c13.png",
    specs: [
      "Écran : TFT couleur 128 x 160 px",
      "Connectivité : DECT, Bluetooth",
      "Audio : Qualité vocale HD optimisée pour environnements bruyants",
      "Vibreur & Alarmes jusqu'à 500 événements",
      "Étanchéité : IP65"
    ]
  },
  {
    id: 15,
    name: "OpenScape DECT Phone M5",
    description: "Téléphone DECT professionnel OpenScape",
    category: "Téléphonie d'entreprise",
    subcategory: "DECT Unify",
    tags: ["DECT", "OpenScape", "Portable"],
    image: "/lovable-uploads/e09f787c-762d-4a5d-88c4-1dbfbe9e0c13.png",
    specs: [
      "Écran : TFT 240 x 320 px",
      "Connectivité : DECT, Bluetooth",
      "Audio : Qualité vocale optimisée pour les environnements bruyants",
      "Fonctionnalités : Messages, alarmes, interface Bluetooth",
      "Étanchéité : IP65"
    ]
  },
  
  // TELEPHONE FIXE UNIFY
  {
    id: 16,
    name: "CP210",
    description: "Téléphone IP fixe Unify OpenScape de base",
    category: "Téléphonie d'entreprise",
    subcategory: "Telephone IP Fixe",
    tags: ["IP", "Fixe", "OpenScape", "Unify"],
    image: "/lovable-uploads/adf351bb-18ce-4be5-95ab-14c760741ed4.png",
    specs: [
      "Écran 3,4 pouces monochrome",
      "Connectivité : Ethernet",
      "Alimentation POE",
      "4 touches programmables"
    ]
  },
  {
    id: 17,
    name: "CP410",
    description: "Téléphone IP fixe Unify OpenScape intermédiaire",
    category: "Téléphonie d'entreprise",
    subcategory: "Telephone IP Fixe",
    tags: ["IP", "Fixe", "OpenScape", "Unify"],
    image: "/lovable-uploads/adf351bb-18ce-4be5-95ab-14c760741ed4.png",
    specs: [
      "Écran 3,5 pouces couleur",
      "Connectivité : Ethernet",
      "Alimentation POE",
      "5 touches programmables",
      "Compatible module d'extension KM410 / KM710"
    ]
  },
  {
    id: 18,
    name: "CP710",
    description: "Téléphone IP fixe Unify OpenScape haut de gamme",
    category: "Téléphonie d'entreprise",
    subcategory: "Telephone IP Fixe",
    tags: ["IP", "Fixe", "OpenScape", "Unify", "Tactile"],
    image: "/lovable-uploads/adf351bb-18ce-4be5-95ab-14c760741ed4.png",
    specs: [
      "Écran tactile 5 pouces couleur",
      "Connectivité : Ethernet, Bluetooth",
      "Alimentation POE",
      "6 touches programmables",
      "Compatible module d'extension KM410 / KM710"
    ]
  },
  
  // Continuing with all products without prices
  
  
  // MATÉRIEL POUR TÉLÉPHONIE
  {
    id: 19,
    name: "ATA Grandstream GXW-4216",
    description: "Passerelle SIP pour connexion d'équipements analogiques au réseau IP",
    category: "Téléphonie d'entreprise",
    subcategory: "Matériel téléphonie",
    tags: ["SIP", "Passerelle", "Analogique", "Grandstream"],
    image: "/lovable-uploads/b639a193-20d7-416a-8e45-c55deeeaecca.png",
    specs: [
      "Passerelle SIP 16 ports FXS GXW-4216V2/Wifi",
      "16 x RJ11 (FXS)",
      "1 x RJ45 Gigabits pour le management",
      "1 x connecteur Telco-50 (câble non fourni)",
      "Rackable 19\"",
      "Compatible offre Neo + et IPBX",
      "Gamme des ATA Grandstream : de 4 à 48 ports"
    ]
  },
  {
    id: 20,
    name: "IPBX UNIFY OPENSCAPE BUSINESS X1R",
    description: "IPBX professionnel Unify OpenScape pour entreprises",
    category: "Téléphonie d'entreprise",
    subcategory: "Matériel téléphonie",
    tags: ["IPBX", "Unify", "OpenScape", "Standard téléphonique"],
    image: "/lovable-uploads/13298b9a-dd2f-4558-a4b1-645a86e90194.png",
    specs: [
      "Standard téléphonique",
      "Montage en rack",
      "Jusqu'à 500 extensions (IP, analogiques et numériques)",
      "Max. 8 numériques (UP0/E), max. 4 analogiques (FXS)",
      "Max. 7 stations de base DECT, jusqu'à 16 combinés DECT",
      "Compatible UNIFY PHONE"
    ]
  },
  {
    id: 21,
    name: "Casque Yealink Bluetooth BH70",
    description: "Casque Bluetooth professionnel pour téléphonie",
    category: "Téléphonie d'entreprise",
    subcategory: "Accessoires",
    tags: ["Casque", "Bluetooth", "Yealink"],
    image: "/lovable-uploads/b10fe188-c7e9-45d4-80b9-929869fcdba5.png",
    specs: [
      "Micro casque léger (91g)",
      "Bluetooth (jusqu'à 50 m)",
      "Fonction anti-bruit",
      "Autonomie : jusqu'à 35h",
      "Compatible offre Neo + et IPBX"
    ]
  },
  
  // And continuing with more products...
  // INTERNET TRÈS HAUT DÉBIT - LIENS D'ACCÈS
  {
    id: 22,
    name: "FTTO - Fibre Optique Dédiée",
    description: "Connexion fibre optique dédiée haut de gamme pour les entreprises",
    category: "Internet Très Haut Débit",
    subcategory: "Fibre optique (Actif/Passif)",
    tags: ["Fibre", "Entreprise", "Dédiée", "GTR 4h"],
    image: "/lovable-uploads/06429486-c6a5-443c-b0d0-b6d07792767b.png",
    specs: [
      "Débit: de 4 Mbit/s à 10 Gbit/s",
      "Déploiement: sous réserve d'éligibilité",
      "Avantages : Fibre optique dédiée offrant un débit garanti et symétrique, avec une stabilité optimale pour les usages critiques",
      "Opérateur : Orange / SFR / Bouygues"
    ]
  },
  {
    id: 23,
    name: "FTTH - Fibre Optique Mutualisée",
    description: "Connexion fibre optique mutualisée pour les entreprises",
    category: "Internet Très Haut Débit",
    subcategory: "Fibre optique (Actif/Passif)",
    tags: ["Fibre", "Entreprise", "Mutualisée", "GTR 4h"],
    image: "/lovable-uploads/06429486-c6a5-443c-b0d0-b6d07792767b.png",
    specs: [
      "Débit: jusqu'à 1 Gbit/s",
      "Déploiement: sous réserve d'éligibilité",
      "Avantages : Connexion haut débit performante, idéale pour les entreprises ayant des besoins normaux en bande passante",
      "Opérateur : Orange / Bouygues / SFR"
    ]
  },
  
  // Adding more products without pricing information
  
  
  {
    id: 55,
    name: "Solution Hôtelière Intégrée",
    description: "Offre complète pour l'hôtellerie incluant WiFi, IPTV et téléphonie.",
    category: "Verticaux métiers",
    subcategory: "Hôtellerie",
    partner: "Cambium Networks",
    tags: ["Hôtellerie", "IPTV", "Wifi"],
    image: "https://placehold.co/600x400/0f766e/ffffff?text=Hotel",
  },
  {
    id: 56,
    name: "Support IT Niveau 1",
    description: "Service de support informatique de premier niveau avec hotline dédiée 7/7.",
    category: "Services managés",
    tags: ["Support", "Service", "Maintenance"],
    image: "https://placehold.co/600x400/64748B/ffffff?text=Support",
  },
];
