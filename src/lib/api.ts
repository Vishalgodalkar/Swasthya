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
  fileUrl?: string; // Added this property to fix the TypeScript error
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
export const loginUser = async (credentials: LoginCredentials): Promise<User | null> => {
  console.log('Attempting to log in with:', credentials);
  // In a real app, this would call the backend API
  return null;
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
      content: 'Detailed examination results...'
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
      content: 'Detailed blood test results...'
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
  return null;
};

export const getMedicalReport = async (reportId: string): Promise<MedicalReport | null> => {
  console.log('Fetching medical report:', reportId);
  return null;
};

export const deleteMedicalReport = async (reportId: string): Promise<boolean> => {
  console.log('Deleting medical report:', reportId);
  return true;
};
