import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { IoShieldOutline, IoPhonePortraitOutline, IoDesktopOutline, IoTrashOutline } from 'react-icons/io5';
import { useTheme } from '../../src/context/ThemeContext';
import { authAPI } from '../../src/utils/api';
import { useAuth } from '../../src/context/AuthContext';

export default function SessionLimit() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [sessions, setSessions] = useState([]);
  const [username, setUsername] = useState('');
  const [preauthSessionId, setPreauthSessionId] = useState('');
  const [authCode, setAuthCode] = useState('');

  useEffect(() => {
    if (router.query.data) {
      try {
        const data = JSON.parse(router.query.data);
        setSessions(data.sessions || []);
        setUsername(data.username || '');
        setPreauthSessionId(data.preauthSessionId || '');
      } catch (e) {
        console.error('Error parsing session data:', e);
      }
    }
    if (router.query.code) {
      setAuthCode(router.query.code);
    }
  }, [router.query.data, router.query.code]);

  const handleDeleteSession = async (sessionId) => {
    setIsLoading(true);
    setError('');

    try {
      await authAPI.deleteSession(sessionId, preauthSessionId);

      document.cookie = 'YAA_SESS_ID=; Path=/; Max-Age=0';

      try {
        const userData = await authAPI.whoami();
        if (userData) {
          localStorage.setItem('session_cookie', 'YAA_SESS_ID=httponly');
          localStorage.setItem('user_data', JSON.stringify(userData));
          await login('YAA_SESS_ID=httponly', userData);
          router.replace('/welcome');
          return;
        }
      } catch (e) {
        console.log('whoami after preauth failed:', e);
      }

      router.replace('/auth/yandex');
    } catch (err) {
      if (err.status === 300 && err.data) {
        setSessions(err.data.sessions || []);
        setError('Сессия завершена, но лимит всё ещё превышен. Завершите ещё одну.');
        setIsLoading(false);
        return;
      }
      setError(err.message || 'Ошибка при удалении сессии');
      setIsLoading(false);
    }
  };

  const formatDevice = (session) => {
    const os = session.userAgent?.os || '';
    const browser = session.userAgent?.browser?.name || '';
    if (os && browser) return `${os}, ${browser}`;
    if (os) return os;
    return 'Неизвестное устройство';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getDeviceIcon = (session) => {
    const type = session.userAgent?.device?.type;
    if (type === 'mobile' || type === 'tablet') return IoPhonePortraitOutline;
    return IoDesktopOutline;
  };

  return (
    <div className={`min-h-screen px-6 pt-8 ${isDarkMode ? 'bg-[#121212]' : 'bg-[#F7F7FB]'}`}>
      <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg ${isDarkMode ? 'bg-[#181818] border border-[#4d4d4d]' : 'bg-white'}`}>
        <IoShieldOutline size={48} color="#6A2EE8" />
      </div>

      <h1 className={`text-2xl font-bold mb-2 text-center ${isDarkMode ? 'text-white' : 'text-[#000]'}`}>Превышен лимит сессий</h1>
      <p className={`text-base text-center mb-6 ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>
        {username ? `${username}, у` : 'У'} вас слишком много активных сессий. Завершите одну из них, чтобы войти.
      </p>

      {error && (
        <div className={`flex items-center px-4 py-3 rounded-lg mb-4 ${isDarkMode ? 'bg-[#3d1a1a]' : 'bg-[#FF3B3010]'}`}>
          <IoShieldOutline size={20} color="#FF3B30" />
          <p className="text-[#FF3B30] text-sm ml-2 flex-1">{error}</p>
        </div>
      )}

      <div className="space-y-3 mb-8">
        {sessions.map((session, index) => {
          const DeviceIcon = getDeviceIcon(session);
          return (
            <button
              key={session.sessionId || index}
              className={`flex items-center p-4 rounded-xl shadow-sm w-full ${isDarkMode ? 'bg-[#181818] border border-[#4d4d4d]' : 'bg-white'}`}
              onClick={() => handleDeleteSession(session.sessionId)}
              disabled={isLoading}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${isDarkMode ? 'bg-[#2a1a4d]' : 'bg-[#6A2EE810]'}`}>
                <DeviceIcon size={24} color="#6A2EE8" />
              </div>
              <div className="flex-1 text-left">
                <p className={`text-sm font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-[#000]'}`}>{formatDevice(session)}</p>
                <p className={`text-xs mb-0.5 ${isDarkMode ? 'text-[#666]' : 'text-[#999]'}`}>{formatDate(session.lastActivityDate)}</p>
                <p className={`text-[11px] ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>IP: {session.authIp}</p>
              </div>
              <IoTrashOutline size={20} color="#FF3B30" />
            </button>
          );
        })}
      </div>

      {isLoading && (
        <div className={`fixed inset-0 flex flex-col items-center justify-center ${isDarkMode ? 'bg-[#121212]/90' : 'bg-white/90'}`}>
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4" />
          <p className={`text-sm ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>Завершение сессии...</p>
        </div>
      )}
    </div>
  );
}
