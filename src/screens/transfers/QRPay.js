import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function QRPay({navigation}){
  const handleScan = () => {
    Alert.alert('Сканер QR', 'Запуск сканера QR-кода');
  };

  const handleMyQR = () => {
    Alert.alert('Мой QR', 'Показать ваш QR-код для оплаты');
  };

  return (
    <View style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Оплата по QR</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.container}>
        {/* Main QR Section */}
        <View style={styles.qrSection}>
          <View style={styles.qrContainer}>
            <View style={styles.qrPlaceholder}>
              <MaterialIcons name="qr-code-scanner" size={120} color="#6A2EE8" />
              <Text style={styles.qrPlaceholderText}>
                Наведите камеру на QR-код
              </Text>
            </View>
            
            {/* QR Frame */}
            <View style={styles.qrFrame}>
              <View style={[styles.corner, styles.cornerTopLeft]} />
              <View style={[styles.corner, styles.cornerTopRight]} />
              <View style={[styles.corner, styles.cornerBottomLeft]} />
              <View style={[styles.corner, styles.cornerBottomRight]} />
            </View>
          </View>

          <Text style={styles.scanInstruction}>
            Отсканируйте QR-код для быстрой оплаты
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleScan}>
            <Ionicons name="scan-outline" size={24} color="#fff" />
            <Text style={styles.primaryButtonText}>Сканировать QR</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={handleMyQR}>
            <MaterialIcons name="qr-code-2" size={24} color="#6A2EE8" />
            <Text style={styles.secondaryButtonText}>Показать мой QR</Text>
          </TouchableOpacity>
        </View>

        {/* Features */}
        <View style={styles.featuresSection}>
          <Text style={styles.featuresTitle}>Возможности</Text>
          
          <View style={styles.featuresGrid}>
            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: '#E8F5E8' }]}>
                <Ionicons name="storefront-outline" size={20} color="#159E3A" />
              </View>
              <Text style={styles.featureText}>Оплата в магазинах</Text>
            </View>
            
            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: '#F0EBFF' }]}>
                <Ionicons name="person-outline" size={20} color="#6A2EE8" />
              </View>
              <Text style={styles.featureText}>Переводы друзьям</Text>
            </View>
            
            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: '#FFE8E8' }]}>
                <Ionicons name="receipt-outline" size={20} color="#FF3B30" />
              </View>
              <Text style={styles.featureText}>Оплата счетов</Text>
            </View>
            
            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: '#E8F5FF' }]}>
                <Ionicons name="car-outline" size={20} color="#007AFF" />
              </View>
              <Text style={styles.featureText}>Транспорт</Text>
            </View>
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.recentSection}>
          <Text style={styles.recentTitle}>Недавние оплаты по QR</Text>
          
          <View style={styles.recentList}>
            <View style={styles.recentItem}>
              <View style={[styles.recentIcon, { backgroundColor: '#F0EBFF' }]}>
                <Ionicons name="cafe-outline" size={20} color="#6A2EE8" />
              </View>
              <View style={styles.recentInfo}>
                <Text style={styles.recentName}>Кофейня "Бодрость"</Text>
                <Text style={styles.recentDate}>Сегодня, 14:30</Text>
              </View>
              <Text style={styles.recentAmount}>-350 ₽</Text>
            </View>
            
            <View style={styles.recentItem}>
              <View style={[styles.recentIcon, { backgroundColor: '#E8F5E8' }]}>
                <Ionicons name="fast-food-outline" size={20} color="#159E3A" />
              </View>
              <View style={styles.recentInfo}>
                <Text style={styles.recentName}>Ресторан "Вкусно"</Text>
                <Text style={styles.recentDate}>Вчера, 19:15</Text>
              </View>
              <Text style={styles.recentAmount}>-1,240 ₽</Text>
            </View>
          </View>
        </View>
      </View>
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
    padding: 16,
  },
  qrSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  qrContainer: {
    width: width - 80,
    height: width - 80,
    backgroundColor: '#fff',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    position: 'relative',
  },
  qrPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  qrPlaceholderText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
    fontWeight: '500',
  },
  qrFrame: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#6A2EE8',
  },
  cornerTopLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 10,
  },
  cornerTopRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 10,
  },
  cornerBottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 10,
  },
  cornerBottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 10,
  },
  scanInstruction: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  actionsContainer: {
    gap: 12,
    marginBottom: 32,
  },
  primaryButton: {
    backgroundColor: '#6A2EE8',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 14,
    gap: 8,
    shadowColor: '#6A2EE8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 14,
    gap: 8,
    borderWidth: 2,
    borderColor: '#6A2EE8',
  },
  secondaryButtonText: {
    color: '#6A2EE8',
    fontSize: 16,
    fontWeight: '600',
  },
  featuresSection: {
    marginBottom: 32,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  featureItem: {
    width: (width - 52) / 2,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    textAlign: 'center',
  },
  recentSection: {
    flex: 1,
  },
  recentTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
  },
  recentList: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  recentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  recentInfo: {
    flex: 1,
  },
  recentName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 4,
  },
  recentDate: {
    fontSize: 14,
    color: '#666',
  },
  recentAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
  },
});