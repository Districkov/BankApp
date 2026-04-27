import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import MainLayout from '../../src/components/MainLayout';
import { accountsAPI, transfersAPI } from '../../src/utils/api';
import { useTheme } from '../../src/context/ThemeContext';

const CURRENCY_SYMBOLS = { RUB: '₽', USD: '$', EUR: '€' };
const CURRENCY_COLORS = { RUB: '#1A889F', USD: '#159E3A', EUR: '#E5A100' };

export default function TransferPhone() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [accounts, setAccounts] = useState([]);
  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (router.query.phone) {
      setPhone(router.query.phone);
    }
  }, [router.query.phone]);

  const loadData = async () => {
    try {
      setLoading(true);
      const accountsData = await accountsAPI.getAccounts().catch(() => []);

      if (accountsData && accountsData.length > 0) {
        const mapped = accountsData.map(acc => {
          const code = acc.currency?.currencyCode || 'RUB';
          const rawSymbol = acc.currency?.symbol;
          return {
            id: acc.id,
            balance: parseFloat(acc.balance || 0),
            currency: code,
            symbol: (rawSymbol && rawSymbol !== '?') ? rawSymbol : CURRENCY_SYMBOLS[code] || '₽',
            color: CURRENCY_COLORS[code] || '#1A889F',
          };
        });
        setAccounts(mapped);
        setSelectedAccountId(mapped[0].id);
      }
    } catch (error) {
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  };

  const selectedAccount = accounts.find(a => a.id === selectedAccountId);

  const formatPhone = (text) => {
    let cleaned = text.replace(/\D/g, '');
    if (cleaned.startsWith('7') || cleaned.startsWith('8')) {
      cleaned = cleaned.substring(1);
    }
    if (cleaned.length > 0) {
      return `+7 ${cleaned.substring(0, 3)} ${cleaned.substring(3, 6)}-${cleaned.substring(6, 8)}-${cleaned.substring(8, 10)}`;
    }
    return text;
  };

  const validatePhone = (phone) => {
    return phone.replace(/\D/g, '').length === 11;
  };

  const validateAmount = (amount) => {
    const num = parseFloat(amount);
    return !isNaN(num) && num > 0 && selectedAccount && num <= selectedAccount.balance;
  };

  const handleTransfer = async () => {
    const e = {};

    if (!validatePhone(phone)) {
      e.phone = 'Неверный номер';
    }

    if (!validateAmount(amount)) {
      e.amount = 'Недостаточно средств';
    }

    setErrors(e);

    if (Object.keys(e).length === 0) {
      try {
        await transfersAPI.transferToPhone({
          phone: phone.replace(/\D/g, ''),
          amount: parseFloat(amount),
          message: message
        });

        router.push(`/main/success?amount=${parseFloat(amount).toFixed(2)}&type=Перевод`);
      } catch (error) {
        const errorMessage = error.message || 'Операция отклонена системой безопасности';

        if (error.status === 400 || error.status === 403 || error.status === 429) {
          router.push(`/main/failed?amount=${parseFloat(amount).toFixed(2)}&type=Перевод&reason=${encodeURIComponent(errorMessage)}`);
        } else {
          setErrors({ amount: errorMessage });
        }
      }
    }
  };

  const isFormValid = validatePhone(phone) && validateAmount(amount);

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
        <div className={`px-4 py-3 border-b flex justify-between items-center ${isDarkMode ? 'bg-[#181818] border-[#4d4d4d]' : 'bg-white border-[#E5E5E5]'}`}>
          <button className="w-8 h-8 flex items-center justify-center" onClick={() => router.back()}>
            <span className={`text-xl ${isDarkMode ? 'text-white' : 'text-[#000]'}`}>✕</span>
          </button>
          <h1 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-[#000]'}`}>По номеру телефона</h1>
          <div className="w-8" />
        </div>

        <div className="flex-1 overflow-y-auto p-4 pb-6">
          {/* Счёт слайдером */}
          {accounts.length > 0 && (
            <div className="mb-4">
              <label className={`text-sm font-semibold mb-2 block ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>Счёт списания</label>
              <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
                {accounts.map(acc => (
                  <button
                    key={acc.id}
                    className={`flex-shrink-0 px-4 py-3 rounded-xl border-2 transition-all ${
                      selectedAccountId === acc.id
                        ? 'border-primary shadow-sm'
                        : (isDarkMode ? 'border-[#4d4d4d]' : 'border-[#E5E5E5]')
                    } ${isDarkMode ? 'bg-[#181818]' : 'bg-white'}`}
                    onClick={() => { setSelectedAccountId(acc.id); setAmount(''); setErrors({}); }}
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
          )}

          <div className={`p-4 rounded-xl shadow-sm mb-4 ${isDarkMode ? 'bg-[#181818] border border-[#4d4d4d]' : 'bg-white'}`}>
            <label className={`text-sm font-semibold mb-2 block ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>Номер телефона</label>
            <input
              type="tel"
              placeholder="+7 ___ ___-__-__"
              className={`w-full text-lg font-semibold py-2 bg-transparent focus:outline-none ${isDarkMode ? 'text-white placeholder-[#666]' : 'text-[#000]'}`}
              value={phone}
              onChange={(e) => {
                setPhone(formatPhone(e.target.value));
                setErrors({ ...errors, phone: '' });
              }}
            />
            {errors.phone && <p className="text-danger text-sm mt-1">{errors.phone}</p>}
          </div>

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
                  setErrors({ ...errors, amount: '' });
                }}
                style={{ width: `${Math.max(amount.length, 1)}ch` }}
                className={`text-[32px] font-bold bg-transparent focus:outline-none ${isDarkMode ? 'text-white placeholder-[#666]' : 'text-[#000]'}`}
                placeholder="0"
              />
              <span className={`text-[32px] font-bold ${amount ? (isDarkMode ? 'text-white' : 'text-[#000]') : (isDarkMode ? 'text-[#666]' : 'text-[#999]')}`}>
                {selectedAccount?.symbol || '₽'}
              </span>
            </div>
            <div className={`text-sm mt-2 ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>
              Доступно: {selectedAccount?.balance.toLocaleString('ru-RU', { minimumFractionDigits: 2 })} {selectedAccount?.symbol || '₽'}
            </div>
            {errors.amount && <p className="text-danger text-sm mt-1">{errors.amount}</p>}
          </div>

          <div className={`p-4 rounded-xl shadow-sm mb-4 ${isDarkMode ? 'bg-[#181818] border border-[#4d4d4d]' : 'bg-white'}`}>
            <label className={`text-sm font-semibold mb-2 block ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>Сообщение (необязательно)</label>
            <input
              type="text"
              placeholder="Комментарий к переводу"
              className={`w-full text-base py-2 bg-transparent focus:outline-none ${isDarkMode ? 'text-white placeholder-[#666]' : 'text-[#000]'}`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={100}
            />
          </div>

          <button
            className={`w-full py-4 rounded-xl font-semibold text-base ${
              isFormValid
                ? 'bg-primary text-white'
                : (isDarkMode ? 'bg-[#4d4d4d] text-[#999] cursor-not-allowed' : 'bg-[#E5E5E5] text-[#999] cursor-not-allowed')
            }`}
            onClick={handleTransfer}
            disabled={!isFormValid}
          >
            Перевести {amount ? `${parseFloat(amount).toFixed(2)} ${selectedAccount?.symbol || '₽'}` : ''}
          </button>
        </div>
      </div>
    </MainLayout>
  );
}
