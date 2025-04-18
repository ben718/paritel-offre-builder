
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Building } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import type { Database } from "@/integrations/supabase/types";
import { getRecentOffers } from "@/services/OfferService"; // Fixed import

type OfferStatus = Database["public"]["Enums"]["offer_status"];

type OfferCardProps = {
  clientName: string;
  date: string;
  sector: string;
  status: OfferStatus;
  offerId: string;
};

const getStatusColor = (status: OfferStatus) => {
  switch (status) {
    case "sent":
      return "bg-blue-100 text-blue-800";
    case "accepted":
      return "bg-green-100 text-green-800";
    case "rejected":
      return "bg-red-100 text-red-800";
    case "in_progress":
      return "bg-yellow-100 text-yellow-800";
    case "expired":
      return "bg-gray-100 text-gray-800";
    case "draft":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-yellow-100 text-yellow-800";
  }
};

const OfferCard = ({ clientName, date, sector, status, offerId }: OfferCardProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="border border-gray-200 rounded-lg p-4 mb-4">
      <div className="flex flex-wrap items-center mb-2">
        <h4 className="font-medium text-sm flex-1 mb-1 sm:mb-0">{clientName}</h4>
        <Badge className={getStatusColor(status)}>{status}</Badge>
      </div>
      <div className="flex flex-wrap items-center text-xs text-gray-500 mb-3">
        <div className="flex items-center mr-4 mb-1 sm:mb-0">
          <Calendar className="w-3 h-3 mr-1" />
          {new Date(date).toLocaleDateString()}
        </div>
        <div className="flex items-center">
          <Building className="w-3 h-3 mr-1" />
          {sector}
        </div>
      </div>
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:justify-between">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full sm:w-auto"
          onClick={() => navigate(`/create-offer?edit=${offerId}`)}
        >
          Détails
        </Button>
        <Button 
          variant="default" 
          size="sm" 
          className="bg-paritel-primary w-full sm:w-auto"
          onClick={() => navigate(`/create-offer?edit=${offerId}`)}
        >
          Modifier
        </Button>
      </div>
    </div>
  );
};

const RecentOffers = () => {
  const navigate = useNavigate();
  
  const { data: offers = [], isLoading } = useQuery({
    queryKey: ['recent-offers'],
    queryFn: async () => {
      const recentOffers = await getRecentOffers(4); // Fixed function call
      return recentOffers.map(offer => ({
        id: offer.id,
        clientName: offer.customer_name,
        date: offer.created_at,
        sector: offer.customer_industry,
        status: offer.status,
      }));
    },
  });

  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium">Offres récentes</CardTitle>
        <Button 
          variant="link" 
          className="text-paritel-primary"
          onClick={() => navigate('/my-offers')}
        >
          Voir tout <span className="ml-1">→</span>
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-4">
            <div className="animate-spin h-5 w-5 border-2 border-paritel-primary border-t-transparent rounded-full"></div>
          </div>
        ) : offers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Aucune offre récente à afficher
          </div>
        ) : (
          offers.map((offer) => (
            <OfferCard
              key={offer.id}
              clientName={offer.clientName}
              date={offer.date}
              sector={offer.sector}
              status={offer.status}
              offerId={offer.id}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default RecentOffers;
