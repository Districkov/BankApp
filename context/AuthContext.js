import React, { createContext, useContext, useState, useEffect } from 'react';

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
      console.log('AuthContext.checkSession - Checking session...');
      // В Next.js используем localStorage вместо AsyncStorage
      const sessionCookie = typeof window !== 'undefined' ? localStorage.getItem('session_cookie') : null;
      console.log('AuthContext.checkSession - sessionCookie exists:', !!sessionCookie);

      if (sessionCookie) {
        // Здесь будет вызов API для проверки сессии
        // const userData = await authAPI.whoami();
        // setUser(userData);
        // setIsAuthenticated(true);
        console.log('AuthContext.checkSession - Session found');
      } else {
        console.log('AuthContext.checkSession - No session cookie found');
      }
    } catch (error) {
      console.error('AuthContext.checkSession - Error:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (sessionCookie, userData) => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('session_cookie', sessionCookie);
        localStorage.setItem('user_data', JSON.stringify(userData));
      }
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('session_cookie');
      localStorage.removeItem('user_data');
    }
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout,
    refreshUser: checkSession
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
