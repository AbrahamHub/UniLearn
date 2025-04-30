import React, { createContext, useContext, useState } from 'react';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const VALID_CREDENTIALS = [
  { email: 'estudiante@unilearn.com', password: 'estudiante123', role: 'user', name: 'Estudiante', id: '1' },
  { email: 'experto@unilearn.com', password: 'experto123', role: 'expert', name: 'Experto', id: '2' },
  { email: 'admin@unilearn.com', password: 'admin123', role: 'admin', name: 'Administrador', id: '3' },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    const validUser = VALID_CREDENTIALS.find(
      cred => cred.email === email && cred.password === password
    );

    if (!validUser) {
      throw new Error('Credenciales inválidas');
    }

    const mockUser: User = {
      id: validUser.id,
      name: validUser.name,
      email,
      role: validUser.role as 'user' | 'expert' | 'admin',
    };
    setUser(mockUser);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
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