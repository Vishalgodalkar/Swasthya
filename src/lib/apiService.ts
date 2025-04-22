
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
  },
  
  changePassword: async (data: { currentPassword: string; newPassword: string; confirmPassword: string }) => {
    const response = await API.post('/auth/change-password', data);
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
  },
  
  updatePrivacySettings: async (settings: {
    shareHealthData: boolean;
    profileVisibility: string;
    emailNotifications: boolean;
  }) => {
    const response = await API.put('/users/privacy-settings', settings);
    return response.data;
  },
  
  exportHealthData: async (format: string = 'json') => {
    const response = await API.get(`/users/export-health-data?format=${format}`, {
      responseType: 'blob'
    });
    return response.data;
  },
  
  getHealthSummary: async () => {
    const response = await API.get('/users/health-summary');
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
  },
  
  uploadCredentials: async (data: { licenseDocumentUrl?: string, certificateDocumentUrl?: string }) => {
    const response = await API.post('/doctors/credentials', data);
    return response.data;
  },

  // Function to handle file uploads (in a real implementation, this would upload to a storage service)
  uploadDocument: async (file: File) => {
    // This is a mock function - in a real implementation, you would upload to S3 or similar
    // For now, we'll just simulate an upload with a fake URL
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
    return {
      success: true,
      fileUrl: `https://example.com/uploads/${file.name}`
    };
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
  
  create: async (reportData: FormData) => {
    const response = await API.post('/reports', reportData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },
  
  update: async (id: string, reportData: FormData) => {
    const response = await API.put(`/reports/${id}`, reportData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await API.delete(`/reports/${id}`);
    return response.data;
  },
  
  download: async (id: string) => {
    const response = await API.get(`/reports/${id}/download`, {
      responseType: 'blob'
    });
    return response.data;
  },
  
  uploadAttachment: async (reportId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await API.post(`/reports/${reportId}/attachments`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
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

// Support API
export const supportAPI = {
  submitRequest: async (requestData: {
    supportType: string;
    subject: string;
    message: string;
  }) => {
    const response = await API.post('/support/requests', requestData);
    return response.data;
  },
  
  getRequests: async () => {
    const response = await API.get('/support/requests');
    return response.data;
  },
  
  getFAQs: async () => {
    const response = await API.get('/support/faqs');
    return response.data;
  }
};

// Health Data API
export const healthDataAPI = {
  export: async (format: string = 'json') => {
    const response = await API.get(`/health-data/export?format=${format}`, {
      responseType: 'blob'
    });
    
    // Create a download link and trigger the download
    const url = window.URL.createObjectURL(new Blob([response]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `health-data-export.${format}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    return true;
  },
  
  import: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await API.post('/health-data/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }
};
