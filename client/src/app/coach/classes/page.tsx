"use client"

import React, { useEffect, useState } from 'react';
import { classService, studentService } from '@/services/api';
import { Search, X, Check, UserPlus, Users, BookOpen } from 'lucide-react';
import AuthWrapper from '@/components/AuthWrapper';
import PageTemplate from "@/components/PageTemplate";
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

// Interfaces
interface Student {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

interface Class {
  id: number;
  sportId: number;
  sportName: string;
  section: string;
  createdAt: string;
  updatedAt: string;
}

interface ClassDetail extends Class {
  students: Student[];
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

// Class Card Component
const ClassCard = ({ classItem, onView }) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="bg-white/5 backdrop-blur-lg rounded-xl shadow-2xl p-5 border border-white/10"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white font-bold shadow-lg">
            <BookOpen size={20} />
          </div>
          <div className="ml-3">
            <h3 className="font-semibold text-white">{classItem.sportName} - {classItem.section}</h3>
            <p className="text-sm text-gray-400">ID: {classItem.id}</p>
          </div>
        </div>
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onView(classItem)}
          className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
        >
          <Users size={16} />
        </motion.button>
      </div>
      
      <div className="text-sm">
        <p className="text-gray-400">Created: {new Date(classItem.createdAt).toLocaleDateString()}</p>
      </div>
    </motion.div>
  );
};

// Main Component
const CoachClassesPage = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [filteredClasses, setFilteredClasses] = useState<Class[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isStudentsLoading, setIsStudentsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  
  // Modal states
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isAssignStudentModalOpen, setIsAssignStudentModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [selectedClassDetails, setSelectedClassDetails] = useState<ClassDetail | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState('');

  useEffect(() => {
    fetchClasses();
    fetchStudents();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = classes.filter(classItem => 
        classItem.sportName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        classItem.section.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredClasses(filtered);
    } else {
      setFilteredClasses(classes);
    }
  }, [searchTerm, classes]);

  const fetchClasses = async () => {
    try {
      setIsLoading(true);
      const response = await classService.getAllClasses();
      setClasses(response.classes);
      setFilteredClasses(response.classes);
    } catch (error) {
      console.error('Error fetching classes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      setIsStudentsLoading(true);
      const response = await studentService.getAllStudents();
      setStudents(response.students);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setIsStudentsLoading(false);
    }
  };

  const fetchClassDetails = async (id: number) => {
    try {
      const response = await classService.getClass(id);
      setSelectedClassDetails(response.data);
    } catch (error) {
      console.error('Error fetching class details:', error);
    }
  };

  const handleAssignStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClass || !selectedStudentId) return;
    
    try {
      setIsSubmitting(true);
      await classService.assignStudent(selectedClass.id, Number(selectedStudentId));
      setIsAssignStudentModalOpen(false);
      fetchClasses();
    } catch (error) {
      console.error('Error assigning student:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveStudent = async (studentId: number) => {
    if (!selectedClassDetails) return;
    
    try {
      await classService.removeStudent(selectedClassDetails.id, studentId);
      fetchClassDetails(selectedClassDetails.id);
    } catch (error) {
      console.error('Error removing student:', error);
    }
  };

  const openViewModal = (classItem: Class) => {
    setSelectedClass(classItem);
    fetchClassDetails(classItem.id);
    setIsViewModalOpen(true);
  };

  return (
    <AuthWrapper allowedRoles={['coach']}>
      <PageTemplate>
        {isLoading ? (
          <LoadingSpinner fullScreen />
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">My Classes</h1>
              <p className="text-gray-400">Manage your assigned classes and students</p>
            </div>

            {/* Search */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div className="flex-1 w-full md:w-auto">
                <div className="relative">
                  <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search classes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Classes Grid */}
            {filteredClasses.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">You have no assigned classes.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence>
                  {filteredClasses.map((classItem) => (
                    <motion.div
                      key={classItem.id} 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <ClassCard 
                        classItem={classItem} 
                        onView={openViewModal}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            {/* View Class Modal */}
            <Modal 
              isOpen={isViewModalOpen} 
              onClose={() => setIsViewModalOpen(false)} 
              title={selectedClassDetails ? `${selectedClassDetails.sportName} - ${selectedClassDetails.section}` : 'Class Details'}
            >
              {selectedClassDetails && (
                <div>
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-white mb-2">Class Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-400">Sport</p>
                        <p className="text-white">{selectedClassDetails.sportName}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Section</p>
                        <p className="text-white">{selectedClassDetails.section}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Created</p>
                        <p className="text-white">{new Date(selectedClassDetails.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-white">Students</h3>
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={UserPlus}
                        onClick={() => setIsAssignStudentModalOpen(true)}
                      >
                        Assign Student
                      </Button>
                    </div>
                    
                    {selectedClassDetails.students.length === 0 ? (
                      <p className="text-gray-400">No students assigned to this class yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {selectedClassDetails.students.map(student => (
                          <div 
                            key={student.id}
                            className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/10"
                          >
                            <div>
                              <p className="text-white font-medium">{student.firstName} {student.lastName}</p>
                              <p className="text-sm text-gray-400">{student.email}</p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              icon={X}
                              onClick={() => handleRemoveStudent(student.id)}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Assign Student Form */}
                  {isAssignStudentModalOpen && (
                    <div className="mt-4 p-4 bg-white/5 rounded-xl border border-white/10">
                      <h4 className="text-white font-medium mb-3">Assign Student to Class</h4>
                      <div className="mb-4">
                        <select
                          value={selectedStudentId}
                          onChange={(e) => setSelectedStudentId(e.target.value)}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select a student</option>
                          {students.map(student => (
                            <option key={student.id} value={student.id}>
                              {student.firstName} {student.lastName}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex justify-end space-x-3">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setIsAssignStudentModalOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button 
                          variant="primary" 
                          size="sm"
                          icon={Check}
                          onClick={handleAssignStudent}
                          isLoading={isSubmitting}
                          disabled={!selectedStudentId}
                        >
                          Assign
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Modal>
          </>
        )}
      </PageTemplate>
    </AuthWrapper>
  );
};

export default CoachClassesPage; 