import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { IoHomeOutline, IoPhonePortraitOutline, IoTrendingUp, IoEyeOutline, IoEyeOffOutline, IoChevronForward, IoCheckmarkCircle, IoNotificationsOutline } from 'react-icons/io5';
import { MdOutlineCreditCard } from 'react-icons/md';
import MainLayout from '../../src/components/MainLayout';

const AstraLogo = ({ width = 50, height = 50 }) => (
  <div className="bg-black rounded-xl flex items-center justify-center p-1" style={{ width, height }}>
    <span className="text-white font-bold" style={{ fontSize: width * 0.3 }}>Astra</span>
  </div>
);

const YanimaLogo = ({ width = 50, height = 50 }) => (
  <div className="bg-black rounded-xl flex items-center justify-center p-1" style={{ width, height }}>
    <span className="text-white font-bold" style={{ fontSize: width * 0.3 }}>Yanima</span>
  </div>
);

export default function Home() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [isBalanceHidden, setIsBalanceHidden] = useState(false);

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

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

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

  const PartnerLogo = ({ logo: LogoComponent, size = 60 }) => (
    <div className="rounded-2xl bg-black flex items-center justify-center p-1 shadow-lg" style={{ width: size, height: size }}>
      <LogoComponent width={size - 10} height={size - 10} />
    </div>
  );

  return (
    <MainLayout>
    <div className="flex-1 bg-[#F8FAFD] min-h-screen">
      {/* Header */}
      <div className="flex flex-row justify-between items-center px-5 py-4 bg-white border-b border-[#F0F0F5]">
        <button onClick={handleProfilePress} className="flex flex-row items-center gap-3">
          <div className="w-11 h-11 rounded-[22px] bg-primary flex items-center justify-center">
            <span className="text-white font-bold text-base">ИИ</span>
          </div>
          <div>
            <p className="text-xs text-[#666] font-medium">Добро пожаловать</p>
            <p className="text-base font-bold text-[#1A1A1A]">Иван</p>
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
            {isBalanceHidden ? '•••••••' : '682 132,82 ₽'}
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
            <span className="text-base font-bold text-[#666]">Расходы в октябре</span>
            <span className="text-xl font-extrabold text-danger">15 634 ₽</span>
          </div>
          
          <div className="mb-2">
            <div className="h-1.5 bg-[#F0F0F0] rounded-full mb-2 overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: '65%' }} />
            </div>
            <span className="text-xs text-[#666] font-medium">65% от лимита</span>
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
                  <PartnerLogo logo={partner.logo} />
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
                <button 
                  className="py-3 px-4 rounded-xl flex items-center justify-center shadow-lg w-full"
                  style={{ backgroundColor: partner.color }}
                  onClick={() => handlePartnerPress(partner)}
                >
                  <span className="text-base font-semibold text-white">Узнать больше</span>
                </button>
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
