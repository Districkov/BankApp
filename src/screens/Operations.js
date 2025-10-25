import React, {useState} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const data = [
  {id:'1', title:'BMW Motors', subtitle:'Покупка', amount:'-14 743 211 ₽', type:'expense', date:'20 окт 2024', time:'14:30', category: 'transport'},
  {id:'2', title:'Перевод от Петя', subtitle:'Перевод', amount:'+8 700 ₽', type:'income', date:'13 сент 2024', time:'11:15', category: 'transfer'},
  {id:'3', title:'Вкусно — и точка', subtitle:'Еда', amount:'-538 ₽', type:'expense', date:'12 сент 2024', time:'18:45', category: 'food'},
  {id:'4', title:'Аптека', subtitle:'Здоровье', amount:'-1 240 ₽', type:'expense', date:'11 сент 2024', time:'09:20', category: 'health'},
  {id:'5', title:'Зарплата', subtitle:'Начисление', amount:'+45 000 ₽', type:'income', date:'10 сент 2024', time:'08:00', category: 'salary'},
  {id:'6', title:'Такси', subtitle:'Транспорт', amount:'-320 ₽', type:'expense', date:'9 сент 2024', time:'22:10', category: 'transport'},
  {id:'7', title:'Супермаркет', subtitle:'Продукты', amount:'-2 150 ₽', type:'expense', date:'8 сент 2024', time:'16:30', category: 'food'},
  {id:'8', title:'Кино', subtitle:'Развлечения', amount:'-800 ₽', type:'expense', date:'7 сент 2024', time:'20:15', category: 'entertainment'},
];

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
  const [activeTab, setActiveTab] = useState('transactions'); // 'transactions' или 'analytics'
  
  const filtered = data.filter(d => 
    filter === 'all' ? true : (filter === 'income' ? d.type === 'income' : d.type === 'expense')
  );

  function onClose() {
    navigation.goBack();
  }

  const getTotalAmount = () => {
    const expenses = data.filter(d => d.type === 'expense')
      .reduce((sum, item) => sum + parseFloat(item.amount.replace(/[^\d.-]/g, '')), 0);
    const incomes = data.filter(d => d.type === 'income')
      .reduce((sum, item) => sum + parseFloat(item.amount.replace(/[^\d.-]/g, '')), 0);
    return { expenses, incomes, total: incomes - expenses };
  };

  const getCategoryStats = () => {
    const expensesByCategory = data
      .filter(d => d.type === 'expense')
      .reduce((acc, item) => {
        const amount = parseFloat(item.amount.replace(/[^\d.-]/g, ''));
        acc[item.category] = (acc[item.category] || 0) + amount;
        return acc;
      }, {});

    const totalExpenses = Object.values(expensesByCategory).reduce((sum, amount) => sum + amount, 0);
    
    return Object.entries(expensesByCategory).map(([category, amount]) => ({
      category,
      amount,
      percentage: (amount / totalExpenses * 100).toFixed(1),
      icon: categoryIcons[category] || 'ellipse-outline',
      color: categoryColors[category] || '#BDBDBD'
    })).sort((a, b) => b.amount - a.amount);
  };

  const totals = getTotalAmount();
  const categoryStats = getCategoryStats();

  const renderTransactionItem = ({item}) => (
    <View style={styles.transactionCard}>
      <View style={styles.transactionContent}>
        <View style={[styles.icon, { backgroundColor: categoryColors[item.category] }]}>
          <Ionicons name={categoryIcons[item.category]} size={18} color="#fff" />
        </View>
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionTitle}>{item.title}</Text>
          <Text style={styles.transactionSubtitle}>{item.subtitle}</Text>
          <Text style={styles.transactionDate}>{item.date} в {item.time}</Text>
        </View>
        <View style={styles.amountContainer}>
          <Text style={[
            styles.amount,
            item.type === 'income' ? styles.incomeAmount : styles.expenseAmount
          ]}>
            {item.amount}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderAnalytics = () => (
    <View style={styles.analyticsContainer}>
      {/* Общая статистика */}
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>+{totals.incomes.toLocaleString()} ₽</Text>
          <Text style={styles.statLabel}>Доходы</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>-{totals.expenses.toLocaleString()} ₽</Text>
          <Text style={styles.statLabel}>Расходы</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, totals.total >= 0 ? styles.incomeAmount : styles.expenseAmount]}>
            {totals.total >= 0 ? '+' : ''}{totals.total.toLocaleString()} ₽
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
              <Text style={styles.categoryName}>
                {stat.category === 'transport' ? 'Транспорт' :
                 stat.category === 'food' ? 'Еда' :
                 stat.category === 'health' ? 'Здоровье' :
                 stat.category === 'entertainment' ? 'Развлечения' : stat.category}
              </Text>
              <Text style={styles.categoryAmount}>-{stat.amount.toLocaleString()} ₽</Text>
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

      {/* Ежемесячная статистика */}
      <Text style={styles.sectionTitle}>Статистика за месяц</Text>
      <View style={styles.monthlyStats}>
        <View style={styles.monthlyItem}>
          <Text style={styles.monthlyValue}>24</Text>
          <Text style={styles.monthlyLabel}>Операций</Text>
        </View>
        <View style={styles.monthlyItem}>
          <Text style={styles.monthlyValue}>8 740 ₽</Text>
          <Text style={styles.monthlyLabel}>Средний чек</Text>
        </View>
        <View style={styles.monthlyItem}>
          <Text style={styles.monthlyValue}>12</Text>
          <Text style={styles.monthlyLabel}>Дней с тратами</Text>
        </View>
      </View>
    </View>
  );

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