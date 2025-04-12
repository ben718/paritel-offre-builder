
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Download, FileDown, CheckSquare, Settings, Table } from "lucide-react";
import { ProductCardProps } from "./ProductCard";
import { exportProductsToCSV, exportProductsToPDF, EXPORT_FIELDS } from "@/utils/exportUtils";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";


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
  const [selectedFields, setSelectedFields] = useState<string[]>(
    EXPORT_FIELDS.map(field => field.id) // Initially select all fields
  );
  const [showFieldDialog, setShowFieldDialog] = useState(false);

  const handleDownloadAllCSV = () => {
    exportProductsToCSV(products, "catalogue-produits", selectedFields);
  };

  const handleDownloadAllPDF = () => {
    exportProductsToPDF(products, "catalogue-produits", selectedFields);
  };
  
  const handleDownloadSelectedCSV = () => {
    exportProductsToCSV(selectedProducts, "produits-selectionnes", selectedFields);
  };

  const handleDownloadSelectedPDF = () => {
    exportProductsToPDF(selectedProducts, "produits-selectionnes", selectedFields);
  };

  const toggleField = (fieldId: string) => {
    if (selectedFields.includes(fieldId)) {
      setSelectedFields(selectedFields.filter(id => id !== fieldId));
    } else {
      setSelectedFields([...selectedFields, fieldId]);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className={`flex items-center gap-2 ${className}`}>
            <Download className="h-4 w-4" />
            Télécharger
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={() => setShowFieldDialog(true)}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Choisir les champs à exporter</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          
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
          
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Table className="mr-2 h-4 w-4" />
              <span>Champs sélectionnés</span>
              <span className="ml-auto text-xs">{selectedFields.length}/{EXPORT_FIELDS.length}</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="w-56">
                {EXPORT_FIELDS.map(field => (
                  <DropdownMenuCheckboxItem
                    key={field.id}
                    checked={selectedFields.includes(field.id)}
                    onCheckedChange={() => toggleField(field.id)}
                  >
                    {field.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <Dialog open={showFieldDialog} onOpenChange={setShowFieldDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Choisir les champs à exporter</DialogTitle>
            <DialogDescription>
              Sélectionnez les informations que vous souhaitez inclure dans votre export
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <div className="flex flex-wrap gap-2">
                {EXPORT_FIELDS.map(field => (
                  <label key={field.id} className="flex items-center space-x-2 p-2 border rounded cursor-pointer hover:bg-muted">
                    <input
                      type="checkbox"
                      checked={selectedFields.includes(field.id)}
                      onChange={() => toggleField(field.id)}
                      className="h-4 w-4"
                    />
                    <span>{field.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex justify-between">
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => setSelectedFields(EXPORT_FIELDS.map(field => field.id))}
              >
                Tout sélectionner
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => setSelectedFields([])}
              >
                Tout désélectionner
              </Button>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" onClick={() => setShowFieldDialog(false)}>
              Valider
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
