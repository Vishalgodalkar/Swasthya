
import { AES, enc } from 'crypto-js';

// Mock database
const ENCRYPTION_KEY = "VITA_SECURE_HEALTH_ENCRYPTION_KEY";

// In-memory database (would be replaced with MongoDB in production)
let users: User[] = [];
let medicalReports: MedicalReport[] = [];
let emergencyContacts: EmergencyContact[] = [];
let healthMetrics: HealthMetric[] = [];
let appointments: Appointment[] = [];
let doctorProfiles: DoctorProfile[] = [];

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // Would be hashed in real implementation
  dateOfBirth: string;
  bloodType: string;
  height: number;
  weight: number;
  allergies: string[];
  chronicConditions: string[];
  medications: string[];
  createdAt: Date;
  userType: 'patient' | 'doctor';
}

export interface DoctorProfile {
  userId: string;
  specialization: string;
  hospital: string;
  experience: number; // years
  education: string[];
  licenseNumber: string;
  availableSlots: TimeSlot[];
}

export interface TimeSlot {
  day: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

export interface Appointment {
  id: string;
  doctorId: string;
  patientId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  type: 'in-person' | 'virtual';
  reason: string;
  notes: string;
  zoomLink?: string;
  zoomMeetingId?: string;
  zoomPassword?: string;
}

export interface MedicalReport {
  id: string;
  userId: string;
  title: string;
  reportType: string;
  doctor: string;
  hospital: string;
  date: string;
  content: string; // Encrypted content
  fileUrl?: string;
  createdAt: Date;
}

export interface EmergencyContact {
  id: string;
  userId: string;
  name: string;
  relationship: string;
  phoneNumber: string;
  email: string;
}

export interface HealthMetric {
  id: string;
  userId: string;
  type: string; // e.g., "heart_rate", "blood_pressure", "weight"
  value: number;
  unit: string;
  timestamp: Date;
}

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
  allergies: string[];
  chronicConditions: string[];
  medications: string[];
  userType: 'patient' | 'doctor';
}

// Helper functions
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function encrypt(text: string): string {
  return AES.encrypt(text, ENCRYPTION_KEY).toString();
}

function decrypt(encryptedText: string): string {
  const bytes = AES.decrypt(encryptedText, ENCRYPTION_KEY);
  return bytes.toString(enc.Utf8);
}

// Mock API functions
export async function loginUser(credentials: LoginCredentials): Promise<User | null> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const user = users.find(u => u.email === credentials.email && u.password === credentials.password);
  if (!user) return null;
  
  return user;
}

export async function registerUser(userData: RegisterData): Promise<User | null> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Check if user already exists
  if (users.find(u => u.email === userData.email)) {
    return null;
  }
  
  const newUser: User = {
    ...userData,
    id: generateId(),
    createdAt: new Date()
  };
  
  users.push(newUser);
  return newUser;
}

export async function getUserProfile(userId: string): Promise<User | null> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return users.find(u => u.id === userId) || null;
}

export async function updateUserProfile(userId: string, userData: Partial<User>): Promise<User | null> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const userIndex = users.findIndex(u => u.id === userId);
  if (userIndex === -1) return null;
  
  users[userIndex] = { ...users[userIndex], ...userData };
  return users[userIndex];
}

export async function getMedicalReports(userId: string): Promise<MedicalReport[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  return medicalReports
    .filter(report => report.userId === userId)
    .map(report => ({
      ...report,
      content: report.content // Content remains encrypted
    }));
}

export async function getMedicalReport(reportId: string): Promise<MedicalReport | null> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const report = medicalReports.find(r => r.id === reportId);
  if (!report) return null;
  
  return {
    ...report,
    content: decrypt(report.content) // Decrypt content when fetching a single report
  };
}

export async function createMedicalReport(reportData: Omit<MedicalReport, 'id' | 'createdAt'>): Promise<MedicalReport> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const newReport: MedicalReport = {
    ...reportData,
    id: generateId(),
    content: encrypt(reportData.content), // Encrypt content before storing
    createdAt: new Date()
  };
  
  medicalReports.push(newReport);
  return newReport;
}

export async function updateMedicalReport(reportId: string, reportData: Partial<MedicalReport>): Promise<MedicalReport | null> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const reportIndex = medicalReports.findIndex(r => r.id === reportId);
  if (reportIndex === -1) return null;
  
  // If content is updated, encrypt it
  if (reportData.content) {
    reportData.content = encrypt(reportData.content);
  }
  
  medicalReports[reportIndex] = { ...medicalReports[reportIndex], ...reportData };
  return medicalReports[reportIndex];
}

export async function deleteMedicalReport(reportId: string): Promise<boolean> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const initialLength = medicalReports.length;
  medicalReports = medicalReports.filter(r => r.id !== reportId);
  
  return medicalReports.length < initialLength;
}

export async function getEmergencyContacts(userId: string): Promise<EmergencyContact[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return emergencyContacts.filter(contact => contact.userId === userId);
}

export async function createEmergencyContact(contactData: Omit<EmergencyContact, 'id'>): Promise<EmergencyContact> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  const newContact: EmergencyContact = {
    ...contactData,
    id: generateId()
  };
  
  emergencyContacts.push(newContact);
  return newContact;
}

export async function updateEmergencyContact(contactId: string, contactData: Partial<EmergencyContact>): Promise<EmergencyContact | null> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const contactIndex = emergencyContacts.findIndex(c => c.id === contactId);
  if (contactIndex === -1) return null;
  
  emergencyContacts[contactIndex] = { ...emergencyContacts[contactIndex], ...contactData };
  return emergencyContacts[contactIndex];
}

export async function deleteEmergencyContact(contactId: string): Promise<boolean> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const initialLength = emergencyContacts.length;
  emergencyContacts = emergencyContacts.filter(c => c.id !== contactId);
  
  return emergencyContacts.length < initialLength;
}

export async function getHealthMetrics(userId: string, type?: string): Promise<HealthMetric[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  let metrics = healthMetrics.filter(metric => metric.userId === userId);
  
  if (type) {
    metrics = metrics.filter(metric => metric.type === type);
  }
  
  return metrics;
}

export async function addHealthMetric(metricData: Omit<HealthMetric, 'id'>): Promise<HealthMetric> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  const newMetric: HealthMetric = {
    ...metricData,
    id: generateId()
  };
  
  healthMetrics.push(newMetric);
  return newMetric;
}

// Doctor Profile API functions
export async function createDoctorProfile(profileData: Omit<DoctorProfile, 'id'>): Promise<DoctorProfile> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const newProfile: DoctorProfile = {
    ...profileData
  };
  
  doctorProfiles.push(newProfile);
  return newProfile;
}

export async function getDoctorProfile(userId: string): Promise<DoctorProfile | null> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return doctorProfiles.find(profile => profile.userId === userId) || null;
}

export async function updateDoctorProfile(userId: string, profileData: Partial<DoctorProfile>): Promise<DoctorProfile | null> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  const profileIndex = doctorProfiles.findIndex(p => p.userId === userId);
  if (profileIndex === -1) return null;
  
  doctorProfiles[profileIndex] = { ...doctorProfiles[profileIndex], ...profileData };
  return doctorProfiles[profileIndex];
}

export async function getAllDoctors(): Promise<(User & { doctorProfile?: DoctorProfile })[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const doctors = users.filter(user => user.userType === 'doctor');
  
  return doctors.map(doctor => {
    const profile = doctorProfiles.find(p => p.userId === doctor.id);
    return {
      ...doctor,
      doctorProfile: profile
    };
  });
}

// Appointment API functions
export async function createAppointment(appointmentData: Omit<Appointment, 'id'>): Promise<Appointment> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const newAppointment: Appointment = {
    ...appointmentData,
    id: generateId()
  };
  
  appointments.push(newAppointment);
  return newAppointment;
}

export async function getAppointmentsForPatient(patientId: string): Promise<Appointment[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  return appointments.filter(appointment => appointment.patientId === patientId);
}

export async function getAppointmentsForDoctor(doctorId: string): Promise<Appointment[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  return appointments.filter(appointment => appointment.doctorId === doctorId);
}

export async function updateAppointment(appointmentId: string, appointmentData: Partial<Appointment>): Promise<Appointment | null> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const appointmentIndex = appointments.findIndex(a => a.id === appointmentId);
  if (appointmentIndex === -1) return null;
  
  appointments[appointmentIndex] = { ...appointments[appointmentIndex], ...appointmentData };
  return appointments[appointmentIndex];
}

export async function getDoctorAvailability(doctorId: string): Promise<TimeSlot[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const doctorProfile = doctorProfiles.find(profile => profile.userId === doctorId);
  if (!doctorProfile) return [];
  
  return doctorProfile.availableSlots;
}

export async function updateDoctorAvailability(doctorId: string, slots: TimeSlot[]): Promise<boolean> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const profileIndex = doctorProfiles.findIndex(profile => profile.userId === doctorId);
  if (profileIndex === -1) return false;
  
  doctorProfiles[profileIndex].availableSlots = slots;
  return true;
}

// Generate Zoom meeting link (mock implementation)
export async function generateZoomMeeting(appointmentId: string): Promise<{ link: string, meetingId: string, password: string } | null> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  // Check if appointment exists
  const appointment = appointments.find(a => a.id === appointmentId);
  if (!appointment) return null;
  
  // Generate mock zoom details
  const zoomLink = `https://zoom.us/j/${Math.floor(Math.random() * 1000000000)}`;
  const meetingId = `${Math.floor(Math.random() * 1000000000)}`;
  const password = `${Math.floor(Math.random() * 10000)}`;
  
  // Update the appointment with zoom details
  const appointmentIndex = appointments.findIndex(a => a.id === appointmentId);
  appointments[appointmentIndex].zoomLink = zoomLink;
  appointments[appointmentIndex].zoomMeetingId = meetingId;
  appointments[appointmentIndex].zoomPassword = password;
  
  return { link: zoomLink, meetingId, password };
}

// Sample data initialization for testing
export function initializeSampleData() {
  // Create sample users
  const patientUser: User = {
    id: "user1",
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
    dateOfBirth: "1985-05-15",
    bloodType: "O+",
    height: 180, // in cm
    weight: 75, // in kg
    allergies: ["Penicillin", "Pollen"],
    chronicConditions: ["Asthma"],
    medications: ["Albuterol inhaler"],
    createdAt: new Date("2023-01-15"),
    userType: "patient"
  };
  
  const doctorUser: User = {
    id: "doctor1",
    name: "Dr. Sarah Johnson",
    email: "doctor@example.com",
    password: "doctor123",
    dateOfBirth: "1975-08-22",
    bloodType: "A+",
    height: 165,
    weight: 62,
    allergies: [],
    chronicConditions: [],
    medications: [],
    createdAt: new Date("2022-11-10"),
    userType: "doctor"
  };
  
  users.push(patientUser, doctorUser);
  
  // Create doctor profile
  const doctorProfile: DoctorProfile = {
    userId: "doctor1",
    specialization: "Cardiology",
    hospital: "City General Hospital",
    experience: 15,
    education: ["MD, Harvard Medical School", "Residency, Mayo Clinic"],
    licenseNumber: "MD12345678",
    availableSlots: [
      {
        day: "Monday",
        startTime: "09:00",
        endTime: "10:00",
        isBooked: false
      },
      {
        day: "Monday",
        startTime: "10:00",
        endTime: "11:00",
        isBooked: false
      },
      {
        day: "Wednesday",
        startTime: "14:00",
        endTime: "15:00",
        isBooked: false
      },
      {
        day: "Friday",
        startTime: "11:00",
        endTime: "12:00",
        isBooked: false
      }
    ]
  };
  
  doctorProfiles.push(doctorProfile);
  
  // Create sample appointments
  const appointment: Appointment = {
    id: "appt1",
    doctorId: "doctor1",
    patientId: "user1",
    date: "2025-04-15",
    startTime: "10:00",
    endTime: "11:00",
    status: "confirmed",
    type: "virtual",
    reason: "Annual checkup",
    notes: "Patient has reported mild chest pain",
    zoomLink: "https://zoom.us/j/123456789",
    zoomMeetingId: "123456789",
    zoomPassword: "1234"
  };
  
  appointments.push(appointment);
  
  // Create sample medical reports
  const reports: MedicalReport[] = [
    {
      id: "report1",
      userId: "user1",
      title: "Annual Physical Examination",
      reportType: "Physical Examination",
      doctor: "Dr. Sarah Johnson",
      hospital: "City General Hospital",
      date: "2023-03-10",
      content: encrypt("Patient is in good health. Blood pressure: 120/80 mmHg. Heart rate: 72 bpm. Respiratory rate: 16 breaths/min."),
      createdAt: new Date("2023-03-10")
    },
    {
      id: "report2",
      userId: "user1",
      title: "Chest X-Ray Results",
      reportType: "Radiology",
      doctor: "Dr. Michael Chen",
      hospital: "City General Hospital",
      date: "2023-04-25",
      content: encrypt("No abnormalities detected in the chest X-ray. Lungs are clear. Heart size appears normal."),
      createdAt: new Date("2023-04-25")
    },
    {
      id: "report3",
      userId: "user1",
      title: "Blood Test Results",
      reportType: "Laboratory",
      doctor: "Dr. Emily Brown",
      hospital: "HealthCare Labs",
      date: "2023-05-12",
      content: encrypt("Complete blood count within normal ranges. Cholesterol: 180 mg/dL. Glucose: 95 mg/dL. Hemoglobin: 14.5 g/dL."),
      createdAt: new Date("2023-05-12")
    }
  ];
  medicalReports.push(...reports);
  
  // Create sample emergency contacts
  const contacts: EmergencyContact[] = [
    {
      id: "contact1",
      userId: "user1",
      name: "Jane Doe",
      relationship: "Spouse",
      phoneNumber: "+1-555-123-4567",
      email: "jane@example.com"
    },
    {
      id: "contact2",
      userId: "user1",
      name: "Robert Smith",
      relationship: "Brother",
      phoneNumber: "+1-555-987-6543",
      email: "robert@example.com"
    }
  ];
  emergencyContacts.push(...contacts);
  
  // Create sample health metrics
  const currentDate = new Date();
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(currentDate.getDate() - 7);
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(oneWeekAgo);
    date.setDate(oneWeekAgo.getDate() + i);
    
    // Heart rate entry
    healthMetrics.push({
      id: `hr-${i}`,
      userId: "user1",
      type: "heart_rate",
      value: 65 + Math.floor(Math.random() * 15), // Random between 65-80
      unit: "bpm",
      timestamp: new Date(date)
    });
    
    // Blood pressure entry
    healthMetrics.push({
      id: `bp-${i}`,
      userId: "user1",
      type: "blood_pressure_systolic",
      value: 115 + Math.floor(Math.random() * 10), // Random between 115-125
      unit: "mmHg",
      timestamp: new Date(date)
    });
    
    healthMetrics.push({
      id: `bp-${i}b`,
      userId: "user1",
      type: "blood_pressure_diastolic",
      value: 75 + Math.floor(Math.random() * 10), // Random between 75-85
      unit: "mmHg",
      timestamp: new Date(date)
    });
    
    // Weight entry (only every other day)
    if (i % 2 === 0) {
      healthMetrics.push({
        id: `wt-${i}`,
        userId: "user1",
        type: "weight",
        value: 75 + (Math.random() * 0.6 - 0.3), // Slight variations around 75kg
        unit: "kg",
        timestamp: new Date(date)
      });
    }
  }
}

// Initialize sample data
initializeSampleData();
