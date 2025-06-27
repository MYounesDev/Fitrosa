// client/src/services/api.js
import axios from 'axios';



if (!process.env.NEXT_PUBLIC_API_URL) {
  console.warn("Environment variable NEXT_PUBLIC_API_URL is not set, using default localhost.");
}
const API_URL = (process.env.NEXT_PUBLIC_API_URL || `http://localhost:5000`) 

//.replace("localhost", "192.168.1.108")  // uncomment this line to use a specific IP address

;


// Create an axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


// Request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


// Response interceptor to handle errors and responses
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const { response } = error;
    
    // Handle authentication errors (excluding login failures)
    console.log('response : ', response);
    if (response?.status === 401 && response.data?.message !== 'Invalid email or password') {
      handleSessionExpiration(response.data?.message);
    }
    
    // Extract and return error message
    const errorMessage = response?.data?.message || error.message || 'An unknown error occurred';
    return Promise.reject(errorMessage);
  }
);

/**
 * Handles session expiration by clearing auth data and redirecting to login
 * @param {string} message - Error message from the response
 */
async function handleSessionExpiration(message) {
  if (typeof window === 'undefined') return;
  
  // Clear authentication data
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  
  // Log for debugging
  console.log('Session expired:', message);
  
  // Build redirect URL
  const { protocol, host } = window.location;
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const isTokenExpired = message === 'TokenExpiredError';
  const redirectPath = `/login${isTokenExpired ? '?expired=true' : ''}`;
  

  // Perform redirect
  window.location.href = `${protocol}//${host}${basePath}${redirectPath}`;
}

// Auth Services
export const authService = {
  // Log in the user and store the token
  login: async (email, password) => {
    try {
      const response = await api.post('/login', { email, password });
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  // Register a new user
  register: async (userData) => {
    try {
      const response = await api.post('/register', userData);
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  // Log out the user by removing the token
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (typeof window !== 'undefined') {
  // Build redirect URL
  const { protocol, host } = window.location;
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const redirectPath = `/login`;
  

  // Perform redirect
  window.location.href = `${protocol}//${host}${basePath}${redirectPath}`;
    }
  },
  
  // Get the currently logged-in user
  getCurrentUser: () => {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem('user');
    if (!user) return null;
    try {
      return JSON.parse(user);
    } catch (error) {
      console.error('Failed to parse user data:', error);
      // If there's invalid data in localStorage, clean it up
      localStorage.removeItem('user');
      return null;
    }
  },
  
  // Get the current auth token
  getToken: () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  },
  
  // Check if the user is authenticated
  isAuthenticated: async() => {
    try {
      const response = await api.get('/isAuthenticated');

      console.log(response);
      
      return !!response.token;
    } catch (error) {
      throw error;
    }
    /*
      if (typeof window === 'undefined') return false;
      return !!localStorage.getItem('token');
    */

  },
  
  // Get the user profile
  getProfile: async () => {
    try {
      const response = await api.get('/profile');
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  // Change password
  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await api.post('/change-password', { // FIND OUT HOT THE TOKEN DOSEN't GO TO THIS REQUSTE 
        currentPassword,
        newPassword
      });

      if (response.status === 400) {
        // current password is incorrect
        response.error = "Current password is incorrect";
        return response;
      }



      // Update token if provided in the response
      if (response.token) {
        localStorage.setItem('user', JSON.stringify(response.user)); 
        localStorage.setItem('token', response.token);
      }
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  // Setup password (for new users)
  setupPassword: async (token, password) => {
    try {
      const response = await api.post(`/auth/setup-password/${token}`, { password });
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  // Request password reset
  requestPasswordReset: async (email) => {
    try {
      const response = await api.post('/forgot-password', { email });
      return response;
    } catch (error) {
      throw error;
    }
  }
};

// Student Services
export const studentService = {
  // Get all students (admin/coach)
  getAllStudents: async () => {
    try {
      const response = await api.get('/students');
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  // Get a student by ID
  getStudent: async (id) => {
    try {
      const response = await api.get(`/students/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  // Add a new student
  addStudent: async (studentData) => {
    try {
      const response = await api.post('/students', studentData);
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  // Update a student
  updateStudent: async (id, updateData) => {
    try {
      const response = await api.put(`/students/${id}`, updateData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Delete a student
  deleteStudent: async (id) => {
    try {
      const response = await api.delete(`/students/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  }
};

// Coach Services
export const coachService = {
  // Get all coaches (admin)
  getAllCoaches: async () => {
    try {
      const response = await api.get('/coaches');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get a coach by ID (admin)
  getCoach: async (id) => {
    try {
      const response = await api.get(`/coaches/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  // Add a new coach (admin)
  addCoach: async (coachData) => {
    try {
      const response = await api.post('/add-coach', coachData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update a coach (admin)
  updateCoach: async (id, updateData) => {
    try {
      const response = await api.put(`/coaches/${id}`, updateData);
      return response;
    } catch (error) {
      throw error;
    }
  },


  // Delete a coach (admin)
  deleteCoach: async (id) => {
    try {
      const response = await api.delete(`/coaches/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

};

// Sport Services
export const sportService = {
  // Get all sports
  getAllSports: async () => {
    try {
      const response = await api.get('/sports');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get a sport by ID
  getSport: async (id) => {
    try {
      const response = await api.get(`/sports/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Create a new sport (admin only)
  createSport: async (sportData) => {
    try {
      const response = await api.post('/sports', sportData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update a sport (admin only)
  updateSport: async (id, sportData) => {
    try {
      const response = await api.put(`/sports/${id}`, sportData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Delete a sport (admin only)
  deleteSport: async (id) => {
    try {
      const response = await api.delete(`/sports/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  }
};

// Class Services
export const classService = {
  // Get all classes (admin/coach)
  getAllClasses: async () => {
    try {
      const response = await api.get('/classes');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get a class by ID (admin/coach)
  getClass: async (id) => {
    try {
      const response = await api.get(`/classes/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get unassigned classes (admin only)
  getUnassignedClasses: async () => {
    try {
      const response = await api.get('/classes/unassigned');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Create a new class (admin only)
  createClass: async (classData) => {
    try {
      const response = await api.post('/classes', classData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update a class (admin only)
  updateClass: async (id, classData) => {
    try {
      const response = await api.put(`/classes/${id}`, classData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Delete a class (admin only)
  deleteClass: async (id) => {
    try {
      const response = await api.delete(`/classes/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Assign a coach to a class (admin only)
  assignCoach: async (classId, coachId) => {
    try {
      const response = await api.post(`/classes/${classId}/coach`, { coachId });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Assign a student to a class (admin/coach)
  assignStudent: async (classId, studentId) => {
    try {
      const response = await api.post(`/classes/${classId}/students`, { studentId });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Remove a student from a class (admin/coach)
  removeStudent: async (classId, studentId) => {
    try {
      const response = await api.delete(`/classes/${classId}/students/${studentId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }
};

// Attendance Services
export const attendanceService = {
  // Get all attendance logs (admin/coach)
  getAllAttendanceLogs: async () => {
    try {
      const response = await api.get('/attendance');
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  // Get attendance logs for a class (admin/coach)
  getClassAttendance: async (classId) => {
    try {
      const response = await api.get(`/attendance/class/${classId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get attendance logs for a specific student across all classes (admin/coach)
  getStudentAttendance: async (studentId) => {
    try {
      const response = await api.get(`/attendance/class-student/${studentId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get attendance logs for a specific student in a specific class (admin/coach)
  getClassStudentAttendance: async (classStudentId) => {
    try {
      const response = await api.get(`/attendance/class-student/${classStudentId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  // Create attendance log for a student in a class (admin/coach)
  createAttendanceLog: async (classStudentId, attendanceData) => {
    try {
      const response = await api.post(`/attendance/class-student/${classStudentId}`, attendanceData);
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  // Update attendance log (admin/coach)
  updateAttendanceLog: async (id, updateData) => {
    try {
      const response = await api.put(`/attendance/${id}`, updateData);
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  // Delete attendance log (admin/coach)
  deleteAttendanceLog: async (id) => {
    try {
      const response = await api.delete(`/attendance/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  }
};

// Admin Services
export const adminService = {
  // Get all users (admin)
  getAllUsers: async () => {
    try {
      const response = await api.get('/users');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get all auth logs (admin only)
  getAllAuthLogs: async () => {
      try {
        const response = await api.get('/auth-logs');
        return response;
      } catch (error) {
        throw error;
      }
    }
};

// User Services
export const userService = {
  // Get user preferences
  getPreferences: async () => {
    try {
      const response = await api.get('/user/preferences');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update user preferences
  updatePreferences: async (preferences) => {
    try {
      const response = await api.put('/user/preferences', preferences);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update user profile
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/user/profile', profileData);
      return response;
    } catch (error) {
      throw error;
    }
  },
  

};

// Notification Services
export const notificationService = {
  // Get notification preferences
  getPreferences: async () => {
    try {
      const response = await api.get('/notifications/preferences');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update notification preferences
  updatePreferences: async (preferences) => {
    try {
      const response = await api.put('/notifications/preferences', preferences);
      return response;
    } catch (error) {
      throw error;
    }
  }
};

// Financial Transaction Services
export const financialService = {
  // Get all financial transactions (admin only)
  getAllTransactions: async () => {
    try {
      const response = await api.get('/financial');
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  // Get financial transactions with filters (admin only)
  getFilteredTransactions: async (filters = {}) => {
    try {
      // Build query parameters from filters
      const queryParams = new URLSearchParams();
      
      if (filters.transaction_type) {
        queryParams.append('transaction_type', filters.transaction_type);
      }
      
      if (filters.user_id) {
        queryParams.append('user_id', filters.user_id);
      }
      
      if (filters.min_amount) {
        queryParams.append('min_amount', filters.min_amount);
      }
      
      if (filters.max_amount) {
        queryParams.append('max_amount', filters.max_amount);
      }
      
      if (filters.currency) {
        queryParams.append('currency', filters.currency);
      }
      
      if (filters.start_date) {
        queryParams.append('start_date', filters.start_date);
      }
      
      if (filters.end_date) {
        queryParams.append('end_date', filters.end_date);
      }
      
      if (filters.search) {
        queryParams.append('search', filters.search);
      }
      
      const queryString = queryParams.toString();
      const url = queryString ? `/financial?${queryString}` : '/financial';
      
      const response = await api.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  
  // Create a new financial transaction (admin only)
  createTransaction: async (transactionData) => {
    try {
      const response = await api.post('/financial', transactionData);
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  // Update a financial transaction (admin only)
  updateTransaction: async (id, transactionData) => {
    try {
      const response = await api.put(`/financial/${id}`, transactionData);
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  // Delete a financial transaction (admin only)
  deleteTransaction: async (id) => {
    try {
      const response = await api.delete(`/financial/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  // Get financial summary (admin only)
  getFinancialSummary: async (period = 'all') => {
    try {
      const response = await api.get(`/financial/summary?period=${period}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  // Get financial transactions by user (admin only)
  getUserTransactions: async (userId) => {
    try {
      const response = await api.get(`/financial?user_id=${userId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  

  
  // Export transactions to CSV or Excel (admin only)
  exportTransactions: async (format = 'csv', filters = {}) => {
    try {
      // Build query parameters
      const queryParams = new URLSearchParams();
      queryParams.append('format', format);
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          queryParams.append(key, value);
        }
      });
      
      const queryString = queryParams.toString();
      const url = `/financial/export?${queryString}`;
      
      // Use axios directly for binary responses
      const response = await axios({
        url: `${API_URL}${url}`,
        method: 'GET',
        responseType: 'blob',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Create a download link
      const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', `financial-transactions.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      return true;
    } catch (error) {
      throw error;
    }
  }
};

// Utility function to determine if current user has admin role
export const isAdmin = () => {
  const user = authService.getCurrentUser();
  return user && user.role === 'admin';
};

// Utility function to determine if current user has coach role
export const isCoach = () => {
  const user = authService.getCurrentUser();
  return user && user.role === 'coach';
};

// Utility function to determine if current user has student role
export const isStudent = () => {
  const user = authService.getCurrentUser();
  return user && user.role === 'student';
};

export default {
  authService,
  studentService,
  coachService,
  sportService,
  classService,
  adminService,
  userService,
  notificationService,
  financialService,
  isAdmin,
  isCoach,
  isStudent
};