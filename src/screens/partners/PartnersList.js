import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PartnersList({ navigation }) {
  const partners = [
    {
      id: 1,
      name: 'Astra RP',
      description: 'GTA 5 RolePlay проект',
      logo: require('../../../assets/partners/astra-logo.svg'),
      screen: 'AstraDetail',
      color: '#6A2EE8',
      discount: 'Эксклюзивные бонусы'
    },
    {
      id: 2,
      name: 'Yanima',
      description: 'Онлайн-просмотр аниме',
      logo: require('../../../assets/partners/yanima-logo.png'),
      screen: 'YanimaDetail',
      color: '#FF6B6B',
      discount: 'Подписка в подарок'
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Все партнёры</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Наши партнёры</Text>
        <Text style={styles.sectionDescription}>
          Специальные предложения и эксклюзивные бонусы для наших клиентов
        </Text>
        
        {partners.map((partner) => (
          <TouchableOpacity
            key={partner.id}
            style={styles.partnerItem}
            onPress={() => navigation.navigate(partner.screen)}
          >
            <View style={styles.partnerLeft}>
              <View style={[styles.partnerLogoContainer, { backgroundColor: partner.color }]}>
                <Image 
                  source={partner.logo} 
                  style={styles.partnerLogo}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.partnerInfo}>
                <Text style={styles.partnerName}>{partner.name}</Text>
                <Text style={styles.partnerDescription}>{partner.description}</Text>
                <Text style={styles.partnerDiscount}>{partner.discount}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        ))}
        
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Как получить бонусы?</Text>
          <Text style={styles.infoText}>
            • Совершайте покупки с нашими картами{'\n'}
            • Накапливайте бонусные баллы{'\n'}
            • Активируйте специальные предложения{'\n'}
            • Получайте эксклюзивные привилегии
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7FB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  headerRight: {
    width: 32,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    lineHeight: 22,
  },
  partnerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  partnerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  partnerLogoContainer: {
    width: 60,
    height: 60,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  partnerLogo: {
    width: 40,
    height: 40,
  },
  partnerInfo: {
    flex: 1,
  },
  partnerName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  partnerDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  partnerDiscount: {
    fontSize: 14,
    color: '#6A2EE8',
    fontWeight: '600',
  },
  infoSection: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});