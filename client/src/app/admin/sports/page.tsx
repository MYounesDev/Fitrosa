"use client"

import React, { useEffect, useState } from 'react';
import { sportService } from '@/services/api';
import { Search, PlusCircle, Edit, Trash2, X, Check, MoreHorizontal, Filter } from 'lucide-react';
import AuthWrapper from '@/components/AuthWrapper';
import PageTemplate from "@/components/PageTemplate";
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

// Sport interface
interface Sport {
  id: number;
  sportName: string;
  createdAt: string;
  updatedAt: string;
}

// Modal Component
const Modal = ({ isOpen, onClose, title, children }) => {
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

// Sport Card Component
const SportCard = ({ sport, onEdit, onDelete }) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="bg-white/5 backdrop-blur-lg rounded-xl shadow-2xl p-5 border border-white/10"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white font-bold shadow-lg">
            {sport.sportName[0]}
          </div>
          <div className="ml-3">
            <h3 className="font-semibold text-white">{sport.sportName}</h3>
            <p className="text-sm text-gray-400">ID: {sport.id}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onEdit(sport)}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
          >
            <Edit size={16} />
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDelete(sport)}
            className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-white/10 rounded-lg"
          >
            <Trash2 size={16} />
          </motion.button>
        </div>
      </div>
      
      <div className="text-sm">
        <p className="text-gray-400">Created: {new Date(sport.createdAt).toLocaleDateString()}</p>
        <p className="text-gray-400">Updated: {new Date(sport.updatedAt).toLocaleDateString()}</p>
      </div>
    </motion.div>
  );
};

// Main Component
const SportsPage = () => {
  const [sports, setSports] = useState<Sport[]>([]);
  const [filteredSports, setFilteredSports] = useState<Sport[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSport, setSelectedSport] = useState<Sport | null>(null);
  const [newSportName, setNewSportName] = useState('');

  useEffect(() => {
    fetchSports();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = sports.filter(sport => 
        sport.sportName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSports(filtered);
    } else {
      setFilteredSports(sports);
    }
  }, [searchTerm, sports]);

  const fetchSports = async () => {
    try {
      setIsLoading(true);
      const response = await sportService.getAllSports();
      setSports(response.sports);
      setFilteredSports(response.sports);
    } catch (error) {
      console.error('Error fetching sports:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSport = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await sportService.createSport({ sportName: newSportName });
      fetchSports();
      setNewSportName('');
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error adding sport:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSport) return;
    
    try {
      setIsSubmitting(true);
      await sportService.updateSport(selectedSport.id, { sportName: newSportName });
      fetchSports();
      setNewSportName('');
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error editing sport:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSport = async () => {
    if (!selectedSport) return;
    
    try {
      setIsSubmitting(true);
      await sportService.deleteSport(selectedSport.id);
      fetchSports();
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting sport:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (sport: Sport) => {
    setSelectedSport(sport);
    setNewSportName(sport.sportName);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (sport: Sport) => {
    setSelectedSport(sport);
    setIsDeleteModalOpen(true);
  };

  return (
    <AuthWrapper allowedRoles={['admin']}>
      <PageTemplate>
        {isLoading ? (
          <LoadingSpinner fullScreen />
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Sports Management</h1>
              <p className="text-gray-400">Create, update, and manage sports in your system</p>
            </div>

            {/* Search and Add */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div className="flex-1 w-full md:w-auto">
                <div className="relative">
                  <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search sports..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
              <Button
                variant="primary"
                icon={PlusCircle}
                onClick={() => setIsAddModalOpen(true)}
              >
                Add Sport
              </Button>
            </div>

            {/* Sports Grid */}
            {filteredSports.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">No sports found. Add your first sport!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence>
                  {filteredSports.map((sport) => (
                    <motion.div
                      key={sport.id} 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <SportCard 
                        sport={sport} 
                        onEdit={openEditModal} 
                        onDelete={openDeleteModal} 
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            {/* Add Sport Modal */}
            <Modal 
              isOpen={isAddModalOpen} 
              onClose={() => setIsAddModalOpen(false)} 
              title="Add New Sport"
            >
              <form onSubmit={handleAddSport}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Sport Name
                  </label>
                  <input
                    type="text"
                    value={newSportName}
                    onChange={(e) => setNewSportName(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter sport name"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsAddModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="primary" 
                    type="submit"
                    icon={Check}
                    isLoading={isSubmitting}
                  >
                    Add Sport
                  </Button>
                </div>
              </form>
            </Modal>

            {/* Edit Sport Modal */}
            <Modal 
              isOpen={isEditModalOpen} 
              onClose={() => setIsEditModalOpen(false)} 
              title="Edit Sport"
            >
              <form onSubmit={handleEditSport}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Sport Name
                  </label>
                  <input
                    type="text"
                    value={newSportName}
                    onChange={(e) => setNewSportName(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter sport name"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="primary" 
                    type="submit"
                    icon={Check}
                    isLoading={isSubmitting}
                  >
                    Update Sport
                  </Button>
                </div>
              </form>
            </Modal>

            {/* Delete Sport Modal */}
            <Modal 
              isOpen={isDeleteModalOpen} 
              onClose={() => setIsDeleteModalOpen(false)} 
              title="Delete Sport"
            >
              <div className="mb-4">
                <p className="text-white">
                  Are you sure you want to delete <span className="font-bold">{selectedSport?.sportName}</span>?
                </p>
                <p className="text-red-400 mt-2">
                  This will also delete all classes associated with this sport. This action cannot be undone.
                </p>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => setIsDeleteModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  variant="danger" 
                  onClick={handleDeleteSport}
                  icon={Trash2}
                  isLoading={isSubmitting}
                >
                  Delete Sport
                </Button>
              </div>
            </Modal>
          </>
        )}
      </PageTemplate>
    </AuthWrapper>
  );
};

export default SportsPage; 