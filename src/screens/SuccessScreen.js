import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SuccessScreen({ navigation, route }) {
  const { amount, type = 'перевод' } = route.params || {};

  useEffect(() => {
    // Автоматическое закрытие через 3 секунды
    const timer = setTimeout(() => {
      navigation.replace('Main');
    }, 6000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.successIcon}>
          <Ionicons name="checkmark" size={48} color="#fff" />
        </View>
        
        <Text style={styles.successTitle}>Успешно!</Text>
        
        <Text style={styles.successText}>
          {type} на сумму{'\n'}
          <Text style={styles.amountText}>{amount} ₽</Text>{'\n'}
          выполнен успешно
        </Text>

        <TouchableOpacity 
          style={styles.closeButton}
          onPress={() => navigation.replace('Main')}
        >
          <Text style={styles.closeButtonText}>Закрыть</Text>
        </TouchableOpacity>

        <Text style={styles.autoCloseText}>Автоматически закроется через 3 секунды</Text>
      </View>
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
  content: {
    backgroundColor: '#fff',
    marginHorizontal: 24,
    padding: 32,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#159E3A',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    marginBottom: 16,
    textAlign: 'center',
  },
  successText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  amountText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#159E3A',
  },
  closeButton: {
    backgroundColor: '#6A2EE8',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  autoCloseText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});