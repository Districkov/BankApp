import React, {useState, useEffect} from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { transfersAPI, accountsAPI } from '../../utils/api';
import { notifyTransferSuccess, requestNotificationPermission } from '../../utils/notifications';

export default function TransferCard({navigation}){
  const [cardNumber, setCardNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isTransferring, setIsTransferring] = useState(false);

  // Недавние карты из API
  const [recentCards, setRecentCards] = useState([]);

  // Загрузка счетов и недавних карт с API
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      // Загружаем счета
      const accountsResponse = await accountsAPI.getAccounts();
      const accountsList = accountsResponse.accounts || accountsResponse.data || [];
      setAccounts(accountsList);
      if (accountsList.length > 0) {
        setSelectedAccount(accountsList[0].id);
      }

      // Загружаем историю переводов по картам
      // Пока используем mock данные, т.к. в API нет endpoint для недавних карт
      setRecentCards([
        { id: 1, name: 'Алексей Петров', cardNumber: '5536 9140 8765 4321', bank: 'Тинькофф' },
        { id: 2, name: 'Мария Иванова', cardNumber: '4111 1111 1111 1111', bank: 'Сбербанк' },
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить данные. Попробуйте позже.');
    } finally {
      setIsLoading(false);
    }
  };

  function onChangeCardNumber(text){
    const formatted = formatCardNumber(text);
    setCardNumber(formatted);
  }

  function onChangeAmount(text) {
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
  }

  function onClose() {
    navigation.goBack();
  }

  async function onSend(){
    const e = {};
    if(!validateCardNumber(cardNumber)) e.cardNumber = 'Неверный номер карты';
    if(!validateAmount(amount)) e.amount = 'Введите сумму > 0';
    setErrors(e);
    
    if(Object.keys(e).length === 0){
      try {
        setIsTransferring(true);
        const amountNum = parseFloat(amount);

        // Выполняем перевод через API
        await transfersAPI.transferToCard({
          toCardNumber: cardNumber.replace(/\s/g, ''),
          amount: amountNum,
          fromAccountId: selectedAccount,
          message: message || undefined,
        });

        // Переходим на SuccessScreen
        navigation.navigate('Success', {
          amount: amountNum.toFixed(2),
          type: 'Перевод',
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
    }
  }

  function formatCardNumber(text) {
    const cleaned = text.replace(/\D/g, '').slice(0, 16);
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ') : '';
  }

  function validateCardNumber(cardNumber) {
    return cardNumber.replace(/\D/g, '').length === 16;
  }

  function validateAmount(amount) {
    const num = parseFloat(amount);
    const selectedAcc = accounts.find(acc => acc.id === selectedAccount);
    const balance = parseFloat(selectedAcc?.balance || selectedAcc?.amount || 0);
    return !isNaN(num) && num > 0 && num <= balance;
  }

  const isFormValid = validateCardNumber(cardNumber) && validateAmount(amount);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6A2EE8" />
        <Text style={styles.loadingText}>Загрузка данных...</Text>
      </View>
    );
  }

  return (
    <View style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>По номеру карты</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.container}>
        {/* Выбор счета */}
        <View style={styles.accountSelector}>
          <Text style={styles.sectionTitle}>Счет для списания</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {accounts.map((account) => (
              <TouchableOpacity
                key={account.id}
                style={[
                  styles.accountChip,
                  selectedAccount === account.id && styles.accountChipSelected
                ]}
                onPress={() => setSelectedAccount(account.id)}
              >
                <Text style={styles.accountChipName}>{account.name}</Text>
                <Text style={styles.accountChipBalance}>
                  {new Intl.NumberFormat('ru-RU', { 
                    style: 'currency', 
                    currency: 'RUB',
                    maximumFractionDigits: 2
                  }).format(parseFloat(account.balance || account.amount || 0))}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Недавние карты */}
        <View style={styles.cardsSection}>
          <Text style={styles.sectionTitle}>Недавние переводы</Text>
          {recentCards.map((card) => (
            <TouchableOpacity
              key={card.id}
              style={styles.cardItem}
              onPress={() => setCardNumber(card.cardNumber)}
            >
              <View style={styles.cardAvatar}>
                <Text style={styles.avatarText}>
                  {card.name.charAt(0)}
                </Text>
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.cardName}>{card.name}</Text>
                <Text style={styles.cardNumber}>{card.cardNumber}</Text>
                <Text style={styles.cardBank}>{card.bank}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Форма перевода */}
        <View style={styles.transferSection}>
          <Text style={styles.sectionTitle}>Перевод</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Номер карты</Text>
            <TextInput
              value={cardNumber}
              onChangeText={onChangeCardNumber}
              keyboardType="numeric"
              style={styles.input}
              placeholder="0000 0000 0000 0000"
              maxLength={19}
            />
            {errors.cardNumber ? <Text style={styles.err}>{errors.cardNumber}</Text> : null}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Сумма перевода</Text>
            <View style={styles.amountContainer}>
              <TextInput
                value={amount}
                onChangeText={onChangeAmount}
                keyboardType="numeric"
                style={styles.amountInput}
                placeholder="0"
              />
              <Text style={styles.currencySymbol}>₽</Text>
            </View>
            {errors.amount ? <Text style={styles.err}>{errors.amount}</Text> : null}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Сообщение получателю</Text>
            <TextInput
              value={message}
              onChangeText={setMessage}
              style={styles.input}
              placeholder="Введите сообщение"
            />
          </View>

          <TouchableOpacity
            style={[
              styles.btn,
              !isFormValid && styles.btnDisabled
            ]}
            disabled={!isFormValid || isTransferring}
            onPress={onSend}
          >
            {isTransferring ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnText}>Перевести {amount ? parseFloat(amount).toFixed(2) + ' ₽' : ''}</Text>
            )}
          </TouchableOpacity>
        </View>
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
  accountSelector: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  accountChip: {
    backgroundColor: '#F7F7FB',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginRight: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    minWidth: 180,
  },
  accountChipSelected: {
    borderColor: '#6A2EE8',
    backgroundColor: '#F8F5FF',
  },
  accountChipName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  accountChipBalance: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
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
  closeText: {
    fontSize: 20,
    color: '#000'
  },
  headerSpacer: {
    width: 32
  },
  container: {
    flex: 1,
  },
  balanceSection: {
    backgroundColor: '#fff',
    padding: 20,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  balanceLabel: {
    fontSize: 16,
    color: '#666'
  },
  balanceAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000'
  },
  cardsSection: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    paddingVertical: 8
  },
  transferSection: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 20,
    borderRadius: 12,
    padding: 16
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  cardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0'
  },
  cardAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6A2EE8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  avatarText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16
  },
  cardInfo: {
    flex: 1
  },
  cardName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000'
  },
  cardNumber: {
    fontSize: 14,
    color: '#666',
    marginTop: 2
  },
  cardBank: {
    fontSize: 12,
    color: '#999',
    marginTop: 2
  },
  inputGroup: {
    marginBottom: 16
  },
  label: {
    fontSize: 16,
    color: '#000',
    marginBottom: 8,
    fontWeight: '500'
  },
  input: {
    backgroundColor: '#F7F7FB',
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5'
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F7FB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    paddingHorizontal: 16,
  },
  amountInput: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
  },
  currencySymbol: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
    marginLeft: 8,
  },
  btn: {
    backgroundColor: '#6A2EE8',
    padding: 18,
    alignItems: 'center',
    borderRadius: 12,
    marginTop: 8
  },
  btnDisabled: {
    backgroundColor: '#B9B6FF'
  },
  btnText: {
    fontWeight: '700',
    color: '#fff',
    fontSize: 16
  },
  err: {
    color: '#D23',
    marginTop: 6,
    fontSize: 14
  }
});