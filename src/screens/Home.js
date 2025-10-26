import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Image, RefreshControl } from 'react-native';
import { Ionicons, Feather, MaterialIcons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

export default function Home({navigation}){
  const fade = React.useRef(new Animated.Value(0)).current;
  const [refreshing, setRefreshing] = useState(false);

  const cards = [
    { 
      name: 'Black', 
      amount: '666 666,66 ₽', 
      design: require('../../assets/cards/black-card.png'),
      screen: 'CardDetail',
      number: '5536 91** **** 5678'
    },
    { 
      name: 'Платинум', 
      amount: '0 ₽', 
      design: require('../../assets/cards/platinum-card.png'),
      screen: 'PlatinumCard',
      number: '5536 91** **** 4321'
    },
  ];

  const quickActions = [
    { title: 'Перевод по номеру', icon: 'phone-portrait', nav: 'TransferPhone', color: '#159E3A' },
    { title: 'Пополнить', icon: 'download', nav: 'TopUp', color: '#FF6B6B' },
    { title: 'Перевести', icon: 'money-transfer', nav: 'TransfersScreen', color: '#6A2EE8' },
    { title: 'Оплатить', icon: 'qrcode-scan', nav: 'QRPay', color: '#FF6B6B' },
  ];

  const recentTransactions = [
    { id: 1, title: 'Кафе "Вкусно и точка"', amount: '-538 ₽', date: 'Сегодня', type: 'expense' },
    { id: 2, title: 'Пополнение от Петра', amount: '+8 700 ₽', date: 'Вчера', type: 'income' },
    { id: 3, title: 'Такси Яндекс', amount: '-320 ₽', date: '2 дня назад', type: 'expense' },
  ];

  React.useEffect(()=>{ 
    Animated.timing(fade,{toValue:1,duration:400,useNativeDriver:true}).start(); 
  },[]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

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
            <Text style={styles.avatarText}>ИИ</Text>
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
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationBadgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.container} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        
        {/* Total Balance Card */}
        <View style={styles.totalBalanceCard}>
          <View style={styles.balanceHeader}>
            <Text style={styles.balanceLabel}>Общий баланс</Text>
            <TouchableOpacity>
              <Ionicons name="eye-outline" size={20} color="#666" />
            </TouchableOpacity>
          </View>
          <Text style={styles.totalBalanceAmount}>682 132,82 ₽</Text>
          <View style={styles.balanceTrend}>
            <Ionicons name="trending-up" size={16} color="#159E3A" />
            <Text style={styles.trendText}>+5.2% за месяц</Text>
          </View>
        </View>

        {/* Monthly Spending Card */}
        <TouchableOpacity 
          style={styles.spendingCard}
          onPress={() => navigation.navigate('Operations')}
        >
          <View style={styles.spendingHeader}>
            <Text style={styles.spendingLabel}>Расходы в октябре</Text>
            <Text style={styles.spendingAmount}>15 634 ₽</Text>
          </View>
          
          {/* Spending Progress */}
          <View style={styles.spendingProgress}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '65%' }]} />
            </View>
            <Text style={styles.progressText}>65% от лимита</Text>
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
            <TouchableOpacity 
              style={styles.seeAllButton}
              onPress={() => navigation.navigate('CardsList')}
            >
              <Text style={styles.seeAllText}>Все</Text>
              <Ionicons name="chevron-forward" size={16} color="#6A2EE8" />
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
                style={styles.cardItem}
                onPress={() => handleCardPress(card)}
              >
                <Image 
                  source={card.design} 
                  style={styles.cardImage}
                  resizeMode="cover"
                />
                <View style={styles.cardOverlay}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardName}>{card.name}</Text>
                    <MaterialIcons name="more-vert" size={20} color="#fff" />
                  </View>
                  <Text style={styles.cardAmount}>{card.amount}</Text>
                  <Text style={styles.cardNumber}>{card.number}</Text>
                </View>
              </TouchableOpacity>
            ))}
            
            {/* Add Card Button */}
            <TouchableOpacity 
              style={styles.addCard}
              onPress={() => navigation.navigate('AddCard')}
            >
              <View style={styles.addCardIcon}>
                <Ionicons name="add" size={32} color="#6A2EE8" />
              </View>
              <Text style={styles.addCardText}>Добавить карту</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Recent Transactions */}
        <View style={styles.transactionsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Недавние операции</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Operations')}>
              <Text style={styles.seeAllText}>Все</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.transactionsList}>
            {recentTransactions.map((transaction) => (
              <TouchableOpacity 
                key={transaction.id} 
                style={styles.transactionItem}
              >
                <View style={styles.transactionLeft}>
                  <View style={[
                    styles.transactionIcon,
                    transaction.type === 'income' ? styles.incomeIcon : styles.expenseIcon
                  ]}>
                    <Ionicons 
                      name={transaction.type === 'income' ? "arrow-down" : "arrow-up"} 
                      size={20} 
                      color="#fff" 
                    />
                  </View>
                  <View style={styles.transactionInfo}>
                    <Text style={styles.transactionTitle}>{transaction.title}</Text>
                    <Text style={styles.transactionDate}>{transaction.date}</Text>
                  </View>
                </View>
                <Text style={[
                  styles.transactionAmount,
                  transaction.type === 'income' ? styles.incomeAmount : styles.expenseAmount
                ]}>
                  {transaction.amount}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Promo Banner */}
        <View style={styles.promoBanner}>
          <View style={styles.promoContent}>
            <Text style={styles.promoTitle}>Кэшбэк до 10%</Text>
            <Text style={styles.promoDescription}>На все покупки по картам этого месяца</Text>
            <TouchableOpacity style={styles.promoButton}>
              <Text style={styles.promoButtonText}>Подробнее</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.promoIcon}>
            <Ionicons name="gift" size={40} color="#fff" />
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
    fontWeight: '700',
    fontSize: 16,
  },
  greeting: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
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
    top: 8,
    right: 8,
    backgroundColor: '#FF3B30',
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadgeText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '700',
  },
  container: {
    flex: 1,
  },
  totalBalanceCard: {
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
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  balanceLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  totalBalanceAmount: {
    fontSize: 32,
    fontWeight: '800',
    color: '#000',
    marginBottom: 12,
  },
  balanceTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  trendText: {
    fontSize: 14,
    color: '#159E3A',
    fontWeight: '600',
  },
  spendingCard: {
    backgroundColor: '#fff',
    margin: 20,
    marginTop: 0,
    padding: 24,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  spendingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  spendingLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  spendingAmount: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FF3B30',
  },
  spendingProgress: {
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#F0F0F0',
    borderRadius: 3,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6A2EE8',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
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
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
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
    height: 160,
    borderRadius: 20,
    marginRight: 16,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  cardOverlay: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  cardAmount: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  cardNumber: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
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
  transactionsSection: {
    marginBottom: 24,
  },
  transactionsList: {
    paddingHorizontal: 20,
    gap: 12,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  incomeIcon: {
    backgroundColor: '#159E3A',
  },
  expenseIcon: {
    backgroundColor: '#FF3B30',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 14,
    color: '#666',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '700',
  },
  incomeAmount: {
    color: '#159E3A',
  },
  expenseAmount: {
    color: '#FF3B30',
  },
  promoBanner: {
    margin: 20,
    backgroundColor: '#6A2EE8',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  promoContent: {
    flex: 1,
  },
  promoTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 8,
  },
  promoDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 16,
  },
  promoButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  promoButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6A2EE8',
  },
  promoIcon: {
    marginLeft: 16,
  },
  bottomSpacer: {
    height: 20,
  },
});