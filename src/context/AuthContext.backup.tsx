import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '../types';
import { storageService } from '../services/storageService';
import { INITIAL_USERS } from '../data/mockData';

interface AuthContextType {
  currentUser: User | null;
  isAdmin: boolean;
  login: (email: string, role?: Role) => boolean;
  register: (name: string, email: string, phone: string, role: Role) => boolean;
  logout: () => void;
  switchRole: (role: Role) => void;
  updateProfile: (updated: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    storageService.init();
    const stored = storageService.getCurrentUser();
    if (stored) {
      setCurrentUser(stored);
    } else {
      // Default to demo user
      setCurrentUser(INITIAL_USERS[1]);
      storageService.setCurrentUser(INITIAL_USERS[1]);
    }
  }, []);

  const login = (email: string, requestedRole?: Role): boolean => {
    const users = storageService.getUsers();
    let found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!found) {
      // Auto-provision demo account if matching admin or demo
      if (email.toLowerCase().includes('admin')) {
        found = {
          id: `usr_${Date.now()}`,
          name: 'Cinema Administrator',
          email,
          role: 'admin',
          createdAt: new Date().toISOString(),
        };
      } else {
        found = {
          id: `usr_${Date.now()}`,
          name: email.split('@')[0],
          email,
          role: requestedRole || 'user',
          createdAt: new Date().toISOString(),
        };
      }
      storageService.saveUser(found);
    }

    setCurrentUser(found);
    storageService.setCurrentUser(found);
    return true;
  };

  const register = (name: string, email: string, phone: string, role: Role): boolean => {
    const newUser: User = {
      id: `usr_${Date.now()}`,
      name,
      email,
      phone,
      role,
      createdAt: new Date().toISOString(),
      favoriteGenres: ['Action', 'Thriller'],
    };
    storageService.saveUser(newUser);
    setCurrentUser(newUser);
    storageService.setCurrentUser(newUser);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    storageService.setCurrentUser(null);
  };

  const switchRole = (role: Role) => {
    if (role === 'admin') {
      const adminUser = storageService.getUsers().find((u) => u.role === 'admin') || INITIAL_USERS[0];
      setCurrentUser(adminUser);
      storageService.setCurrentUser(adminUser);
    } else {
      const regularUser = storageService.getUsers().find((u) => u.role === 'user') || INITIAL_USERS[1];
      setCurrentUser(regularUser);
      storageService.setCurrentUser(regularUser);
    }
  };

  const updateProfile = (updated: Partial<User>) => {
    if (!currentUser) return;
    const modified = { ...currentUser, ...updated };
    setCurrentUser(modified);
    storageService.saveUser(modified);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAdmin: currentUser?.role === 'admin',
        login,
        register,
        logout,
        switchRole,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
