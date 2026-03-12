import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../context/AuthContext';

const API_URL = 'https://auth.korzik.space/api/auth/v1';

export default function CodeInputScreen({ navigation, route }) {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isAutoSubmitting, setIsAutoSubmitting] = useState(false);
  const inputRefs = useRef([]);
  const { login } = useAuth();
  const tgAuthResultRef = useRef('');

  useEffect(() => {
    // Проверяем, есть ли код в параметрах (из deep link)
    const authCode = route.params?.code;
    if (authCode) {
      tgAuthResultRef.current = authCode;
      setIsAutoSubmitting(true);
      handleSubmit(authCode);
    }
  }, [route.params?.code]);

  useEffect(() => {
    // Фокус на первом поле при монтировании
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleCodeChange = (text, index) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);
    setError('');

    // Автопереход к следующему полю
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    // Переход назад при удалении
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (verificationCode) => {
    const codeToVerify = verificationCode || code.join('');
    
    if (!codeToVerify || codeToVerify.length < 6) {
      setError('Введите код авторизации');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Отправляем код в callback endpoint
      const response = await fetch(`${API_URL}/simple/telegram/callback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: codeToVerify,
        }),
      });

      // Обработка 300 статуса - превышен лимит сессий
      if (response.status === 300) {
        const data = await response.json();
        // Переходим на экран выбора сессии для удаления
        navigation.navigate('SessionLimit', {
          sessions: data.sessions,
          preauthSessionId: data.preauthSessionId,
          username: data.username,
          tgAuthResult: codeToVerify,
        });
        setIsLoading(false);
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Ошибка авторизации');
      }

      // Получаем сессионную куку из заголовков
      const setCookieHeader = response.headers.get('set-cookie');
      if (setCookieHeader) {
        // Сохраняем куку в AsyncStorage
        await AsyncStorage.setItem('session_cookie', setCookieHeader);
      }
      
      // Пробуем получить данные пользователя из response
      let userData = {};
      try {
        userData = await response.json();
      } catch (e) {
        // Response может быть пустым при успешном входе
      }
      
      // Сохраняем сессию через AuthContext
      await login(setCookieHeader || 'session_cookie', userData);

      // Переход на экран приветствия
      navigation.replace('Welcome');
    } catch (err) {
      setError(err.message || 'Ошибка при проверке кода');
      setIsAutoSubmitting(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = () => {
    // Логика повторной отправки кода
    console.log('Resend code');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Ionicons name="shield-checkmark" size={48} color="#6A2EE8" />
          </View>

          <Text style={styles.title}>Подтверждение</Text>
          <Text style={styles.subtitle}>
            {isAutoSubmitting
              ? 'Проверка данных Telegram...'
              : 'Введите код из Telegram'
            }
          </Text>

          {error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={20} color="#FF3B30" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {!isAutoSubmitting && (
            <>
              <View style={styles.codeContainer}>
                {code.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => (inputRefs.current[index] = ref)}
                    style={[
                      styles.codeInput,
                      digit && styles.codeInputFilled,
                      error && styles.codeInputError,
                    ]}
                    keyboardType="number-pad"
                    maxLength={1}
                    value={digit}
                    onChangeText={(text) => handleCodeChange(text, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    selectTextOnFocus
                    autoFocus={index === 0}
                  />
                ))}
              </View>

              <TouchableOpacity
                style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
                onPress={() => handleSubmit()}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitButtonText}>Подтвердить</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity onPress={handleResendCode} disabled={isLoading}>
                <Text style={styles.resendText}>
                  Отправить код повторно
                </Text>
              </TouchableOpacity>
            </>
          )}

          {isAutoSubmitting && isLoading && (
            <ActivityIndicator size="large" color="#6A2EE8" />
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7FB',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
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
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    width: '100%',
  },
  codeInput: {
    width: 48,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginHorizontal: 4,
    color: '#000',
  },
  codeInputFilled: {
    borderColor: '#6A2EE8',
    backgroundColor: '#6A2EE810',
  },
  codeInputError: {
    borderColor: '#FF3B30',
    backgroundColor: '#FF3B3010',
  },
  submitButton: {
    backgroundColor: '#6A2EE8',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resendText: {
    color: '#6A2EE8',
    fontSize: 14,
    fontWeight: '500',
  },
});
