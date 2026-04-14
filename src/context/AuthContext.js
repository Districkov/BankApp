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
      console.log('AuthContext.checkSession - Checking session...');
      const sessionCookie = await AsyncStorage.getItem('session_cookie');
      console.log('AuthContext.checkSession - sessionCookie exists:', !!sessionCookie);

      if (sessionCookie) {
        const userData = await authAPI.whoami();
        console.log('AuthContext.checkSession - whoami raw result:', JSON.stringify(userData));
        
        // Извлекаем данные из разных уровней
        let processedData = userData;
        if (userData && userData.user) {
          processedData = userData.user;
        } else if (userData && userData.data) {
          processedData = userData.data;
        }
        console.log('AuthContext.checkSession - whoami processed:', JSON.stringify(processedData));
        
        if (processedData && Object.keys(processedData).length > 0) {
          setUser(processedData);
          setIsAuthenticated(true);
          console.log('AuthContext.checkSession - User authenticated:', JSON.stringify(processedData));
        } else {
          console.log('AuthContext.checkSession - whoami returned empty data, clearing session');
          // Если whoami вернул пустоту, очищаем сессию
          await AsyncStorage.removeItem('session_cookie');
          await AsyncStorage.removeItem('user_data');
        }
      } else {
        console.log('AuthContext.checkSession - No session cookie found');
      }
    } catch (error) {
      console.error('AuthContext.checkSession - Error:', error.message, error.stack);
      // Очищаем невалидную сессию
      await AsyncStorage.removeItem('session_cookie');
      await AsyncStorage.removeItem('user_data');
    } finally {
      setIsLoading(false);
      console.log('AuthContext.checkSession - isLoading set to false, final isAuthenticated:', isAuthenticated);
    }
  };

  const login = async (sessionCookie, userData) => {
    try {
      console.log('AuthContext.login - Starting login with userData:', JSON.stringify(userData));
      await AsyncStorage.setItem('session_cookie', sessionCookie);
      await AsyncStorage.setItem('user_data', JSON.stringify(userData));

      // Получаем актуальные данные пользователя из API
      let profileData = null;
      try {
        profileData = await userAPI.getProfile();
        console.log('AuthContext.login - Profile data raw:', JSON.stringify(profileData));
        
        // Извлекаем данные из разных уровней ответа
        if (profileData.user) {
          profileData = profileData.user;
        } else if (profileData.data) {
          profileData = profileData.data;
        }
        console.log('AuthContext.login - Profile data processed:', JSON.stringify(profileData));
      } catch (e) {
        console.error('AuthContext.login - Error fetching profile:', e.message);
      }

      // Используем данные из profile, если получили, иначе из userData
      if (profileData && Object.keys(profileData).length > 0) {
        console.log('AuthContext.login - Setting user from profileData');
        setUser(profileData);
      } else if (userData && Object.keys(userData).length > 0) {
        console.log('AuthContext.login - Setting user from userData');
        setUser(userData);
      } else {
        // Если все пусто, пытаемся получить через whoami
        try {
          console.log('AuthContext.login - Trying whoami as fallback');
          const whoamiData = await authAPI.whoami();
          console.log('AuthContext.login - whoami data raw:', JSON.stringify(whoamiData));
          
          let processedData = whoamiData;
          if (whoamiData.user) {
            processedData = whoamiData.user;
          } else if (whoamiData.data) {
            processedData = whoamiData.data;
          }
          console.log('AuthContext.login - whoami data processed:', JSON.stringify(processedData));
          setUser(processedData);
        } catch (e) {
          console.error('AuthContext.login - Error fetching whoami:', e.message);
          setUser(userData || {});
        }
      }

      setIsAuthenticated(true);
      console.log('AuthContext.login - Login complete, isAuthenticated = true');
    } catch (error) {
      console.error('AuthContext.login - Error:', error.message);
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
