import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Dimensions } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

export default function TopUpScreen({navigation}) {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [amount, setAmount] = useState('');

  const topUpMethods = [
    {
      id: 1,
      title: 'С карты другого банка',
      description: 'Перевод с любой банковской карты',
      icon: 'card-outline',
      color: '#6A2EE8'
    },
    {
      id: 2,
      title: 'Счёт по реквизитам',
      description: 'По номеру счёта и БИК',
      icon: 'document-text-outline',
      color: '#159E3A'
    },
    {
      id: 3,
      title: 'Наличные через терминал',
      description: 'В отделениях банка и партнёров',
      icon: 'cash-outline',
      color: '#FF6B6B'
    },
    {
      id: 4,
      title: 'С мобильного счёта',
      description: 'Пополнение с баланса телефона',
      icon: 'phone-portrait-outline',
      color: '#FFA726'
    }
  ];

  const quickAmounts = ['500', '1000', '2000', '5000'];

  const handleAmountSelect = (value) => {
    setAmount(value);
  };

  const handleAmountChange = (text) => {
    // Убираем все нецифровые символы
    let cleaned = text.replace(/[^\d]/g, '');
    setAmount(cleaned);
  };

  const handleContinue = () => {
    if (selectedMethod && amount) {
      navigation.navigate('Success', { 
        amount: amount, 
        type: 'Пополнение счета' 
      });
    }
  };

  return (
    <View style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Пополнение счета</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Current Balance */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Текущий баланс</Text>
          <Text style={styles.balanceAmount}>27 466,16 ₽</Text>
        </View>

        {/* Amount Selection */}
        <View style={styles.amountSection}>
          <Text style={styles.sectionTitle}>Сумма пополнения</Text>
          
          <View style={styles.amountInputSection}>
            <View style={styles.amountInputContainer}>
              <TextInput
                style={styles.amountInput}
                value={amount}
                onChangeText={handleAmountChange}
                placeholder="0"
                placeholderTextColor="#999"
                keyboardType="numeric"
                textAlign="center"
              />
            </View>
            <Text style={styles.currencySymbol}>₽</Text>
          </View>

          <View style={styles.quickAmounts}>
            {quickAmounts.map((quickAmount) => (
              <TouchableOpacity
                key={quickAmount}
                style={[
                  styles.quickAmountButton,
                  amount === quickAmount && styles.quickAmountButtonActive
                ]}
                onPress={() => handleAmountSelect(quickAmount)}
              >
                <Text style={[
                  styles.quickAmountText,
                  amount === quickAmount && styles.quickAmountTextActive
                ]}>
                  {quickAmount} ₽
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Methods Section */}
        <View style={styles.methodsSection}>
          <Text style={styles.sectionTitle}>Способ пополнения</Text>
          
          <View style={styles.methodsList}>
            {topUpMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.methodItem,
                  selectedMethod === method.id && styles.methodItemSelected
                ]}
                onPress={() => setSelectedMethod(method.id)}
              >
                <View style={[styles.methodIcon, { backgroundColor: method.color }]}>
                  <Ionicons name={method.icon} size={20} color="#fff" />
                </View>
                <View style={styles.methodInfo}>
                  <Text style={styles.methodTitle}>{method.title}</Text>
                  <Text style={styles.methodDescription}>{method.description}</Text>
                </View>
                <View style={[
                  styles.radioButton,
                  selectedMethod === method.id && styles.radioButtonSelected
                ]}>
                  {selectedMethod === method.id && (
                    <View style={styles.radioButtonInner} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          style={[
            styles.continueButton,
            (!selectedMethod || !amount) && styles.continueButtonDisabled
          ]}
          disabled={!selectedMethod || !amount}
          onPress={handleContinue}
        >
          <Text style={styles.continueButtonText}>
            Пополнить на {amount ? amount + ' ₽' : ''}
          </Text>
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
  headerSpacer: {
    width: 32
  },
  container: {
    flex: 1,
    padding: 16,
  },
  balanceCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
  },
  amountSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
    paddingHorizontal: 4, // Такие же отступы как у карточек
  },
  amountInputSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  amountInputContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  amountInput: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
    padding: 0,
    margin: 0,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    width: 30,
  },
  quickAmounts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 16,
  },
  quickAmountButton: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: '48%',
    borderWidth: 2,
    borderColor: '#F0F0F0',
  },
  quickAmountButtonActive: {
    backgroundColor: '#6A2EE8',
    borderColor: '#6A2EE8',
  },
  quickAmountText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  quickAmountTextActive: {
    color: '#fff',
  },
  methodsSection: {
    marginBottom: 24,
  },
  methodsList: {
    gap: 12,
  },
  methodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  methodItemSelected: {
    borderWidth: 2,
    borderColor: '#6A2EE8',
    backgroundColor: '#F8F5FF',
  },
  methodIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  methodInfo: {
    flex: 1,
  },
  methodTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  methodDescription: {
    fontSize: 14,
    color: '#666',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    borderColor: '#6A2EE8',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#6A2EE8',
  },
  continueButton: {
    backgroundColor: '#6A2EE8',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  continueButtonDisabled: {
    backgroundColor: '#B9B6FF',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  bottomSpacer: {
    height: 20,
  },
});