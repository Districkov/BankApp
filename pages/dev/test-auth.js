import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { authAPI } from '../../src/utils/api';
import { useAuth } from '../../src/context/AuthContext';

export default function TestAuth() {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('processing');
    setError('');

    try {
      console.log('Testing auth with code:', code);
      const response = await authAPI.verifyCode(code);
      console.log('Response:', response);

      // Если получили 201 (success: true), проверяем whoami
      if (response && (response.success || response.session_cookie)) {
        try {
          // Пробуем получить данные пользователя
          const userData = await authAPI.whoami();
          console.log('User data from whoami:', userData);
          
          if (userData) {
            // Cookie установлен автоматически сервером (HttpOnly)
            // Сохраняем флаг авторизации в localStorage
            localStorage.setItem('session_cookie', 'YAA_SESS_ID=httponly');
            localStorage.setItem('user_data', JSON.stringify(userData));
            
            setStatus('success');
            setTimeout(() => {
              router.replace('/main/home');
            }, 500);
            return;
          }
        } catch (whoamiError) {
          console.error('Whoami error:', whoamiError);
        }
        
        // Если есть session_cookie в ответе
        if (response.session_cookie) {
          const userData = response.user || { id: response.user_id };
          await login(response.session_cookie, userData);
          
          setStatus('success');
          setTimeout(() => {
            router.replace('/main/home');
          }, 1000);
          return;
        }
        
        throw new Error('Не удалось получить session_cookie');
      } else {
        throw new Error('Неожиданный ответ от сервера');
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError(err.message || err.toString());
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">Test Auth</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Yandex Code
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="qcgmlvcgmoaen6us"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            disabled={status === 'processing'}
            className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {status === 'processing' ? 'Обработка...' : 'Войти'}
          </button>
        </form>

        {status === 'success' && (
          <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-lg">
            ✓ Успешно! Перенаправление...
          </div>
        )}

        {status === 'error' && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
            ✕ Ошибка: {error}
          </div>
        )}

        <div className="mt-6 text-sm text-gray-500">
          <p className="font-semibold mb-2">Как использовать:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Получите код через Swagger</li>
            <li>Вставьте код в поле выше</li>
            <li>Нажмите "Войти"</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
