import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, userAPI } from '../utils/api';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      console.log('Checking session...');
      const sessionCookie = localStorage.getItem('session_cookie');
      console.log('Session cookie:', sessionCookie ? 'exists' : 'not found');

      if (sessionCookie) {
        const userData = await authAPI.whoami();
        console.log('User data from whoami:', userData);
        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
          console.log('User authenticated');
        }
      }
    } catch (error) {
      console.error('Error checking session:', error);
      localStorage.removeItem('session_cookie');
      localStorage.removeItem('user_data');
    } finally {
      setIsLoading(false);
      console.log('Auth loading finished');
    }
  };

  const login = async (sessionCookie, userData) => {
    try {
      console.log('Login called with:', { sessionCookie: sessionCookie ? 'exists' : 'missing', userData });
      localStorage.setItem('session_cookie', sessionCookie);
      localStorage.setItem('user_data', JSON.stringify(userData));
      
      try {
        const profileData = await userAPI.getProfile();
        console.log('Profile data:', profileData);
        setUser(profileData || userData);
      } catch (e) {
        console.log('Failed to get profile, using userData:', e);
        setUser(userData);
      }
      
      setIsAuthenticated(true);
      console.log('Login successful, isAuthenticated set to true');
    } catch (error) {
      console.error('Error saving session:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      try {
        await authAPI.logout();
      } catch (e) {
        // Игнорируем ошибки logout на бэкенде
      }
      
      localStorage.removeItem('session_cookie');
      localStorage.removeItem('user_data');
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  };

  const refreshUser = async () => {
    try {
      const userData = await userAPI.getProfile();
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Error refreshing user:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        login,
        logout,
        checkSession,
        refreshUser,
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
