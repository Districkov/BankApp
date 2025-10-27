import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Image } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function YanimaDetail({ navigation, route }) {
  const partner = {
    id: 2, 
    name: 'Yanima', 
    discount: 'Подписка в подарок', 
    description: 'Онлайн-просмотр аниме с огромной библиотекой',
    logo: require('../../../assets/partners/yanima-logo.png'),
    color: '#FF6B6B',
    benefits: [
      'Премиум подписка на 1 месяц',
      'Ранний доступ к новинкам',
      'Эксклюзивные релизы',
      'Высокое качество видео',
      'Оффлайн просмотр',
      'Без рекламы'
    ],
    fullDescription: 'Yanima - это современная платформа для просмотра аниме с огромной библиотекой контента. Мы предлагаем эксклюзивные релизы, высокое качество видео и удобный интерфейс для настоящих ценителей японской анимации. Присоединяйтесь к нашему сообществу и откройте для себя мир аниме по-новому!',
    website: 'https://yanima.space',
    telegram: 'https://t.me/yanimanews',
    discord: 'https://social.yanima.space/discord',
    features: [
      'Огромная библиотека аниме',
      'Эксклюзивный контент',
      'HD и 4K качество',
      'Многоголосый дубляж',
      'Удобный плеер',
      'Персональные рекомендации'
    ],
    conditions: [
      'Действует для новых пользователей',
      'Минимальная сумма покупки 500₽',
      'Подписка активируется в течение 24 часов',
      'Предложение действительно до конца месяца'
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

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={[styles.heroSection, { backgroundColor: partner.color }]}>
          <View style={styles.heroContent}>
            <Image 
              source={partner.logo} 
              style={styles.heroLogo}
              resizeMode="contain"
            />
            <Text style={styles.heroTitle}>{partner.name}</Text>
            <Text style={styles.heroSubtitle}>{partner.discount}</Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>О платформе</Text>
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
          <Text style={styles.sectionTitle}>Возможности платформы</Text>
          <View style={styles.featuresGrid}>
            {partner.features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <Ionicons name="star" size={16} color="#FF6B6B" />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Conditions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Условия предложения</Text>
          <View style={styles.conditionsList}>
            {partner.conditions.map((condition, index) => (
              <View key={index} style={styles.conditionItem}>
                <View style={styles.conditionNumber}>
                  <Text style={styles.conditionNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.conditionText}>{condition}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Social Links */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Присоединяйтесь</Text>
          <Text style={styles.socialDescription}>
            Станьте частью сообщества Yanima и откройте для себя мир аниме
          </Text>
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
          <Text style={styles.sectionTitle}>Как получить подписку</Text>
          <View style={styles.stepsList}>
            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Совершите покупку</Text>
                <Text style={styles.stepText}>На сумму от 500₽ с использованием нашей карты</Text>
              </View>
            </View>
            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Зарегистрируйтесь</Text>
                <Text style={styles.stepText}>На Yanima.space и подтвердите email</Text>
              </View>
            </View>
            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Напишите в поддержку</Text>
                <Text style={styles.stepText}>Отправьте чек и логин от аккаунта</Text>
              </View>
            </View>
            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>4</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Активируйте подписку</Text>
                <Text style={styles.stepText}>Получите премиум доступ на 30 дней</Text>
              </View>
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
  heroLogo: {
    width: 80,
    height: 80,
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F7F7FB',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    flex: 1,
    minWidth: '48%',
  },
  featureText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
    flex: 1,
  },
  conditionsList: {
    gap: 12,
  },
  conditionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  conditionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF6B6B',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  conditionNumberText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
  conditionText: {
    fontSize: 16,
    color: '#000',
    flex: 1,
    lineHeight: 22,
  },
  socialDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
    lineHeight: 22,
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
    backgroundColor: '#FF6B6B',
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
    gap: 20,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FF6B6B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  stepText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  bottomSpacer: {
    height: 20,
  },
});