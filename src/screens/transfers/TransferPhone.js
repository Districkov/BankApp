import React, {useState, useEffect} from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';

export default function TransferPhone({navigation, route}){
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  const userBalance = 22717.98;

  // Контакты из Payments.js для поиска имени по номеру
  const allContacts = [
    { id: 1, name: 'Борис Иван', phone: '+7 (900) 123-45-67', initial: 'Б' },
    { id: 2, name: 'Руслан Диа', phone: '+7 (900) 123-45-68', initial: 'Р' },
    { id: 3, name: 'Му Angel♥', phone: '+7 (900) 123-45-69', initial: 'М' },
    { id: 4, name: 'Иван Соломин', phone: '+7 (900) 123-45-60', initial: 'ИС' },
    { id: 5, name: 'Когzik', phone: '+7 (902) 207-72-41', initial: 'К' },
  ];

  // Находим контакт по номеру телефона
  const findContactByPhone = (phoneNumber) => {
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    return allContacts.find(contact => {
      const cleanContactPhone = contact.phone.replace(/\D/g, '');
      return cleanContactPhone === cleanPhone;
    });
  };

  // Получаем контакт для отображения
  const getContactToDisplay = () => {
    if (!phone) return [];
    
    const foundContact = findContactByPhone(phone);
    if (foundContact) {
      return [foundContact];
    }
    
    // Если контакт не найден в списке, создаем временный контакт
    return [{
      id: 0,
      name: 'Новый контакт',
      phone: phone,
      initial: phone.replace(/\D/g, '').charAt(0) || '?'
    }];
  };

  const contactsToDisplay = getContactToDisplay();

  // Эффект для установки номера телефона из параметров
  useEffect(() => {
    if (route.params?.phone) {
      setPhone(route.params.phone);
    }
  }, [route.params?.phone]);

  function onChangePhone(text){
    const v = formatPhone(text);
    setPhone(v);
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

  function formatPhone(text) {
    let cleaned = text.replace(/\D/g, '');
    if (cleaned.startsWith('7') || cleaned.startsWith('8')) {
      cleaned = cleaned.substring(1);
    }
    if (cleaned.length > 0) {
      return `+7 ${cleaned.substring(0, 3)} ${cleaned.substring(3, 6)}-${cleaned.substring(6, 8)}-${cleaned.substring(8, 10)}`;
    }
    return text;
  }

  function validatePhone(phone) {
    return phone.replace(/\D/g, '').length === 11;
  }

  function validateAmount(amount) {
    const num = parseFloat(amount);
    return !isNaN(num) && num > 0 && num <= userBalance;
  }

  const isFormValid = validatePhone(phone) && validateAmount(amount);

  return (
    <View style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>По номеру телефона</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.container}>
        {/* Баланс */}
        <View style={styles.balanceSection}>
          <Text style={styles.balanceLabel}>с Black</Text>
          <Text style={styles.balanceAmount}>22 717,98 ₽</Text>
        </View>

        {/* Контакты - отображаем только соответствующий номеру */}
        {phone && (
          <View style={styles.contactsSection}>
            <Text style={styles.sectionTitle}>Контакт</Text>
            {contactsToDisplay.map((contact) => (
              <TouchableOpacity 
                key={contact.id} 
                style={styles.contactItem}
                onPress={() => setPhone(contact.phone)}
              >
                <View style={styles.contactAvatar}>
                  <Text style={styles.avatarText}>
                    {contact.initial}
                  </Text>
                </View>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactName}>{contact.name}</Text>
                  <Text style={styles.contactPhone}>{contact.phone}</Text>
                </View>
                <Text style={styles.contactBank}></Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Форма перевода */}
        <View style={styles.transferSection}>
          <Text style={styles.sectionTitle}>Перевод</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Номер телефона</Text>
            <TextInput 
              value={phone} 
              onChangeText={onChangePhone} 
              keyboardType="phone-pad" 
              style={styles.input} 
              placeholder="+7 (___) ___-__-__" 
            />
            {errors.phone ? <Text style={styles.err}>{errors.phone}</Text> : null}
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
  contactsSection: {
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
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0'
  },
  contactAvatar: {
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
  contactInfo: {
    flex: 1
  },
  contactName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000'
  },
  contactPhone: {
    fontSize: 14,
    color: '#666',
    marginTop: 2
  },
  contactBank: {
    fontSize: 14,
    color: '#666'
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