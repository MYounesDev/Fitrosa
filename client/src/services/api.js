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

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const { response } = error;
    
    // Handle expired tokens or authentication errors
    if (response && response.status === 401) {
      // Clear local storage and redirect to login if token is invalid or expired
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(
      response?.data?.message || 'Something went wrong. Please try again.'
    );
  }
);

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
      window.location.href = '/login';
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
  isAuthenticated: () => {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('token');
  },
  
  // Change user password
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
  
  // Get user profile
  getProfile: async () => {
    try {
      const response = await api.get('/user/profile');
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

  // Get attendance logs for a specific student (admin/coach)
  getStudentAttendance: async (studentId) => {
    try {
      const response = await api.get(`/attendance/${studentId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Create attendance log for a student (admin/coach)
  createAttendanceLog: async (studentId, attendanceData) => {
    try {
      const response = await api.post(`/attendance/${studentId}`, attendanceData);
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
  }
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
  adminService,
  userService,
  notificationService,
  isAdmin,
  isCoach,
  isStudent
};