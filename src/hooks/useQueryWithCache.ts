
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';

interface CacheConfig {
  staleTime?: number;
  cacheTime?: number;
  refetchOnMount?: boolean;
  refetchOnWindowFocus?: boolean;
  refetchOnReconnect?: boolean;
}

const defaultCacheConfig: CacheConfig = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000, // 10 minutes
  refetchOnMount: true,
  refetchOnWindowFocus: false,
  refetchOnReconnect: true,
};

export function useQueryWithCache<T>(
  queryKey: string | string[],
  queryFn: () => Promise<T>,
  config: CacheConfig = {}
) {
  // Merge default config with provided config
  const mergedConfig = { ...defaultCacheConfig, ...config };
  const key = Array.isArray(queryKey) ? queryKey : [queryKey];
  
  // Track if this is the first load to show a different loading state
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  
  const result = useQuery<T>({
    queryKey: key,
    queryFn: queryFn,
    staleTime: mergedConfig.staleTime,
    gcTime: mergedConfig.cacheTime,
    refetchOnMount: mergedConfig.refetchOnMount,
    refetchOnWindowFocus: mergedConfig.refetchOnWindowFocus,
    refetchOnReconnect: mergedConfig.refetchOnReconnect,
  });
  
  // Update first load state
  useEffect(() => {
    if (!result.isLoading && isFirstLoad) {
      setIsFirstLoad(false);
    }
  }, [result.isLoading, isFirstLoad]);
  
  return {
    ...result,
    isFirstLoad,
  };
}
