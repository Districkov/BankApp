import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { IoAlertCircle, IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import { useAuth } from '../../src/context/AuthContext';
import { useTheme } from '../../src/context/ThemeContext';
import { authAPI } from '../../src/utils/api';

const REDIRECT_PATHS = ['/code/yandex', '/auth/yandex/callback'];

export default function YandexAuthScreen() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isYandexLoading, setIsYandexLoading] = useState(false);
  const [error, setError] = useState('');
  const { isAuthenticated, isLoading: authLoading, login } = useAuth();
  const { isDarkMode } = useTheme();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace('/welcome');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    const handleDeepLink = () => {
      try {
        if (typeof window !== 'undefined') {
          const currentUrl = window.location.href;
          if (REDIRECT_PATHS.some(path => currentUrl.includes(path))) {
            const code = extractCodeFromUrl(currentUrl);
            if (code) {
              authAPI.verifyCode(code).then(() => {
                router.replace('/welcome');
              }).catch(err => {
                if (err.status === 300 && err.data) {
                  router.replace({
                    pathname: '/auth/session-limit',
                    query: { data: JSON.stringify(err.data) },
                  });
                }
              });
              return;
            }
          }
        }
      } catch (err) {
        console.error('Error handling deep link:', err);
      }
    };

    handleDeepLink();
  }, [router]);

  const extractCodeFromUrl = (url) => {
    try {
      const hashIndex = url.indexOf('#');
      if (hashIndex !== -1) {
        const hash = url.substring(hashIndex + 1);
        const hashParams = new URLSearchParams(hash);
        const code = hashParams.get('code');
        if (code) return code;
      }

      const queryIndex = url.indexOf('?');
      if (queryIndex !== -1) {
        const queryString = url.substring(queryIndex);
        const queryParams = new URLSearchParams(queryString);
        const code = queryParams.get('code');
        if (code) return code;
      }

      return null;
    } catch (e) {
      const hashMatch = url.match(/#code=([^&]+)/);
      if (hashMatch) return hashMatch[1];
      return null;
    }
  };

  const formatPhoneInput = (value) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length === 0) return '';
    if (digits.length <= 1) return '+7';
    if (digits.length <= 4) return `+7 (${digits.slice(1)}`;
    if (digits.length <= 7) return `+7 (${digits.slice(1, 4)}) ${digits.slice(4)}`;
    if (digits.length <= 9) return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
    return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9, 11)}`;
  };

  const getRawPhone = () => {
    return phone.replace(/\D/g, '');
  };

  const handleLogin = async () => {
    const rawPhone = getRawPhone();
    if (rawPhone.length !== 11) {
      setError('Введите корректный номер телефона');
      return;
    }
    if (!password || password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await authAPI.login(rawPhone, password);

      try {
        const userData = await authAPI.whoami();
        if (userData) {
          localStorage.setItem('session_cookie', 'YAA_SESS_ID=httponly');
          localStorage.setItem('user_data', JSON.stringify(userData));
          await login('YAA_SESS_ID=httponly', userData);
          router.replace('/welcome');
        }
      } catch (whoamiErr) {
        console.error('whoami failed:', whoamiErr);
        localStorage.setItem('session_cookie', 'YAA_SESS_ID=httponly');
        await login('YAA_SESS_ID=httponly', { phone_number: rawPhone });
        router.replace('/welcome');
      }
    } catch (err) {
      if (err.status === 300 && err.data) {
        router.replace({
          pathname: '/auth/session-limit',
          query: { data: JSON.stringify(err.data) },
        });
      } else {
        setError(err.message || 'Неверный номер телефона или пароль');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleYandexAuth = async () => {
    setIsYandexLoading(true);
    setError('');

    try {
      const authUrl = await authAPI.getYandexAuthUrl();
      if (!authUrl) throw new Error('URL авторизации не получен');
      window.location.href = authUrl;
    } catch (err) {
      setError(err.message || 'Ошибка при получении URL авторизации');
    } finally {
      setIsYandexLoading(false);
    }
  };

  const isFormValid = getRawPhone().length === 11 && password.length >= 6;

  return (
    <div className={`flex-1 flex justify-center items-center w-full min-h-screen ${isDarkMode ? 'bg-gradient-to-br from-[#121212] via-[#1a1a2e] to-[#16213e]' : 'bg-gradient-to-br from-[#fafafa] via-[#f0e6ff] to-[#e8d5ff]'}`}>
      <div className="flex flex-col items-center justify-center px-8 w-full max-w-md">
        <h1 className={`text-[28px] font-semibold text-center mb-10 ${isDarkMode ? 'text-white' : 'text-black'}`}>
          Добро пожаловать,
        </h1>

        {error && (
          <div className={`flex flex-row items-center px-4 py-3 rounded-lg mb-6 w-full ${isDarkMode ? 'bg-[#FF3B3020]' : 'bg-[#FF3B3010]'}`}>
            <IoAlertCircle size={20} color="#FF3B30" />
            <p className="text-[#FF3B30] text-sm ml-2 flex-1">{error}</p>
          </div>
        )}

        <div className={`w-full rounded-2xl p-6 mb-4 ${isDarkMode ? 'bg-[#181818] border border-[#4d4d4d]' : 'bg-white shadow-lg'}`}>
          <div className="mb-4">
            <label className={`text-sm font-semibold mb-2 block ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>Номер телефона</label>
            <input
              type="tel"
              placeholder="+7 (___) ___-__-__"
              className={`w-full text-base font-semibold py-3 px-4 rounded-xl ${isDarkMode ? 'bg-[#1f1f1f] text-white border border-[#4d4d4d]' : 'bg-[#F7F7FB] text-[#000] border border-[#E5E5E5]'} focus:outline-none focus:border-primary`}
              value={phone}
              onChange={(e) => {
                setPhone(formatPhoneInput(e.target.value));
                setError('');
              }}
            />
          </div>

          <div className="mb-2">
            <label className={`text-sm font-semibold mb-2 block ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>Пароль</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Введите пароль"
                className={`w-full text-base font-semibold py-3 px-4 pr-12 rounded-xl ${isDarkMode ? 'bg-[#1f1f1f] text-white border border-[#4d4d4d]' : 'bg-[#F7F7FB] text-[#000] border border-[#E5E5E5]'} focus:outline-none focus:border-primary`}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && isFormValid) handleLogin();
                }}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <IoEyeOffOutline size={20} color={isDarkMode ? '#666' : '#999'} />
                ) : (
                  <IoEyeOutline size={20} color={isDarkMode ? '#666' : '#999'} />
                )}
              </button>
            </div>
          </div>

          <button
            className={`w-full py-4 rounded-xl font-semibold text-base mt-4 transition-opacity ${
              isFormValid && !isLoading
                ? 'bg-primary text-white hover:opacity-90'
                : (isDarkMode ? 'bg-[#4d4d4d] text-[#999] cursor-not-allowed' : 'bg-[#E5E5E5] text-[#999] cursor-not-allowed')
            }`}
            onClick={handleLogin}
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent mx-auto" />
            ) : (
              'Войти'
            )}
          </button>
        </div>

        <div className={`flex items-center w-full my-4 ${isDarkMode ? 'text-[#4d4d4d]' : 'text-[#ccc]'}`}>
          <div className={`flex-1 h-px ${isDarkMode ? 'bg-[#4d4d4d]' : 'bg-[#E5E5E5]'}`} />
          <span className="px-4 text-sm">или</span>
          <div className={`flex-1 h-px ${isDarkMode ? 'bg-[#4d4d4d]' : 'bg-[#E5E5E5]'}`} />
        </div>

        <button
          data-testid="login-button"
          className={`flex flex-row items-center justify-center bg-[#FC3F1D] px-8 py-4 rounded-xl w-full ${
            isYandexLoading ? 'opacity-60 cursor-not-allowed' : 'hover:opacity-90'
          } transition-opacity`}
          onClick={handleYandexAuth}
          disabled={isYandexLoading}
        >
          {isYandexLoading ? (
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent" />
          ) : (
            <>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" fill="white"/>
              </svg>
              <span className="text-white text-base font-semibold ml-3">
                Войти через Яндекс
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
