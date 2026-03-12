import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';

export default function WelcomeScreen({ navigation }) {
  const { user } = useAuth();
  const userName = user?.username || 'Пользователь';

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Main');
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <LinearGradient
      colors={['#fafafa', '#f0e6ff', '#e8d5ff']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Добро пожаловать,</Text>
        <Text style={styles.userName}>{userName}</Text>
        
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#6A2EE8" />
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
    marginBottom: 8,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#6A2EE8',
    textAlign: 'center',
    marginBottom: 60,
  },
  loaderContainer: {
    marginTop: 20,
  },
});
