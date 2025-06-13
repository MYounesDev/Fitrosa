"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { authService } from '@/services/api';
import { motion, AnimatePresence } from 'framer-motion';
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
  ChevronLeft,
  ChevronRight,
  Menu,
  Activity,
  BarChart2,
  CreditCard,
  DollarSign,
  UserCheck,
  Dumbbell
} from 'lucide-react';

interface User {
  firstName?: string;
  lastName?: string;
  role?: 'admin' | 'coach' | 'student';
  profileImage?: string;
  gender?: 'male' | 'female';
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser) as User;
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse user data:', error);
      }
    }

    // Get sidebar collapsed state from localStorage
    const sidebarState = localStorage.getItem('sidebarCollapsed');
    if (sidebarState) {
      setCollapsed(sidebarState === 'true');
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
    { 
      name: 'Dashboard', 
      href: `/${user.role}/dashboard`, 
      icon: <Home className="h-5 w-5" />,
      description: 'Overview of your activities'
    },
    { 
      name: 'Competitions', 
      href: `/${user.role}/competitions`, 
      icon: <Trophy className="h-5 w-5" />,
      description: 'View and manage competitions'
    },
  ];

  // Role-specific navigation items
  const roleSpecificNavItems = isAdmin
    ? [
      { name: 'Students', href: '/students-List', icon: <Users className="h-5 w-5" />, description: 'Manage student profiles' },
      { name: 'Coaches', href: '/admin/coaches', icon: <UserCheck className="h-5 w-5" />, description: 'Manage coach profiles' },
      { name: 'Sports', href: '/admin/sports', icon: <Dumbbell className="h-5 w-5" />, description: 'Manage sports' },
      { name: 'Classes', href: '/admin/classes', icon: <BookOpen className="h-5 w-5" />, description: 'View and manage classes' },
      { name: 'Analytics', href: '/admin/reports', icon: <BarChart2 className="h-5 w-5" />, description: 'Performance reports' },
      { name: 'Subscriptions', href: '/admin/subscriptions', icon: <Activity className="h-5 w-5" />, description: 'Manage subscriptions' },
      { name: 'Payments', href: '/admin/payments', icon: <DollarSign className="h-5 w-5" />, description: 'Payment management' },
      { name: 'System', href: '/admin/system', icon: <Cog className="h-5 w-5" />, description: 'System settings' }
    ]
    : isCoach
      ? [
        { name: 'Calendar', href: `/${user.role}/calendar`, icon: <Calendar className="h-5 w-5" />, description: 'Schedule and appointments' },
        { name: 'Students', href: '/students-List', icon: <Users className="h-5 w-5" />, description: 'View your students' },
        { name: 'Attendance', href: '/coach/attendance', icon: <FileText className="h-5 w-5" />, description: 'Manage student attendance' },
        { name: 'Classes', href: '/coach/classes', icon: <BookOpen className="h-5 w-5" />, description: 'Manage your classes' },
        { name: 'Analytics', href: '/coach/reports', icon: <BarChart2 className="h-5 w-5" />, description: 'Performance tracking' },
      ]
      : [
        { name: 'Calendar', href: `/${user.role}/calendar`, icon: <Calendar className="h-5 w-5" />, description: 'Schedule and appointments' },
        { name: 'Subscription', href: '/student/subscription', icon: <Activity className="h-5 w-5" />, description: 'Manage your subscription' },
      ];
      
  const navItems = [
    ...commonNavItems,
    ...roleSpecificNavItems,
    { name: 'Settings', href: `/settings`, icon: <Settings className="h-5 w-5" />, description: 'Account settings' },
  ];

  const handleLogout = () => {
    authService.logout();
    router.push('/login');
  };

  // Determine sidebar theme color based on user role
  const sidebarThemeColor = isAdmin
    ? 'from-red-600 to-red-900' // Admin theme (red)
    : 'from-blue-600 to-purple-800'; // Coach and Student theme (blue/purple)


  const toggleSidebar = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', String(newState));
    // Dispatch an event to notify other components
    window.dispatchEvent(new Event('storage'));
  };

  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <>
      {/* Mobile menu button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleMobileSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-full bg-black/80 backdrop-blur-sm text-white shadow-lg"
      >
        <Menu className="h-6 w-6" />
      </motion.button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        layout
        className={`
          fixed top-0 left-0 h-full z-40
          ${collapsed ? 'w-20' : 'w-72'} 
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          bg-gradient-to-b from-black to-blue-950 shadow-2xl
          transition-all duration-300 ease-in-out
        `}
      >
        <div className="flex flex-col h-full">
          {/* User profile */}
          <motion.div 
            layout
            className={`px-4 pt-8 pb-6 flex ${collapsed ? 'justify-center' : 'justify-between'} items-center`}
          >
            <div className="flex items-center space-x-4">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="relative"
              >
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 backdrop-blur-md overflow-hidden border-2 border-white/20 shadow-lg">
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
                <motion.div 
                  className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-black ${collapsed ? 'block' : ''}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                />
              </motion.div>
              <AnimatePresence>
                {!collapsed && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h3 className="text-white font-medium truncate max-w-[160px]">{user?.firstName || 'User'} {user?.lastName || ''}</h3>
                    <p className="text-blue-300 text-sm capitalize">{user?.role || 'User'}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleSidebar}
              className="text-white/80 hover:text-white p-2 hover:bg-white/10 rounded-xl transition-colors"
            >
              {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            </motion.button>
          </motion.div>

          {/* Navigation */}
          <nav className="mt-6 px-2 flex-grow">
            <motion.ul layout className="space-y-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <motion.li 
                    key={item.name}
                    layout
                    onMouseEnter={() => setHoveredItem(item.name)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <Link href={item.href}>
                      <div
                        className={`
                          flex items-center px-3 py-3 rounded-xl transition-all duration-200
                          ${isActive ? 'bg-blue-700/50 border-r-4 border-blue-400' : 'hover:bg-white/10'}
                          ${collapsed ? 'justify-center' : 'justify-start'}
                        `}
                      >
                        <div className={`${isActive ? 'text-white' : 'text-gray-400'}`}>
                          {item.icon}
                        </div>
                        
                        <AnimatePresence>
                          {!collapsed && (
                            <motion.span
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -10 }}
                              className={`ml-3 ${isActive ? 'text-white font-medium' : 'text-gray-300'}`}
                            >
                              {item.name}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </div>
                    </Link>
                    
                    {/* Tooltip for collapsed state */}
                        {collapsed && hoveredItem === item.name && (
                          <motion.div
                        initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                        className="absolute left-20 top-0 mt-2 bg-gray-900 text-white text-sm py-1.5 px-3 rounded-md shadow-lg z-50 whitespace-nowrap"
                          >
                        {item.name}
                      </motion.div>
                    )}
                  </motion.li>
                );
              })}
            </motion.ul>
          </nav>

          {/* Logout button */}
          <motion.div layout className="mt-auto mb-6 px-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className={`
                w-full flex items-center px-3 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors
                ${collapsed ? 'justify-center' : 'justify-start'}
              `}
              onMouseEnter={() => setHoveredItem('logout')}
              onMouseLeave={() => setHoveredItem(null)}
            >
                <LogOut className="h-5 w-5" />
              
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="ml-3 font-medium"
                  >
                    Logout
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
            
            {/* Tooltip for collapsed state */}
            {collapsed && hoveredItem === 'logout' && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="absolute left-20 bottom-6 bg-gray-900 text-white text-sm py-1.5 px-3 rounded-md shadow-lg z-50"
              >
                Logout
              </motion.div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}
