
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Menu, X, LayoutDashboard, Package, Briefcase, FileText, 
  PieChart, Users, Settings, HelpCircle, Building, Search, Home
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type NavItemProps = {
  to: string;
  icon: React.ElementType;
  label: string;
  badge?: number;
  onClick?: () => void;
};

const MobileNavItem = ({ to, icon: Icon, label, badge, onClick }: NavItemProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={cn(
        "flex items-center py-3 px-4 text-base font-medium rounded-md mb-1 group",
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

export function MobileNav() {
  const [open, setOpen] = useState(false);

  const handleNavClick = () => {
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[85%] max-w-[300px] sm:max-w-[350px] pr-0 p-0">
        <div className="h-full flex flex-col">
          <SheetHeader className="p-4 border-b border-gray-200">
            <SheetTitle className="flex items-center justify-between">
              <Link to="/" className="font-bold text-xl text-paritel-primary" onClick={handleNavClick}>
                Paritel <span className="text-paritel-accent">|</span> OSM
              </Link>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-auto">
            <div className="p-4 border-b border-gray-200">
              <div className="text-xs font-semibold uppercase text-gray-500 mb-2">PRINCIPAL</div>
              <nav className="space-y-1">
                <MobileNavItem to="/" icon={LayoutDashboard} label="Tableau de bord" onClick={handleNavClick} />
                <MobileNavItem to="/create-offer" icon={FileText} label="Créer une offre" onClick={handleNavClick} />
                <MobileNavItem to="/my-offers" icon={FileText} label="Mes offres" badge={3} onClick={handleNavClick} />
              </nav>
            </div>

            <div className="p-4 border-b border-gray-200">
              <div className="text-xs font-semibold uppercase text-gray-500 mb-2">CATALOGUE</div>
              <nav className="space-y-1">
                <MobileNavItem to="/products" icon={Package} label="Produits" onClick={handleNavClick} />
                <MobileNavItem to="/solutions" icon={Briefcase} label="Solutions métiers" onClick={handleNavClick} />
                <MobileNavItem to="/partners" icon={Building} label="Partenaires" onClick={handleNavClick} />
              </nav>
            </div>

            <div className="p-4 border-b border-gray-200">
              <div className="text-xs font-semibold uppercase text-gray-500 mb-2">ADMINISTRATION</div>
              <nav className="space-y-1">
                <MobileNavItem to="/reporting" icon={PieChart} label="Reporting" onClick={handleNavClick} />
                <MobileNavItem to="/users" icon={Users} label="Utilisateurs" onClick={handleNavClick} />
                <MobileNavItem to="/settings" icon={Settings} label="Paramètres" onClick={handleNavClick} />
              </nav>
            </div>
          </div>

          <div className="p-4 border-t border-gray-200">
            <div className="flex flex-col space-y-3">
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
      </SheetContent>
    </Sheet>
  );
}
