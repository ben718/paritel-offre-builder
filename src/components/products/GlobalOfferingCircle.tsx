
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { 
  Phone, 
  Wifi, 
  Lock, 
  Database, 
  MonitorSmartphone, 
  Tv, 
  CreditCard, 
  Camera, 
  Smartphone, 
  Headphones, 
  Globe, 
  Briefcase 
} from "lucide-react";

type CategoryInfo = {
  name: string;
  icon: React.ReactNode;
  color: string;
  content: React.ReactNode;
};

export const GlobalOfferingCircle = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories: CategoryInfo[] = [
    {
      name: "Téléphonie d'entreprise",
      icon: <Phone className="h-6 w-6 text-white" />,
      color: "#1EAEDB",
      content: (
        <div className="bg-[#102043] p-4 rounded-md text-white">
          <h3 className="text-xl font-bold mb-3 text-[#1EAEDB]">Téléphonie d'entreprise</h3>
          <ul className="space-y-2">
            <li>- UCaaS</li>
            <li>- PBX On Premise</li>
            <li>- Cloud PBX</li>
            <li>- Trunk SIP</li>
            <li>- Number Hosting</li>
            <li>- Téléphones IP Fixes et WiFi</li>
          </ul>
        </div>
      )
    },
    {
      name: "Téléphonie Avancée",
      icon: <Headphones className="h-6 w-6 text-white" />,
      color: "#33C3F0",
      content: (
        <div className="bg-[#102043] p-4 rounded-md text-white">
          <h3 className="text-xl font-bold mb-3 text-[#33C3F0]">Téléphonie Avancée</h3>
          <ul className="space-y-2">
            <li>- POPC (Poste Opérateur)</li>
            <li>- Intégration CRM</li>
            <li>- Analyse de Traffic</li>
            <li>- Système Appel Malade</li>
            <li>- ACD, SVI</li>
            <li>- Call Recorder</li>
          </ul>
        </div>
      )
    },
    {
      name: "Internet Très Haut Débit",
      icon: <Globe className="h-6 w-6 text-white" />,
      color: "#1EAEDB",
      content: (
        <div className="bg-[#102043] p-4 rounded-md text-white">
          <h3 className="text-xl font-bold mb-3 text-[#1EAEDB]">Internet Très Haut Débit</h3>
          <ul className="space-y-2">
            <li>- Fibre optique (FTTO, FTTH)</li>
            <li>- Fibre Noire</li>
            <li>- Cuivre (SDSL/ADSL/VDSL)</li>
            <li>- 4G/5G</li>
            <li>- Satellite</li>
            <li>- Routeurs et Switches</li>
          </ul>
        </div>
      )
    },
    {
      name: "Wi-Fi Indoor/Outdoor",
      icon: <Wifi className="h-6 w-6 text-white" />,
      color: "#33C3F0",
      content: (
        <div className="bg-[#102043] p-4 rounded-md text-white">
          <h3 className="text-xl font-bold mb-3 text-[#33C3F0]">Wi-Fi Indoor/Outdoor</h3>
          <ul className="space-y-2">
            <li>- Wifi Privé</li>
            <li>- Wifi Public</li>
            <li>- Solutions Indoor et Outdoor</li>
            <li>- Conformité RGPD</li>
          </ul>
        </div>
      )
    },
    {
      name: "Cybersécurité",
      icon: <Lock className="h-6 w-6 text-white" />,
      color: "#1EAEDB",
      content: (
        <div className="bg-[#102043] p-4 rounded-md text-white">
          <h3 className="text-xl font-bold mb-3 text-[#1EAEDB]">Cybersécurité</h3>
          <ul className="space-y-2">
            <li>- VPN</li>
            <li>- Firewall</li>
            <li>- Remote Access</li>
            <li>- Fortitoken</li>
            <li>- SOCAAS</li>
            <li>- Bitdefender</li>
          </ul>
        </div>
      )
    },
    {
      name: "Infogérance",
      icon: <Database className="h-6 w-6 text-white" />,
      color: "#33C3F0",
      content: (
        <div className="bg-[#102043] p-4 rounded-md text-white">
          <h3 className="text-xl font-bold mb-3 text-[#33C3F0]">Infogérance</h3>
          <ul className="space-y-2">
            <li>- Sauvegarde PC et serveurs</li>
            <li>- 3 copies, 2 supports différents, 1 sauvegarde hors site</li>
            <li>- Sauvegarde chiffrée full ou incrémentielle</li>
            <li>- BEEMO</li>
          </ul>
        </div>
      )
    },
    {
      name: "Sécurisation Poste",
      icon: <MonitorSmartphone className="h-6 w-6 text-white" />,
      color: "#1EAEDB",
      content: (
        <div className="bg-[#102043] p-4 rounded-md text-white">
          <h3 className="text-xl font-bold mb-3 text-[#1EAEDB]">Sécurisation du poste de travail</h3>
          <ul className="space-y-2">
            <li>- Supervision</li>
            <li>- Configuration des postes de travail</li>
            <li>- Maintenance (réparation ou remplacement)</li>
            <li>- Audit et conseil</li>
          </ul>
        </div>
      )
    },
    {
      name: "Solutions Collaboratives",
      icon: <Tv className="h-6 w-6 text-white" />,
      color: "#33C3F0",
      content: (
        <div className="bg-[#102043] p-4 rounded-md text-white">
          <h3 className="text-xl font-bold mb-3 text-[#33C3F0]">Solutions Collaboratives</h3>
          <ul className="space-y-2">
            <li>- Messagerie instantanée sécurisée</li>
            <li>- Vidéoconférence haute définition</li>
            <li>- Appels vocaux et vidéo sur tous vos terminaux</li>
            <li>- Standard téléphonique IP</li>
          </ul>
        </div>
      )
    },
    {
      name: "TVCast",
      icon: <Tv className="h-6 w-6 text-white" />,
      color: "#1EAEDB",
      content: (
        <div className="bg-[#102043] p-4 rounded-md text-white">
          <h3 className="text-xl font-bold mb-3 text-[#1EAEDB]">TVCast Téléviseur connecté</h3>
          <ul className="space-y-2">
            <li>- Player MX</li>
            <li>- Contrôle de téléviseur</li>
            <li>- Accès aux services de streaming</li>
          </ul>
        </div>
      )
    },
    {
      name: "Mobilité",
      icon: <Smartphone className="h-6 w-6 text-white" />,
      color: "#33C3F0",
      content: (
        <div className="bg-[#102043] p-4 rounded-md text-white">
          <h3 className="text-xl font-bold mb-3 text-[#33C3F0]">Mobilité</h3>
          <ul className="space-y-2">
            <li>- Forfaits mobiles</li>
            <li>- Destination d'Appels</li>
            <li>- Enveloppe DATA</li>
            <li>- Solutions Sur Mesure</li>
          </ul>
        </div>
      )
    },
    {
      name: "Monétique",
      icon: <CreditCard className="h-6 w-6 text-white" />,
      color: "#1EAEDB",
      content: (
        <div className="bg-[#102043] p-4 rounded-md text-white">
          <h3 className="text-xl font-bold mb-3 text-[#1EAEDB]">Monétique</h3>
          <ul className="space-y-2">
            <li>- Terminal PAX A920 PRO</li>
            <li>- Transactions illimitées</li>
            <li>- Multi-cartes bancaires (Carte Bleue, Visa, Mastercard, etc.)</li>
          </ul>
        </div>
      )
    },
    {
      name: "Surveillance",
      icon: <Camera className="h-6 w-6 text-white" />,
      color: "#33C3F0",
      content: (
        <div className="bg-[#102043] p-4 rounded-md text-white">
          <h3 className="text-xl font-bold mb-3 text-[#33C3F0]">Surveillance</h3>
          <ul className="space-y-2">
            <li>- Vidéosurveillance</li>
            <li>- NVR TP-LINK VIGI</li>
            <li>- Caméras TP-LINK VIGI</li>
            <li>- Alarme et télésurveillance</li>
          </ul>
        </div>
      )
    },
    {
      name: "Verticaux métiers",
      icon: <Briefcase className="h-6 w-6 text-white" />,
      color: "#1EAEDB",
      content: (
        <div className="bg-[#102043] p-4 rounded-md text-white">
          <h3 className="text-xl font-bold mb-3 text-[#1EAEDB]">Verticaux métiers</h3>
          <ul className="space-y-2">
            <li>- Solutions pour l'Hôtellerie</li>
            <li>- Solutions pour la Santé</li>
            <li>- Solutions pour l'Education</li>
          </ul>
        </div>
      )
    }
  ];

  const handleCategoryClick = (categoryName: string) => {
    if (activeCategory === categoryName) {
      setActiveCategory(null);
    } else {
      setActiveCategory(categoryName);
    }
  };

  // Calculate positions for each node in the circle
  const radius = 180;
  const centerX = 250;
  const centerY = 250;
  const totalCategories = categories.length;
  
  return (
    <div className="my-8 p-4 bg-[#0B1529] rounded-lg">
      <h2 className="text-3xl font-bold text-white border-b-2 border-[#1EAEDB] pb-2 mb-8 w-fit">
        Une offre globale
      </h2>
      
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="relative w-[500px] h-[500px]">
          {/* Center icon */}
          {activeCategory ? (
            <>
              {categories.find(cat => cat.name === activeCategory)?.icon && (
                <div 
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full p-6 z-10"
                  style={{ backgroundColor: categories.find(cat => cat.name === activeCategory)?.color }}
                >
                  {categories.find(cat => cat.name === activeCategory)?.icon}
                </div>
              )}
            </>
          ) : (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl text-white font-bold text-center">
              <Badge className="bg-[#1EAEDB] text-white text-xl mb-2 px-4 py-2">Paritel</Badge>
              <div className="text-white">Votre partenaire IT & Telecom</div>
            </div>
          )}
          
          {/* Circle and nodes */}
          <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 500 500">
            {/* Main circle */}
            <circle cx={centerX} cy={centerY} r={radius} fill="transparent" stroke="#1EAEDB" strokeWidth="1" />
            
            {/* Category nodes */}
            {categories.map((category, index) => {
              const angle = (2 * Math.PI * index) / totalCategories - Math.PI / 2;
              const x = centerX + radius * Math.cos(angle);
              const y = centerY + radius * Math.sin(angle);
              
              return (
                <g key={index} onClick={() => handleCategoryClick(category.name)}>
                  <circle 
                    cx={x} 
                    cy={y} 
                    r={15} 
                    fill={activeCategory === category.name ? "#ffffff" : category.color}
                    stroke="#ffffff"
                    strokeWidth="2"
                    className="cursor-pointer transition-all duration-300 hover:r-18"
                  />
                </g>
              );
            })}
          </svg>
          
          {/* Category labels */}
          {categories.map((category, index) => {
            const angle = (2 * Math.PI * index) / totalCategories - Math.PI / 2;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            
            // Adjust text position based on angle quadrant
            const textX = centerX + (radius + 30) * Math.cos(angle);
            const textY = centerY + (radius + 30) * Math.sin(angle);
            
            const textAnchor = angle > Math.PI / 2 && angle < 3 * Math.PI / 2 ? "end" : "start";
            
            return (
              <div
                key={index}
                className={`absolute text-sm cursor-pointer transition-colors duration-300 font-medium ${activeCategory === category.name ? 'text-white font-bold' : 'text-gray-300'}`}
                style={{
                  left: `${textX}px`,
                  top: `${textY}px`,
                  transform: `translate(${textAnchor === "end" ? "-100%" : "0"}, -50%)`,
                  maxWidth: "120px",
                }}
                onClick={() => handleCategoryClick(category.name)}
              >
                {category.name}
              </div>
            );
          })}
        </div>
        
        {/* Info panel */}
        <div className="flex-1 min-h-[280px] flex items-center justify-center">
          {activeCategory ? (
            <div className="w-full max-w-md">
              {categories.find(cat => cat.name === activeCategory)?.content}
            </div>
          ) : (
            <div className="text-white p-6 bg-[#102043] rounded-md max-w-md">
              <h3 className="text-xl font-bold mb-4 text-[#1EAEDB]">Une offre sur-mesure IT & Telecom</h3>
              <p className="mb-4">
                Un <span className="text-[#1EAEDB] font-semibold">bureau d'ingénierie</span> et <span className="text-[#1EAEDB] font-semibold">d'avant-vente</span> pour les <span className="text-[#1EAEDB] font-semibold">études sur-mesure</span> afin de répondre à vos besoins spécifiques.
              </p>
              <p>
                Cliquez sur une catégorie pour découvrir notre offre complète.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
