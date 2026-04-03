import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Linking, Platform } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';

const API_URL = 'https://bank.korzik.space/api/auth/v1';
const REDIRECT_PATHS = ['/code/telegram', '/auth/telegram/callback'];

export default function TelegramAuthScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  useEffect(() => {
    // Проверяем, уже ли авторизован пользователь
    if (!authLoading && isAuthenticated) {
      navigation.replace('Welcome');
    }
  }, [isAuthenticated, authLoading, navigation]);

  useEffect(() => {
    // Обработка URL при запуске приложения
    const handleDeepLink = async () => {
      try {
        // Для web проверяем текущий URL
        if (Platform.OS === 'web' && typeof window !== 'undefined') {
          const currentUrl = window.location.href;
          if (REDIRECT_PATHS.some(path => currentUrl.includes(path))) {
            const code = extractCodeFromUrl(currentUrl);
            if (code) {
              navigation.navigate('CodeInput', { code });
              return;
            }
          }
        }

        const url = await Linking.getInitialURL();
        if (url && REDIRECT_PATHS.some(path => url.includes(path))) {
          const code = extractCodeFromUrl(url);
          if (code) {
            navigation.navigate('CodeInput', { code });
          }
        }
      } catch (err) {
        // Handle error silently
      }
    };

    handleDeepLink();

    // Обработка URL когда приложение уже открыто
    const subscription = Linking.addEventListener('url', (event) => {
      if (event.url && REDIRECT_PATHS.some(path => event.url.includes(path))) {
        const code = extractCodeFromUrl(event.url);
        if (code) {
          navigation.navigate('CodeInput', { code });
        }
      }
    });

    return () => subscription.remove();
  }, [navigation]);

  const extractCodeFromUrl = (url) => {
    try {
      // Для URL вида http://localhost:19006//code/telegram#tgAuthResult=...
      // или bankapp://auth/code/telegram#tgAuthResult=...

      // 1. Пробуем получить tgAuthResult из hash фрагмента
      const hashIndex = url.indexOf('#');
      if (hashIndex !== -1) {
        const hash = url.substring(hashIndex + 1);
        const hashParams = new URLSearchParams(hash);
        const tgAuthResult = hashParams.get('tgAuthResult');
        if (tgAuthResult) {
          return tgAuthResult;
        }
      }
      
      // 2. Пробуем получить код из query параметров
      const queryIndex = url.indexOf('?');
      if (queryIndex !== -1) {
        const queryString = url.substring(queryIndex);
        const queryParams = new URLSearchParams(queryString);
        const code = queryParams.get('code');
        if (code) return code;
      }
      
      // 3. Если код в пути URL (например /code/telegram/123456)
      const pathIndex = url.indexOf(REDIRECT_PATH);
      if (pathIndex !== -1) {
        const pathAfter = url.substring(pathIndex + REDIRECT_PATH.length);
        const code = pathAfter.replace(/^\/+/, '').split('/')[0].split('?')[0].split('#')[0];
        if (code && code.length > 0) {
          return code;
        }
      }
      
      return null;
    } catch (e) {
      // Фолбэк: пробуем найти tgAuthResult в hash через regex
      const hashMatch = url.match(/#tgAuthResult=([^&]+)/);
      if (hashMatch) return hashMatch[1];
      
      return null;
    }
  };

  const handleTelegramAuth = async () => {
    setIsLoading(true);
    setError('');

    try {
      // Получаем URL для авторизации через Telegram
      const response = await fetch(`${API_URL}/simple/telegram/url`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Не удалось получить URL авторизации');
      }

      const authUrl = await response.text();

      if (!authUrl) {
        throw new Error('URL авторизации не получен');
      }

      // Открываем Telegram для авторизации
      await Linking.openURL(authUrl);

      // После возврата из Telegram код будет обработан в useFocusEffect
    } catch (err) {
      setError(err.message || 'Ошибка при получении URL авторизации');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#fafafa', '#f0e6ff', '#e8d5ff']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Добро пожаловать,</Text>

        {error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={20} color="#FF3B30" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <TouchableOpacity
          testID="login-button"
          style={[styles.telegramButton, isLoading && styles.telegramButtonDisabled]}
          onPress={handleTelegramAuth}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <MaterialCommunityIcons name="send" size={24} color="#fff" />
              <Text style={styles.telegramButtonText}>Войти через Telegram</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    minHeight: '100%',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    width: '100%',
    maxWidth: 400,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
    marginBottom: 60,
  },
  telegramButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6A2EE8',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    width: '100%',
    marginBottom: 16,
  },
  telegramButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  telegramButtonDisabled: {
    opacity: 0.6,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF3B3010',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 24,
    width: '100%',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
});
