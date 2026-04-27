import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { IoHomeOutline, IoPhonePortraitOutline, IoTrendingUp, IoEyeOutline, IoEyeOffOutline, IoChevronForward, IoCheckmarkCircle, IoAddCircleOutline } from 'react-icons/io5';
import { MdOutlineCreditCard } from 'react-icons/md';
import MainLayout from '../../src/components/MainLayout';
import AccountSlider from '../../src/components/AccountSlider';
import { accountsAPI, userAPI } from '../../src/utils/api';
import { useTheme } from '../../src/context/ThemeContext';

const AstraLogo = ({ width = 50, height = 50 }) => (
  <div className="bg-black rounded-xl flex items-center justify-center p-2" style={{ width, height }}>
    <img src="/partners/astra-logo.svg" alt="Astra" style={{ width: width * 0.7, height: height * 0.7 }} />
  </div>
);

const YanimaLogo = ({ width = 50, height = 50 }) => (
  <div className="bg-white rounded-2xl flex items-center justify-center shadow-lg border border-[#E5E5E5]" style={{ width, height }}>
    <img src="/partners/yanima-logo.png" alt="Yanima" width={60} height={60} />
  </div>
);

const CURRENCY_SYMBOLS = { RUB: '₽', USD: '$', EUR: '€' };
const CURRENCY_COLORS = { RUB: '#1A889F', USD: '#159E3A', EUR: '#E5A100' };

export default function Home() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const [isBalanceHidden, setIsBalanceHidden] = useState(false);
  const [user, setUser] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [sliderAccounts, setSliderAccounts] = useState([]);
  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [userData, accountsData] = await Promise.all([
        userAPI.getProfile(),
        accountsAPI.getAccounts(),
      ]);

      setUser(userData);
      setAccounts(accountsData || []);

      if (accountsData && accountsData.length > 0) {
        const mapped = accountsData.map(acc => {
          const code = acc.currency?.currencyCode || 'RUB';
          const rawSymbol = acc.currency?.symbol;
          return {
            id: acc.id,
            balance: parseFloat(acc.balance || 0),
            currency: code,
            symbol: (rawSymbol && rawSymbol !== '?') ? rawSymbol : CURRENCY_SYMBOLS[code] || '₽',
            color: CURRENCY_COLORS[code] || '#1A889F',
          };
        });
        setSliderAccounts(mapped);
        setSelectedAccountId(accountsData[0].id);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { title: 'Перевод по номеру', icon: 'phone', nav: '/transfers/phone', color: '#159E3A' },
    { title: 'Перевести', icon: 'transfer', nav: '/transfers/accounts', color: '#1A889F' },
  ];

  const partners = [
    {
      id: 1,
      name: 'Astra RP',
      discount: 'Эксклюзивные бонусы',
      description: 'GTA 5 RolePlay проект\nСпециальные условия для клиентов',
      logo: AstraLogo,
      screen: '/partners/astra',
      color: '#FF0000',
      benefits: ['Игровая валюта', 'Премиум аккаунт', 'Эксклюзивный контент']
    },
    {
      id: 2,
      name: 'Yanima',
      discount: 'Подписка в подарок',
      description: 'Онлайн-просмотр аниме\nСпециальные предложения',
      logo: YanimaLogo,
      screen: '/partners/yanima',
      color: '#1A889F',
      benefits: ['Премиум подписка', 'Ранний доступ', 'Эксклюзивные релизы']
    },
  ];

  const getIcon = (iconName) => {
    switch(iconName) {
      case 'phone': return <IoPhonePortraitOutline size={24} color="#fff"/>;
      case 'transfer': return <MdOutlineCreditCard size={24} color="#fff" />;
      default: return <IoHomeOutline size={24} color="#fff"/>;
    }
  };

  const handleProfilePress = () => {
    router.push('/profile/more');
  };

  const handlePartnerPress = (partner) => {
    router.push(partner.screen);
  };

  const handleCreateAccount = async () => {
    const existing = accounts.map(a => a.currency?.currencyCode);
    const available = [
      { code: 'RUB', name: 'Рубли', symbol: '₽' },
      { code: 'USD', name: 'Доллары', symbol: '$' },
      { code: 'EUR', name: 'Евро', symbol: '€' },
    ].filter(c => !existing.includes(c.code));

    if (available.length === 0) return;

    const currency = available[0];
    try {
      await accountsAPI.createAccount(currency.code);
      const accountsData = await accountsAPI.getAccounts();
      setAccounts(accountsData || []);

      if (accountsData && accountsData.length > 0) {
        const mapped = accountsData.map(acc => {
          const code = acc.currency?.currencyCode || 'RUB';
          const rawSymbol = acc.currency?.symbol;
          return {
            id: acc.id,
            balance: parseFloat(acc.balance || 0),
            currency: code,
            symbol: (rawSymbol && rawSymbol !== '?') ? rawSymbol : CURRENCY_SYMBOLS[code] || '₽',
            color: CURRENCY_COLORS[code] || '#1A889F',
          };
        });
        setSliderAccounts(mapped);
        if (!selectedAccountId) setSelectedAccountId(accountsData[0].id);
      }
    } catch (error) {
      console.error('Error creating account:', error);
    }
  };

  const PartnerLogo = ({ logo: LogoComponent, size = 60, partnerId }) => {
    const bgColor = partnerId === 2 ? 'bg-white border border-[#E5E5E5]' : 'bg-black';

    return (
      <div className={`rounded-2xl ${bgColor} flex items-center justify-center p-2 shadow-lg`} style={{ width: size, height: size }}>
        <LogoComponent width={size - 10} height={size - 10} />
      </div>
    );
  };

  const formatBalance = (balance) => {
    return new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(balance);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className={`flex-1 flex items-center justify-center ${isDarkMode ? 'bg-[#121212]' : 'bg-[#F8FAFD]'}`}>
          <div className={`animate-spin rounded-full h-12 w-12 border-4 border-t-transparent ${isDarkMode ? 'border-[#1A889F]' : 'border-primary'}`} />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
    <div className={`flex flex-col flex-1 ${isDarkMode ? 'bg-[#121212]' : 'bg-[#F8FAFD]'}`}>
      <div className={`flex flex-row justify-between items-center px-5 py-4 border-b ${isDarkMode ? 'bg-[#181818] border-[#4d4d4d]' : 'bg-white border-[#F0F0F5]'}`}>
        <button onClick={handleProfilePress} className="flex flex-row items-center gap-3">
          <div className={`w-11 h-11 rounded-[22px] flex items-center justify-center ${isDarkMode ? 'bg-[#1A889F]' : 'bg-primary'}`}>
            <span className="font-bold text-base text-white">
              {user?.first_name?.[0] || 'И'}
            </span>
          </div>
          <div>
            <p className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-[#1A1A1A]'}`}>{user?.first_name || 'Иван'}</p>
          </div>
        </button>
      </div>

        <div className="flex-1 overflow-y-auto">
        {/* Account Slider */}
        {sliderAccounts.length > 0 && (
          <div className="mt-5">
            <div className="flex flex-row justify-between items-center px-5 mb-2">
              <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-[#1A1A1A]'}`}>Мои счета</h2>
              {accounts.length < 3 && (
                <button
                  className="flex flex-row items-center gap-1"
                  onClick={handleCreateAccount}
                >
                  <IoAddCircleOutline size={20} color={isDarkMode ? '#1A889F' : '#1A889F'} />
                  <span className={`text-sm font-semibold ${isDarkMode ? 'text-[#1A889F]' : 'text-primary'}`}>Новый счёт</span>
                </button>
              )}
            </div>
            <AccountSlider
              accounts={sliderAccounts}
              selectedId={selectedAccountId}
              onSelect={setSelectedAccountId}
              showBalanceToggle={true}
              isBalanceHidden={isBalanceHidden}
              onToggleBalance={() => setIsBalanceHidden(!isBalanceHidden)}
            />
          </div>
        )}

        {/* Quick Actions */}
        <div className="mb-6 mt-5">
          <h2 className={`text-lg font-bold mb-4 px-5 ${isDarkMode ? 'text-white' : 'text-[#1A1A1A]'}`}>Быстрые действия</h2>
          <div className="flex flex-row px-5 gap-3">
            {quickActions.map((action, index) => (
              <button
                key={index}
                className="flex-1 flex flex-col items-center"
                onClick={() => router.push(action.nav)}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-2 shadow-lg"
                  style={{ backgroundColor: action.color }}
                >
                  {getIcon(action.icon)}
                </div>
                <span className={`text-xs font-semibold text-center ${isDarkMode ? 'text-white' : 'text-[#1A1A1A]'}`}>{action.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Our Partners Section */}
        <div className="mb-6">
          <div className="flex flex-row justify-between items-center px-5 mb-4">
            <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-[#1A1A1A]'}`}>Наши партнёры</h2>
            <button
              className="flex flex-row items-center gap-1"
              onClick={() => router.push('/partners/list')}
            >
              <span className={`text-sm font-semibold ${isDarkMode ? 'text-[#1A889F]' : 'text-primary'}`}>Все</span>
              <IoChevronForward size={16} color={isDarkMode ? '#1A889F' : '#1A889F'} />
            </button>
          </div>

          <div className="px-5 space-y-4">
            {partners.map((partner) => (
              <button
                key={partner.id}
                className={`p-5 rounded-[20px] shadow-lg w-full text-left ${isDarkMode ? 'bg-[#181818] border border-[#4d4d4d]' : 'bg-white border border-[#F0F0F5]'}`}
                onClick={() => handlePartnerPress(partner)}
              >
                <div className="flex flex-row items-center mb-3">
                  <PartnerLogo logo={partner.logo} partnerId={partner.id} />
                  <div className="flex-1 ml-3">
                    <p className={`text-lg font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-[#1A1A1A]'}`}>{partner.name}</p>
                    <p className={`text-sm font-semibold ${isDarkMode ? 'text-[#1A889F]' : 'text-primary'}`}>{partner.discount}</p>
                  </div>
                </div>
                <p className={`text-sm leading-5 mb-4 font-medium whitespace-pre-line ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>
                  {partner.description}
                </p>
                <div className="mb-4 space-y-2">
                  {partner.benefits.map((benefit, index) => (
                    <div key={index} className="flex flex-row items-center gap-2">
                      <IoCheckmarkCircle size={16} color={isDarkMode ? '#1A889F' : '#159E3A'} />
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-[#1A1A1A]'}`}>{benefit}</span>
                    </div>
                  ))}
                </div>
                <div
                  className="py-3 px-4 rounded-xl flex items-center justify-center shadow-lg w-full"
                  style={{ backgroundColor: partner.color }}
                >
                  <span className="text-base font-semibold text-white">Узнать больше</span>
                </div>
              </button>
            ))}
          </div>
        </div>
        <div className="h-[30px]" />
      </div>
    </div>
    </MainLayout>
  );
}
