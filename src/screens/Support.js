import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Linking } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';

export default function Support({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');

  const faqCategories = [
    {
      icon: 'card-outline',
      title: 'Карты и счета',
      count: '12 вопросов',
      color: '#6A2EE8'
    },
    {
      icon: 'swap-horizontal-outline',
      title: 'Переводы и платежи',
      count: '8 вопросов',
      color: '#FF6B6B'
    },
    {
      icon: 'lock-closed-outline',
      title: 'Безопасность',
      count: '6 вопросов',
      color: '#4ECDC4'
    },
    {
      icon: 'phone-portrait-outline',
      title: 'Приложение',
      count: '5 вопросов',
      color: '#45B7D1'
    }
  ];

  const popularQuestions = [
    {
      question: 'Как заблокировать карту?',
      answer: 'Карту можно заблокировать в разделе "Безопасность" или позвонив в поддержку.'
    },
    {
      question: 'Какие лимиты на переводы?',
      answer: 'Лимиты зависят от типа карты и могут быть изменены в настройках безопасности.'
    },
    {
      question: 'Не приходит SMS с кодом',
      answer: 'Проверьте баланс телефона и настройки блокировки SMS от банка.'
    }
  ];

  const contactMethods = [
    {
      icon: 'call-outline',
      title: 'Телефон поддержки',
      subtitle: '8 800 555-35-35',
      color: '#159E3A',
      action: () => Linking.openURL('tel:88005553535')
    },
    {
      icon: 'chatbubble-outline',
      title: 'Онлайн-чат',
      subtitle: 'Круглосуточно',
      color: '#6A2EE8',
      action: () => console.log('Open chat')
    },
    {
      icon: 'mail-outline',
      title: 'Электронная почта',
      subtitle: 'support@bank.ru',
      color: '#FFA726',
      action: () => Linking.openURL('mailto:support@bank.ru')
    },
    {
      icon: 'location-outline',
      title: 'Отделения банка',
      subtitle: 'Найти ближайшее',
      color: '#FF3B30',
      action: () => console.log('Open map')
    }
  ];

  return (
    <View style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Помощь и поддержка</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Search */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Feather name="search" size={20} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Поиск по вопросам..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Quick Help */}
        <View style={styles.quickHelpSection}>
          <Text style={styles.sectionTitle}>Нужна срочная помощь?</Text>
          <TouchableOpacity style={styles.emergencyCard}>
            <View style={styles.emergencyIcon}>
              <Ionicons name="warning-outline" size={24} color="#FF3B30" />
            </View>
            <View style={styles.emergencyContent}>
              <Text style={styles.emergencyTitle}>Экстренная блокировка</Text>
              <Text style={styles.emergencyText}>Заблокируйте карту, если она утеряна</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#999" />
          </TouchableOpacity>
        </View>

        {/* FAQ Categories */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Частые вопросы</Text>
          <View style={styles.categoriesGrid}>
            {faqCategories.map((category, index) => (
              <TouchableOpacity
                key={index}
                style={styles.categoryItem}
                onPress={() => console.log('Open category', category.title)}
              >
                <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
                  <Ionicons name={category.icon} size={20} color="#fff" />
                </View>
                <Text style={styles.categoryTitle}>{category.title}</Text>
                <Text style={styles.categoryCount}>{category.count}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Popular Questions */}
        <View style={styles.questionsSection}>
          <Text style={styles.sectionTitle}>Популярные вопросы</Text>
          <View style={styles.questionsList}>
            {popularQuestions.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.questionItem}
                onPress={() => console.log('Open question', item.question)}
              >
                <View style={styles.questionContent}>
                  <Text style={styles.questionText}>{item.question}</Text>
                  <Text style={styles.answerPreview}>{item.answer}</Text>
                </View>
                <Feather name="chevron-right" size={18} color="#999" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Contact Methods */}
        <View style={styles.contactSection}>
          <Text style={styles.sectionTitle}>Свяжитесь с нами</Text>
          <View style={styles.contactGrid}>
            {contactMethods.map((method, index) => (
              <TouchableOpacity
                key={index}
                style={styles.contactItem}
                onPress={method.action}
              >
                <View style={[styles.contactIcon, { backgroundColor: method.color }]}>
                  <Ionicons name={method.icon} size={20} color="#fff" />
                </View>
                <Text style={styles.contactTitle}>{method.title}</Text>
                <Text style={styles.contactSubtitle}>{method.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* App Info */}
        <View style={styles.appInfoSection}>
          <View style={styles.appInfoCard}>
            <View style={styles.appInfoHeader}>
              <Ionicons name="phone-portrait-outline" size={24} color="#6A2EE8" />
              <Text style={styles.appInfoTitle}>О приложении</Text>
            </View>
            <View style={styles.appInfoRow}>
              <Text style={styles.appInfoLabel}>Версия</Text>
              <Text style={styles.appInfoValue}>1.0.0 (12345)</Text>
            </View>
            <View style={styles.appInfoRow}>
              <Text style={styles.appInfoLabel}>Обновлено</Text>
              <Text style={styles.appInfoValue}>15 сентября 2024</Text>
            </View>
            <View style={styles.appInfoRow}>
              <Text style={styles.appInfoLabel}>Разработчик</Text>
              <Text style={styles.appInfoValue}>Банк</Text>
            </View>
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
  headerSpacer: {
    width: 32
  },
  container: {
    flex: 1,
  },
  searchSection: {
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5'
  },
  searchIcon: {
    marginRight: 8
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: '#000'
  },
  quickHelpSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 12,
  },
  emergencyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE8E8',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FF3B30'
  },
  emergencyIcon: {
    marginRight: 12,
  },
  emergencyContent: {
    flex: 1,
  },
  emergencyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  emergencyText: {
    fontSize: 14,
    color: '#666',
  },
  categoriesSection: {
    marginBottom: 24,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
  },
  categoryItem: {
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
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
    textAlign: 'center',
  },
  categoryCount: {
    fontSize: 12,
    color: '#666',
  },
  questionsSection: {
    marginBottom: 24,
  },
  questionsList: {
    paddingHorizontal: 16,
  },
  questionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  questionContent: {
    flex: 1,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 4,
  },
  answerPreview: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  contactSection: {
    marginBottom: 24,
  },
  contactGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
  },
  contactItem: {
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
  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  contactTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
    textAlign: 'center',
  },
  contactSubtitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  appInfoSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  appInfoCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  appInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  appInfoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  appInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0'
  },
  appInfoLabel: {
    fontSize: 14,
    color: '#666',
  },
  appInfoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  bottomSpacer: {
    height: 20,
  },
});