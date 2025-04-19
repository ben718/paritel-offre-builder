import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Radio } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Filter, Check } from "lucide-react";
import { fetchCategories, fetchSubcategories } from "@/services/CategoryService";
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
  onSubcategoryChange
}: CategoryFiltersProps) => {
  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => fetchCategories(),
  });

  const { data: subcategories = [], isLoading: isLoadingSubcategories } = useQuery({
    queryKey: ['subcategories', selectedCategory],
    queryFn: () => selectedCategory ? fetchSubcategories() : [],
    enabled: !!selectedCategory,
  });

  const handleCategoryChange = (category: string | null) => {
    onCategoryChange(category);
    onSubcategoryChange(null); // Reset subcategory when category changes
  };

  return (
    <Card className="w-full">
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4" />
          <Label htmlFor="category">Catégories</Label>
        </div>
        
        {isLoadingCategories ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-500"></div>
          </div>
        ) : (
          <ScrollArea className="h-[200px] w-full">
            <div className="space-y-2">
              {categories.map(category => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Radio
                    id={category.id}
                    value={category.id}
                    checked={selectedCategory === category.id}
                    onChange={() => handleCategoryChange(category.id)}
                  />
                  <Label htmlFor={category.id} className="cursor-pointer">
                    {category.display_name}
                  </Label>
                </div>
              ))}
              <div className="flex items-center space-x-2">
                <Radio
                  id="all"
                  value="all"
                  checked={selectedCategory === null}
                  onChange={() => handleCategoryChange(null)}
                />
                <Label htmlFor="all" className="cursor-pointer">
                  Toutes les catégories
                </Label>
              </div>
            </div>
          </ScrollArea>
        )}

        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4" />
          <Label htmlFor="subcategory">Sous-catégories</Label>
        </div>

        {isLoadingSubcategories ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-500"></div>
          </div>
        ) : (
          <ScrollArea className="h-[200px] w-full">
            <div className="space-y-2">
              {subcategories.map(subcategory => (
                <div key={subcategory.id} className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2">
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
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};
