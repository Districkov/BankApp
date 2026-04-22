import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../src/context/AuthContext';
import { useTheme } from '../../src/context/ThemeContext';
import { authAPI } from '../../src/utils/api';

export default function YandexCallback() {
  const [status, setStatus] = useState('processing');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const { isDarkMode } = useTheme();
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const code = urlParams.get('code') || hashParams.get('code');

      console.log('Callback page - Code:', code);

      if (!code) {
        router.replace('/');
        return;
      }

      try {
        const response = await authAPI.verifyCode(code);
        console.log('verifyCode FULL response:', JSON.stringify(response));

        if (response && response.verified) {
          try {
            const userData = await authAPI.whoami();
            console.log('whoami after verify:', userData);
            if (userData) {
              localStorage.setItem('session_cookie', 'YAA_SESS_ID=httponly');
              localStorage.setItem('user_data', JSON.stringify(userData));
              await login('YAA_SESS_ID=httponly', userData);
            } else {
              throw new Error('whoami вернул пустые данные');
            }
          } catch (whoamiErr) {
            console.error('whoami failed after verify:', whoamiErr);
            localStorage.setItem('session_cookie', 'YAA_SESS_ID=httponly');
            router.replace('/welcome');
            return;
          }
        } else {
          console.error('verifyCode returned non-success:', response);
          setStatus('error');
          setError('Не удалось подтвердить код авторизации');
          setTimeout(() => { router.replace('/'); }, 3000);
          return;
        }

        setStatus('success');
        setTimeout(() => {
          router.replace('/welcome');
        }, 1000);
      } catch (err) {
        if (err.status === 300 && err.data) {
          console.log('Session limit reached, redirecting to session-limit');
          router.replace({
            pathname: '/auth/session-limit',
            query: {
              data: JSON.stringify(err.data),
              code: code,
            },
          });
          return;
        }

        console.error('Callback error:', err);
        setStatus('error');
        setError(err.message || 'Ошибка авторизации');
        setTimeout(() => {
          router.replace('/');
        }, 3000);
      }
    };

    if (router.isReady) {
      handleCallback();
    }
  }, [router.isReady, login, router]);

  return (
    <div className={`flex-1 flex justify-center items-center w-full min-h-screen ${isDarkMode ? 'bg-[#121212]' : 'bg-[#F7F7FB]'}`}>
      <div className="flex flex-col items-center justify-center px-8 w-full max-w-md">
        {status === 'processing' && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4" />
            <p className={`text-base ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>Обработка авторизации...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="text-success text-6xl mb-4">✓</div>
            <p className={`text-base ${isDarkMode ? 'text-white' : 'text-[#000]'}`}>Авторизация успешна!</p>
            <p className={`text-sm mt-2 ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>Перенаправление...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="text-danger text-6xl mb-4">✕</div>
            <p className={`text-base mb-2 ${isDarkMode ? 'text-white' : 'text-[#000]'}`}>Ошибка авторизации</p>
            <p className={`text-sm mb-6 ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>{error}</p>
            <button
              className="bg-primary text-white px-6 py-3 rounded-xl hover:opacity-90 transition-opacity"
              onClick={() => router.push('/auth/yandex')}
            >
              Попробовать снова
            </button>
          </>
        )}
      </div>
    </div>
  );
}
