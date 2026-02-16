// src/App.tsx
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
};

function App() {
  // Parse user to determine default redirect
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      {/* Explicit Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            {/* Security Check: Only allow Admins here */}
            {user?.role === 'Admin' ? <AdminDashboard /> : <Navigate to="/dashboard" replace />}
          </ProtectedRoute>
        }
      />

      {/* Root Redirect Logic */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Navigate to={user?.role === 'Admin' ? "/admin" : "/dashboard"} replace />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;