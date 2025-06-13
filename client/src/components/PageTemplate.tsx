"use client";
import Sidebar from '@/components/Sidebar';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface PageTemplateProps {
  children?: React.ReactNode;
}

const PageTemplate: React.FC<PageTemplateProps> = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Listen for sidebar collapse state changes
  useEffect(() => {
    const handleStorageChange = () => {
      const sidebarState = localStorage.getItem('sidebarCollapsed');
      setIsSidebarCollapsed(sidebarState === 'true');
    };

    // Check initial state
    handleStorageChange();

    // Listen for changes
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-blue-950 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large glowing orb */}
        <motion.div
          initial={{ opacity: 0.5, scale: 1 }}
          animate={{ 
            opacity: [0.5, 0.3, 0.5],
            scale: [1, 1.2, 1],
            y: [0, -20, 0]
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -top-32 -right-32 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
        />

        {/* Smaller floating elements */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              opacity: 0.1,
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight
            }}
            animate={{ 
              opacity: [0.1, 0.3, 0.1],
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute w-32 h-32 bg-blue-600/10 rounded-full blur-2xl"
          />
        ))}

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      </div>

      <Sidebar />
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`
          transition-all duration-300 ease-in-out 
          relative z-10 p-4 lg:p-8
          ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'}
        `}
      >
        {children}
      </motion.main>
    </div>
  );
};

export default PageTemplate;