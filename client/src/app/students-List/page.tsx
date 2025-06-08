"use client"

import React, { useEffect, useState } from 'react';
import { studentService } from '@/services/api';
import { Search, PlusCircle, UserPlus, ChevronDown, Activity, BookOpen, Users, User, Calendar, File, X, Check, Edit3, Trash2, MoreHorizontal, Filter } from 'lucide-react';
import AuthWrapper from '@/components/AuthWrapper';
import PageTemplate from "@/components/PageTemplate";
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

// Student interface
interface Student {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    birthDate: string;
    gender: {
        genderName: string;
    } | null;
    
    parentName: string;
    parentPhone: string;
    notes: string;
    startDate: string;
    performanceNotes: string;
    session: string;
    section: string;
}

// Tab interface
interface Tab {
    id: string;
    label: string;
    icon: React.ElementType;
}

// Utility function to format dates
const formatDate = (dateString: string): string => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
};

// Stats Card Component
const StatsCard = ({ title, value, icon, color }) => {
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

// Student Card Component
const StudentCard = ({ student, onView }) => {
    return (
        <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-white/5 backdrop-blur-lg rounded-xl shadow-2xl p-5 border border-white/10"
        >
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white font-bold shadow-lg">
                        {student.firstName[0]}{student.lastName[0]}
                    </div>
                    <div className="ml-3">
                        <h3 className="font-semibold text-white">{student.firstName} {student.lastName}</h3>
                        <p className="text-sm text-gray-400">{student.email}</p>
                    </div>
                </div>
                <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onView(student)}
                    className="text-gray-400 hover:text-white transition-colors"
                >
                    <MoreHorizontal size={16} />
                </motion.button>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                <div>
                    <p className="text-gray-400">Session</p>
                    <p className="font-medium text-white">{student.session || 'N/A'}</p>
                </div>
                <div>
                    <p className="text-gray-400">Section</p>
                    <p className="font-medium text-white">{student.section || 'N/A'}</p>
                </div>
            </div>
            
            <div className="border-t border-white/10 pt-3 mt-2 flex justify-between">
                <div className="flex items-center text-xs text-gray-400">
                    <Calendar size={14} className="mr-1" />
                    {formatDate(student.startDate)}
                </div>
                <div className="flex items-center text-xs text-gray-400">
                    <User size={14} className="mr-1" />
                    <span className="capitalize">{student.gender?.genderName || 'N/A'}</span>
                </div>
            </div>
        </motion.div>
    );
};

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

// Main Component
const StudentsPage = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [newStudent, setNewStudent] = useState({
        firstName: '',
        lastName: '',
        email: '',
        birthDate: '',
        gender: '',
        parentName: '',
        parentPhone: '',
        notes: '',
        startDate: '',
        performanceNotes: '',
        session: '',
        section: ''
    });
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('all');
    const [viewMode, setViewMode] = useState('grid');
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Tabs definition
    const tabs: Tab[] = [
        { id: 'all', label: 'All Students', icon: Users },
        { id: 'active', label: 'Active', icon: Activity },
        { id: 'sessions', label: 'By Session', icon: BookOpen }
    ];

    useEffect(() => {
        fetchStudents();
    }, []);

    useEffect(() => {
        if (searchTerm) {
            const filtered = students.filter(student => 
                student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.session.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.section.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredStudents(filtered);
        } else {
            setFilteredStudents(students);
        }
    }, [searchTerm, students]);

    const fetchStudents = async () => {
        try {
            setIsLoading(true);
            const response = await studentService.getAllStudents();
            setStudents(response.students);
            setFilteredStudents(response.students);
        } catch (error) {
            console.error('Error fetching students:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewStudent({ ...newStudent, [name]: value });
    };

    const handleAddStudent = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await studentService.addStudent(newStudent);

            fetchStudents();
            setNewStudent({
                firstName: '',
                lastName: '',
                email: '',
                birthDate: '',
                gender: '',
                parentName: '',
                parentPhone: '',
                notes: '',
                startDate: '',
                performanceNotes: '',
                session: '',
                section: ''
            });
            setIsFormOpen(false);
        } catch (error) {
            console.error('Error adding student:', error);
        }
    };


    const handleViewStudent = (student: Student) => {
        setSelectedStudent(student);
        setIsViewModalOpen(true);
    };

    const getStudentsByTab = () => {
        if (activeTab === 'all') return filteredStudents;
        
        if (activeTab === 'active') {
            // Example filter for active students (those who started in the last 6 months)
            const sixMonthsAgo = new Date();
            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
            return filteredStudents.filter(s => new Date(s.startDate) >= sixMonthsAgo);
        }
        
        if (activeTab === 'sessions') {
            // Group students by session (simplified - would be more interactive in a real app)
            return filteredStudents;
        }
        
        return filteredStudents;
    };

    const displayedStudents = getStudentsByTab();
    
    // Calculate stats
    const totalStudents = students.length;
    const maleStudents = students.filter(s => s.gender?.genderName === 'male').length;
    const femaleStudents = students.filter(s => s.gender?.genderName === 'female').length;
    const uniqueSessions = new Set(students.map(s => s.session)).size;

    return (
        <AuthWrapper allowedRoles={['admin', 'coach']}>
            <PageTemplate>
                {isLoading ? (
                    <LoadingSpinner fullScreen />
                ) : (
                    <>
                    

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <StatsCard
                                title="Total Students"
                                value={students.length}
                                icon={<Users size={24} className="text-blue-500" />}
                                color="bg-blue-500/10"
                            />
                            <StatsCard
                                title="Male Students"
                                value={students.filter(s => s.gender?.genderName === 'male').length}
                                icon={<User size={24} className="text-indigo-500" />}
                                color="bg-indigo-500/10"
                            />
                            <StatsCard
                                title="Female Students"
                                value={students.filter(s => s.gender?.genderName === 'female').length}
                                icon={<User size={24} className="text-purple-500" />}
                                color="bg-purple-500/10"
                            />
                            <StatsCard
                                title="Active Sessions"
                                value={new Set(students.map(s => s.session)).size}
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
                                            placeholder="Search students..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-4 w-full md:w-auto">
                                <Button
                                    variant="secondary"
                                    icon={Filter}
                                    onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                                >
                                    View
                                </Button>
                                <Button
                                    variant="primary"
                                    icon={UserPlus}
                                    onClick={() => setIsFormOpen(true)}
                                >
                                    Add Student
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

                        {/* Students Grid */}
                        <div className={`grid gap-6 ${
                            viewMode === 'grid' 
                                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                                : 'grid-cols-1'
                        }`}>
                            <AnimatePresence>
                                {displayedStudents.map((student) => (
                                    <motion.div
                                                key={student.id} 
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                    >   
                                        <StudentCard student={(student)} onView={handleViewStudent} />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                                </div>

                                {/* Add Student Modal */}
                                <Modal 
                                    isOpen={isFormOpen}
                                    onClose={() => setIsFormOpen(false)}
                                    title="Add New Student"
                                >
                                <form onSubmit={handleAddStudent} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                First Name
                                            </label>
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={newStudent.firstName}
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
                                                value={newStudent.lastName}
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
                                                value={newStudent.email}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Birth Date
                                            </label>
                                            <input
                                                type="date"
                                                name="birthDate"
                                                value={newStudent.birthDate}
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
                                                value={newStudent.gender}
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
                                                Parent Name
                                            </label>
                                            <input
                                                type="text"
                                                name="parentName"
                                                value={newStudent.parentName}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Parent Phone
                                            </label>
                                            <input
                                                type="tel"
                                                name="parentPhone"
                                                value={newStudent.parentPhone}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Session
                                            </label>
                                            <input
                                                type="text"
                                                name="session"
                                                value={newStudent.session}
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
                                                value={newStudent.section}
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
                                            value={newStudent.notes}
                                            onChange={handleInputChange}
                                            rows={3}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Start Date
                                        </label>
                                        <input
                                            type="date"
                                            name="startDate"
                                            value={newStudent.startDate}
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
                                        >
                                            Add Student
                                        </Button>
                                    </div>
                                </form>
                                </Modal>

                                    {/* View Student Modal */}
                                    <Modal 
                                        isOpen={isViewModalOpen}
                                        onClose={() => setIsViewModalOpen(false)}
                                        title="Student Details"
                                    >
                                        {selectedStudent && (
                                            <div className="space-y-6">
                                        <div className="flex items-center">
                                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                                                        {selectedStudent.firstName[0]}{selectedStudent.lastName[0]}
                                                    </div>
                                            <div className="ml-4">
                                                <h3 className="text-xl font-semibold text-white">{selectedStudent.firstName} {selectedStudent.lastName}</h3>
                                                <p className="text-gray-400">{selectedStudent.email}</p>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <div>
                                                <p className="text-gray-400">Session</p>
                                                <p className="text-white font-medium">{selectedStudent.session || 'N/A'}</p>
                                                        </div>
                                                        <div>
                                                <p className="text-gray-400">Section</p>
                                                <p className="text-white font-medium">{selectedStudent.section || 'N/A'}</p>
                                                    </div>
                                                        <div>
                                                <p className="text-gray-400">Gender</p>
                                                <p className="text-white font-medium capitalize">{selectedStudent.gender?.genderName || 'N/A'}</p>
                                                        </div>
                                                        <div>
                                                <p className="text-gray-400">Start Date</p>
                                                <p className="text-white font-medium">{formatDate(selectedStudent.startDate)}</p>
                                                    </div>
                                                </div>

                                                <div>
                                        <p className="text-gray-400 mb-2">Notes</p>
                                        <p className="text-white">{selectedStudent.notes || 'No notes available.'}</p>
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

export default StudentsPage;