import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';

export default function Notifications({ navigation }) {
  const [notifications, setNotifications] = useState({
    transactions: true,
    security: true,
    promotions: false,
    news: false,
    system: true
  });

  const notificationList = [
    {
      id: 1,
      title: 'Поступление средств',
      message: 'На ваш счет поступил перевод от Алексея Петрова',
      time: '2 минуты назад',
      type: 'transaction',
      read: false
    },
    {
      id: 2,
      title: 'Завершена операция',
      message: 'Оплата в кофейне "Бодрость" на 350 ₽',
      time: '1 час назад',
      type: 'transaction',
      read: true
    },
    {
      id: 3,
      title: 'Вход в приложение',
      message: 'Выполнен вход с нового устройства',
      time: 'Сегодня, 10:30',
      type: 'security',
      read: true
    },
    {
      id: 4,
      title: 'Специальное предложение',
      message: 'Кэшбэк 10% в ресторанах-партнерах',
      time: 'Вчера',
      type: 'promotion',
      read: true
    }
  ];

  const toggleNotification = (type) => {
    setNotifications(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'transaction':
        return { icon: 'cash-outline', color: '#159E3A' };
      case 'security':
        return { icon: 'shield-checkmark-outline', color: '#FFA726' };
      case 'promotion':
        return { icon: 'gift-outline', color: '#FF6B6B' };
      case 'news':
        return { icon: 'megaphone-outline', color: '#6A2EE8' };
      default:
        return { icon: 'notifications-outline', color: '#666' };
    }
  };

  const markAllAsRead = () => {
    // Логика отметки всех как прочитанных
  };

  return (
    <View style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Уведомления</Text>
        <TouchableOpacity onPress={markAllAsRead}>
          <Text style={styles.markReadText}>Прочитать все</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        {/* Notifications List */}
        <View style={styles.notificationsSection}>
          <Text style={styles.sectionTitle}>Последние уведомления</Text>
          
          {notificationList.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="notifications-off-outline" size={48} color="#999" />
              <Text style={styles.emptyStateTitle}>Уведомлений нет</Text>
              <Text style={styles.emptyStateText}>
                Здесь будут появляться ваши уведомления
              </Text>
            </View>
          ) : (
            <View style={styles.notificationsList}>
              {notificationList.map((notification) => {
                const { icon, color } = getNotificationIcon(notification.type);
                
                return (
                  <TouchableOpacity
                    key={notification.id}
                    style={[
                      styles.notificationItem,
                      !notification.read && styles.notificationItemUnread
                    ]}
                  >
                    <View style={[styles.notificationIcon, { backgroundColor: color + '20' }]}>
                      <Ionicons name={icon} size={20} color={color} />
                    </View>
                    <View style={styles.notificationContent}>
                      <Text style={styles.notificationTitle}>{notification.title}</Text>
                      <Text style={styles.notificationMessage}>{notification.message}</Text>
                      <Text style={styles.notificationTime}>{notification.time}</Text>
                    </View>
                    {!notification.read && <View style={styles.unreadDot} />}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
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
  markReadText: {
    fontSize: 14,
    color: '#6A2EE8',
    fontWeight: '500'
  },
  container: {
    flex: 1,
  },
  settingsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  settingsCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  settingTexts: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    color: '#666',
  },
  notificationsSection: {
    marginBottom: 24,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 16,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginTop: 12,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  notificationsList: {
    paddingHorizontal: 16,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    position: 'relative',
  },
  notificationItemUnread: {
    backgroundColor: '#F8F5FF',
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    lineHeight: 18,
  },
  notificationTime: {
    fontSize: 12,
    color: '#999',
  },
  unreadDot: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6A2EE8',
  },
  bottomSpacer: {
    height: 20,
  },
});