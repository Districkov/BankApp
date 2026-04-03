import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { notifyTransferSuccess, requestNotificationPermission } from '../../utils/notifications';

export default function TransferBetween({ navigation }) {
  const [amount, setAmount] = useState('');
  const [fromAccount, setFromAccount] = useState('account1');
  const [toAccount, setToAccount] = useState('account2');

  const accounts = {
    account1: {
      id: 'account1',
      name: 'Основной счёт',
      amount: '22 717,98 ₽',
      color: '#6A2EE8'
    },
    account2: {
      id: 'account2',
      name: 'Накопительный счёт',
      amount: '50 000,00 ₽',
      color: '#159E3A'
    }
  };

  const onChangeAmount = (text) => {
    let cleaned = text.replace(/[^\d,.]/g, '');
    cleaned = cleaned.replace(',', '.');
    const parts = cleaned.split('.');
    if (parts.length > 2) {
      cleaned = parts[0] + '.' + parts[1];
    }
    setAmount(cleaned);
  };

  const handleTransfer = async () => {
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

    // Запрашиваем разрешение и отправляем уведомление
    await requestNotificationPermission();
    notifyTransferSuccess(amountNum.toFixed(2), 'Перевод между счетами');

    navigation.navigate('Success', {
      amount: amountNum.toFixed(2),
      type: 'Перевод между счетами'
    });
  };

  const isFormValid = amount && parseFloat(amount) > 0;

  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <TouchableOpacity testID="close-button" style={styles.closeButton} onPress={() => navigation.goBack()}>
          <Feather name="x" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Между счетами</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Списать с</Text>
          <TouchableOpacity
            style={[
              styles.accountCard,
              fromAccount === 'account1' && styles.accountCardSelected
            ]}
            onPress={() => setFromAccount('account1')}
          >
            <View style={styles.accountHeader}>
              <View style={[styles.accountDot, { backgroundColor: accounts.account1.color }]} />
              <Text style={styles.accountName}>{accounts.account1.name}</Text>
            </View>
            <Text style={styles.accountAmount}>{accounts.account1.amount}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Зачислить на</Text>
          <TouchableOpacity
            style={[
              styles.accountCard,
              toAccount === 'account2' && styles.accountCardSelected
            ]}
            onPress={() => setToAccount('account2')}
          >
            <View style={styles.accountHeader}>
              <View style={[styles.accountDot, { backgroundColor: accounts.account2.color }]} />
              <Text style={styles.accountName}>{accounts.account2.name}</Text>
            </View>
            <Text style={styles.accountAmount}>{accounts.account2.amount}</Text>
          </TouchableOpacity>
        </View>

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
    paddingHorizontal: 4
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
    elevation: 3
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
    gap: 12
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
    elevation: 3
  },
  amountInput: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
    padding: 0,
    margin: 0
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    width: 30
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
