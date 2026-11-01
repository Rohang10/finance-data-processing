'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, RoleType } from '@/types';
import { loginApi, signupApi } from '@/lib/api';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  signup: (name: string, email: string, pass: string, role: string) => Promise<boolean>;
  logout: () => void;
  switchRoleDemo: (role: RoleType) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check saved session on mount
    try {
      const savedToken = localStorage.getItem('finance_token');
      const savedUser = localStorage.getItem('finance_user');
      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      }
    } catch (e) {
      console.error('Failed reading auth state', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Secure Route Guard
  useEffect(() => {
    if (!isLoading && !user && pathname.startsWith('/dashboard')) {
      router.push('/login');
    }
  }, [user, isLoading, pathname, router]);

  const login = async (email: string, pass: string): Promise<boolean> => {
    try {
      const data = await loginApi(email, pass);
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('finance_token', data.token);
      localStorage.setItem('finance_user', JSON.stringify(data.user));
      router.push('/dashboard');
      return true;
    } catch (e) {
      console.error('Login error', e);
      throw e;
    }
  };

  const signup = async (name: string, email: string, pass: string, role: string): Promise<boolean> => {
    try {
      // 1. Create the account
      await signupApi(name, email, pass, role);
      // 2. Automatically log them in to get the JWT token (since backend register doesn't return one)
      return await login(email, pass);
    } catch (e) {
      console.error('Signup error', e);
      throw e;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('finance_token');
    localStorage.removeItem('finance_user');
    router.push('/login');
  };

  const switchRoleDemo = (role: RoleType) => {
    if (user) {
      const updatedUser = { ...user, role };
      setUser(updatedUser);
      localStorage.setItem('finance_user', JSON.stringify(updatedUser));
    } else {
      const demoUser: User = {
        id: 'demo-123',
        name: 'Demo User',
        email: 'demo@example.com',
        role,
        created_at: new Date().toISOString()
      };
      setUser(demoUser);
      setToken('demo-token');
      localStorage.setItem('finance_user', JSON.stringify(demoUser));
      localStorage.setItem('finance_token', 'demo-token');
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, signup, logout, switchRoleDemo }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
