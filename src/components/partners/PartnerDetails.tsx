
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Globe, Mail, Phone, MapPin, Package } from "lucide-react";
import type { Partner } from "@/services/PartnerService";

export type PartnerCardProps = {
  id: string;
  name: string;
  description?: string;
  industry?: string;
  logo_url?: string;
  website_url?: string;
};

type PartnerDetailsProps = {
  partner: PartnerCardProps;
  onBack: () => void;
};

const PartnerDetails = ({ partner, onBack }: PartnerDetailsProps) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <Button variant="outline" size="sm" onClick={onBack} className="mb-2">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Retour
      </Button>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center p-6 h-64 md:h-auto">
          <img 
            src={partner.logo_url} 
            alt={partner.name} 
            className="max-w-full max-h-full object-contain"
          />
        </div>
        
        <div className="space-y-4">
          <div>
            <Badge 
              className="bg-blue-600 text-white"
            >
              {partner.industry || "Partenaire"}
            </Badge>
            <h1 className="text-2xl font-bold mt-2">{partner.name}</h1>
            <p className="text-gray-700 mt-2">{partner.description}</p>
          </div>
          
          {partner.website_url && (
            <div className="space-y-2">
              <div className="flex items-center">
                <Globe className="h-4 w-4 mr-2 text-gray-500" />
                <a href={partner.website_url} target="_blank" rel="noopener noreferrer" className="text-paritel-primary hover:underline">
                  {partner.website_url.replace(/^https?:\/\//, '')}
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Separator />
    </div>
  );
};

export default PartnerDetails;
