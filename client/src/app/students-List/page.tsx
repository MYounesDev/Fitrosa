"use client"

import React, { useEffect, useState } from 'react';
import { studentService, isAdmin } from '@/services/api';
import { Search, PlusCircle, UserPlus, ChevronDown, Activity, BookOpen, Users, User, Calendar, File, X, Check, Edit3, Trash2, MoreHorizontal, Filter } from 'lucide-react';
import AuthWrapper from '@/components/AuthWrapper';
import PageTemplate from "@/components/PageTemplate";

// Student interface
interface Student {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    birthDate: string;
    gender: string;
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
    icon: React.ReactNode;
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
        <div className="bg-white rounded-xl shadow-md p-6 flex items-center">
            <div className={`p-3 rounded-lg ${color} mr-4`}>
                {icon}
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-2xl font-bold">{value}</p>
            </div>
        </div>
    );
};

// Student Card Component
const StudentCard = ({ student, onView }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-5 border border-gray-100">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold">
                        {student.firstName[0]}{student.lastName[0]}
                    </div>
                    <div className="ml-3">
                        <h3 className="font-semibold text-gray-800">{student.firstName} {student.lastName}</h3>
                        <p className="text-sm text-gray-500">{student.email}</p>
                    </div>
                </div>
                <button 
                    onClick={() => onView(student)}
                    className="text-gray-400 hover:text-gray-600">
                    <MoreHorizontal size={16} />
                </button>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                <div>
                    <p className="text-gray-500">Session</p>
                    <p className="font-medium">{student.session || 'N/A'}</p>
                </div>
                <div>
                    <p className="text-gray-500">Section</p>
                    <p className="font-medium">{student.section || 'N/A'}</p>
                </div>
            </div>
            
            <div className="border-t border-gray-100 pt-3 mt-2 flex justify-between">
                <div className="flex items-center text-xs text-gray-500">
                    <Calendar size={14} className="mr-1" />
                    {formatDate(student.startDate)}
                </div>
                <div className="flex items-center text-xs text-gray-500">
                    <User size={14} className="mr-1" />
                    <span className="capitalize">{student.gender}</span>
                </div>
            </div>
        </div>
    );
};

// Modal Component
const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-xl font-semibold">{title}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
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
    const [temporaryPassword, setTemporaryPassword] = useState('');
    const [showPasswordAlert, setShowPasswordAlert] = useState(false);
    const [activeTab, setActiveTab] = useState('all');
    const [viewMode, setViewMode] = useState('grid');
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);

    // Tabs definition
    const tabs: Tab[] = [
        { id: 'all', label: 'All Students', icon: <Users size={18} /> },
        { id: 'active', label: 'Active', icon: <Activity size={18} /> },
        { id: 'sessions', label: 'By Session', icon: <BookOpen size={18} /> }
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
            const data = await studentService.getAllStudents();
            setStudents(data);
            setFilteredStudents(data);
        } catch (error) {
            console.error('Error fetching students:', error);
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
            if (response && response.temporaryPassword) {
                setTemporaryPassword(response.temporaryPassword);
                setShowPasswordAlert(true);
            }
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

    const closePasswordAlert = () => {
        setShowPasswordAlert(false);
        setTemporaryPassword('');
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString();
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
    const maleStudents = students.filter(s => s.gender === 'male').length;
    const femaleStudents = students.filter(s => s.gender === 'female').length;
    const uniqueSessions = new Set(students.map(s => s.session)).size;

    return (
        <AuthWrapper allowedRoles={['admin', 'coach']}>
            <PageTemplate>
                <div className="min-h-screen bg-gray-50">
                    <div className="container mx-auto px-4 py-8">
                        {/* Password Alert */}
                        {showPasswordAlert && (
                            <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-lg relative">
                                <div className="flex items-center">
                                    <Check size={20} className="text-green-600 mr-2" />
                                    <strong className="font-bold text-green-800">Student Added Successfully!</strong>
                                </div>
                                <p className="ml-6 mt-1">
                                    Temporary Password: <span className="font-mono bg-gray-100 px-3 py-1 rounded text-gray-800">{temporaryPassword}</span>
                                </p>
                                <button 
                                    onClick={closePasswordAlert}
                                    className="absolute top-3 right-3 text-green-600 hover:text-green-800"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        )}

                        {/* Header Section */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800 mb-2">Student Management</h1>
                                <p className="text-gray-500">Manage and monitor all student information</p>
                            </div>
                            <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search size={18} className="text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search students..."
                                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <button
                                    onClick={() => setIsFormOpen(true)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center shadow-sm transition-colors"
                                >
                                    <UserPlus size={18} className="mr-2" />
                                    Add Student
                                </button>
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <StatsCard 
                                title="Total Students" 
                                value={totalStudents} 
                                icon={<Users size={24} className="text-white" />} 
                                color="bg-blue-500"
                            />
                            <StatsCard 
                                title="male Students" 
                                value={maleStudents} 
                                icon={<User size={24} className="text-white" />} 
                                color="bg-indigo-500"
                            />
                            <StatsCard 
                                title="female Students" 
                                value={femaleStudents} 
                                icon={<User size={24} className="text-white" />} 
                                color="bg-pink-500"
                            />
                            <StatsCard 
                                title="Active Sessions" 
                                value={uniqueSessions} 
                                icon={<BookOpen size={24} className="text-white" />} 
                                color="bg-emerald-500"
                            />
                        </div>

                        {/* Tabs & View Toggle */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-1 mb-6 flex flex-col sm:flex-row justify-between">
                            <div className="flex overflow-x-auto">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        className={`px-4 py-2 mx-1 rounded-lg flex items-center whitespace-nowrap ${
                                            activeTab === tab.id 
                                                ? 'bg-blue-100 text-blue-600 font-medium' 
                                                : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                        onClick={() => setActiveTab(tab.id)}
                                    >
                                        {tab.icon}
                                        <span className="ml-2">{tab.label}</span>
                                    </button>
                                ))}
                            </div>
                            <div className="flex items-center mt-2 sm:mt-0 ml-2">
                                <div className="bg-gray-100 rounded-lg p-1 flex">
                                    <button
                                        className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                                        onClick={() => setViewMode('grid')}
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect x="3" y="3" width="7" height="7" rx="1" fill={viewMode === 'grid' ? "#3B82F6" : "#6B7280"} />
                                            <rect x="14" y="3" width="7" height="7" rx="1" fill={viewMode === 'grid' ? "#3B82F6" : "#6B7280"} />
                                            <rect x="3" y="14" width="7" height="7" rx="1" fill={viewMode === 'grid' ? "#3B82F6" : "#6B7280"} />
                                            <rect x="14" y="14" width="7" height="7" rx="1" fill={viewMode === 'grid' ? "#3B82F6" : "#6B7280"} />
                                        </svg>
                                    </button>
                                    <button
                                        className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                                        onClick={() => setViewMode('list')}
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect x="3" y="4" width="18" height="2" rx="1" fill={viewMode === 'list' ? "#3B82F6" : "#6B7280"} />
                                            <rect x="3" y="11" width="18" height="2" rx="1" fill={viewMode === 'list' ? "#3B82F6" : "#6B7280"} />
                                            <rect x="3" y="18" width="18" height="2" rx="1" fill={viewMode === 'list' ? "#3B82F6" : "#6B7280"} />
                                        </svg>
                                    </button>
                                </div>
                                <button className="ml-2 p-2 text-gray-600 hover:bg-gray-100 rounded-lg flex items-center">
                                    <Filter size={18} />
                                    <span className="ml-2 hidden md:inline">Filter</span>
                                </button>
                            </div>
                        </div>

                        {/* Students Grid/List View */}
                        {viewMode === 'grid' ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {displayedStudents.length > 0 ? (
                                    displayedStudents.map((student) => (
                                        <StudentCard 
                                            key={student.id} 
                                            student={student} 
                                            onView={handleViewStudent} 
                                        />
                                    ))
                                ) : (
                                    <div className="col-span-full text-center py-16">
                                        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                            <File size={24} className="text-gray-400" />
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-800 mb-1">No students found</h3>
                                        <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Session/Section</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Birth Date</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {displayedStudents.length > 0 ? (
                                                displayedStudents.map((student) => (
                                                    <tr key={student.id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                                                                    {student.firstName[0]}{student.lastName[0]}
                                                                </div>
                                                                <div className="ml-3">
                                                                    <div className="text-sm font-medium text-gray-900">{student.firstName} {student.lastName}</div>
                                                                    <div className="text-sm text-gray-500">{student.email}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-900">{student.session || 'N/A'}</div>
                                                            <div className="text-sm text-gray-500">{student.section || 'N/A'}</div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-500">{formatDate(student.birthDate)}</div>
                                                            <div className="text-sm text-gray-500 capitalize">{student.gender}</div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-900">{student.parentName}</div>
                                                            <div className="text-sm text-gray-500">{student.parentPhone}</div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-500">{formatDate(student.startDate)}</div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                                            <button
                                                                onClick={() => handleViewStudent(student)}
                                                                className="text-blue-600 hover:text-blue-800 mx-1"
                                                            >
                                                                <Edit3 size={16} />
                                                            </button>
                                                            <button className="text-red-500 hover:text-red-700 mx-1">
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={6} className="px-6 py-16 text-center">
                                                        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                                            <File size={24} className="text-gray-400" />
                                                        </div>
                                                        <h3 className="text-lg font-medium text-gray-800 mb-1">No students found</h3>
                                                        <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Add Student Modal */}
                        <Modal 
                            isOpen={isFormOpen}
                            onClose={() => setIsFormOpen(false)}
                            title="Add New Student"
                        >
                            <form onSubmit={handleAddStudent} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={newStudent.firstName}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={newStudent.lastName}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={newStudent.email}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                                {isAdmin() && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Session</label>
                                            <select
                                                name="session"
                                                value={newStudent.session}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                required
                                            >
                                                <option value="">Select Session</option>
                                                <option value="Volleyball">Volleyball</option>
                                                <option value="Football">Football</option>
                                                <option value="Basketball">Basketball</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                                            <select
                                                name="section"
                                                value={newStudent.section}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                required
                                            >
                                                <option value="">Select Section</option>
                                                <option value="A">Section A</option>
                                                <option value="B">Section B</option>
                                                <option value="C">Section C</option>
                                            </select>
                                        </div>
                                    </>
                                )}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Birth Date</label>
                                    <input
                                        type="date"
                                        name="birthDate"
                                        value={newStudent.birthDate}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                    <select
                                        name="gender"
                                        value={newStudent.gender}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="male">male</option>
                                        <option value="female">female</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Parent/Guardian Name</label>
                                    <input
                                        type="text"
                                        name="parentName"
                                        value={newStudent.parentName}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Parent/Guardian Phone</label>
                                    <input
                                        type="tel"
                                        name="parentPhone"
                                        value={newStudent.parentPhone}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                    <input
                                        type="date"
                                        name="startDate"
                                        value={newStudent.startDate}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                                <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                                        <textarea
                                            name="notes"
                                            value={newStudent.notes}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-20"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Performance Notes</label>
                                        <textarea
                                            name="performanceNotes"
                                            value={newStudent.performanceNotes}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-20"
                                        />
                                    </div>
                                    <div className="md:col-span-2 flex justify-end mt-4">
                                        <button
                                            type="submit"
                                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg shadow-sm transition-colors"
                                        >
                                            Save Student
                                        </button>
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
                                        <div className="flex items-start">
                                            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xl font-bold mr-4">
                                                {selectedStudent.firstName[0]}{selectedStudent.lastName[0]}
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-bold text-gray-800">{selectedStudent.firstName} {selectedStudent.lastName}</h3>
                                                <p className="text-gray-600">{selectedStudent.email}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-500">Personal Information</h4>
                                                    <div className="mt-2 space-y-2">
                                                        <p><span className="font-medium">Birth Date:</span> {formatDate(selectedStudent.birthDate)}</p>
                                                        <p><span className="font-medium">Gender:</span> <span className="capitalize">{selectedStudent.gender}</span></p>
                                                    </div>
                                                </div>

                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-500">Academic Information</h4>
                                                    <div className="mt-2 space-y-2">
                                                        <p><span className="font-medium">Session:</span> {selectedStudent.session || 'N/A'}</p>
                                                        <p><span className="font-medium">Section:</span> {selectedStudent.section || 'N/A'}</p>
                                                        <p><span className="font-medium">Start Date:</span> {formatDate(selectedStudent.startDate)}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-500">Parent/Guardian Information</h4>
                                                    <div className="mt-2 space-y-2">
                                                        <p><span className="font-medium">Name:</span> {selectedStudent.parentName}</p>
                                                        <p><span className="font-medium">Phone:</span> {selectedStudent.parentPhone}</p>
                                                    </div>
                                                </div>

                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-500">Notes</h4>
                                                    <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                                                        {selectedStudent.notes || 'No notes available'}
                                                    </div>
                                                </div>

                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-500">Performance Notes</h4>
                                                    <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                                                        {selectedStudent.performanceNotes || 'No performance notes available'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                                            <button
                                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                                onClick={() => setIsViewModalOpen(false)}
                                            >
                                                Close
                                            </button>
                                            <button
                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                            >
                                                Edit Student
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </Modal>
                        </div>
                    </div>
            </PageTemplate>
        </AuthWrapper>
    );
};

export default StudentsPage;