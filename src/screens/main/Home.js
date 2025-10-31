import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Image, RefreshControl } from 'react-native';
import { Ionicons, Feather, MaterialIcons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

// Компоненты для логотипов партнёров с черным фоном
const AstraLogo = ({ width = 50, height = 50 }) => (
  <View style={[styles.logoContainer, { width, height }]}>
    <Text style={[styles.logoText, { fontSize: width * 0.3 }]}>Astra</Text>
  </View>
);

const YanimaLogo = ({ width = 50, height = 50 }) => (
  <View style={[styles.logoContainer, { width, height }]}>
    <Text style={[styles.logoText, { fontSize: width * 0.3 }]}>Yanima</Text>
  </View>
);

export default function Home({navigation}){
  const fade = React.useRef(new Animated.Value(0)).current;
  const [refreshing, setRefreshing] = useState(false);
  const [isBalanceHidden, setIsBalanceHidden] = useState(false);

  const cards = [
    { 
      name: 'Black', 
      amount: '666 666,66 ₽', 
      design: require('../../../assets/cards/black-card.png'),
      screen: 'CardDetail'
    },
    { 
      name: 'Платинум', 
      amount: '222 222 222 ₽', 
      design: require('../../../assets/cards/platinum-card.png'),
      screen: 'PlatinumCard'
    },
  ];

  const quickActions = [
    { title: 'Перевод по номеру', icon: 'phone-portrait', nav: 'TransferPhone', color: '#159E3A' },
    { title: 'Перевести', icon: 'money-transfer', nav: 'TransfersScreen', color: '#6A2EE8' },
  ];

  const partners = [
    { 
      id: 1, 
      name: 'Astra RP', 
      discount: 'Эксклюзивные бонусы', 
      description: 'GTA 5 RolePlay проект\nСпециальные условия для клиентов',
      logo: AstraLogo,
      screen: 'AstraDetail',
      color: '#FF0000',
      benefits: ['Игровая валюта', 'Премиум аккаунт', 'Эксклюзивный контент']
    },
    { 
      id: 2, 
      name: 'Yanima', 
      discount: 'Подписка в подарок', 
      description: 'Онлайн-просмотр аниме\nСпециальные предложения',
      logo: YanimaLogo,
      screen: 'YanimaDetail',
      color: '#6A2EE8',
      benefits: ['Премиум подписка', 'Ранний доступ', 'Эксклюзивные релизы']
    },
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

  const toggleBalanceVisibility = () => {
    setIsBalanceHidden(!isBalanceHidden);
  };

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

  const handlePartnerPress = (partner) => {
    navigation.navigate(partner.screen, { partner });
  };

  const PartnerLogo = ({ logo: LogoComponent, size = 60 }) => (
    <View style={[styles.partnerLogoContainer, { width: size, height: size }]}>
      <LogoComponent width={size - 10} height={size - 10} />
    </View>
  );

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
          onPress={() => navigation.navigate('Notifications1')}
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
            <TouchableOpacity onPress={toggleBalanceVisibility}>
              <Ionicons 
                name={isBalanceHidden ? "eye-off-outline" : "eye-outline"} 
                size={20} 
                color="#666" 
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.totalBalanceAmount}>
            {isBalanceHidden ? '•••••••' : '682 132,82 ₽'}
          </Text>
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
            <Text style={styles.spendingAmount}>
              {'15 634 ₽'}
            </Text>
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
                  <Text style={styles.cardAmount}>
                    {card.amount}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
            
            {/* Add Card Button */}
            <TouchableOpacity 
              style={styles.addCard}
              onPress={() => navigation.navigate('CardsList')}
            >
              <View style={styles.addCardIcon}>
                <Ionicons name="add" size={32} color="#6A2EE8" />
              </View>
              <Text style={styles.addCardText}>Добавить карту</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Our Partners Section */}
        <View style={styles.partnersSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Наши партнёры</Text>
            <TouchableOpacity 
              style={styles.seeAllButton}
              onPress={() => navigation.navigate('PartnersList')}
            >
              <Text style={styles.seeAllText}>Все</Text>
              <Ionicons name="chevron-forward" size={16} color="#6A2EE8" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.partnersGrid}>
            {partners.map((partner) => (
              <TouchableOpacity 
                key={partner.id}
                style={styles.partnerCard}
                onPress={() => handlePartnerPress(partner)}
              >
                <View style={styles.partnerHeader}>
                  <PartnerLogo logo={partner.logo} />
                  <View style={styles.partnerInfo}>
                    <Text style={styles.partnerName}>{partner.name}</Text>
                    <Text style={styles.partnerDiscount}>{partner.discount}</Text>
                  </View>
                </View>
                <Text style={styles.partnerDescription}>{partner.description}</Text>
                <View style={styles.partnerBenefits}>
                  {partner.benefits.map((benefit, index) => (
                    <View key={index} style={styles.benefitItem}>
                      <Ionicons name="checkmark-circle" size={16} color="#159E3A" />
                      <Text style={styles.benefitText}>{benefit}</Text>
                    </View>
                  ))}
                </View>
                <TouchableOpacity 
                  style={[styles.partnerButton, { backgroundColor: partner.color }]}
                  onPress={() => handlePartnerPress(partner)}
                >
                  <Text style={styles.partnerButtonText}>Узнать больше</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
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
    color: '#1A1A1A',
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
  logoContainer: {
    backgroundColor: '#000000',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  logoText: {
    color: '#fff',
    fontWeight: '700',
  },
  totalBalanceCard: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 24,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#F0F0F5'
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
    color: '#666',
  },
  totalBalanceAmount: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 12,
    letterSpacing: 0.5,
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
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#F0F0F5'
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
    color: '#666',
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
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
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
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1A1A1A',
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
    fontWeight: '600',
  },
  cardsScroll: {
    paddingHorizontal: 20,
  },
  cardItem: {
    width: 280,
    height: 160,
    borderRadius: 20,
    marginRight: 16,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
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
    marginBottom: 60,
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
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 2,
    borderColor: '#F0F0F5',
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
    fontWeight: '600',
    color: '#6A2EE8',
    textAlign: 'center',
  },
  partnersSection: {
    marginBottom: 24,
  },
  partnersGrid: {
    paddingHorizontal: 20,
    gap: 16,
  },
  partnerCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#F0F0F5'
  },
  partnerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  partnerLogoContainer: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  partnerInfo: {
    flex: 1,
  },
  partnerName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  partnerDiscount: {
    fontSize: 14,
    color: '#6A2EE8',
    fontWeight: '600',
  },
  partnerDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
    fontWeight: '500',
  },
  partnerBenefits: {
    marginBottom: 16,
    gap: 8,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  benefitText: {
    fontSize: 14,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  partnerButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  partnerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  bottomSpacer: {
    height: 30,
  },
});