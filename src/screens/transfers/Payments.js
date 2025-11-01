import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';

export default function Payments({ navigation }){
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const contacts = [
    { id: 1, name: 'Борис Иван', initial: 'Б', phone: '+7 (900) 123-45-67' },
    { id: 2, name: 'Руслан Диа', initial: 'Р', phone: '+7 (900) 123-45-68' },
    { id: 3, name: 'Му Angel♥', initial: 'М', phone: '+7 (900) 123-45-69' },
    { id: 4, name: 'Иван Соломин', initial: 'ИС', phone: '+7 (900) 123-45-60' },
    { id:5, name:'Korzik', initial:'K', phone:'+7 (902) 207-72-41' },
  ];

  const transferTypes = [
    { id: 1, title: 'Между', subtitle: 'счетами', screen: 'TransfersScreen' },
    { id: 2, title: 'По номеру', subtitle: 'телефона', screen: 'TransferPhone' },
    { id: 3, title: 'По номеру', subtitle: 'карты', screen: 'TransferCard' },
  ];

  // Форматирование номера телефона
  const formatPhoneNumber = (text) => {
    const clean = text.replace(/\D/g, '');
    
    if (clean.startsWith('7') || clean.startsWith('8')) {
      const numbers = clean.substring(1);
      let result = '+7 (';
      
      if (numbers.length > 0) {
        result += numbers.substring(0, 3);
      }
      if (numbers.length > 3) {
        result += ') ' + numbers.substring(3, 6);
      }
      if (numbers.length > 6) {
        result += '-' + numbers.substring(6, 8);
      }
      if (numbers.length > 8) {
        result += '-' + numbers.substring(8, 10);
      }
      return result;
    }
    
    return text;
  };

  // Валидация номера телефона
  const validatePhone = (phone) => {
    const cleanPhone = phone.replace(/\D/g, '');
    return cleanPhone.length === 11 && (cleanPhone.startsWith('7') || cleanPhone.startsWith('8'));
  };

  const handlePhoneChange = (text) => {
    const formatted = formatPhoneNumber(text);
    setPhoneNumber(formatted);
    
    if (text && !validatePhone(text)) {
      setPhoneError('Введите корректный номер телефона');
    } else {
      setPhoneError('');
    }
  };

  const handleContactPress = (contact) => {
    setPhoneNumber(contact.phone);
    setPhoneError('');
  };

  const handleTransferPress = (screen) => {
    if (screen === 'TransferPhone') {
      if (phoneNumber && validatePhone(phoneNumber)) {
        navigation.navigate(screen, { phone: phoneNumber });
      } else {
        navigation.navigate(screen);
      }
    } else {
      navigation.navigate(screen);
    }
  };

  const handlePhoneTransfer = () => {
    if (phoneNumber && validatePhone(phoneNumber)) {
      navigation.navigate('TransferPhone', { phone: phoneNumber });
    } else {
      setPhoneError('Введите корректный номер телефона');
    }
  };

  return (
    <View style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Платежи</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        {/* Phone Transfer Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Перевод по телефону</Text>
          <View style={styles.phoneTransferCard}>
            <View style={styles.phoneInputContainer}>
              <TextInput 
                placeholder="+7 (___) ___-__-__" 
                placeholderTextColor="#999"
                style={styles.phoneInput}
                value={phoneNumber}
                onChangeText={handlePhoneChange}
                keyboardType="phone-pad"
                onSubmitEditing={handlePhoneTransfer}
                returnKeyType="done"
              />
              <TouchableOpacity 
                style={[
                  styles.transferButton,
                  (!phoneNumber || !validatePhone(phoneNumber)) && styles.transferButtonDisabled
                ]}
                onPress={handlePhoneTransfer}
                disabled={!phoneNumber || !validatePhone(phoneNumber)}
              >
                <Text style={styles.transferButtonText}>Перевести</Text>
              </TouchableOpacity>
            </View>
            {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}
            
            <Text style={styles.contactsTitle}>Недавние контакты</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.contactsScroll}>
              {contacts.map((contact) => (
                <TouchableOpacity 
                  key={contact.id} 
                  style={styles.contactItem}
                  onPress={() => handleContactPress(contact)}
                >
                  <View style={styles.contactAvatar}>
                    <Text style={styles.contactInitial}>{contact.initial}</Text>
                  </View>
                  <Text style={styles.contactName} numberOfLines={1}>{contact.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* Transfers Section */}
        <View style={styles.section}>
          <View style={styles.transfersHeader}>
            <Text style={styles.sectionTitle}>Переводы</Text>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.transfersHorizontalScroll}
          >
            <View style={styles.transfersRow}>
              {transferTypes.map((type) => (
                <TouchableOpacity 
                  key={type.id} 
                  style={styles.transferType}
                  onPress={() => handleTransferPress(type.screen)}
                >
                  <View style={styles.transferIcon}>
                    <MaterialIcons name="compare-arrows" size={20} color="#fff" />
                  </View>
                  <Text style={styles.transferTitle}>{type.title}</Text>
                  <Text style={styles.transferSubtitle}>{type.subtitle}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#F8FAFD'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F5'
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  container: {
    flex: 1,
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 24
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16
  },
  phoneTransferCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F0F0F5'
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  phoneInput: {
    flex: 1,
    backgroundColor: '#F8FAFD',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    fontSize: 16,
    color: '#1A1A1A',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    fontWeight: '500'
  },
  transferButton: {
    backgroundColor: '#6A2EE8',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    minWidth: 100,
    shadowColor: '#6A2EE8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  transferButtonDisabled: {
    backgroundColor: '#C4B5FD',
    shadowOpacity: 0.1,
  },
  transferButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
    textAlign: 'center'
  },
  contactsTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666',
    marginTop: 20,
    marginBottom: 12
  },
  contactsScroll: {
    flexDirection: 'row',
  },
  contactItem: {
    alignItems: 'center',
    marginRight: 20,
    width: 64
  },
  contactAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6A2EE8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  contactInitial: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16
  },
  contactName: {
    fontSize: 13,
    color: '#1A1A1A',
    textAlign: 'center',
    fontWeight: '500'
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 13,
    marginBottom: 8,
    marginLeft: 4,
    fontWeight: '500'
  },
  transfersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  transfersHorizontalScroll: {
    marginHorizontal: -20,
  },
  transfersRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12
  },
  transferType: {
    width: 110,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F0F0F5'
  },
  transferIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#6A2EE8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#6A2EE8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  transferTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
    textAlign: 'center'
  },
  transferSubtitle: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    fontWeight: '500'
  },
  bottomSpacer: {
    height: 30
  }
});