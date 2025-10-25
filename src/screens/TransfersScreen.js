import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';

const { width: screenWidth } = Dimensions.get('window');

export default function TransferBetween({ navigation }) {
  const [amount, setAmount] = useState('');
  const [fromAccount, setFromAccount] = useState('black');
  const [toAccount, setToAccount] = useState('platinum');

  const accounts = {
    black: {
      id: 'black',
      name: 'Black',
      amount: '22 717,98 ₽',
      color: '#000'
    },
    platinum: {
      id: 'platinum',
      name: 'Платинум',
      amount: '0 ₽',
      color: '#6A2EE8'
    }
  };

  const onChangeAmount = (text) => {
    // Убираем все нецифровые символы кроме точки и запятой
    let cleaned = text.replace(/[^\d,.]/g, '');
    
    // Заменяем запятую на точку для корректного парсинга
    cleaned = cleaned.replace(',', '.');
    
    // Оставляем только цифры и одну точку
    const parts = cleaned.split('.');
    if (parts.length > 2) {
      cleaned = parts[0] + '.' + parts[1];
    }
    
    setAmount(cleaned);
  };

  const handleTransfer = () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Ошибка', 'Введите сумму для перевода');
      return;
    }

    const amountNum = parseFloat(amount);
    const fromAmount = parseFloat(accounts[fromAccount].amount.replace(/[^\d,.]/g, '').replace(',', '.'));

    if (amountNum > fromAmount) {
      Alert.alert('Ошибка', 'Недостаточно средств на счете');
      return;
    }

    // Переходим на экран успеха
    navigation.navigate('Success', { 
      amount: amountNum.toFixed(2), 
      type: 'Перевод между счетами' 
    });
  };

  const isFormValid = amount && parseFloat(amount) > 0;

  return (
    <View style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
          <Feather name="x" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Между счетами</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* From Account */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Списать с</Text>
          <TouchableOpacity 
            style={[
              styles.accountCard,
              fromAccount === 'black' && styles.accountCardSelected
            ]}
            onPress={() => setFromAccount('black')}
          >
            <View style={styles.accountHeader}>
              <View style={[styles.accountDot, { backgroundColor: accounts.black.color }]} />
              <Text style={styles.accountName}>{accounts.black.name}</Text>
            </View>
            <Text style={styles.accountAmount}>{accounts.black.amount}</Text>
          </TouchableOpacity>
        </View>

        {/* To Account */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Зачислить на</Text>
          <TouchableOpacity 
            style={[
              styles.accountCard,
              toAccount === 'platinum' && styles.accountCardSelected
            ]}
            onPress={() => setToAccount('platinum')}
          >
            <View style={styles.accountHeader}>
              <View style={[styles.accountDot, { backgroundColor: accounts.platinum.color }]} />
              <Text style={styles.accountName}>{accounts.platinum.name}</Text>
            </View>
            <Text style={styles.accountAmount}>{accounts.platinum.amount}</Text>
          </TouchableOpacity>
        </View>

        {/* Amount Input */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Сумма перевода</Text>
          <View style={styles.amountSection}>
            <View style={styles.amountInputContainer}>
              <TextInput
                style={styles.amountInput}
                value={amount}
                onChangeText={onChangeAmount}
                placeholder="0"
                placeholderTextColor="#999"
                keyboardType="numeric"
                textAlign="center"
              />
            </View>
            <Text style={styles.currencySymbol}>₽</Text>
          </View>
        </View>

        {/* Transfer Button */}
        <TouchableOpacity
          style={[
            styles.transferButton,
            !isFormValid && styles.transferButtonDisabled
          ]}
          onPress={handleTransfer}
          disabled={!isFormValid}
        >
          <Text style={styles.transferButtonText}>
            Перевести {amount ? parseFloat(amount).toFixed(2) + ' ₽' : ''}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#F7F7FB'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5'
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000'
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerSpacer: {
    width: 32
  },
  container: {
    flex: 1,
    padding: 16
  },
  section: {
    marginBottom: 24
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
    marginBottom: 12,
    paddingHorizontal: 4, // Такие же отступы как у карточек
  },
  accountCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  accountCardSelected: {
    borderColor: '#6A2EE8',
    backgroundColor: '#F8F5FF'
  },
  accountHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  accountDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8
  },
  accountName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000'
  },
  accountAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000'
  },
  amountSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  amountInputContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  amountInput: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
    padding: 0,
    margin: 0,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    width: 30,
  },
  transferButton: {
    backgroundColor: '#6A2EE8',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8
  },
  transferButtonDisabled: {
    backgroundColor: '#B9B6FF'
  },
  transferButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700'
  }
});