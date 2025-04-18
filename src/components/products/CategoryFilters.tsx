
import { useEffect, useState } from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

type CategoryProps = {
  id: string;
  name: string;
  display_name: string;
}

type SubcategoryProps = {
  id: string;
  name: string;
  display_name: string;
  category_id: string;
}

export const CategoryTabsList = () => {
  // Fetch categories from database
  const { data: categories = [], isLoading } = useQuery<CategoryProps[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name, display_name');
      
      if (error) {
        console.error('Error fetching categories:', error);
        return [];
      }
      
      return data || [];
    }
  });

  if (isLoading) {
    return (
      <TabsList className="w-full justify-start">
        <div className="flex space-x-2 p-4">
          <div className="h-6 w-20 animate-pulse bg-gray-200 rounded"></div>
          <div className="h-6 w-20 animate-pulse bg-gray-200 rounded"></div>
          <div className="h-6 w-20 animate-pulse bg-gray-200 rounded"></div>
        </div>
      </TabsList>
    );
  }

  return (
    <TabsList className="w-full justify-start">
      <TabsTrigger value="all" className="px-3 py-1.5">Tous</TabsTrigger>
      
      {categories.map((category) => (
        <TabsTrigger 
          key={category.id} 
          value={category.name}
          className="px-3 py-1.5"
        >
          {category.display_name}
        </TabsTrigger>
      ))}
    </TabsList>
  );
};

type CategoryFiltersProps = {
  selectedCategory: string;
  selectedSubcategory: string;
  setSelectedSubcategory: (value: string) => void;
};

export const CategoryFilters = ({
  selectedCategory,
  selectedSubcategory,
  setSelectedSubcategory
}: CategoryFiltersProps) => {
  // Fetch subcategories from database
  const { data: allSubcategories = [], isLoading } = useQuery<SubcategoryProps[]>({
    queryKey: ['subcategories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subcategories')
        .select('id, name, display_name, category_id');
      
      if (error) {
        console.error('Error fetching subcategories:', error);
        return [];
      }
      
      return data || [];
    }
  });

  // Fetch categories to find the current category id
  const { data: categories = [] } = useQuery<CategoryProps[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name, display_name');
      
      if (error) {
        console.error('Error fetching categories:', error);
        return [];
      }
      
      return data || [];
    }
  });

  // Find the current category id
  const currentCategoryId = categories.find(cat => cat.name === selectedCategory)?.id;
  
  // Filter subcategories for the current category
  const subcategories = currentCategoryId
    ? allSubcategories.filter(sub => sub.category_id === currentCategoryId)
    : [];

  if (selectedCategory === "all" || subcategories.length === 0) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex space-x-2 mt-2 overflow-x-auto pb-2">
        <div className="h-8 w-24 animate-pulse bg-gray-200 rounded"></div>
        <div className="h-8 w-24 animate-pulse bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="flex space-x-2 mt-2 overflow-x-auto pb-2">
      <button
        onClick={() => setSelectedSubcategory("all")}
        className={`px-3 py-1 text-sm border rounded-full transition-colors ${
          selectedSubcategory === "all"
            ? "bg-paritel-primary text-white border-paritel-primary"
            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
        }`}
      >
        Toutes les sous-catégories
      </button>
      
      {subcategories.map((subcategory) => (
        <button
          key={subcategory.id}
          onClick={() => setSelectedSubcategory(subcategory.display_name)}
          className={`px-3 py-1 text-sm border rounded-full whitespace-nowrap transition-colors ${
            selectedSubcategory === subcategory.display_name
              ? "bg-paritel-primary text-white border-paritel-primary"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
          }`}
        >
          {subcategory.display_name}
        </button>
      ))}
    </div>
  );
};
