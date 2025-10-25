import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { Ionicons, Feather, MaterialIcons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

export default function Home({navigation}){
  const fade = React.useRef(new Animated.Value(0)).current;
  
  React.useEffect(()=>{ 
    Animated.timing(fade,{toValue:1,duration:400,useNativeDriver:true}).start(); 
  },[]);

  const cards = [
    { name: 'Black', amount: '666 666,66 ₽', color: '#000', number: '5536 91** **** 5678', screen: 'CardDetail' },
    { name: 'Платинум', amount: '0 ₽', color: '#6A2EE8', number: '5536 91** **** 4321', screen: 'Pl' },
  ];

  const quickActions = [
    { title: 'Перевод по номеру', icon: 'phone-portrait', nav: 'TransferPhone', color: '#159E3A' },
    { title: 'Пополнить', icon: 'download', nav: 'TopUp', color: '#FF6B6B' },
    { title: 'Перевести', icon: 'money-transfer', nav: 'TransfersScreen', color: '#6A2EE8' },
    { title: 'Оплатить', icon: 'qrcode-scan', nav: 'QRPay', color: '#FF6B6B' },
  ];

  const getIcon = (iconName) => {
    switch(iconName) {
      case 'receipt': return <Ionicons name="receipt-outline" size={24} color="#fff"/>;
      case 'phone-portrait': return <Ionicons name="phone-portrait-outline" size={24} color="#fff"/>;
      case 'download': return <Ionicons name="download-outline" size={24} color="#fff"/>;
      case 'notifications': return <Ionicons name="notifications-outline" size={24} color="#fff"/>;
      case 'money-transfer': return <MaterialCommunityIcons name="bank-transfer" size={24} color="#fff" />;
      case 'qrcode-scan': return <MaterialCommunityIcons name="qrcode-scan" size={24} color="#fff" />;
      default: return <Feather name="circle" size={24} color="#fff"/>;
    }
  };

  const handleCardPress = (card) => {
    navigation.navigate(card.screen);
  };

  const handleProfilePress = () => {
    navigation.navigate('More');
  };

  return (
    <View style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerLeft} onPress={handleProfilePress}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>И</Text>
          </View>
          <View>
            <Text style={styles.greeting}>Добро пожаловать</Text>
            <Text style={styles.userName}>Иван</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.notificationButton}
          onPress={() => navigation.navigate('Notifications')}
        >
          <Ionicons name="notifications-outline" size={24} color="#000" />
          <View style={styles.notificationBadge} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Balance Overview - Changed to All Expenses */}
        <TouchableOpacity 
          style={styles.balanceCard}
          onPress={() => navigation.navigate('Operations')}
        >
          <Text style={styles.balanceLabel}>Все расходы</Text>
          <View style={styles.balanceDetails}>
            <View style={styles.balanceItem}>
              <Text style={styles.balanceItemLabel}>Траты в октябре</Text>
              <Text style={[styles.balanceItemValue, styles.expenseValue]}>15 634 521 ₽</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Быстрые действия</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity 
                key={index}
                style={styles.quickAction}
                onPress={() => navigation.navigate(action.nav)}
              >
                <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
                  {getIcon(action.icon)}
                </View>
                <Text style={styles.actionText}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Cards Section */}
        <View style={styles.cardsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Мои карты</Text>
            <TouchableOpacity onPress={() => navigation.navigate('CardsList')}>
              <Text style={styles.seeAllText}>Все</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.cardsScroll}
          >
            {cards.map((card, index) => (
              <TouchableOpacity 
                key={index}
                style={[styles.cardItem, { backgroundColor: card.color }]}
                onPress={() => handleCardPress(card)}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.cardName}>{card.name}</Text>
                  <MaterialIcons name="more-vert" size={20} color="#fff" />
                </View>
                <Text style={styles.cardAmount}>{card.amount}</Text>
                <Text style={styles.cardNumber}>{card.number}</Text>
                <View style={styles.cardFooter}>
                  <Text style={styles.cardHolder}>IVAN I</Text>
                  <View style={styles.cardChip}>
                    <MaterialIcons name="sim-card" size={20} color="rgba(255,255,255,0.7)" />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
            
            {/* Add Card Button */}
            <TouchableOpacity style={styles.addCard}>
              <View style={styles.addCardIcon}>
                <Ionicons name="add" size={32} color="#6A2EE8" />
              </View>
              <Text style={styles.addCardText}>Добавить карту</Text>
            </TouchableOpacity>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5'
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#6A2EE8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 18,
  },
  greeting: {
    fontSize: 12,
    color: '#666',
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  notificationButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF3B30',
  },
  container: {
    flex: 1,
  },
  balanceCard: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 24,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000',
    marginBottom: 20,
  },
  balanceDetails: {
    flexDirection: 'row',
    justifyContent: 'flex-start', // Выравнивание по правому краю
  },
  balanceItem: {
    alignItems: 'flex-start', // Текст также по правому краю
  },
  balanceItemLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  balanceItemValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  expenseValue: {
    color: '#FF3B30',
  },
  quickActionsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
  },
  quickAction: {
    flex: 1,
    alignItems: 'center',
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#000',
    textAlign: 'center',
  },
  cardsSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    color: '#6A2EE8',
    fontWeight: '500',
  },
  cardsScroll: {
    paddingHorizontal: 16,
  },
  cardItem: {
    width: 280,
    padding: 20,
    borderRadius: 20,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cardAmount: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
  },
  cardNumber: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 1,
    marginBottom: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardHolder: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontWeight: '500',
  },
  cardChip: {
    opacity: 0.7,
  },
  addCard: {
    width: 160,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: '#F0F0F0',
    borderStyle: 'dashed',
  },
  addCardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0EBFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  addCardText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6A2EE8',
    textAlign: 'center',
  },
  bottomSpacer: {
    height: 20,
  },
});