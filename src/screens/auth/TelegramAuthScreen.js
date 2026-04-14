import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Linking, Platform } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';

const API_URL = 'https://bank.korzik.space/api/auth/v1';
const REDIRECT_PATHS = ['/code/telegram', '/auth/telegram/callback'];

export default function TelegramAuthScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isPolling, setIsPolling] = useState(false);
  const { isAuthenticated, isLoading: authLoading, checkSession } = useAuth();

  useEffect(() => {
    // Проверяем, уже ли авторизован пользователь
    console.log('TelegramAuthScreen - authLoading:', authLoading, 'isAuthenticated:', isAuthenticated);
    if (!authLoading && isAuthenticated) {
      console.log('TelegramAuthScreen - Navigating to Welcome');
      setIsPolling(false); // Останавливаем polling
      navigation.replace('Welcome');
    }
  }, [isAuthenticated, authLoading, navigation]);

  // Polling mechanism - проверяем аутентификацию каждые 2 секунды
  useEffect(() => {
    if (!isPolling) return;

    console.log('TelegramAuthScreen - Starting polling...');
    const pollInterval = setInterval(async () => {
      try {
        console.log('TelegramAuthScreen - Polling check...');
        await checkSession();
      } catch (e) {
        console.log('TelegramAuthScreen - Polling error:', e.message);
      }
    }, 2000);

    return () => {
      console.log('TelegramAuthScreen - Stopping polling');
      clearInterval(pollInterval);
    };
  }, [isPolling, checkSession]);

  const extractCodeFromUrl = (url) => {
    try {
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

      return null;
    } catch (e) {
      const hashMatch = url.match(/#tgAuthResult=([^&]+)/);
      if (hashMatch) return hashMatch[1];
      return null;
    }
  };

  const handleRedirectUrl = async (url) => {
    if (!REDIRECT_PATHS.some(path => url.includes(path))) {
      return;
    }

    console.log('TelegramAuthScreen - Redirect path detected!');
    const code = extractCodeFromUrl(url);
    console.log('TelegramAuthScreen - Extracted code:', code ? code.substring(0, 50) + '...' : null);
    
    if (!code) {
      return;
    }

    // Отправляем код на callback endpoint
    try {
      console.log('TelegramAuthScreen - Sending code to callback...');
      console.log('TelegramAuthScreen - Code length:', code.length);
      console.log('TelegramAuthScreen - Code preview:', code.substring(0, 100) + '...');
      
      const requestBody = JSON.stringify({ code: code });
      console.log('TelegramAuthScreen - Request body:', requestBody);
      
      setIsLoading(true);
      setError('');

      const response = await fetch(`${API_URL}/simple/telegram/callback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: requestBody,
      });

      console.log('TelegramAuthScreen - Callback response status:', response.status);
      console.log('TelegramAuthScreen - Callback response ok:', response.ok);
      
      // Получаем текст ответа ДО любой обработки
      const responseText = await response.text();
      console.log('TelegramAuthScreen - Callback response text:', responseText);
      console.log('TelegramAuthScreen - Callback response text length:', responseText.length);

      // Обработка 300 статуса - превышен лимит сессий
      if (response.status === 300) {
        console.log('TelegramAuthScreen - Session limit exceeded, but continuing...');
        // Игнорируем лимит сессий и продолжаем
      }

      if (response.status !== 300 && !response.ok) {
        // Ответ не успешный - используем текст ответа
        const errorMessage = responseText || 'Ошибка авторизации';
        console.error('TelegramAuthScreen - Callback failed:', errorMessage);
        throw new Error(errorMessage);
      }

      // Callback успешен - сессия создана через куки
      console.log('TelegramAuthScreen - Callback successful, session created via cookies');
      
      // Запускаем polling для обнаружения сессии
      setIsPolling(true);
      setIsLoading(false);

      // Очищаем URL чтобы не обработать снова
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    } catch (err) {
      console.error('TelegramAuthScreen - Callback error:', err.message);
      setError(err.message || 'Ошибка при авторизации');
      setIsLoading(false);
    }
  };

  // Добавляем проверку URL при каждом фокусе экрана (после возврата из Telegram)
  useFocusEffect(
    React.useCallback(() => {
      console.log('TelegramAuthScreen - Screen focused, checking URL...');
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        const currentUrl = window.location.href;
        console.log('TelegramAuthScreen - Current URL on focus:', currentUrl);
        handleRedirectUrl(currentUrl);
      }
      checkSession();
    }, [navigation, checkSession])
  );

  useEffect(() => {
    // Обработка URL при запуске приложения
    const handleDeepLink = async () => {
      try {
        console.log('TelegramAuthScreen - handleDeepLink starting...');
        
        // Для web проверяем текущий URL СРАЗУ
        if (Platform.OS === 'web' && typeof window !== 'undefined') {
          const currentUrl = window.location.href;
          console.log('TelegramAuthScreen - Current URL at startup:', currentUrl);
          console.log('TelegramAuthScreen - Has /code/telegram:', currentUrl.includes('/code/telegram'));
          console.log('TelegramAuthScreen - Has tgAuthResult:', currentUrl.includes('tgAuthResult'));
          
          // СРАЗУ обрабатываем redirect URL
          if (REDIRECT_PATHS.some(path => currentUrl.includes(path))) {
            console.log('TelegramAuthScreen - Redirect detected at startup!');
            await handleRedirectUrl(currentUrl);
            return;
          }
        }

        const url = await Linking.getInitialURL();
        console.log('TelegramAuthScreen - Initial URL:', url);
        if (url && REDIRECT_PATHS.some(path => url.includes(path))) {
          await handleRedirectUrl(url);
        }
      } catch (err) {
        console.error('TelegramAuthScreen - handleDeepLink error:', err.message, err.stack);
      }
    };

    handleDeepLink();

    // Для web: слушаем изменения hash и history state (Telegram redirect)
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const handleUrlChange = () => {
        const currentUrl = window.location.href;
        console.log('TelegramAuthScreen - URL changed:', currentUrl);
        handleRedirectUrl(currentUrl);
      };

      window.addEventListener('hashchange', handleUrlChange);
      window.addEventListener('popstate', handleUrlChange);

      return () => {
        window.removeEventListener('hashchange', handleUrlChange);
        window.removeEventListener('popstate', handleUrlChange);
      };
    }

    // Обработка URL когда приложение уже открыто (для mobile)
    const subscription = Linking.addEventListener('url', (event) => {
      console.log('TelegramAuthScreen - URL event received:', event.url);
      handleRedirectUrl(event.url);
    });

    return () => subscription.remove();
  }, [navigation, checkSession]);

  const handleTelegramAuth = async () => {
    console.log('TelegramAuthScreen - handleTelegramAuth called');
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
      console.log('TelegramAuthScreen - Auth URL received:', authUrl);

      if (!authUrl) {
        throw new Error('URL авторизации не получен');
      }

      // Открываем Telegram для авторизации
      console.log('TelegramAuthScreen - Opening Telegram...');
      await Linking.openURL(authUrl);

      // Запускаем polling после открытия Telegram
      console.log('TelegramAuthScreen - Starting polling after Telegram open');
      setIsPolling(true);
      setIsLoading(false);

      // После возврата из Telegram код будет обработан в useFocusEffect или polling
    } catch (err) {
      console.error('TelegramAuthScreen - handleTelegramAuth error:', err.message);
      setError(err.message || 'Ошибка при получении URL авторизации');
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

        {isPolling && (
          <View style={styles.pollingContainer}>
            <ActivityIndicator size="small" color="#6A2EE8" />
            <Text style={styles.pollingText}>
              Ожидание авторизации Telegram...
            </Text>
            <TouchableOpacity onPress={() => setIsPolling(false)}>
              <Text style={styles.pollingCancel}>Отмена</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          testID="login-button"
          style={[styles.telegramButton, (isLoading || isPolling) && styles.telegramButtonDisabled]}
          onPress={handleTelegramAuth}
          disabled={isLoading || isPolling}
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
  pollingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6A2EE810',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 24,
    width: '100%',
    gap: 12,
  },
  pollingText: {
    color: '#6A2EE8',
    fontSize: 14,
    flex: 1,
  },
  pollingCancel: {
    color: '#FF3B30',
    fontSize: 14,
    fontWeight: '600',
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
