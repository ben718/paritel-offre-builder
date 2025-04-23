
import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "@/services/CategoryService";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface CategoryFiltersProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

export const CategoryFilters = ({
  selectedCategory,
  onCategoryChange,
}: CategoryFiltersProps) => {
  // Récupération dynamique des catégories
  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  return (
    <div className="w-full bg-[#f5f8fb] rounded-lg mb-6">
      <ScrollArea className="w-full" orientation="horizontal">
        <div className="flex px-4 py-2 min-w-full">
          <button
            className={`px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap ${
              !selectedCategory
                ? "bg-white text-black shadow-sm"
                : "bg-transparent text-[#73809b] hover:bg-gray-100"
            }`}
            onClick={() => onCategoryChange(null)}
          >
            Tous les produits
          </button>
          {isLoadingCategories ? (
            <span className="text-gray-400 px-4">Chargement...</span>
          ) : (
            categories.map((category) => (
              <button
                key={category.id}
                className={`px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap ${
                  selectedCategory === category.id
                    ? "bg-white text-black shadow-sm"
                    : "bg-transparent text-[#73809b] hover:bg-gray-100"
                } mx-1`}
                onClick={() => onCategoryChange(category.id)}
              >
                {category.display_name}
              </button>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
