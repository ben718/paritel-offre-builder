
import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useIsMobile } from "@/hooks/use-mobile";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden">
      {!isMobile && <Sidebar />}
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <Header />
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 w-full">
          <div className="w-full mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
