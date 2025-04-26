
import { useState, useCallback } from 'react';
import { useQueryWithCache } from './useQueryWithCache';
import { fetchProducts } from '@/services/ProductService';

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
    error
  } = useQueryWithCache(
    ['products', filter.category, filter.search, filter.page.toString(), filter.limit.toString()],
    () => fetchProducts(),
    { 
      staleTime: 60000, 
      cacheTime: CACHE_TIME,
      refetchOnReconnect: true
    }
  );
  
  // Function to get a single product by ID
  const getProduct = useCallback((productId: string) => {
    return products.find(p => String(p.id) === productId) || null;
  }, [products]);
  
  // Apply filters
  const applyFilters = useCallback((newFilters: Partial<typeof filter>) => {
    setFilter(prev => ({
      ...prev,
      ...newFilters,
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
    error,
    refetchProducts: refetch,
    applyFilters,
    nextPage,
    prevPage,
    goToPage,
    getProduct
  };
}
