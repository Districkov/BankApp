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
        setAccounts(accountsData.map(acc => {
          const code = acc.currency?.currencyCode || 'RUB';
          const rawSymbol = acc.currency?.symbol;
          return {
            id: acc.id,
            balance: parseFloat(acc.balance || 0),
            currency: code,
            color: CURRENCY_COLORS[code] || '#1A889F',
            symbol: (rawSymbol && rawSymbol !== '?') ? rawSymbol : CURRENCY_SYMBOLS[code] || '₽',
          };
        }));

        if (accountsData.length >= 2) {
          setFromAccountId(accountsData[0].id);
          setToAccountId(accountsData[1].id);
        } else if (accountsData.length === 1) {
          setFromAccountId(accountsData[0].id);
        }
      }
    } catch (error) {
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
    if (!amount || parseFloat(amount) <= 0) return;

    const amountNum = parseFloat(amount);
    const fromAcc = accounts.find(a => a.id === fromAccountId);
    if (!fromAcc || amountNum > fromAcc.balance) return;

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
      }
    }
  };

  const fromAcc = accounts.find(a => a.id === fromAccountId);
  const toAcc = accounts.find(a => a.id === toAccountId);
  const isFormValid = fromAccountId && toAccountId && fromAccountId !== toAccountId && amount && parseFloat(amount) > 0 && fromAcc && parseFloat(amount) <= fromAcc.balance;

  if (loading) {
    return (
      <MainLayout>
        <div className={`flex-1 flex items-center justify-center ${isDarkMode ? 'bg-[#121212]' : 'bg-[#F7F7FB]'}`}>
          <div className={`animate-spin rounded-full h-12 w-12 border-4 border-t-transparent ${isDarkMode ? 'border-[#1A889F]' : 'border-primary'}`} />
        </div>
      </MainLayout>
    );
  }

  const AccountSlider = ({ label, selectedId, onSelect, excludeId }) => (
    <div className="mb-4">
      <label className={`text-sm font-semibold mb-2 block ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>{label}</label>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
        {accounts.filter(a => a.id !== excludeId).map(acc => (
          <button
            key={acc.id}
            className={`flex-shrink-0 px-4 py-3 rounded-xl border-2 transition-all ${
              selectedId === acc.id
                ? 'border-primary shadow-sm'
                : (isDarkMode ? 'border-[#4d4d4d]' : 'border-[#E5E5E5]')
            } ${isDarkMode ? 'bg-[#181818]' : 'bg-white'}`}
            onClick={() => { onSelect(acc.id); setAmount(''); }}
          >
            <div className="flex items-center mb-1">
              <div className="w-2.5 h-2.5 rounded-full mr-2" style={{ backgroundColor: acc.color }} />
              <span className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-[#000]'}`}>{acc.symbol}</span>
            </div>
            <p className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-[#000]'}`}>
              {acc.balance.toLocaleString('ru-RU', { minimumFractionDigits: 2 })} {acc.symbol}
            </p>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <MainLayout>
      <div className={`flex flex-col flex-1 ${isDarkMode ? 'bg-[#121212]' : 'bg-[#F7F7FB]'}`}>
        <div className={`px-4 py-3 border-b flex justify-between items-center ${isDarkMode ? 'bg-[#181818] border-[#4d4d4d]' : 'bg-white border-[#E5E5E5]'}`}>
          <button className="w-8 h-8 flex items-center justify-center" onClick={() => router.back()}>
            <IoClose size={24} className={isDarkMode ? 'text-white' : 'text-[#000]'} />
          </button>
          <h1 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-[#000]'}`}>Между счетами</h1>
          <div className="w-8" />
        </div>

        <div className="flex-1 overflow-y-auto pb-6">
          <AccountSlider accounts={accounts} selectedId={fromAccountId} onSelect={(id) => { setFromAccountId(id); setAmount(''); }} label="Списать с" excludeId={toAccountId} />

          <div className="flex justify-center my-2">
            <button
              className={`w-10 h-10 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-[#181818] border border-[#4d4d4d]' : 'bg-white border border-[#E5E5E5] shadow-sm'}`}
              onClick={swapAccounts}
            >
              <IoSwapVertical size={20} className={isDarkMode ? 'text-white' : 'text-[#000]'} />
            </button>
          </div>

          <AccountSlider accounts={accounts} selectedId={toAccountId} onSelect={setToAccountId} label="Зачислить на" excludeId={fromAccountId} />

          <div className="px-4">

          {fromAcc && (
            <div className={`p-4 rounded-xl shadow-sm mb-4 ${isDarkMode ? 'bg-[#181818] border border-[#4d4d4d]' : 'bg-white'}`}>
              <label className={`text-sm font-semibold mb-2 block ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>Сумма</label>
              <div className="flex items-center">
                <input
                  type="text"
                  inputMode="decimal"
                  value={amount}
                  onChange={(e) => {
                    let raw = e.target.value.replace(/[^\d,.]/g, '');
                    raw = raw.replace(',', '.');
                    const parts = raw.split('.');
                    if (parts.length > 2) raw = parts[0] + '.' + parts[1];
                    setAmount(raw);
                  }}
                  style={{ width: `${Math.max(amount.length, 1)}ch` }}
                  className={`text-[32px] font-bold bg-transparent focus:outline-none ${isDarkMode ? 'text-white placeholder-[#666]' : 'text-[#000]'}`}
                  placeholder="0"
                />
                <span className={`text-[32px] font-bold ${amount ? (isDarkMode ? 'text-white' : 'text-[#000]') : (isDarkMode ? 'text-[#666]' : 'text-[#999]')}`}>
                  {fromAcc.symbol}
                </span>
              </div>
              <div className={`text-sm mt-2 ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>
                Доступно: {fromAcc.balance.toLocaleString('ru-RU', { minimumFractionDigits: 2 })} {fromAcc.symbol}
              </div>
            </div>
          )}

          <button
            className={`w-full py-4 rounded-xl font-semibold text-base ${
              isFormValid
                ? 'bg-primary text-white'
                : (isDarkMode ? 'bg-[#4d4d4d] text-[#999] cursor-not-allowed' : 'bg-[#E5E5E5] text-[#999] cursor-not-allowed')
            }`}
            onClick={handleTransfer}
            disabled={!isFormValid}
          >
            Перевести {amount ? `${parseFloat(amount).toFixed(2)} ${fromAcc?.symbol || '₽'}` : ''}
          </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
