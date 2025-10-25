import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

export default function SimpleLoader({ navigation }) {
  useEffect(() => {
    // Ждем 5 секунд и переходим на главный экран
    const timer = setTimeout(() => {
      navigation.replace('Main');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#6A2EE8" />
      <Text style={styles.loadingText}>Загрузка...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7FB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginTop: 20,
  },
});