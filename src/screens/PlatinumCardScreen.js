import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Feather, MaterialIcons, Ionicons } from '@expo/vector-icons';

const operations = [
  {id:'1', title:'Кафе "Вкусно и точка"', amount:'-538 ₽', date:'14 сент', type: 'expense'},
  {id:'2', title:'Пополнение от Петра', amount:'+8 700 ₽', date:'13 сент', type: 'income'},
  {id:'3', title:'Такси Яндекс', amount:'-320 ₽', date:'12 сент', type: 'expense'},
  {id:'4', title:'Аптека', amount:'-1 240 ₽', date:'11 сент', type: 'expense'},
  {id:'5', title:'Супермаркет', amount:'-2 150 ₽', date:'10 сент', type: 'expense'},
];

export default function PlatinumCardScreen({navigation}){
  const [showCardDetails, setShowCardDetails] = useState(false);

  const cardData = {
    number: '5536 9140 8765 4321',
    expiry: '09/27',
    holder: 'ИВАН И',
    cvv: '456',
    system: 'Visa',
    type: 'Credit'
  };

  const toggleCardDetails = () => {
    setShowCardDetails(!showCardDetails);
  };

  const getMaskedNumber = () => {
    if (showCardDetails) {
      return cardData.number;
    }
    return '5536 91** **** 4321';
  };

  const getMaskedCVV = () => {
    if (showCardDetails) {
      return cardData.cvv;
    }
    return '***';
  };

  return (
    <View style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
          <Feather name="x" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Платинум</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Card Info */}
        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}># Платинум</Text>
            <Text style={styles.cardAmount}>0 ₽</Text>
            
            {/* Номер карты на самой карте */}
            <View style={styles.cardNumberContainer}>
              <Text style={styles.cardNumber}>5536 91** **** 4321</Text>
            </View>
            
            <View style={styles.cardDetails}>
              <Text style={styles.cardExpiry}>09/27</Text>
              <Text style={styles.cardSystem}>Visa</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickAction}>
            <View style={styles.actionIcon}>
              <MaterialIcons name="payment" size={24} color="#6A2EE8" />
            </View>
            <Text style={styles.actionText}>Оплатить</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickAction}>
            <View style={styles.actionIcon}>
              <Feather name="plus" size={24} color="#6A2EE8" />
            </View>
            <Text style={styles.actionText}>Пополнить</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickAction}>
            <View style={styles.actionIcon}>
              <MaterialIcons name="compare-arrows" size={24} color="#6A2EE8" />
            </View>
            <Text style={styles.actionText}>Перевести</Text>
          </TouchableOpacity>
        </View>

        {/* Operations Section */}
        <View style={styles.operationsSection}>
          <TouchableOpacity onPress={() => navigation.navigate('Operations')}>
            <Text style={styles.sectionTitle}>Операции по счету</Text>
          </TouchableOpacity>
          
          {/* Monthly Expenses */}
          <TouchableOpacity onPress={() => navigation.navigate('Operations')}>
            <View style={styles.expensesCard}>
              <Text style={styles.expensesLabel}>Трат в сентябре</Text>
              <Text style={styles.expensesAmount}>0 ₽</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Card Details Section */}
        <View style={styles.cardInfoSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Информация о карте</Text>
            <TouchableOpacity style={styles.toggleButton} onPress={toggleCardDetails}>
              <Ionicons 
                name={showCardDetails ? "eye-off-outline" : "eye-outline"} 
                size={20} 
                color="#6A2EE8" 
              />
              <Text style={styles.toggleButtonText}>
                {showCardDetails ? 'Скрыть' : 'Показать'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.cardInfoCard}>
            <View style={styles.cardInfoRow}>
              <Text style={styles.cardInfoLabel}>Номер карты</Text>
              <Text style={styles.cardInfoValue}>{getMaskedNumber()}</Text>
            </View>
            
            <View style={styles.cardInfoRow}>
              <Text style={styles.cardInfoLabel}>Срок действия</Text>
              <Text style={styles.cardInfoValue}>{cardData.expiry}</Text>
            </View>
            
            <View style={styles.cardInfoRow}>
              <Text style={styles.cardInfoLabel}>Держатель карты</Text>
              <Text style={styles.cardInfoValue}>{cardData.holder}</Text>
            </View>
            
            <View style={styles.cardInfoRow}>
              <Text style={styles.cardInfoLabel}>CVV/CVC</Text>
              <Text style={styles.cardInfoValue}>{getMaskedCVV()}</Text>
            </View>
            
            <View style={styles.cardInfoRow}>
              <Text style={styles.cardInfoLabel}>Платежная система</Text>
              <Text style={styles.cardInfoValue}>{cardData.system}</Text>
            </View>
            
            <View style={styles.cardInfoRow}>
              <Text style={styles.cardInfoLabel}>Тип карты</Text>
              <Text style={styles.cardInfoValue}>{cardData.type}</Text>
            </View>
          </View>
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
  },
  cardContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: '#6A2EE8',
    padding: 24,
    borderRadius: 20,
    shadowColor: '#6A2EE8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8
  },
  cardAmount: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 20
  },
  cardNumberContainer: {
    marginBottom: 20,
  },
  cardNumber: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 2,
    textAlign: 'center'
  },
  cardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  cardExpiry: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500'
  },
  cardSystem: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500'
  },
  // Card Info Section
  cardInfoSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000'
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  toggleButtonText: {
    fontSize: 14,
    color: '#6A2EE8',
    fontWeight: '500'
  },
  cardInfoCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0'
  },
  cardInfoLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500'
  },
  cardInfoValue: {
    fontSize: 16,
    color: '#000',
    fontWeight: '600'
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 24,
    gap: 12
  },
  quickAction: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0EBFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    textAlign: 'center'
  },
  operationsSection: {
    paddingHorizontal: 16,
  },
  expensesCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  expensesLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8
  },
  expensesAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000'
  },
  bottomSpacer: {
    height: 20
  }
});