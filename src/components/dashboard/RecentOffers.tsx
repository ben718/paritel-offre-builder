
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Building, FileText } from "lucide-react";

type OfferStatus = "Brouillon" | "Envoyée" | "Acceptée" | "Refusée";

type OfferCardProps = {
  clientName: string;
  date: string;
  sector: string;
  status: OfferStatus;
  onClick?: () => void;
};

const getStatusColor = (status: OfferStatus) => {
  switch (status) {
    case "Envoyée":
      return "bg-blue-100 text-blue-800";
    case "Acceptée":
      return "bg-green-100 text-green-800";
    case "Refusée":
      return "bg-red-100 text-red-800";
    default:
      return "bg-yellow-100 text-yellow-800";
  }
};

const OfferCard = ({ clientName, date, sector, status, onClick }: OfferCardProps) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 mb-4">
      <div className="flex items-center mb-2">
        <h4 className="font-medium text-sm flex-1">{clientName}</h4>
        <Badge className={getStatusColor(status)}>{status}</Badge>
      </div>
      <div className="flex items-center text-xs text-gray-500 mb-3">
        <div className="flex items-center mr-4">
          <Calendar className="w-3 h-3 mr-1" />
          {date}
        </div>
        <div className="flex items-center">
          <Building className="w-3 h-3 mr-1" />
          {sector}
        </div>
      </div>
      <div className="flex justify-between">
        <Button variant="outline" size="sm">
          Détails
        </Button>
        <Button variant="default" size="sm" className="bg-paritel-primary">
          Modifier
        </Button>
      </div>
    </div>
  );
};

const RecentOffers = () => {
  const offers = [
    {
      id: 1,
      clientName: "Hôtel Le Majestic",
      date: "15/04/2025",
      sector: "Hôtellerie",
      status: "Envoyée" as OfferStatus,
    },
    {
      id: 2,
      clientName: "EPHAD Soleil",
      date: "08/04/2025",
      sector: "Santé",
      status: "Brouillon" as OfferStatus,
    },
    {
      id: 3,
      clientName: "Cabinet Dupont & Associés",
      date: "05/04/2025",
      sector: "Services",
      status: "Acceptée" as OfferStatus,
    },
    {
      id: 4,
      clientName: "Restaurant La Bonne Table",
      date: "02/04/2025",
      sector: "Restauration",
      status: "Refusée" as OfferStatus,
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium">Offres récentes</CardTitle>
        <Button variant="link" className="text-paritel-primary">
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
            status={offer.status}
          />
        ))}
      </CardContent>
    </Card>
  );
};

export default RecentOffers;
