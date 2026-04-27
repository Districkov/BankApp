import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import MainLayout from '../../src/components/MainLayout';
import AccountSlider from '../../src/components/AccountSlider';
import { IoClose, IoSwapVertical } from 'react-icons/io5';
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

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      setLoading(true);
      const accountsData = await accountsAPI.getAccounts().catch(() => null);

      if (accountsData && accountsData.length > 0) {
        const mapped = accountsData.map(acc => {
          const code = acc.currency?.currencyCode || 'RUB';
          const rawSymbol = acc.currency?.symbol;
          return {
            id: acc.id,
            balance: parseFloat(acc.balance || 0),
            currency: code,
            color: CURRENCY_COLORS[code] || '#1A889F',
            symbol: (rawSymbol && rawSymbol !== '?') ? rawSymbol : CURRENCY_SYMBOLS[code] || '₽',
          };
        });
        setAccounts(mapped);

        if (mapped.length >= 2) {
          setFromAccountId(mapped[0].id);
          setToAccountId(mapped[1].id);
        } else if (mapped.length === 1) {
          setFromAccountId(mapped[0].id);
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

  const fromAccount = accounts.find(a => a.id === fromAccountId);
  const toAccount = accounts.find(a => a.id === toAccountId);

  const handleTransfer = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Введите сумму');
      return;
    }

    const amountNum = parseFloat(amount);

    if (fromAccount && amountNum > fromAccount.balance) {
      alert('Недостаточно средств');
      return;
    }

    try {
      await transfersAPI.transferBetweenAccounts({
        fromAccountId,
        toAccountId,
        amount: amountNum
      });

      router.push(`/main/success?amount=${amountNum.toFixed(2)}&type=Перевод между счетами&symbol=${encodeURIComponent(fromAccount?.symbol || '₽')}`);
    } catch (error) {
      const errorMessage = error.message || 'Операция отклонена';
      if (error.status === 400 || error.status === 403 || error.status === 429) {
        router.push(`/main/failed?amount=${amountNum.toFixed(2)}&type=Перевод между счетами&reason=${encodeURIComponent(errorMessage)}&symbol=${encodeURIComponent(fromAccount?.symbol || '₽')}`);
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
          <AccountSlider
            accounts={accounts}
            selectedId={fromAccountId}
            onSelect={setFromAccountId}
            label="Списать с"
            excludeId={toAccountId}
          />

          <div className="flex justify-center my-4">
            <button
              onClick={swapAccounts}
              className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg active:scale-90 transition-transform"
            >
              <IoSwapVertical size={24} color="#fff" />
            </button>
          </div>

          <AccountSlider
            accounts={accounts}
            selectedId={toAccountId}
            onSelect={setToAccountId}
            label="Зачислить на"
            excludeId={fromAccountId}
          />

          <div className={`mt-4 p-4 rounded-xl shadow-sm ${isDarkMode ? 'bg-[#181818] border border-[#4d4d4d]' : 'bg-white'}`}>
            <label className={`text-sm font-semibold mb-2 block ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>Сумма</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={amount}
                onChange={(e) => {
                  let cleaned = e.target.value.replace(/[^\d,.]/g, '');
                  cleaned = cleaned.replace(',', '.');
                  const parts = cleaned.split('.');
                  if (parts.length > 2) cleaned = parts[0] + '.' + parts[1];
                  setAmount(cleaned);
                }}
                className={`flex-1 text-[32px] font-bold bg-transparent focus:outline-none ${isDarkMode ? 'text-white placeholder-[#666]' : 'text-[#000]'} placeholder-[#ccc]`}
                placeholder="0"
              />
              <span className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-[#000]'}`}>
                {fromAccount?.symbol || '₽'}
              </span>
            </div>
          </div>

          <button
            className={`w-full mt-4 p-4 rounded-xl text-base font-bold text-white ${
              isFormValid ? 'bg-primary' : (isDarkMode ? 'bg-[#4d4d4d] cursor-not-allowed' : 'bg-[#B9B6FF] cursor-not-allowed')
            }`}
            disabled={!isFormValid}
            onClick={handleTransfer}
          >
            Перевести {amount ? parseFloat(amount).toFixed(2) : ''} {fromAccount?.symbol || '₽'}
          </button>
        </div>
      </div>
    </MainLayout>
  );
}
