import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import MainLayout from '../../src/components/MainLayout';
import { accountsAPI, contactsAPI, transfersAPI } from '../../src/utils/api';

export default function TransferPhone() {
  const router = useRouter();
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
      const [accountsData, contactsData] = await Promise.all([
        accountsAPI.getAccounts().catch(() => []),
        contactsAPI.getContacts().catch(() => [])
      ]);
      
      // Получаем баланс из первого счета
      if (accountsData && accountsData.length > 0) {
        const balance = accountsData.reduce((sum, acc) => sum + parseFloat(acc.balance || 0), 0);
        setUserBalance(balance);
      }
      
      // Загружаем контакты
      if (contactsData && contactsData.length > 0) {
        setAllContacts(contactsData.map(c => ({
          id: c.id,
          name: c.name || 'Контакт',
          phone: c.phone,
          initial: c.name ? c.name.charAt(0).toUpperCase() : '?'
        })));
      } else {
        // Fallback на заглушки если API не работает
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
      // Устанавливаем заглушки при ошибке
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

  const findContactByPhone = (phoneNumber) => {
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    return allContacts.find(contact => {
      const cleanContactPhone = contact.phone.replace(/\D/g, '');
      return cleanContactPhone === cleanPhone;
    });
  };

  const getContactToDisplay = () => {
    if (!phone) return [];
    const foundContact = findContactByPhone(phone);
    if (foundContact) return [foundContact];
    return [{
      id: 0,
      name: 'Новый контакт',
      phone: phone,
      initial: phone.replace(/\D/g, '').charAt(0) || '?'
    }];
  };

  const contactsToDisplay = getContactToDisplay();

  useEffect(() => {
    if (router.query.phone) {
      setPhone(router.query.phone);
    }
  }, [router.query.phone]);

  const onChangePhone = (e) => {
    const v = formatPhone(e.target.value);
    setPhone(v);
  };

  const onChangeAmount = (e) => {
    let cleaned = e.target.value.replace(/[^\d,.]/g, '');
    cleaned = cleaned.replace(',', '.');
    const parts = cleaned.split('.');
    if (parts.length > 2) {
      cleaned = parts[0] + '.' + parts[1];
    }
    setAmount(cleaned);
  };

  const onSend = async () => {
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
        // Отправляем запрос на бэкенд, антифрод проверки там
        await transfersAPI.transferToPhone({
          phone: phone.replace(/\D/g, ''),
          amount: parseFloat(amount),
          message: message
        });
        
        router.push(`/main/success?amount=${parseFloat(amount).toFixed(2)}&type=Перевод`);
      } catch (error) {
        // Обрабатываем ошибки от бэкенда (включая антифрод)
        const errorMessage = error.message || 'Операция отклонена системой безопасности';
        
        if (error.status === 400 || error.status === 403 || error.status === 429) {
          // Редирект на страницу ошибки для антифрод и других критичных ошибок
          router.push(`/main/failed?amount=${parseFloat(amount).toFixed(2)}&type=Перевод&reason=${encodeURIComponent(errorMessage)}`);
        } else {
          // Показываем ошибку в форме для других случаев
          setErrors({ amount: errorMessage });
        }
      }
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

  const isFormValid = validatePhone(phone) && validateAmount(amount);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex-1 bg-[#F7F7FB] min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex-1 bg-[#F7F7FB] min-h-screen">
        <div className="bg-white px-4 py-3 border-b border-[#E5E5E5] flex justify-between items-center">
          <button className="w-8 h-8 flex items-center justify-center" onClick={() => router.back()}>
            <span className="text-xl text-[#000]">✕</span>
          </button>
          <h1 className="text-lg font-semibold text-[#000]">По номеру телефона</h1>
          <div className="w-8" />
        </div>

        <div className="flex-1 overflow-y-auto pb-5">
          {/* Balance */}
          <div className="bg-white p-5 mx-4 mt-4 rounded-xl flex justify-between items-center">
            <span className="text-base text-[#666]">с Black</span>
            <span className="text-xl font-bold text-[#000]">{userBalance.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₽</span>
          </div>

          {/* Contact Display */}
          {phone && (
            <div className="bg-white mx-4 mt-3 rounded-xl py-2">
              <h2 className="text-lg font-semibold text-[#000] px-4 py-3">Контакт</h2>
              {contactsToDisplay.map((contact) => (
                <button
                  key={contact.id}
                  className="flex items-center px-4 py-3 border-b border-[#F0F0F0] w-full"
                  onClick={() => setPhone(contact.phone)}
                >
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center mr-3">
                    <span className="text-white font-semibold text-base">{contact.initial}</span>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-base font-medium text-[#000]">{contact.name}</p>
                    <p className="text-sm text-[#666] mt-0.5">{contact.phone}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Transfer Form */}
          <div className="bg-white mx-4 mt-3 mb-5 rounded-xl p-4">
            <h2 className="text-lg font-semibold text-[#000] px-4 py-3">Перевод</h2>

            <div className="mb-4">
              <label className="text-base text-[#000] mb-2 block font-medium">Номер телефона</label>
              <input
                type="tel"
                value={phone}
                onChange={onChangePhone}
                className="w-full bg-[#F7F7FB] p-4 rounded-xl text-base border border-[#E5E5E5]"
                placeholder="+7 (___) ___-__-__"
              />
              {errors.phone && <p className="text-[#D23] mt-1.5 text-sm">{errors.phone}</p>}
            </div>

            <div className="mb-4">
              <label className="text-base text-[#000] mb-2 block font-medium">Сумма перевода</label>
              <div className="flex items-center bg-[#F7F7FB] rounded-xl border border-[#E5E5E5] px-4">
                <input
                  type="text"
                  value={amount}
                  onChange={onChangeAmount}
                  className="flex-1 py-4 text-base bg-transparent"
                  placeholder="0"
                />
                <span className="text-base text-[#000] font-medium ml-2">₽</span>
              </div>
              {errors.amount && <p className="text-[#D23] mt-1.5 text-sm">{errors.amount}</p>}
            </div>

            <div className="mb-4">
              <label className="text-base text-[#000] mb-2 block font-medium">Сообщение получателю</label>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-[#F7F7FB] p-4 rounded-xl text-base border border-[#E5E5E5]"
                placeholder="Введите сообщение"
              />
            </div>

            <button
              className={`w-full p-4 rounded-xl text-base font-bold text-white mt-2 ${
                isFormValid ? 'bg-primary' : 'bg-[#B9B6FF]'
              }`}
              disabled={!isFormValid}
              onClick={onSend}
            >
              Перевести {amount ? parseFloat(amount).toFixed(2) + ' ₽' : ''}
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
