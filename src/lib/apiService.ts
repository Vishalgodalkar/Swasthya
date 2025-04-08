
import axios from 'axios';

// Create an axios instance
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to add auth token to requests
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('telehealth-token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await API.post('/auth/login', credentials);
    return response.data;
  },
  
  register: async (userData: any) => {
    const response = await API.post('/auth/register', userData);
    return response.data;
  },
  
  getProfile: async () => {
    const response = await API.get('/auth/me');
    return response.data;
  },
  
  logout: async () => {
    const response = await API.get('/auth/logout');
    return response.data;
  }
};

// Users API
export const usersAPI = {
  updateDetails: async (details: any) => {
    const response = await API.put('/users/details', details);
    return response.data;
  },
  
  updateProfile: async (profile: any) => {
    const response = await API.put('/users/profile', profile);
    return response.data;
  },
  
  uploadProfileImage: async (imageUrl: string) => {
    const response = await API.put('/users/profile-image', { imageUrl });
    return response.data;
  }
};

// Doctors API
export const doctorsAPI = {
  getAllDoctors: async (params = {}) => {
    const response = await API.get('/doctors', { params });
    return response.data;
  },
  
  getDoctor: async (id: string) => {
    const response = await API.get(`/doctors/${id}`);
    return response.data;
  },
  
  updateProfile: async (profile: any) => {
    const response = await API.put('/doctors/profile', profile);
    return response.data;
  },
  
  updateAvailability: async (availableSlots: any) => {
    const response = await API.put('/doctors/availability', { availableSlots });
    return response.data;
  }
};

// Patients API
export const patientsAPI = {
  getProfile: async () => {
    const response = await API.get('/patients/profile');
    return response.data;
  },
  
  updateProfile: async (profile: any) => {
    const response = await API.put('/patients/profile', profile);
    return response.data;
  }
};

// Appointments API
export const appointmentsAPI = {
  getAll: async () => {
    const response = await API.get('/appointments');
    return response.data;
  },
  
  get: async (id: string) => {
    const response = await API.get(`/appointments/${id}`);
    return response.data;
  },
  
  create: async (appointment: any) => {
    const response = await API.post('/appointments', appointment);
    return response.data;
  },
  
  update: async (id: string, appointment: any) => {
    const response = await API.put(`/appointments/${id}`, appointment);
    return response.data;
  },
  
  cancel: async (id: string) => {
    const response = await API.put(`/appointments/${id}/cancel`);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await API.delete(`/appointments/${id}`);
    return response.data;
  }
};

// Reports API
export const reportsAPI = {
  getAll: async (params = {}) => {
    const response = await API.get('/reports', { params });
    return response.data;
  },
  
  get: async (id: string) => {
    const response = await API.get(`/reports/${id}`);
    return response.data;
  },
  
  create: async (report: any) => {
    const response = await API.post('/reports', report);
    return response.data;
  },
  
  update: async (id: string, report: any) => {
    const response = await API.put(`/reports/${id}`, report);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await API.delete(`/reports/${id}`);
    return response.data;
  }
};

// Zoom API
export const zoomAPI = {
  createMeeting: async (meetingDetails: any) => {
    const response = await API.post('/zoom/meetings', meetingDetails);
    return response.data;
  },
  
  getMeeting: async (meetingId: string) => {
    const response = await API.get(`/zoom/meetings/${meetingId}`);
    return response.data;
  }
};
