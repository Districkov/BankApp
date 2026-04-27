import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import MainLayout from '../../src/components/MainLayout';
import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import { accountsAPI, transfersAPI } from '../../src/utils/api';
import { useTheme } from '../../src/context/ThemeContext';

export default function TransferPhone() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [accounts, setAccounts] = useState([]);
  const [currentAccountIndex, setCurrentAccountIndex] = useState(0);
  const [isBalanceHidden, setIsBalanceHidden] = useState(false);
  const [loading, setLoading] = useState(true);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

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
        setAccounts(accountsData.map(acc => ({
          id: acc.id,
          name: acc.name || 'Счёт',
          balance: parseFloat(acc.balance || 0),
          color: acc.color || '#1A889F'
        })));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentAccount = accounts[currentAccountIndex];
  const userBalance = currentAccount?.balance || 0;

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
    return !isNaN(num) && num > 0 && num <= userBalance;
  };

  const handleTransfer = async () => {
    const e = {};

    if (!validatePhone(phone)) {
      e.phone = 'Неверный номер';
    }

    if (!validateAmount(amount)) {
      e.amount = 'Введите сумму > 0';
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

  const formatBalance = (balance) => {
    return new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(balance);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches ? e.touches[0].clientX : e.clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches ? e.touches[0].clientX : e.clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentAccountIndex < accounts.length - 1) {
        setCurrentAccountIndex(prev => prev + 1);
      } else if (diff < 0 && currentAccountIndex > 0) {
        setCurrentAccountIndex(prev => prev - 1);
      }
    }
    touchStartX.current = 0;
    touchEndX.current = 0;
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
          {accounts.length > 0 && (
            <div
              className={`rounded-[20px] shadow-lg mb-4 ${isDarkMode ? 'bg-[#181818] border border-[#4d4d4d]' : 'bg-white border border-[#F0F0F5]'}`}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleTouchStart}
              onMouseMove={(e) => { if (e.buttons === 1) handleTouchMove(e); }}
              onMouseUp={handleTouchEnd}
            >
              <div className="p-5">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: currentAccount?.color || '#1A889F' }} />
                    <span className={`text-base font-bold ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>{currentAccount?.name || 'Счёт'}</span>
                  </div>
                  <button onClick={() => setIsBalanceHidden(!isBalanceHidden)}>
                    {isBalanceHidden ? <IoEyeOffOutline size={18} color={isDarkMode ? '#b3b3b3' : '#666'} /> : <IoEyeOutline size={18} color={isDarkMode ? '#b3b3b3' : '#666'} />}
                  </button>
                </div>
                <p className={`text-[24px] font-extrabold ${isDarkMode ? 'text-white' : 'text-[#1A1A1A]'}`}>
                  {isBalanceHidden ? '•••••••' : `${formatBalance(userBalance)} ₽`}
                </p>
              </div>

              {accounts.length > 1 && (
                <div className="flex justify-center gap-2 pb-3">
                  {accounts.map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 rounded-full transition-all ${
                        index === currentAccountIndex
                          ? 'w-6 bg-primary'
                          : (isDarkMode ? 'w-2 bg-[#4d4d4d]' : 'w-2 bg-[#E5E5E5]')
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          <div className={`p-4 rounded-xl shadow-sm mb-4 ${isDarkMode ? 'bg-[#181818] border border-[#4d4d4d]' : 'bg-white'}`}>
            <label className={`text-sm font-semibold mb-2 block ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>Номер телефона</label>
            <input
              type="tel"
              placeholder="+7 ___ ___-__-__"
              className={`w-full text-lg font-semibold py-2 bg-transparent ${isDarkMode ? 'text-white placeholder-[#666]' : 'text-[#000]'}`}
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
            <input
              type="number"
              inputMode="decimal"
              placeholder="0.00"
              className={`w-full text-3xl font-bold py-2 bg-transparent ${isDarkMode ? 'text-white placeholder-[#666]' : 'text-[#000]'}`}
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setErrors({ ...errors, amount: '' });
              }}
            />
            <div className={`text-sm mt-2 ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>
              Доступно: {formatBalance(userBalance)} ₽
            </div>
            {errors.amount && <p className="text-danger text-sm mt-1">{errors.amount}</p>}
          </div>

          <div className={`p-4 rounded-xl shadow-sm mb-4 ${isDarkMode ? 'bg-[#181818] border border-[#4d4d4d]' : 'bg-white'}`}>
            <label className={`text-sm font-semibold mb-2 block ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>Сообщение (необязательно)</label>
            <input
              type="text"
              placeholder="Комментарий к переводу"
              className={`w-full text-base py-2 bg-transparent ${isDarkMode ? 'text-white placeholder-[#666]' : 'text-[#000]'}`}
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
            Перевести
          </button>
        </div>
      </div>
    </MainLayout>
  );
}
