import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';

export default function Settings({ navigation }) {
  const [biometrics, setBiometrics] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const settingsSections = [
    {
      title: 'Основные',
      items: [
        {
          icon: 'person-outline',
          title: 'Личные данные',
          description: 'Имя, email, телефон',
          screen: 'PersonalData'
        },
        {
          icon: 'notifications-outline',
          title: 'Уведомления',
          description: 'Настройка оповещений',
          screen: 'Notifications'
        },
        {
          icon: 'language-outline',
          title: 'Язык',
          description: 'Русский',
          isStatic: true // Флаг что это статический элемент
        }
      ]
    }
  ];

  return (
    <View style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Настройки</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Quick Settings */}
        <View style={styles.quickSettings}>
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons name="notifications-outline" size={22} color="#6A2EE8" />
              <Text style={styles.settingText}>Уведомления</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#E5E5E5', true: '#6A2EE8' }}
            />
          </View>
        </View>

        {/* Settings Sections */}
        {settingsSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionContent}>
              {section.items.map((item, itemIndex) => (
                item.isStatic ? (
                  // Статический элемент (не кликабельный)
                  <View key={itemIndex} style={styles.menuItem}>
                    <View style={styles.menuLeft}>
                      <View style={styles.menuIcon}>
                        <Ionicons name={item.icon} size={20} color="#6A2EE8" />
                      </View>
                      <View style={styles.menuTexts}>
                        <Text style={styles.menuTitle}>{item.title}</Text>
                        <Text style={styles.menuDescription}>{item.description}</Text>
                      </View>
                    </View>
                    <View style={styles.languageContainer}>
                      <Text style={styles.languageText}>{item.description}</Text>
                    </View>
                  </View>
                ) : (
                  // Кликабельный элемент
                  <TouchableOpacity
                    key={itemIndex}
                    style={styles.menuItem}
                    onPress={() => navigation.navigate(item.screen)}
                  >
                    <View style={styles.menuLeft}>
                      <View style={styles.menuIcon}>
                        <Ionicons name={item.icon} size={20} color="#6A2EE8" />
                      </View>
                      <View style={styles.menuTexts}>
                        <Text style={styles.menuTitle}>{item.title}</Text>
                        <Text style={styles.menuDescription}>{item.description}</Text>
                      </View>
                    </View>
                    <Feather name="chevron-right" size={18} color="#999" />
                  </TouchableOpacity>
                )
              ))}
            </View>
          </View>
        ))}

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appVersion}>Версия 1.0.0</Text>
          <Text style={styles.appBuild}>Сборка 12345</Text>
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
  headerSpacer: {
    width: 32
  },
  container: {
    flex: 1,
  },
  quickSettings: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000'
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  sectionContent: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0'
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0EBFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTexts: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 2,
  },
  menuDescription: {
    fontSize: 12,
    color: '#666',
  },
  languageContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
  },
  languageText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  appInfo: {
    alignItems: 'center',
    padding: 20,
  },
  appVersion: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  appBuild: {
    fontSize: 12,
    color: '#999',
  },
  bottomSpacer: {
    height: 20,
  },
});