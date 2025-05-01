"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { authService, isAdmin, isCoach, isStudent } from '@/services/api';

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    // Get current user
    if (authService.isAuthenticated()) {
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);
    }
  }, []);

  const handleLogout = () => {
    authService.logout();
  };

  // Don't show navbar on login or register pages
  if (
    pathname === '/login' || 
    pathname === '/register' || 
    pathname === '/unauthorized'
  ) {
    return null;
  }

  // Don't show navbar if not authenticated
  if (!user) {
    return null;
  }

  return (
    <nav className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="font-bold text-xl">
              Student Management
            </Link>
            
            <div className="ml-10 flex items-baseline space-x-4">
              {isAdmin() && (
                <>
                  <Link 
                    href="/admin/dashboard" 
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      pathname.startsWith('/admin/dashboard') ? 'bg-gray-900' : 'hover:bg-gray-700'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    href="/admin/students" 
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      pathname.startsWith('/admin/students') ? 'bg-gray-900' : 'hover:bg-gray-700'
                    }`}
                  >
                    Students
                  </Link>
                  <Link 
                    href="/admin/coaches" 
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      pathname.startsWith('/admin/coaches') ? 'bg-gray-900' : 'hover:bg-gray-700'
                    }`}
                  >
                    Coaches
                  </Link>
                </>
              )}
              
              {isCoach() && (
                <>
                  <Link 
                    href="/coach/dashboard" 
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      pathname.startsWith('/coach/dashboard') ? 'bg-gray-900' : 'hover:bg-gray-700'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    href="/coach/students" 
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      pathname.startsWith('/coach/students') ? 'bg-gray-900' : 'hover:bg-gray-700'
                    }`}
                  >
                    My Students
                  </Link>
                </>
              )}
              
              {isStudent() && (
                <Link 
                  href="/student/dashboard" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname.startsWith('/student/dashboard') ? 'bg-gray-900' : 'hover:bg-gray-700'
                  }`}
                >
                  Dashboard
                </Link>
              )}
            </div>
          </div>
          
          <div className="flex items-center">
            <span className="text-sm mr-4">
              {user?.email}
            </span>
            <Link 
              href="/change-password" 
              className="text-sm px-3 py-2 rounded-md hover:bg-gray-700"
            >
              Change Password
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm px-3 py-2 rounded-md bg-red-600 hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}