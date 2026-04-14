import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { transactionsAPI, statsAPI } from '../../utils/api';

const { width } = Dimensions.get('window');

const categoryIcons = {
  transport: 'car-outline',
  food: 'fast-food-outline',
  health: 'medical-outline',
  salary: 'card-outline',
  transfer: 'swap-horizontal-outline',
  entertainment: 'game-controller-outline',
  shopping: 'cart-outline',
  other: 'ellipse-outline'
};

const categoryColors = {
  transport: '#FF6B6B',
  food: '#4ECDC4',
  health: '#45B7D1',
  salary: '#96CEB4',
  transfer: '#FFA726',
  entertainment: '#AB47BC',
  shopping: '#26C6DA',
  other: '#BDBDBD'
};

export default function Operations({navigation}){
  const [filter, setFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('transactions');
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({ expenses: 0, incomes: 0, total: 0 });
  const [categoryStats, setCategoryStats] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      // Загружаем транзакции
      const txResponse = await transactionsAPI.getTransactions({ limit: 100 });
      const txList = txResponse.transactions || txResponse.data || [];
      setTransactions(txList);

      // Считаем статистику
      const expenses = txList
        .filter(tx => tx.amount < 0)
        .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
      const incomes = txList
        .filter(tx => tx.amount > 0)
        .reduce((sum, tx) => sum + tx.amount, 0);
      
      setStats({ expenses, incomes, total: incomes - expenses });

      // Статистика по категориям
      const expensesByCategory = txList
        .filter(tx => tx.amount < 0)
        .reduce((acc, tx) => {
          const category = tx.category || 'other';
          acc[category] = (acc[category] || 0) + Math.abs(tx.amount);
          return acc;
        }, {});

      const totalExpenses = Object.values(expensesByCategory).reduce((sum, amount) => sum + amount, 0);

      const categoryStatsData = Object.entries(expensesByCategory).map(([category, amount]) => ({
        category,
        amount,
        percentage: totalExpenses > 0 ? (amount / totalExpenses * 100).toFixed(1) : 0,
        icon: categoryIcons[category] || 'ellipse-outline',
        color: categoryColors[category] || '#BDBDBD'
      })).sort((a, b) => b.amount - a.amount);

      setCategoryStats(categoryStatsData);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  function onClose() {
    navigation.goBack();
  }

  const filtered = transactions.filter(tx => {
    const type = tx.amount >= 0 ? 'income' : 'expense';
    return filter === 'all' ? true : type === filter;
  });

  const formatAmount = (amount) => {
    const num = parseFloat(amount);
    const formatted = new Intl.NumberFormat('ru-RU', { 
      style: 'currency', 
      currency: 'RUB',
      minimumFractionDigits: 0 
    }).format(Math.abs(num));
    return num >= 0 ? `+${formatted}` : `-${formatted}`;
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  };

  const getCategoryName = (category) => {
    const names = {
      transport: 'Транспорт',
      food: 'Еда',
      health: 'Здоровье',
      salary: 'Зарплата',
      transfer: 'Перевод',
      entertainment: 'Развлечения',
      shopping: 'Покупки',
      other: 'Другое'
    };
    return names[category] || category;
  };

  const renderTransactionItem = ({item}) => {
    const type = item.amount >= 0 ? 'income' : 'expense';
    const category = item.category || 'other';
    
    return (
      <View style={styles.transactionCard}>
        <View style={styles.transactionContent}>
          <View style={[styles.icon, { backgroundColor: categoryColors[category] }]}>
            <Ionicons name={categoryIcons[category]} size={18} color="#fff" />
          </View>
          <View style={styles.transactionInfo}>
            <Text style={styles.transactionTitle}>{item.title || item.merchant || 'Перевод'}</Text>
            <Text style={styles.transactionSubtitle}>{getCategoryName(category)}</Text>
            <Text style={styles.transactionDate}>{formatDate(item.date || item.createdAt)} в {formatTime(item.date || item.createdAt)}</Text>
          </View>
          <View style={styles.amountContainer}>
            <Text style={[
              styles.amount,
              type === 'income' ? styles.incomeAmount : styles.expenseAmount
            ]}>
              {formatAmount(item.amount)}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderAnalytics = () => (
    <View style={styles.analyticsContainer}>
      {/* Общая статистика */}
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(stats.incomes)}
          </Text>
          <Text style={styles.statLabel}>Доходы</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(stats.expenses)}
          </Text>
          <Text style={styles.statLabel}>Расходы</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, stats.total >= 0 ? styles.incomeAmount : styles.expenseAmount]}>
            {new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(stats.total)}
          </Text>
          <Text style={styles.statLabel}>Итого</Text>
        </View>
      </View>

      {/* Распределение по категориям */}
      <Text style={styles.sectionTitle}>Расходы по категориям</Text>
      <View style={styles.categoriesList}>
        {categoryStats.map((stat, index) => (
          <View key={index} style={styles.categoryItem}>
            <View style={styles.categoryHeader}>
              <View style={[styles.categoryIcon, { backgroundColor: stat.color }]}>
                <Ionicons name={stat.icon} size={16} color="#fff" />
              </View>
              <Text style={styles.categoryName}>{getCategoryName(stat.category)}</Text>
              <Text style={styles.categoryAmount}>
                {new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(stat.amount)}
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor: stat.color,
                    width: `${stat.percentage}%`
                  }
                ]}
              />
            </View>
            <Text style={styles.categoryPercentage}>{stat.percentage}%</Text>
          </View>
        ))}
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6A2EE8" />
      </View>
    );
  }

  return (
    <View style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Операции</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Tab Switcher */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'transactions' && styles.activeTab]}
          onPress={() => setActiveTab('transactions')}
        >
          <Text style={[styles.tabText, activeTab === 'transactions' && styles.activeTabText]}>
            Транзакции
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'analytics' && styles.activeTab]}
          onPress={() => setActiveTab('analytics')}
        >
          <Text style={[styles.tabText, activeTab === 'analytics' && styles.activeTabText]}>
            Аналитика
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container}>
        {activeTab === 'transactions' ? (
          <>
            {/* Фильтры */}
            <View style={styles.filtersContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <TouchableOpacity 
                  style={[styles.filterBtn, filter === 'all' && styles.activeFilter]} 
                  onPress={() => setFilter('all')}
                >
                  <Text style={[styles.filterText, filter === 'all' && styles.activeFilterText]}>
                    Все операции
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.filterBtn, filter === 'income' && styles.activeFilter]} 
                  onPress={() => setFilter('income')}
                >
                  <Text style={[styles.filterText, filter === 'income' && styles.activeFilterText]}>
                    Доходы
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.filterBtn, filter === 'expense' && styles.activeFilter]} 
                  onPress={() => setFilter('expense')}
                >
                  <Text style={[styles.filterText, filter === 'expense' && styles.activeFilterText]}>
                    Расходы
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </View>

            {/* Список операций */}
            <View style={styles.operationsContainer}>
              <Text style={styles.sectionTitle}>
                {filter === 'all' ? 'Все операции' : filter === 'income' ? 'Доходы' : 'Расходы'} 
                ({filtered.length})
              </Text>
              
              {filtered.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>Операции не найдены</Text>
                </View>
              ) : (
                <FlatList 
                  data={filtered}
                  keyExtractor={item => item.id}
                  renderItem={renderTransactionItem}
                  scrollEnabled={false}
                  showsVerticalScrollIndicator={false}
                />
              )}
            </View>
          </>
        ) : (
          renderAnalytics()
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#F7F7FB'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F7FB',
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
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerSpacer: {
    width: 32
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5'
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  activeTab: {
    backgroundColor: '#6A2EE8',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666'
  },
  activeTabText: {
    color: '#fff'
  },
  container: {
    flex: 1,
  },
  filtersContainer: {
    paddingHorizontal: 16,
    marginVertical: 16,
  },
  filterBtn: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5'
  },
  activeFilter: {
    backgroundColor: '#6A2EE8',
    borderColor: '#6A2EE8'
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666'
  },
  activeFilterText: {
    color: '#fff'
  },
  operationsContainer: {
    flex: 1,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  analyticsContainer: {
    flex: 1,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  categoriesList: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryItem: {
    marginBottom: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  categoryName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  categoryAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#F0F0F0',
    borderRadius: 3,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  categoryPercentage: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
  monthlyStats: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  monthlyItem: {
    flex: 1,
    alignItems: 'center',
  },
  monthlyValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  monthlyLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  transactionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  transactionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
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
  transactionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: '#999',
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
  },
  incomeAmount: {
    color: '#159E3A',
  },
  expenseAmount: {
    color: '#FF3B30',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});