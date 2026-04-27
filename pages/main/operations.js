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

      const accountMap = {};
      accounts.forEach(acc => {
        accountMap[acc.id] = {
          code: acc.currency?.currencyCode || 'RUB',
          symbol: (acc.currency?.symbol && acc.currency.symbol !== '?') ? acc.currency.symbol : (acc.currency?.currencyCode === 'USD' ? '$' : acc.currency?.currencyCode === 'EUR' ? '€' : '₽'),
        };
      });

      const mapped = transactions.map(tx => {
        const amount = parseFloat(tx.amountChange ?? tx.amount ?? tx.value ?? 0);
        const txDate = tx.createdAt || tx.date || tx.timestamp || '';
        let parsedDate = null;
        let dateObj = 0;
        if (txDate) {
          parsedDate = new Date(txDate);
          if (isNaN(parsedDate.getTime())) {
            const parts = String(txDate).match(/(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2}):(\d{2})/);
            if (parts) {
              parsedDate = new Date(+parts[1], +parts[2]-1, +parts[3], +parts[4], +parts[5], +parts[6]);
            }
          }
          if (parsedDate && !isNaN(parsedDate.getTime())) {
            dateObj = parsedDate.getTime();
          }
        }
        const isValidDate = dateObj > 0;

        const reason = tx.reason || tx.transferType || '';
        const accInfo = accountMap[tx.accountId] || {};
        const recipientAccInfo = accountMap[tx.recipientAccountId] || {};
        const currencySymbol = accInfo.symbol || '₽';

        const isTransferIn = reason === 'TRANSFER_IN';
        const isTransferOut = reason === 'TRANSFER_OUT';
        const isOwnTransfer = reason === 'OWN' || tx.transferType === 'OWN';

        let title = tx.description || 'Операция';
        let subtitle = 'Прочее';
        let displayAmount = Math.abs(amount);
        let type = amount >= 0 ? 'income' : 'expense';

        if (isTransferIn) {
          title = 'Перевод';
          subtitle = 'Входящий';
          type = 'income';
        } else if (isTransferOut) {
          title = 'Перевод';
          subtitle = 'Исходящий';
          type = 'expense';
        } else if (isOwnTransfer) {
          if (amount < 0) {
            title = `Перевод на счёт ${recipientAccInfo.symbol || currencySymbol}`;
            subtitle = 'Между счетами';
            type = 'expense';
          } else {
            title = 'Перевод';
            subtitle = 'На основной счёт';
            type = 'income';
          }
        }

        return {
          id: tx.id,
          title,
          subtitle,
          amountRaw: displayAmount,
          amount: `${type === 'income' ? '+' : '-'}${displayAmount.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currencySymbol}`,
          type,
          date: isValidDate ? parsedDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' }) : '',
          time: isValidDate ? parsedDate.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) : '',
          dateObj: isValidDate ? parsedDate.getTime() : 0,
          category: 'transfer'
        };
      });

      mapped.sort((a, b) => b.dateObj - a.dateObj);
      setData(mapped);
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
                {filtered.map((item) => {
                  const IconComponent = categoryIcons[item.category] || IoReceiptOutline;
                  const iconColor = categoryColors[item.category] || '#666';

                  return (
                    <div
                      key={item.id}
                      className={`p-4 rounded-2xl mb-3 flex flex-row justify-between items-center ${isDarkMode ? 'bg-[#181818] border border-[#4d4d4d]' : 'bg-white border border-[#F0F0F5]'} shadow-sm`}
                    >
                      <div className="flex flex-row items-center gap-3">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: iconColor + '20' }}>
                          <IconComponent size={24} color={iconColor} />
                        </div>
                        <div>
                          <p className={`text-base font-semibold ${isDarkMode ? 'text-white' : 'text-[#000]'}`}>{item.title}</p>
                          <p className={`text-sm ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>{item.subtitle} · {item.date} {item.time}</p>
                        </div>
                      </div>
                      <span className={`text-base font-bold ${item.type === 'income' ? 'text-success' : 'text-danger'}`}>
                        {item.amount}
                      </span>
                    </div>
                  );
                })}

                {filtered.length === 0 && (
                  <div className={`p-8 text-center rounded-2xl ${isDarkMode ? 'bg-[#181818] border border-[#4d4d4d]' : 'bg-white'}`}>
                    <p className={`text-base ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>Нет операций</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="p-4">
              <div className={`p-5 rounded-2xl mb-4 ${isDarkMode ? 'bg-[#181818] border border-[#4d4d4d]' : 'bg-white border border-[#F0F0F5]'} shadow-sm`}>
                <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-[#1A1A1A]'}`}>Обзор</h3>
                <div className="flex flex-row justify-between items-center mb-3">
                  <span className={`text-sm ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>Доходы</span>
                  <span className="text-base font-bold text-success">{totals.incomes.toLocaleString('ru-RU', { minimumFractionDigits: 2 })} ₽</span>
                </div>
                <div className="flex flex-row justify-between items-center mb-3">
                  <span className={`text-sm ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>Расходы</span>
                  <span className="text-base font-bold text-danger">{totals.expenses.toLocaleString('ru-RU', { minimumFractionDigits: 2 })} ₽</span>
                </div>
                <div className={`border-t pt-3 ${isDarkMode ? 'border-[#4d4d4d]' : 'border-[#E5E5E5]'}`}>
                  <div className="flex flex-row justify-between items-center">
                    <span className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-[#1A1A1A]'}`}>Итого</span>
                    <span className={`text-base font-bold ${totals.total >= 0 ? 'text-success' : 'text-danger'}`}>
                      {totals.total >= 0 ? '+' : ''}{totals.total.toLocaleString('ru-RU', { minimumFractionDigits: 2 })} ₽
                    </span>
                  </div>
                </div>
              </div>

              <div className={`p-5 rounded-2xl ${isDarkMode ? 'bg-[#181818] border border-[#4d4d4d]' : 'bg-white border border-[#F0F0F5]'} shadow-sm`}>
                <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-[#1A1A1A]'}`}>Распределение расходов</h3>
                {data.filter(d => d.type === 'expense').map((item) => (
                  <div key={item.id} className="flex flex-row justify-between items-center py-2">
                    <span className={`text-sm ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>{item.title}</span>
                    <span className="text-sm font-semibold text-danger">{item.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
