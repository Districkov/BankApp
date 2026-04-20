import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { IoHomeOutline, IoPhonePortraitOutline, IoTrendingUp, IoEyeOutline, IoEyeOffOutline, IoChevronForward, IoCheckmarkCircle, IoNotificationsOutline } from 'react-icons/io5';
import { MdOutlineCreditCard } from 'react-icons/md';
import MainLayout from '../../src/components/MainLayout';
import { accountsAPI, userAPI, transactionsAPI } from '../../src/utils/api';

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

export default function Home() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [isBalanceHidden, setIsBalanceHidden] = useState(false);
  const [user, setUser] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);
  const [expensePercentage, setExpensePercentage] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [userData, accountsData, transactionsData] = await Promise.all([
        userAPI.getProfile(),
        accountsAPI.getAccounts(),
        transactionsAPI.getTransactions({ 
          type: 'expense',
          from: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString(),
          to: new Date().toISOString()
        }).catch(() => null)
      ]);
      
      setUser(userData);
      setAccounts(accountsData || []);
      
      // Подсчитываем общий баланс
      if (accountsData && accountsData.length > 0) {
        const total = accountsData.reduce((sum, acc) => {
          const balance = parseFloat(acc.balance || 0);
          return sum + balance;
        }, 0);
        setTotalBalance(total);
      }

      // Подсчитываем расходы за текущий месяц
      if (transactionsData && transactionsData.length > 0) {
        const expenses = transactionsData.reduce((sum, tx) => {
          return sum + Math.abs(parseFloat(tx.amount || 0));
        }, 0);
        setMonthlyExpenses(expenses);
        
        // Рассчитываем процент от лимита (предположим лимит 50000)
        const limit = 50000;
        setExpensePercentage(Math.min((expenses / limit) * 100, 100));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const quickActions = [
    { title: 'Перевод по номеру', icon: 'phone', nav: '/transfers/phone', color: '#159E3A' },
    { title: 'Перевести', icon: 'transfer', nav: '/transfers/accounts', color: '#6A2EE8' },
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
      color: '#6A2EE8',
      benefits: ['Премиум подписка', 'Ранний доступ', 'Эксклюзивные релизы']
    },
  ];

  const toggleBalanceVisibility = () => {
    setIsBalanceHidden(!isBalanceHidden);
  };

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

  const PartnerLogo = ({ logo: LogoComponent, size = 60, partnerId }) => {
    // Для Yanima (id=2) используем белый фон, для остальных черный
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
        <div className="flex-1 bg-[#F8FAFD] min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
    <div className="flex-1 bg-[#F8FAFD] min-h-screen">
      {/* Header */}
      <div className="flex flex-row justify-between items-center px-5 py-4 bg-white border-b border-[#F0F0F5]">
        <button onClick={handleProfilePress} className="flex flex-row items-center gap-3">
          <div className="w-11 h-11 rounded-[22px] bg-primary flex items-center justify-center">
            <span className="text-white font-bold text-base">
              {user?.first_name?.[0] || 'И'}
            </span>
          </div>
          <div>
            <p className="text-base font-bold text-[#1A1A1A]">{user?.first_name || 'Иван'}</p>
          </div>
        </button>
        <button className="w-11 h-11 flex items-center justify-center relative">
          <IoNotificationsOutline size={24} color="#1A1A1A" />
          <div className="absolute top-2 right-2 bg-danger w-[18px] h-[18px] rounded-full flex items-center justify-center">
            <span className="text-[10px] text-white font-bold">3</span>
          </div>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Total Balance Card */}
        <div className="bg-white m-5 p-6 rounded-[20px] shadow-lg border border-[#F0F0F5]">
          <div className="flex flex-row justify-between items-center mb-3">
            <span className="text-base font-bold text-[#666]">Общий баланс</span>
            <button onClick={toggleBalanceVisibility}>
              {isBalanceHidden ? <IoEyeOffOutline size={20} color="#666" /> : <IoEyeOutline size={20} color="#666" />}
            </button>
          </div>
          <p className="text-[32px] font-extrabold text-[#1A1A1A] mb-3 tracking-wide">
            {isBalanceHidden ? '•••••••' : `${formatBalance(totalBalance)} ₽`}
          </p>
          <div className="flex flex-row items-center gap-1.5">
            <IoTrendingUp size={16} color="#159E3A" />
            <span className="text-sm text-success font-semibold">+5.2% за месяц</span>
          </div>
        </div>

        {/* Monthly Spending Card */}
        <button 
          className="bg-white mx-5 mt-0 p-6 rounded-[20px] shadow-lg border border-[#F0F0F5] w-[calc(100%-40px)]"
          onClick={() => router.push('/main/operations')}
        >
          <div className="flex flex-row justify-between items-center mb-4">
            <span className="text-base font-bold text-[#666]">Расходы в {new Date().toLocaleDateString('ru-RU', { month: 'long' })}</span>
            <span className="text-xl font-extrabold text-danger">{formatBalance(monthlyExpenses)} ₽</span>
          </div>
          
          <div className="mb-2">
            <div className="h-1.5 bg-[#F0F0F0] rounded-full mb-2 overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: `${expensePercentage}%` }} />
            </div>
            <span className="text-xs text-[#666] font-medium">{Math.round(expensePercentage)}% от лимита</span>
          </div>
        </button>

        {/* Quick Actions */}
        <div className="mb-6 mt-5">
          <h2 className="text-lg font-bold text-[#1A1A1A] mb-4 px-5">Быстрые действия</h2>
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
                <span className="text-xs font-semibold text-[#1A1A1A] text-center">{action.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Our Partners Section */}
        <div className="mb-6">
          <div className="flex flex-row justify-between items-center px-5 mb-4">
            <h2 className="text-lg font-bold text-[#1A1A1A]">Наши партнёры</h2>
            <button 
              className="flex flex-row items-center gap-1"
              onClick={() => router.push('/partners/list')}
            >
              <span className="text-sm text-primary font-semibold">Все</span>
              <IoChevronForward size={16} color="#6A2EE8" />
            </button>
          </div>
          
          <div className="px-5 space-y-4">
            {partners.map((partner) => (
              <button 
                key={partner.id}
                className="bg-white p-5 rounded-[20px] shadow-lg border border-[#F0F0F5] w-full text-left"
                onClick={() => handlePartnerPress(partner)}
              >
                <div className="flex flex-row items-center mb-3">
                  <PartnerLogo logo={partner.logo} partnerId={partner.id} />
                  <div className="flex-1 ml-3">
                    <p className="text-lg font-bold text-[#1A1A1A] mb-1">{partner.name}</p>
                    <p className="text-sm text-primary font-semibold">{partner.discount}</p>
                  </div>
                </div>
                <p className="text-sm text-[#666] leading-5 mb-4 font-medium whitespace-pre-line">
                  {partner.description}
                </p>
                <div className="mb-4 space-y-2">
                  {partner.benefits.map((benefit, index) => (
                    <div key={index} className="flex flex-row items-center gap-2">
                      <IoCheckmarkCircle size={16} color="#159E3A" />
                      <span className="text-sm text-[#1A1A1A] font-medium">{benefit}</span>
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
