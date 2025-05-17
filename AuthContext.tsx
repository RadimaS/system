import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

interface User {
  id: string;
  email: string;
  role: 'student' | 'admin';
  fullName?: string;
  faculty?: string;
  course?: string;
  roomId?: string | null;
}

interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  faculty: string;
  course: string;
  phoneNumber: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Check for existing session on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (token) {
          // Set the token in the API service
          api.setToken(token);
          
          // Get the current user
          const userData = await api.get('/auth/me');
          setUser(userData);
          
          // Redirect to the appropriate dashboard if on login/register page
          const path = window.location.pathname;
          if (path === '/login' || path === '/register' || path === '/') {
            navigate(userData.role === 'admin' ? '/admin' : '/student');
          }
        } else {
          setUser(null);
          // Only redirect to login if on a protected route
          const path = window.location.pathname;
          if (path.startsWith('/admin') || path.startsWith('/student')) {
            navigate('/login');
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setUser(null);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [navigate]);

  const login = async (email: string, password: string) => {
    try {
      const { token, user } = await api.post('/auth/login', { email, password });
      
      // Store the token
      localStorage.setItem('token', token);
      api.setToken(token);
      
      // Update user state
      setUser(user);
      
      // Redirect based on role
      navigate(user.role === 'admin' ? '/admin' : '/student');
      
      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      await api.post('/auth/register', data);
      // Registration successful, but don't log in automatically
      return;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAdmin: user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};