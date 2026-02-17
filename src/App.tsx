// src/App.tsx
import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';

// 1. Protected Route: Ensures user is Logged In
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
};

// 2. Admin Route: Ensures user is an Admin (Reads fresh data)
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  // If not admin, kick back to dashboard
  if (user?.role !== 'Admin') {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      {/* User Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      
      {/* Admin Panel (Wrapped in AdminRoute) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          </ProtectedRoute>
        }
      />

      {/* Default Redirect */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
             {/* We can't easily know the role here without reading LS, so default to dashboard which handles its own nav */}
             <Navigate to="/dashboard" replace />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;