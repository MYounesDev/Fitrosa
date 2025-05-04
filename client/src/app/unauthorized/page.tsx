"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { authService } from '@/services/api';
import { AlertTriangle, Home, LogOut } from 'lucide-react';

export default function Unauthorized() {
  const [animateIn, setAnimateIn] = useState(false);
  
  useEffect(() => {
    // Trigger animation after component mounts
    setAnimateIn(true);
  }, []);

  const handleLogout = () => {
    authService.logout();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 p-4">
      <div 
        className={`w-full max-w-md relative overflow-hidden transition-all duration-700 ease-in-out ${
          animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {/* Decorative elements */}
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-red-500 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-blue-500 rounded-full opacity-20 blur-xl"></div>
        
        <div className="backdrop-blur-sm bg-gray-900/70 p-8 rounded-2xl shadow-2xl border border-gray-700">
          {/* Icon and header */}
          <div className="flex flex-col items-center mb-8">
            <div className="p-4 rounded-full bg-red-500/20 mb-4 animate-pulse">
              <AlertTriangle size={40} className="text-red-400" />
            </div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-red-600">
              Access Denied
            </h1>
            <div className="h-1 w-16 bg-gradient-to-r from-red-500 to-red-700 rounded-full mt-2"></div>
          </div>
          
          {/* Message */}
          <p className="text-gray-300 text-center mb-8 px-6">
            You don't have permission to access this resource. Please contact your administrator if you believe this is an error.
          </p>
          
          {/* Action buttons */}
          <div className="space-y-4 pt-2">
            <Link 
              href="/"
              className="group flex items-center justify-center w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-medium transition-all duration-300 shadow-lg shadow-blue-700/30 hover:shadow-blue-600/40"
            >
              <Home size={18} className="mr-2 group-hover:scale-110 transition-transform duration-300" />
              Return to Home
            </Link>
            
            <button
              onClick={handleLogout}
              className="group flex items-center justify-center w-full py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-medium transition-all duration-300 shadow-lg shadow-red-700/30 hover:shadow-red-600/40"
            >
              <LogOut size={18} className="mr-2 group-hover:scale-110 transition-transform duration-300" />
              Logout
            </button>
          </div>
        </div>
        
        {/* Decorative dots grid */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-0 left-0 right-0 h-full grid grid-cols-12 gap-2 opacity-10">
            {Array(48).fill(0).map((_, i) => (
              <div key={i} className="h-1 w-1 rounded-full bg-white"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}