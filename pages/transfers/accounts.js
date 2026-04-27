import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import MainLayout from '../../src/components/MainLayout';
import { IoClose, IoSwapVertical, IoChevronDown } from 'react-icons/io5';
import { accountsAPI, transfersAPI } from '../../src/utils/api';
import { useTheme } from '../../src/context/ThemeContext';

const CURRENCY_SYMBOLS = { RUB: '₽', USD: '$', EUR: '€' };
const CURRENCY_COLORS = { RUB: '#1A889F', USD: '#159E3A', EUR: '#E5A100' };

export default function TransferAccounts() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const [amount, setAmount] = useState('');
  const [fromAccountId, setFromAccountId] = useState(null);
  const [toAccountId, setToAccountId] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      setLoading(true);
      const accountsData = await accountsAPI.getAccounts().catch(() => null);
      
      if (accountsData && accountsData.length > 0) {
        setAccounts(accountsData.map(acc => ({
          id: acc.id,
          name: (acc.currency?.symbol && acc.currency.symbol !== '?') ? `Счёт ${acc.currency.symbol}` : `Счёт ${CURRENCY_SYMBOLS[acc.currency?.currencyCode] || '₽'}`,
          amount: parseFloat(acc.balance || 0),
          currency: acc.currency?.currencyCode || 'RUB',
          color: CURRENCY_COLORS[acc.currency?.currencyCode] || '#1A889F',
          symbol: (acc.currency?.symbol && acc.currency.symbol !== '?') ? acc.currency.symbol : CURRENCY_SYMBOLS[acc.currency?.currencyCode] || '₽',
        })));

        if (accountsData.length >= 2) {
          setFromAccountId(accountsData[0].id);
          setToAccountId(accountsData[1].id);
        } else if (accountsData.length === 1) {
          setFromAccountId(accountsData[0].id);
        }
      }
    } catch (error) {
      console.error('Error loading accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const swapAccounts = () => {
    const temp = fromAccountId;
    setFromAccountId(toAccountId);
    setToAccountId(temp);
  };

  const handleTransfer = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Введите сумму для перевода');
      return;
    }

    const amountNum = parseFloat(amount);
    const fromAcc = accounts.find(a => a.id === fromAccountId);

    if (!fromAcc) {
      alert('Выберите счёт для списания');
      return;
    }

    if (amountNum > fromAcc.amount) {
      alert('Недостаточно средств на счете');
      return;
    }

    try {
      await transfersAPI.transferBetweenAccounts({
        fromAccountId,
        toAccountId,
        amount: amountNum
      });
      
      router.push(`/main/success?amount=${amountNum.toFixed(2)}&type=Перевод между счетами`);
    } catch (error) {
      const errorMessage = error.message || 'Операция отклонена системой безопасности';
      
      if (error.status === 400 || error.status === 403 || error.status === 429) {
        router.push(`/main/failed?amount=${amountNum.toFixed(2)}&type=Перевод между счетами&reason=${encodeURIComponent(errorMessage)}`);
      } else {
        alert(errorMessage);
      }
    }
  };

  const isFormValid = amount && parseFloat(amount) > 0 && fromAccountId && toAccountId && fromAccountId !== toAccountId;

  if (loading) {
    return (
      <MainLayout>
        <div className={`flex-1 flex items-center justify-center ${isDarkMode ? 'bg-[#121212]' : 'bg-[#F7F7FB]'}`}>
          <div className={`animate-spin rounded-full h-12 w-12 border-4 border-t-transparent ${isDarkMode ? 'border-[#1A889F]' : 'border-primary'}`} />
        </div>
      </MainLayout>
    );
  }

  const fromAcc = accounts.find(a => a.id === fromAccountId);
  const toAcc = accounts.find(a => a.id === toAccountId);

  const AccountCard = ({ acc, label, onClick }) => {
    if (!acc) {
      return (
        <button
          onClick={onClick}
          className={`w-full p-5 rounded-2xl border-2 border-dashed border-primary/40 shadow-sm ${isDarkMode ? 'bg-[#181818]' : 'bg-[#F8F5FF]'}`}
        >
          <p className={`text-base font-semibold ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>Выберите счёт</p>
        </button>
      );
    }
    return (
      <button
        onClick={onClick}
        className={`w-full p-5 rounded-2xl border-2 border-primary shadow-sm text-left ${isDarkMode ? 'bg-[#181818]' : 'bg-[#F8F5FF]'}`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: acc.color }} />
            <span className={`text-base font-semibold ${isDarkMode ? 'text-white' : 'text-[#000]'}`}>{acc.name}</span>
          </div>
          <IoChevronDown size={18} color={isDarkMode ? '#b3b3b3' : '#666'} />
        </div>
        <p className={`text-sm ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>
          Доступно: {acc.amount.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {acc.symbol}
        </p>
      </button>
    );
  };

  const AccountPicker = ({ show, onClose, onSelect, excludeId }) => {
    if (!show) return null;
    const filtered = accounts.filter(a => a.id !== excludeId);
    return (
      <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
        <div className="absolute inset-0 bg-black/50" />
        <div
          className={`relative w-full max-w-lg rounded-t-2xl p-5 pb-8 ${isDarkMode ? 'bg-[#181818]' : 'bg-white'}`}
          onClick={e => e.stopPropagation()}
        >
          <div className={`w-10 h-1 rounded-full mx-auto mb-4 ${isDarkMode ? 'bg-[#4d4d4d]' : 'bg-[#E5E5E5]'}`} />
          <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-[#000]'}`}>Выберите счёт</h3>
          <div className="space-y-2">
            {filtered.map(acc => (
              <button
                key={acc.id}
                className={`w-full p-4 rounded-xl flex items-center justify-between ${isDarkMode ? 'bg-[#121212] border border-[#4d4d4d]' : 'bg-[#F8FAFD] border border-[#E5E5E5]'}`}
                onClick={() => { onSelect(acc.id); onClose(); }}
              >
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: acc.color }} />
                  <span className={`text-base font-semibold ${isDarkMode ? 'text-white' : 'text-[#000]'}`}>{acc.name}</span>
                </div>
                <span className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-[#000]'}`}>
                  {acc.amount.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {acc.symbol}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <MainLayout>
      <div className={`flex flex-col flex-1 ${isDarkMode ? 'bg-[#121212]' : 'bg-[#F7F7FB]'}`}>
        <div className={`px-5 py-4 border-b flex justify-between items-center ${isDarkMode ? 'bg-[#181818] border-[#4d4d4d]' : 'bg-white border-[#E5E5E5]'}`}>
          <h1 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-[#000]'}`}>Между счетами</h1>
          <button onClick={() => router.back()}>
            <IoClose size={24} color={isDarkMode ? '#fff' : '#000'} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 pb-5">
          {/* Списать с */}
          <div className="mb-3">
            <label className={`text-base font-medium mb-3 block px-1 ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>Списать с</label>
            <AccountCard acc={fromAcc} onClick={() => setShowFromPicker(true)} />
            {fromAcc && (
              <div className="mt-3">
                <input
                  type="text"
                  value={amount ? `${amount} ${fromAcc.symbol}` : ''}
                  onChange={(e) => {
                    let raw = e.target.value.replace(new RegExp(`\\s*${fromAcc.symbol.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`), '');
                    raw = raw.replace(/[^\d,.]/g, '');
                    raw = raw.replace(',', '.');
                    const parts = raw.split('.');
                    if (parts.length > 2) {
                      raw = parts[0] + '.' + parts[1];
                    }
                    setAmount(raw);
                  }}
                  className={`w-full text-[32px] font-bold bg-transparent focus:outline-none ${isDarkMode ? 'text-white placeholder-[#666]' : 'text-[#000]'}`}
                  placeholder={fromAcc.symbol}
                />
              </div>
            )}
          </div>

          {/* Кнопка смены */}
          <div className="flex justify-center my-4">
            <button
              onClick={swapAccounts}
              className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg hover:bg-[#5A1FD8] transition-all duration-300 active:scale-90"
            >
              <IoSwapVertical size={24} color="#fff" />
            </button>
          </div>

          {/* Зачислить на */}
          <div className="mb-6">
            <label className={`text-base font-medium mb-3 block px-1 ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>Зачислить на</label>
            <AccountCard acc={toAcc} onClick={() => setShowToPicker(true)} />
          </div>

          <button
            className={`w-full p-4 rounded-xl text-base font-bold text-white ${
              isFormValid ? 'bg-primary' : (isDarkMode ? 'bg-[#4d4d4d] text-[#999] cursor-not-allowed' : 'bg-[#B9B6FF] cursor-not-allowed')
            }`}
            disabled={!isFormValid}
            onClick={handleTransfer}
          >
            Перевести {amount ? `${parseFloat(amount).toFixed(2)} ${fromAcc?.symbol || '₽'}` : ''}
          </button>
        </div>

        <AccountPicker
          show={showFromPicker}
          onClose={() => setShowFromPicker(false)}
          onSelect={(id) => { setFromAccountId(id); if (id === toAccountId) setToAccountId(null); }}
          excludeId={fromAccountId}
        />
        <AccountPicker
          show={showToPicker}
          onClose={() => setShowToPicker(false)}
          onSelect={(id) => { setToAccountId(id); if (id === fromAccountId) setFromAccountId(null); }}
          excludeId={toAccountId}
        />
      </div>
    </MainLayout>
  );
}
