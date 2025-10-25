import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';

export default function TransactionHistory({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedCard, setSelectedCard] = useState('all');

  const periods = [
    { id: 'week', label: 'Неделя' },
    { id: 'month', label: 'Месяц' },
    { id: 'quarter', label: 'Квартал' },
    { id: 'year', label: 'Год' }
  ];

  const cards = [
    { id: 'all', label: 'Все карты' },
    { id: 'black', label: 'Black' },
    { id: 'platinum', label: 'Платинум' }
  ];

  const transactions = [
    {
      id: '1',
      title: 'Самокатик — Яндекс Go',
      category: 'Транспорт',
      amount: '-56 ₽',
      type: 'expense',
      date: '14 сент 2024',
      time: '14:30',
      card: 'black',
      status: 'completed'
    },
    {
      id: '2',
      title: 'Перевод от Петя',
      category: 'Перевод',
      amount: '+8 700 ₽',
      type: 'income',
      date: '13 сент 2024',
      time: '11:15',
      card: 'black',
      status: 'completed'
    },
    {
      id: '3',
      title: 'Вкусно — и точка',
      category: 'Еда',
      amount: '-538 ₽',
      type: 'expense',
      date: '12 сент 2024',
      time: '18:45',
      card: 'black',
      status: 'completed'
    },
    {
      id: '4',
      title: 'Аптека',
      category: 'Здоровье',
      amount: '-1 240 ₽',
      type: 'expense',
      date: '11 сент 2024',
      time: '09:20',
      card: 'black',
      status: 'completed'
    },
    {
      id: '5',
      title: 'Зарплата',
      category: 'Доход',
      amount: '+45 000 ₽',
      type: 'income',
      date: '10 сент 2024',
      time: '08:00',
      card: 'black',
      status: 'completed'
    }
  ];

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCard = selectedCard === 'all' || transaction.card === selectedCard;
    return matchesSearch && matchesCard;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#159E3A';
      case 'pending': return '#FFA726';
      case 'failed': return '#FF3B30';
      default: return '#666';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Завершено';
      case 'pending': return 'Ожидание';
      case 'failed': return 'Ошибка';
      default: return status;
    }
  };

  return (
    <View style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>История операций</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Feather name="filter" size={20} color="#6A2EE8" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Search */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Feather name="search" size={20} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Поиск операций..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Feather name="x" size={20} color="#666" />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        {/* Period Filter */}
        <View style={styles.filtersSection}>
          <Text style={styles.filtersTitle}>Период</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.periodScroll}>
            {periods.map((period) => (
              <TouchableOpacity
                key={period.id}
                style={[
                  styles.periodButton,
                  selectedPeriod === period.id && styles.periodButtonActive
                ]}
                onPress={() => setSelectedPeriod(period.id)}
              >
                <Text style={[
                  styles.periodText,
                  selectedPeriod === period.id && styles.periodTextActive
                ]}>
                  {period.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Card Filter */}
        <View style={styles.filtersSection}>
          <Text style={styles.filtersTitle}>Карта</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cardsScroll}>
            {cards.map((card) => (
              <TouchableOpacity
                key={card.id}
                style={[
                  styles.cardButton,
                  selectedCard === card.id && styles.cardButtonActive
                ]}
                onPress={() => setSelectedCard(card.id)}
              >
                <Text style={[
                  styles.cardText,
                  selectedCard === card.id && styles.cardTextActive
                ]}>
                  {card.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Statistics */}
        <View style={styles.statsSection}>
          <View style={styles.statCard}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Операций</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, styles.incomeValue]}>+53 700 ₽</Text>
              <Text style={styles.statLabel}>Доходы</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, styles.expenseValue]}>-2 034 ₽</Text>
              <Text style={styles.statLabel}>Расходы</Text>
            </View>
          </View>
        </View>

        {/* Transactions List */}
        <View style={styles.transactionsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Операции</Text>
            <Text style={styles.transactionsCount}>{filteredTransactions.length} операций</Text>
          </View>

          {filteredTransactions.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="receipt-outline" size={48} color="#999" />
              <Text style={styles.emptyStateTitle}>Операции не найдены</Text>
              <Text style={styles.emptyStateText}>
                Попробуйте изменить параметры поиска{'\n'}или выберите другой период
              </Text>
            </View>
          ) : (
            <View style={styles.transactionsList}>
              {filteredTransactions.map((transaction) => (
                <TouchableOpacity
                  key={transaction.id}
                  style={styles.transactionItem}
                  onPress={() => {/* Navigate to transaction details */}}
                >
                  <View style={styles.transactionLeft}>
                    <View style={[
                      styles.transactionIcon,
                      { backgroundColor: transaction.type === 'income' ? '#E8F5E8' : '#FFE8E8' }
                    ]}>
                      <Ionicons 
                        name={transaction.type === 'income' ? 'arrow-down' : 'arrow-up'} 
                        size={16} 
                        color={transaction.type === 'income' ? '#159E3A' : '#FF3B30'} 
                      />
                    </View>
                    <View style={styles.transactionInfo}>
                      <Text style={styles.transactionTitle}>{transaction.title}</Text>
                      <Text style={styles.transactionCategory}>{transaction.category}</Text>
                      <Text style={styles.transactionDate}>{transaction.date} в {transaction.time}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.transactionRight}>
                    <Text style={[
                      styles.transactionAmount,
                      transaction.type === 'income' ? styles.incomeAmount : styles.expenseAmount
                    ]}>
                      {transaction.amount}
                    </Text>
                    <View style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(transaction.status) + '20' }
                    ]}>
                      <Text style={[
                        styles.statusText,
                        { color: getStatusColor(transaction.status) }
                      ]}>
                        {getStatusText(transaction.status)}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Export Section */}
        <View style={styles.exportSection}>
          <TouchableOpacity style={styles.exportButton}>
            <Ionicons name="download-outline" size={20} color="#6A2EE8" />
            <Text style={styles.exportText}>Экспорт выписки</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.exportButton}>
            <Ionicons name="share-outline" size={20} color="#6A2EE8" />
            <Text style={styles.exportText}>Поделиться</Text>
          </TouchableOpacity>
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
  filterButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
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
  filtersSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filtersTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  periodScroll: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  periodButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#fff',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5'
  },
  periodButtonActive: {
    backgroundColor: '#6A2EE8',
    borderColor: '#6A2EE8'
  },
  periodText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666'
  },
  periodTextActive: {
    color: '#fff'
  },
  cardsScroll: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  cardButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#fff',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5'
  },
  cardButtonActive: {
    backgroundColor: '#6A2EE8',
    borderColor: '#6A2EE8'
  },
  cardText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666'
  },
  cardTextActive: {
    color: '#fff'
  },
  statsSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  incomeValue: {
    color: '#159E3A',
  },
  expenseValue: {
    color: '#FF3B30',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  transactionsSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  transactionsCount: {
    fontSize: 14,
    color: '#666',
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
    lineHeight: 20,
  },
  transactionsList: {
    paddingHorizontal: 16,
  },
  transactionItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  transactionCategory: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: '#999',
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  incomeAmount: {
    color: '#159E3A',
  },
  expenseAmount: {
    color: '#FF3B30',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  exportSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 24,
    gap: 12,
  },
  exportButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  exportText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6A2EE8',
  },
  bottomSpacer: {
    height: 20,
  },
});