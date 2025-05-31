"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService, userService } from '@/services/api';
import AuthWrapper from '@/components/AuthWrapper';
import PageTemplate from '@/components/PageTemplate';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Save, 
  User, 
  Lock, 
  Shield, 
  LogOut, 
  ChevronRight,
  Mail,
  Check,
  X,
  Camera
} from 'lucide-react';

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  timezone: string;
  language: string;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function Settings() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('account');
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: '',
    lastName: '',
    email: '',
    timezone: 'UTC',
    language: 'English'
  });
  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [saveAnimation, setSaveAnimation] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = (await authService.getProfile() as unknown) as ProfileData;
        setProfileData({
          firstName: userData?.firstName || '',
          lastName: userData?.lastName || '',
          email: userData?.email || '',
          timezone: userData?.timezone || 'UTC',
          language: userData?.language || 'English'
        });
      } catch (err) {
        console.error('Failed to load user data', err instanceof Error ? err.message : 'Unknown error');
      }
    };
    
    fetchUserData();
  }, []);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await userService.updateProfile(profileData);
      setSuccess('Profile successfully updated');
      setSaveAnimation(true);
      setTimeout(() => setSaveAnimation(false), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setError('New passwords do not match');
        setLoading(false);
        return;
      }

      await authService.changePassword(
        passwordData.currentPassword, 
        passwordData.newPassword
      );
      setSuccess('Password successfully changed');
      
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to change password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      router.push('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to logout. Please try again.');
    }
  };

  return (
    <AuthWrapper>
      <PageTemplate>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row gap-6"
          >
            {/* Sidebar */}
            <motion.div 
              layout
              className="w-full md:w-64 bg-white/5 backdrop-blur-lg rounded-2xl shadow-2xl p-4 h-fit border border-white/10"
            >
              <h2 className="text-2xl font-bold mb-6 text-white">Settings</h2>
              
              <nav className="space-y-2">
                <motion.button 
                  whileHover={{ x: 5 }}
                  onClick={() => setActiveTab('account')}
                  className={`flex items-center w-full px-4 py-3 text-left rounded-xl transition-all ${
                    activeTab === 'account' 
                      ? 'bg-gradient-to-r from-blue-900/50 to-blue-800/30 text-white border-r-4 border-blue-400' 
                      : 'hover:bg-white/5 text-gray-300 hover:text-white'
                  }`}
                >
                  <User size={18} className="mr-3" />
                  <span>Account</span>
                  <ChevronRight size={18} className="ml-auto" />
                </motion.button>
                
                <motion.button 
                  whileHover={{ x: 5 }}
                  onClick={() => setActiveTab('security')}
                  className={`flex items-center w-full px-4 py-3 text-left rounded-xl transition-all ${
                    activeTab === 'security' 
                      ? 'bg-gradient-to-r from-blue-900/50 to-blue-800/30 text-white border-r-4 border-blue-400' 
                      : 'hover:bg-white/5 text-gray-300 hover:text-white'
                  }`}
                >
                  <Lock size={18} className="mr-3" />
                  <span>Security</span>
                  <ChevronRight size={18} className="ml-auto" />
                </motion.button>

                <motion.button 
                  whileHover={{ x: 5 }}
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-3 text-left rounded-xl text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-all"
                >
                  <LogOut size={18} className="mr-3" />
                  <span>Logout</span>
                </motion.button>
              </nav>
            </motion.div>

            {/* Main Content */}
            <motion.div 
              layout
              className="flex-1 bg-white/5 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-white/10"
            >
              <AnimatePresence mode="wait">
                {activeTab === 'account' && (
                  <motion.div
                    key="account"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-bold text-white">Account Settings</h3>
                      {success && (
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center text-green-400 bg-green-900/20 px-4 py-2 rounded-xl"
                        >
                          <Check size={18} className="mr-2" />
                          {success}
                        </motion.div>
                      )}
                    </div>

                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-900/20 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl flex items-center"
                      >
                        <X size={18} className="mr-2" />
                        {error}
                      </motion.div>
                    )}

                    <form onSubmit={handleSaveProfile} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">
                            First Name
                          </label>
                          <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={profileData.firstName}
                            onChange={handleProfileChange}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="Enter your first name"
                          />
                        </div>
                        <div>
                          <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">
                            Last Name
                          </label>
                          <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={profileData.lastName}
                            onChange={handleProfileChange}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="Enter your last name"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={profileData.email}
                          onChange={handleProfileChange}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="Enter your email"
                        />
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center items-center px-6 py-3 bg-gradient-to-r from-black to-blue-900 hover:from-blue-900 hover:to-black text-white rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            Save Changes
                            <Save size={18} className="ml-2" />
                          </>
                        )}
                      </motion.button>
                    </form>
                  </motion.div>
                )}

                {activeTab === 'security' && (
                  <motion.div
                    key="security"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-bold text-white">Security Settings</h3>
                      {success && (
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center text-green-400 bg-green-900/20 px-4 py-2 rounded-xl"
                        >
                          <Check size={18} className="mr-2" />
                          {success}
                        </motion.div>
                      )}
                    </div>

                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-900/20 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl flex items-center"
                      >
                        <X size={18} className="mr-2" />
                        {error}
                      </motion.div>
                    )}

                    <form onSubmit={handleChangePassword} className="space-y-6">
                      <div>
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-300 mb-2">
                          Current Password
                        </label>
                        <input
                          type="password"
                          id="currentPassword"
                          name="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="Enter your current password"
                        />
                      </div>

                      <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-2">
                          New Password
                        </label>
                        <input
                          type="password"
                          id="newPassword"
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="Enter your new password"
                        />
                      </div>

                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          id="confirmPassword"
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="Confirm your new password"
                        />
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center items-center px-6 py-3 bg-gradient-to-r from-black to-blue-900 hover:from-blue-900 hover:to-black text-white rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            Update Password
                            <Shield size={18} className="ml-2" />
                          </>
                        )}
                      </motion.button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </div>
      </PageTemplate>
    </AuthWrapper>
  );
}