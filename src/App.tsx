import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import { Toaster } from '@/components/ui/sonner';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Loading from './components/ui/loading';
import GenerateDocumentPage from './pages/GenerateDocumentPage';

// Lazy loaded pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Users = lazy(() => import('./pages/Users'));
const ProduitsPage = lazy(() => import('./pages/ProduitsPage'));
const Partners = lazy(() => import('./pages/Partners'));
const CreateOffer = lazy(() => import('./pages/CreateOffer'));
const MyOffers = lazy(() => import('./pages/MyOffers'));
const Reporting = lazy(() => import('./pages/Reporting'));
const AdvancedReporting = lazy(() => import('./pages/AdvancedReporting'));
const Solutions = lazy(() => import('./pages/Solutions'));
const Profile = lazy(() => import('./pages/Profile'));
const Settings = lazy(() => import('./pages/Settings'));
const Administration = lazy(() => import('./pages/Administration'));
const Login = lazy(() => import('./pages/Login'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Unauthorized = lazy(() => import('./pages/Unauthorized'));
const Index = lazy(() => import('./pages/Index'));
const ProductComparison = lazy(() => import('./pages/ProductComparison'));
const SiteBuilder = lazy(() => import('./pages/SiteBuilder'));
const CodeEditor = lazy(() => import('./pages/CodeEditor'));

function App() {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          
          {/* Protected routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
          <Route path="/catalogue/produits" element={<ProtectedRoute><ProduitsPage /></ProtectedRoute>} />
          <Route path="/partners" element={<ProtectedRoute><Partners /></ProtectedRoute>} />
          <Route path="/create-offer" element={<ProtectedRoute><CreateOffer /></ProtectedRoute>} />
          <Route path="/my-offers" element={<ProtectedRoute><MyOffers /></ProtectedRoute>} />
          <Route path="/reporting" element={<ProtectedRoute><Reporting /></ProtectedRoute>} />
          <Route path="/advanced-reporting" element={<ProtectedRoute><AdvancedReporting /></ProtectedRoute>} />
          <Route path="/solutions" element={<ProtectedRoute><Solutions /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/administration" element={<ProtectedRoute><Administration /></ProtectedRoute>} />
          <Route path="/product-comparison" element={<ProtectedRoute><ProductComparison /></ProtectedRoute>} />
          <Route path="/site-builder" element={<ProtectedRoute><SiteBuilder /></ProtectedRoute>} />
          <Route path="/code-editor" element={<ProtectedRoute><CodeEditor /></ProtectedRoute>} />
          <Route path="/generate-memoire-technique" element={<ProtectedRoute><GenerateDocumentPage /></ProtectedRoute>} />
          
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Toaster />
    </>
  );
}

export default App;
