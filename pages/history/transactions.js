import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import MainLayout from '../../src/components/MainLayout';
import { IoArrowBack, IoSearch, IoClose, IoArrowDown, IoArrowUp, IoReceiptOutline, IoDownloadOutline, IoShareOutline } from 'react-icons/io5';
import { IoFilter } from 'react-icons/io5';
import { transactionsAPI } from '../../src/utils/api';
import { useTheme } from '../../src/context/ThemeContext';

export default function TransactionHistory() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedCard, setSelectedCard] = useState('all');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    loadTransactions();
  }, [selectedPeriod, selectedCard]);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const params = {};
      
      // Добавляем параметры фильтрации
      if (selectedPeriod !== 'all') {
        params.period = selectedPeriod;
      }
      if (selectedCard !== 'all') {
        params.card = selectedCard;
      }

      const data = await transactionsAPI.getTransactions(params);
      setTransactions(data || []);
    } catch (error) {
      console.error('Error loading transactions:', error);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.category?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
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

  const calculateStats = () => {
    const stats = filteredTransactions.reduce((acc, transaction) => {
      const amount = parseFloat(transaction.amount?.replace(/[^\d.-]/g, '') || 0);
      if (transaction.type === 'income') {
        acc.income += amount;
      } else {
        acc.expense += Math.abs(amount);
      }
      acc.count++;
      return acc;
    }, { income: 0, expense: 0, count: 0 });

    return stats;
  };

  const stats = calculateStats();

  return (
    <MainLayout>
      <div className={`flex flex-col flex-1 ${isDarkMode ? 'bg-[#121212]' : 'bg-[#F7F7FB]'}`}>
        <div className={`px-4 py-4 border-b flex justify-between items-center ${isDarkMode ? 'bg-[#181818] border-[#4d4d4d]' : 'bg-white border-[#E5E5E5]'}`}>
          <button onClick={() => router.back()}>
            <IoArrowBack size={24} color={isDarkMode ? '#fff' : '#000'} />
          </button>
          <h1 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-[#000]'}`}>История операций</h1>
          <button className="w-10 h-10 flex items-center justify-center">
            <IoFilter size={20} color="#1A889F" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pb-5">
          {/* Search */}
          <div className="p-4">
            <div className={`flex items-center px-4 rounded-xl border ${isDarkMode ? 'bg-[#181818] border-[#4d4d4d]' : 'bg-white border-[#E5E5E5]'}`}>
              <IoSearch size={20} color={isDarkMode ? '#b3b3b3' : '#666'} className="mr-2" />
              <input
                type="text"
                className={`flex-1 py-3.5 text-base bg-transparent ${isDarkMode ? 'text-white placeholder-[#666]' : 'text-[#000]'}`}
                placeholder="Поиск операций..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')}>
                  <IoClose size={20} color={isDarkMode ? '#b3b3b3' : '#666'} />
                </button>
              )}
            </div>
          </div>

          {/* Period Filter */}
          <div className="px-4 mb-4">
            <h3 className={`text-sm font-semibold mb-2 ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>Период</h3>
            <div className="flex gap-2 overflow-x-auto">
              {periods.map((period) => (
                <button
                  key={period.id}
                  className={`px-4 py-2 rounded-2xl text-sm font-medium whitespace-nowrap ${
                    selectedPeriod === period.id
                      ? 'bg-primary text-white'
                      : (isDarkMode ? 'bg-[#181818] text-[#b3b3b3] border border-[#4d4d4d]' : 'bg-white text-[#666] border border-[#E5E5E5]')
                  }`}
                  onClick={() => setSelectedPeriod(period.id)}
                >
                  {period.label}
                </button>
              ))}
            </div>
          </div>

          {/* Card Filter */}
          <div className="px-4 mb-4">
            <h3 className={`text-sm font-semibold mb-2 ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>Карта</h3>
            <div className="flex gap-2 overflow-x-auto">
              {cards.map((card) => (
                <button
                  key={card.id}
                  className={`px-4 py-2 rounded-2xl text-sm font-medium whitespace-nowrap ${
                    selectedCard === card.id
                      ? 'bg-primary text-white'
                      : (isDarkMode ? 'bg-[#181818] text-[#b3b3b3] border border-[#4d4d4d]' : 'bg-white text-[#666] border border-[#E5E5E5]')
                  }`}
                  onClick={() => setSelectedCard(card.id)}
                >
                  {card.label}
                </button>
              ))}
            </div>
          </div>

          {/* Statistics */}
          <div className="px-4 mb-6">
            <div className={`rounded-2xl p-5 flex justify-between shadow-sm ${isDarkMode ? 'bg-[#181818] border border-[#4d4d4d]' : 'bg-white'}`}>
              <div className="text-center">
                <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-[#000]'}`}>{stats.count}</p>
                <p className={`text-xs ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>Операций</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-success">+{stats.income.toLocaleString('ru-RU')} ₽</p>
                <p className={`text-xs ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>Доходы</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-danger">-{stats.expense.toLocaleString('ru-RU')} ₽</p>
                <p className={`text-xs ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>Расходы</p>
              </div>
            </div>
          </div>

          {/* Transactions List */}
          <div className="mb-6">
            <div className="flex justify-between items-center px-4 mb-3">
              <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-[#000]'}`}>Операции</h2>
              <span className={`text-sm ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>{filteredTransactions.length} операций</span>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className={`mx-4 rounded-2xl p-10 text-center ${isDarkMode ? 'bg-[#181818] border border-[#4d4d4d]' : 'bg-white'}`}>
                <IoReceiptOutline size={48} color={isDarkMode ? '#666' : '#999'} className="mx-auto mb-3" />
                <p className={`text-base font-semibold mb-2 ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>Операции не найдены</p>
                <p className={`text-sm ${isDarkMode ? 'text-[#666]' : 'text-[#999]'}`}>Попробуйте изменить параметры поиска{'\n'}или выберите другой период</p>
              </div>
            ) : (
              <div className="px-4 space-y-2">
                {filteredTransactions.map((transaction) => (
                  <button
                    key={transaction.id}
                    className={`rounded-xl p-4 flex justify-between items-center w-full shadow-sm ${isDarkMode ? 'bg-[#181818] border border-[#4d4d4d]' : 'bg-white'}`}
                  >
                    <div className="flex items-center flex-1">
                      <div
                       className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                          transaction.type === 'income' ? (isDarkMode ? 'bg-[#1a3d1a]' : 'bg-[#E8F5E8]') : (isDarkMode ? 'bg-[#3d1a1a]' : 'bg-[#FFE8E8]')
                         }`}
                      >
                        {transaction.type === 'income' ? (
                          <IoArrowDown size={16} color="#159E3A" />
                        ) : (
                          <IoArrowUp size={16} color="#FF3B30" />
                        )}
                      </div>
                      <div className="flex-1 text-left">
                        <p className={`text-base font-semibold mb-0.5 ${isDarkMode ? 'text-white' : 'text-[#000]'}`}>{transaction.title}</p>
                        <p className={`text-sm mb-0.5 ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>{transaction.category}</p>
                        <p className={`text-xs ${isDarkMode ? 'text-[#666]' : 'text-[#999]'}`}>{transaction.date} в {transaction.time}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className={`text-base font-bold mb-1 ${
                        transaction.type === 'income' ? 'text-success' : 'text-danger'
                      }`}>
                        {transaction.amount}
                      </p>
                      <div
                        className="px-2 py-0.5 rounded-lg inline-block"
                        style={{ backgroundColor: getStatusColor(transaction.status) + '20' }}
                      >
                        <span className="text-[10px] font-semibold" style={{ color: getStatusColor(transaction.status) }}>
                          {getStatusText(transaction.status)}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Export Section */}
          <div className="flex gap-3 px-4 mb-6">
            <button className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl shadow-sm ${isDarkMode ? 'bg-[#181818] border border-[#4d4d4d]' : 'bg-white'}`}>
              <IoDownloadOutline size={20} color="#1A889F" />
              <span className="text-sm font-semibold text-primary">Экспорт выписки</span>
            </button>
            <button className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl shadow-sm ${isDarkMode ? 'bg-[#181818] border border-[#4d4d4d]' : 'bg-white'}`}>
              <IoShareOutline size={20} color="#1A889F" />
              <span className="text-sm font-semibold text-primary">Поделиться</span>
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
