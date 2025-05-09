"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService,
 // notificationService
 } from '@/services/api';
import AuthWrapper from '@/components/AuthWrapper';
import PageTemplate from '@/components/PageTemplate';
import { 
  Save, 
  User, 
  Lock, 
  Bell, 
  Moon, 
  Sun, 
  Globe, 
  Shield, 
  LogOut, 
  ChevronRight,
  Mail,
  Check,
  X
} from 'lucide-react';

export default function Settings() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('account');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    timezone: 'UTC',
    language: 'English'
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    appNotifications: true,
    marketingEmails: false
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [saveAnimation, setSaveAnimation] = useState(false);

  useEffect(() => {
    // Simulate loading user data
    const fetchUserData = async () => {
      try {
        const userData = await authService.getProfile();
        setProfileData({
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          email: userData.email || '',
          timezone: userData.timezone || 'UTC',
          language: userData.language || 'English'
        });
        
        // Get notification preferences
     //   const notifSettings = await notificationService.getPreferences();
     //   setNotifications(notifSettings);
        
        // Get theme preferences
     //   const userPreferences = await userService.getPreferences();
     //   setIsDarkMode(userPreferences.darkMode || false);
      } catch (err) {
        console.error('Failed to load user data', err);
      }
    };
    
    fetchUserData();
  }, []);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotifications(prev => ({ ...prev, [name]: checked }));
  };

  const handleToggleDarkMode = async () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    try {
      //await userService.updatePreferences({ darkMode: newMode });
    } catch (err) {
      console.error('Failed to update theme preference', err);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      //await userService.updateProfile(profileData);
      setSuccess('Profile successfully updated');
      setSaveAnimation(true);
      //setTimeout(() => setSaveAnimation(false), 2000);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Validate passwords match
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setError('New passwords do not match');
        setLoading(false);
        return;
      }

      
      // Call change password API
      await authService.changePassword(
        passwordData.currentPassword, 
        passwordData.newPassword
      );
      setSuccess('Password successfully changed');
      
      // Clear form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
    } catch (err) {
      setError(err.message || 'Failed to change password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotifications = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
     // await notificationService.updatePreferences(notifications);
      setSuccess('Notification preferences updated');
      setSaveAnimation(true);
      setTimeout(() => setSaveAnimation(false), 2000);
    } catch (err) {
      setError(err.message || 'Failed to update notification preferences');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      router.push('/login');
    } catch (err) {
      setError('Failed to logout. Please try again.');
    }
  };

  return (
    <AuthWrapper>
      <PageTemplate>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Sidebar */}
              <div className="w-full md:w-64 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 h-fit">
                <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">Settings</h2>
                
                <nav className="space-y-1">
                  <button 
                    onClick={() => setActiveTab('account')}
                    className={`flex items-center w-full px-4 py-3 text-left rounded-md transition-colors ${
                      activeTab === 'account' 
                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-200' 
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200'
                    }`}
                  >
                    <User size={18} className="mr-3" />
                    <span>Account</span>
                    <ChevronRight size={18} className="ml-auto" />
                  </button>
                  
                  <button 
                    onClick={() => setActiveTab('security')}
                    className={`flex items-center w-full px-4 py-3 text-left rounded-md transition-colors ${
                      activeTab === 'security' 
                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-200' 
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200'
                    }`}
                  >
                    <Lock size={18} className="mr-3" />
                    <span>Security</span>
                    <ChevronRight size={18} className="ml-auto" />
                  </button>
                  
                  <button 
                    onClick={() => setActiveTab('notifications')}
                    className={`flex items-center w-full px-4 py-3 text-left rounded-md transition-colors ${
                      activeTab === 'notifications' 
                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-200' 
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200'
                    }`}
                  >
                    <Bell size={18} className="mr-3" />
                    <span>Notifications</span>
                    <ChevronRight size={18} className="ml-auto" />
                  </button>
                  
                  <button 
                    onClick={() => setActiveTab('appearance')}
                    className={`flex items-center w-full px-4 py-3 text-left rounded-md transition-colors ${
                      activeTab === 'appearance' 
                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-200' 
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200'
                    }`}
                  >
                    {isDarkMode ? <Moon size={18} className="mr-3" /> : <Sun size={18} className="mr-3" />}
                    <span>Appearance</span>
                    <ChevronRight size={18} className="ml-auto" />
                  </button>
                </nav>
                
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button 
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-3 text-left rounded-md transition-colors text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                  >
                    <LogOut size={18} className="mr-3" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
              
              {/* Main Content Area */}
              <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                {/* Status Messages */}
                {error && (
                  <div className="mb-6 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded flex items-center justify-between">
                    <div className="flex items-center">
                      <X size={18} className="mr-2" />
                      <span>{error}</span>
                    </div>
                    <button onClick={() => setError('')} className="text-red-700 dark:text-red-400">
                      <X size={16} />
                    </button>
                  </div>
                )}

                {success && (
                  <div className="mb-6 bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-400 px-4 py-3 rounded flex items-center justify-between">
                    <div className="flex items-center">
                      <Check size={18} className="mr-2" />
                      <span>{success}</span>
                    </div>
                    <button onClick={() => setSuccess('')} className="text-green-700 dark:text-green-400">
                      <X size={16} />
                    </button>
                  </div>
                )}
                
                {/* Account Tab */}
                {activeTab === 'account' && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Account Settings</h2>
                      <button
                        onClick={handleSaveProfile}
                        disabled={loading}
                        className={`inline-flex items-center px-4 py-2 rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all ${
                          saveAnimation ? 'bg-green-600 hover:bg-green-700' : ''
                        }`}
                      >
                        {saveAnimation ? (
                          <>
                            <Check size={18} className="mr-2" />
                            Saved
                          </>
                        ) : (
                          <>
                            <Save size={18} className="mr-2" />
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>

                    <form onSubmit={handleSaveProfile} className="space-y-6">
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="w-full md:w-1/2">
                          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            First Name
                          </label>
                          <input
                            id="firstName"
                            name="firstName"
                            type="text"
                            value={profileData.firstName}
                            onChange={handleProfileChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          />
                        </div>

                        <div className="w-full md:w-1/2">
                          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Last Name
                          </label>
                          <input
                            id="lastName"
                            name="lastName"
                            type="text"
                            value={profileData.lastName}
                            onChange={handleProfileChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Email Address
                        </label>
                        <div className="flex">
                          <div className="relative flex-grow">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Mail size={18} className="text-gray-400" />
                            </div>
                            <input
                              id="email"
                              name="email"
                              type="email"
                              value={profileData.email}
                              onChange={handleProfileChange}
                              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="w-full md:w-1/2">
                          <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Language
                          </label>
                          <select
                            id="language"
                            name="language"
                            value={profileData.language}
                            onChange={handleProfileChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          >
                            <option value="English">English</option>
                            <option value="Spanish">Spanish</option>
                            <option value="French">French</option>
                            <option value="German">German</option>
                            <option value="Chinese">Chinese</option>
                          </select>
                        </div>

                        <div className="w-full md:w-1/2">
                          <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Timezone
                          </label>
                          <select
                            id="timezone"
                            name="timezone"
                            value={profileData.timezone}
                            onChange={handleProfileChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          >
                            <option value="UTC">UTC (GMT+0)</option>
                            <option value="EST">Eastern Standard Time (GMT-5)</option>
                            <option value="CST">Central Standard Time (GMT-6)</option>
                            <option value="MST">Mountain Standard Time (GMT-7)</option>
                            <option value="PST">Pacific Standard Time (GMT-8)</option>
                          </select>
                        </div>
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md mt-6 border border-gray-200 dark:border-gray-600">
                        <h3 className="font-medium text-gray-800 dark:text-white mb-2">Account Information</h3>
                        <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                          <p>Account type: <span className="font-medium">Premium</span></p>
                          <p>Member since: <span className="font-medium">May 2023</span></p>
                          <p>Last login: <span className="font-medium">Today, 9:45 AM</span></p>
                        </div>
                      </div>
                    </form>
                  </div>
                )}
                
                {/* Security Tab */}
                {activeTab === 'security' && (
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Security Settings</h2>

                    <div className="space-y-8">
                      <div className="bg-white dark:bg-gray-800 rounded-md">
                        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Change Password</h3>
                        
                        <form onSubmit={handleChangePassword} className="space-y-4">
                          <div>
                            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Current Password
                            </label>
                            <input
                              id="currentPassword"
                              name="currentPassword"
                              type="password"
                              required
                              value={passwordData.currentPassword}
                              onChange={handlePasswordChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                          </div>

                          <div className="flex flex-col md:flex-row gap-4">
                            <div className="w-full md:w-1/2">
                              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                New Password
                              </label>
                              <input
                                id="newPassword"
                                name="newPassword"
                                type="password"
                                required
                                value={passwordData.newPassword}
                                onChange={handlePasswordChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                              />
                            </div>

                            <div className="w-full md:w-1/2">
                              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Confirm New Password
                              </label>
                              <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                value={passwordData.confirmPassword}
                                onChange={handlePasswordChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                              />
                            </div>
                          </div>

                          <div className="pt-2">
                            <button
                              type="submit"
                              disabled={loading}
                              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
                            >
                              {loading ? 'Updating...' : 'Update Password'}
                            </button>
                          </div>
                        </form>
                      </div>

                      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Two-Factor Authentication</h3>
                        
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4 mb-6">
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <Shield size={24} className="text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="ml-3">
                              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">Enhance Your Account Security</h3>
                              <div className="mt-2 text-sm text-blue-700 dark:text-blue-400">
                                <p>Two-factor authentication adds an extra layer of security to your account. In addition to your password, you'll need to enter a code from your phone.</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <button
                          type="button"
                          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          Enable Two-Factor Authentication
                        </button>
                      </div>

                      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Session Management</h3>
                        
                        <div className="space-y-4">
                          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md border border-gray-200 dark:border-gray-600 flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-800 dark:text-white">Current Session</p>
                              <p className="text-sm text-gray-600 dark:text-gray-300">Chrome on Windows • IP: 192.168.1.x</p>
                            </div>
                            <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs rounded-full">Active</span>
                          </div>
                          
                          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md border border-gray-200 dark:border-gray-600 flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-800 dark:text-white">Safari on iPhone</p>
                              <p className="text-sm text-gray-600 dark:text-gray-300">Mobile • Last active: 2 days ago</p>
                            </div>
                            <button className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium">Revoke</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Notification Preferences</h2>
                      <button
                        onClick={handleSaveNotifications}
                        disabled={loading}
                        className={`inline-flex items-center px-4 py-2 rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all ${
                          saveAnimation ? 'bg-green-600 hover:bg-green-700' : ''
                        }`}
                      >
                        {saveAnimation ? (
                          <>
                            <Check size={18} className="mr-2" />
                            Saved
                          </>
                        ) : (
                          <>
                            <Save size={18} className="mr-2" />
                            Save Preferences
                          </>
                        )}
                      </button>
                    </div>

                    <form onSubmit={handleSaveNotifications} className="space-y-6">
                      <div className="bg-white dark:bg-gray-800 rounded-md">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700">
                            <div>
                              <h3 className="text-base font-medium text-gray-800 dark:text-white">Email Updates</h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Receive updates about your account via email</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input 
                                type="checkbox" 
                                name="emailUpdates"
                                checked={notifications.emailUpdates} 
                                onChange={handleNotificationChange}
                                className="sr-only peer" 
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                          
                          <div className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700">
                            <div>
                              <h3 className="text-base font-medium text-gray-800 dark:text-white">App Notifications</h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Receive in-app notifications and alerts</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input 
                                type="checkbox" 
                                name="appNotifications"
                                checked={notifications.appNotifications} 
                                onChange={handleNotificationChange}
                                className="sr-only peer" 
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                          
                          <div className="flex items-center justify-between py-4">
                            <div>
                              <h3 className="text-base font-medium text-gray-800 dark:text-white">Marketing Emails</h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Receive promotional emails and special offers</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input 
                                type="checkbox" 
                                name="marketingEmails"
                                checked={notifications.marketingEmails} 
                                onChange={handleNotificationChange}
                                className="sr-only peer" 
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800                               rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md border border-gray-200 dark:border-gray-600">
                        <h3 className="font-medium text-gray-800 dark:text-white mb-3">Notification Preferences</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Customize how and when you receive notifications from our service.
                        </p>
                      </div>
                    </form>
                  </div>
                )}
                
                {/* Appearance Tab */}
                {activeTab === 'appearance' && (
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Appearance Settings</h2>
                    
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Theme Preferences</h3>
                        
                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600">
                          <div>
                            <p className="font-medium text-gray-800 dark:text-white">Dark Mode</p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {isDarkMode ? 'Currently using dark theme' : 'Currently using light theme'}
                            </p>
                          </div>
                          <button
                            onClick={handleToggleDarkMode}
                            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                              isDarkMode ? 'bg-blue-600' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`inline-block w-4 h-4 transform transition-transform bg-white rounded-full ${
                                isDarkMode ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Accent Color</h3>
                        
                        <div className="grid grid-cols-5 gap-3">
                          {['blue', 'green', 'purple', 'red', 'orange'].map((color) => (
                            <button
                              key={color}
                              className={`h-10 rounded-md bg-${color}-500 hover:bg-${color}-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${color}-500`}
                              aria-label={`${color} theme`}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Preview</h3>
                        
                        <div className={`p-6 rounded-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'} border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                          <div className="flex items-center justify-between mb-4">
                            <h4 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              Theme Preview
                            </h4>
                            <button
                              className={`px-3 py-1 rounded-md text-sm font-medium ${
                                isDarkMode 
                                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                                  : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                              }`}
                            >
                              Action
                            </button>
                          </div>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            This is how UI elements will appear with your current theme settings.
                          </p>
                          <div className={`mt-4 p-3 rounded ${isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-700'} text-sm`}>
                            Sample notification message
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </PageTemplate>
    </AuthWrapper>
  );
}