"use client"
import React, { useState, useEffect } from 'react';
import AuthWrapper from '@/components/AuthWrapper';
import PageTemplate from '@/components/PageTemplate';
import { adminService } from '@/services/api';
import { Search, FileText, Download, Filter, Calendar, User, CheckCircle, XCircle, List, Grid, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface AuthLog {
  id: string;
  user_id: string;
  email: string;
  ip_address: string;
  user_agent: string;
  status: string;
  created_at: string;
  failure_reason?: string;
}

// AuthWrapper props interface to fix TypeScript error
interface AuthWrapperProps {
  children: React.ReactNode;
  allowedRoles: string[] | readonly string[];
  redirectTo?: string;
}

// Stats Card Component
const StatsCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}> = ({ title, value, icon, color }) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="bg-white/5 backdrop-blur-lg rounded-xl shadow-2xl p-6 flex items-center border border-white/10"
    >
      <div className={`p-3 rounded-lg ${color} mr-4`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-300">{title}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
    </motion.div>
  );
};

// Modal Component
const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 backdrop-blur-lg bg-black/60 z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-gradient-to-br from-gray-900 to-black rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b border-white/10">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose} 
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </motion.button>
        </div>
        <div className="p-6 text-gray-300">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
};

const SignInLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuthLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuthLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('list');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    successful: 0,
    failed: 0
  });

  // Filter options
  const [filterOptions, setFilterOptions] = useState({
    status: '',
    start_date: '',
    end_date: '',
    search: ''
  });
  
  useEffect(() => {
    fetchAuthLogs();
  }, []);
  
  useEffect(() => {
    if (searchTerm) {
      setFilterOptions({...filterOptions, search: searchTerm});
    } else if (filterOptions.search) {
      setFilterOptions({...filterOptions, search: ''});
    }
  }, [searchTerm]);

  useEffect(() => {
    if (Object.values(filterOptions).some(value => value !== '')) {
      applyFilters();
    } else {
      setFilteredLogs(logs);
    }
  }, [filterOptions.status, filterOptions.start_date, filterOptions.end_date, logs]);

  const fetchAuthLogs = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllAuthLogs();
      console.log('response : ', response);
      
      const logsData = response.data.logs || [];
      setLogs(logsData);
      setFilteredLogs(logsData);
      
      // Calculate stats
      const successful = logsData.filter((log: AuthLog) => log.status === 'success').length;
      setStats({
        total: logsData.length,
        successful: successful,
        failed: logsData.length - successful
      });
      
      setError(null);
    } catch (err) {
      console.error('Error fetching auth logs:', err);
      setError('Failed to load authentication logs');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...logs];
    
    // Apply status filter
    if (filterOptions.status) {
      filtered = filtered.filter(log => log.status === filterOptions.status);
    }
    
    // Apply date range filter
    if (filterOptions.start_date) {
      const startDate = new Date(filterOptions.start_date);
      filtered = filtered.filter(log => new Date(log.created_at) >= startDate);
    }
    
    if (filterOptions.end_date) {
      const endDate = new Date(filterOptions.end_date);
      endDate.setHours(23, 59, 59, 999); // End of day
      filtered = filtered.filter(log => new Date(log.created_at) <= endDate);
    }
    
    // Apply search filter
    if (filterOptions.search) {
      const searchLower = filterOptions.search.toLowerCase();
      filtered = filtered.filter(log => 
        log.email.toLowerCase().includes(searchLower) ||
        log.ip_address.toLowerCase().includes(searchLower) ||
        log.user_agent.toLowerCase().includes(searchLower) ||
        (log.failure_reason && log.failure_reason.toLowerCase().includes(searchLower))
      );
    }
    
    setFilteredLogs(filtered);
  };

  const resetFilters = () => {
    setFilterOptions({
      status: '',
      start_date: '',
      end_date: '',
      search: ''
    });
    setSearchTerm('');
    setFilteredLogs(logs);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric', 
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };
  
  // Function to get device/browser info from user agent
  const getDeviceInfo = (userAgent: string) => {
    if (!userAgent) return 'Unknown';
    
    const shortenedUA = userAgent.substring(0, 50);
    return shortenedUA + (userAgent.length > 50 ? '...' : '');
  };

  const exportLogs = () => {
    // Convert logs to CSV
    const headers = ['Date', 'Email', 'IP Address', 'Device', 'Status', 'Reason'];
    const csvContent = [
      headers.join(','),
      ...filteredLogs.map(log => [
        formatDate(log.created_at),
        log.email,
        log.ip_address,
        `"${getDeviceInfo(log.user_agent).replace(/"/g, '""')}"`,
        log.status,
        log.failure_reason || ''
      ].join(','))
    ].join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `signin-logs-${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    // @ts-ignore - Ignoring the error with allowedRoles as requested
    <AuthWrapper allowedRoles={['admin']}>
      <PageTemplate>
        {loading && !logs.length ? (
          <LoadingSpinner fullScreen />
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Sign-In Logs</h1>
              <p className="text-gray-400">Manage sign-in logs</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <StatsCard 
                title="Total Log Entries" 
                value={stats.total} 
                icon={<FileText className="h-6 w-6 text-white" />}
                color="bg-blue-600/10"
              />
              <StatsCard 
                title="Successful Logins" 
                value={stats.successful} 
                icon={<CheckCircle className="h-6 w-6 text-white" />}
                color="bg-green-600/10"
              />
              <StatsCard 
                title="Failed Attempts" 
                value={stats.failed} 
                icon={<XCircle className="h-6 w-6 text-white" />}
                color="bg-red-600/10"
              />
            </div>
          
            {/* Search and Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div className="flex-1 w-full md:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search logs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-2 w-full md:w-auto">
                <Button
                  variant="secondary"
                  icon={Filter}
                  onClick={() => setIsFilterModalOpen(true)}
                >
                  Filter
                </Button>
                
                <Button
                  variant="secondary"
                  icon={Download}
                  onClick={exportLogs}
                >
                  Export
                </Button>
                
                <Button
                  variant="secondary"
                  icon={viewMode === 'grid' ? List : Grid}
                  onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                >
                  {viewMode === 'grid' ? 'List' : 'Grid'}
                </Button>
              </div>
            </div>
            
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-900/20 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl flex items-center mb-6"
              >
                <X size={18} className="mr-2" />
                {error}
              </motion.div>
            )}
            
            {/* Logs Grid/List */}
            {filteredLogs.length === 0 ? (
              <div className="text-center py-12 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10">
                <FileText size={48} className="mx-auto text-gray-500 mb-4" />
                <h3 className="text-xl font-medium text-white">No sign-in logs found</h3>
                <p className="text-gray-400 mt-2">Adjust your filters to see more results</p>
              </div>
            ) : (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                  : 'grid-cols-1'
              }`}>
                <AnimatePresence>
                  {filteredLogs.map((log) => (
                    <motion.div
                      key={log.id} 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      layout
                    >
                      {viewMode === 'grid' ? (
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className="bg-white/5 backdrop-blur-lg rounded-xl shadow-2xl p-5 border border-white/10"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center">
                              <div className={`w-10 h-10 rounded-xl ${log.status === 'success' ? 'bg-gradient-to-br from-green-600 to-green-800' : 'bg-gradient-to-br from-red-600 to-red-800'} flex items-center justify-center text-white font-bold shadow-lg`}>
                                {log.status === 'success' ? <CheckCircle size={18} /> : <XCircle size={18} />}
                              </div>
                              <div className="ml-3">
                                <h3 className="font-semibold text-white">{log.email}</h3>
                                <p className="text-sm text-gray-400">{formatDate(log.created_at)}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                            <div>
                              <p className="text-gray-400">IP Address</p>
                              <p className="font-medium text-white">{log.ip_address}</p>
                            </div>
                            <div>
                              <p className="text-gray-400">Status</p>
                              <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${log.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {log.status === 'success' ? 'Success' : 'Failed'}
                              </span>
                            </div>
                          </div>
                          
                          <div className="border-t border-white/10 pt-3 mt-2">
                            <p className="text-gray-400 text-sm">Device</p>
                            <p className="font-medium text-white text-sm truncate">{getDeviceInfo(log.user_agent)}</p>
                          </div>
                          
                          {log.failure_reason && (
                            <div className="border-t border-white/10 pt-3 mt-2">
                              <p className="text-gray-400 text-sm">Failure Reason</p>
                              <p className="font-medium text-white text-sm">{log.failure_reason}</p>
                            </div>
                          )}
                        </motion.div>
                      ) : (
                        <motion.div
                          whileHover={{ scale: 1.01 }}
                          className="bg-white/5 backdrop-blur-lg rounded-xl shadow-lg p-4 border border-white/10"
                        >
                          <div className="flex flex-col md:flex-row md:items-center justify-between">
                            <div className="flex items-center mb-3 md:mb-0">
                              <div className={`w-10 h-10 rounded-xl ${log.status === 'success' ? 'bg-gradient-to-br from-green-600 to-green-800' : 'bg-gradient-to-br from-red-600 to-red-800'} flex items-center justify-center text-white font-bold shadow-lg mr-4`}>
                                {log.status === 'success' ? <CheckCircle size={18} /> : <XCircle size={18} />}
                              </div>
                              <div>
                                <h3 className="font-semibold text-white">{log.email}</h3>
                                <p className="text-sm text-gray-400">{formatDate(log.created_at)}</p>
                              </div>
                            </div>
                            
                            <div className="flex flex-col md:flex-row md:items-center gap-4">
                              <div className="flex flex-wrap items-center gap-6 text-sm">
                                <div>
                                  <p className="text-gray-400">IP Address</p>
                                  <p className="font-medium text-white">{log.ip_address}</p>
                                </div>
                                <div>
                                  <p className="text-gray-400">Device</p>
                                  <p className="font-medium text-white truncate max-w-xs">{getDeviceInfo(log.user_agent)}</p>
                                </div>
                                <div>
                                  <p className="text-gray-400">Status</p>
                                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${log.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {log.status === 'success' ? 'Success' : 'Failed'}
                                  </span>
                                </div>
                                {log.failure_reason && (
                                  <div>
                                    <p className="text-gray-400">Reason</p>
                                    <p className="font-medium text-white">{log.failure_reason}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            {/* Filter Modal */}
            <Modal 
              isOpen={isFilterModalOpen}
              onClose={() => setIsFilterModalOpen(false)}
              title="Filter Sign-In Logs"
            >
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Status
                    </label>
                    <select
                      value={filterOptions.status}
                      onChange={(e) => setFilterOptions({...filterOptions, status: e.target.value})}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">All</option>
                      <option value="success">Success</option>
                      <option value="fail">Failed</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={filterOptions.start_date}
                      onChange={(e) => setFilterOptions({...filterOptions, start_date: e.target.value})}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={filterOptions.end_date}
                      onChange={(e) => setFilterOptions({...filterOptions, end_date: e.target.value})}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <Button
                    variant="secondary"
                    onClick={resetFilters}
                  >
                    Reset Filters
                  </Button>
                  
                  <div className="flex gap-4">
                    <Button
                      variant="secondary"
                      onClick={() => setIsFilterModalOpen(false)}
                    >
                      Cancel
                    </Button>
                    
                    <Button
                      variant="primary"
                      onClick={() => {
                        applyFilters();
                        setIsFilterModalOpen(false);
                      }}
                    >
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </div>
            </Modal>
          </>
        )}
      </PageTemplate>
    </AuthWrapper>
  );
};

export default SignInLogs; 