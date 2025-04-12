
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileNav } from "./MobileNav";
import NotificationCenter from "@/components/notifications/NotificationCenter";
import UserMenu from "@/components/auth/UserMenu";

const Header = () => {
  const isMobile = useIsMobile();

  return (
    <header className="h-16 border-b border-gray-200 px-4 flex items-center justify-between bg-white">
      <div className="flex items-center">
        {isMobile && <MobileNav />}
        <div className={`${isMobile ? 'w-[calc(100vw-120px)] max-w-[200px]' : 'w-full max-w-md'}`}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher..."
              className="w-full py-2 pl-9 pr-3 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-paritel-accent"
            />
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2 sm:space-x-4">
        <Link to="/create-offer">
          <Button className="bg-paritel-primary hover:bg-paritel-dark" size={isMobile ? "sm" : "default"}>
            <Plus className="w-4 h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Créer une offre</span>
            <span className="sm:hidden">Créer</span>
          </Button>
        </Link>
        <NotificationCenter />
        <UserMenu />
      </div>
    </header>
  );
};

export default Header;
