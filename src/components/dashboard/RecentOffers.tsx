
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Building, FileText } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

type OfferStatus = "draft" | "sent" | "accepted" | "rejected";

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
  const { data: offers = [] } = useQuery({
    queryKey: ['recent-offers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('offers')
        .select(`
          id,
          status,
          created_at,
          customers (
            company_name,
            industry
          )
        `)
        .order('created_at', { ascending: false })
        .limit(4);

      if (error) throw error;
      
      return data.map((offer: any) => ({
        id: offer.id,
        clientName: offer.customers.company_name,
        date: offer.created_at,
        sector: offer.customers.industry,
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
        {offers.map((offer) => (
          <OfferCard
            key={offer.id}
            clientName={offer.clientName}
            date={offer.date}
            sector={offer.sector}
            status={offer.status as OfferStatus}
            offerId={offer.id}
          />
        ))}
      </CardContent>
    </Card>
  );
};

export default RecentOffers;
