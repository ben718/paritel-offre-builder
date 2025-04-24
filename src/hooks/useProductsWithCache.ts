
import { useState, useCallback } from 'react';
import { useQueryWithCache } from './useQueryWithCache';
import { getProducts, getProductById } from '@/services/ProductService';

const CACHE_TIME = 10 * 60 * 1000; // 10 minutes

export function useProductsWithCache() {
  const [filter, setFilter] = useState({
    category: '',
    search: '',
    page: 1,
    limit: 20
  });
  
  // Get products with cache
  const {
    data: products = [],
    isLoading,
    isError,
    refetch,
    isFirstLoad
  } = useQueryWithCache(
    ['products', filter.category, filter.search, filter.page, filter.limit],
    () => getProducts({ 
      category: filter.category,
      search: filter.search,
      page: filter.page,
      limit: filter.limit
    }),
    { staleTime: 60000, cacheTime: CACHE_TIME }
  );
  
  // Function to get a single product with cache
  const getProduct = useCallback((productId: string) => {
    return useQueryWithCache(
      ['product', productId],
      () => getProductById(productId),
      { staleTime: 5 * 60 * 1000, cacheTime: CACHE_TIME }
    );
  }, []);
  
  // Apply filters
  const applyFilters = useCallback((newFilters: Partial<typeof filter>) => {
    setFilter(prev => ({
      ...prev,
      ...newFilters,
      // Reset page to 1 if filters have changed
      page: (newFilters.category !== undefined && newFilters.category !== prev.category) || 
            (newFilters.search !== undefined && newFilters.search !== prev.search) ? 1 : prev.page
    }));
  }, []);
  
  // Pagination controls
  const nextPage = useCallback(() => {
    setFilter(prev => ({ ...prev, page: prev.page + 1 }));
  }, []);
  
  const prevPage = useCallback(() => {
    setFilter(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }));
  }, []);
  
  const goToPage = useCallback((page: number) => {
    setFilter(prev => ({ ...prev, page }));
  }, []);
  
  return {
    products,
    filter,
    isLoading,
    isError,
    isFirstLoad,
    refetchProducts: refetch,
    applyFilters,
    nextPage,
    prevPage,
    goToPage,
    getProduct
  };
}
