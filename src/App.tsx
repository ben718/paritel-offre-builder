
import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import { Toaster } from '@/components/ui/sonner';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Loading from './components/ui/loading';

// Lazy loaded pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Users = lazy(() => import('./pages/Users'));
const Products = lazy(() => import('./pages/Products'));
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
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/products" element={<Products />} />
            <Route path="/partners" element={<Partners />} />
            <Route path="/create-offer" element={<CreateOffer />} />
            <Route path="/my-offers" element={<MyOffers />} />
            <Route path="/reporting" element={<Reporting />} />
            <Route path="/advanced-reporting" element={<AdvancedReporting />} />
            <Route path="/solutions" element={<Solutions />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/administration" element={<Administration />} />
            <Route path="/product-comparison" element={<ProductComparison />} />
            <Route path="/site-builder" element={<SiteBuilder />} />
            <Route path="/code-editor" element={<CodeEditor />} />
          </Route>
          
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Toaster />
    </>
  );
}

export default App;
