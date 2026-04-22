import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { IoAlertCircle, IoCheckmarkCircle } from 'react-icons/io5';
import { useAuth } from '../../src/context/AuthContext';
import { useTheme } from '../../src/context/ThemeContext';
import { authAPI } from '../../src/utils/api';

export default function CodeInputScreen() {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { login } = useAuth();
  const { isDarkMode } = useTheme();
  const router = useRouter();

  useEffect(() => {
    if (router.query.code) {
      setCode(router.query.code);
      handleVerifyCode(router.query.code);
    }
  }, [router.query.code]);

  const handleVerifyCode = async (verificationCode) => {
    const codeToVerify = verificationCode || code;
    
    if (!codeToVerify || codeToVerify.trim().length === 0) {
      setError('Введите код авторизации');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await authAPI.verifyCode(codeToVerify.trim());

      if (response && response.verified) {
        try {
          const userData = await authAPI.whoami();
          if (userData) {
            localStorage.setItem('session_cookie', 'YAA_SESS_ID=httponly');
            localStorage.setItem('user_data', JSON.stringify(userData));
            await login('YAA_SESS_ID=httponly', userData);
          } else {
            throw new Error('whoami вернул пустые данные');
          }
        } catch (whoamiErr) {
          console.error('whoami failed:', whoamiErr);
          localStorage.setItem('session_cookie', 'YAA_SESS_ID=httponly');
          router.replace('/welcome');
          return;
        }

        setSuccess(true);
        setTimeout(() => {
          router.replace('/welcome');
        }, 1000);
      } else {
        throw new Error('Не удалось подтвердить код авторизации');
      }
    } catch (err) {
      if (err.status === 300 && err.data) {
        router.replace({
          pathname: '/auth/session-limit',
          query: { data: JSON.stringify(err.data), code: codeToVerify.trim() },
        });
        return;
      }
      setError(err.message || 'Неверный код авторизации');
      setSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex-1 flex justify-center items-center w-full min-h-screen ${isDarkMode ? 'bg-gradient-to-br from-[#121212] via-[#1a1a2e] to-[#16213e]' : 'bg-gradient-to-br from-[#fafafa] via-[#f0e6ff] to-[#e8d5ff]'}`}>
      <div className="flex flex-col items-center justify-center px-8 w-full max-w-md">
        <h1 className={`text-[28px] font-semibold text-center mb-4 ${isDarkMode ? 'text-white' : 'text-black'}`}>
          Подтверждение входа
        </h1>
        <p className={`text-center mb-8 ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>
          Введите код, полученный от Яндекса
        </p>

        {error && (
          <div className={`flex flex-row items-center px-4 py-3 rounded-lg mb-6 w-full ${isDarkMode ? 'bg-[#3d1a1a]' : 'bg-[#FF3B3010]'}`}>
            <IoAlertCircle size={20} color="#FF3B30" />
            <p className="text-[#FF3B30] text-sm ml-2 flex-1">{error}</p>
          </div>
        )}

        {success && (
          <div className={`flex flex-row items-center px-4 py-3 rounded-lg mb-6 w-full ${isDarkMode ? 'bg-[#1a3d1a]' : 'bg-[#34C75910]'}`}>
            <IoCheckmarkCircle size={20} color="#34C759" />
            <p className="text-[#34C759] text-sm ml-2 flex-1">
              Авторизация успешна! Перенаправление...
            </p>
          </div>
        )}

        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Введите код"
          className={`w-full px-4 py-3 rounded-lg mb-4 text-base focus:outline-none transition-colors ${isDarkMode ? 'bg-[#181818] border border-[#4d4d4d] text-white placeholder-[#666] focus:border-[#8B5CF6]' : 'border border-gray-300 focus:border-[#8B5CF6]'}`}
          disabled={isLoading || success}
        />

        <button
          className={`flex flex-row items-center justify-center bg-[#8B5CF6] px-8 py-4 rounded-xl w-full mb-4 ${
            isLoading || success ? 'opacity-60 cursor-not-allowed' : 'hover:opacity-90'
          } transition-opacity`}
          onClick={() => handleVerifyCode()}
          disabled={isLoading || success}
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent" />
          ) : (
            <span className="text-white text-base font-semibold">
              Подтвердить
            </span>
          )}
        </button>

        <button
          className={`text-sm hover:underline ${isDarkMode ? 'text-[#8B5CF6]' : 'text-[#8B5CF6]'}`}
          onClick={() => router.push('/auth/yandex')}
          disabled={isLoading || success}
        >
          Вернуться к авторизации
        </button>
      </div>
    </div>
  );
}
