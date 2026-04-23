import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { authAPI } from '../../src/utils/api';
import { useAuth } from '../../src/context/AuthContext';
import { useTheme } from '../../src/context/ThemeContext';

export default function TestAuth() {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const { isDarkMode } = useTheme();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('processing');
    setError('');

    try {
      console.log('Testing auth with code:', code);
      const response = await authAPI.verifyCode(code);
      console.log('Response:', response);

      if (response && response.verified) {
        try {
          const userData = await authAPI.whoami();
          console.log('User data from whoami:', userData);
          
          if (userData) {
            localStorage.setItem('session_cookie', 'YAA_SESS_ID=httponly');
            localStorage.setItem('user_data', JSON.stringify(userData));
            await login('YAA_SESS_ID=httponly', userData);
            
            setStatus('success');
            setTimeout(() => {
              router.replace('/main/home');
            }, 500);
            return;
          }
        } catch (whoamiError) {
          console.error('Whoami error:', whoamiError);
        }
        
        throw new Error('Не удалось получить данные пользователя через whoami');
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
    <div className={`min-h-screen flex items-center justify-center p-4 ${isDarkMode ? 'bg-[#121212]' : 'bg-gray-100'}`}>
      <div className={`rounded-lg shadow-lg p-8 max-w-md w-full ${isDarkMode ? 'bg-[#181818] border border-[#4d4d4d]' : 'bg-white'}`}>
        <h1 className={`text-2xl font-bold mb-6 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Test Auth</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-[#b3b3b3]' : 'text-gray-700'}`}>
              Yandex Code
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="qcgmlvcgmoaen6us"
              className={`w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${isDarkMode ? 'bg-[#1f1f1f] border border-[#4d4d4d] text-white placeholder-[#666]' : 'border border-gray-300'}`}
              required
            />
          </div>

          <button
            type="submit"
            disabled={status === 'processing'}
            className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {status === 'processing' ? 'Обработка...' : 'Войти'}
          </button>
        </form>

        {status === 'success' && (
          <div className={`mt-4 p-4 rounded-lg ${isDarkMode ? 'bg-[#1a3d1a] text-[#34C759]' : 'bg-green-100 text-green-700'}`}>
            ✓ Успешно! Перенаправление...
          </div>
        )}

        {status === 'error' && (
          <div className={`mt-4 p-4 rounded-lg ${isDarkMode ? 'bg-[#3d1a1a] text-danger' : 'bg-red-100 text-red-700'}`}>
            ✕ Ошибка: {error}
          </div>
        )}

        <div className={`mt-6 text-sm ${isDarkMode ? 'text-[#b3b3b3]' : 'text-gray-500'}`}>
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
