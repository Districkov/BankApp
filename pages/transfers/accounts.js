import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import MainLayout from '../../src/components/MainLayout';
import { IoClose, IoSwapVertical } from 'react-icons/io5';
import { accountsAPI, transfersAPI } from '../../src/utils/api';
import { useTheme } from '../../src/context/ThemeContext';

export default function TransferAccounts() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const [amount, setAmount] = useState('');
  const [fromAccount, setFromAccount] = useState(null);
  const [toAccount, setToAccount] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [swapped, setSwapped] = useState(false);

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
          name: acc.currency?.symbol ? `Счёт ${acc.currency.symbol}` : 'Счёт',
          amount: parseFloat(acc.balance || 0),
          currency: acc.currency?.currencyCode || 'RUB',
          color: acc.currency?.currencyCode === 'RUB' ? '#1A889F' : acc.currency?.currencyCode === 'USD' ? '#159E3A' : '#E5A100'
        })));
        
        if (accountsData.length >= 2) {
          setFromAccount(accountsData[0].id);
          setToAccount(accountsData[1].id);
        } else if (accountsData.length === 1) {
          setFromAccount(accountsData[0].id);
        }
      }
    } catch (error) {
      console.error('Error loading accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const swapAccounts = () => {
    const temp = fromAccount;
    setFromAccount(toAccount);
    setToAccount(temp);
    setSwapped(prev => !prev);
  };

  const handleTransfer = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Введите сумму для перевода');
      return;
    }

    const amountNum = parseFloat(amount);
    const fromAcc = accounts.find(a => a.id === fromAccount);
    
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
        fromAccountId: fromAccount,
        toAccountId: toAccount,
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

  const isFormValid = amount && parseFloat(amount) > 0 && fromAccount && toAccount && fromAccount !== toAccount;

  if (loading) {
    return (
      <MainLayout>
        <div className={`flex-1 flex items-center justify-center ${isDarkMode ? 'bg-[#121212]' : 'bg-[#F7F7FB]'}`}>
          <div className={`animate-spin rounded-full h-12 w-12 border-4 border-t-transparent ${isDarkMode ? 'border-[#1A889F]' : 'border-primary'}`} />
        </div>
      </MainLayout>
    );
  }

  const fromAcc = accounts.find(a => a.id === fromAccount);
  const toAcc = accounts.find(a => a.id === toAccount);

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
            {fromAcc && (
              <div
                key={fromAcc.id + (swapped ? '-s' : '')}
                className={`w-full p-5 rounded-2xl border-2 border-primary shadow-sm transition-all duration-300 ${isDarkMode ? 'bg-[#181818]' : 'bg-[#F8F5FF]'}`}
              >
                <div className="flex items-center mb-3">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: fromAcc.color }} />
                  <span className={`text-base font-semibold ${isDarkMode ? 'text-white' : 'text-[#000]'}`}>{fromAcc.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={amount}
                    onChange={(e) => {
                      let cleaned = e.target.value.replace(/[^\d,.]/g, '');
                      cleaned = cleaned.replace(',', '.');
                      const parts = cleaned.split('.');
                      if (parts.length > 2) {
                        cleaned = parts[0] + '.' + parts[1];
                      }
                      setAmount(cleaned);
                    }}
                    className={`w-full text-[32px] font-bold bg-transparent focus:outline-none ${isDarkMode ? 'text-white placeholder-[#666]' : 'text-[#000]'}`}
                    placeholder="0"
                  />
                  <span className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-[#000]'}`}>₽</span>
                </div>
                <p className={`text-sm mt-2 ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>
                  Доступно: {fromAcc.amount.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₽
                </p>
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
            {toAcc && (
              <div
                key={toAcc.id + (swapped ? '-s' : '')}
                className={`w-full p-5 rounded-2xl border-2 border-primary shadow-sm transition-all duration-300 ${isDarkMode ? 'bg-[#181818]' : 'bg-[#F8F5FF]'}`}
              >
                <div className="flex items-center mb-3">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: toAcc.color }} />
                  <span className={`text-base font-semibold ${isDarkMode ? 'text-white' : 'text-[#000]'}`}>{toAcc.name}</span>
                </div>
                <p className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-[#000]'}`}>{toAcc.amount.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₽</p>
              </div>
            )}
          </div>

          <button
            className={`w-full p-4 rounded-xl text-base font-bold text-white ${
              isFormValid ? 'bg-primary' : (isDarkMode ? 'bg-[#4d4d4d] text-[#999] cursor-not-allowed' : 'bg-[#B9B6FF] cursor-not-allowed')
            }`}
            disabled={!isFormValid}
            onClick={handleTransfer}
          >
            Перевести {amount ? parseFloat(amount).toFixed(2) + ' ₽' : ''}
          </button>
        </div>
      </div>
    </MainLayout>
  );
}
