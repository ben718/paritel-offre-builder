
import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Filter } from "lucide-react";
import { fetchCategories, fetchSubcategoriesByCategory } from "@/services/CategoryService";
import { useQuery } from "@tanstack/react-query";

export interface CategoryFiltersProps {
  selectedCategory: string | null;
  selectedSubcategory: string | null;
  onCategoryChange: (category: string | null) => void;
  onSubcategoryChange: (subcategory: string | null) => void;
}

export const CategoryFilters = ({
  selectedCategory,
  selectedSubcategory,
  onCategoryChange,
  onSubcategoryChange,
}: CategoryFiltersProps) => {
  // Chargement dynamique des catégories
  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  // Chargement dynamique des sous-catégories liées à la catégorie sélectionnée
  const { data: subcategories = [], isLoading: isLoadingSubcategories } = useQuery({
    queryKey: ["subcategories", selectedCategory],
    queryFn: () => (selectedCategory ? fetchSubcategoriesByCategory(selectedCategory) : []),
    enabled: !!selectedCategory,
  });

  // Réinitialise la sous-catégorie quand on change la catégorie
  const handleCategoryChange = (category: string | null) => {
    onCategoryChange(category);
    onSubcategoryChange(null);
  };

  return (
    <Card className="w-full">
      <CardContent className="p-4 flex flex-col gap-5">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4" />
          <Label htmlFor="category">Catégories</Label>
        </div>
        {isLoadingCategories ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-500"></div>
          </div>
        ) : (
          <Tabs
            defaultValue={selectedCategory || ""}
            value={selectedCategory || ""}
            onValueChange={(value) => handleCategoryChange(value === "" ? null : value)}
            className="w-full"
          >
            <TabsList className="flex w-full overflow-x-auto bg-gray-50 rounded-lg p-1 scrollbar-hide">
              <TabsTrigger value="">
                Toutes
              </TabsTrigger>
              {categories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="whitespace-nowrap"
                >
                  {category.display_name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        )}

        <div className="flex items-center space-x-2 mt-4">
          <Filter className="h-4 w-4" />
          <Label htmlFor="subcategory">Sous-catégories</Label>
        </div>

        {selectedCategory && isLoadingSubcategories ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-500"></div>
          </div>
        ) : selectedCategory && subcategories.length > 0 ? (
          <ScrollArea className="h-[120px] w-full">
            <div className="space-y-2">
              {subcategories.map((subcategory) => (
                <div key={subcategory.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={subcategory.id}
                    checked={selectedSubcategory === subcategory.id}
                    onCheckedChange={(checked) => {
                      onSubcategoryChange(checked ? subcategory.id : null);
                    }}
                  />
                  <Label htmlFor={subcategory.id} className="cursor-pointer">
                    {subcategory.display_name}
                  </Label>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="text-gray-400 text-xs mt-1">
            {selectedCategory ? "Aucune sous-catégorie" : "Sélectionnez une catégorie."}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
