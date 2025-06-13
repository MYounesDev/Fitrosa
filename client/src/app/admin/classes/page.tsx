"use client"

import React, { useEffect, useState } from 'react';
import { classService, sportService, coachService, studentService } from '@/services/api';
import { Search, PlusCircle, Edit, Trash2, X, Check, UserPlus, Users, BookOpen } from 'lucide-react';
import AuthWrapper from '@/components/AuthWrapper';
import PageTemplate from "@/components/PageTemplate";
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

// Interfaces
interface Sport {
  id: number;
  sportName: string;
}

interface Coach {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

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
  hasCoach: boolean;
  coach: Coach | null;
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
const ClassCard = ({ classItem, onView, onAssignCoach, onDelete }) => {
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
        <div className="flex space-x-2">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onView(classItem)}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
          >
            <Users size={16} />
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onAssignCoach(classItem)}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
          >
            <UserPlus size={16} />
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDelete(classItem)}
            className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-white/10 rounded-lg"
          >
            <Trash2 size={16} />
          </motion.button>
        </div>
      </div>
      
      <div className="text-sm mb-2">
        <p className="text-gray-400">Coach: {classItem.hasCoach ? `${classItem.coach.firstName} ${classItem.coach.lastName}` : 'Unassigned'}</p>
      </div>
      
      <div className="text-sm">
        <p className="text-gray-400">Created: {new Date(classItem.createdAt).toLocaleDateString()}</p>
      </div>
    </motion.div>
  );
};

// Main Component
const ClassesPage = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [filteredClasses, setFilteredClasses] = useState<Class[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSportsLoading, setIsSportsLoading] = useState(false);
  const [isCoachesLoading, setIsCoachesLoading] = useState(false);
  const [isStudentsLoading, setIsStudentsLoading] = useState(false);
  const [isClassDetailsLoading, setIsClassDetailsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sports, setSports] = useState<Sport[]>([]);
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  
  // Form states
  const [newClass, setNewClass] = useState({
    sportId: '',
    section: '',
    coachId: ''
  });
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isAssignCoachModalOpen, setIsAssignCoachModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAssignStudentModalOpen, setIsAssignStudentModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [selectedClassDetails, setSelectedClassDetails] = useState<ClassDetail | null>(null);
  const [selectedCoachId, setSelectedCoachId] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState('');

  useEffect(() => {
    fetchClasses();
    fetchSports();
    fetchCoaches();
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

  const fetchSports = async () => {
    try {
      setIsSportsLoading(true);
      const response = await sportService.getAllSports();
      setSports(response.sports);
    } catch (error) {
      console.error('Error fetching sports:', error);
    } finally {
      setIsSportsLoading(false);
    }
  };

  const fetchCoaches = async () => {
    try {
      setIsCoachesLoading(true);
      const response = await coachService.getAllCoaches();
      setCoaches(response.coaches);
    } catch (error) {
      console.error('Error fetching coaches:', error);
    } finally {
      setIsCoachesLoading(false);
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
      setIsClassDetailsLoading(true);
      const response = await classService.getClass(id);
      setSelectedClassDetails(response.data);
    } catch (error) {
      console.error('Error fetching class details:', error);
    } finally {
      setIsClassDetailsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewClass({ ...newClass, [name]: value });
  };

  const handleAddClass = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!newClass.sportId || !newClass.section) {
      console.error('All fields are required');
      return;
    }
    
    try {
      setIsSubmitting(true);
      await classService.createClass(newClass);
      setNewClass({
        sportId: '',
        section: '',
        coachId: ''
      });
      setIsAddModalOpen(false);
      fetchClasses();
    } catch (error) {
      console.error('Error adding class:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAssignCoach = async () => {
    if (!selectedClass || !selectedCoachId) return;
    
    try {
      setIsSubmitting(true);
      await classService.assignCoach(selectedClass.id, Number(selectedCoachId));
      fetchClasses();
      setSelectedCoachId('');
      setIsAssignCoachModalOpen(false);
    } catch (error) {
      console.error('Error assigning coach:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClass = async () => {
    if (!selectedClass) return;
    
    try {
      setIsSubmitting(true);
      await classService.deleteClass(selectedClass.id);
      fetchClasses();
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting class:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAssignStudent = async () => {
    if (!selectedClassDetails || !selectedStudentId) return;
    
    try {
      setIsSubmitting(true);
      await classService.assignStudent(selectedClassDetails.id, Number(selectedStudentId));
      fetchClassDetails(selectedClassDetails.id);
      setSelectedStudentId('');
    } catch (error) {
      console.error('Error assigning student:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveStudent = async (studentId: number) => {
    if (!selectedClassDetails) return;
    
    try {
      setIsSubmitting(true);
      await classService.removeStudent(selectedClassDetails.id, studentId);
      fetchClassDetails(selectedClassDetails.id);
    } catch (error) {
      console.error('Error removing student:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openViewModal = (classItem: Class) => {
    setSelectedClass(classItem);
    fetchClassDetails(classItem.id);
    setIsViewModalOpen(true);
  };

  const openAssignCoachModal = (classItem: Class) => {
    setSelectedClass(classItem);
    setSelectedCoachId(classItem.coach?.id.toString() || '');
    setIsAssignCoachModalOpen(true);
  };

  const openDeleteModal = (classItem: Class) => {
    setSelectedClass(classItem);
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
              <h1 className="text-3xl font-bold text-white mb-2">Class Management</h1>
              <p className="text-gray-400">Create, assign coaches, and manage students in classes</p>
            </div>

            {/* Search and Add */}
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
              <Button
                variant="primary"
                icon={PlusCircle}
                onClick={() => setIsAddModalOpen(true)}
              >
                Add Class
              </Button>
            </div>

            {/* Classes Grid */}
            {filteredClasses.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">No classes found. Add your first class!</p>
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
                        onAssignCoach={openAssignCoachModal}
                        onDelete={openDeleteModal}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            {/* Add Class Modal */}
            <Modal 
              isOpen={isAddModalOpen} 
              onClose={() => setIsAddModalOpen(false)} 
              title="Add New Class"
            >
              <form onSubmit={handleAddClass}>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Sport
                    </label>
                    <select
                      name="sportId"
                      value={newClass.sportId}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select a sport</option>
                      {sports.map(sport => (
                        <option key={sport.id} value={sport.id}>
                          {sport.sportName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Section
                    </label>
                    <input
                      type="text"
                      name="section"
                      value={newClass.section}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter section name (e.g., A, B, Beginners, Advanced)"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Coach (Optional)
                    </label>
                    <select
                      name="coachId"
                      value={newClass.coachId}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select a coach (optional)</option>
                      {coaches.map(coach => (
                        <option key={coach.id} value={coach.id}>
                          {coach.firstName} {coach.lastName}
                        </option>
                      ))}
                    </select>
                  </div>
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
                    Create Class
                  </Button>
                </div>
              </form>
            </Modal>

            {/* View Class Modal */}
            <Modal 
              isOpen={isViewModalOpen} 
              onClose={() => setIsViewModalOpen(false)} 
              title={selectedClassDetails ? `${selectedClassDetails.sportName} - ${selectedClassDetails.section}` : 'Class Details'}
            >
              {isClassDetailsLoading ? (
                <LoadingSpinner size="md" />
              ) : (
                selectedClassDetails && (
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
                          <p className="text-gray-400">Coach</p>
                          <p className="text-white">
                            {selectedClassDetails.hasCoach 
                              ? `${selectedClassDetails.coach.firstName} ${selectedClassDetails.coach.lastName}` 
                              : 'Unassigned'}
                          </p>
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
                                isLoading={isSubmitting}
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
                )
              )}
            </Modal>

            {/* Assign Coach Modal */}
            <Modal 
              isOpen={isAssignCoachModalOpen} 
              onClose={() => setIsAssignCoachModalOpen(false)} 
              title="Assign Coach to Class"
            >
              {selectedClass && (
                <div>
                  <p className="mb-4 text-white">
                    Assign a coach to <span className="font-bold">{selectedClass.sportName} - {selectedClass.section}</span>
                  </p>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Coach
                    </label>
                    <select
                      value={selectedCoachId}
                      onChange={(e) => setSelectedCoachId(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select a coach</option>
                      {coaches.map(coach => (
                        <option key={coach.id} value={coach.id}>
                          {coach.firstName} {coach.lastName}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex justify-end space-x-3 mt-6">
                    <Button 
                      variant="outline" 
                      onClick={() => setIsAssignCoachModalOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      variant="primary" 
                      onClick={handleAssignCoach}
                      icon={Check}
                      isLoading={isSubmitting}
                      disabled={!selectedCoachId}
                    >
                      Assign Coach
                    </Button>
                  </div>
                </div>
              )}
            </Modal>

            {/* Delete Class Modal */}
            <Modal 
              isOpen={isDeleteModalOpen} 
              onClose={() => setIsDeleteModalOpen(false)} 
              title="Delete Class"
            >
              {selectedClass && (
                <div>
                  <p className="text-white mb-2">
                    Are you sure you want to delete <span className="font-bold">{selectedClass.sportName} - {selectedClass.section}</span>?
                  </p>
                  <p className="text-red-400 mb-4">
                    This will remove all student assignments to this class. This action cannot be undone.
                  </p>
                  
                  <div className="flex justify-end space-x-3 mt-6">
                    <Button 
                      variant="outline" 
                      onClick={() => setIsDeleteModalOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      variant="danger" 
                      onClick={handleDeleteClass}
                      icon={Trash2}
                      isLoading={isSubmitting}
                    >
                      Delete Class
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

export default ClassesPage; 