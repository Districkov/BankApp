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
    return cardName === 'Black' ? 'CardDetail' : 'Pl';
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
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={24} color="#6A2EE8" />
        </TouchableOpacity>
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

              <View style={styles.cardActions}>
                <TouchableOpacity style={styles.cardAction}>
                  <Ionicons name="eye-outline" size={18} color="#666" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.cardAction}>
                  <Ionicons name="ellipsis-vertical" size={18} color="#666" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Add Card Button */}
        <TouchableOpacity style={styles.addCardButton}>
          <View style={styles.addCardIcon}>
            <Ionicons name="add" size={24} color="#6A2EE8" />
          </View>
          <Text style={styles.addCardText}>Добавить карту</Text>
        </TouchableOpacity>

        {/* Archived Cards */}
        <View style={styles.archivedSection}>
          <Text style={styles.sectionTitle}>Архивные карты</Text>
          
          <View style={styles.archivedCard}>
            <Ionicons name="card-outline" size={24} color="#999" />
            <Text style={styles.archivedText}>Нет архивных карт</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Управление картами</Text>
          
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionItem}>
              <View style={styles.actionIcon}>
                <Ionicons name="lock-closed-outline" size={20} color="#6A2EE8" />
              </View>
              <Text style={styles.actionText}>Блокировка</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionItem}>
              <View style={styles.actionIcon}>
                <Ionicons name="settings-outline" size={20} color="#6A2EE8" />
              </View>
              <Text style={styles.actionText}>Настройки</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionItem}>
              <View style={styles.actionIcon}>
                <Ionicons name="download-outline" size={20} color="#6A2EE8" />
              </View>
              <Text style={styles.actionText}>Выписки</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionItem}>
              <View style={styles.actionIcon}>
                <Ionicons name="help-circle-outline" size={20} color="#6A2EE8" />
              </View>
              <Text style={styles.actionText}>Помощь</Text>
            </TouchableOpacity>
          </View>
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
  addButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: {
    flex: 1,
  },
  totalBalance: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  totalLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  totalAmount: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
  },
  cardsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  cardItem: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cardColor: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  cardName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  cardNumber: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  cardDetails: {
    flexDirection: 'row',
    gap: 8,
  },
  cardType: {
    fontSize: 12,
    color: '#999',
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  cardSystem: {
    fontSize: 12,
    color: '#999',
  },
  cardBalance: {
    alignItems: 'flex-end',
    marginRight: 12,
  },
  balanceAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: 2,
  },
  currency: {
    fontSize: 12,
    color: '#666',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  cardAction: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: '#F7F7FB',
  },
  addCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 24,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addCardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0EBFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  addCardText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6A2EE8',
  },
  archivedSection: {
    marginBottom: 24,
  },
  archivedCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  archivedText: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  quickActions: {
    marginBottom: 24,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
  },
  actionItem: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0EBFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    textAlign: 'center',
  },
  bottomSpacer: {
    height: 20,
  },
});