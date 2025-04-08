
import { AES, enc } from 'crypto-js';
import { createZoomMeeting, scheduleZoomMeeting } from './zoomUtils';

// Mock database
const ENCRYPTION_KEY = "VITA_SECURE_HEALTH_ENCRYPTION_KEY";

// In-memory database (would be replaced with MongoDB in production)
let users: User[] = [];
let medicalReports: MedicalReport[] = [];
let emergencyContacts: EmergencyContact[] = [];
let healthMetrics: HealthMetric[] = [];
let appointments: Appointment[] = [];
let doctorProfiles: DoctorProfile[] = [];
let meetingDetails: MeetingDetails[] = [];
let notifications: Notification[] = [];

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
  bio?: string;
  profileImage?: string;
  rating?: number;
  reviewCount?: number;
  consultationFee?: number;
}

export interface TimeSlot {
  day: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  slotId?: string;
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
  createdAt: Date;
  meetingId?: string; // Reference to Zoom meeting details
  zoomLink?: string;
  zoomMeetingId?: string;
  zoomPassword?: string;
}

export interface MeetingDetails {
  id: string;
  appointmentId: string;
  meetingId: string;
  password: string;
  joinUrl: string;
  hostUrl: string;
  startUrl: string;
  topic: string;
  startTime: string;
  duration: number;
  status: 'waiting' | 'active' | 'ended' | 'cancelled';
  createdAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'appointment' | 'meeting' | 'system' | 'reminder';
  read: boolean;
  relatedId?: string; // ID of related appointment, meeting, etc.
  createdAt: Date;
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
  
  // If this is a doctor, create an empty doctor profile
  if (userData.userType === 'doctor') {
    const newDoctorProfile: DoctorProfile = {
      userId: newUser.id,
      specialization: '',
      hospital: '',
      experience: 0,
      education: [],
      licenseNumber: '',
      availableSlots: [],
    };
    doctorProfiles.push(newDoctorProfile);
  }
  
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

// Enhanced Doctor APIs
export async function searchDoctors(
  specialization?: string, 
  name?: string
): Promise<(User & { doctorProfile: DoctorProfile })[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  let doctors = users.filter(user => user.userType === 'doctor');
  
  // Filter by name if provided
  if (name) {
    const searchName = name.toLowerCase();
    doctors = doctors.filter(doctor => doctor.name.toLowerCase().includes(searchName));
  }
  
  // Map each doctor to include their profile information
  const doctorsWithProfile = doctors.map(doctor => {
    const profile = doctorProfiles.find(p => p.userId === doctor.id);
    return {
      ...doctor,
      doctorProfile: profile as DoctorProfile
    };
  });
  
  // Filter by specialization if provided
  if (specialization) {
    return doctorsWithProfile.filter(doctor => 
      doctor.doctorProfile?.specialization.toLowerCase().includes(specialization.toLowerCase())
    );
  }
  
  return doctorsWithProfile;
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

// Enhanced Appointment API functions
export async function createAppointment(appointmentData: Omit<Appointment, 'id' | 'createdAt'>): Promise<Appointment> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const newAppointment: Appointment = {
    ...appointmentData,
    id: generateId(),
    createdAt: new Date()
  };
  
  // For virtual appointments, generate Zoom meeting details
  if (appointmentData.type === 'virtual') {
    try {
      const doctor = users.find(user => user.id === appointmentData.doctorId);
      const patient = users.find(user => user.id === appointmentData.patientId);
      
      if (doctor && patient) {
        // Format appointment datetime
        const meetingTopic = `Medical Consultation: Dr. ${doctor.name} with ${patient.name}`;
        const zoomDetails = await scheduleZoomMeeting({
          ...newAppointment,
          zoomLink: undefined,
          zoomMeetingId: undefined,
          zoomPassword: undefined
        }, doctor.name, patient.name);
        
        // Store zoom details in the appointment
        newAppointment.zoomLink = zoomDetails.joinUrl;
        newAppointment.zoomMeetingId = zoomDetails.meetingId;
        newAppointment.zoomPassword = zoomDetails.password;
        
        // Create a meeting detail record
        const meetingDetail: MeetingDetails = {
          id: generateId(),
          appointmentId: newAppointment.id,
          meetingId: zoomDetails.meetingId,
          password: zoomDetails.password,
          joinUrl: zoomDetails.joinUrl,
          hostUrl: zoomDetails.hostUrl,
          startUrl: zoomDetails.hostUrl, // Same as host URL for mock purposes
          topic: meetingTopic,
          startTime: `${appointmentData.date}T${appointmentData.startTime}`,
          duration: calculateDuration(appointmentData.startTime, appointmentData.endTime),
          status: 'waiting',
          createdAt: new Date()
        };
        
        meetingDetails.push(meetingDetail);
        
        // Create notifications for patient and doctor
        createNotification({
          userId: appointmentData.patientId,
          title: 'Appointment Scheduled',
          message: `Your virtual appointment with Dr. ${doctor.name} has been scheduled for ${appointmentData.date} at ${appointmentData.startTime}.`,
          type: 'appointment',
          relatedId: newAppointment.id,
        });
        
        createNotification({
          userId: appointmentData.doctorId,
          title: 'New Appointment',
          message: `A new virtual appointment has been scheduled with ${patient.name} for ${appointmentData.date} at ${appointmentData.startTime}.`,
          type: 'appointment',
          relatedId: newAppointment.id,
        });
      }
    } catch (error) {
      console.error('Error creating Zoom meeting:', error);
    }
  }
  
  appointments.push(newAppointment);
  return newAppointment;
}

function calculateDuration(startTime: string, endTime: string): number {
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);
  
  return (endHour - startHour) * 60 + (endMinute - startMinute);
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
  
  const updatedAppointment = { ...appointments[appointmentIndex], ...appointmentData };
  appointments[appointmentIndex] = updatedAppointment;
  
  // If status is changed, create notifications
  if (appointmentData.status) {
    const appointment = appointments[appointmentIndex];
    const doctor = users.find(u => u.id === appointment.doctorId);
    const patient = users.find(u => u.id === appointment.patientId);
    
    if (doctor && patient) {
      switch (appointmentData.status) {
        case 'confirmed':
          createNotification({
            userId: appointment.patientId,
            title: 'Appointment Confirmed',
            message: `Your appointment with Dr. ${doctor.name} on ${appointment.date} at ${appointment.startTime} has been confirmed.`,
            type: 'appointment',
            relatedId: appointment.id,
          });
          break;
          
        case 'cancelled':
          createNotification({
            userId: appointment.patientId,
            title: 'Appointment Cancelled',
            message: `Your appointment with Dr. ${doctor.name} on ${appointment.date} at ${appointment.startTime} has been cancelled.`,
            type: 'appointment',
            relatedId: appointment.id,
          });
          
          createNotification({
            userId: appointment.doctorId,
            title: 'Appointment Cancelled',
            message: `The appointment with ${patient.name} on ${appointment.date} at ${appointment.startTime} has been cancelled.`,
            type: 'appointment',
            relatedId: appointment.id,
          });
          break;
          
        case 'completed':
          createNotification({
            userId: appointment.patientId,
            title: 'Appointment Completed',
            message: `Your appointment with Dr. ${doctor.name} has been marked as completed. Please provide feedback.`,
            type: 'appointment',
            relatedId: appointment.id,
          });
          break;
      }
    }
  }
  
  return updatedAppointment;
}

export async function getMeetingDetails(appointmentId: string): Promise<MeetingDetails | null> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return meetingDetails.find(meeting => meeting.appointmentId === appointmentId) || null;
}

export async function updateMeetingStatus(meetingId: string, status: MeetingDetails['status']): Promise<MeetingDetails | null> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const meetingIndex = meetingDetails.findIndex(meeting => meeting.id === meetingId);
  if (meetingIndex === -1) return null;
  
  meetingDetails[meetingIndex] = {
    ...meetingDetails[meetingIndex],
    status
  };
  
  return meetingDetails[meetingIndex];
}

// Notification API functions
export async function createNotification(notificationData: Omit<Notification, 'id' | 'read' | 'createdAt'>): Promise<Notification> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newNotification: Notification = {
    ...notificationData,
    id: generateId(),
    read: false,
    createdAt: new Date()
  };
  
  notifications.push(newNotification);
  return newNotification;
}

export async function getNotifications(userId: string): Promise<Notification[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Return notifications sorted by createdAt (newest first)
  return notifications
    .filter(notification => notification.userId === userId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function markNotificationAsRead(notificationId: string): Promise<Notification | null> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const notificationIndex = notifications.findIndex(notification => notification.id === notificationId);
  if (notificationIndex === -1) return null;
  
  notifications[notificationIndex] = {
    ...notifications[notificationIndex],
    read: true
  };
  
  return notifications[notificationIndex];
}

export async function markAllNotificationsAsRead(userId: string): Promise<boolean> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  notifications = notifications.map(notification => {
    if (notification.userId === userId) {
      return { ...notification, read: true };
    }
    return notification;
  });
  
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
  
  const patientUser2: User = {
    id: "user2",
    name: "Jane Smith",
    email: "jane@example.com",
    password: "password123",
    dateOfBirth: "1990-08-21",
    bloodType: "A-",
    height: 165,
    weight: 60,
    allergies: ["Shellfish"],
    chronicConditions: ["Hypertension"],
    medications: ["Lisinopril"],
    createdAt: new Date("2023-02-18"),
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

  const doctorUser2: User = {
    id: "doctor2",
    name: "Dr. Michael Chen",
    email: "michael@example.com",
    password: "doctor123",
    dateOfBirth: "1980-03-15",
    bloodType: "B+",
    height: 175,
    weight: 70,
    allergies: [],
    chronicConditions: [],
    medications: [],
    createdAt: new Date("2022-10-05"),
    userType: "doctor"
  };

  const doctorUser3: User = {
    id: "doctor3",
    name: "Dr. Emily Rodriguez",
    email: "emily@example.com",
    password: "doctor123",
    dateOfBirth: "1978-11-30",
    bloodType: "O-",
    height: 168,
    weight: 65,
    allergies: [],
    chronicConditions: [],
    medications: [],
    createdAt: new Date("2022-09-20"),
    userType: "doctor"
  };
  
  users.push(patientUser, patientUser2, doctorUser, doctorUser2, doctorUser3);
  
  // Create doctor profiles
  const doctorProfile: DoctorProfile = {
    userId: "doctor1",
    specialization: "Cardiology",
    hospital: "City General Hospital",
    experience: 15,
    education: ["MD, Harvard Medical School", "Residency, Mayo Clinic"],
    licenseNumber: "MD12345678",
    bio: "Specialized in treating heart-related conditions with over 15 years of experience.",
    profileImage: "https://randomuser.me/api/portraits/women/68.jpg",
    rating: 4.8,
    reviewCount: 127,
    consultationFee: 150,
    availableSlots: [
      {
        slotId: "slot1",
        day: "Monday",
        startTime: "09:00",
        endTime: "10:00",
        isBooked: false
      },
      {
        slotId: "slot2",
        day: "Monday",
        startTime: "10:00",
        endTime: "11:00",
        isBooked: false
      },
      {
        slotId: "slot3",
        day: "Wednesday",
        startTime: "14:00",
        endTime: "15:00",
        isBooked: false
      },
      {
        slotId: "slot4",
        day: "Friday",
        startTime: "11:00",
        endTime: "12:00",
        isBooked: false
      }
    ]
  };

  const doctorProfile2: DoctorProfile = {
    userId: "doctor2",
    specialization: "Neurology",
    hospital: "Metropolitan Medical Center",
    experience: 12,
    education: ["MD, Stanford University", "Fellowship, Johns Hopkins"],
    licenseNumber: "MD87654321",
    bio: "Dedicated neurologist focusing on brain and nervous system disorders.",
    profileImage: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 4.7,
    reviewCount: 98,
    consultationFee: 175,
    availableSlots: [
      {
        slotId: "slot5",
        day: "Tuesday",
        startTime: "09:00",
        endTime: "10:00",
        isBooked: false
      },
      {
        slotId: "slot6",
        day: "Thursday",
        startTime: "13:00",
        endTime: "14:00",
        isBooked: false
      }
    ]
  };

  const doctorProfile3: DoctorProfile = {
    userId: "doctor3",
    specialization: "Pediatrics",
    hospital: "Children's Medical Center",
    experience: 10,
    education: ["MD, University of California", "Residency, Children's Hospital"],
    licenseNumber: "MD54321678",
    bio: "Caring pediatrician specializing in children's health from newborns to adolescents.",
    profileImage: "https://randomuser.me/api/portraits/women/42.jpg",
    rating: 4.9,
    reviewCount: 156,
    consultationFee: 125,
    availableSlots: [
      {
        slotId: "slot7",
        day: "Monday",
        startTime: "13:00",
        endTime: "14:00",
        isBooked: false
      },
      {
        slotId: "slot8",
        day: "Wednesday",
        startTime: "10:00",
        endTime: "11:00",
        isBooked: false
      },
      {
        slotId: "slot9",
        day: "Thursday",
        startTime: "15:00",
        endTime: "16:00",
        isBooked: false
      }
    ]
  };
  
  doctorProfiles.push(doctorProfile, doctorProfile2, doctorProfile3);
  
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
    createdAt: new Date("2025-04-05"),
    zoomLink: "https://zoom.us/j/123456789",
    zoomMeetingId: "123456789",
    zoomPassword: "1234"
  };

  const appointment2: Appointment = {
    id: "appt2",
    doctorId: "doctor2",
    patientId: "user1",
    date: "2025-04-20",
    startTime: "09:00",
    endTime: "10:00",
    status: "pending",
    type: "virtual",
    reason: "Headache consultation",
    notes: "Recurring migraines for the past month",
    createdAt: new Date("2025-04-08")
  };

  const appointment3: Appointment = {
    id: "appt3",
    doctorId: "doctor1",
    patientId: "user2",
    date: "2025-04-17",
    startTime: "14:00",
    endTime: "15:00",
    status: "confirmed",
    type: "in-person",
    reason: "Blood pressure check",
    notes: "Follow-up for hypertension management",
    createdAt: new Date("2025-04-03")
  };

  const pastAppointment: Appointment = {
    id: "appt4",
    doctorId: "doctor3",
    patientId: "user1",
    date: "2025-03-25",
    startTime: "13:00",
    endTime: "14:00",
    status: "completed",
    type: "virtual",
    reason: "Asthma follow-up",
    notes: "Discussed medication adjustment",
    createdAt: new Date("2025-03-15"),
    zoomLink: "https://zoom.us/j/987654321",
    zoomMeetingId: "987654321",
    zoomPassword: "5678"
  };
  
  appointments.push(appointment, appointment2, appointment3, pastAppointment);

  // Create meeting details for virtual appointments
  const meetingDetail: MeetingDetails = {
    id: "meeting1",
    appointmentId: "appt1",
    meetingId: "123456789",
    password: "1234",
    joinUrl: "https://zoom.us/j/123456789?pwd=1234",
    hostUrl: "https://zoom.us/j/123456789?pwd=1234&host=true",
    startUrl: "https://zoom.us/j/123456789?pwd=1234&host=true",
    topic: "Annual checkup - Dr. Sarah Johnson with John Doe",
    startTime: "2025-04-15T10:00:00",
    duration: 60,
    status: "waiting",
    createdAt: new Date("2025-04-05")
  };

  const pastMeetingDetail: MeetingDetails = {
    id: "meeting2",
    appointmentId: "appt4",
    meetingId: "987654321",
    password: "5678",
    joinUrl: "https://zoom.us/j/987654321?pwd=5678",
    hostUrl: "https://zoom.us/j/987654321?pwd=5678&host=true",
    startUrl: "https://zoom.us/j/987654321?pwd=5678&host=true",
    topic: "Asthma follow-up - Dr. Emily Rodriguez with John Doe",
    startTime: "2025-03-25T13:00:00",
    duration: 60,
    status: "ended",
    createdAt: new Date("2025-03-15")
  };

  meetingDetails.push(meetingDetail, pastMeetingDetail);

  // Create notifications
  const notification1: Notification = {
    id: "notif1",
    userId: "user1",
    title: "Appointment Confirmed",
    message: "Your appointment with Dr. Sarah Johnson on April 15th at 10:00 AM has been confirmed.",
    type: "appointment",
    read: false,
    relatedId: "appt1",
    createdAt: new Date("2025-04-05T14:32:00")
  };

  const notification2: Notification = {
    id: "notif2",
    userId: "doctor1",
    title: "New Appointment",
    message: "You have a new appointment with John Doe on April 15th at 10:00 AM.",
    type: "appointment",
    read: true,
    relatedId: "appt1",
    createdAt: new Date("2025-04-05T14:32:00")
  };

  const notification3: Notification = {
    id: "notif3",
    userId: "user1",
    title: "Appointment Reminder",
    message: "Reminder: Your virtual appointment with Dr. Sarah Johnson is tomorrow at 10:00 AM.",
    type: "reminder",
    read: false,
    relatedId: "appt1",
    createdAt: new Date("2025-04-14T09:00:00")
  };

  notifications.push(notification1, notification2, notification3);
  
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
