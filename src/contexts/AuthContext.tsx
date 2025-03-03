
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

export type UserRole = 'student' | 'lecturer' | 'admin';

export interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  role: UserRole;
  profileImage?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check if the user is authenticated on mount
  useEffect(() => {
    const initAuth = async () => {
      await checkAuth();
      setIsLoading(false);
    };
    
    initAuth();
  }, []);

  const checkAuth = async (): Promise<boolean> => {
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        return false;
      }
      
      // In a real app, validate the token with your backend
      const response = await fetch('http://localhost:8800/api/auth/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Invalid token');
      }
      
      const userData = await response.json();
      setUser(userData.user);
      return true;
    } catch (error) {
      console.error('Authentication error:', error);
      logout();
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:8800/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      // Store token in localStorage
      if (data.token) {
        localStorage.setItem('authToken', data.token);
      }
      
      // Set user data
      setUser(data.user);
      
      // Redirect based on user role
      redirectBasedOnRole(data.user.role);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Clear user data and token
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    
    // Redirect to login page
    navigate('/login');
  };
  
  const redirectBasedOnRole = (role: UserRole) => {
    switch (role) {
      case 'student':
        navigate('/student');
        break;
      case 'lecturer':
        navigate('/lecturer');
        break;
      case 'admin':
        navigate('/admin');
        break;
      default:
        navigate('/');
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
      checkAuth,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
