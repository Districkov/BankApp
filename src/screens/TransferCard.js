import React, {useState} from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';

export default function TransferCard({navigation}){
  const [cardNumber, setCardNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  const userBalance = 22717.98;

  const recentCards = [
    { id: 1, name: 'Алексей Петров', cardNumber: '5536 9140 8765 4321', bank: 'Тинькофф' },
    { id: 2, name: 'Мария Иванова', cardNumber: '4111 1111 1111 1111', bank: 'Сбербанк' },
  ];

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

  // В TransferPhone.js и TransferCard.js замените функцию onSend:
function onSend(){
  const e = {};
  if(!validatePhone(phone)) e.phone = 'Неверный номер';
  if(!validateAmount(amount)) e.amount = 'Введите сумму > 0';
  setErrors(e);
  if(Object.keys(e).length===0){
    // Вместо Alert переходим на SuccessScreen
    navigation.navigate('Success', { 
      amount: parseFloat(amount).toFixed(2), 
      type: 'Перевод' 
    });
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
    return !isNaN(num) && num > 0 && num <= userBalance;
  }

  const isFormValid = validateCardNumber(cardNumber) && validateAmount(amount);

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
        {/* Баланс */}
        <View style={styles.balanceSection}>
          <Text style={styles.balanceLabel}>с Black</Text>
          <Text style={styles.balanceAmount}>22 717,98 ₽</Text>
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
            disabled={!isFormValid} 
            onPress={onSend}
          >
            <Text style={styles.btnText}>Перевести {amount ? parseFloat(amount).toFixed(2) + ' ₽' : ''}</Text>
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