import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';

export default function More({ navigation }) {
  
  const handleLogout = () => {
    Alert.alert(
      'Выход',
      'Вы уверены, что хотите выйти?',
      [
        { text: 'Отмена', style: 'cancel' },
        { text: 'Выйти', style: 'destructive', onPress: () => console.log('Logout pressed') }
      ]
    );
  };

  const menuSections = [
    {
      title: 'Аккаунт',
      items: [
        {
          icon: 'person-outline',
          title: 'Профиль',
          description: 'Личные данные и настройки',
          color: '#6A2EE8',
          screen: 'Settings'
        },
        {
          icon: 'card-outline',
          title: 'Мои карты',
          description: 'Управление картами и счетами',
          color: '#FF6B6B',
          screen: 'CardsList'
        },
        {
          icon: 'document-text-outline',
          title: 'История операций',
          description: 'Все транзакции и выписки',
          color: '#4ECDC4',
          screen: 'TransactionHistory'
        }
      ]
    },
    {
      title: 'Безопасность',
      items: [
        {
          icon: 'notifications-outline',
          title: 'Уведомления',
          description: 'Настройка оповещений',
          color: '#96CEB4',
          screen: 'Notifications'
        }
      ]
    },
    {
      title: 'Помощь',
      items: [
        {
          icon: 'help-circle-outline',
          title: 'Помощь',
          description: 'Частые вопросы и поддержка',
          color: '#AB47BC',
          screen: 'Support'
        }
      ]
    }
  ];

  return (
    <View style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ещё</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Feather name="search" size={20} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Profile Card */}
        <View style={styles.profileSection}>
          <TouchableOpacity 
            style={styles.profileCard}
            onPress={() => navigation.navigate('Settings')}
          >
            <View style={styles.profileHeader}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>И</Text>
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>Иван</Text>
                <View style={styles.profileBadge}>
                  <Ionicons name="diamond" size={12} color="#fff" />
                  <Text style={styles.profileBadgeText}>PRO</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.contactInfo}>
              <View style={styles.contactItem}>
                <Feather name="phone" size={16} color="#666" />
                <Text style={styles.contactText}>+7 926 718-55-52</Text>
              </View>
              
              <View style={styles.contactItem}>
                <Feather name="mail" size={16} color="#666" />
                <Text style={styles.contactText}>ert34vh@gmail.com</Text>
              </View>
            </View>
            
            <View style={styles.profileFooter}>
              <Text style={styles.balanceLabel}>Общий баланс</Text>
              <Text style={styles.balanceAmount}>27 466,16 ₽</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Menu Sections */}
        {menuSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.menuSection}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.menuCards}>
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity 
                  key={itemIndex}
                  style={styles.menuItem}
                  onPress={() => item.screen ? navigation.navigate(item.screen) : Alert.alert('В разработке')}
                >
                  <View style={[styles.menuIcon, { backgroundColor: item.color }]}>
                    <Ionicons name={item.icon} size={20} color="#fff" />
                  </View>
                  <View style={styles.menuContent}>
                    <Text style={styles.menuItemTitle}>{item.title}</Text>
                    <Text style={styles.menuItemDesc}>{item.description}</Text>
                  </View>
                  <Feather name="chevron-right" size={18} color="#999" />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Logout Button */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <View style={[styles.logoutIcon, { backgroundColor: '#FFE8E8' }]}>
            <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
          </View>
          <Text style={styles.logoutText}>Выйти</Text>
        </TouchableOpacity>

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
  profileSection: {
    padding: 16,
  },
  profileCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#6A2EE8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginBottom: 6,
  },
  profileBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6A2EE8',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    gap: 4,
  },
  profileBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  contactInfo: {
    gap: 8,
    marginBottom: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  contactText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  profileFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0'
  },
  balanceLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500'
  },
  balanceAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000'
  },
  menuSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  menuCards: {
    paddingHorizontal: 16,
    gap: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuContent: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  menuItemDesc: {
    fontSize: 12,
    color: '#666',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 8,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  logoutIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
  },
  bottomSpacer: {
    height: 20,
  },
});