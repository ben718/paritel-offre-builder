
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FilePlus, Package, Building, FileText } from "lucide-react";
import { Link } from "react-router-dom";

type QuickLinkProps = {
  icon: React.ElementType;
  label: string;
  to: string;
};

const QuickLink = ({ icon: Icon, label, to }: QuickLinkProps) => (
  <Link to={to} className="block">
    <Button
      variant="outline"
      className="w-full justify-start border border-gray-200 mb-2 hover:border-paritel-accent hover:text-paritel-primary"
    >
      <Icon className="mr-2 h-4 w-4" />
      {label}
    </Button>
  </Link>
);

const QuickAccess = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Accès rapides</CardTitle>
      </CardHeader>
      <CardContent>
        <QuickLink
          icon={Package}
          label="Consulter le catalogue"
          to="/products"
        />
        <QuickLink
          icon={FileText}
          label="Mes offres"
          to="/my-offers"
        />
        <QuickLink
          icon={Building}
          label="Partenaires"
          to="/partners"
        />
      </CardContent>
    </Card>
  );
};

export default QuickAccess;
