
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Package, 
  Briefcase, 
  FileText, 
  PieChart, 
  Users, 
  Settings, 
  HelpCircle,
  Building,
  Search
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItemProps = {
  to: string;
  icon: React.ElementType;
  label: string;
  badge?: number;
  onClick?: () => void;
};

const NavItem = ({ to, icon: Icon, label, badge, onClick }: NavItemProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={cn(
        "flex items-center py-2 px-4 text-sm font-medium rounded-md mb-1 group",
        isActive
          ? "bg-paritel-light text-paritel-primary"
          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      )}
      onClick={onClick}
    >
      <Icon className="w-5 h-5 mr-3" />
      <span>{label}</span>
      {badge && (
        <span className="ml-auto bg-paritel-primary text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
          {badge}
        </span>
      )}
    </Link>
  );
};

const Sidebar = () => {
  return (
    <div className="h-screen w-60 border-r border-gray-200 bg-sidebar flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Link to="/" className="font-bold text-xl text-paritel-primary">
            Paritel <span className="text-paritel-accent">|</span> OSM
          </Link>
        </div>
      </div>

      <div className="p-4 border-b border-gray-200">
        <div className="text-xs font-semibold uppercase text-gray-500 mb-2">PRINCIPAL</div>
        <nav className="space-y-1">
          <NavItem to="/" icon={LayoutDashboard} label="Tableau de bord" />
          <NavItem to="/create-offer" icon={FileText} label="Créer une offre" />
          <NavItem to="/my-offers" icon={FileText} label="Mes offres" badge={3} />
        </nav>
      </div>

      <div className="p-4 border-b border-gray-200">
        <div className="text-xs font-semibold uppercase text-gray-500 mb-2">CATALOGUE</div>
        <nav className="space-y-1">
          <NavItem to="/products" icon={Package} label="Produits" />
          <NavItem to="/solutions" icon={Briefcase} label="Solutions métiers" />
          <NavItem to="/partners" icon={Building} label="Partenaires" />
        </nav>
      </div>

      <div className="p-4 border-b border-gray-200">
        <div className="text-xs font-semibold uppercase text-gray-500 mb-2">ADMINISTRATION</div>
        <nav className="space-y-1">
          <NavItem to="/reporting" icon={PieChart} label="Reporting" />
                    <NavItem to="/users" icon={Users} label="Utilisateurs" />
                    <NavItem to="/settings" icon={Settings} label="Paramètres" />
        </nav>
      </div>

      <div className="mt-auto p-4 border-t border-gray-200">
        <div className="flex flex-col space-y-2">
          <button className="flex items-center py-2 px-4 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-100">
            <HelpCircle className="w-5 h-5 mr-3" />
            <span>Centre d'aide</span>
          </button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Recherche rapide"
              className="w-full py-2 pl-9 pr-3 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-paritel-accent"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
