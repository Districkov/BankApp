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
  ];

  const transferTypes = [
    { id: 1, title: 'Между', subtitle: 'счетами', screen: 'TransfersScreen' },
    { id: 2, title: 'По номеру', subtitle: 'телефона', screen: 'TransferPhone' },
    { id: 3, title: 'По номеру', subtitle: 'карты', screen: 'TransferCard' },
    { id: 4, title: 'В другой', subtitle: 'банк', screen: 'TransferBank' },
    { id: 5, title: 'По QR', subtitle: 'коду', screen: 'QRPay' },
    { id: 6, title: 'На карту', subtitle: 'Tinkoff', screen: 'TransferTinkoff' },
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
    if (screen === 'TransferPhone' && phoneNumber && validatePhone(phoneNumber)) {
      navigation.navigate(screen, { phone: phoneNumber });
    } else {
      navigation.navigate(screen);
    }
  };

  const handleSearchSubmit = () => {
    if (phoneNumber && validatePhone(phoneNumber)) {
      navigation.navigate('TransferPhone', { phone: phoneNumber });
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
        <Text style={styles.headerTitle}>Платежи</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Feather name="search" size={20} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Search Input */}
        <View style={styles.searchContainer}>
          <Feather name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput 
            placeholder="Поиск услуг и переводов" 
            placeholderTextColor="#666"
            style={styles.searchInput} 
          />
        </View>

        {/* Favorites Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Избранное</Text>
          <View style={styles.favoritesGrid}>
            <TouchableOpacity 
              style={styles.favoriteItem}
              onPress={() => navigation.navigate('MyPhone')}
            >
              <View style={[styles.favoriteIcon, { backgroundColor: '#E8F5E8' }]}>
                <Ionicons name="phone-portrait-outline" size={24} color="#16A34A"/>
              </View>
              <Text style={styles.favoriteText}>Мой телефон</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.favoriteItem}
              onPress={() => navigation.navigate('AddFavorite')}
            >
              <View style={[styles.favoriteIcon, { backgroundColor: '#F0EBFF' }]}>
                <Ionicons name="add-circle-outline" size={24} color="#6A2EE8"/>
              </View>
              <Text style={[styles.favoriteText, { color: '#6A2EE8' }]}>Добавить</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => navigation.navigate('PaymentsList')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: '#F0EBFF' }]}>
              <Ionicons name="document-text-outline" size={20} color="#6A2EE8"/>
            </View>
            <Text style={styles.quickActionText}>На оплату</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => navigation.navigate('QRPay')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: '#F0EBFF' }]}>
              <Ionicons name="qr-code-outline" size={20} color="#6A2EE8"/>
            </View>
            <Text style={styles.quickActionText}>Сканировать</Text>
          </TouchableOpacity>
        </View>

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
            <TouchableOpacity onPress={() => navigation.navigate('AllTransfers')}>
              <Text style={styles.allButton}>Все</Text>
            </TouchableOpacity>
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
  searchButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5'
  },
  searchIcon: {
    marginRight: 8
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: '#000'
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 20
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12
  },
  favoritesGrid: {
    flexDirection: 'row',
    gap: 12
  },
  favoriteItem: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  favoriteIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8
  },
  favoriteText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    textAlign: 'center'
  },
  quickActions: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 20,
    gap: 12
  },
  quickAction: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    textAlign: 'center'
  },
  phoneTransferCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  phoneInput: {
    flex: 1,
    backgroundColor: '#F7F7FB',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 10,
    fontSize: 16,
    color: '#000',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5'
  },
  transferButton: {
    backgroundColor: '#6A2EE8',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 10,
    minWidth: 100
  },
  transferButtonDisabled: {
    backgroundColor: '#B9B6FF'
  },
  transferButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center'
  },
  contactsTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginTop: 16,
    marginBottom: 12
  },
  contactsScroll: {
    flexDirection: 'row',
  },
  contactItem: {
    alignItems: 'center',
    marginRight: 16,
    width: 60
  },
  contactAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#6A2EE8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6
  },
  contactInitial: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16
  },
  contactName: {
    fontSize: 12,
    color: '#000',
    textAlign: 'center'
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 4
  },
  transfersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  allButton: {
    fontSize: 14,
    color: '#6A2EE8',
    fontWeight: '500'
  },
  transfersHorizontalScroll: {
    marginHorizontal: -16,
  },
  transfersRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12
  },
  transferType: {
    width: 100,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  transferIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6A2EE8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8
  },
  transferTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
    textAlign: 'center'
  },
  transferSubtitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center'
  },
  bottomSpacer: {
    height: 20
  }
});