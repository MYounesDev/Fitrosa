"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { authService } from '@/services/api';
import {
  User,
  Home,
  Calendar,
  Settings,
  Trophy,
  Users,
  BookOpen,
  FileText,
  Cog,
  LogOut,
  ArrowLeftCircle,
  ArrowRightCircle,
  Menu
} from 'lucide-react';
/*

import adminProfile from 'https://i.imgur.com/JXlqGo1.png';
import maleCoachProfile from 'https://i.imgur.com/txGF7xA.png';
import femaleCoachProfile from 'https://i.imgur.com/b9kuKKI.png';
import maleStudentProfile from 'https://i.imgur.com/b9kuKKI.png';
import femaleStudentProfile from 'https://i.imgur.com/zWrwTba.png';


*/

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  
  useEffect(() => {
    // Get current user
    if (authService.isAuthenticated()) {
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);
    }
  }, []);

  // Don't show sidebar on login or register pages
  if (
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/forgot-password' ||
    pathname === '/unauthorized'
  ) {
    return null;
  }

  // Don't show sidebar if not authenticated
  if (!user) {
    return null;
  }

  const isAdmin = user?.role === 'admin';
  const isCoach = user?.role === 'coach';
  const isStudent = user?.role === 'student';

  // Common navigation items for all roles
  const commonNavItems = [
    { name: 'Home', href: `/${user.role}/dashboard`, icon: <Home className="h-5 w-5" /> },
    { name: 'Competitions', href: `/${user.role}/competitions`, icon: <Trophy className="h-5 w-5" /> },
    { name: 'Calendar', href: `/${user.role}/calendar`, icon: <Calendar className="h-5 w-5" /> },
  ];

  // Role-specific navigation items
  const roleSpecificNavItems = isAdmin
    ? [
      { name: 'Students', href: '/students-List', icon: <Users className="h-5 w-5" /> },
      { name: 'Coaches', href: '/admin/coaches', icon: <Users className="h-5 w-5" /> },
      { name: 'Classes', href: '/admin/classes', icon: <BookOpen className="h-5 w-5" /> },
      { name: 'Reports', href: '/admin/reports', icon: <FileText className="h-5 w-5" /> },
      { name: 'Subscriptions', href: '/admin/subscriptions', icon: <Users className="h-5 w-5" /> },
      { name: 'Payments', href: '/admin/payments', icon: <Users className="h-5 w-5" /> },
      { name: 'Cashiers', href: '/admin/cashiers', icon: <Users className="h-5 w-5" /> },
      { name: 'System', href: '/admin/system', icon: <Cog className="h-5 w-5" /> }
    ]
    : isCoach
      ? [
        { name: 'Students', href: '/students-List', icon: <Users className="h-5 w-5" /> },
        { name: 'Classes', href: '/coach/classes', icon: <BookOpen className="h-5 w-5" /> },
        { name: 'Reports', href: '/coach/reports', icon: <FileText className="h-5 w-5" /> },
      ]
      : [
        { name: 'Subscription', href: '/student/subscription', icon: <Users className="h-5 w-5" /> },
      ];
      
      const navItems = [
        ...commonNavItems,
        ...roleSpecificNavItems,
        
        { name: 'Settings', href: `/settings`, icon: <Settings className="h-5 w-5" /> },
        
      ];

      const handleLogout = () => {
    authService.logout();
    router.push('/login');
  };

  // Determine sidebar theme color based on user role
  const sidebarThemeColor = isAdmin
    ? 'from-red-600 to-red-900' // Admin theme (red)
    : 'from-blue-600 to-purple-800'; // Coach and Student theme (blue/purple)

  const activeItemColor = isAdmin
    ? 'bg-red-700/50 border-r-4 border-red-400'
    : 'bg-blue-700/50 border-r-4 border-blue-400';

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={toggleMobileSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-full bg-gray-800/80 backdrop-blur-sm text-gray-200 shadow-lg"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-full z-40 transition-all duration-300 ease-in-out 
          ${collapsed ? 'w-20' : 'w-64'} 
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          bg-gradient-to-b ${sidebarThemeColor} shadow-xl
        `}
      >
        <div className="flex flex-col h-full">
          {/* User profile with toggle button */}
          <div className={`px-4 pt-8 pb-6 flex ${collapsed ? 'justify-center' : 'justify-between'} items-center`}>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="h-12 w-12 rounded-full bg-gray-700/50 backdrop-blur-md overflow-hidden border-2 border-white/20">
                  {user?.profileImage ? (
                    <Image
                      src={user.profileImage}
                      alt="Profile"
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  ) : (

                    <Image
                      src={user.role === 'coach' ? (user.gender === 'male' ? 'https://i.imgur.com/txGF7xA.png' : 'https://i.imgur.com/b9kuKKI.png') : user.role === 'student' ? (user.gender === 'male' ? 'https://i.imgur.com/ZePN2xF.png' : 'https://i.imgur.com/zWrwTba.png') : 'https://i.imgur.com/JXlqGo1.png'}
                      alt="Profile"
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                    
                  )}
                </div>
                <div className={`absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-gray-800 ${collapsed ? 'block' : ''}`}></div>
              </div>
              {!collapsed && (
                <div>
                  <h3 className="text-white font-medium truncate max-w-[160px]">{user?.name || 'User'}</h3>
                  <p className="text-gray-300 text-sm capitalize">{user?.role || 'User'}</p>
                </div>
              )}
            </div>

            {/* Toggle sidebar button - Next to user profile */}
            <button
              onClick={toggleSidebar}
              className="text-gray-300 hover:text-white p-2 hover:bg-white/10 rounded-full"
            >
              {collapsed ? <ArrowRightCircle className="h-5 w-5" /> : <ArrowLeftCircle className="h-5 w-5" />}
            </button>
          </div>

          {/* Navigation */}
          <nav className="mt-2 px-2 flex-grow">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`
                        flex items-center px-4 py-3 text-gray-300 hover:text-white rounded-xl
                        ${isActive ? activeItemColor : 'hover:bg-white/10'}
                        transition-all duration-200
                      `}
                    >
                      <span className={`${collapsed ? 'mx-auto' : 'mr-3'}`}>{item.icon}</span>
                      {!collapsed && <span>{item.name}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer with toggle button */}
          <div className="mt-auto p-4">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={handleLogout}
                className={`
                  flex items-center px-4 py-3 text-gray-300 hover:text-white rounded-xl
                  hover:bg-white/10 ${collapsed ? 'w-full justify-center' : 'flex-1'} transition-all duration-200
                `}
              >
                <span className={`${collapsed ? '' : 'mr-3'}`}>
                  <LogOut className="h-5 w-5" />
                </span>
                {!collapsed && <span>Logout</span>}
              </button>

            </div>
          </div>
        </div>
      </div>

      {/* Main content padding */}
      <div className={`transition-all duration-300 ${collapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        {/* Your main content goes here */}
      </div>
    </>
  );
}