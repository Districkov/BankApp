import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../src/context/AuthContext';
import { authAPI } from '../../src/utils/api';

export default function CodeCallback() {
  const [status, setStatus] = useState('processing');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Все способы получить код из URL
        const urlParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        
        const code = urlParams.get('code') || hashParams.get('code');
        
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

        if (response && response.session_cookie) {
          const userData = response.user || { id: response.user_id };
          console.log('Login successful, redirecting to welcome');
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
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '20px' }}>
      <div style={{ textAlign: 'center', maxWidth: '400px' }}>
        {status === 'processing' && (
          <>
            <p style={{ fontSize: '18px' }}>Авторизация...</p>
            <p style={{ fontSize: '12px', color: '#666' }}>Пожалуйста, подождите</p>
          </>
        )}
        {status === 'error' && (
          <>
            <p style={{ color: 'red', fontSize: '16px', fontWeight: 'bold' }}>❌ Ошибка авторизации</p>
            <p style={{ color: 'red', fontSize: '14px', marginTop: '10px' }}>{error}</p>
            <button 
              onClick={() => window.location.href = '/auth/yandex'}
              style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer' }}
            >
              ← Вернуться к входу
            </button>
          </>
        )}
        {status === 'success' && (
          <>
            <p style={{ color: 'green', fontSize: '16px', fontWeight: 'bold' }}>✓ Вход выполнен!</p>
            <p style={{ fontSize: '14px', marginTop: '10px' }}>Перенаправление на главную...</p>
          </>
        )}
      </div>
    </div>
  );
}
