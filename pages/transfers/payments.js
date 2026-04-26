import React, { useState } from 'react';
import { useRouter } from 'next/router';
import MainLayout from '../../src/components/MainLayout';
import { IoArrowBack } from 'react-icons/io5';
import { useTheme } from '../../src/context/ThemeContext';

export default function Payments() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const contacts = [];

  const formatPhoneNumber = (text) => {
    const clean = text.replace(/\D/g, '');
    if (clean.startsWith('7') || clean.startsWith('8')) {
      const numbers = clean.substring(1);
      let result = '+7 (';
      if (numbers.length > 0) result += numbers.substring(0, 3);
      if (numbers.length > 3) result += ') ' + numbers.substring(3, 6);
      if (numbers.length > 6) result += '-' + numbers.substring(6, 8);
      if (numbers.length > 8) result += '-' + numbers.substring(8, 10);
      return result;
    }
    return text;
  };

  const validatePhone = (phone) => {
    const cleanPhone = phone.replace(/\D/g, '');
    return cleanPhone.length === 11 && (cleanPhone.startsWith('7') || cleanPhone.startsWith('8'));
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
    if (e.target.value && !validatePhone(e.target.value)) {
      setPhoneError('Введите корректный номер телефона');
    } else {
      setPhoneError('');
    }
  };

  const handleContactPress = (contact) => {
    setPhoneNumber(contact.phone);
    setPhoneError('');
  };

  const handlePhoneTransfer = () => {
    if (phoneNumber && validatePhone(phoneNumber)) {
      router.push(`/transfers/phone?phone=${encodeURIComponent(phoneNumber)}`);
    } else {
      setPhoneError('Введите корректный номер телефона');
    }
  };

  return (
    <MainLayout>
      <div className={`flex flex-col flex-1 ${isDarkMode ? 'bg-[#121212]' : 'bg-[#F8FAFD]'}`}>
        <div className={`px-5 py-4 border-b flex items-center gap-4 ${isDarkMode ? 'bg-[#181818] border-[#4d4d4d]' : 'bg-white border-[#F0F0F5]'}`}>
          <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-[#1A1A1A]'}`}>Платежи</h1>
        </div>

        <div className="p-5">
          <h2 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-[#1A1A1A]'}`}>Перевод по телефону</h2>
          <div className={`p-5 rounded-[20px] shadow-lg ${isDarkMode ? 'bg-[#181818] border border-[#4d4d4d]' : 'bg-white border border-[#F0F0F5]'}`}>
            <div className="flex gap-3 mb-2">
              <input
                type="tel"
                placeholder="+7 (___) ___-__-__"
                className={`flex-1 min-w-0 px-4 py-4 rounded-xl text-base border ${isDarkMode ? 'bg-[#1f1f1f] border-[#4d4d4d] text-white placeholder-[#666]' : 'bg-[#F8FAFD] border-[#E5E5EA] text-[#000]'}`}
                value={phoneNumber}
                onChange={handlePhoneChange}
              />
              <button
                className={`shrink-0 px-4 py-4 rounded-xl font-bold text-sm ${
                  phoneNumber && validatePhone(phoneNumber)
                    ? 'bg-primary text-white'
                    : (isDarkMode ? 'bg-[#4d4d4d] text-[#999] cursor-not-allowed' : 'bg-[#9DD0DB] text-white cursor-not-allowed')
                }`}
                onClick={handlePhoneTransfer}
                disabled={!phoneNumber || !validatePhone(phoneNumber)}
              >
                Перевести
              </button>
            </div>
            {phoneError && <p className="text-danger text-sm mb-2">{phoneError}</p>}

            <h3 className={`text-sm font-semibold mt-5 mb-3 ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>Недавние контакты</h3>
            <div className="flex gap-5 overflow-x-auto">
              {contacts.map((contact) => (
                <button
                  key={contact.id}
                  className="flex flex-col items-center min-w-[64px]"
                  onClick={() => handleContactPress(contact)}
                >
                  <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center mb-2 shadow">
                    <span className="text-white font-bold text-base">{contact.initial}</span>
                  </div>
                  <span className={`text-xs font-medium text-center ${isDarkMode ? 'text-white' : 'text-[#1A1A1A]'}`}>{contact.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
