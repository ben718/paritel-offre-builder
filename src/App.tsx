import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Solutions from "./pages/Solutions";
import Partners from "./pages/Partners";
import CreateOffer from "./pages/CreateOffer";
import NotFound from "./pages/NotFound";
import Administration from "./pages/Administration";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Users from "./pages/Users";
import Reporting from "./pages/Reporting";
import MyOffers from "./pages/MyOffers";
import Login from "./pages/Login";
import Unauthorized from "./pages/Unauthorized";
import ProductComparison from "./pages/ProductComparison";
import AdvancedReporting from "./pages/AdvancedReporting";
import SiteBuilder from "./pages/SiteBuilder";
import CodeEditor from "./pages/CodeEditor";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            {/* Protected routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/products" element={
              <ProtectedRoute>
                <Products />
              </ProtectedRoute>
            } />
            <Route path="/product-comparison" element={
              <ProtectedRoute>
                <ProductComparison />
              </ProtectedRoute>
            } />
            <Route path="/solutions" element={
              <ProtectedRoute>
                <Solutions />
              </ProtectedRoute>
            } />
            <Route path="/partners" element={
              <ProtectedRoute>
                <Partners />
              </ProtectedRoute>
            } />
            <Route path="/create-offer" element={
              <ProtectedRoute>
                <CreateOffer />
              </ProtectedRoute>
            } />
            <Route path="/my-offers" element={
              <ProtectedRoute>
                <MyOffers />
              </ProtectedRoute>
            } />
            <Route path="/reporting" element={
              <ProtectedRoute>
                <Reporting />
              </ProtectedRoute>
            } />
            <Route path="/advanced-reporting" element={
              <ProtectedRoute>
                <AdvancedReporting />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            
            {/* Admin-only routes */}
            <Route path="/users" element={
              <ProtectedRoute allowedRoles={['admin', 'manager']}>
                <Users />
              </ProtectedRoute>
            } />
            <Route path="/administration" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Administration />
              </ProtectedRoute>
            } />
            
            {/* Super Admin routes */}
            <Route path="/site-builder" element={
              <ProtectedRoute allowedRoles={['superadmin']}>
                <SiteBuilder />
              </ProtectedRoute>
            } />
            <Route path="/code-editor" element={
              <ProtectedRoute allowedRoles={['superadmin']}>
                <CodeEditor />
              </ProtectedRoute>
            } />
            
            {/* Fallback routes */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
