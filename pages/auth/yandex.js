import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { IoAlertCircle, IoLogoGoogle } from 'react-icons/io5';
import { useAuth } from '../../src/context/AuthContext';
import { useTheme } from '../../src/context/ThemeContext';
import { authAPI } from '../../src/utils/api';

const REDIRECT_PATHS = ['/code/yandex', '/auth/yandex/callback'];

export default function YandexAuthScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { isAuthenticated, isLoading: authLoading } = useAuth();
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
              router.push(`/auth/code-input?code=${code}`);
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
        if (code) {
          return code;
        }
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

  const handleYandexAuth = async () => {
    setIsLoading(true);
    setError('');

    try {
      const authUrl = await authAPI.getYandexAuthUrl();

      console.log('Received auth URL from backend:', authUrl);

      if (!authUrl) {
        throw new Error('URL авторизации не получен');
      }

      console.log('Redirecting to:', authUrl);
      window.location.href = authUrl;
    } catch (err) {
      setError(err.message || 'Ошибка при получении URL авторизации');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex-1 flex justify-center items-center w-full min-h-screen ${isDarkMode ? 'bg-gradient-to-br from-[#121212] via-[#1a1a2e] to-[#16213e]' : 'bg-gradient-to-br from-[#fafafa] via-[#f0e6ff] to-[#e8d5ff]'}`}>
      <div className="flex flex-col items-center justify-center px-8 w-full max-w-md">
        <h1 className={`text-[28px] font-semibold text-center mb-[60px] ${isDarkMode ? 'text-white' : 'text-black'}`}>
          Добро пожаловать,
        </h1>

        {error && (
          <div className={`flex flex-row items-center px-4 py-3 rounded-lg mb-6 w-full ${isDarkMode ? 'bg-[#FF3B3020]' : 'bg-[#FF3B3010]'}`}>
            <IoAlertCircle size={20} color="#FF3B30" />
            <p className="text-[#FF3B30] text-sm ml-2 flex-1">{error}</p>
          </div>
        )}

        <button
          data-testid="login-button"
          className={`flex flex-row items-center justify-center bg-[#FC3F1D] px-8 py-4 rounded-xl w-full mb-4 ${
            isLoading ? 'opacity-60 cursor-not-allowed' : 'hover:opacity-90'
          } transition-opacity`}
          onClick={handleYandexAuth}
          disabled={isLoading}
        >
          {isLoading ? (
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
