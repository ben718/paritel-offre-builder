import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import App from './App';
import './index.css';

// Crée une instance de QueryClient avec des options par défaut
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Empêche le refetch lors du focus de la fenêtre
      staleTime: 5 * 60 * 1000,    // Les données sont fraîches pendant 5 minutes
      retry: 1,                    // Nombre de tentatives de récupération en cas d'échec
    },
  },
});

// Render l'application avec les différents contextes
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <App />
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  </React.StrictMode>
);
