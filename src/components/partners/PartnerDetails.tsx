
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
type PartnerCardProps = {
  id: number;
  name: string;
  description: string;
  type: "Fournisseur" | "Revendeur" | "Technologique" | "Stratégique";
  logo: string;
  website: string;
  contact: {
    email: string;
    phone: string;
    address: string;
  };
  products: string[];
  featured?: boolean;
};
import { ArrowLeft, Globe, Mail, Phone, MapPin, Package } from "lucide-react";

type PartnerDetailsProps = {
  partner: PartnerCardProps;
  onBack: () => void;
};

const PartnerDetails = ({ partner, onBack }: PartnerDetailsProps) => {
  const { 
    name, 
    description, 
    type, 
    logo, 
    website, 
    contact, 
    products, 
    featured 
  } = partner;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <Button variant="outline" size="sm" onClick={onBack} className="mb-2">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Retour
      </Button>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center p-6 h-64 md:h-auto">
          <img 
            src={logo} 
            alt={name} 
            className="max-w-full max-h-full object-contain"
          />
        </div>
        
        <div className="space-y-4">
          <div>
            {featured && (
              <Badge className="bg-paritel-primary text-white mb-2">Partenaire Premium</Badge>
            )}
            <Badge 
              className={
                type === "Fournisseur" ? "bg-purple-600 text-white" :
                type === "Revendeur" ? "bg-green-600 text-white" :
                type === "Technologique" ? "bg-blue-600 text-white" :
                "bg-amber-600 text-white"
              }
            >
              {type}
            </Badge>
            <h1 className="text-2xl font-bold mt-2">{name}</h1>
            <p className="text-gray-700 mt-2">{description}</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center">
              <Globe className="h-4 w-4 mr-2 text-gray-500" />
              <a href={website} target="_blank" rel="noopener noreferrer" className="text-paritel-primary hover:underline">
                {website.replace(/^https?:\/\//, '')}
              </a>
            </div>
            
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-2 text-gray-500" />
              <a href={`mailto:${contact.email}`} className="hover:underline">
                {contact.email}
              </a>
            </div>
            
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-2 text-gray-500" />
              <a href={`tel:${contact.phone}`} className="hover:underline">
                {contact.phone}
              </a>
            </div>
            
            {contact.address && (
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                <span>{contact.address}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Separator />
      
      {products && products.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center">
            <Package className="h-5 w-5 text-paritel-primary mr-2" />
            <h2 className="text-xl font-semibold">Produits et services associés</h2>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {products.map((product, i) => (
              <Badge key={i} variant="outline" className="text-sm px-3 py-1">
                {product}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnerDetails;
