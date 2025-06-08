"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { authService } from '@/services/api';
import { 
  AlertTriangle, Home, LogOut, Lock, 
  Info, XCircle, AlertOctagon, HelpCircle, 
  ChevronRight, Fingerprint, Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Unauthorized() {
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [activeParticles, setActiveParticles] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    // Trigger animations sequence
    const timer = setTimeout(() => {
      setActiveParticles(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    authService.logout();
  };

  const MotionBackground = () => (
    <div className="absolute inset-0 overflow-hidden z-0">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-blue-950 opacity-90"></div>
      
      {/* Animated grid */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem]"
      />
      
      {/* Radial glow */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.7 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-r from-blue-600/20 to-blue-900/30 blur-3xl rounded-full"
      />

      {/* Digital circuit lines */}
      <svg className="absolute inset-0 w-full h-full z-0 opacity-20" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <motion.path
            id="circuit-path-1"
            d="M0,100 Q50,50 100,100 T200,100 T300,100 T400,100"
            stroke="#4f46e5"
            strokeWidth="2"
            fill="none"
            animate={{ 
              pathLength: [0, 1],
              opacity: [0, 1, 0.5]
            }}
            transition={{ 
              duration: 5,
              repeat: Infinity,
              repeatDelay: 1
            }}
          />
          <motion.path
            id="circuit-path-2"
            d="M50,0 Q100,50 100,100 Q100,150 150,150 H300"
            stroke="#06b6d4"
            strokeWidth="2"
            fill="none"
            animate={{ 
              pathLength: [0, 1],
              opacity: [0, 1, 0.5]
            }}
            transition={{ 
              duration: 7,
              repeat: Infinity,
              repeatDelay: 0.5,
              delay: 1
            }}
          />
        </defs>
        <use href="#circuit-path-1" x="0" y="0" />
        <use href="#circuit-path-1" x="400" y="200" />
        <use href="#circuit-path-2" x="100" y="50" />
        <use href="#circuit-path-2" x="200" y="300" transform="rotate(180 300 300)" />
      </svg>
    </div>
  );

  const FloatingParticles = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {activeParticles && [...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: 0,
            scale: 0
          }}
          animate={{ 
            y: [null, Math.random() * -500 - 100],
            opacity: [0, 0.7, 0],
            scale: [0, Math.random() * 1.5 + 0.5, 0]
          }}
          transition={{
            duration: Math.random() * 8 + 4,
            delay: Math.random() * 3,
            repeat: Infinity,
            repeatDelay: Math.random() * 5
          }}
          className={`absolute w-${Math.ceil(Math.random() * 6)} h-${Math.ceil(Math.random() * 6)} rounded-full 
            ${i % 3 === 0 ? 'bg-blue-400' : i % 3 === 1 ? 'bg-blue-500' : 'bg-white'}`}
        />
      ))}
    </div>
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-black flex flex-col items-center justify-center text-white">
      {/* Background elements */}
      <MotionBackground />
      <FloatingParticles />

      {/* Main Content Area */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        onAnimationComplete={() => setAnimationComplete(true)}
        className="relative z-10 w-full max-w-md px-6"
      >
        {/* Main Security Badge */}
        <motion.div
          initial={{ scale: 0.5, rotateY: 90 }}
          animate={{ scale: 1, rotateY: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 100,
            delay: 0.5 
          }}
          className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(29,78,216,0.5)]"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border-2 border-dashed border-white/30"
          />
          <AlertTriangle size={40} className="text-white" />
        </motion.div>

        {/* Title & Message */}
        <motion.div 
          className="text-center space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-blue-600">
            Access Denied
          </h1>

          <div className="h-1 w-24 mx-auto bg-gradient-to-r from-blue-400 to-blue-600 rounded-full" />
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            className="text-white/80 px-4"
          >
            You don't have permission to access this resource. Please contact your administrator if you believe this is an error.
          </motion.p>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8 }}
          className="mt-8 space-y-4"
        >
          <Link 
            href="/"
            className="group flex items-center justify-center w-full py-4 px-6 rounded-xl bg-transparent border border-blue-500/50 hover:border-blue-400 text-blue-400 hover:text-white font-medium transition-all duration-300 relative overflow-hidden shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></span>
            <Home size={18} className="mr-2 group-hover:scale-110 transition-transform duration-300" />
            <span className="relative z-10">Return to Home</span>
          </Link>
          
          <button
            onClick={handleLogout}
            className="group flex items-center justify-center w-full py-4 px-6 rounded-xl bg-transparent border border-red-500/50 hover:border-red-400 text-red-400 hover:text-white font-medium transition-all duration-300 relative overflow-hidden shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:shadow-[0_0_20px_rgba(239,68,68,0.5)]"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-red-600 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></span>
            <LogOut size={18} className="mr-2 group-hover:scale-110 transition-transform duration-300" />
            <span className="relative z-10">Logout</span>
          </button>

          <div className="flex justify-center gap-3 pt-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowErrorModal(true)}
              className="relative group overflow-hidden px-4 py-2.5 rounded-lg bg-gradient-to-br from-black to-gray-800 border border-white/10 hover:border-white/20 shadow-lg transition-all duration-300"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-red-500/20 to-red-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
              <div className="relative flex items-center justify-center z-10">
                <Info size={16} className="mr-2 text-red-400" />
                <span className="text-white/90 group-hover:text-white text-sm font-medium">Error Details</span>
              </div>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowHelpModal(true)}
              className="relative group overflow-hidden px-4 py-2.5 rounded-lg bg-gradient-to-br from-black to-gray-800 border border-white/10 hover:border-white/20 shadow-lg transition-all duration-300"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-500/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
              <div className="relative flex items-center justify-center z-10">
                <HelpCircle size={16} className="mr-2 text-blue-400" />
                <span className="text-white/90 group-hover:text-white text-sm font-medium">Get Help</span>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSecurityModal(true)}
              className="relative group overflow-hidden px-4 py-2.5 rounded-lg bg-gradient-to-br from-black to-gray-800 border border-white/10 hover:border-white/20 shadow-lg transition-all duration-300"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-500/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
              <div className="relative flex items-center justify-center z-10">
                <Shield size={16} className="mr-2 text-purple-400" />
                <span className="text-white/90 group-hover:text-white text-sm font-medium">Security</span>
              </div>
            </motion.button>
          </div>
        </motion.div>
      </motion.div>

      {/* Floating elements */}
      {animationComplete && (
        <>
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 2.2, duration: 0.8 }}
            className="absolute top-24 left-8 w-20 h-20 bg-white/5 backdrop-blur-md rounded-2xl flex items-center justify-center"
          >
            <Lock className="w-8 h-8 text-white/70" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 2.4, duration: 0.8 }}
            className="absolute top-36 right-8 w-24 h-24 bg-white/5 backdrop-blur-md rounded-2xl flex items-center justify-center"
          >
            <AlertOctagon className="w-10 h-10 text-white/70" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.6, duration: 0.8 }}
            className="absolute bottom-16 left-16 w-16 h-16 bg-white/5 backdrop-blur-md rounded-2xl flex items-center justify-center"
          >
            <Fingerprint className="w-8 h-8 text-white/70" />
          </motion.div>
        </>
      )}

      {/* Error Details Modal */}
      <AnimatePresence>
        {showErrorModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-md rounded-2xl bg-gradient-to-b from-gray-800 to-gray-900 p-6 shadow-2xl border border-white/10"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                    <AlertTriangle size={18} className="text-red-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Error Details</h3>
                </div>
                <button 
                  onClick={() => setShowErrorModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <XCircle size={24} />
                </button>
              </div>

              <div className="space-y-4 text-gray-300 text-sm">
                <div className="space-y-1">
                  <p className="font-medium text-gray-400">Error Code</p>
                  <p className="font-mono bg-red-500/10 py-1 px-2 rounded">ERR_ACCESS_DENIED</p>
                </div>

                <div className="space-y-1">
                  <p className="font-medium text-gray-400">Description</p>
                  <p>Your account doesn't have the required permissions to view this resource.</p>
                </div>

                <div className="space-y-1">
                  <p className="font-medium text-gray-400">Possible Solutions</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Contact your administrator for access</li>
                    <li>Try logging in with a different account</li>
                    <li>Verify you're accessing the correct URL</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowErrorModal(false)}
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-500/20 to-blue-600/20 hover:from-blue-500/30 hover:to-blue-600/30 rounded-lg transition-colors text-white border border-white/10 hover:border-white/20 flex items-center font-medium shadow-lg"
                >
                  <XCircle size={16} className="mr-2" /> Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Help Modal */}
      <AnimatePresence>
        {showHelpModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-md rounded-2xl bg-gradient-to-b from-blue-800 to-blue-900 p-6 shadow-2xl border border-white/10"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <HelpCircle size={18} className="text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Need Help?</h3>
                </div>
                <button 
                  onClick={() => setShowHelpModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <XCircle size={24} />
                </button>
              </div>

              <div className="space-y-4 text-gray-300">
                <p>If you're experiencing issues accessing this resource, our support team is here to help.</p>

                <div className="bg-blue-500/10 rounded-lg p-4 space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p>support@fitrosa.com</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <p>+1 (555) 123-4567</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowHelpModal(false)}
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-500/20 to-blue-600/20 hover:from-blue-500/30 hover:to-blue-600/30 rounded-lg transition-colors text-white border border-white/10 hover:border-white/20 flex items-center font-medium shadow-lg"
                >
                  <XCircle size={16} className="mr-2" /> Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Security Info Modal */}
      <AnimatePresence>
        {showSecurityModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-md rounded-2xl bg-gradient-to-b from-purple-800 to-purple-900 p-6 shadow-2xl border border-white/10"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <Shield size={18} className="text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Security Information</h3>
                </div>
                <button 
                  onClick={() => setShowSecurityModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <XCircle size={24} />
                </button>
              </div>

              <div className="space-y-4 text-gray-300">
                <p>Fitrosa takes security seriously. Here's why you might be seeing this screen:</p>

                <div className="space-y-3">
                  {['Restricted Area', 'Invalid Credentials', 'Role-Based Permission'].map((item, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * i }}
                      className="flex items-center space-x-2 bg-purple-500/10 p-3 rounded-lg"
                    >
                      <ChevronRight size={16} className="text-purple-400" />
                      <span>{item}</span>
                    </motion.div>
                  ))}
                </div>
                
                <p className="text-sm text-white/70 mt-4">
                  Remember that your security is our priority. If you believe you should have access to this page, please contact your administrator.
                </p>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowSecurityModal(false)}
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-500/20 to-blue-600/20 hover:from-blue-500/30 hover:to-blue-600/30 rounded-lg transition-colors text-white border border-white/10 hover:border-white/20 flex items-center font-medium shadow-lg"
                >
                  <XCircle size={16} className="mr-2" /> Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}