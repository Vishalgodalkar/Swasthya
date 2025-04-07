
import { AES, enc } from 'crypto-js';

// Mock database
const ENCRYPTION_KEY = "VITA_SECURE_HEALTH_ENCRYPTION_KEY";

// In-memory database (would be replaced with MongoDB in production)
let users: User[] = [];
let medicalReports: MedicalReport[] = [];
let emergencyContacts: EmergencyContact[] = [];
let healthMetrics: HealthMetric[] = [];

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
}

export interface FallDetectionEvent {
  id: string;
  userId: string;
  timestamp: Date;
  location?: string;
  severity: "low" | "medium" | "high";
  acknowledged: boolean;
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

// Sample data initialization for testing
export function initializeSampleData() {
  // Create sample user
  const user: User = {
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
    createdAt: new Date("2023-01-15")
  };
  users.push(user);
  
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
