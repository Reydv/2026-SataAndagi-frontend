// src/pages/Login.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User } from 'lucide-react';
import api from '../services/api';
import type { AuthResponse } from '../types';
import { parseJwt } from '../utils/jwt'; // Import the new utility

export default function Login() {
  const navigate = useNavigate();
  const [identity, setIdentity] = useState('');
  const [password, setPassword] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setIsError(false);

    try {
      // 1. Post Login Request
      const { data } = await api.post<AuthResponse>('/auth/login', {
        IdentityNumber: identity,
        Password: password,
      });

      if (data.token) {
        // 2. Decode the Token
        const decoded = parseJwt(data.token);
        
        if (decoded) {
          // 3. Map Claims to our User Object
          // Note: .NET often uses long URLs for claim keys, or short ones depending on config.
          // We check both standard keys and Microsoft keys.
          const user = {
            userId: decoded.nameid || decoded.sub, 
            name: decoded.unique_name || decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
            role: decoded.role || decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
            identityNumber: decoded.IdentityNumber
          };

          // 4. Save to Storage
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(user));

          // 5. Redirect based on Role
          if (user.role === 'Admin') {
            navigate('/admin');
          } else {
            navigate('/dashboard');
          }
        } else {
           throw new Error("Failed to decode token");
        }
      }
    } catch (err) {
      console.error(err);
      setIsError(true);
      setTimeout(() => setIsError(false), 500);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className={`bg-white w-full max-w-md p-8 rounded-xl shadow-lg transform transition-all ${isError ? 'animate-shake ring-2 ring-red-500' : ''}`}>
        <div className="text-center mb-8">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Welcome Back</h1>
          <p className="text-gray-500 mt-2">Sign in to access the facility.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Identity Number</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                required
                value={identity}
                onChange={(e) => setIdentity(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="NRP / NIP"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>

          {isError && (
            <div className="text-red-500 text-sm text-center bg-red-50 py-2 rounded">
              Invalid Credentials
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}