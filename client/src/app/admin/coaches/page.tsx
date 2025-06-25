"use client"

import React, { useEffect, useState } from 'react';
import { coachService } from '@/services/api';
import { Search, PlusCircle, UserPlus, ChevronDown, Activity, BookOpen, Users, User, Calendar, File, X, Check, Edit3, Trash2, MoreHorizontal, Filter, List, Grid } from 'lucide-react';
import AuthWrapper from '@/components/AuthWrapper';
import PageTemplate from '@/components/PageTemplate';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface Coach {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    gender: string;
    session: string;
    section: string;
    startDate: string;
    notes: string;
}

interface Tab {
    id: string;
    label: string;
    icon: React.ElementType;
}

interface StatsCardProps {
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
}

interface CoachCardProps {
    coach: Coach;
    onView: (coach: Coach) => void;
}

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

const formatDate = (dateString: string): string => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
};

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, color }) => {
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

const CoachCard: React.FC<CoachCardProps> = ({ coach, onView }) => {
    return (
        <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-white/5 backdrop-blur-lg rounded-xl shadow-2xl p-5 border border-white/10"
        >
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white font-bold shadow-lg">
                        { `${coach.firstName[0]}${coach.lastName[0]}` }
                    </div>
                    <div className="ml-3">
                        <h3 className="font-semibold text-white">{coach.firstName} {coach.lastName}</h3>
                        <p className="text-sm text-gray-400">{coach.email}</p>
                    </div>
                </div>
                <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onView(coach)}
                    className="text-gray-400 hover:text-white transition-colors"
                >
                    <MoreHorizontal size={16} />
                </motion.button>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                <div>
                    <p className="text-gray-400">Session</p>
                    <p className="font-medium text-white">{coach.session || 'N/A'}</p>
                </div>
                <div>
                    <p className="text-gray-400">Section</p>
                    <p className="font-medium text-white">{coach.section || 'N/A'}</p>
                </div>
            </div>

            <div className="border-t border-white/10 pt-3 mt-2 flex justify-between">
                <div className="flex items-center text-xs text-gray-400">
                    <Calendar size={14} className="mr-1" />
                    {formatDate(coach.startDate)}
                </div>
                <div className="flex items-center text-xs text-gray-400">
                    <User size={14} className="mr-1" />
                    <span className="capitalize">{coach.gender}</span>
                </div>
            </div>
        </motion.div>
    );
};

// Coach List Item Component
const CoachListItem: React.FC<CoachCardProps> = ({ coach, onView }) => {
    return (
        <motion.div 
            whileHover={{ scale: 1.01 }}
            className="bg-white/5 backdrop-blur-lg rounded-xl shadow-2xl p-4 border border-white/10"
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white font-bold shadow-lg">
                        {coach.firstName[0]}{coach.lastName[0]}
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-white text-lg">{coach.firstName} {coach.lastName}</h3>
                        <p className="text-sm text-gray-400">{coach.email}</p>
                    </div>
                </div>
                
                <div className="flex items-center space-x-6 text-sm">
                    <div className="text-center">
                        <p className="text-gray-400">Session</p>
                        <p className="font-medium text-white">{coach.session || 'N/A'}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-gray-400">Section</p>
                        <p className="font-medium text-white">{coach.section || 'N/A'}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-gray-400">Gender</p>
                        <p className="font-medium text-white capitalize">{coach.gender}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-gray-400">Start Date</p>
                        <p className="font-medium text-white">{formatDate(coach.startDate)}</p>
                    </div>
                    <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onView(coach)}
                        className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                    >
                        <MoreHorizontal size={20} />
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
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

const CoachesPage = () => {
    const [coaches, setCoaches] = useState<Coach[]>([]);
    const [filteredCoaches, setFilteredCoaches] = useState<Coach[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [newCoach, setNewCoach] = useState({
        firstName: '',
        lastName: '',
        email: '',
        gender: '',
        session: '',
        section: '',
        startDate: '',
        notes: ''
    });
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('all');
    const [viewMode, setViewMode] = useState('grid');
    const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const tabs: Tab[] = [
        { id: 'all', label: 'All Coaches', icon: Users },
        { id: 'active', label: 'Active', icon: Activity },
        { id: 'sessions', label: 'By Session', icon: BookOpen }
    ];

    useEffect(() => {
        fetchCoaches();
    }, []);

    useEffect(() => {
        if (searchTerm) {
            const filtered = coaches.filter(coach => 
                coach.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                coach.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                coach.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                coach.session.toLowerCase().includes(searchTerm.toLowerCase()) ||
                coach.section.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredCoaches(filtered);
        } else {
            setFilteredCoaches(coaches);
        }
    }, [searchTerm, coaches]);

    const fetchCoaches = async () => {
        try {
            setIsLoading(true);
            const response = await coachService.getAllCoaches();
            if (response && response.coaches) {
                setCoaches(response.coaches || []);
                setFilteredCoaches(response.coaches || []);
            }
        } catch (error) {
            console.error('Error fetching coaches:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewCoach(prev => ({ ...prev, [name]: value }));
    };

    const handleAddCoach = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            await coachService.addCoach(newCoach);
            fetchCoaches();
            setNewCoach({
                firstName: '',
                lastName: '',
                email: '',
                gender: '',
                session: '',
                section: '',
                startDate: '',
                notes: ''
            });
            setIsFormOpen(false);
        } catch (error) {
            console.error('Error adding coach:', error);
        } finally {
            setIsSubmitting(false);
        }
    };


    const handleViewCoach = (coach: Coach) => {
        setSelectedCoach(coach);
        setIsViewModalOpen(true);
    };

    const getCoachesByTab = () => {
        if (activeTab === 'all') return filteredCoaches;

        if (activeTab === 'active') {
            const sixMonthsAgo = new Date();
            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
            return filteredCoaches.filter(c => new Date(c.startDate) >= sixMonthsAgo);
        }

        if (activeTab === 'sessions') {
            return filteredCoaches;
        }

        return filteredCoaches;
    };

    const displayedCoaches = getCoachesByTab();
/*
    const totalCoaches = coaches.length;
    const maleCoaches = coaches.filter(c => c.gender === 'male').length;
    const femaleCoaches = coaches.filter(c => c.gender === 'female').length;
    const uniqueSessions = new Set(coaches.map(c => c.session)).size;
*/
    return (
        <AuthWrapper allowedRoles={['admin']}>
            <PageTemplate>
                {isLoading ? (
                    <LoadingSpinner fullScreen />
                ) : (
                    <>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <StatsCard
                                title="Total Coaches"
                                value={coaches.length}
                                icon={<Users size={24} className="text-blue-500" />}
                                color="bg-blue-500/10"
                            />
                            <StatsCard
                                title="Male Coaches"
                                value={coaches.filter(c => c.gender === 'male').length}
                                icon={<User size={24} className="text-indigo-500" />}
                                color="bg-indigo-500/10"
                            />
                            <StatsCard
                                title="Female Coaches"
                                value={coaches.filter(c => c.gender === 'female').length}
                                icon={<User size={24} className="text-purple-500" />}
                                color="bg-purple-500/10"
                            />
                            <StatsCard
                                title="Active Sessions"
                                value={new Set(coaches.map(c => c.session)).size}
                                icon={<BookOpen size={24} className="text-cyan-500" />}
                                color="bg-cyan-500/10"
                            />
                        </div>

                        {/* Search and Filters */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                            <div className="flex-1 w-full md:w-auto">
                                <div className="relative">
                                    <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search coaches..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-4 w-full md:w-auto">
                                <Button
                                    variant="secondary"
                                    icon={viewMode === 'grid' ? List : Grid}
                                    onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                                >
                                    {viewMode === 'grid' ? 'List' : 'Grid'}
                                </Button>
                                <Button
                                    variant="primary"
                                    icon={UserPlus}
                                    onClick={() => setIsFormOpen(true)}
                                >
                                    Add Coach
                                </Button>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex overflow-x-auto mb-6 bg-white/5 p-1 rounded-xl border border-white/10">
                            {tabs.map((tab) => (
                                <Button
                                    key={tab.id}
                                    variant={activeTab === tab.id ? 'primary' : 'outline'}
                                    icon={tab.icon}
                                    onClick={() => setActiveTab(tab.id)}
                                    size="sm"
                                >
                                    {tab.label}
                                </Button>
                            ))}
                        </div>

                        {/* Coaches Grid */}
                        <motion.div 
                            layout
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className={`grid gap-6 ${
                                viewMode === 'grid' 
                                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                                    : 'grid-cols-1'
                            }`}
                        >
                            <AnimatePresence>
                                {displayedCoaches.map((coach) => (
                                    <motion.div
                                        key={coach.id} 
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        layout
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                    >
                                        {viewMode === 'grid' ? (
                                            <CoachCard coach={coach} onView={handleViewCoach} />
                                        ) : (
                                            <CoachListItem coach={coach} onView={handleViewCoach} />
                                        )}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>

                        {/* Add Coach Modal */}
                        <Modal 
                            isOpen={isFormOpen}
                            onClose={() => setIsFormOpen(false)}
                            title="Add New Coach"
                        >
                            <form onSubmit={handleAddCoach} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            First Name
                                        </label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={newCoach.firstName}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Last Name
                                        </label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={newCoach.lastName}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={newCoach.email}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Gender
                                        </label>
                                        <select
                                            name="gender"
                                            value={newCoach.gender}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Session
                                        </label>
                                        <input
                                            type="text"
                                            name="session"
                                            value={newCoach.session}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Section
                                        </label>
                                        <input
                                            type="text"
                                            name="section"
                                            value={newCoach.section}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Start Date
                                        </label>
                                        <input
                                            type="date"
                                            name="startDate"
                                            value={newCoach.startDate}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Notes
                                    </label>
                                    <textarea
                                        name="notes"
                                        value={newCoach.notes}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                        Add Coach
                                    </Button>
                                </div>
                            </form>
                        </Modal>

                        {/* View Coach Modal */}
                        <Modal 
                            isOpen={isViewModalOpen}
                            onClose={() => setIsViewModalOpen(false)}
                            title="Coach Details"
                        >
                            {selectedCoach && (
                                <div className="space-y-6">
                                    <div className="flex items-center">
                                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                                            {selectedCoach.firstName.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="text-xl font-semibold text-white">{selectedCoach.firstName} {selectedCoach.lastName}</h3>
                                            <p className="text-gray-400">{selectedCoach.email}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <p className="text-gray-400">Session</p>
                                            <p className="text-white font-medium">{selectedCoach.session || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400">Section</p>
                                            <p className="text-white font-medium">{selectedCoach.section || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400">Gender</p>
                                            <p className="text-white font-medium capitalize">{selectedCoach.gender}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400">Start Date</p>
                                            <p className="text-white font-medium">{formatDate(selectedCoach.startDate)}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-gray-400 mb-2">Notes</p>
                                        <p className="text-white">{selectedCoach.notes || 'No notes available.'}</p>
                                    </div>

                                    <div className="flex justify-end gap-4">
                                        <Button
                                            variant="primary"
                                            onClick={() => setIsViewModalOpen(false)}
                                        >
                                            Close
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </Modal>
                    </>
                )}
            </PageTemplate>
        </AuthWrapper>
    );
};

export default CoachesPage;