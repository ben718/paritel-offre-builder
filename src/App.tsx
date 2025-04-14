
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Products from "@/pages/Products";
import Partners from "@/pages/Partners";
import Solutions from "@/pages/Solutions";
import CreateOffer from "@/pages/CreateOffer";
import MyOffers from "@/pages/MyOffers";
import Reporting from "@/pages/Reporting";
import AdvancedReporting from "@/pages/AdvancedReporting";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import CodeEditor from "@/pages/CodeEditor";
import SiteBuilder from "@/pages/SiteBuilder";
import Administration from "@/pages/Administration";
import Users from "@/pages/Users";
import Unauthorized from "@/pages/Unauthorized";
import NotFound from "@/pages/NotFound";
import ProductComparison from "@/pages/ProductComparison";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={['user', 'admin', 'superadmin']}>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/products" element={
          <ProtectedRoute allowedRoles={['user', 'admin', 'superadmin']}>
            <Products />
          </ProtectedRoute>
        } />
        
        <Route path="/product-comparison" element={
          <ProtectedRoute allowedRoles={['user', 'admin', 'superadmin']}>
            <ProductComparison />
          </ProtectedRoute>
        } />
        
        <Route path="/partners" element={
          <ProtectedRoute allowedRoles={['user', 'admin', 'superadmin']}>
            <Partners />
          </ProtectedRoute>
        } />
        
        <Route path="/solutions" element={
          <ProtectedRoute allowedRoles={['user', 'admin', 'superadmin']}>
            <Solutions />
          </ProtectedRoute>
        } />
        
        <Route path="/create-offer" element={
          <ProtectedRoute allowedRoles={['user', 'admin', 'superadmin']}>
            <CreateOffer />
          </ProtectedRoute>
        } />
        
        <Route path="/my-offers" element={
          <ProtectedRoute allowedRoles={['user', 'admin', 'superadmin']}>
            <MyOffers />
          </ProtectedRoute>
        } />
        
        <Route path="/reporting" element={
          <ProtectedRoute allowedRoles={['user', 'admin', 'superadmin']}>
            <Reporting />
          </ProtectedRoute>
        } />
        
        <Route path="/advanced-reporting" element={
          <ProtectedRoute allowedRoles={['user', 'admin', 'superadmin']}>
            <AdvancedReporting />
          </ProtectedRoute>
        } />
        
        <Route path="/profile" element={
          <ProtectedRoute allowedRoles={['user', 'admin', 'superadmin']}>
            <Profile />
          </ProtectedRoute>
        } />
        
        <Route path="/settings" element={
          <ProtectedRoute allowedRoles={['user', 'admin', 'superadmin']}>
            <Settings />
          </ProtectedRoute>
        } />
        
        <Route path="/code-editor" element={
          <ProtectedRoute allowedRoles={['user', 'admin', 'superadmin']}>
            <CodeEditor />
          </ProtectedRoute>
        } />
        
        <Route path="/site-builder" element={
          <ProtectedRoute allowedRoles={['user', 'admin', 'superadmin']}>
            <SiteBuilder />
          </ProtectedRoute>
        } />
        
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
            <Administration />
          </ProtectedRoute>
        } />
        
        <Route path="/users" element={
          <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
            <Users />
          </ProtectedRoute>
        } />
        
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      <Toaster />
    </div>
  );
}

export default App;
