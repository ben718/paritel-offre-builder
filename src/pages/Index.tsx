
import { Link } from "react-router-dom";
import { Check, Phone, MapPin, User, HelpCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Top Navigation */}
      <div className="bg-[#001330] text-white">
        <div className="container mx-auto flex justify-between items-center py-2 px-4">
          <div className="flex space-x-2">
            <div className="bg-[#0EA5E9] text-white px-4 py-1 rounded-full">Professionnel</div>
            <div className="text-white px-4 py-1 rounded-full">Entreprise</div>
          </div>
          <div className="hidden md:flex space-x-6">
            <Link to="#" className="text-white hover:text-[#0EA5E9]">Groupe</Link>
            <Link to="#" className="text-white hover:text-[#0EA5E9]">Recrutement</Link>
            <Link to="#" className="text-white hover:text-[#0EA5E9]">Blog</Link>
          </div>
          <div className="flex space-x-4">
            <HelpCircle className="w-5 h-5" />
            <Search className="w-5 h-5" />
            <MapPin className="w-5 h-5" />
            <User className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Logo and Main Menu */}
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center py-4 px-4">
        <div className="flex items-center mb-4 md:mb-0">
          <img 
            src="/lovable-uploads/bee0d7ff-81a6-4ae6-a0f0-4475e05d7999.png" 
            alt="Paritel Logo" 
            className="h-10 mr-4"
            style={{ objectFit: 'contain', objectPosition: 'left' }}
          />
        </div>
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8">
          <Link to="#" className="text-[#2A4B8D] hover:text-[#0EA5E9] font-medium">Internet</Link>
          <Link to="#" className="text-[#2A4B8D] hover:text-[#0EA5E9] font-medium">Communication</Link>
          <Link to="#" className="text-[#2A4B8D] hover:text-[#0EA5E9] font-medium">Réseaux & Sécurité</Link>
          <Button variant="outline" className="border-[#0EA5E9] text-[#0EA5E9] hover:bg-[#0EA5E9] hover:text-white">
            Prendre RDV
          </Button>
          <Button className="bg-[#0EA5E9] hover:bg-[#0284c7] text-white">
            <Phone className="h-4 w-4 mr-2" />
            01 85 53 39 76
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-[#EFF6FF] py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl text-[#001330] font-bold text-center mb-16">
            Avec les connexions xDSL de Paritel, choisissez le débit adapté à vos usages
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* ADSL Card */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-[#0EA5E9] py-6 px-4 text-center">
                <h2 className="text-white text-3xl font-bold mb-2">Power Access</h2>
                <h3 className="text-white text-3xl font-bold">ADSL</h3>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-6">
                  Une connexion internet adaptée aux besoins des pros :
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <Check className="text-[#0EA5E9] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                    <div>
                      <span className="font-bold">Internet</span> jusqu'à <span className="font-bold">1 Mbps</span> montant (émission) et <span className="font-bold">20 Mbps</span> descendant (réception)<sup>(1)</sup>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-[#0EA5E9] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                    <div>
                      <span className="font-bold">Débit asymétrique</span> non garanti
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-[#0EA5E9] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                    <div>
                      <span className="font-bold">Wifi 6</span> <sup>(2)</sup>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-[#0EA5E9] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                    <div>
                      <span className="font-bold">Back up 4G</span> inclus<sup>(3)</sup>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-[#0EA5E9] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                    <div>
                      <span className="font-bold">Installation</span> par un technicien qualifié <sup>(4)</sup>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* SDSL Card */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-[#0EA5E9] py-6 px-4 text-center">
                <h2 className="text-white text-3xl font-bold mb-2">Power Access</h2>
                <h3 className="text-white text-3xl font-bold">SDSL</h3>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-6">
                  Une connexion internet garanti dédiée à votre activité :
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <Check className="text-[#0EA5E9] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                    <div>
                      <span className="font-bold">Internet</span> jusqu'à <span className="font-bold">16 Mbps</span> montant (émission) et descendant (réception)<sup>(1)</sup>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-[#0EA5E9] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                    <div>
                      <span className="font-bold">Débit symétrique</span> garanti
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-[#0EA5E9] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                    <div>
                      <span className="font-bold">Wifi 6</span> <sup>(2)</sup>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-[#0EA5E9] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                    <div>
                      <span className="font-bold">Back up 4G</span> inclus<sup>(3)</sup>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-[#0EA5E9] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                    <div>
                      <span className="font-bold">Installation</span> par un technicien qualifié <sup>(4)</sup>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* VDSL Card */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-[#0EA5E9] py-6 px-4 text-center">
                <h2 className="text-white text-3xl font-bold mb-2">Power Access</h2>
                <h3 className="text-white text-3xl font-bold">VDSL</h3>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-6">
                  Une version améliorée de l'ADSL qui propose des débits plus importants :
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <Check className="text-[#0EA5E9] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                    <div>
                      <span className="font-bold">Internet</span> jusqu'à <span className="font-bold">50 Mbps</span> montant (émission) et <span className="font-bold">100 Mbps</span> descendant (réception)<sup>(1)</sup>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-[#0EA5E9] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                    <div>
                      <span className="font-bold">Débit asymétrique</span> non garanti
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-[#0EA5E9] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                    <div>
                      <span className="font-bold">Wifi 6</span> <sup>(2)</sup>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-[#0EA5E9] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                    <div>
                      <span className="font-bold">Back up 4G</span> inclus<sup>(3)</sup>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-[#0EA5E9] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                    <div>
                      <span className="font-bold">Installation</span> par un technicien qualifié <sup>(4)</sup>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
