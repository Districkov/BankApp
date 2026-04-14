import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../utils/api';

const API_URL = 'https://auth.korzik.space/api/auth/v1';

export default function SessionLimitScreen({ navigation, route }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { sessions, preauthSessionId, username, tgAuthResult } = route.params || {};
  const { login } = useAuth();

  const handleDeleteSession = async (sessionId) => {
    setIsLoading(true);
    setError('');

    try {
      // Вызываем /preauth с preauthSessionId и sessionId для удаления старой сессии и получения новой
      const preauthResponse = await fetch(`${API_URL}/preauth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': `YAA_PREAUTH_SESS_ID=${preauthSessionId}`,
        },
        body: JSON.stringify({
          preauthSessionId: preauthSessionId,
          sessionId: sessionId,
        }),
      });

      if (!preauthResponse.ok) {
        const errorData = await preauthResponse.json().catch(() => ({}));
        throw new Error(errorData.message || 'Ошибка при подтверждении сессии');
      }

      // Получаем сессионную куку из заголовков
      const setCookieHeader = preauthResponse.headers.get('set-cookie');
      if (setCookieHeader) {
        await AsyncStorage.setItem('session_cookie', setCookieHeader);
      }

      // Получаем данные пользователя через whoami API
      let userData = {};
      try {
        userData = await authAPI.whoami();
      } catch (e) {
        console.error('Error fetching user data after login:', e);
        // Пробуем получить данные из response
        try {
          userData = await preauthResponse.json();
        } catch (e2) {
          // Response может быть пустым
          userData = {};
        }
      }

      await login(setCookieHeader || 'session_cookie', userData);
      navigation.replace('Welcome');
    } catch (err) {
      setError(err.message || 'Ошибка при удалении сессии');
      setIsLoading(false);
    }
  };

  const formatDevice = (session) => {
    const os = session.userAgent?.os || '';
    const browser = session.userAgent?.browser?.name || '';
    const device = session.device?.model || session.device?.vendor || '';
    
    if (os && browser) return `${os}, ${browser}`;
    if (os) return os;
    if (device) return device;
    return 'Неизвестное устройство';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="shield-outline" size={48} color="#6A2EE8" />
        </View>

        <Text style={styles.title}>Превышен лимит сессий</Text>
        <Text style={styles.subtitle}>
          {username || 'Пользователь'}, выберите сессию для удаления
        </Text>

        {error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={20} color="#FF3B30" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <ScrollView style={styles.sessionsList} showsVerticalScrollIndicator={false}>
          {sessions?.map((session, index) => (
            <TouchableOpacity
              key={session.sessionId}
              style={[
                styles.sessionItem,
                index === sessions.length - 1 && styles.sessionItemLast,
              ]}
              onPress={() => handleDeleteSession(session.sessionId)}
              disabled={isLoading}
            >
              <View style={styles.sessionIcon}>
                <Ionicons
                  name={
                    session.userAgent?.device?.type === 'mobile'
                      ? 'phone-portrait'
                      : 'desktop'
                  }
                  size={24}
                  color="#6A2EE8"
                />
              </View>
              <View style={styles.sessionInfo}>
                <Text style={styles.sessionDevice}>
                  {formatDevice(session)}
                </Text>
                <Text style={styles.sessionDate}>
                  {formatDate(session.lastActivityDate)}
                </Text>
                <Text style={styles.sessionIp}>{session.authIp}</Text>
              </View>
              <Ionicons
                name="trash-outline"
                size={20}
                color="#FF3B30"
              />
            </TouchableOpacity>
          ))}
        </ScrollView>

        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#6A2EE8" />
            <Text style={styles.loadingText}>Удаление сессии...</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7FB',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    alignSelf: 'center',
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
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF3B3010',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  sessionsList: {
    flex: 1,
  },
  sessionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sessionItemLast: {
    marginBottom: 32,
  },
  sessionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6A2EE810',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionDevice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  sessionDate: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
  sessionIp: {
    fontSize: 11,
    color: '#666',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: '#666',
  },
});
