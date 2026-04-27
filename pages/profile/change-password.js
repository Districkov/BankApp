import React, { useState } from 'react';
import { useRouter } from 'next/router';
import MainLayout from '../../src/components/MainLayout';
import { IoArrowBack, IoEyeOutline, IoEyeOffOutline, IoCheckmarkCircle } from 'react-icons/io5';
import { useTheme } from '../../src/context/ThemeContext';
import { authAPI } from '../../src/utils/api';

export default function ChangePassword() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChangePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      setError('Пароль должен содержать минимум 6 символов');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await authAPI.changePassword(newPassword);
      setSuccess(true);
    } catch (err) {
      if (err.status === 401) {
        setError('Сессия устарела, войдите заново');
      } else if (err.status === 400) {
        setError(err.message || 'Некорректный пароль');
      } else {
        setError(err.message || 'Ошибка при смене пароля');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = newPassword.length >= 6 && newPassword === confirmPassword;

  if (success) {
    return (
      <MainLayout>
        <div className={`flex flex-col flex-1 items-center justify-center px-8 ${isDarkMode ? 'bg-[#121212]' : 'bg-[#F7F7FB]'}`}>
          <div className="w-20 h-20 rounded-full bg-success flex items-center justify-center mb-6">
            <IoCheckmarkCircle size={48} color="#fff" />
          </div>
          <h1 className={`text-2xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-[#000]'}`}>Пароль изменён</h1>
          <p className={`text-base text-center mb-8 ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>
            Ваш пароль успешно обновлён
          </p>
          <button
            className="bg-primary text-white px-8 py-4 rounded-xl font-semibold text-base w-full max-w-xs"
            onClick={() => router.back()}
          >
            Вернуться
          </button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className={`flex flex-col flex-1 ${isDarkMode ? 'bg-[#121212]' : 'bg-[#F7F7FB]'}`}>
        <div className={`px-4 py-4 border-b flex justify-between items-center ${isDarkMode ? 'bg-[#181818] border-[#4d4d4d]' : 'bg-white border-[#E5E5E5]'}`}>
          <button onClick={() => router.back()}>
            <IoArrowBack size={24} color={isDarkMode ? '#fff' : '#000'} />
          </button>
          <h1 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-[#000]'}`}>Смена пароля</h1>
          <div className="w-8" />
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {error && (
            <div className={`flex flex-row items-center px-4 py-3 rounded-lg mb-4 ${isDarkMode ? 'bg-[#FF3B3020]' : 'bg-[#FF3B3010]'}`}>
              <span className="text-[#FF3B30] text-sm flex-1">{error}</span>
            </div>
          )}

          <div className={`rounded-2xl p-6 shadow-sm ${isDarkMode ? 'bg-[#181818] border border-[#4d4d4d]' : 'bg-white'}`}>
            <div className="mb-4">
              <label className={`text-sm font-semibold mb-2 block ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>Новый пароль</label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  placeholder="Введите новый пароль"
                  className={`w-full text-base font-semibold py-3 px-4 pr-12 rounded-xl ${isDarkMode ? 'bg-[#1f1f1f] text-white border border-[#4d4d4d]' : 'bg-[#F7F7FB] text-[#000] border border-[#E5E5E5]'} focus:outline-none focus:border-primary`}
                  value={newPassword}
                  onChange={(e) => { setNewPassword(e.target.value); setError(''); }}
                />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2" onClick={() => setShowNew(!showNew)}>
                  {showNew ? <IoEyeOffOutline size={20} color={isDarkMode ? '#666' : '#999'} /> : <IoEyeOutline size={20} color={isDarkMode ? '#666' : '#999'} />}
                </button>
              </div>
            </div>

            <div className="mb-6">
              <label className={`text-sm font-semibold mb-2 block ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>Подтвердите новый пароль</label>
              <input
                type="password"
                placeholder="Повторите новый пароль"
                className={`w-full text-base font-semibold py-3 px-4 rounded-xl ${isDarkMode ? 'bg-[#1f1f1f] text-white border border-[#4d4d4d]' : 'bg-[#F7F7FB] text-[#000] border border-[#E5E5E5]'} focus:outline-none focus:border-primary`}
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                onKeyDown={(e) => { if (e.key === 'Enter' && isFormValid) handleChangePassword(); }}
              />
            </div>

            <button
              className={`w-full py-4 rounded-xl font-semibold text-base ${
                isFormValid && !isLoading
                  ? 'bg-primary text-white hover:opacity-90'
                  : (isDarkMode ? 'bg-[#4d4d4d] text-[#999] cursor-not-allowed' : 'bg-[#E5E5E5] text-[#999] cursor-not-allowed')
              } transition-opacity`}
              onClick={handleChangePassword}
              disabled={!isFormValid || isLoading}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent mx-auto" />
              ) : 'Сохранить'}
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
