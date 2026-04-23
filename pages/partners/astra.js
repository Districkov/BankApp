import React from 'react';
import { useRouter } from 'next/router';
import MainLayout from '../../src/components/MainLayout';
import { IoArrowBack, IoCheckmarkCircle, IoGlobeOutline, IoPaperPlaneOutline } from 'react-icons/io5';
import { useTheme } from '../../src/context/ThemeContext';

export default function AstraDetail() {
  const router = useRouter();
  const { isDarkMode } = useTheme();

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
      <div className={`flex flex-col flex-1 ${isDarkMode ? 'bg-[#121212]' : 'bg-[#F8FAFD]'}`}>
        <div className={`px-5 py-4 border-b flex items-center gap-4 ${isDarkMode ? 'bg-[#181818] border-[#4d4d4d]' : 'bg-white border-[#F0F0F5]'}`}>
          <button onClick={() => router.back()}>
            <IoArrowBack size={24} color={isDarkMode ? '#fff' : '#000'} />
          </button>
          <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-[#1A1A1A]'}`}>Партнёр</h1>
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
          <div className={`m-5 p-5 rounded-[20px] shadow-lg ${isDarkMode ? 'bg-[#181818] border border-[#4d4d4d]' : 'bg-white border border-[#F0F0F5]'}`}>
            <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-[#1A1A1A]'}`}>О проекте</h3>
            <p className={`text-base leading-6 ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>{partner.fullDescription}</p>
          </div>

          {/* Benefits */}
          <div className={`m-5 mt-0 p-5 rounded-[20px] shadow-lg ${isDarkMode ? 'bg-[#181818] border border-[#4d4d4d]' : 'bg-white border border-[#F0F0F5]'}`}>
            <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-[#1A1A1A]'}`}>Ваши преимущества</h3>
            <div className="space-y-3">
              {partner.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <IoCheckmarkCircle size={20} color={isDarkMode ? '#1A889F' : '#159E3A'} />
                  <span className={`text-base ${isDarkMode ? 'text-white' : 'text-[#1A1A1A]'}`}>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className={`m-5 mt-0 p-5 rounded-[20px] shadow-lg ${isDarkMode ? 'bg-[#181818] border border-[#4d4d4d]' : 'bg-white border border-[#F0F0F5]'}`}>
            <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-[#1A1A1A]'}`}>Особенности проекта</h3>
            <div className="flex flex-wrap gap-3">
              {partner.features.map((feature, index) => (
                <div key={index} className={`px-4 py-2 rounded-xl ${isDarkMode ? 'bg-[#1f1f1f]' : 'bg-[#F8FAFD]'}`}>
                  <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-[#1A1A1A]'}`}>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div className={`m-5 mt-0 p-5 rounded-[20px] shadow-lg ${isDarkMode ? 'bg-[#181818] border border-[#4d4d4d]' : 'bg-white border border-[#F0F0F5]'}`}>
            <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-[#1A1A1A]'}`}>Присоединяйтесь</h3>
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
          <div className={`m-5 mt-0 p-5 rounded-[20px] shadow-lg ${isDarkMode ? 'bg-[#181818] border border-[#4d4d4d]' : 'bg-white border border-[#F0F0F5]'}`}>
            <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-[#1A1A1A]'}`}>Как получить бонусы</h3>
            <div className="space-y-4">
              {partner.steps.map((step, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: partner.color }}>
                    {index + 1}
                  </div>
                  <div className="flex-1 mt-1">
                    <p className={`text-base ${isDarkMode ? 'text-white' : 'text-[#1A1A1A]'}`}>{step.title}</p>
                    <p className={`text-sm ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>{step.text}</p>
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
