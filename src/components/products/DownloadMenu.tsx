
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileDown, CheckSquare } from "lucide-react";
import { ProductCardProps } from "./ProductCard";
import { exportProductsToCSV, exportProductsToPDF } from "@/utils/exportUtils";

interface DownloadMenuProps {
  products: ProductCardProps[];
  selectedProducts: ProductCardProps[];
  hasSelection: boolean;
  className?: string;
}

export function DownloadMenu({ 
  products, 
  selectedProducts, 
  hasSelection,
  className = "" 
}: DownloadMenuProps) {
  const handleDownloadAllCSV = () => {
    exportProductsToCSV(products, "catalogue-produits");
  };

  const handleDownloadAllPDF = () => {
    exportProductsToPDF(products, "catalogue-produits");
  };
  
  const handleDownloadSelectedCSV = () => {
    exportProductsToCSV(selectedProducts, "produits-selectionnes");
  };

  const handleDownloadSelectedPDF = () => {
    exportProductsToPDF(selectedProducts, "produits-selectionnes");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={`flex items-center gap-2 ${className}`}>
          <Download className="h-4 w-4" />
          Télécharger
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Tous les produits</DropdownMenuLabel>
        <DropdownMenuItem onClick={handleDownloadAllCSV}>
          <FileDown className="mr-2 h-4 w-4" />
          <span>Télécharger en CSV</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDownloadAllPDF}>
          <FileDown className="mr-2 h-4 w-4" />
          <span>Télécharger en PDF</span>
        </DropdownMenuItem>
        
        {hasSelection && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Produits sélectionnés ({selectedProducts.length})</DropdownMenuLabel>
            <DropdownMenuItem onClick={handleDownloadSelectedCSV} disabled={selectedProducts.length === 0}>
              <CheckSquare className="mr-2 h-4 w-4" />
              <span>Sélection en CSV</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDownloadSelectedPDF} disabled={selectedProducts.length === 0}>
              <CheckSquare className="mr-2 h-4 w-4" />
              <span>Sélection en PDF</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
