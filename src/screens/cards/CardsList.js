import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';

export default function CardsList({ navigation }) {
  const cards = [
    {
      id: 1,
      name: 'Black',
      number: '5536 91** **** 5678',
      balance: '27 466,16 ₽',
      currency: 'RUB',
      type: 'debit',
      color: '#000',
      system: 'Mastercard',
      expiry: '12/26'
    },
    {
      id: 2,
      name: 'Платинум',
      number: '5536 91** **** 4321',
      balance: '0 ₽',
      currency: 'RUB',
      type: 'credit',
      color: '#6A2EE8',
      system: 'Visa',
      expiry: '09/27'
    }
  ];

  const getCardScreen = (cardName) => {
    return cardName === 'Black' ? 'CardDetail' : 'PlatinumCard';
  };

  const getCardTypeText = (type) => {
    return type === 'debit' ? 'Дебетовая' : 'Кредитная';
  };

  return (
    <View style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Мои карты</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Total Balance */}
        <View style={styles.totalBalance}>
          <Text style={styles.totalLabel}>Общий баланс</Text>
          <Text style={styles.totalAmount}>27 466,16 ₽</Text>
        </View>

        {/* Cards List */}
        <View style={styles.cardsSection}>
          <Text style={styles.sectionTitle}>Активные карты</Text>
          
          {cards.map((card) => (
            <TouchableOpacity
              key={card.id}
              style={styles.cardItem}
              onPress={() => navigation.navigate(getCardScreen(card.name))}
            >
              <View style={styles.cardHeader}>
                <View style={[styles.cardColor, { backgroundColor: card.color }]} />
                <View style={styles.cardInfo}>
                  <Text style={styles.cardName}>{card.name}</Text>
                  <Text style={styles.cardNumber}>{card.number}</Text>
                  <View style={styles.cardDetails}>
                    <Text style={styles.cardType}>{getCardTypeText(card.type)}</Text>
                    <Text style={styles.cardSystem}>{card.system}</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.cardBalance}>
                <Text style={styles.balanceAmount}>{card.balance}</Text>
                <Text style={styles.currency}>{card.currency}</Text>
              </View>
            </TouchableOpacity>
          ))}
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
  totalBalance: {
    backgroundColor: '#667eea',
    margin: 20,
    padding: 24,
    borderRadius: 20,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  totalLabel: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 6,
    fontWeight: '500',
  },
  totalAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
  cardsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  cardItem: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F0F0F5'
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cardColor: {
    width: 44,
    height: 44,
    borderRadius: 12,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardInfo: {
    flex: 1,
  },
  cardName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  cardNumber: {
    fontSize: 15,
    color: '#666',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  cardDetails: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  cardType: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6A2EE8',
    backgroundColor: '#F0EBFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  cardSystem: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
  cardBalance: {
    alignItems: 'flex-end',
  },
  balanceAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  currency: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  bottomSpacer: {
    height: 30,
  },
});