// Type Definitions for TeleHealth App

// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  userType: 'doctor' | 'patient' | 'admin';
  phoneNumber: string;
  profileImage: string;
  
  // Doctor-specific properties
  specialization: string | null;
  qualifications: { degree: string; institution: string; year: number }[] | null;
  experience: number | null;
  consultationFee: number | null;
  bio: string | null;
  
  // Patient-specific properties
  dateOfBirth: string | null;
  bloodType: string | null;
  height: number | null;
  weight: number | null;
  allergies: string[];
  chronicConditions: string[];
  medications: string[];
}

// API Response Types
export interface LoginResponse {
  success: boolean;
  token: string;
  user: User;
}

// Appointment Types
export interface TimeSlot {
  id: string;
  day: string;
  date: string;
  startTime: string;
  endTime: string;
  isBooked?: boolean;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  startTime: string;
  endTime: string;
  type: 'in-person' | 'virtual';
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  reason: string;
  notes?: string;
  zoomLink?: string;
  zoomPassword?: string;
  zoomMeetingId?: string;
}

// Medical Report Types
export interface MedicalReport {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentId?: string;
  title: string;
  date: string;
  reportType: string;
  symptoms?: string[];
  diagnosis?: string[];
  treatment?: {
    medications?: { name: string; dosage: string; frequency: string; duration: string }[];
    procedures?: string[];
    recommendations?: string[];
  };
  notes?: string;
  attachments?: {
    name: string;
    fileUrl: string;
    fileType: string;
  }[];
  content?: string;
  isPrivate: boolean;
  doctor: string;
  hospital: string;
  createdAt: string;
  fileUrl?: string;
}

// Health Metrics Types
export interface HealthMetric {
  id: string;
  patientId: string;
  type: 'blood-pressure' | 'heart-rate' | 'blood-sugar' | 'temperature' | 'weight' | 'oxygen-level';
  value: number;
  unit: string;
  date: string;
  time: string;
  timestamp: string;
  notes?: string;
}

// Zoom meeting types
export interface ZoomMeetingDetails {
  meetingId: string;
  password: string;
  joinUrl: string;
  link?: string;
}

// Login/Register Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  userType: 'doctor' | 'patient' | 'admin';
  phoneNumber: string;
  // Patient-specific fields
  dateOfBirth?: string;
  bloodType?: string;
  height?: number;
  weight?: number;
  allergies?: string[];
  chronicConditions?: string[];
  medications?: string[];
  // Doctor-specific fields
  specialization?: string;
  qualifications?: { degree: string; institution: string; year: number }[];
  experience?: number;
  licenseNumber?: string;
  licenseAuthority?: string;
  consultationFee?: number;
  bio?: string;
}

// Doctor Profile Type
export interface DoctorProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  phoneNumber: string;
  profileImage: string;
  specialization: string;
  qualifications: { degree: string; institution: string; year: number }[];
  experience: number;
  consultationFee: number;
  bio: string;
  availableSlots?: TimeSlot[];
  rating?: number;
  reviewCount?: number;
}

// Emergency Contact Type
export interface EmergencyContact {
  id: string;
  userId: string;
  name: string;
  relationship: string;
  phoneNumber: string;
  email?: string;
}

// Mock API Functions
export const loginUser = async (credentials: LoginCredentials): Promise<LoginResponse | null> => {
  console.log('Attempting to log in with:', credentials);
  try {
    // In a real app, this would call the backend API
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    if (response.ok) {
      const data = await response.json();
      return data;
    }
    return null;
  } catch (error) {
    console.error('Login error:', error);
    return null;
  }
};

export const registerUser = async (userData: RegisterData): Promise<User | null> => {
  console.log('Attempting to register with:', userData);
  // In a real app, this would call the backend API
  return null;
};

export const getHealthMetrics = async (patientId: string): Promise<HealthMetric[]> => {
  console.log('Fetching health metrics for patient:', patientId);
  // Return mock data
  return [
    {
      id: '1',
      patientId,
      type: 'blood-pressure',
      value: 120,
      unit: 'mmHg',
      date: '2024-03-01',
      time: '09:00',
      timestamp: '2024-03-01T09:00:00Z',
      notes: 'Morning reading'
    },
    {
      id: '2',
      patientId,
      type: 'heart-rate',
      value: 72,
      unit: 'bpm',
      date: '2024-03-01',
      time: '09:05',
      timestamp: '2024-03-01T09:05:00Z',
      notes: 'Resting'
    },
    // More mock data as needed
  ];
};

export const getAppointmentsForPatient = async (patientId: string): Promise<Appointment[]> => {
  console.log('Fetching appointments for patient:', patientId);
  // Return mock data
  return [
    {
      id: '1',
      patientId,
      doctorId: 'doctor-1',
      date: '2024-04-15',
      startTime: '10:00',
      endTime: '10:30',
      type: 'virtual',
      status: 'confirmed',
      reason: 'Annual checkup',
      zoomLink: 'https://zoom.us/j/123456789',
      zoomPassword: '123456'
    },
    {
      id: '2',
      patientId,
      doctorId: 'doctor-2',
      date: '2024-04-20',
      startTime: '14:00',
      endTime: '14:30',
      type: 'in-person',
      status: 'pending',
      reason: 'Follow-up appointment'
    }
  ];
};

export const getAppointmentsForDoctor = async (doctorId: string): Promise<Appointment[]> => {
  console.log('Fetching appointments for doctor:', doctorId);
  // Return mock data
  return [
    {
      id: '1',
      patientId: 'patient-1',
      doctorId,
      date: '2024-04-15',
      startTime: '10:00',
      endTime: '10:30',
      type: 'virtual',
      status: 'confirmed',
      reason: 'Annual checkup',
      zoomLink: 'https://zoom.us/j/123456789',
      zoomPassword: '123456'
    },
    {
      id: '2',
      patientId: 'patient-2',
      doctorId,
      date: '2024-04-20',
      startTime: '14:00',
      endTime: '14:30',
      type: 'in-person',
      status: 'pending',
      reason: 'New patient consultation'
    }
  ];
};

export const getMedicalReports = async (userId: string): Promise<MedicalReport[]> => {
  console.log('Fetching medical reports for user:', userId);
  // Return mock data
  return [
    {
      id: '1',
      patientId: userId,
      doctorId: 'doctor-1',
      title: 'Annual Physical Examination',
      date: '2024-02-15',
      reportType: 'Physical Examination',
      notes: 'Patient is in good health overall.',
      isPrivate: false,
      doctor: 'Dr. Sarah Smith',
      hospital: 'General Hospital',
      createdAt: '2024-02-15T10:00:00Z',
      content: 'Detailed examination results...',
      fileUrl: 'https://example.com/reports/annual-exam.pdf'
    },
    {
      id: '2',
      patientId: userId,
      doctorId: 'doctor-2',
      title: 'Blood Test Results',
      date: '2024-03-01',
      reportType: 'Laboratory',
      notes: 'All values within normal range.',
      isPrivate: false,
      doctor: 'Dr. John Brown',
      hospital: 'City Medical Center',
      createdAt: '2024-03-01T14:30:00Z',
      content: 'Detailed blood test results...',
      fileUrl: 'https://example.com/reports/blood-test.pdf'
    }
  ];
};

// Additional API Function Stubs (since actual implementations are in backend)
export const getUserProfile = async (userId: string): Promise<User | null> => {
  console.log('Fetching user profile:', userId);
  return null;
};

export const updateUserProfile = async (userId: string, userData: Partial<User>): Promise<User | null> => {
  console.log('Updating user profile:', userId, userData);
  return null;
};

export const updateAppointment = async (appointmentId: string, appointmentData: Partial<Appointment>): Promise<Appointment | null> => {
  console.log('Updating appointment:', appointmentId, appointmentData);
  return null;
};

export const generateZoomMeeting = async (appointmentId: string): Promise<ZoomMeetingDetails | null> => {
  console.log('Generating Zoom meeting for appointment:', appointmentId);
  return null;
};

export const getAllDoctors = async (): Promise<DoctorProfile[]> => {
  console.log('Fetching all doctors');
  return [];
};

export const getDoctorAvailability = async (doctorId: string): Promise<TimeSlot[]> => {
  console.log('Fetching doctor availability:', doctorId);
  return [];
};

export const createAppointment = async (appointmentData: Partial<Appointment>): Promise<Appointment | null> => {
  console.log('Creating appointment:', appointmentData);
  return null;
};

export const getEmergencyContacts = async (userId: string): Promise<EmergencyContact[]> => {
  console.log('Fetching emergency contacts:', userId);
  return [];
};

export const createEmergencyContact = async (contactData: Omit<EmergencyContact, 'id'>): Promise<EmergencyContact | null> => {
  console.log('Creating emergency contact:', contactData);
  return null;
};

export const deleteEmergencyContact = async (contactId: string): Promise<boolean> => {
  console.log('Deleting emergency contact:', contactId);
  return true;
};

export const createMedicalReport = async (reportData: Partial<MedicalReport>): Promise<MedicalReport | null> => {
  console.log('Creating medical report:', reportData);
  // Simulate successful report creation with mock data
  const newReport: MedicalReport = {
    id: `report-${Date.now()}`,
    patientId: reportData.patientId || 'unknown',
    doctorId: reportData.doctorId || 'unknown',
    title: reportData.title || 'New Report',
    date: reportData.date || new Date().toISOString(),
    reportType: reportData.reportType || 'General',
    notes: reportData.notes || '',
    isPrivate: reportData.isPrivate || false,
    doctor: reportData.doctor || 'Unknown Doctor',
    hospital: reportData.hospital || 'Unknown Hospital',
    createdAt: new Date().toISOString(),
    content: reportData.content || '',
    fileUrl: reportData.fileUrl || `https://example.com/reports/report-${Date.now()}.pdf`
  };
  
  return newReport;
};

export const getMedicalReport = async (reportId: string): Promise<MedicalReport | null> => {
  console.log('Fetching medical report:', reportId);
  // Simulate fetching a specific report
  return {
    id: reportId,
    patientId: 'patient-1',
    doctorId: 'doctor-1',
    title: 'Medical Report',
    date: new Date().toISOString(),
    reportType: 'General Examination',
    notes: 'This is a sample medical report',
    isPrivate: false,
    doctor: 'Dr. Sample',
    hospital: 'Sample Hospital',
    createdAt: new Date().toISOString(),
    content: 'Detailed report content goes here...',
    fileUrl: `https://example.com/reports/${reportId}.pdf`
  };
};

export const deleteMedicalReport = async (reportId: string): Promise<boolean> => {
  console.log('Deleting medical report:', reportId);
  return true;
};

// New functions for handling health data export and privacy settings
export const exportHealthData = async (userId: string): Promise<Blob> => {
  console.log('Exporting health data for user:', userId);
  
  // Simulate creating a data blob
  const healthData = {
    user: { id: userId, exportDate: new Date().toISOString() },
    metrics: await getHealthMetrics(userId),
    reports: await getMedicalReports(userId),
    appointments: await getAppointmentsForPatient(userId)
  };
  
  const dataStr = JSON.stringify(healthData, null, 2);
  return new Blob([dataStr], { type: 'application/json' });
};

export const updatePrivacySettings = async (userId: string, settings: any): Promise<boolean> => {
  console.log('Updating privacy settings for user:', userId, settings);
  return true;
};

export const changePassword = async (userId: string, currentPassword: string, newPassword: string): Promise<boolean> => {
  console.log('Changing password for user:', userId);
  // In a real app, this would validate the current password and update to the new one
  return true;
};

// Function to download a report
export const downloadReport = async (reportId: string): Promise<void> => {
  console.log('Downloading report:', reportId);
  
  try {
    const report = await getMedicalReport(reportId);
    
    if (!report) {
      throw new Error('Report not found');
    }
    
    // In a real app, this would fetch the actual file
    // For this mock, we'll create a sample PDF-like text content
    const reportContent = `
      MEDICAL REPORT
      
      ID: ${report.id}
      Title: ${report.title}
      Date: ${report.date}
      Doctor: ${report.doctor}
      Hospital: ${report.hospital}
      
      ${report.content || 'No content available'}
    `;
    
    // Create a Blob and trigger download
    const blob = new Blob([reportContent], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${report.title.replace(/\s+/g, '-')}-${report.id}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error downloading report:', error);
    throw error;
  }
};
