
import { authAPI, doctorsAPI, patientsAPI, appointmentsAPI, reportsAPI, zoomAPI } from './apiService';

// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  userType: 'patient' | 'doctor' | 'admin';
  phoneNumber?: string;
  profileImage?: string;
  // Add missing user properties
  dateOfBirth?: string;
  bloodType?: string;
  height?: number;
  weight?: number;
  allergies?: string[];
  chronicConditions?: string[];
  medications?: string[];
  specialization?: string;
  experience?: number;
  consultationFee?: number;
  qualifications?: Array<{degree: string, institution: string, year: number}>;
  bio?: string;
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  dateOfBirth: string;
  bloodType: string;
  height: number;
  weight: number;
  userType: 'patient' | 'doctor' | 'admin';
  allergies?: string[];
  chronicConditions?: string[];
  medications?: string[];
  specialization?: string;
  experience?: number;
  licenseNumber?: string;
  licenseAuthority?: string;
  consultationFee?: number;
  qualifications?: Array<{degree: string, institution: string, year: number}>;
  bio?: string;
  phoneNumber?: string;
}

// Health Metrics Types
export interface HealthMetric {
  id: string;
  patientId: string;
  type: string;
  value: number;
  unit: string;
  timestamp: Date;
  notes?: string;
}

// Appointment Types
export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  type: 'in-person' | 'virtual';
  reason: string;
  notes?: string;
  zoomMeetingId?: string;
  zoomMeetingPassword?: string;
  zoomJoinUrl?: string;
}

// Time Slot Type
export interface TimeSlot {
  day: string;
  startTime: string;
  endTime: string;
  available: boolean;
}

// Doctor Profile Type
export interface DoctorProfile {
  id: string;
  name: string;
  specialization: string;
  experience: number;
  consultationFee: number;
  rating?: number;
  bio?: string;
  profileImage?: string;
  qualifications?: Array<{degree: string, institution: string, year: number}>;
  availableSlots?: TimeSlot[];
}

// Medical Report Type
export interface MedicalReport {
  id: string;
  patientId: string;
  doctorId?: string;
  title: string;
  description: string;
  date: string;
  type: string;
  fileUrl?: string;
  tags?: string[];
  isPublic: boolean;
}

// Emergency Contact Type
export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phoneNumber: string;
  email?: string;
  isMainContact: boolean;
}

// API Functions
export const loginUser = async (credentials: LoginCredentials): Promise<User | null> => {
  try {
    const response = await authAPI.login(credentials);
    if (response.success) {
      localStorage.setItem('telehealth-token', response.token);
      return {
        id: response.user._id,
        name: response.user.name,
        email: response.user.email,
        userType: response.user.userType,
        phoneNumber: response.user.phoneNumber,
        profileImage: response.user.profileImage,
        // Additional fields
        dateOfBirth: response.user.dateOfBirth,
        bloodType: response.user.bloodType,
        height: response.user.height,
        weight: response.user.weight,
        allergies: response.user.allergies,
        chronicConditions: response.user.chronicConditions,
        medications: response.user.medications,
        specialization: response.user.specialization,
        experience: response.user.experience,
        consultationFee: response.user.consultationFee,
        qualifications: response.user.qualifications,
        bio: response.user.bio
      };
    }
    return null;
  } catch (error) {
    console.error('Login error:', error);
    return null;
  }
};

export const registerUser = async (userData: RegisterData): Promise<User | null> => {
  try {
    const response = await authAPI.register(userData);
    if (response.success) {
      localStorage.setItem('telehealth-token', response.token);
      return {
        id: response.user._id,
        name: response.user.name,
        email: response.user.email,
        userType: response.user.userType,
        phoneNumber: response.user.phoneNumber,
        profileImage: response.user.profileImage,
        // Additional fields
        dateOfBirth: response.user.dateOfBirth,
        bloodType: response.user.bloodType,
        height: response.user.height,
        weight: response.user.weight,
        allergies: response.user.allergies,
        chronicConditions: response.user.chronicConditions,
        medications: response.user.medications,
        specialization: response.user.specialization,
        experience: response.user.experience,
        consultationFee: response.user.consultationFee,
        qualifications: response.user.qualifications,
        bio: response.user.bio
      };
    }
    return null;
  } catch (error) {
    console.error('Registration error:', error);
    return null;
  }
};

// Health Metrics
export const getHealthMetrics = async (patientId: string): Promise<HealthMetric[]> => {
  try {
    // This would be a real API call in production
    // Mock data for development
    return [
      {
        id: '1',
        patientId,
        type: 'heart_rate',
        value: 75,
        unit: 'bpm',
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        notes: 'Resting'
      },
      {
        id: '2',
        patientId,
        type: 'blood_pressure',
        value: 120,
        unit: 'mmHg',
        timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        notes: 'Systolic'
      },
      {
        id: '3',
        patientId,
        type: 'oxygen',
        value: 98,
        unit: '%',
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      },
      {
        id: '4',
        patientId,
        type: 'heart_rate',
        value: 72,
        unit: 'bpm',
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        notes: 'Resting'
      },
      {
        id: '5',
        patientId,
        type: 'blood_pressure',
        value: 118,
        unit: 'mmHg',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        notes: 'Systolic'
      },
      {
        id: '6',
        patientId,
        type: 'oxygen',
        value: 99,
        unit: '%',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        id: '7',
        patientId,
        type: 'heart_rate',
        value: 74,
        unit: 'bpm',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        notes: 'Resting'
      }
    ];
  } catch (error) {
    console.error('Error fetching health metrics:', error);
    return [];
  }
};

// Appointments
export const getAppointmentsForPatient = async (patientId: string): Promise<Appointment[]> => {
  try {
    // Mock data for development
    return [
      {
        id: 'appt1',
        patientId,
        doctorId: 'doctor1',
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        startTime: '10:00 AM',
        endTime: '10:30 AM',
        status: 'confirmed',
        type: 'virtual',
        reason: 'Regular checkup',
        zoomMeetingId: '123456789',
        zoomMeetingPassword: 'password',
        zoomJoinUrl: 'https://zoom.us/j/123456789'
      },
      {
        id: 'appt2',
        patientId,
        doctorId: 'doctor2',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        startTime: '2:00 PM',
        endTime: '2:30 PM',
        status: 'pending',
        type: 'in-person',
        reason: 'Follow-up on medication'
      }
    ];
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return [];
  }
};

export const getAppointmentsForDoctor = async (doctorId: string): Promise<Appointment[]> => {
  try {
    // Mock data for development
    return [
      {
        id: 'appt3',
        patientId: 'patient1',
        doctorId,
        date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        startTime: '9:00 AM',
        endTime: '9:30 AM',
        status: 'confirmed',
        type: 'virtual',
        reason: 'New patient consultation',
        zoomMeetingId: '987654321',
        zoomMeetingPassword: 'password',
        zoomJoinUrl: 'https://zoom.us/j/987654321'
      },
      {
        id: 'appt4',
        patientId: 'patient2',
        doctorId,
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        startTime: '11:00 AM',
        endTime: '11:30 AM',
        status: 'pending',
        type: 'in-person',
        reason: 'Annual physical'
      }
    ];
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return [];
  }
};

export const updateAppointment = async (appointmentId: string, data: Partial<Appointment>): Promise<Appointment | null> => {
  try {
    // Simulated API call
    console.log(`Updating appointment ${appointmentId} with data:`, data);
    // In a real app, this would send the data to an API
    return {
      id: appointmentId,
      patientId: 'patient1',
      doctorId: 'doctor1',
      date: data.date || '2023-05-20',
      startTime: data.startTime || '10:00 AM',
      endTime: data.endTime || '10:30 AM',
      status: data.status || 'confirmed',
      type: data.type || 'virtual',
      reason: data.reason || 'Checkup',
      notes: data.notes,
      zoomMeetingId: data.zoomMeetingId,
      zoomMeetingPassword: data.zoomMeetingPassword,
      zoomJoinUrl: data.zoomJoinUrl
    };
  } catch (error) {
    console.error('Error updating appointment:', error);
    return null;
  }
};

export const createAppointment = async (data: Omit<Appointment, 'id'>): Promise<Appointment | null> => {
  try {
    // Simulated API call
    console.log('Creating appointment with data:', data);
    // In a real app, this would send the data to an API
    return {
      id: 'new-appointment-id',
      ...data
    };
  } catch (error) {
    console.error('Error creating appointment:', error);
    return null;
  }
};

// Doctors
export const getAllDoctors = async (): Promise<DoctorProfile[]> => {
  try {
    // Mock data for development
    return [
      {
        id: 'doctor1',
        name: 'Dr. Sarah Johnson',
        specialization: 'Cardiology',
        experience: 12,
        consultationFee: 150,
        rating: 4.8,
        bio: 'Specializes in heart conditions and treatments.',
        profileImage: 'https://randomuser.me/api/portraits/women/68.jpg',
        qualifications: [
          { degree: 'MD', institution: 'Harvard Medical School', year: 2008 },
          { degree: 'Cardiology Fellowship', institution: 'Mayo Clinic', year: 2012 }
        ]
      },
      {
        id: 'doctor2',
        name: 'Dr. Michael Chen',
        specialization: 'Neurology',
        experience: 15,
        consultationFee: 175,
        rating: 4.9,
        bio: 'Focuses on neurological disorders and treatment plans.',
        profileImage: 'https://randomuser.me/api/portraits/men/34.jpg',
        qualifications: [
          { degree: 'MD', institution: 'Johns Hopkins School of Medicine', year: 2005 },
          { degree: 'Neurology Residency', institution: 'UCSF Medical Center', year: 2010 }
        ]
      }
    ];
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return [];
  }
};

export const getDoctorAvailability = async (doctorId: string): Promise<TimeSlot[]> => {
  try {
    // Mock data for development
    return [
      { day: 'Monday', startTime: '9:00 AM', endTime: '12:00 PM', available: true },
      { day: 'Monday', startTime: '1:00 PM', endTime: '5:00 PM', available: true },
      { day: 'Tuesday', startTime: '10:00 AM', endTime: '2:00 PM', available: true },
      { day: 'Wednesday', startTime: '9:00 AM', endTime: '12:00 PM', available: true },
      { day: 'Thursday', startTime: '1:00 PM', endTime: '5:00 PM', available: true },
      { day: 'Friday', startTime: '9:00 AM', endTime: '1:00 PM', available: true }
    ];
  } catch (error) {
    console.error('Error fetching doctor availability:', error);
    return [];
  }
};

// Medical Reports
export const getMedicalReports = async (patientId: string): Promise<MedicalReport[]> => {
  try {
    // Mock data for development
    return [
      {
        id: 'report1',
        patientId,
        doctorId: 'doctor1',
        title: 'Annual Checkup Results',
        description: 'Routine annual physical examination results',
        date: '2023-01-15',
        type: 'Physical Examination',
        tags: ['annual', 'routine'],
        isPublic: true
      },
      {
        id: 'report2',
        patientId,
        doctorId: 'doctor2',
        title: 'Blood Work Analysis',
        description: 'Complete blood count and metabolic panel',
        date: '2023-02-28',
        type: 'Laboratory',
        tags: ['blood test', 'metabolic'],
        isPublic: true
      }
    ];
  } catch (error) {
    console.error('Error fetching medical reports:', error);
    return [];
  }
};

export const getMedicalReport = async (reportId: string): Promise<MedicalReport | null> => {
  try {
    // Mock data for development
    return {
      id: reportId,
      patientId: 'patient1',
      doctorId: 'doctor1',
      title: 'Annual Checkup Results',
      description: 'Routine annual physical examination results. All vitals normal. Recommended follow-up in 12 months.',
      date: '2023-01-15',
      type: 'Physical Examination',
      tags: ['annual', 'routine'],
      isPublic: true
    };
  } catch (error) {
    console.error('Error fetching medical report:', error);
    return null;
  }
};

export const createMedicalReport = async (data: Omit<MedicalReport, 'id'>): Promise<MedicalReport | null> => {
  try {
    // Simulated API call
    console.log('Creating medical report with data:', data);
    // In a real app, this would send the data to an API
    return {
      id: 'new-report-id',
      ...data
    };
  } catch (error) {
    console.error('Error creating medical report:', error);
    return null;
  }
};

export const deleteMedicalReport = async (reportId: string): Promise<boolean> => {
  try {
    // Simulated API call
    console.log(`Deleting medical report with ID: ${reportId}`);
    // In a real app, this would send a delete request to an API
    return true;
  } catch (error) {
    console.error('Error deleting medical report:', error);
    return false;
  }
};

// User Profile
export const getUserProfile = async (userId: string): Promise<User | null> => {
  try {
    // Mock data for development
    return {
      id: userId,
      name: 'John Doe',
      email: 'john@example.com',
      userType: 'patient',
      phoneNumber: '+1234567890',
      profileImage: 'https://randomuser.me/api/portraits/men/1.jpg',
      dateOfBirth: '1985-05-15',
      bloodType: 'A+',
      height: 175,
      weight: 70,
      allergies: ['Peanuts', 'Penicillin'],
      chronicConditions: ['Asthma'],
      medications: ['Albuterol', 'Vitamin D']
    };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

export const updateUserProfile = async (userId: string, data: Partial<User>): Promise<User | null> => {
  try {
    // Simulated API call
    console.log(`Updating user ${userId} with data:`, data);
    // In a real app, this would send the data to an API
    return {
      id: userId,
      name: data.name || 'John Doe',
      email: data.email || 'john@example.com',
      userType: 'patient',
      phoneNumber: data.phoneNumber || '+1234567890',
      profileImage: data.profileImage || 'https://randomuser.me/api/portraits/men/1.jpg',
      dateOfBirth: data.dateOfBirth || '1985-05-15',
      bloodType: data.bloodType || 'A+',
      height: data.height || 175,
      weight: data.weight || 70,
      allergies: data.allergies || ['Peanuts', 'Penicillin'],
      chronicConditions: data.chronicConditions || ['Asthma'],
      medications: data.medications || ['Albuterol', 'Vitamin D']
    };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return null;
  }
};

// Emergency Contacts
export const getEmergencyContacts = async (userId: string): Promise<EmergencyContact[]> => {
  try {
    // Mock data for development
    return [
      {
        id: 'contact1',
        name: 'Jane Doe',
        relationship: 'Spouse',
        phoneNumber: '+1987654321',
        email: 'jane@example.com',
        isMainContact: true
      },
      {
        id: 'contact2',
        name: 'Robert Doe',
        relationship: 'Parent',
        phoneNumber: '+1876543210',
        email: 'robert@example.com',
        isMainContact: false
      }
    ];
  } catch (error) {
    console.error('Error fetching emergency contacts:', error);
    return [];
  }
};

export const createEmergencyContact = async (userId: string, data: Omit<EmergencyContact, 'id'>): Promise<EmergencyContact | null> => {
  try {
    // Simulated API call
    console.log(`Creating emergency contact for user ${userId} with data:`, data);
    // In a real app, this would send the data to an API
    return {
      id: 'new-contact-id',
      ...data
    };
  } catch (error) {
    console.error('Error creating emergency contact:', error);
    return null;
  }
};

export const deleteEmergencyContact = async (contactId: string): Promise<boolean> => {
  try {
    // Simulated API call
    console.log(`Deleting emergency contact with ID: ${contactId}`);
    // In a real app, this would send a delete request to an API
    return true;
  } catch (error) {
    console.error('Error deleting emergency contact:', error);
    return false;
  }
};

// Zoom integration
export const generateZoomMeeting = async (appointmentId: string): Promise<{meetingId: string, password: string, joinUrl: string} | null> => {
  try {
    // Simulated API call
    console.log(`Generating Zoom meeting for appointment: ${appointmentId}`);
    // In a real app, this would create a Zoom meeting via API
    return {
      meetingId: '123456789',
      password: 'password',
      joinUrl: 'https://zoom.us/j/123456789?pwd=password'
    };
  } catch (error) {
    console.error('Error generating Zoom meeting:', error);
    return null;
  }
};
