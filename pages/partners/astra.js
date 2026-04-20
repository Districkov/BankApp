import React from 'react';
import { useRouter } from 'next/router';
import MainLayout from '../../src/components/MainLayout';
import { IoArrowBack, IoCheckmarkCircle, IoGlobeOutline, IoPaperPlaneOutline } from 'react-icons/io5';

export default function AstraDetail() {
  const router = useRouter();

  const partner = {
    name: 'Astra RP',
    discount: 'Эксклюзивные бонусы',
    description: 'GTA 5 RolePlay проект с передовой экономической системой',
    logo: '/partners/astra-logo.svg',
    color: '#FF0000',
    benefits: [
      'Игровая валюта за покупки',
      'Премиум аккаунт на 30 дней',
      'Эксклюзивный транспорт',
      'Уникальные бизнесы',
      'Персональная поддержка'
    ],
    fullDescription: 'Astra RP - это инновационный RolePlay проект в GTA 5, где каждый игрок может построить свою уникальную историю. Мы предлагаем глубокую экономическую систему, реалистичные механики и активное сообщество.',
    website: 'https://astra-rp.fun/main.html',
    telegram: 'https://t.me/astrarp5',
    discord: 'https://dsc.gg/astrarpgta5',
    features: [
      'Реалистичная экономика',
      'Уникальные профессии',
      'Кастомный контент',
      'Активное сообщество',
      'Регулярные обновления'
    ],
    steps: [
      { title: 'Совершите покупку', text: 'На сумму от 1000₽' },
      { title: 'Напишите в поддержку', text: 'Astra RP' },
      { title: 'Предоставьте чек', text: 'И никнейм в игре' },
      { title: 'Получите бонусы', text: 'В течение 24 часов' }
    ]
  };

  return (
    <MainLayout>
      <div className="flex-1 bg-[#F8FAFD] min-h-screen">
        <div className="bg-white px-5 py-4 border-b border-[#F0F0F5] flex items-center gap-4">
          <button onClick={() => router.back()}>
            <IoArrowBack size={24} color="#000" />
          </button>
          <h1 className="text-xl font-bold text-[#1A1A1A]">Партнёр</h1>
        </div>

        <div className="overflow-y-auto pb-5">
          {/* Hero Section */}
          <div className="p-8 flex flex-col items-center" style={{ backgroundColor: partner.color }}>
            <div className="w-20 h-20 bg-black rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <img src={partner.logo} alt={partner.name} width={60} height={60} />
            </div>
            <h2 className="text-3xl font-extrabold text-white mb-2">{partner.name}</h2>
            <p className="text-lg text-white font-semibold">{partner.discount}</p>
          </div>

          {/* Description */}
          <div className="bg-white m-5 p-5 rounded-[20px] shadow-lg border border-[#F0F0F5]">
            <h3 className="text-xl font-bold text-[#1A1A1A] mb-4">О проекте</h3>
            <p className="text-base text-[#666] leading-6">{partner.fullDescription}</p>
          </div>

          {/* Benefits */}
          <div className="bg-white m-5 mt-0 p-5 rounded-[20px] shadow-lg border border-[#F0F0F5]">
            <h3 className="text-xl font-bold text-[#1A1A1A] mb-4">Ваши преимущества</h3>
            <div className="space-y-3">
              {partner.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <IoCheckmarkCircle size={20} color="#159E3A" />
                  <span className="text-base text-[#1A1A1A]">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="bg-white m-5 mt-0 p-5 rounded-[20px] shadow-lg border border-[#F0F0F5]">
            <h3 className="text-xl font-bold text-[#1A1A1A] mb-4">Особенности проекта</h3>
            <div className="flex flex-wrap gap-3">
              {partner.features.map((feature, index) => (
                <div key={index} className="bg-[#F8FAFD] px-4 py-2 rounded-xl">
                  <span className="text-sm text-[#1A1A1A] font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-white m-5 mt-0 p-5 rounded-[20px] shadow-lg border border-[#F0F0F5]">
            <h3 className="text-xl font-bold text-[#1A1A1A] mb-4">Присоединяйтесь</h3>
            <div className="flex gap-3">
              <a href={partner.website} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white font-semibold" style={{ backgroundColor: partner.color }}>
                <IoGlobeOutline size={20} />
                <span>Сайт</span>
              </a>
              <a href={partner.telegram} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 bg-[#0088cc] py-3 px-4 rounded-xl text-white font-semibold">
                <IoPaperPlaneOutline size={20} />
                <span>Telegram</span>
              </a>
            </div>
          </div>

          {/* How to Get */}
          <div className="bg-white m-5 mt-0 p-5 rounded-[20px] shadow-lg border border-[#F0F0F5]">
            <h3 className="text-xl font-bold text-[#1A1A1A] mb-4">Как получить бонусы</h3>
            <div className="space-y-4">
              {partner.steps.map((step, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: partner.color }}>
                    {index + 1}
                  </div>
                  <div className="flex-1 mt-1">
                    <p className="text-base text-[#1A1A1A]">{step.title}</p>
                    <p className="text-sm text-[#666]">{step.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
