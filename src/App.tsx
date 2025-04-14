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
    // Simulate fetching user role from local storage or authentication context
    const storedRole = localStorage.getItem('userRole') as Role | null;
    setUserRole(storedRole);

    if (!allowedRoles.includes(storedRole as Role)) {
      navigate('/unauthorized', { replace: true, state: { from: location } });
    }
  }, [allowedRoles, navigate, location]);

  if (userRole === null) {
    // You might want to render a loading indicator here
    return <div>Loading...</div>;
  }

  return allowedRoles.includes(userRole) ? <>{children}</> : null;
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if the user is logged in (e.g., token exists in local storage)
    const token = localStorage.getItem('authToken');
    setIsLoggedIn(!!token);
  }, []);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        
        <Route element={<ProtectedRoute allowedRoles={['user', 'admin']} />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product-comparison" element={<ProductComparison />} />
          <Route path="/partners" element={<Partners />} />
          <Route path="/solutions" element={<Solutions />} />
          <Route path="/create-offer" element={<CreateOffer />} />
          <Route path="/my-offers" element={<MyOffers />} />
          <Route path="/reporting" element={<Reporting />} />
          <Route path="/advanced-reporting" element={<AdvancedReporting />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/code-editor" element={<CodeEditor />} />
          <Route path="/site-builder" element={<SiteBuilder />} />
        </Route>
        
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin" element={<Administration />} />
          <Route path="/users" element={<Users />} />
        </Route>
        
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      <Toaster />
    </div>
  );
}

export default App;
