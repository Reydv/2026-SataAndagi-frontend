// src/App.tsx
import React from 'react'; // Import React to use types
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';

// Protected Route Wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Cast children to valid JSX
  return <>{children}</>;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      {/* Dashboard Placeholder */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <div className="p-8 text-center">
              <h1 className="text-2xl font-bold">Dashboard Placeholder</h1>
              <p className="mb-4">You are logged in.</p>
              <button 
                onClick={() => {
                  localStorage.clear();
                  window.location.reload();
                }}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;