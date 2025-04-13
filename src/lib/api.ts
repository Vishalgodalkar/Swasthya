
import { authAPI, doctorsAPI, patientsAPI, appointmentsAPI, reportsAPI, zoomAPI } from './apiService';

// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  userType: 'patient' | 'doctor' | 'admin';
  phoneNumber?: string;
  profileImage?: string;
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
        profileImage: response.user.profileImage
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
        profileImage: response.user.profileImage
      };
    }
    return null;
  } catch (error) {
    console.error('Registration error:', error);
    return null;
  }
};
