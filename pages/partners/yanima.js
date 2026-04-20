import React from 'react';
import { useRouter } from 'next/router';
import MainLayout from '../../src/components/MainLayout';
import { IoArrowBack, IoCheckmarkCircle, IoGlobeOutline, IoPaperPlaneOutline, IoStarOutline } from 'react-icons/io5';

export default function YanimaDetail() {
  const router = useRouter();

  const partner = {
    name: 'Yanima',
    discount: 'Подписка в подарок',
    description: 'Онлайн-просмотр аниме с огромной библиотекой',
    logo: '/partners/yanima-logo.png',
    color: '#6A2EE8',
    benefits: [
      'Премиум подписка на 1 месяц',
      'Ранний доступ к новинкам',
      'Эксклюзивные релизы',
      'Высокое качество видео',
      'Оффлайн просмотр',
      'Без рекламы'
    ],
    fullDescription: 'Yanima - это современная платформа для просмотра аниме с огромной библиотекой контента. Мы предлагаем эксклюзивные релизы, высокое качество видео и удобный интерфейс для настоящих ценителей японской анимации. Присоединяйтесь к нашему сообществу и откройте для себя мир аниме по-новому!',
    website: 'https://yanima.space',
    telegram: 'https://t.me/yanimanews',
    discord: 'https://social.yanima.space/discord',
    features: [
      'Огромная библиотека аниме',
      'Эксклюзивный контент',
      'HD и 4K качество',
      'Многоголосый дубляж',
      'Удобный плеер',
      'Персональные рекомендации'
    ],
    conditions: [
      'Действует для новых пользователей',
      'Минимальная сумма покупки 500₽',
      'Подписка активируется в течение 24 часов',
      'Предложение действительно до конца месяца'
    ],
    steps: [
      { title: 'Совершите покупку', text: 'На сумму от 500₽ с использованием нашей карты' },
      { title: 'Зарегистрируйтесь', text: 'На Yanima.space и подтвердите email' },
      { title: 'Напишите в поддержку', text: 'Отправьте чек и логин от аккаунта' },
      { title: 'Активируйте подписку', text: 'Получите премиум доступ на 30 дней' }
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
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-lg border border-[#E5E5E5]">
              <img src={partner.logo} alt={partner.name} width={60} height={60} />
            </div>
            <h2 className="text-3xl font-extrabold text-white mb-2">{partner.name}</h2>
            <p className="text-lg text-white font-semibold">{partner.discount}</p>
          </div>

          {/* Description */}
          <div className="bg-white m-5 p-5 rounded-[20px] shadow-lg border border-[#F0F0F5]">
            <h3 className="text-xl font-bold text-[#1A1A1A] mb-4">О платформе</h3>
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
            <h3 className="text-xl font-bold text-[#1A1A1A] mb-4">Возможности платформы</h3>
            <div className="grid grid-cols-2 gap-3">
              {partner.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 bg-[#F8FAFD] p-3 rounded-xl">
                  <IoStarOutline size={16} color="#FF6B6B" />
                  <span className="text-sm text-[#1A1A1A] font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Conditions */}
          <div className="bg-white m-5 mt-0 p-5 rounded-[20px] shadow-lg border border-[#F0F0F5]">
            <h3 className="text-xl font-bold text-[#1A1A1A] mb-4">Условия предложения</h3>
            <div className="space-y-3">
              {partner.conditions.map((condition, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-xs" style={{ backgroundColor: partner.color }}>
                    {index + 1}
                  </div>
                  <span className="text-base text-[#1A1A1A] flex-1 leading-6">{condition}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-white m-5 mt-0 p-5 rounded-[20px] shadow-lg border border-[#F0F0F5]">
            <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">Присоединяйтесь</h3>
            <p className="text-base text-[#666] mb-4 leading-6">
              Станьте частью сообщества Yanima и откройте для себя мир аниме
            </p>
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
            <h3 className="text-xl font-bold text-[#1A1A1A] mb-4">Как получить подписку</h3>
            <div className="space-y-5">
              {partner.steps.map((step, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: partner.color }}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-base font-semibold text-[#1A1A1A] mb-1">{step.title}</p>
                    <p className="text-sm text-[#666] leading-5">{step.text}</p>
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
