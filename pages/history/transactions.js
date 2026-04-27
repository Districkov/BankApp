import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import MainLayout from '../../src/components/MainLayout';
import { IoArrowBack, IoSearch, IoClose, IoArrowDown, IoArrowUp, IoReceiptOutline } from 'react-icons/io5';
import { IoFilter } from 'react-icons/io5';
import { accountsAPI } from '../../src/utils/api';
import { useTheme } from '../../src/context/ThemeContext';

const CURRENCY_SYMBOLS = { RUB: '₽', USD: '$', EUR: '€' };

export default function TransactionHistory() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedAccountId, setSelectedAccountId] = useState('all');
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  const periods = [
    { id: 'week', label: 'Неделя' },
    { id: 'month', label: 'Месяц' },
    { id: 'quarter', label: 'Квартал' },
    { id: 'year', label: 'Год' }
  ];

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      const accountsData = await accountsAPI.getAccounts().catch(() => []);
      setAccounts(accountsData || []);
      if (accountsData && accountsData.length > 0) {
        setSelectedAccountId('all');
      }
    } catch {}
  };

  useEffect(() => {
    if (accounts.length > 0) {
      loadTransactions();
    }
  }, [selectedPeriod, selectedAccountId, accounts]);

  const loadTransactions = async () => {
    try {
      setLoading(true);

      const accountsToFetch = selectedAccountId === 'all'
        ? accounts
        : accounts.filter(a => a.id === selectedAccountId);

      const allHistory = await Promise.all(
        accountsToFetch.map(acc => accountsAPI.getAccountHistory(acc.id).catch(() => []))
      );
      const rawTransactions = allHistory.flat();

      const accountMap = {};
      accounts.forEach(acc => {
        accountMap[acc.id] = {
          code: acc.currency?.currencyCode || 'RUB',
          symbol: acc.currency?.symbol || '₽',
        };
      });

      const mapped = rawTransactions.map(tx => {
        const amount = parseFloat(tx.amountChange ?? tx.amount ?? tx.value ?? 0);
        const txDate = tx.createdAt || tx.date || tx.timestamp || '';
        const parsedDate = txDate ? new Date(txDate) : null;
        const isValidDate = parsedDate && !isNaN(parsedDate.getTime());
        const accInfo = accountMap[tx.accountId] || {};
        const recipientAccInfo = accountMap[tx.recipientAccountId] || {};
        const currencySymbol = accInfo.symbol || '₽';

        const reason = tx.reason || tx.transferType || '';
        const isTransferIn = reason === 'TRANSFER_IN';
        const isTransferOut = reason === 'TRANSFER_OUT';
        const isOwnTransfer = reason === 'OWN' || tx.transferType === 'OWN';

        let title = tx.description || 'Операция';
        let category = 'Прочее';
        let displayAmount = Math.abs(amount);
        let type = amount >= 0 ? 'income' : 'expense';

        if (isTransferIn) {
          title = 'Перевод';
          category = 'Входящий';
          type = 'income';
        } else if (isTransferOut) {
          title = 'Перевод';
          category = 'Исходящий';
          type = 'expense';
        } else if (isOwnTransfer) {
          if (amount < 0) {
            title = `Перевод на счёт ${recipientAccInfo.symbol || currencySymbol}`;
            category = 'Между счетами';
            type = 'expense';
          } else {
            title = 'Перевод';
            category = 'На основной счёт';
            type = 'income';
          }
        }

        return {
          id: tx.id,
          title,
          category,
          amountRaw: displayAmount,
          amount: `${type === 'income' ? '+' : '-'}${displayAmount.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currencySymbol}`,
          type,
          status: tx.status || 'completed',
          date: isValidDate ? parsedDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' }) : '',
          time: isValidDate ? parsedDate.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) : '',
          accountId: tx.accountId,
        };
      });

      setTransactions(mapped);
    } catch (error) {
      console.error('Error loading transactions:', error);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const now = new Date();
  const filterByPeriod = (tx) => {
    if (selectedPeriod === 'all') return true;
    const txDateStr = tx.date;
    if (!txDateStr) return true;
    const txDate = new Date(txDateStr.replace(/(\d+)\s([а-яё]+)\s(\d+)/i, '$2 $1, $3'));
    if (isNaN(txDate.getTime())) return true;

    const diffDays = (now - txDate) / (1000 * 60 * 60 * 24);
    switch (selectedPeriod) {
      case 'week': return diffDays <= 7;
      case 'month': return diffDays <= 30;
      case 'quarter': return diffDays <= 90;
      case 'year': return diffDays <= 365;
      default: return true;
    }
  };

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = tx.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tx.category?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': case 'CONFIRMED': return '#159E3A';
      case 'pending': case 'CREATED': return '#FFA726';
      case 'failed': case 'REJECTED': case 'CANCELLED': return '#FF3B30';
      default: return '#666';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': case 'CONFIRMED': return 'Завершено';
      case 'pending': case 'CREATED': return 'Ожидание';
      case 'failed': case 'REJECTED': return 'Отклонено';
      case 'CANCELLED': return 'Отменено';
      default: return status || 'Завершено';
    }
  };

  const stats = filteredTransactions.reduce((acc, tx) => {
    const val = tx.amountRaw || 0;
    if (tx.type === 'income') {
      acc.income += val;
    } else {
      acc.expense += Math.abs(val);
    }
    acc.count++;
    return acc;
  }, { income: 0, expense: 0, count: 0 });

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
                className={`flex-1 py-3.5 text-base bg-transparent focus:outline-none ${isDarkMode ? 'text-white placeholder-[#666]' : 'text-[#000] placeholder-[#999]'}`}
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

          {/* Account Filter */}
          <div className="px-4 mb-4">
            <h3 className={`text-sm font-semibold mb-2 ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>Счёт</h3>
            <div className="flex gap-2 overflow-x-auto">
              <button
                className={`px-4 py-2 rounded-2xl text-sm font-medium whitespace-nowrap ${
                  selectedAccountId === 'all'
                    ? 'bg-primary text-white'
                    : (isDarkMode ? 'bg-[#181818] text-[#b3b3b3] border border-[#4d4d4d]' : 'bg-white text-[#666] border border-[#E5E5E5]')
                }`}
                onClick={() => setSelectedAccountId('all')}
              >
                Все счета
              </button>
              {accounts.map((acc) => (
                <button
                  key={acc.id}
                  className={`px-4 py-2 rounded-2xl text-sm font-medium whitespace-nowrap ${
                    selectedAccountId === acc.id
                      ? 'bg-primary text-white'
                      : (isDarkMode ? 'bg-[#181818] text-[#b3b3b3] border border-[#4d4d4d]' : 'bg-white text-[#666] border border-[#E5E5E5]')
                  }`}
                  onClick={() => setSelectedAccountId(acc.id)}
                >
                  {acc.currency?.symbol ? `${acc.currency.symbol}` : '₽'} {parseFloat(acc.balance || 0).toLocaleString('ru-RU', {maximumFractionDigits: 0})}
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
                <p className="text-lg font-bold text-success">+{stats.income.toLocaleString('ru-RU', { maximumFractionDigits: 2 })} ₽</p>
                <p className={`text-xs ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>Доходы</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-danger">-{stats.expense.toLocaleString('ru-RU', { maximumFractionDigits: 2 })} ₽</p>
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
                <div className={`animate-spin rounded-full h-12 w-12 border-4 border-t-transparent ${isDarkMode ? 'border-[#1A889F]' : 'border-primary'}`} />
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className={`mx-4 rounded-2xl p-10 text-center ${isDarkMode ? 'bg-[#181818] border border-[#4d4d4d]' : 'bg-white'}`}>
                <IoReceiptOutline size={48} color={isDarkMode ? '#666' : '#999'} className="mx-auto mb-3" />
                <p className={`text-base font-semibold mb-2 ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>Операции не найдены</p>
                <p className={`text-sm ${isDarkMode ? 'text-[#666]' : 'text-[#999]'}`}>Попробуйте изменить параметры поиска или выберите другой период</p>
              </div>
            ) : (
              <div className="px-4 space-y-2">
                {filteredTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className={`rounded-xl p-4 flex justify-between items-center shadow-sm ${isDarkMode ? 'bg-[#181818] border border-[#4d4d4d]' : 'bg-white'}`}
                  >
                    <div className="flex items-center flex-1">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                          tx.type === 'income' ? (isDarkMode ? 'bg-[#1a3d1a]' : 'bg-[#E8F5E8]') : (isDarkMode ? 'bg-[#3d1a1a]' : 'bg-[#FFE8E8]')
                        }`}
                      >
                        {tx.type === 'income' ? (
                          <IoArrowDown size={16} color="#159E3A" />
                        ) : (
                          <IoArrowUp size={16} color="#FF3B30" />
                        )}
                      </div>
                      <div className="flex-1 text-left">
                        <p className={`text-base font-semibold mb-0.5 ${isDarkMode ? 'text-white' : 'text-[#000]'}`}>{tx.title}</p>
                        <p className={`text-sm mb-0.5 ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>{tx.category}</p>
                        {tx.date && <p className={`text-xs ${isDarkMode ? 'text-[#666]' : 'text-[#999]'}`}>{tx.date}{tx.time ? ` в ${tx.time}` : ''}</p>}
                      </div>
                    </div>

                    <div className="text-right">
                      <p className={`text-base font-bold mb-1 ${tx.type === 'income' ? 'text-success' : 'text-danger'}`}>
                        {tx.amount}
                      </p>
                      <div
                        className="px-2 py-0.5 rounded-lg inline-block"
                        style={{ backgroundColor: getStatusColor(tx.status) + '20' }}
                      >
                        <span className="text-[10px] font-semibold" style={{ color: getStatusColor(tx.status) }}>
                          {getStatusText(tx.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
