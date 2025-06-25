"use client"

import React, { useEffect, useState } from 'react';
import { financialService, adminService } from '@/services/api';
import { Search, PlusCircle, Download, Trash2, Edit, Filter, Calendar, DollarSign, PieChart, TrendingUp, TrendingDown, Plus, X, List, Grid } from 'lucide-react';
import AuthWrapper from '@/components/AuthWrapper';
import PageTemplate from "@/components/PageTemplate";
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

// Transaction interface
interface Transaction {
  id: number;
  transaction_type: string;
  user_id: number | null;
  amount: number;
  currency: string;
  description: string;
  transaction_date: string;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: {
      id: number;
      roleName: string;
    }
  } | null;
}

// User interface
interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: {
    id: number;
    roleName: string;
  };
}

// Transaction form data
interface TransactionFormData {
  transaction_type: string;
  user_id: string;
  amount: string;
  currency: string;
  description: string;
  transaction_date: string;
}

// Summary data
interface SummaryData {
  totalTransactions: number;
  incomeTotal: {
    amount: number;
    count: number;
  };
  expenseTotal: {
    amount: number;
    count: number;
  };
  netTotal: number;
  typeBreakdown: Array<{
    transaction_type: string;
    _sum: { amount: number };
    _count: { id: number };
  }>;
  currencyBreakdown: Array<{
    currency: string;
    _sum: { amount: number };
    _count: { id: number };
  }>;
}

// Filter state
interface FilterOptions {
  transaction_type: string;
  min_amount: string;
  max_amount: string;
  start_date: string;
  end_date: string;
  currency: string;
  search: string;
  [key: string]: string;  // Index signature to allow dynamic property access
}

// AuthWrapper props interface
interface AuthWrapperProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  redirectTo?: string;
}

// API response interfaces
interface ApiResponse<T> {
  data?: T;
  users?: User[];
  message?: string;
}

// Utility function to format dates
const formatDate = (dateString: string): string => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

// Utility function to format currency
const formatCurrency = (amount: number, currency: string): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
    minimumFractionDigits: 2
  }).format(amount);
};

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

// Transaction Card Component
const TransactionCard: React.FC<{
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
}> = ({ transaction, onEdit, onDelete }) => {
  // Determine if amount is positive or negative for styling
  const isPositive = transaction.amount >= 0;
  const amountColor = isPositive ? "text-green-400" : "text-red-400";
  
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="bg-white/5 backdrop-blur-lg rounded-xl shadow-2xl p-5 border border-white/10"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          <div className={`w-10 h-10 rounded-xl ${isPositive ? 'bg-gradient-to-br from-green-600 to-green-800' : 'bg-gradient-to-br from-red-600 to-red-800'} flex items-center justify-center text-white font-bold shadow-lg`}>
            {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          </div>
          <div className="ml-3">
            <h3 className="font-semibold text-white capitalize">{transaction.transaction_type.replace('_', ' ')}</h3>
            <p className="text-sm text-gray-400">{formatDate(transaction.transaction_date)}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onEdit(transaction)}
            className="text-gray-400 hover:text-blue-500 transition-colors p-1 hover:bg-white/10 rounded"
          >
            <Edit size={16} />
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDelete(transaction)}
            className="text-gray-400 hover:text-red-500 transition-colors p-1 hover:bg-white/10 rounded"
          >
            <Trash2 size={16} />
          </motion.button>
        </div>
      </div>
      
      <div className="mb-3">
        <p className={`text-lg font-bold ${amountColor}`}>
          {formatCurrency(transaction.amount, transaction.currency)}
        </p>
      </div>

      <div className="mb-3">
        <p className="text-sm text-gray-400 line-clamp-2">{transaction.description}</p>
      </div>
      
      {transaction.user && (
        <div className="border-t border-white/10 pt-3 mt-2 flex justify-between">
          <div className="flex items-center text-xs text-gray-400">
            <span>User: {transaction.user.firstName} {transaction.user.lastName}</span>
          </div>
          <div className="flex items-center text-xs text-gray-400">
            <span>Role: {transaction.user.role?.roleName}</span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

// Transaction List Item Component
const TransactionListItem: React.FC<{
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
}> = ({ transaction, onEdit, onDelete }) => {
  // Determine if amount is positive or negative for styling
  const isPositive = transaction.amount >= 0;
  const amountColor = isPositive ? "text-green-400" : "text-red-400";
  
  return (
    <motion.div 
      whileHover={{ scale: 1.01 }}
      className="bg-white/5 backdrop-blur-lg rounded-xl shadow-lg p-4 border border-white/10 mb-4"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div className="flex items-center mb-3 md:mb-0">
          <div className={`w-10 h-10 rounded-xl ${isPositive ? 'bg-gradient-to-br from-green-600 to-green-800' : 'bg-gradient-to-br from-red-600 to-red-800'} flex items-center justify-center text-white font-bold shadow-lg mr-4`}>
            {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          </div>
          <div>
            <h3 className="font-semibold text-white capitalize">{transaction.transaction_type.replace('_', ' ')}</h3>
            <p className="text-sm text-gray-400">{formatDate(transaction.transaction_date)}</p>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex flex-col md:items-end">
            <p className={`text-lg font-bold ${amountColor}`}>
              {formatCurrency(transaction.amount, transaction.currency)}
            </p>
            <p className="text-sm text-gray-400 line-clamp-1 max-w-xs">
              {transaction.description}
            </p>
          </div>
          
          {transaction.user && (
            <div className="flex flex-col md:items-end border-l border-white/10 pl-4 ml-2">
              <p className="text-sm text-gray-300">
                {transaction.user.firstName} {transaction.user.lastName}
              </p>
              <p className="text-xs text-gray-400">
                {transaction.user.role?.roleName}
              </p>
            </div>
          )}
          
          <div className="flex space-x-2 ml-4">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onEdit(transaction)}
              className="text-gray-400 hover:text-blue-500 transition-colors p-1 hover:bg-white/10 rounded"
            >
              <Edit size={16} />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onDelete(transaction)}
              className="text-gray-400 hover:text-red-500 transition-colors p-1 hover:bg-white/10 rounded"
            >
              <Trash2 size={16} />
            </motion.button>
          </div>
        </div>
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

// Main Component
const FinancialTransactionsPage = () => {
  // State for transactions
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // State for users
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  
  // State for summary data
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [summaryPeriod, setSummaryPeriod] = useState<'all' | 'year' | 'month' | 'week' | 'day'>('all');
  
  // State for modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  
  // State for selected transaction
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  
  // State for form data
  const [formData, setFormData] = useState<TransactionFormData>({
    transaction_type: 'income',
    user_id: '',
    amount: '',
    currency: 'USD',
    description: '',
    transaction_date: new Date().toISOString().slice(0, 16) // Format: YYYY-MM-DDThh:mm
  });
  
  // State for filter options
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    transaction_type: '',
    min_amount: '',
    max_amount: '',
    start_date: '',
    end_date: '',
    currency: '',
    search: ''
  });
  
  // State for view mode
  const [viewMode, setViewMode] = useState('list');

  // Load transactions and summary on initial render
  useEffect(() => {
    fetchTransactions();
    fetchSummary();
    fetchUsers();
  }, []);
  
  // Apply filters when filter options change
  useEffect(() => {
    if (Object.values(filterOptions).some(value => value !== '')) {
      applyFilters();
    } else {
      setFilteredTransactions(transactions);
    }
  }, [filterOptions, transactions]);

  // Fetch all transactions
  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const response = await financialService.getAllTransactions();
      setTransactions(response.data);
      setFilteredTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch all users
  const fetchUsers = async () => {
    try {
      setIsLoadingUsers(true);
      // Use adminService to get all users
      const response = await adminService.getAllUsers() as ApiResponse<User[]>;
      
      // Handle potential undefined response
      const allUsers = response && response.users ? response.users : [];
      setUsers(allUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]); // Set empty array on error
    } finally {
      setIsLoadingUsers(false);
    }
  };
  
  // Fetch summary data
  const fetchSummary = async () => {
    try {
      const response = await financialService.getFinancialSummary(summaryPeriod);
      setSummaryData(response.data);
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  };
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  // Handle filter input changes
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilterOptions({ ...filterOptions, [name]: value });
  };
  
  // Apply filters
  const applyFilters = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await financialService.getFilteredTransactions(filterOptions);
      setFilteredTransactions(response.data);
    } catch (error: any) {
      console.error('Error applying filters:', error);
      if (error) {
        setError(error);
      } else {
        setError('An error occurred while applying filters');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Reset filters
  const resetFilters = () => {
    setFilterOptions({
      transaction_type: '',
      min_amount: '',
      max_amount: '',
      start_date: '',
      end_date: '',
      currency: '',
      search: ''
    });
    setFilteredTransactions(transactions);
  };
  
  // Handle transaction submission (create/update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      setIsSubmitting(true);
      
      if (selectedTransaction) {
        // Update existing transaction
        await financialService.updateTransaction(selectedTransaction.id, {
          ...formData,
          amount: parseFloat(formData.amount)
        });
      } else {
        // Create new transaction
        await financialService.createTransaction({
          ...formData,
          amount: parseFloat(formData.amount)
        });
      }
      
      // Reset form and refresh data
      setFormData({
        transaction_type: 'income',
        user_id: '',
        amount: '',
        currency: 'USD',
        description: '',
        transaction_date: new Date().toISOString().slice(0, 16) // Format: YYYY-MM-DDThh:mm
      });
      setSelectedTransaction(null);
      setIsFormOpen(false);
      
      await fetchTransactions();
      await fetchSummary();
    } catch (error: any) {
      console.error('Error submitting transaction:', error);
      if (error) {
        setError(error);
      } else {
        setError('An error occurred while saving the transaction');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Delete a transaction
  const deleteTransaction = async () => {
    if (!selectedTransaction) return;
    
    try {
      setIsSubmitting(true);
      await financialService.deleteTransaction(selectedTransaction.id);
      setIsDeleteModalOpen(false);
      setSelectedTransaction(null);
      await fetchTransactions();
      await fetchSummary();
    } catch (error: any) {
      console.error('Error deleting transaction:', error);
      if (error) {
        setError(error);
      } else {
        setError('An error occurred while deleting the transaction');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Open edit modal
  const handleEdit = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setFormData({
      transaction_type: transaction.transaction_type,
      user_id: transaction.user_id ? String(transaction.user_id) : '',
      amount: String(transaction.amount),
      currency: transaction.currency,
      description: transaction.description,
      transaction_date: new Date(transaction.transaction_date).toISOString().split('T')[0]
    });
    setIsFormOpen(true);
  };
  
  // Open delete modal
  const handleDelete = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setError(null);
    setIsDeleteModalOpen(true);
  };
  
  // Handle summary period change
  const handlePeriodChange = async (period: 'all' | 'year' | 'month' | 'week' | 'day') => {
    setSummaryPeriod(period);
    try {
      const response = await financialService.getFinancialSummary(period);
      setSummaryData(response.data);
    } catch (error) {
      console.error('Error fetching summary for period:', error);
    }
  };
  
  // Export transactions
  const handleExport = async (format: string) => {
  /*
    try {
      await financialService.exportTransactions(format, filterOptions);
    } catch (error) {
      console.error('Error exporting transactions:', error);
    }   
      */
  };

  // Modal body for add/edit transaction form
  const renderFormModalBody = () => {
    // Group users by role with null checks
    const studentUsers = users.filter(user => 
      user.role && user.role.roleName && user.role.roleName.toLowerCase() === 'student'
    );
    const coachUsers = users.filter(user => 
      user.role && user.role.roleName && user.role.roleName.toLowerCase() === 'coach'
    );
    const otherUsers = users.filter(user => 
      !user.role || !user.role.roleName || 
      (user.role.roleName.toLowerCase() !== 'student' && 
       user.role.roleName.toLowerCase() !== 'coach')
    );

    return (
      <form onSubmit={handleSubmit} className="space-y-6">
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Transaction Type
            </label>
            <select
              name="transaction_type"
              value={formData.transaction_type}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
              <option value="salary">Salary</option>
              <option value="loss">Loss</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Currency
            </label>
            <select
              name="currency"
              value={formData.currency}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="TL">TL</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Amount
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              step="0.01"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              User
            </label>
            <select
              name="user_id"
              value={formData.user_id}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a user</option>
              
              {studentUsers.length > 0 && (
                <optgroup label="Students">
                  {studentUsers.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.firstName || ''} {user.lastName || ''} - {user.email || 'No email'}
                    </option>
                  ))}
                </optgroup>
              )}
              
              {coachUsers.length > 0 && (
                <optgroup label="Coaches">
                  {coachUsers.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.firstName || ''} {user.lastName || ''} - {user.email || 'No email'}
                    </option>
                  ))}
                </optgroup>
              )}
              
              {otherUsers.length > 0 && (
                <optgroup label="Other Users">
                  {otherUsers.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.firstName || ''} {user.lastName || ''} - {user.email || 'No email'}
                      {user.role?.roleName ? ` - ${user.role.roleName}` : ''}
                    </option>
                  ))}
                </optgroup>
              )}
            </select>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Transaction Date
          </label>
          <input
            type="datetime-local"
            name="transaction_date"
            value={formData.transaction_date}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        
        <div className="flex justify-end gap-4">
          <Button
            variant="secondary"
            onClick={() => setIsFormOpen(false)}
          >
            Cancel
          </Button>
          
          <Button
            variant="primary"
            type="submit"
            isLoading={isSubmitting}
          >
            {selectedTransaction ? "Update" : "Add"} Transaction
          </Button>
        </div>
      </form>
    );
  };

  return (
    // @ts-ignore - AuthWrapper expects string[] for allowedRoles
    <AuthWrapper allowedRoles={['admin']}>
      <PageTemplate>
        {isLoading && !transactions.length ? (
          <LoadingSpinner fullScreen />
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Financial Transactions</h1>
              <p className="text-gray-400">Manage income, expenses and financial transactions</p>
            </div>

            {/* Stats Grid */}
            {summaryData ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatsCard
                  title="Total Balance"
                  value={formatCurrency(summaryData.netTotal, 'USD')}
                  icon={<DollarSign size={24} className="text-green-500" />}
                  color="bg-green-500/10"
                />
                <StatsCard
                  title="Income"
                  value={formatCurrency(summaryData.incomeTotal.amount, 'USD')}
                  icon={<TrendingUp size={24} className="text-blue-500" />}
                  color="bg-blue-500/10"
                />
                <StatsCard
                  title="Expenses"
                  value={formatCurrency(Math.abs(summaryData.expenseTotal.amount), 'USD')}
                  icon={<TrendingDown size={24} className="text-red-500" />}
                  color="bg-red-500/10"
                />
                <StatsCard
                  title="Transactions"
                  value={summaryData.totalTransactions}
                  icon={<PieChart size={24} className="text-purple-500" />}
                  color="bg-purple-500/10"
                />
              </div>
            ) : (<LoadingSpinner />)}

            {/* Period Selection */}
            <div className="flex overflow-x-auto mb-6 bg-white/5 p-1 rounded-xl border border-white/10">
              {(['all', 'year', 'month', 'week', 'day'] as const).map((period) => (
                <Button
                  key={period}
                  variant={summaryPeriod === period ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => handlePeriodChange(period)}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </Button>
              ))}
            </div>

            {/* Search and Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div className="flex-1 w-full md:w-auto">
                <div className="relative">
                  <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    value={filterOptions.search}
                    onChange={(e) => setFilterOptions({...filterOptions, search: e.target.value})}
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
                  onClick={() => handleExport('csv')}
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
                
                <Button
                  variant="primary"
                  icon={PlusCircle}
                  onClick={() => {
                    setSelectedTransaction(null);
                    setFormData({
                      transaction_type: 'income',
                      user_id: '',
                      amount: '',
                      currency: 'USD',
                      description: '',
                      transaction_date: new Date().toISOString().slice(0, 16) // Format: YYYY-MM-DDThh:mm
                    });
                    setIsFormOpen(true);
                  }}
                >
                  Add Transaction
                </Button>
              </div>
            </div>

            {/* Transactions Grid/List */}
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-12 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10">
                <DollarSign size={48} className="mx-auto text-gray-500 mb-4" />
                <h3 className="text-xl font-medium text-white">No transactions found</h3>
                <p className="text-gray-400 mt-2">Create a new transaction or adjust your filters</p>
                <Button
                  variant="primary"
                  icon={Plus}
                  className="mt-4"
                  onClick={() => {
                    setSelectedTransaction(null);
                    setFormData({
                      transaction_type: 'income',
                      user_id: '',
                      amount: '',
                      currency: 'USD',
                      description: '',
                      transaction_date: new Date().toISOString().slice(0, 16) // Format: YYYY-MM-DDThh:mm
                    });
                    setIsFormOpen(true);
                  }}
                >
                  Add Transaction
                </Button>
              </div>
            ) : (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                  : 'grid-cols-1'
              }`}>
                <AnimatePresence>
                  {filteredTransactions.map((transaction) => (
                    <motion.div
                      key={transaction.id} 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      layout
                    >
                      {viewMode === 'grid' ? (
                        <TransactionCard
                          transaction={transaction} 
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                        />
                      ) : (
                        <TransactionListItem
                          transaction={transaction} 
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                        />
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            {/* Transaction Form Modal */}
            <Modal 
              isOpen={isFormOpen}
              onClose={() => {
                setIsFormOpen(false);
                setError(null);
              }}
              title={selectedTransaction ? "Edit Transaction" : "Add New Transaction"}
            >
              {renderFormModalBody()}
            </Modal>

            {/* Filter Modal */}
            <Modal 
              isOpen={isFilterModalOpen}
              onClose={() => {
                setIsFilterModalOpen(false);
                setError(null);
              }}
              title="Filter Transactions"
            >
              <div className="space-y-6">
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
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Transaction Type
                    </label>
                    <select
                      name="transaction_type"
                      value={filterOptions.transaction_type}
                      onChange={handleFilterChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">All Types</option>
                      <option value="income">Income</option>
                      <option value="expense">Expense</option>
                      <option value="salary">Salary</option>
                      <option value="loss">Loss</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Currency
                    </label>
                    <select
                      name="currency"
                      value={filterOptions.currency}
                      onChange={handleFilterChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">All Currencies</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="TL">TL</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Min Amount
                    </label>
                    <input
                      type="number"
                      name="min_amount"
                      value={filterOptions.min_amount}
                      onChange={handleFilterChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Min amount"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Max Amount
                    </label>
                    <input
                      type="number"
                      name="max_amount"
                      value={filterOptions.max_amount}
                      onChange={handleFilterChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Max amount"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="start_date"
                      value={filterOptions.start_date}
                      onChange={handleFilterChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      name="end_date"
                      value={filterOptions.end_date}
                      onChange={handleFilterChange}
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

            {/* Delete Confirmation Modal */}
            <Modal 
              isOpen={isDeleteModalOpen}
              onClose={() => {
                setIsDeleteModalOpen(false);
                setError(null);
              }}
              title="Delete Transaction"
            >
              <div className="space-y-6">
                <p>Are you sure you want to delete this transaction?</p>
                
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
                
                {selectedTransaction && (
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <div className="mb-2">
                      <span className="text-gray-400">Type: </span>
                      <span className="capitalize">{selectedTransaction.transaction_type.replace('_', ' ')}</span>
                    </div>
                    <div className="mb-2">
                      <span className="text-gray-400">Amount: </span>
                      <span className={selectedTransaction.amount >= 0 ? "text-green-400" : "text-red-400"}>
                        {formatCurrency(selectedTransaction.amount, selectedTransaction.currency)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Date: </span>
                      <span>{formatDate(selectedTransaction.transaction_date)}</span>
                    </div>
                  </div>
                )}
                
                <p className="text-red-400">This action cannot be undone.</p>
                
                <div className="flex justify-end gap-4">
                  <Button
                    variant="secondary"
                    onClick={() => setIsDeleteModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  
                  <Button
                    variant="danger"
                    onClick={deleteTransaction}
                    isLoading={isSubmitting}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Modal>
          </>
        )}
      </PageTemplate>
    </AuthWrapper>
  );
};

export default FinancialTransactionsPage; 