import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import MainLayout from '../../src/components/MainLayout';
import { IoArrowBack, IoCarOutline, IoFastFoodOutline, IoMedicalOutline, IoCardOutline, IoSwapHorizontalOutline, IoGameControllerOutline, IoReceiptOutline } from 'react-icons/io5';
import { accountsAPI } from '../../src/utils/api';
import { useTheme } from '../../src/context/ThemeContext';

const categoryIcons = {
  transport: IoCarOutline,
  food: IoFastFoodOutline,
  health: IoMedicalOutline,
  salary: IoCardOutline,
  transfer: IoSwapHorizontalOutline,
  entertainment: IoGameControllerOutline,
};

const categoryColors = {
  transport: '#FF6B6B',
  food: '#4ECDC4',
  health: '#45B7D1',
  salary: '#96CEB4',
  transfer: '#FFA726',
  entertainment: '#AB47BC',
};

export default function Operations() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const [filter, setFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('transactions');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const accounts = await accountsAPI.getAccounts().catch(() => null);
      if (!accounts || accounts.length === 0) {
        setData([]);
        return;
      }

      const allHistory = await Promise.all(
        accounts.map(acc => accountsAPI.getAccountHistory(acc.id).catch(() => []))
      );
      const transactions = allHistory.flat();

      setData(transactions.map(tx => {
        const amount = parseFloat(tx.amount || tx.value || 0);
        const txDate = tx.date || tx.createdAt || tx.timestamp || '';
        const parsedDate = txDate ? new Date(txDate) : null;
        const isValidDate = parsedDate && !isNaN(parsedDate.getTime());
        return {
          id: tx.id,
          title: tx.description || tx.type || 'Операция',
          subtitle: tx.category || tx.transferType || 'Прочее',
          amountRaw: amount,
          amount: `${amount >= 0 ? '+' : ''}${Math.abs(amount).toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₽`,
          type: amount >= 0 ? 'income' : 'expense',
          date: isValidDate ? parsedDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' }) : '',
          time: isValidDate ? parsedDate.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) : '',
          category: tx.category || 'transfer'
        };
      }));
    } catch (error) {
      console.error('Error loading transactions:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = data.filter(d =>
    filter === 'all' ? true : (filter === 'income' ? d.type === 'income' : d.type === 'expense')
  );

  const getTotalAmount = () => {
    const expenses = data.filter(d => d.type === 'expense')
      .reduce((sum, item) => sum + (item.amountRaw || 0), 0);
    const incomes = data.filter(d => d.type === 'income')
      .reduce((sum, item) => sum + (item.amountRaw || 0), 0);
    return { expenses, incomes, total: incomes - expenses };
  };

  const totals = getTotalAmount();

  if (loading) {
    return (
      <MainLayout>
        <div className={`flex-1 flex items-center justify-center ${isDarkMode ? 'bg-[#121212]' : 'bg-[#F8FAFD]'}`}>
          <div className={`animate-spin rounded-full h-12 w-12 border-4 border-t-transparent ${isDarkMode ? 'border-[#1A889F]' : 'border-primary'}`} />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className={`flex flex-col flex-1 ${isDarkMode ? 'bg-[#121212]' : 'bg-[#F8FAFD]'}`}>
        <div className={`px-5 py-4 border-b flex items-center gap-4 ${isDarkMode ? 'bg-[#181818] border-[#4d4d4d]' : 'bg-white border-[#F0F0F5]'}`}>
          <button onClick={() => router.back()}>
            <IoArrowBack size={24} color={isDarkMode ? '#fff' : '#000'} />
          </button>
          <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-[#1A1A1A]'}`}>Операции</h1>
        </div>

        <div className={`flex px-4 py-2 border-b ${isDarkMode ? 'bg-[#181818] border-[#4d4d4d]' : 'bg-white border-[#E5E5E5]'}`}>
          <button
            className={`flex-1 py-3 rounded-lg mx-1 font-semibold text-sm ${
              activeTab === 'transactions' ? 'bg-primary text-white' : (isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]')
            }`}
            onClick={() => setActiveTab('transactions')}
          >
            Транзакции
          </button>
          <button
            className={`flex-1 py-3 rounded-lg mx-1 font-semibold text-sm ${
              activeTab === 'analytics' ? 'bg-primary text-white' : (isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]')
            }`}
            onClick={() => setActiveTab('analytics')}
          >
            Аналитика
          </button>
        </div>

        <div className="overflow-y-auto">
          {activeTab === 'transactions' ? (
            <>
              <div className="px-4 my-4 flex gap-2 overflow-x-auto">
                <button
                  className={`px-5 py-3 rounded-[20px] text-sm font-medium whitespace-nowrap ${
                    filter === 'all' ? 'bg-primary text-white' : (isDarkMode ? 'bg-[#181818] text-[#b3b3b3] border border-[#4d4d4d]' : 'bg-white text-[#666] border border-[#E5E5E5]')
                  }`}
                  onClick={() => setFilter('all')}
                >
                  Все операции
                </button>
                <button
                  className={`px-5 py-3 rounded-[20px] text-sm font-medium whitespace-nowrap ${
                    filter === 'income' ? 'bg-primary text-white' : (isDarkMode ? 'bg-[#181818] text-[#b3b3b3] border border-[#4d4d4d]' : 'bg-white text-[#666] border border-[#E5E5E5]')
                  }`}
                  onClick={() => setFilter('income')}
                >
                  Доходы
                </button>
                <button
                  className={`px-5 py-3 rounded-[20px] text-sm font-medium whitespace-nowrap ${
                    filter === 'expense' ? 'bg-primary text-white' : (isDarkMode ? 'bg-[#181818] text-[#b3b3b3] border border-[#4d4d4d]' : 'bg-white text-[#666] border border-[#E5E5E5]')
                  }`}
                  onClick={() => setFilter('expense')}
                >
                  Расходы
                </button>
              </div>

              <div className="px-4 mb-5">
                <h2 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-[#000]'}`}>
                  {filter === 'all' ? 'Все операции' : filter === 'income' ? 'Доходы' : 'Расходы'} ({filtered.length})
                </h2>
                {filtered.length === 0 ? (
                  <div className={`rounded-xl p-8 text-center ${isDarkMode ? 'bg-[#181818] border border-[#4d4d4d]' : 'bg-white'}`}>
                    <IoReceiptOutline size={40} color={isDarkMode ? '#666' : '#999'} className="mx-auto mb-3" />
                    <p className={`text-base font-semibold mb-1 ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>Операций пока нет</p>
                    <p className={`text-sm ${isDarkMode ? 'text-[#666]' : 'text-[#999]'}`}>Совершите перевод, чтобы увидеть историю</p>
                  </div>
                ) : (
                  filtered.map((item) => {
                    const Icon = categoryIcons[item.category];
                    return (
                      <div key={item.id} className={`rounded-xl p-4 mb-2 shadow-sm ${isDarkMode ? 'bg-[#181818] border border-[#4d4d4d]' : 'bg-white'}`}>
                        <div className="flex items-center">
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                            style={{ backgroundColor: categoryColors[item.category] }}
                          >
                            {Icon && <Icon size={18} color="#fff" />}
                          </div>
                          <div className="flex-1">
                            <p className={`text-base font-semibold ${isDarkMode ? 'text-white' : 'text-[#000]'}`}>{item.title}</p>
                            <p className={`text-sm ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>{item.subtitle}</p>
                            <p className={`text-xs ${isDarkMode ? 'text-[#666]' : 'text-[#999]'}`}>{item.date} в {item.time}</p>
                          </div>
                          <div className="text-right">
                            <p className={`text-base font-bold ${item.type === 'income' ? 'text-success' : 'text-danger'}`}>
                              {item.amount}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </>
          ) : (
            <div className="px-4 mb-5">
              <div className={`flex rounded-2xl p-5 mb-5 shadow-sm ${isDarkMode ? 'bg-[#181818] border border-[#4d4d4d]' : 'bg-white'}`}>
                <div className="flex-1 text-center">
                  <p className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-[#000]'}`}>+{totals.incomes.toLocaleString()} ₽</p>
                  <p className={`text-xs ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>Доходы</p>
                </div>
                <div className="flex-1 text-center">
                  <p className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-[#000]'}`}>-{totals.expenses.toLocaleString()} ₽</p>
                  <p className={`text-xs ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>Расходы</p>
                </div>
                <div className="flex-1 text-center">
                  <p className={`text-base font-bold ${totals.total >= 0 ? 'text-success' : 'text-danger'}`}>
                    {totals.total >= 0 ? '+' : ''}{totals.total.toLocaleString()} ₽
                  </p>
                  <p className={`text-xs ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>Итого</p>
                </div>
              </div>

              <h2 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-[#000]'}`}>Статистика за месяц</h2>
              <div className={`flex rounded-2xl p-5 shadow-sm ${isDarkMode ? 'bg-[#181818] border border-[#4d4d4d]' : 'bg-white'}`}>
                <div className="flex-1 text-center">
                  <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-[#000]'}`}>{data.length}</p>
                  <p className={`text-xs ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>Операций</p>
                </div>
                <div className="flex-1 text-center">
                  <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-[#000]'}`}>{data.length > 0 ? Math.round(Math.abs(totals.expenses / data.filter(d => d.type === 'expense').length)).toLocaleString('ru-RU') : 0} ₽</p>
                  <p className={`text-xs ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>Средний чек</p>
                </div>
                <div className="flex-1 text-center">
                  <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-[#000]'}`}>{new Set(data.map(d => d.date)).size}</p>
                  <p className={`text-xs ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>Дней с тратами</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
