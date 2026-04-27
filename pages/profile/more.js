import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import MainLayout from '../../src/components/MainLayout';
import { IoPersonOutline, IoDocumentTextOutline, IoHelpCircleOutline, IoLogOutOutline } from 'react-icons/io5';
import { useAuth } from '../../src/context/AuthContext';
import { useTheme } from '../../src/context/ThemeContext';
import { userAPI, accountsAPI } from '../../src/utils/api';

export default function More() {
  const router = useRouter();
  const { logout, user: authUser } = useAuth();
  const { isDarkMode } = useTheme();
  const [profileData, setProfileData] = useState(null);
  const [totalBalance, setTotalBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  const user = profileData || authUser;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [userData, accountsData] = await Promise.all([
        userAPI.getProfile().catch(() => null),
        accountsAPI.getAccounts().catch(() => [])
      ]);
      
      if (userData) {
        setProfileData(userData);
      }
      
      if (accountsData && accountsData.length > 0) {
        let ratesMap = {};
        try {
          const [currenciesData, ratesData] = await Promise.all([
            accountsAPI.getCurrencies().catch(() => []),
            accountsAPI.getExchangeRates().catch(() => []),
          ]);
          const idToCode = {};
          if (Array.isArray(currenciesData)) {
            currenciesData.forEach(c => { idToCode[c.id] = c.currencyCode; });
          }
          if (Array.isArray(ratesData)) {
            ratesData.forEach(r => {
              const fromCode = idToCode[r.fromCurrencyId] || r.fromCurrencyId;
              const toCode = idToCode[r.toCurrencyId] || r.toCurrencyId;
              ratesMap[`${fromCode}->${toCode}`] = parseFloat(r.rate);
              ratesMap[`${toCode}->${fromCode}`] = parseFloat(r.inverseRate || (1 / parseFloat(r.rate)));
            });
          }
        } catch {}

        const total = accountsData.reduce((sum, acc) => {
          const balance = parseFloat(acc.balance || 0);
          const code = acc.currency?.currencyCode || 'RUB';
          if (code === 'RUB') return sum + balance;
          const rate = ratesMap[`${code}->RUB`] || 1;
          return sum + balance * rate;
        }, 0);
        setTotalBalance(total);
      }
    } catch (error) {
      console.error('Error loading profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (confirm('Вы уверены, что хотите выйти?')) {
      try {
        await logout();
        router.push('/');
      } catch (error) {
        alert('Не удалось выйти. Попробуйте еще раз.');
      }
    }
  };

  const formatBalance = (balance) => {
    return new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(balance);
  };

  const menuSections = [
    {
      title: 'Аккаунт',
      items: [
        {
          icon: IoPersonOutline,
          title: 'Профиль',
          description: 'Личные данные и настройки',
          color: '#1A889F',
          screen: '/profile/settings'
        },
        {
          icon: IoDocumentTextOutline,
          title: 'История операций',
          description: 'Все транзакции и выписки',
          color: '#4ECDC4',
          screen: '/history/transactions'
        }
      ]
    },
    {
      title: 'Помощь',
      items: [
        {
          icon: IoHelpCircleOutline,
          title: 'Служба поддержки',
          description: 'Частые вопросы и поддержка',
          color: '#AB47BC',
          screen: '/profile/support'
        }
      ]
    }
  ];

  if (loading) {
    return (
      <MainLayout>
        <div className={`flex-1 flex items-center justify-center ${isDarkMode ? 'bg-[#121212]' : 'bg-[#F7F7FB]'}`}>
          <div className={`animate-spin rounded-full h-12 w-12 border-4 border-t-transparent ${isDarkMode ? 'border-[#1A889F]' : 'border-primary'}`} />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className={`flex flex-col flex-1 ${isDarkMode ? 'bg-[#121212]' : 'bg-[#F7F7FB]'}`}>
        <div className={`px-5 py-4 border-b ${isDarkMode ? 'bg-[#181818] border-[#4d4d4d]' : 'bg-white border-[#E5E5E5]'}`}>
          <h1 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-[#000]'}`}>Ещё</h1>
        </div>

        <div className="p-4">
          {/* Profile Card */}
          <button
            className={`p-5 rounded-2xl shadow-sm mb-6 w-full text-left ${isDarkMode ? 'bg-[#181818] border border-[#4d4d4d]' : 'bg-white'}`}
            onClick={() => router.push('/profile/settings')}
          >
            <div className="flex items-center mb-4">
              <div className="w-[60px] h-[60px] rounded-full bg-primary flex items-center justify-center mr-3">
                <span className="text-white text-xl font-bold">
                  {user?.first_name?.[0] || 'И'}{user?.last_name?.[0] || ''}
                </span>
              </div>
              <div>
                <p className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-[#000]'}`}>
                  {user?.first_name || 'Иван'} {user?.last_name || ''}
                </p>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2">
                <span className={`text-sm ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>📞 {user?.phone_number || '—'}</span>
              </div>
              {user?.email && (
                <div className="flex items-center gap-2">
                  <span className={`text-sm ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>✉️ {user.email}</span>
                </div>
              )}
            </div>

            <div className={`flex justify-between items-center pt-3 border-t ${isDarkMode ? 'border-[#4d4d4d]' : 'border-[#F0F0F0]'}`}>
              <span className={`text-sm font-medium ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>Общий баланс</span>
              <span className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-[#000]'}`}>{formatBalance(totalBalance)} ₽</span>
            </div>
          </button>

          {/* Menu Sections */}
          {menuSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-6">
              <h2 className={`text-base font-semibold mb-3 ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>{section.title}</h2>
              <div className="space-y-2">
                {section.items.map((item, itemIndex) => (
                  <button
                    key={itemIndex}
                    className={`flex items-center p-4 rounded-xl shadow-sm w-full ${isDarkMode ? 'bg-[#181818] border border-[#4d4d4d]' : 'bg-white'}`}
                    onClick={() => router.push(item.screen)}
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                      style={{ backgroundColor: item.color }}
                    >
                      <item.icon size={20} color="#fff" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className={`text-base font-semibold ${isDarkMode ? 'text-white' : 'text-[#000]'}`}>{item.title}</p>
                      <p className={`text-xs ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>{item.description}</p>
                    </div>
                    <span className={isDarkMode ? 'text-[#b3b3b3]' : 'text-[#999]'}>›</span>
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Logout Button */}
          <button
            className={`flex items-center p-4 rounded-xl shadow-sm w-full ${isDarkMode ? 'bg-[#181818] border border-[#4d4d4d]' : 'bg-white'}`}
            onClick={handleLogout}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${isDarkMode ? 'bg-[#3d1a1a]' : 'bg-[#FFE8E8]'}`}>
              <IoLogOutOutline size={20} color="#FF3B30" />
            </div>
            <span className="text-base font-semibold text-[#FF3B30]">Выйти</span>
          </button>
        </div>
      </div>
    </MainLayout>
  );
}
