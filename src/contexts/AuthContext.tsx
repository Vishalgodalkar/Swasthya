
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, loginUser, registerUser, RegisterData, LoginCredentials } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check for stored user session on component mount
    const storedUser = localStorage.getItem('vita-secure-user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('vita-secure-user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      setLoading(true);
      const loggedInUser = await loginUser(credentials);
      
      if (loggedInUser) {
        setUser(loggedInUser);
        localStorage.setItem('vita-secure-user', JSON.stringify(loggedInUser));
        toast({
          title: 'Login successful',
          description: `Welcome back, ${loggedInUser.name}!`,
        });
        return true;
      } else {
        toast({
          variant: 'destructive',
          title: 'Login failed',
          description: 'Invalid email or password. Please try again.',
        });
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        variant: 'destructive',
        title: 'Login failed',
        description: 'An unexpected error occurred. Please try again.',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      setLoading(true);
      const newUser = await registerUser(userData);
      
      if (newUser) {
        setUser(newUser);
        localStorage.setItem('vita-secure-user', JSON.stringify(newUser));
        toast({
          title: 'Registration successful',
          description: `Welcome to VitaSecure Health, ${newUser.name}!`,
        });
        return true;
      } else {
        toast({
          variant: 'destructive',
          title: 'Registration failed',
          description: 'This email may already be in use. Please try another one.',
        });
        return false;
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        variant: 'destructive',
        title: 'Registration failed',
        description: 'An unexpected error occurred. Please try again.',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('vita-secure-user');
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out.',
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
