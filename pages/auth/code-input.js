import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { IoShieldCheckmark, IoAlertCircle } from 'react-icons/io5';
import { useAuth } from '../../src/context/AuthContext';

const API_URL = 'https://bank.korzik.space/api/auth/v1';

export default function CodeInputScreen() {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isAutoSubmitting, setIsAutoSubmitting] = useState(false);
  const inputRefs = useRef([]);
  const { login } = useAuth();
  const router = useRouter();
  const tgAuthResultRef = useRef('');

  useEffect(() => {
    const authCode = router.query.code;
    if (authCode) {
      tgAuthResultRef.current = authCode;
      setIsAutoSubmitting(true);
      handleSubmit(authCode);
    }
  }, [router.query.code]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleCodeChange = (text, index) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);
    setError('');

    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (verificationCode) => {
    const codeToVerify = verificationCode || code.join('');
    
    if (!codeToVerify || codeToVerify.length < 6) {
      setError('Введите код авторизации');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/simple/telegram/callback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          code: codeToVerify,
        }),
      });

      if (response.status === 300) {
        const data = await response.json();
        router.push({
          pathname: '/auth/session-limit',
          query: {
            sessions: JSON.stringify(data.sessions),
            preauthSessionId: data.preauthSessionId,
            username: data.username,
            tgAuthResult: codeToVerify,
          },
        });
        setIsLoading(false);
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Ошибка авторизации');
      }

      const setCookieHeader = response.headers.get('set-cookie');
      if (setCookieHeader) {
        localStorage.setItem('session_cookie', setCookieHeader);
      }
      
      let userData = {};
      try {
        userData = await response.json();
      } catch (e) {
        // Response может быть пустым
      }
      
      await login(setCookieHeader || 'session_cookie', userData);

      router.replace('/welcome');
    } catch (err) {
      setError(err.message || 'Ошибка при проверке кода');
      setIsAutoSubmitting(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = () => {
    console.log('Resend code');
  };

  return (
    <div className="flex-1 bg-[#F7F7FB] min-h-screen">
      <div className="flex-1 flex flex-col justify-center items-center px-8">
        <div className="w-20 h-20 rounded-full bg-white flex justify-center items-center mb-6 shadow-lg">
          <IoShieldCheckmark size={48} color="#6A2EE8" />
        </div>

        <h1 className="text-2xl font-bold text-black mb-3 text-center">
          Подтверждение
        </h1>
        <p className="text-base text-[#666] text-center leading-6 mb-8">
          {isAutoSubmitting
            ? 'Проверка данных Telegram...'
            : 'Введите код из Telegram'
          }
        </p>

        {error && (
          <div className="flex flex-row items-center bg-[#FF3B3010] px-4 py-3 rounded-lg mb-6 w-full max-w-md">
            <IoAlertCircle size={20} color="#FF3B30" />
            <p className="text-[#FF3B30] text-sm ml-2 flex-1">{error}</p>
          </div>
        )}

        {!isAutoSubmitting && (
          <>
            <div className="flex flex-row justify-center items-center mb-8 w-full max-w-md">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(ref) => (inputRefs.current[index] = ref)}
                  className={`w-12 h-14 rounded-xl bg-white border text-2xl font-semibold text-center mx-1 text-black focus:outline-none focus:ring-2 focus:ring-primary ${
                    digit ? 'border-primary bg-[#6A2EE810]' : 'border-[#E5E5E5]'
                  } ${error ? 'border-[#FF3B30] bg-[#FF3B3010]' : ''}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  autoFocus={index === 0}
                />
              ))}
            </div>

            <button
              className={`bg-primary px-8 py-4 rounded-xl w-full max-w-md flex items-center justify-center mb-4 ${
                isLoading ? 'opacity-60 cursor-not-allowed' : 'hover:opacity-90'
              } transition-opacity`}
              onClick={() => handleSubmit()}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent" />
              ) : (
                <span className="text-white text-base font-semibold">Подтвердить</span>
              )}
            </button>

            <button 
              onClick={handleResendCode} 
              disabled={isLoading}
              className="text-primary text-sm font-medium hover:opacity-80 transition-opacity"
            >
              Отправить код повторно
            </button>
          </>
        )}

        {isAutoSubmitting && isLoading && (
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
        )}
      </div>
    </div>
  );
}
