'use client';

import { useState, useEffect } from 'react';
import { studentService, attendanceService, classService } from '@/services/api';
import Calendar from 'react-calendar';
import AuthWrapper from '@/components/AuthWrapper';
import PageTemplate from '@/components/PageTemplate';
import 'react-calendar/dist/Calendar.css';
import './attendance.css';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Calendar as CalendarIcon, Users, Activity, Check, X, BookOpen } from 'lucide-react';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface Student {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    classStudentId: number;
}

interface Class {
    id: number;
    section: string;
    sportId: number;
    sportName: string;
    hasCoach?: boolean;
    coach?: {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
    } | null;
}

interface AttendanceLog {
    id: number;
    studentId: number;
    date: string;
    status: 'attended' | 'not_attended' | 'with_report' | 'day_off';
    note?: string;
}

interface FormData {
    status: AttendanceLog['status'];
    note: string;
}

interface ApiResponse<T> {
    students?: T[];
    data?: T[];
    message?: string;
}

// Add after the ApiResponse interface
interface StatsCardProps {
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
}

interface StudentCardProps {
    student: Student;
    isSelected: boolean;
    onClick: (student: Student) => void;
}

interface ClassCardProps {
    class: Class;
    isSelected: boolean;
    onClick: (classItem: Class) => void;
}

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

// Stats Card Component
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

// Student Card Component
const StudentCard: React.FC<StudentCardProps> = ({ student, isSelected, onClick }) => {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className={`bg-white/5 backdrop-blur-lg rounded-xl shadow-2xl p-5 border border-white/10 cursor-pointer ${isSelected ? 'ring-2 ring-blue-500' : ''
                }`}
            onClick={() => onClick(student)}
        >
            <div className="flex items-center">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white font-bold shadow-lg">
                    {student.firstName[0]}{student.lastName[0]}
                </div>
                <div className="ml-3">
                    <h3 className="font-semibold text-white">{student.firstName} {student.lastName}</h3>
                    <p className="text-sm text-gray-400">{student.email}</p>
                </div>
            </div>
        </motion.div>
    );
};

// Class Card Component
const ClassCard: React.FC<ClassCardProps> = ({ class: classItem, isSelected, onClick }) => {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className={`bg-white/5 backdrop-blur-lg rounded-xl shadow-2xl p-5 border border-white/10 cursor-pointer ${isSelected ? 'ring-2 ring-blue-500' : ''
                }`}
            onClick={() => onClick(classItem)}
        >
            <div className="flex items-center">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center text-white font-bold shadow-lg">
                    <BookOpen size={16} />
                </div>
                <div className="ml-3">
                    <h3 className="font-semibold text-white">{classItem.sportName}</h3>
                    <p className="text-sm text-gray-400">Section: {classItem.section}</p>
                </div>
            </div>
        </motion.div>
    );
};

// Modal Component
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

// Add a type for the API response
interface ClassesResponse {
    classes?: Class[];
    data?: Class[];
    message?: string;
}

// Add type definition for AuthWrapper props to match the component
interface AuthWrapperProps {
    children: React.ReactNode;
    allowedRoles: string[];
    redirectTo?: string;
}

const AttendancePage = () => {
    const [classes, setClasses] = useState<Class[]>([]);
    const [filteredClasses, setFilteredClasses] = useState<Class[]>([]);
    const [classSearchTerm, setClassSearchTerm] = useState('');
    const [selectedClass, setSelectedClass] = useState<Class | null>(null);

    const [students, setStudents] = useState<Student[]>([]);
    const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
    const [studentSearchTerm, setStudentSearchTerm] = useState('');
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

    const [attendanceLogs, setAttendanceLogs] = useState<AttendanceLog[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedLog, setSelectedLog] = useState<AttendanceLog | null>(null);
    const [formData, setFormData] = useState<FormData>({
        status: 'attended',
        note: '',
    });
    
    const [isLoadingClasses, setIsLoadingClasses] = useState(true);
    const [isLoadingStudents, setIsLoadingStudents] = useState(false);
    const [isLoadingLogs, setIsLoadingLogs] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchClasses();
    }, []);

    useEffect(() => {
        if (classSearchTerm) {
            const filtered = classes.filter(cls =>
                cls.section.toLowerCase().includes(classSearchTerm.toLowerCase()) ||
                cls.sportName.toLowerCase().includes(classSearchTerm.toLowerCase())
            );
            setFilteredClasses(filtered);
        } else {
            setFilteredClasses(classes);
        }
    }, [classSearchTerm, classes]);

    useEffect(() => {
        if (selectedClass) {
            fetchStudentsInClass(selectedClass.id);
            setSelectedStudent(null);
            setAttendanceLogs([]);
        }
    }, [selectedClass]);

    useEffect(() => {
        if (studentSearchTerm) {
            const filtered = students.filter(student =>
                student.firstName.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
                student.lastName.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
                student.email.toLowerCase().includes(studentSearchTerm.toLowerCase())
            );
            setFilteredStudents(filtered);
        } else {
            setFilteredStudents(students);
        }
    }, [studentSearchTerm, students]);

    useEffect(() => {
        if (selectedStudent) {
            fetchAttendanceLogs();
        }
    }, [selectedStudent]);

    const fetchClasses = async () => {
        try {
            setIsLoadingClasses(true);
            const response = await classService.getAllClasses();
            
            // The server returns classes in response.classes based on the server code
            const classesData = (response as any).classes || [];
            setClasses(classesData);
            setFilteredClasses(classesData);
        } catch (error) {
            console.error('Failed to fetch classes:', error);
        } finally {
            setIsLoadingClasses(false);
        }
    };

    const fetchStudentsInClass = async (classId: number) => {
        try {
            setIsLoadingStudents(true);
            const response = await classService.getClass(classId);
            console.log(response);
            
            const studentsWithClassIds = response.data.students.map((student: any) => ({
                ...student,
                classStudentId: student.classStudentId || student.ClassStudent?.id
            })) || [];
            
            setStudents(studentsWithClassIds);
            setFilteredStudents(studentsWithClassIds);
        } catch (error) {
            console.error('Failed to fetch students in class:', error);
        } finally {
            setIsLoadingStudents(false);
        }
    };

    const fetchAttendanceLogs = async () => {
        try {
            if (!selectedStudent) return;
            setIsLoadingLogs(true);
            const response = await attendanceService.getStudentAttendance(selectedStudent.classStudentId) as ApiResponse<AttendanceLog>;
            console.log("!!!!!!!");
            console.log(response);
            console.log(response.data);
            console.log(selectedStudent.classStudentId);
            console.log("!!!!!!!");
            setAttendanceLogs(response.data || []);
        } catch (error) {
            console.error('Failed to fetch attendance logs:', error);
        } finally {
            setIsLoadingLogs(false);
        }
    };

    const handleClassSelect = (classItem: Class) => {
        setSelectedClass(classItem);
    };

    const handleStudentSelect = (student: Student) => {
        setSelectedStudent(student);
    };

    const handleDateClick = (value: any) => {
        if (!value || Array.isArray(value)) return;
        const date = value as Date;
        const existingLog = attendanceLogs.find(
            log => new Date(log.date).toDateString() === date.toDateString()
        );
        setSelectedDate(date);
        setSelectedLog(existingLog || null);
        setFormData({
            status: existingLog?.status || 'attended',
            note: existingLog?.note || '',
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async () => {
        if (!selectedStudent || !selectedDate) return;
        
        try {
            setIsSubmitting(true);
            const requestData = {
                date: selectedDate.toISOString().split('T')[0],
                status: formData.status,
                note: formData.note
            };
            
            if (selectedLog) {
                await attendanceService.updateAttendanceLog(selectedLog.id, requestData);
            } else {
                console.log(selectedStudent.classStudentId);    
                await attendanceService.createAttendanceLog(selectedStudent.classStudentId, requestData);
            }
            
            fetchAttendanceLogs();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Failed to save attendance:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedLog) return;
        try {
            await attendanceService.deleteAttendanceLog(selectedLog.id);
            await fetchAttendanceLogs();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Failed to delete attendance:', error);
        }
    };

    const getTileClassName = ({ date }: { date: Date }): string => {
        const log = attendanceLogs.find(
            log => new Date(log.date).toDateString() === date.toDateString()
        );
        if (!log) return '';
        return `attendance-${log.status}`;
    };

    // Calculate stats
    const totalAttendance = attendanceLogs.length;
    const attendedCount = attendanceLogs.filter(log => log.status === 'attended').length;
    const notAttendedCount = attendanceLogs.filter(log => log.status === 'not_attended').length;
    const withReportCount = attendanceLogs.filter(log => log.status === 'with_report').length;

    return (
        <AuthWrapper 
            allowedRoles={["admin", "coach"]}
            redirectTo="/login"
        >
            <PageTemplate>
                {isLoadingClasses ? (
                    <LoadingSpinner fullScreen />
                ) : (
                    <div className="max-w-7xl mx-auto px-4 py-8">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                            <h1 className="text-2xl font-bold text-white">Student Attendance Management</h1>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Classes List */}
                            <div className="lg:col-span-1 space-y-4">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-semibold text-white">Classes</h2>
                                    <div className="flex-1 max-w-xs ml-4">
                                        <div className="relative">
                                            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="text"
                                                placeholder="Search classes..."
                                                value={classSearchTerm}
                                                onChange={(e) => setClassSearchTerm(e.target.value)}
                                                className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4 max-h-[540px] overflow-y-auto pr-2 p-4 rounded-lg">
                                    <AnimatePresence>
                                        {filteredClasses.map((classItem) => (
                                            <motion.div
                                                key={classItem.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -20 }}
                                            >
                                                <ClassCard
                                                    class={classItem}
                                                    isSelected={selectedClass?.id === classItem.id}
                                                    onClick={handleClassSelect}
                                                />
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* Students for Selected Class */}
                            {selectedClass && (
                                <div className="lg:col-span-1 space-y-4">
                                    {isLoadingStudents ? (
                                        <LoadingSpinner />
                                    ) : (
                                        <>
                                            <div className="flex items-center justify-between mb-4">
                                                <h2 className="text-xl font-semibold text-white">Students</h2>
                                                <div className="flex-1 max-w-xs ml-4">
                                                    <div className="relative">
                                                        <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                                        <input
                                                            type="text"
                                                            placeholder="Search students..."
                                                            value={studentSearchTerm}
                                                            onChange={(e) => setStudentSearchTerm(e.target.value)}
                                                            className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-4 max-h-[540px] overflow-y-auto pr-2 p-4 rounded-lg">
                                                <AnimatePresence>
                                                    {filteredStudents.map((student) => (
                                                        <motion.div
                                                            key={student.id}
                                                            initial={{ opacity: 0, y: 20 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, y: -20 }}
                                                        >
                                                            <StudentCard
                                                                student={student}
                                                                isSelected={selectedStudent?.id === student.id}
                                                                onClick={handleStudentSelect}
                                                            />
                                                        </motion.div>
                                                    ))}
                                                </AnimatePresence>
                                                {filteredStudents.length === 0 && (
                                                    <div className="text-center py-8 text-gray-400">
                                                        No students found in this class.
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}

                            {/* Attendance Calendar for Selected Student */}
                            {selectedStudent && (
                                <div className="lg:col-span-1">
                                    {isLoadingLogs ? (
                                        <LoadingSpinner />
                                    ) : (
                                        <div className="space-y-6">
                                            {/* Attendance Calendar */}
                                            <h2 className="text-xl font-semibold text-white mb-4">
                                                Attendance Calendar - {selectedStudent.firstName} {selectedStudent.lastName}
                                            </h2>
                                            <div className="bg-white/5 backdrop-blur-lg rounded-xl shadow-2xl p-6 border border-white/10">
                                                <div className="calendar-wrapper">
                                                    <Calendar
                                                        onChange={handleDateClick}
                                                        tileClassName={getTileClassName}
                                                        value={null}
                                                        className="attendance-calendar"
                                                    />
                                                </div>
                                            </div>

                                            {/* Attendance Stats */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                                <StatsCard
                                                    title="Total Records"
                                                    value={totalAttendance}
                                                    icon={<Activity size={24} className="text-blue-500" />}
                                                    color="bg-blue-500/10"
                                                />
                                                <StatsCard
                                                    title="Attended"
                                                    value={attendedCount}
                                                    icon={<Check size={24} className="text-green-500" />}
                                                    color="bg-green-500/10"
                                                />
                                                <StatsCard
                                                    title="Not Attended"
                                                    value={notAttendedCount}
                                                    icon={<X size={24} className="text-red-500" />}
                                                    color="bg-red-500/10"
                                                />
                                                <StatsCard
                                                    title="With Report"
                                                    value={withReportCount}
                                                    icon={<CalendarIcon size={24} className="text-yellow-500" />}
                                                    color="bg-yellow-500/10"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Attendance Modal */}
                        <Modal
                            isOpen={isModalOpen}
                            onClose={() => setIsModalOpen(false)}
                            title={`${selectedLog ? 'Update' : 'Mark'} Attendance`}
                        >
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Status
                                    </label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value as AttendanceLog['status'] })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="attended">Attended</option>
                                        <option value="not_attended">Not Attended</option>
                                        <option value="with_report">With Report</option>
                                        <option value="day_off">Day Off</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Note
                                    </label>
                                    <textarea
                                        value={formData.note}
                                        onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        rows={3}
                                    />
                                </div>

                                <div className="flex justify-between">
                                    <div>
                                        {selectedLog && (
                                            <Button
                                                variant="danger"
                                                onClick={handleDelete}
                                            >
                                                Delete
                                            </Button>
                                        )}
                                    </div>
                                    <div className="flex gap-4">
                                        <Button
                                            variant="secondary"
                                            onClick={() => setIsModalOpen(false)}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            variant="primary"
                                            onClick={handleSubmit}
                                            isLoading={isSubmitting}
                                        >
                                            {selectedLog ? 'Update' : 'Save'}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Modal>
                    </div>
                )}
            </PageTemplate>
        </AuthWrapper>
    );
};

export default AttendancePage;
