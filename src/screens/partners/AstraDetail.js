import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Image } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

// Компонент для логотипа
const AstraLogo = ({ width = 80, height = 80 }) => (
  <Image 
    source={require('../../../assets/partners/astra-logo.svg')}
    style={{ width, height }}
    resizeMode="contain"
  />
);

export default function AstraDetail({ navigation, route }) {
  const partner = {
    id: 1, 
    name: 'Astra RP', 
    discount: 'Эксклюзивные бонусы', 
    description: 'GTA 5 RolePlay проект с передовой экономической системой',
    logo: AstraLogo,
    color: '#5100ffff',
    benefits: [
      'Игровая валюта за покупки',
      'Премиум аккаунт на 30 дней',
      'Эксклюзивный транспорт',
      'Уникальные бизнесы',
      'Персональная поддержка'
    ],
    fullDescription: 'Astra RP - это инновационный RolePlay проект в GTA 5, где каждый игрок может построить свою уникальную историю. Мы предлагаем глубокую экономическую систему, реалистичные механики и активное сообщество.',
    website: 'https://astra-rp.fun/main.html',
    telegram: 'https://t.me/astrarp5',
    discord: 'https://dsc.gg/astrarpgta5',
    features: [
      'Реалистичная экономика',
      'Уникальные профессии',
      'Кастомный контент',
      'Активное сообщество',
      'Регулярные обновления'
    ]
  };

  const handleOpenWebsite = () => {
    Linking.openURL(partner.website);
  };

  const handleOpenTelegram = () => {
    Linking.openURL(partner.telegram);
  };

  const handleOpenDiscord = () => {
    Linking.openURL(partner.discord);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Партнёр</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content}>
        {/* Hero Section */}
        <View style={[styles.heroSection, { backgroundColor: partner.color }]}>
          <View style={styles.heroContent}>
            <AstraLogo width={80} height={80} />
            <Text style={styles.heroTitle}>{partner.name}</Text>
            <Text style={styles.heroSubtitle}>{partner.discount}</Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>О проекте</Text>
          <Text style={styles.description}>{partner.fullDescription}</Text>
        </View>

        {/* Benefits */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ваши преимущества</Text>
          <View style={styles.benefitsList}>
            {partner.benefits.map((benefit, index) => (
              <View key={index} style={styles.benefitItem}>
                <Ionicons name="checkmark-circle" size={20} color="#159E3A" />
                <Text style={styles.benefitText}>{benefit}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Особенности проекта</Text>
          <View style={styles.featuresGrid}>
            {partner.features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Social Links */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Присоединяйтесь</Text>
          <View style={styles.socialLinks}>
            <TouchableOpacity style={styles.socialButton} onPress={handleOpenWebsite}>
              <Ionicons name="globe" size={24} color="#fff" />
              <Text style={styles.socialButtonText}>Сайт</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#0088cc' }]} onPress={handleOpenTelegram}>
              <Ionicons name="paper-plane" size={24} color="#fff" />
              <Text style={styles.socialButtonText}>Telegram</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#5865F2' }]} onPress={handleOpenDiscord}>
              <MaterialCommunityIcons name="discord" size={24} color="#fff" />
              <Text style={styles.socialButtonText}>Discord</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* How to Get Bonus */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Как получить бонусы</Text>
          <View style={styles.stepsList}>
            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <Text style={styles.stepText}>Совершите покупку на сумму от 1000₽</Text>
            </View>
            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <Text style={styles.stepText}>Напишите в поддержку Astra RP</Text>
            </View>
            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <Text style={styles.stepText}>Предоставьте чек и никнейм в игре</Text>
            </View>
            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>4</Text>
              </View>
              <Text style={styles.stepText}>Получите бонусы в течение 24 часов</Text>
            </View>
          </View>
        </View>

        <View style={styles.bottomSpacer} />
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
  },
  heroSection: {
    padding: 30,
    alignItems: 'center',
  },
  heroContent: {
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    marginTop: 16,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
  },
  section: {
    backgroundColor: '#fff',
    margin: 20,
    marginBottom: 0,
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
  },
  benefitsList: {
    gap: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  benefitText: {
    fontSize: 16,
    color: '#000',
    flex: 1,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  featureItem: {
    backgroundColor: '#F7F7FB',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  featureText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
  socialLinks: {
    flexDirection: 'row',
    gap: 12,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#6A2EE8',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  socialButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  stepsList: {
    gap: 16,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#6A2EE8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  stepText: {
    fontSize: 16,
    color: '#000',
    flex: 1,
    marginTop: 4,
  },
  bottomSpacer: {
    height: 20,
  },
});