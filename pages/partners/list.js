import React from 'react';
import { useRouter } from 'next/router';
import MainLayout from '../../src/components/MainLayout';
import { IoArrowBack, IoCheckmarkCircle, IoChevronForward } from 'react-icons/io5';
import { useTheme } from '../../src/context/ThemeContext';

export default function PartnersList() {
  const router = useRouter();
  const { isDarkMode } = useTheme();

  const partners = [
    {
      id: 1,
      name: 'Astra RP',
      discount: 'Эксклюзивные бонусы',
      description: 'GTA 5 RolePlay проект',
      logo: '/partners/astra-logo.svg',
      screen: '/partners/astra',
      color: '#FF0000',
      benefits: ['Игровая валюта', 'Премиум аккаунт', 'Эксклюзивный контент']
    },
    {
      id: 2,
      name: 'Yanima',
      discount: 'Подписка в подарок',
      description: 'Онлайн-просмотр аниме',
      logo: '/partners/yanima-logo.png',
      screen: '/partners/yanima',
      color: '#1A889F',
      benefits: ['Премиум подписка', 'Ранний доступ', 'Эксклюзивные релизы']
    },
  ];

  return (
    <MainLayout>
      <div className={`flex flex-col flex-1 ${isDarkMode ? 'bg-[#121212]' : 'bg-[#F8FAFD]'}`}>
        <div className={`px-5 py-4 border-b flex items-center gap-4 ${isDarkMode ? 'bg-[#181818] border-[#4d4d4d]' : 'bg-white border-[#F0F0F5]'}`}>
          <button onClick={() => router.back()}>
            <IoArrowBack size={24} color={isDarkMode ? '#fff' : '#000'} />
          </button>
          <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-[#1A1A1A]'}`}>Все партнёры</h1>
        </div>

        <div className="p-5">
          <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-[#1A1A1A]'}`}>Наши партнёры</h2>
          <p className={`text-base mb-6 leading-6 ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>
            Специальные предложения и эксклюзивные бонусы для наших клиентов
          </p>

          <div className="space-y-4 mb-5">
            {partners.map((partner) => (
              <button
                key={partner.id}
                className={`p-5 rounded-[20px] shadow-lg w-full text-left ${isDarkMode ? 'bg-[#181818] border border-[#4d4d4d]' : 'bg-white border border-[#F0F0F5]'}`}
                onClick={() => router.push(partner.screen)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div 
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow ${
                        partner.id === 2 ? (isDarkMode ? 'bg-[#1f1f1f] border border-[#4d4d4d]' : 'bg-white border border-[#E5E5E5]') : 'bg-black'
                      }`}
                    >
                      <img src={partner.logo} alt={partner.name} width={40} height={40} />
                    </div>
                    <div>
                      <p className={`text-lg font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-[#1A1A1A]'}`}>{partner.name}</p>
                      <p className={`text-sm ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>{partner.description}</p>
                      <p className="text-sm text-primary font-semibold mt-1">{partner.discount}</p>
                    </div>
                  </div>
                  <IoChevronForward size={20} color={isDarkMode ? '#b3b3b3' : '#666'} />
                </div>
              </button>
            ))}
          </div>

          <div className={`p-5 rounded-[20px] shadow-lg ${isDarkMode ? 'bg-[#181818] border border-[#4d4d4d]' : 'bg-white border border-[#F0F0F5]'}`}>
            <h3 className={`text-lg font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-[#1A1A1A]'}`}>Как получить бонусы?</h3>
            <div className={`space-y-2 text-sm leading-6 ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>
              <p>• Совершайте покупки с нашими картами</p>
              <p>• Накапливайте бонусные баллы</p>
              <p>• Активируйте специальные предложения</p>
              <p>• Получайте эксклюзивные привилегии</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
