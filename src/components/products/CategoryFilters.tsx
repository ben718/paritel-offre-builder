
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
    <div className="mt-4 flex flex-wrap gap-1 sm:gap-2 overflow-x-auto pb-2">
      {subcategories[categoryKey].map((subcategory) => (
        <Badge 
          key={subcategory.id}
          variant={selectedSubcategory === subcategory.id ? "default" : "outline"} 
          className="cursor-pointer hover:bg-paritel-primary text-xs sm:text-sm py-1 px-2 whitespace-nowrap"
          onClick={() => setSelectedSubcategory(subcategory.id)}
        >
          {subcategory.name}
        </Badge>
      ))}
    </div>
  );
};

export const CategoryTabsList = () => {
  const isMobile = window.innerWidth < 768;

  return (
    <TabsList className="flex flex-wrap overflow-x-auto justify-start md:justify-center pb-2 max-w-full">
      <TabsTrigger value="all" className="text-xs sm:text-sm px-2 py-1 whitespace-nowrap">Tous</TabsTrigger>
      <TabsTrigger value="telephony" className="text-xs sm:text-sm px-2 py-1 whitespace-nowrap">Téléphonie</TabsTrigger>
      <TabsTrigger value="internet-network" className="text-xs sm:text-sm px-2 py-1 whitespace-nowrap">Internet THD</TabsTrigger>
      <TabsTrigger value="cybersecurity" className="text-xs sm:text-sm px-2 py-1 whitespace-nowrap">Cybersécurité</TabsTrigger>
      <TabsTrigger value="infogérance" className="text-xs sm:text-sm px-2 py-1 whitespace-nowrap">Infogérance</TabsTrigger>
      <TabsTrigger value="poste-travail" className="text-xs sm:text-sm px-2 py-1 whitespace-nowrap">Poste travail</TabsTrigger>
      <TabsTrigger value="collaborative" className="text-xs sm:text-sm px-2 py-1 whitespace-nowrap">Collaboratif</TabsTrigger>
      <TabsTrigger value="wifi" className="text-xs sm:text-sm px-2 py-1 whitespace-nowrap">Wi-Fi</TabsTrigger>
      <TabsTrigger value="tvcast" className="text-xs sm:text-sm px-2 py-1 whitespace-nowrap">TVCast</TabsTrigger>
      <TabsTrigger value="mobility" className="text-xs sm:text-sm px-2 py-1 whitespace-nowrap">Mobiles</TabsTrigger>
      <TabsTrigger value="monétique" className="text-xs sm:text-sm px-2 py-1 whitespace-nowrap">Monétique</TabsTrigger>
      <TabsTrigger value="surveillance" className="text-xs sm:text-sm px-2 py-1 whitespace-nowrap">Surveillance</TabsTrigger>
    </TabsList>
  );
};
