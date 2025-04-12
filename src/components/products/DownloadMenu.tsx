
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileDown } from "lucide-react";
import { ProductCardProps } from "./ProductCard";
import { exportProductsToCSV, exportProductsToPDF } from "@/utils/exportUtils";

interface DownloadMenuProps {
  products: ProductCardProps[];
  className?: string;
}

export function DownloadMenu({ products, className = "" }: DownloadMenuProps) {
  const handleDownloadCSV = () => {
    exportProductsToCSV(products, "catalogue-produits");
  };

  const handleDownloadPDF = () => {
    exportProductsToPDF(products, "catalogue-produits");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={`flex items-center gap-2 ${className}`}>
          <Download className="h-4 w-4" />
          Télécharger le catalogue
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleDownloadCSV}>
          <FileDown className="mr-2 h-4 w-4" />
          <span>Télécharger en CSV</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDownloadPDF}>
          <FileDown className="mr-2 h-4 w-4" />
          <span>Télécharger en PDF</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
