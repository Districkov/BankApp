import React from 'react';
import { useRouter } from 'next/router';
import MainLayout from '../../src/components/MainLayout';
import { IoArrowBack, IoCheckmarkCircle, IoChevronForward } from 'react-icons/io5';

export default function PartnersList() {
  const router = useRouter();

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
      color: '#6A2EE8',
      benefits: ['Премиум подписка', 'Ранний доступ', 'Эксклюзивные релизы']
    },
  ];

  return (
    <MainLayout>
      <div className="flex-1 bg-[#F8FAFD] min-h-screen">
        <div className="bg-white px-5 py-4 border-b border-[#F0F0F5] flex items-center gap-4">
          <button onClick={() => router.back()}>
            <IoArrowBack size={24} color="#000" />
          </button>
          <h1 className="text-xl font-bold text-[#1A1A1A]">Все партнёры</h1>
        </div>

        <div className="p-5">
          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-2">Наши партнёры</h2>
          <p className="text-base text-[#666] mb-6 leading-6">
            Специальные предложения и эксклюзивные бонусы для наших клиентов
          </p>

          <div className="space-y-4 mb-5">
            {partners.map((partner) => (
              <button
                key={partner.id}
                className="bg-white p-5 rounded-[20px] shadow-lg border border-[#F0F0F5] w-full text-left"
                onClick={() => router.push(partner.screen)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div 
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow ${
                        partner.id === 2 ? 'bg-white border border-[#E5E5E5]' : 'bg-black'
                      }`}
                    >
                      <img src={partner.logo} alt={partner.name} width={40} height={40} />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-[#1A1A1A] mb-1">{partner.name}</p>
                      <p className="text-sm text-[#666]">{partner.description}</p>
                      <p className="text-sm text-primary font-semibold mt-1">{partner.discount}</p>
                    </div>
                  </div>
                  <IoChevronForward size={20} color="#666" />
                </div>
              </button>
            ))}
          </div>

          <div className="bg-white p-5 rounded-[20px] shadow-lg border border-[#F0F0F5]">
            <h3 className="text-lg font-bold text-[#1A1A1A] mb-3">Как получить бонусы?</h3>
            <div className="space-y-2 text-sm text-[#666] leading-6">
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
