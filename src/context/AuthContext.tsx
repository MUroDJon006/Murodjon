import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthStatus, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  status: AuthStatus;
  login: (phone: string, password?: string) => void;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');

  useEffect(() => {
    const savedUser = localStorage.getItem('careerflow_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        setStatus('authenticated');
      } catch (e) {
        localStorage.removeItem('careerflow_user');
        setStatus('unauthenticated');
      }
    } else {
      setStatus('unauthenticated');
    }
  }, []);

  const login = (phone: string, password?: string) => {
    // Simulate role detection logic based on password
    // In a real app, this would be an API call
    let role: UserRole = 'user';
    let name = 'Regular User';

    if (password) {
      // Specific passwords for admin roles as requested
      if (password === 'kelajak1') role = 'super_admin';
      else if (password === 'kelajak2') role = 'job_admin';
      else if (password === 'kelajak3') role = 'course_admin';
      else if (password === 'kelajak4') role = 'university_admin';
      
      // Legacy support for testing if needed
      else if (password === 'admin123') role = 'super_admin';
      
      if (role !== 'user') {
        name = role.split('_').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
      }
    }

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      phone,
      role,
      name,
      createdAt: new Date().toISOString(),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${phone}`,
    };
    
    setUser(newUser);
    setStatus('authenticated');
    localStorage.setItem('careerflow_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    setStatus('unauthenticated');
    localStorage.removeItem('careerflow_user');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      status, 
      login, 
      logout,
      isAdmin: !!user && user.role !== 'user'
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
