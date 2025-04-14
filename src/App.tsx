
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
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

type Role = 'user' | 'admin';

interface ProtectedRouteProps {
  allowedRoles: Role[];
  children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const [userRole, setUserRole] = useState<Role | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedRole = localStorage.getItem('userRole') as Role | null;
    setUserRole(storedRole);

    if (!allowedRoles.includes(storedRole as Role)) {
      navigate('/unauthorized', { replace: true, state: { from: location } });
    }
  }, [allowedRoles, navigate, location]);

  if (userRole === null) {
    return <div>Loading...</div>;
  }

  return allowedRoles.includes(userRole) ? <>{children}</> : null;
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsLoggedIn(!!token);
  }, []);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={['user', 'admin']}>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/products" element={
          <ProtectedRoute allowedRoles={['user', 'admin']}>
            <Products />
          </ProtectedRoute>
        } />
        
        <Route path="/product-comparison" element={
          <ProtectedRoute allowedRoles={['user', 'admin']}>
            <ProductComparison />
          </ProtectedRoute>
        } />
        
        <Route path="/partners" element={
          <ProtectedRoute allowedRoles={['user', 'admin']}>
            <Partners />
          </ProtectedRoute>
        } />
        
        <Route path="/solutions" element={
          <ProtectedRoute allowedRoles={['user', 'admin']}>
            <Solutions />
          </ProtectedRoute>
        } />
        
        <Route path="/create-offer" element={
          <ProtectedRoute allowedRoles={['user', 'admin']}>
            <CreateOffer />
          </ProtectedRoute>
        } />
        
        <Route path="/my-offers" element={
          <ProtectedRoute allowedRoles={['user', 'admin']}>
            <MyOffers />
          </ProtectedRoute>
        } />
        
        <Route path="/reporting" element={
          <ProtectedRoute allowedRoles={['user', 'admin']}>
            <Reporting />
          </ProtectedRoute>
        } />
        
        <Route path="/advanced-reporting" element={
          <ProtectedRoute allowedRoles={['user', 'admin']}>
            <AdvancedReporting />
          </ProtectedRoute>
        } />
        
        <Route path="/profile" element={
          <ProtectedRoute allowedRoles={['user', 'admin']}>
            <Profile />
          </ProtectedRoute>
        } />
        
        <Route path="/settings" element={
          <ProtectedRoute allowedRoles={['user', 'admin']}>
            <Settings />
          </ProtectedRoute>
        } />
        
        <Route path="/code-editor" element={
          <ProtectedRoute allowedRoles={['user', 'admin']}>
            <CodeEditor />
          </ProtectedRoute>
        } />
        
        <Route path="/site-builder" element={
          <ProtectedRoute allowedRoles={['user', 'admin']}>
            <SiteBuilder />
          </ProtectedRoute>
        } />
        
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Administration />
          </ProtectedRoute>
        } />
        
        <Route path="/users" element={
          <ProtectedRoute allowedRoles={['admin']}>
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
