import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
      const sessionCookie = await AsyncStorage.getItem('session_cookie');

      if (sessionCookie) {
        const userData = await authAPI.whoami();
        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
        }
      }
    } catch (error) {
      console.error('Error checking session:', error);
      // Очищаем невалидную сессию
      await AsyncStorage.removeItem('session_cookie');
      await AsyncStorage.removeItem('user_data');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (sessionCookie, userData) => {
    try {
      await AsyncStorage.setItem('session_cookie', sessionCookie);
      await AsyncStorage.setItem('user_data', JSON.stringify(userData));
      
      // Получаем актуальные данные пользователя из API
      try {
        const profileData = await userAPI.getProfile();
        setUser(profileData || userData);
      } catch (e) {
        setUser(userData);
      }
      
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error saving session:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Пытаемся вызвать logout на бэкенде
      try {
        await authAPI.logout();
      } catch (e) {
        // Игнорируем ошибки logout на бэкенде
      }
      
      await AsyncStorage.removeItem('session_cookie');
      await AsyncStorage.removeItem('user_data');
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
