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

  const toggleNotification = (type) => {
    setNotifications(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  return (
    <View style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Уведомления</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Settings Section */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Настройки уведомлений</Text>
          
          <View style={styles.settingsCard}>
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: '#E8F5E8' }]}>
                  <Ionicons name="cash-outline" size={20} color="#159E3A" />
                </View>
                <View style={styles.settingTexts}>
                  <Text style={styles.settingTitle}>Операции по счетам</Text>
                  <Text style={styles.settingDescription}>Поступления и списания</Text>
                </View>
              </View>
              <Switch
                value={notifications.transactions}
                onValueChange={() => toggleNotification('transactions')}
                trackColor={{ false: '#E5E5E5', true: '#6A2EE8' }}
                thumbColor={notifications.transactions ? '#fff' : '#fff'}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: '#FFF4E5' }]}>
                  <Ionicons name="shield-checkmark-outline" size={20} color="#FFA726" />
                </View>
                <View style={styles.settingTexts}>
                  <Text style={styles.settingTitle}>Безопасность</Text>
                  <Text style={styles.settingDescription}>Входы и подозрительные действия</Text>
                </View>
              </View>
              <Switch
                value={notifications.security}
                onValueChange={() => toggleNotification('security')}
                trackColor={{ false: '#E5E5E5', true: '#6A2EE8' }}
                thumbColor={notifications.security ? '#fff' : '#fff'}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: '#FFE8E8' }]}>
                  <Ionicons name="gift-outline" size={20} color="#FF6B6B" />
                </View>
                <View style={styles.settingTexts}>
                  <Text style={styles.settingTitle}>Акции и предложения</Text>
                  <Text style={styles.settingDescription}>Специальные условия и кэшбэк</Text>
                </View>
              </View>
              <Switch
                value={notifications.promotions}
                onValueChange={() => toggleNotification('promotions')}
                trackColor={{ false: '#E5E5E5', true: '#6A2EE8' }}
                thumbColor={notifications.promotions ? '#fff' : '#fff'}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: '#F0EBFF' }]}>
                  <Ionicons name="megaphone-outline" size={20} color="#6A2EE8" />
                </View>
                <View style={styles.settingTexts}>
                  <Text style={styles.settingTitle}>Новости банка</Text>
                  <Text style={styles.settingDescription}>Обновления и важные объявления</Text>
                </View>
              </View>
              <Switch
                value={notifications.news}
                onValueChange={() => toggleNotification('news')}
                trackColor={{ false: '#E5E5E5', true: '#6A2EE8' }}
                thumbColor={notifications.news ? '#fff' : '#fff'}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: '#F0F0F0' }]}>
                  <Ionicons name="settings-outline" size={20} color="#666" />
                </View>
                <View style={styles.settingTexts}>
                  <Text style={styles.settingTitle}>Системные уведомления</Text>
                  <Text style={styles.settingDescription}>Обновления приложения</Text>
                </View>
              </View>
              <Switch
                value={notifications.system}
                onValueChange={() => toggleNotification('system')}
                trackColor={{ false: '#E5E5E5', true: '#6A2EE8' }}
                thumbColor={notifications.system ? '#fff' : '#fff'}
              />
            </View>
          </View>
        </View>

        {/* Empty State for Notifications */}
        <View style={styles.emptySection}>
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons name="notifications-off-outline" size={48} color="#999" />
            </View>
            <Text style={styles.emptyStateTitle}>Нет новых уведомлений</Text>
            <Text style={styles.emptyStateText}>
              Здесь будут появляться ваши уведомления о операциях и важных событиях
            </Text>
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
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  container: {
    flex: 1,
  },
  settingsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  settingsCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 20,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F0F0F5'
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  settingIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingTexts: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F5',
    marginHorizontal: 20,
  },
  emptySection: {
    paddingHorizontal: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F0F0F5'
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F8FAFD',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  bottomSpacer: {
    height: 30,
  },
});