
import { QueryClient } from '@tanstack/react-query';

// Création d'un client React Query avec la configuration par défaut
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Préfixer toutes les clés de cache avec un identifiant d'application
export const getQueryKey = (key: string | string[]) => {
  const prefix = 'paritel-app';
  return Array.isArray(key) ? [prefix, ...key] : [prefix, key];
};

// Fonction pour invalider plusieurs clés de cache en même temps
export const invalidateQueries = async (queryKeys: (string | string[])[]) => {
  const promises = queryKeys.map(key => 
    queryClient.invalidateQueries({ queryKey: getQueryKey(key) })
  );
  
  await Promise.all(promises);
};

// Fonction pour précharger des données dans le cache
export const prefetchQuery = async (key: string | string[], queryFn: () => Promise<unknown>) => {
  await queryClient.prefetchQuery({
    queryKey: getQueryKey(key),
    queryFn,
  });
};
