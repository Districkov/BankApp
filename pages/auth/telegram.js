import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { IoAlertCircle, IoSend } from 'react-icons/io5';
import { useAuth } from '../../src/context/AuthContext';

const API_URL = 'https://bank.korzik.space/api/auth/v1';
const REDIRECT_PATHS = ['/code/telegram', '/auth/telegram/callback'];

export default function TelegramAuthScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { isAuthenticated, isLoading: authLoading } = useAuth();
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
        const tgAuthResult = hashParams.get('tgAuthResult');
        if (tgAuthResult) {
          return tgAuthResult;
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
      const hashMatch = url.match(/#tgAuthResult=([^&]+)/);
      if (hashMatch) return hashMatch[1];
      
      return null;
    }
  };

  const handleTelegramAuth = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/simple/telegram/url`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Не удалось получить URL авторизации');
      }

      const authUrl = await response.text();

      if (!authUrl) {
        throw new Error('URL авторизации не получен');
      }

      window.open(authUrl, '_blank');
    } catch (err) {
      setError(err.message || 'Ошибка при получении URL авторизации');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex justify-center items-center w-full min-h-screen bg-gradient-to-br from-[#fafafa] via-[#f0e6ff] to-[#e8d5ff]">
      <div className="flex flex-col items-center justify-center px-8 w-full max-w-md">
        <h1 className="text-[28px] font-semibold text-black text-center mb-[60px]">
          Добро пожаловать,
        </h1>

        {error && (
          <div className="flex flex-row items-center bg-[#FF3B3010] px-4 py-3 rounded-lg mb-6 w-full">
            <IoAlertCircle size={20} color="#FF3B30" />
            <p className="text-[#FF3B30] text-sm ml-2 flex-1">{error}</p>
          </div>
        )}

        <button
          data-testid="login-button"
          className={`flex flex-row items-center justify-center bg-primary px-8 py-4 rounded-xl w-full mb-4 ${
            isLoading ? 'opacity-60 cursor-not-allowed' : 'hover:opacity-90'
          } transition-opacity`}
          onClick={handleTelegramAuth}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent" />
          ) : (
            <>
              <IoSend size={24} color="#fff" />
              <span className="text-white text-base font-semibold ml-3">
                Войти через Telegram
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
