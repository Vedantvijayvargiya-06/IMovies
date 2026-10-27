
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
  setAuthenticatedUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    storageService.init();
    const stored = storageService.getCurrentUser();

    if (stored) {
      setCurrentUser(stored);
    }
  }, []);

  const login = (email: string, requestedRole?: Role): boolean => {
    const users = storageService.getUsers();
    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (!found) return false;
    if (requestedRole && found.role !== requestedRole) return false;

    setCurrentUser(found);
    storageService.setCurrentUser(found);
    return true;
  };

  const register = (
    name: string,
    email: string,
    phone: string,
    role: Role
  ): boolean => {
    const users = storageService.getUsers();

    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return false;
    }

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

  const setAuthenticatedUser = (user: User) => {
    setCurrentUser(user);
    storageService.setCurrentUser(user);
    storageService.saveUser(user);
  };

  const logout = () => {
    setCurrentUser(null);
    storageService.setCurrentUser(null);
    localStorage.removeItem('imovies_token');
    localStorage.removeItem('imovies_user');
  };

  const switchRole = (role: Role) => {
    const targetUser =
      storageService.getUsers().find((u) => u.role === role) ||
      INITIAL_USERS.find((u) => u.role === role);

    if (!targetUser) return;

    setCurrentUser(targetUser);
    storageService.setCurrentUser(targetUser);
  };

  const updateProfile = (updated: Partial<User>) => {
    if (!currentUser) return;

    const modified = { ...currentUser, ...updated };
    setCurrentUser(modified);
    storageService.saveUser(modified);
    storageService.setCurrentUser(modified);
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
        setAuthenticatedUser,
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
