
import { Badge } from "@/components/ui/badge";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CategoryFiltersProps {
  selectedCategory: string;
  selectedSubcategory: string;
  setSelectedSubcategory: (subcategory: string) => void;
}

export const CategoryFilters = ({
  selectedCategory,
  selectedSubcategory,
  setSelectedSubcategory,
}: CategoryFiltersProps) => {
  
  const subcategories = {
    telephony: [
      { id: "all", name: "Toutes les solutions" },
      { id: "UCaaS", name: "UCaaS" },
      { id: "PBX On Premise", name: "PBX On Premise" },
      { id: "Cloud PBX", name: "Cloud PBX" },
      { id: "Trunk SIP", name: "Trunk SIP" },
      { id: "Number Hosting", name: "Number Hosting" },
      { id: "Telephone IP Fixe", name: "Téléphone IP Fixe" },
      { id: "Telephone IP WiFi", name: "Téléphone IP WiFi" },
      { id: "DECT Unify", name: "DECT Unify" },
      { id: "Yealink", name: "Gamme Yealink" },
    ],
    "advanced-telephony": [
      { id: "all", name: "Toutes les solutions" },
      { id: "POPC", name: "POPC (Poste Opérateur)" },
      { id: "Intégration CRM", name: "Intégration CRM" },
      { id: "Analyse de Traffic", name: "Analyse de Traffic" },
      { id: "Système Appel Malade", name: "Système Appel Malade" },
      { id: "ACD", name: "ACD" },
      { id: "SVI", name: "SVI" },
      { id: "Call Recorder", name: "Call Recorder" },
    ],
    "internet-network": [
      { id: "all", name: "Toutes les solutions" },
      { id: "Fibre optique (Actif/Passif)", name: "Fibre optique (Actif/Passif)" },
      { id: "Cuivre (xDSL)", name: "Cuivre (xDSL)" },
      { id: "4G/5G", name: "4G/5G" },
      { id: "FTTO", name: "FTTO" },
      { id: "FTTH", name: "FTTH" },
      { id: "FIBRE NOIRE", name: "FIBRE NOIRE" },
      { id: "SDSL/ADSL/VDSL", name: "SDSL/ADSL/VDSL" },
      { id: "SATELLITE", name: "SATELLITE" },
      { id: "Mikrotik", name: "Routeurs Mikrotik" },
      { id: "TP-Link 5G", name: "Routeurs 5G TP-Link" },
      { id: "TP-Link 4G", name: "Routeurs 4G TP-Link" },
      { id: "Switch", name: "Switch" },
    ],
    "wifi": [
      { id: "all", name: "Toutes les solutions" },
      { id: "Wifi Privé", name: "Wifi Privé" },
      { id: "Wifi Public", name: "Wifi Public" },
    ],
    "cybersecurity": [
      { id: "all", name: "Toutes les solutions" },
      { id: "VPN", name: "VPN" },
      { id: "Firewall", name: "Firewall" },
      { id: "Remote Access", name: "Remote Access" },
      { id: "Fortitoken", name: "Fortitoken" },
      { id: "SOCAAS", name: "SOCAAS" },
      { id: "Bitdefender", name: "Bitdefender" },
    ],
    "infogérance": [
      { id: "all", name: "Toutes les solutions" },
      { id: "Sauvegarde", name: "Sauvegarde" },
      { id: "BEEMO", name: "BEEMO" },
    ],
    "poste-travail": [
      { id: "all", name: "Toutes les solutions" },
      { id: "Supervision", name: "Supervision" },
      { id: "Configuration", name: "Configuration" },
      { id: "Maintenance", name: "Maintenance" },
      { id: "Audit", name: "Audit et conseil" },
    ],
    "collaborative": [
      { id: "all", name: "Toutes les solutions" },
      { id: "Messagerie", name: "Messagerie instantanée" },
      { id: "Vidéoconférence", name: "Vidéoconférence" },
      { id: "Appels", name: "Appels vocaux et vidéo" },
      { id: "Standard IP", name: "Standard téléphonique IP" },
    ],
    "tvcast": [
      { id: "all", name: "Toutes les solutions" },
      { id: "Player MX", name: "Player MX" },
    ],
    "mobility": [
      { id: "all", name: "Toutes les solutions" },
      { id: "Tout type de forfait mobile", name: "Forfaits mobiles" },
      { id: "Destination d'Appels", name: "Destination d'Appels" },
      { id: "Enveloppe DATA", name: "Enveloppe DATA" },
      { id: "Sur Mesure", name: "Sur Mesure" },
    ],
    "monétique": [
      { id: "all", name: "Toutes les solutions" },
      { id: "PAX A920 PRO", name: "Terminal PAX A920 PRO" },
      { id: "Transactions", name: "Transactions illimitées" },
      { id: "Cartes", name: "Multi-cartes bancaires" },
    ],
    "surveillance": [
      { id: "all", name: "Toutes les solutions" },
      { id: "Vidéosurveillance", name: "Vidéosurveillance" },
      { id: "NVR", name: "NVR TP-LINK VIGI" },
      { id: "Caméras", name: "Caméras TP-LINK VIGI" },
      { id: "Alarme", name: "Alarme" },
      { id: "Télésurveillance", name: "Télésurveillance" },
    ],
    "verticals": [
      { id: "all", name: "Toutes les solutions" },
      { id: "Hôtellerie", name: "Hôtellerie" },
      { id: "Santé", name: "Santé" },
      { id: "Education", name: "Education" },
    ],
  };

  // Only show subcategories if this category has them
  const categoryKey = selectedCategory as keyof typeof subcategories;
  const showSubcategories = Object.prototype.hasOwnProperty.call(subcategories, categoryKey);
  
  if (!showSubcategories) {
    return null;
  }

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {subcategories[categoryKey].map((subcategory) => (
        <Badge 
          key={subcategory.id}
          variant={selectedSubcategory === subcategory.id ? "default" : "outline"} 
          className="cursor-pointer hover:bg-paritel-primary"
          onClick={() => setSelectedSubcategory(subcategory.id)}
        >
          {subcategory.name}
        </Badge>
      ))}
    </div>
  );
};

export const CategoryTabsList = () => {
  return (
    <TabsList className="flex flex-wrap">
      <TabsTrigger value="all">Tous les produits</TabsTrigger>
      <TabsTrigger value="telephony">Téléphonie d'entreprise</TabsTrigger>
      <TabsTrigger value="advanced-telephony">Téléphonie Avancée</TabsTrigger>
      <TabsTrigger value="internet-network">Internet Très Haut Débit</TabsTrigger>
      <TabsTrigger value="wifi">Wi-Fi Indoor/Outdoor</TabsTrigger>
      <TabsTrigger value="cybersecurity">Cybersécurité</TabsTrigger>
      <TabsTrigger value="infogérance">Infogérance</TabsTrigger>
      <TabsTrigger value="poste-travail">Sécurisation Poste</TabsTrigger>
      <TabsTrigger value="collaborative">Solutions Collaboratives</TabsTrigger>
      <TabsTrigger value="tvcast">TVCast</TabsTrigger>
      <TabsTrigger value="mobility">Mobilité</TabsTrigger>
      <TabsTrigger value="monétique">Monétique</TabsTrigger>
      <TabsTrigger value="surveillance">Surveillance</TabsTrigger>
      <TabsTrigger value="verticals">Verticaux métiers</TabsTrigger>
    </TabsList>
  );
};
