import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { transfersAPI, accountsAPI } from '../../utils/api';
import { notifyTransferSuccess, requestNotificationPermission } from '../../utils/notifications';

export default function TransferBetween({ navigation }) {
  const [amount, setAmount] = useState('');
  const [fromAccount, setFromAccount] = useState('');
  const [toAccount, setToAccount] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTransferring, setIsTransferring] = useState(false);

  // Загрузка счетов с API
  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      setIsLoading(true);
      const response = await accountsAPI.getAccounts();
      const accountsList = response.accounts || response.data || [];
      setAccounts(accountsList);
      
      // Устанавливаем счета по умолчанию
      if (accountsList.length > 0) {
        setFromAccount(accountsList[0].id);
        if (accountsList.length > 1) {
          setToAccount(accountsList[1].id);
        } else {
          setToAccount(accountsList[0].id);
        }
      }
    } catch (error) {
      console.error('Error loading accounts:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить счета. Попробуйте позже.');
    } finally {
      setIsLoading(false);
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
    const fromAcc = accounts.find(acc => acc.id === fromAccount);
    
    if (!fromAcc) {
      Alert.alert('Ошибка', 'Выберите счет списания');
      return;
    }

    const fromAmount = parseFloat(fromAcc.balance || fromAcc.amount || 0);

    if (amountNum > fromAmount) {
      Alert.alert('Ошибка', 'Недостаточно средств на счете');
      return;
    }

    if (fromAccount === toAccount) {
      Alert.alert('Ошибка', 'Выберите разные счета для перевода');
      return;
    }

    try {
      setIsTransferring(true);
      
      // Выполняем перевод через API
      await transfersAPI.transferBetweenAccounts({
        fromAccountId: fromAccount,
        toAccountId: toAccount,
        amount: amountNum,
      });

      navigation.navigate('Success', {
        amount: amountNum.toFixed(2),
        type: 'Перевод между счетами',
        showNotification: true,
      });
    } catch (error) {
      console.error('Transfer error:', error);
      Alert.alert(
        'Ошибка перевода',
        error.message || 'Не удалось выполнить перевод. Попробуйте позже.'
      );
    } finally {
      setIsTransferring(false);
    }
  };

  const isFormValid = amount && parseFloat(amount) > 0 && fromAccount && toAccount && fromAccount !== toAccount;

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6A2EE8" />
        <Text style={styles.loadingText}>Загрузка счетов...</Text>
      </View>
    );
  }

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
          {accounts.map((account) => (
            <TouchableOpacity
              key={account.id}
              style={[
                styles.accountCard,
                fromAccount === account.id && styles.accountCardSelected
              ]}
              onPress={() => setFromAccount(account.id)}
            >
              <View style={styles.accountHeader}>
                <View style={[styles.accountDot, { backgroundColor: account.color || '#6A2EE8' }]} />
                <Text style={styles.accountName}>{account.name}</Text>
              </View>
              <Text style={styles.accountAmount}>
                {new Intl.NumberFormat('ru-RU', { 
                  style: 'currency', 
                  currency: 'RUB' 
                }).format(parseFloat(account.balance || account.amount || 0))}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Зачислить на</Text>
          {accounts.map((account) => (
            <TouchableOpacity
              key={account.id}
              style={[
                styles.accountCard,
                toAccount === account.id && styles.accountCardSelected
              ]}
              onPress={() => setToAccount(account.id)}
            >
              <View style={styles.accountHeader}>
                <View style={[styles.accountDot, { backgroundColor: account.color || '#159E3A' }]} />
                <Text style={styles.accountName}>{account.name}</Text>
              </View>
              <Text style={styles.accountAmount}>
                {new Intl.NumberFormat('ru-RU', { 
                  style: 'currency', 
                  currency: 'RUB' 
                }).format(parseFloat(account.balance || account.amount || 0))}
              </Text>
            </TouchableOpacity>
          ))}
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
          disabled={!isFormValid || isTransferring}
        >
          {isTransferring ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.transferButtonText}>
              Перевести {amount ? parseFloat(amount).toFixed(2) + ' ₽' : ''}
            </Text>
          )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
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
