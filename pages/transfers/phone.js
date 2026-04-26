import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import MainLayout from '../../src/components/MainLayout';
import { accountsAPI, transfersAPI } from '../../src/utils/api';
import { useTheme } from '../../src/context/ThemeContext';

export default function TransferPhone() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [userBalance, setUserBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [allContacts, setAllContacts] = useState([]);

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
        const balance = accountsData.reduce((sum, acc) => sum + parseFloat(acc.balance || 0), 0);
        setUserBalance(balance);
      }
      
      setAllContacts([]);
      
      if (contactsData && contactsData.length > 0) {
        setAllContacts(contactsData.map(c => ({
          id: c.id,
          name: c.name || 'Контакт',
          phone: c.phone,
          initial: c.name ? c.name.charAt(0).toUpperCase() : '?'
        })));
      } else {
        setAllContacts([
          { id: 1, name: 'Борис Иван', phone: '+7 (900) 123-45-67', initial: 'Б' },
          { id: 2, name: 'Руслан Диа', phone: '+7 (900) 123-45-68', initial: 'Р' },
          { id: 3, name: 'Му Angel♥', phone: '+7 (900) 123-45-69', initial: 'М' },
          { id: 4, name: 'Иван Соломин', phone: '+7 (900) 123-45-60', initial: 'ИС' },
          { id: 5, name: 'Korzik', phone: '+7 (902) 207-72-41', initial: 'К' },
        ]);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setUserBalance(22717.98);
      setAllContacts([
        { id: 1, name: 'Борис Иван', phone: '+7 (900) 123-45-67', initial: 'Б' },
        { id: 2, name: 'Руслан Диа', phone: '+7 (900) 123-45-68', initial: 'Р' },
        { id: 3, name: 'Му Angel♥', phone: '+7 (900) 123-45-69', initial: 'М' },
        { id: 4, name: 'Иван Соломин', phone: '+7 (900) 123-45-60', initial: 'ИС' },
        { id: 5, name: 'Korzik', phone: '+7 (902) 207-72-41', initial: 'К' },
      ]);
    } finally {
      setLoading(false);
    }
  };

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
              Доступно: {userBalance.toLocaleString('ru-RU', { minimumFractionDigits: 2 })} ₽
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

          {allContacts.length > 0 && (
            <div className="mb-4">
              <h3 className={`text-sm font-semibold mb-3 ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>Недавние контакты</h3>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {allContacts.slice(0, 5).map((contact) => (
                  <button
                    key={contact.id}
                    className="flex flex-col items-center min-w-[64px]"
                    onClick={() => setPhone(contact.phone)}
                  >
                    <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center mb-2 shadow">
                      <span className="text-white font-bold text-base">{contact.initial}</span>
                    </div>
                    <span className={`text-xs font-medium text-center ${isDarkMode ? 'text-white' : 'text-[#1A1A1A]'}`}>{contact.name}</span>
                  </button>
                ))}
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
            Перевести
          </button>
        </div>
      </div>
    </MainLayout>
  );
}
