import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../src/context/AuthContext';
import { authAPI } from '../../src/utils/api';

export default function YandexCallback() {
  const [status, setStatus] = useState('processing');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        
        const code = urlParams.get('code') || hashParams.get('code');

        console.log('Callback page - URL:', window.location.href);
        console.log('Callback page - Code extracted:', code);

        if (!code) {
          console.log('No code found, redirecting to home');
          router.replace('/');
          return;
        }

        console.log('Calling verifyCode with code:', code);
        const response = await authAPI.verifyCode(code);
        console.log('verifyCode response:', response);

        if (response && response.session_cookie) {
          const userData = response.user || { id: response.user_id };
          await login(response.session_cookie, userData);
          
          setStatus('success');
          setTimeout(() => {
            router.replace('/welcome');
          }, 1000);
        } else {
          throw new Error('Не удалось получить данные сессии');
        }
      } catch (err) {
        console.error('Callback error:', err);
        console.log('Error occurred, redirecting to home');
        router.replace('/');
      }
    };

    if (router.isReady) {
      handleCallback();
    }
  }, [router.isReady, login, router]);

  return (
    <div className="flex-1 flex justify-center items-center w-full min-h-screen bg-gradient-to-br from-[#fafafa] via-[#f0e6ff] to-[#e8d5ff]">
      <div className="flex flex-col items-center justify-center px-8 w-full max-w-md">
        {status === 'processing' && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#8B5CF6] border-t-transparent mb-4" />
            <p className="text-lg text-gray-700">Обработка авторизации...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="text-[#34C759] text-6xl mb-4">✓</div>
            <p className="text-lg text-gray-700">Авторизация успешна!</p>
            <p className="text-sm text-gray-500 mt-2">Перенаправление...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="text-[#FF3B30] text-6xl mb-4">✕</div>
            <p className="text-lg text-gray-700 mb-2">Ошибка авторизации</p>
            <p className="text-sm text-gray-500 mb-6">{error}</p>
            <button
              className="bg-[#8B5CF6] text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
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
