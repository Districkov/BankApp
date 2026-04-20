import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { IoShieldOutline, IoPhonePortraitOutline, IoDesktopOutline, IoTrashOutline } from 'react-icons/io5';

export default function SessionLimit() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // В реальном приложении эти данные придут из route params
  const sessions = [
    {
      sessionId: '1',
      userAgent: { os: 'Windows 10', browser: { name: 'Chrome' }, device: { type: 'desktop' } },
      lastActivityDate: '2026-04-20T19:00:00Z',
      authIp: '192.168.1.1'
    },
    {
      sessionId: '2',
      userAgent: { os: 'iOS 17', browser: { name: 'Safari' }, device: { type: 'mobile' } },
      lastActivityDate: '2026-04-19T15:30:00Z',
      authIp: '192.168.1.2'
    }
  ];
  const username = 'Иван';

  const handleDeleteSession = async (sessionId) => {
    setIsLoading(true);
    setError('');

    try {
      // TODO: Implement API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      router.replace('/welcome');
    } catch (err) {
      setError(err.message || 'Ошибка при удалении сессии');
      setIsLoading(false);
    }
  };

  const formatDevice = (session) => {
    const os = session.userAgent?.os || '';
    const browser = session.userAgent?.browser?.name || '';
    const device = session.device?.model || session.device?.vendor || '';
    
    if (os && browser) return `${os}, ${browser}`;
    if (os) return os;
    if (device) return device;
    return 'Неизвестное устройство';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-[#F7F7FB] px-6 pt-8">
      <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mx-auto mb-6 shadow-lg">
        <IoShieldOutline size={48} color="#6A2EE8" />
      </div>

      <h1 className="text-2xl font-bold text-[#000] mb-2 text-center">Превышен лимит сессий</h1>
      <p className="text-base text-[#666] text-center mb-6">
        {username}, выберите сессию для удаления
      </p>

      {error && (
        <div className="flex items-center bg-[#FF3B3010] px-4 py-3 rounded-lg mb-4">
          <IoShieldOutline size={20} color="#FF3B30" />
          <p className="text-[#FF3B30] text-sm ml-2 flex-1">{error}</p>
        </div>
      )}

      <div className="space-y-3 mb-8">
        {sessions?.map((session, index) => (
          <button
            key={session.sessionId}
            className="flex items-center bg-white p-4 rounded-xl shadow-sm w-full"
            onClick={() => handleDeleteSession(session.sessionId)}
            disabled={isLoading}
          >
            <div className="w-10 h-10 rounded-full bg-[#6A2EE810] flex items-center justify-center mr-3">
              {session.userAgent?.device?.type === 'mobile' ? (
                <IoPhonePortraitOutline size={24} color="#6A2EE8" />
              ) : (
                <IoDesktopOutline size={24} color="#6A2EE8" />
              )}
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold text-[#000] mb-1">{formatDevice(session)}</p>
              <p className="text-xs text-[#999] mb-0.5">{formatDate(session.lastActivityDate)}</p>
              <p className="text-[11px] text-[#666]">{session.authIp}</p>
            </div>
            <IoTrashOutline size={20} color="#FF3B30" />
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="fixed inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4" />
          <p className="text-sm text-[#666]">Удаление сессии...</p>
        </div>
      )}
    </div>
  );
}
