import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../src/context/AuthContext';
import { useTheme } from '../../src/context/ThemeContext';
import { authAPI } from '../../src/utils/api';

export default function CodeCallback() {
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

      try {
        
        console.log('Authorization callback started');
        console.log('Full URL:', window.location.href);
        console.log('Search params:', window.location.search);
        console.log('Code extracted:', code);

        if (!code) {
          console.log('No code found, redirecting to home');
          router.replace('/');
          return;
        }

        console.log('Sending verification request for code:', code);
        const response = await authAPI.verifyCode(code);
        
        console.log('Verification response:', response);

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
            console.error('whoami failed:', whoamiErr);
            localStorage.setItem('session_cookie', 'YAA_SESS_ID=httponly');
            router.replace('/welcome');
            return;
          }

          setStatus('success');
          setTimeout(() => {
            router.replace('/welcome');
          }, 1000);
        } else {
          throw new Error('Не удалось подтвердить код авторизации');
        }
      } catch (err) {
        if (err.status === 300 && err.data) {
          console.log('Session limit reached, redirecting to session-limit');
          router.replace({
            pathname: '/auth/session-limit',
            query: { data: JSON.stringify(err.data), code: code },
          });
          return;
        }
        console.error('Callback error:', err);
        setStatus('error');
        setError(err.message || 'Ошибка авторизации');
      }
    };

    if (router.isReady) {
      handleCallback();
    }
  }, [router.isReady, login, router]);

  return (
    <div className={`flex justify-center items-center min-h-screen ${isDarkMode ? 'bg-[#121212]' : 'bg-[#F7F7FB]'}`} style={{ padding: '20px' }}>
      <div style={{ textAlign: 'center', maxWidth: '400px' }}>
        {status === 'processing' && (
          <>
            <p className={`text-lg ${isDarkMode ? 'text-white' : 'text-[#000]'}`}>Авторизация...</p>
            <p className={`text-xs ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>Пожалуйста, подождите</p>
          </>
        )}
        {status === 'error' && (
          <>
            <p className="text-danger font-bold text-base">❌ Ошибка авторизации</p>
            <p className={`text-sm mt-2.5 ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>{error}</p>
            <button 
              onClick={() => window.location.href = '/auth/yandex'}
              className={`mt-5 px-5 py-2.5 rounded-lg ${isDarkMode ? 'bg-[#181818] border border-[#4d4d4d] text-white' : 'bg-white text-[#000]'}`}
            >
              ← Вернуться к входу
            </button>
          </>
        )}
        {status === 'success' && (
          <>
            <p className="text-success font-bold text-base">✓ Вход выполнен!</p>
            <p className={`text-sm mt-2.5 ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>Перенаправление на главную...</p>
          </>
        )}
      </div>
    </div>
  );
}
