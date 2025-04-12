
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
    pricing: "15€/utilisateur/mois",
    image: "https://placehold.co/600x400/1EAEDB/ffffff?text=UCaaS",
  },
  {
    id: 2,
    name: "PBX On Premise",
    description: "Centrale téléphonique physique installée dans vos locaux pour une maîtrise totale de votre téléphonie.",
    category: "Téléphonie d'entreprise",
    subcategory: "PBX On Premise",
    tags: ["Sur site", "Téléphonie", "Matériel"],
    pricing: "À partir de 1500€",
    image: "https://placehold.co/600x400/1EAEDB/ffffff?text=PBX",
  },
  {
    id: 3,
    name: "Cloud PBX",
    description: "Solution de téléphonie hébergée dans le cloud avec toutes les fonctionnalités d'un standard téléphonique.",
    category: "Téléphonie d'entreprise",
    subcategory: "Cloud PBX",
    tags: ["Cloud", "Téléphonie", "IPBX"],
    pricing: "12€/utilisateur/mois",
    image: "https://placehold.co/600x400/1EAEDB/ffffff?text=CloudPBX",
  },
  {
    id: 4,
    name: "Trunk SIP",
    description: "Solution pour connecter votre IPBX au réseau téléphonique public via Internet.",
    category: "Téléphonie d'entreprise",
    subcategory: "Trunk SIP",
    tags: ["VoIP", "SIP", "Interconnexion"],
    pricing: "À partir de 10€/canal/mois",
    image: "https://placehold.co/600x400/1EAEDB/ffffff?text=TrunkSIP",
  },
  {
    id: 5,
    name: "Number Hosting",
    description: "Service d'hébergement de numéros de téléphone avec redirection vers vos lignes existantes.",
    category: "Téléphonie d'entreprise",
    subcategory: "Number Hosting",
    tags: ["Numérotation", "Portabilité", "Téléphonie"],
    pricing: "2€/numéro/mois",
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
    pricing: "149€",
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
    pricing: "189€",
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
    pricing: "249€",
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
    pricing: "129€",
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
    pricing: "139€",
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
    pricing: "159€",
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
    pricing: "149€",
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
    pricing: "169€",
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
    pricing: "189€",
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
    pricing: "139€",
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
    pricing: "99€",
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
    pricing: "149€",
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
    pricing: "199€",
    image: "/lovable-uploads/adf351bb-18ce-4be5-95ab-14c760741ed4.png",
    specs: [
      "Écran tactile 5 pouces couleur",
      "Connectivité : Ethernet, Bluetooth",
      "Alimentation POE",
      "6 touches programmables",
      "Compatible module d'extension KM410 / KM710"
    ]
  },
  
  // MATÉRIEL POUR TÉLÉPHONIE
  {
    id: 19,
    name: "ATA Grandstream GXW-4216",
    description: "Passerelle SIP pour connexion d'équipements analogiques au réseau IP",
    category: "Téléphonie d'entreprise",
    subcategory: "Matériel téléphonie",
    tags: ["SIP", "Passerelle", "Analogique", "Grandstream"],
    pricing: "299€",
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
    pricing: "À partir de 1999€",
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
    pricing: "149€",
    image: "/lovable-uploads/b10fe188-c7e9-45d4-80b9-929869fcdba5.png",
    specs: [
      "Micro casque léger (91g)",
      "Bluetooth (jusqu'à 50 m)",
      "Fonction anti-bruit",
      "Autonomie : jusqu'à 35h",
      "Compatible offre Neo + et IPBX"
    ]
  },
  
  // INTERNET TRÈS HAUT DÉBIT - LIENS D'ACCÈS
  {
    id: 22,
    name: "FTTO - Fibre Optique Dédiée",
    description: "Connexion fibre optique dédiée haut de gamme pour les entreprises",
    category: "Internet Très Haut Débit",
    subcategory: "Fibre optique (Actif/Passif)",
    tags: ["Fibre", "Entreprise", "Dédiée", "GTR 4h"],
    pricing: "À partir de 399€/mois",
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
    pricing: "À partir de 89€/mois",
    image: "/lovable-uploads/06429486-c6a5-443c-b0d0-b6d07792767b.png",
    specs: [
      "Débit: jusqu'à 1 Gbit/s",
      "Déploiement: sous réserve d'éligibilité",
      "Avantages : Connexion haut débit performante, idéale pour les entreprises ayant des besoins normaux en bande passante",
      "Opérateur : Orange / Bouygues / SFR"
    ]
  },
  {
    id: 24,
    name: "FIBRE NOIRE",
    description: "Ligne fibre brute pour connexions très haut débit spécialisées",
    category: "Internet Très Haut Débit",
    subcategory: "Fibre optique (Actif/Passif)",
    tags: ["Fibre", "Entreprise", "Dédiée", "Sur-mesure"],
    pricing: "Sur devis",
    image: "/lovable-uploads/06429486-c6a5-443c-b0d0-b6d07792767b.png",
    specs: [
      "Débit: sur étude",
      "Déploiement: sous réserve d'éligibilité",
      "Avantages : Solution dédiée et privée, permettant une connectivité privée et un contrôle total du réseau",
      "Opérateur : RAS, VALLEE"
    ]
  },
  {
    id: 25,
    name: "4G / 5G",
    description: "Connexion internet mobile pour entreprises",
    category: "Internet Très Haut Débit",
    subcategory: "4G/5G",
    tags: ["4G", "5G", "Mobile", "Entreprise"],
    pricing: "À partir de 39€/mois",
    image: "/lovable-uploads/06429486-c6a5-443c-b0d0-b6d07792767b.png",
    specs: [
      "Débit: sur étude",
      "Déploiement: sous réserve d'éligibilité",
      "Avantages : Idéal pour un départ rapide tout en permettant une bonne mobilité pour les entreprises en déplacement ou un site internet sans infrastructure filaire",
      "Opérateur : Bouygues / Transatel"
    ]
  },
  {
    id: 26,
    name: "SDSL/ADSL/VDSL",
    description: "Connexion internet sur cuivre pour entreprises",
    category: "Internet Très Haut Débit",
    subcategory: "Cuivre (xDSL)",
    tags: ["SDSL", "ADSL", "VDSL", "Cuivre"],
    pricing: "À partir de 49€/mois",
    image: "/lovable-uploads/06429486-c6a5-443c-b0d0-b6d07792767b.png",
    specs: [
      "Débit: selon ligne",
      "Déploiement: sous réserve d'éligibilité",
      "Avantages : Solutions cuivre pour les entreprises en attente d'une solution fibre optique ou disposant de besoins limités",
      "Opérateur : Orange"
    ]
  },
  {
    id: 27,
    name: "SATELLITE",
    description: "Connexion internet par satellite pour zones isolées",
    category: "Internet Très Haut Débit",
    subcategory: "Satellite",
    tags: ["Satellite", "Zones isolées", "Rural"],
    pricing: "À partir de 69€/mois",
    image: "/lovable-uploads/06429486-c6a5-443c-b0d0-b6d07792767b.png",
    specs: [
      "Débit: sur étude (jusqu'à 300 Mb/s)",
      "Pour la DATA et/ou la VOIX",
      "Avantages : Connectivité pour les zones rurales ou isolées, avec une couverture quasi-totale du territoire",
      "Opérateur : StarLink"
    ]
  },
  
  // ROUTEURS ET ÉQUIPEMENTS RÉSEAU
  {
    id: 28,
    name: "Mikrotik RB5009",
    description: "Routeur professionnel Mikrotik pour entreprises",
    category: "Internet Très Haut Débit",
    subcategory: "Mikrotik",
    tags: ["Routeur", "Mikrotik", "Entreprise", "Fibre"],
    pricing: "299€",
    image: "/lovable-uploads/50219d84-db46-40d6-a231-f6926e8a2cda.png",
    specs: [
      "Routeur désormais déployé en standard sur toutes nos offres FTTx",
      "9 ports :",
      "- 1 Gigabit Internet",
      "- 1 port 2,5G",
      "- 7 ports SFP+ (jusqu'à 10G)",
      "Compatible :",
      "- lien Fibre (FTTO, FTTH, ...)",
      "- lien tiers",
      "- lien STARLINK",
      "- lien ADSL/VDSL (via modem)",
      "Gestion backup 4G/5G"
    ]
  },
  {
    id: 29,
    name: "Mikrotik HEX",
    description: "Routeur Mikrotik Multi-WAN pour réseaux polyvalents",
    category: "Internet Très Haut Débit",
    subcategory: "Mikrotik",
    tags: ["Routeur", "Mikrotik", "Multi-WAN", "Entreprise"],
    pricing: "199€",
    image: "/lovable-uploads/50219d84-db46-40d6-a231-f6926e8a2cda.png",
    specs: [
      "Routeur Multi-WAN pour réseaux polyvalents",
      "5 ports :",
      "- 4 ports Gigabit Ethernet LAN port 2,5G",
      "- 1 port Gigabit Ethernet WAN",
      "Compatible :",
      "- lien Fibre (FTTO, FTTH, ...)",
      "- lien tiers",
      "- lien STARLINK",
      "- lien ADSL/VDSL (via modem)",
      "Gestion backup 4G/5G"
    ]
  },
  {
    id: 30,
    name: "TP-Link NE210-OUTDOOR",
    description: "Routeur 5G extérieur pour connexion internet haut débit",
    category: "Internet Très Haut Débit",
    subcategory: "TP-Link 5G",
    tags: ["5G", "Extérieur", "Routeur", "TP-Link"],
    pricing: "599€",
    image: "/lovable-uploads/93a23ad5-1a60-41b8-ac5c-04f92774bd1e.png",
    specs: [
      "Routeur 5G en cours de test",
      "IP 67 : étanche et anti-poussière",
      "1 port 2,5GE",
      "LTE-Advanced Cat19 : jusqu'à 1,6 Gbps"
    ]
  },
  {
    id: 31,
    name: "TP-Link TL-MR6400",
    description: "Modem 4G LTE + routeur sans fil",
    category: "Internet Très Haut Débit",
    subcategory: "TP-Link 4G",
    tags: ["4G", "Routeur", "TP-Link", "Modem"],
    pricing: "129€",
    image: "/lovable-uploads/fef6c42a-b8d4-4d92-a425-8df9dee8653e.png",
    specs: [
      "2 en 1 : modem 4G LTE + routeur",
      "Ports : 1 WAN/LAN 10/100 Mbps, 3 LAN 10/100 Mbps",
      "2 antennes détachables",
      "Dimensions : 195 x 130 x 35 mm",
      "Alimentation : 12V/1A",
      "4G LTE : Téléchargement jusqu'à 150 Mbps",
      "Connecte jusqu'à 32 appareils"
    ]
  },
  {
    id: 32,
    name: "TP-Link TL-MR600 V2",
    description: "Modem/Routeur 4G+ et WiFi performant",
    category: "Internet Très Haut Débit",
    subcategory: "TP-Link 4G",
    tags: ["4G+", "Routeur", "TP-Link", "WiFi"],
    pricing: "179€",
    image: "/lovable-uploads/fef6c42a-b8d4-4d92-a425-8df9dee8653e.png",
    specs: [
      "Modem/Routeur 4G+ et WiFi",
      "3 ports Ethernet 10/100/1000 Mbps, 1 port WAN/LAN 10/100/1000 Mbps",
      "2 antennes 4G LTE amovibles",
      "Cryptages WEP 64/128 bits, WPA/WPA2, WPA-PSK/WPA2-PSK",
      "Connecte jusqu'à 64 appareils"
    ]
  },
  
  // SWITCHES
  {
    id: 33,
    name: "SWITCH TL-SF1005LP",
    description: "Switch 5 ports TP-Link avec PoE",
    category: "Internet Très Haut Débit",
    subcategory: "Switch",
    tags: ["Switch", "TP-Link", "5 ports", "PoE"],
    pricing: "59€",
    image: "/lovable-uploads/a3a0aa57-53de-4bf4-b949-0d1500921dbc.png",
    specs: [
      "5 ports Fast Ethernet Auto-Négociation",
      "4 ports PoE+",
      "Budget PoE : 60 W",
      "Installation sans outil",
      "Sécurité : Protection contre les intrusions de tensions"
    ]
  },
  {
    id: 34,
    name: "SWITCH TL-SG1024P",
    description: "Switch 24 ports TP-Link Gigabit avec PoE",
    category: "Internet Très Haut Débit",
    subcategory: "Switch",
    tags: ["Switch", "TP-Link", "24 ports", "Gigabit", "PoE"],
    pricing: "299€",
    image: "/lovable-uploads/a3a0aa57-53de-4bf4-b949-0d1500921dbc.png",
    specs: [
      "24 ports Gigabit PoE+, budget PoE de 250 W",
      "Boîtier métal rackable 19\" 1U",
      "Capacité de commutation 48 Gbps",
      "Table MAC de 8K",
      "Sécurité : IEEE 802.1X, ACL, protection DoS"
    ]
  },
  {
    id: 35,
    name: "SWITCH TL-SG1048P",
    description: "Switch 48 ports TP-Link Gigabit avec PoE",
    category: "Internet Très Haut Débit",
    subcategory: "Switch",
    tags: ["Switch", "TP-Link", "48 ports", "Gigabit", "PoE"],
    pricing: "699€",
    image: "/lovable-uploads/a3a0aa57-53de-4bf4-b949-0d1500921dbc.png",
    specs: [
      "48 ports Gigabit PoE+, budget PoE de 384 W",
      "Boîtier métal rackable 19\" 1U",
      "Capacité de commutation 96 Gbps",
      "Table MAC de 16K",
      "Sécurité : IEEE 802.1X, ACL, protection DoS"
    ]
  },
  {
    id: 36,
    name: "SWITCH TL-SG2210P",
    description: "Switch 8 ports administrable TP-Link avec PoE",
    category: "Internet Très Haut Débit",
    subcategory: "Switch",
    tags: ["Switch", "TP-Link", "8 ports", "Administrable", "PoE"],
    pricing: "199€",
    image: "/lovable-uploads/a3a0aa57-53de-4bf4-b949-0d1500921dbc.png",
    specs: [
      "8 ports Gigabit PoE+ (port 1-8) + 2 ports SFP",
      "Budget PoE de 53 W",
      "Interface de Gestion Web/SNMP",
      "VLAN, QoS L2-L4",
      "Sécurité : IEEE 802.1X, ACL, protection DoS"
    ]
  },
  {
    id: 37,
    name: "SWITCH TL-SG2218P",
    description: "Switch 16 ports administrable TP-Link avec PoE",
    category: "Internet Très Haut Débit",
    subcategory: "Switch",
    tags: ["Switch", "TP-Link", "16 ports", "Administrable", "PoE"],
    pricing: "329€",
    image: "/lovable-uploads/a3a0aa57-53de-4bf4-b949-0d1500921dbc.png",
    specs: [
      "16 ports Gigabit PoE+ (port 1-8) + 2 ports SFP",
      "Budget PoE de 110 W",
      "Interface de Gestion Web/SNMP",
      "VLAN, QoS L2-L4",
      "Cloud et SNMP",
      "Sécurité : IEEE 802.1X, ACL, protection DoS"
    ]
  },
  
  // FIREWALLS FORTIGATE
  {
    id: 38,
    name: "Fortigate FortiWifi 40F Series",
    description: "Firewall de nouvelle génération Fortinet avec WiFi intégré",
    category: "Cybersécurité",
    subcategory: "Firewall",
    tags: ["Firewall", "Fortinet", "UTM", "WiFi"],
    pricing: "À partir de 899€",
    image: "/lovable-uploads/b10fe188-c7e9-45d4-80b9-929869fcdba5.png",
    specs: [
      "3 WAN / 3 LAN",
      "CPU : 4 cœurs",
      "2 ports USB",
      "WiFi (2,4 et 5 GHz)",
      "NGFW (Nouvelle génération Firewall) : 645 Mbps",
      "Sécurité : VPN IPsec et SSL, Filtrage Web, Anti-virus, Protection des attaques, IPS, Application Control",
      "Performances : Jusqu'à 700 Mbps de débit avec les fonctionnalités de sécurité activées",
      "Fonctionnalités : FortiAI pour l'intelligence artificielle et le machine learning"
    ],
    partner: "Fortinet"
  },
  {
    id: 39,
    name: "Fortigate FortiWifi 60F Series",
    description: "Firewall de nouvelle génération Fortinet avec WiFi intégré",
    category: "Cybersécurité",
    subcategory: "Firewall",
    tags: ["Firewall", "Fortinet", "UTM", "WiFi"],
    pricing: "À partir de 1299€",
    image: "/lovable-uploads/b10fe188-c7e9-45d4-80b9-929869fcdba5.png",
    specs: [
      "10 ports RJ45 ports",
      "CPU : 4 cœurs",
      "2 ports USB",
      "WiFi (2,4 et 5 GHz)",
      "NGFW (Nouvelle génération Firewall) : 1 Gbps",
      "Sécurité : VPN IPsec et SSL, Filtrage Web, Anti-virus, Protection des attaques, IPS, Application Control, Sandboxing",
      "Performances : FortiASIC pour des performances optimales",
      "Fonctionnalités : FortiAI et FortiSOC pour le SOC-as-a-service"
    ],
    partner: "Fortinet"
  },
  {
    id: 40,
    name: "Fortigate FortiWifi 100F Series",
    description: "Firewall de nouvelle génération Fortinet haut de gamme avec WiFi intégré",
    category: "Cybersécurité",
    subcategory: "Firewall",
    tags: ["Firewall", "Fortinet", "UTM", "WiFi"],
    pricing: "À partir de 2499€",
    image: "/lovable-uploads/b10fe188-c7e9-45d4-80b9-929869fcdba5.png",
    specs: [
      "22 PoE RJ45 ports",
      "4 ports SFP",
      "CPU : 8 cœurs",
      "2 ports USB",
      "2 ports console RJ45/Micro-USB",
      "13 ports de commutation avec 4 PoF",
      "Stockage interne : 240 GB SSD",
      "Sécurité : Protection contre DDoS, IPS avancé, Filtrage granulaire des applications, DLP et sandboxing cloud",
      "Fonctionnalités : Déploiement Zero-Touch, SD-WAN, Automatisation et orchestration"
    ],
    partner: "Fortinet"
  },
  {
    id: 41,
    name: "Fortigate FortiWifi 200F Series",
    description: "Firewall de nouvelle génération Fortinet très haut de gamme avec WiFi intégré",
    category: "Cybersécurité",
    subcategory: "Firewall",
    tags: ["Firewall", "Fortinet", "UTM", "WiFi"],
    pricing: "À partir de 4999€",
    image: "/lovable-uploads/b10fe188-c7e9-45d4-80b9-929869fcdba5.png",
    specs: [
      "4 ports GE RJ45",
      "4 ports GE SFP Slots",
      "2 ports 10GE SFP+ Slots",
      "1 console/ 4 USB ports",
      "Stockage interne : 480 GB SSD",
      "Interfaces multiples : HA, management, DMZ dédiée",
      "Performances : Prend en charge jusqu'à 15 Gbps de débit du Firewall et les applications les plus exigeantes",
      "Fonctionnalités : VPN de haute capacité pour le télétravail, Intégration avec la plateforme Security Fabric, SD-WAN avancé, ZTNA"
    ],
    partner: "Fortinet"
  },
  
  // BITDEFENDER
  {
    id: 42,
    name: "Bitdefender GravityZone Business Security",
    description: "Solution complète de sécurité et antivirus pour entreprises",
    category: "Cybersécurité",
    subcategory: "Advanced Adware Protection",
    tags: ["Antivirus", "Sécurité", "Endpoint", "EDR"],
    pricing: "À partir de 5€/poste/mois",
    image: "/lovable-uploads/e09f787c-762d-4a5d-88c4-1dbfbe9e0c13.png",
    specs: [
      "Protection contre les malwares, les ransomwares et les menaces persistantes avancées (APT)",
      "Protection de la vie privée : prévention contre le vol de données et sécurité des connexions WiFi",
      "Protection des transactions financières : sécurité pour les opérations bancaires en ligne",
      "Protection multi-couches : plusieurs technologies de détection avancées",
      "Protection du microprogramme : analyse et prévention des attaques au niveau du BIOS/UEFI",
      "Pare-feu : bloque les tentatives d'intrusion et filtre le trafic réseau",
      "Analyse comportementale : détection des menaces inconnues grâce à l'analyse du comportement",
      "Antiphishing : blocage des sites de phishing et des tentatives d'escroquerie",
      "Protection multi-appareil : protection complète sur tous vos terminaux Windows, macOS, iOS et Android"
    ],
    partner: "Bitdefender"
  },
  
  // BEEMO
  {
    id: 43,
    name: "BEEMO Sauvegarde",
    description: "Solution de sauvegarde professionnelle conforme RGPD",
    category: "Infogérance",
    subcategory: "Sauvegarde",
    tags: ["Sauvegarde", "RGPD", "Backup", "Sécurité"],
    pricing: "À partir de 15€/mois",
    image: "/lovable-uploads/b10fe188-c7e9-45d4-80b9-929869fcdba5.png",
    specs: [
      "Beemo Technologies reprend le réseau de l'utilisateur",
      "Un logiciel pour collecter, vérifier (hors virus), compresser, crypter et transférer les données vers les serveurs du Datacenter",
      "Un service d'externalisation du stockage dans un environnement sécurisé",
      "Parmi nos offres disponibles :",
      "BeemoBackup HDS : sauvegarde locale + déporté conformité HDS",
      "BeemoCloud HDS : espace locale + déporté Beemo confié HDS",
      "Objectifs : stockage exclusivement dans le datacenter Paritel"
    ],
    partner: "BEEMO"
  },
  
  // WIFI SOLUTIONS
  {
    id: 44,
    name: "WiFi Privé Entreprise",
    description: "Solution WiFi professionnelle sécurisée pour entreprises",
    category: "Wifi Indoor/Outdoor",
    subcategory: "Wifi Privé",
    tags: ["WiFi", "Entreprise", "Sécurisé", "Réseau privé"],
    pricing: "À partir de 45€/mois",
    image: "https://placehold.co/600x400/3B82F6/ffffff?text=WifiPrivé",
    specs: [
      "Solution complète de WiFi d'entreprise",
      "Points d'accès professionnels intérieurs et extérieurs",
      "Contrôleur WiFi centralisé",
      "Sécurité avancée (WPA3, authentification 802.1X)",
      "Support VLANs et QoS",
      "Gestion centralisée et supervision 24/7"
    ],
    partner: "Cambium Networks"
  },
  {
    id: 45,
    name: "WiFi Public Hotspot",
    description: "Solution WiFi pour zones publiques conforme RGPD",
    category: "Wifi Indoor/Outdoor",
    subcategory: "Wifi Public",
    tags: ["WiFi", "Public", "Hotspot", "RGPD"],
    pricing: "À partir de 59€/mois",
    image: "https://placehold.co/600x400/3B82F6/ffffff?text=WifiPublic",
    specs: [
      "Solution complète pour zones publiques (hôtels, restaurants, boutiques)",
      "Portail captif personnalisable",
      "Login via réseaux sociaux ou formulaire",
      "Conformité RGPD et légale",
      "Collecte de données marketing",
      "Statistiques d'utilisation"
    ],
    partner: "Cambium Networks"
  },
  
  // TVCAST
  {
    id: 46,
    name: "Player MX pour affichage dynamique",
    description: "Solution d'affichage dynamique sur écrans et téléviseurs",
    category: "TVCast Téléviseur connecté",
    subcategory: "Player MX",
    tags: ["Digital Signage", "Affichage", "TV", "HDMI"],
    pricing: "À partir de 25€/mois",
    image: "/lovable-uploads/93fb5d88-5eee-4eb7-91b9-ff711f16376e.png",
    specs: [
      "Player HDMI",
      "Connectivité WiFi / Ethernet",
      "Pilotage via interface cloud MX"
    ]
  },
  
  // MOBILITÉ
  {
    id: 47,
    name: "Forfaits Mobiles Professionnels",
    description: "Gamme de forfaits mobiles adaptés aux besoins professionnels",
    category: "Mobiles",
    subcategory: "Tout type de forfait mobile",
    tags: ["Mobile", "4G", "5G", "Forfait"],
    pricing: "À partir de 9,90€/mois",
    image: "https://placehold.co/600x400/4338ca/ffffff?text=Mobile",
    specs: [
      "Appels/SMS/MMS illimités",
      "Data 4G/5G selon forfait",
      "Options internationales",
      "Gestion de flotte centralisée",
      "Facturation unique"
    ]
  },
  {
    id: 48,
    name: "Enveloppe DATA Partagée",
    description: "Solution de partage de data mobile entre collaborateurs",
    category: "Mobiles",
    subcategory: "Enveloppe DATA",
    tags: ["DATA", "Mobile", "Mutualisé", "Entreprise"],
    pricing: "À partir de 15€/mois",
    image: "https://placehold.co/600x400/4338ca/ffffff?text=EnveloppeDATA",
    specs: [
      "Data partagée entre tous les collaborateurs",
      "Volume ajustable selon besoins",
      "Compatible 4G/5G",
      "Dashboard de suivi des consommations",
      "Alertes de dépassement personnalisables"
    ]
  },
  
  // MONÉTIQUE
  {
    id: 49,
    name: "PAX A920 PRO",
    description: "Terminal de paiement Android mobile et autonome",
    category: "Monétique",
    subcategory: "PAX A920 PRO",
    tags: ["TPE", "Paiement", "Sans contact", "Mobile"],
    pricing: "À partir de 19€/mois",
    image: "/lovable-uploads/e09f787c-762d-4a5d-88c4-1dbfbe9e0c13.png",
    specs: [
      "Terminal de paiement Android :",
      "Connectivité : Bluetooth, Wifi, 4G, NFC",
      "Écran tactile 5,5 pouces",
      "Imprimante thermique",
      "Batterie 5150mAH (grande capacité)",
      "Compatible monétique autonome et centralisée"
    ]
  },
  
  // SURVEILLANCE
  {
    id: 50,
    name: "NVR TP-LINK VIGI NVR1008H-8P",
    description: "Enregistreur vidéo réseau pour système de vidéosurveillance",
    category: "Surveillance",
    subcategory: "NVR",
    tags: ["Vidéosurveillance", "NVR", "TP-Link", "Sécurité"],
    pricing: "499€",
    image: "/lovable-uploads/9fcb55f3-bcc8-411d-9076-3fd27ae4437c.png",
    specs: [
      "Enregistreur vidéo réseau PoE+ 8 canaux",
      "Sortie vidéo HDMI 4K et capacité de décodage de 16 MP",
      "Lecture simultanée sur 8 canaux",
      "Compression H265+",
      "Compatibilité ONVIF",
      "Enregistrement continu 24h/24 et 7j/7 : stocke jusqu'à 10 To",
      "Audio bidirectionnel",
      "Détection et surveillance intelligente (IA)",
      "Surveillance à distance via l'application VIGI"
    ],
    partner: "TP-Link"
  },
  
  // CAMÉRAS TP-LINK VIGI
  {
    id: 51,
    name: "Caméra tourelle C455",
    description: "Caméra de vidéosurveillance type tourelle TP-Link VIGI",
    category: "Surveillance",
    subcategory: "Caméras",
    tags: ["Vidéosurveillance", "Caméra", "TP-Link", "Tourelle"],
    pricing: "169€",
    image: "/lovable-uploads/9fcb55f3-bcc8-411d-9076-3fd27ae4437c.png",
    specs: [
      "Définition : 5 MP",
      "IP67",
      "Analyse des personnes et des véhicules",
      "Classification des humains et des véhicules",
      "Détection intelligente",
      "Amélioration vidéo",
      "Communication et audio bidirectionnel"
    ],
    partner: "TP-Link"
  },
  {
    id: 52,
    name: "Caméra Bullet C385",
    description: "Caméra de vidéosurveillance type bullet TP-Link VIGI",
    category: "Surveillance",
    subcategory: "Caméras",
    tags: ["Vidéosurveillance", "Caméra", "TP-Link", "Bullet"],
    pricing: "189€",
    image: "/lovable-uploads/9fcb55f3-bcc8-411d-9076-3fd27ae4437c.png",
    specs: [
      "Définition : 4K (8 MP)",
      "IP67",
      "Identification des humains et des véhicules",
      "Détection intelligente",
      "Amélioration vidéo",
      "Défense active et audio bidirectionnel"
    ],
    partner: "TP-Link"
  },
  {
    id: 53,
    name: "Caméra Dôme C240",
    description: "Caméra de vidéosurveillance type dôme TP-Link VIGI",
    category: "Surveillance",
    subcategory: "Caméras",
    tags: ["Vidéosurveillance", "Caméra", "TP-Link", "Dôme"],
    pricing: "139€",
    image: "/lovable-uploads/9fcb55f3-bcc8-411d-9076-3fd27ae4437c.png",
    specs: [
      "Définition : 4 MP",
      "IP67 et IK10 (anti-vandalisme)",
      "Identification des humains et des véhicules",
      "Détection intelligente",
      "Amélioration vidéo",
      "Communication et audio bidirectionnel"
    ],
    partner: "TP-Link"
  },
  {
    id: 54,
    name: "Caméra Pan Tilt C540S",
    description: "Caméra motorisée de vidéosurveillance TP-Link VIGI",
    category: "Surveillance",
    subcategory: "Caméras",
    tags: ["Vidéosurveillance", "Caméra", "TP-Link", "Motorisée"],
    pricing: "219€",
    image: "/lovable-uploads/9fcb55f3-bcc8-411d-9076-3fd27ae4437c.png",
    specs: [
      "Définition : 4 MP",
      "IP65",
      "Portée infrarouge ultra-longue",
      "Surveillance 360°",
      "Classification des humains et des véhicules",
      "Détection intelligente",
      "Amélioration vidéo",
      "Défense active et audio bidirectionnel"
    ],
    partner: "TP-Link"
  },
  
  // SOLUTIONS VERTICALES
  {
    id: 55,
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
    id: 56,
    name: "Support IT Niveau 1",
    description: "Service de support informatique de premier niveau avec hotline dédiée 7/7.",
    category: "Services managés",
    tags: ["Support", "Service", "Maintenance"],
    pricing: "49€/utilisateur/mois",
    image: "https://placehold.co/600x400/64748B/ffffff?text=Support",
  },
];
