import React from 'react';
import { useRouter } from 'next/router';
import MainLayout from '../../src/components/MainLayout';
import { IoArrowBack, IoCheckmarkCircle, IoGlobeOutline, IoPaperPlaneOutline, IoStarOutline } from 'react-icons/io5';
import { useTheme } from '../../src/context/ThemeContext';

export default function YanimaDetail() {
  const router = useRouter();
  const { isDarkMode } = useTheme();

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
      <div className={`flex-1 min-h-screen ${isDarkMode ? 'bg-[#121212]' : 'bg-[#F8FAFD]'}`}>
        <div className={`px-5 py-4 border-b flex items-center gap-4 ${isDarkMode ? 'bg-[#181818] border-[#4d4d4d]' : 'bg-white border-[#F0F0F5]'}`}>
          <button onClick={() => router.back()}>
            <IoArrowBack size={24} color={isDarkMode ? '#fff' : '#000'} />
          </button>
          <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-[#1A1A1A]'}`}>Партнёр</h1>
        </div>

        <div className="overflow-y-auto pb-5">
          {/* Hero Section */}
          <div className="p-8 flex flex-col items-center" style={{ backgroundColor: partner.color }}>
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-4 shadow-lg ${isDarkMode ? 'bg-[#1f1f1f] border border-[#4d4d4d]' : 'bg-white border border-[#E5E5E5]'}`}>
              <img src={partner.logo} alt={partner.name} width={60} height={60} />
            </div>
            <h2 className="text-3xl font-extrabold text-white mb-2">{partner.name}</h2>
            <p className="text-lg text-white font-semibold">{partner.discount}</p>
          </div>

          {/* Description */}
          <div className={`m-5 p-5 rounded-[20px] shadow-lg ${isDarkMode ? 'bg-[#181818] border border-[#4d4d4d]' : 'bg-white border border-[#F0F0F5]'}`}>
            <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-[#1A1A1A]'}`}>О платформе</h3>
            <p className={`text-base leading-6 ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>{partner.fullDescription}</p>
          </div>

          {/* Benefits */}
          <div className={`m-5 mt-0 p-5 rounded-[20px] shadow-lg ${isDarkMode ? 'bg-[#181818] border border-[#4d4d4d]' : 'bg-white border border-[#F0F0F5]'}`}>
            <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-[#1A1A1A]'}`}>Ваши преимущества</h3>
            <div className="space-y-3">
              {partner.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <IoCheckmarkCircle size={20} color="#6A2EE8" />
                  <span className={`text-base ${isDarkMode ? 'text-white' : 'text-[#1A1A1A]'}`}>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className={`m-5 mt-0 p-5 rounded-[20px] shadow-lg ${isDarkMode ? 'bg-[#181818] border border-[#4d4d4d]' : 'bg-white border border-[#F0F0F5]'}`}>
            <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-[#1A1A1A]'}`}>Особенности платформы</h3>
            <div className="flex flex-wrap gap-3">
              {partner.features.map((feature, index) => (
                <div key={index} className={`px-4 py-2 rounded-xl ${isDarkMode ? 'bg-[#1f1f1f]' : 'bg-[#F8FAFD]'}`}>
                  <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-[#1A1A1A]'}`}>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div className={`m-5 mt-0 p-5 rounded-[20px] shadow-lg ${isDarkMode ? 'bg-[#181818] border border-[#4d4d4d]' : 'bg-white border border-[#F0F0F5]'}`}>
            <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-[#1A1A1A]'}`}>Рейтинг пользователей</h3>
            <div className="flex items-center gap-2 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <IoStarOutline key={star} size={16} color="#6A2EE8" className="mt-1" />
              ))}
              <span className={`text-lg font-bold ml-2 ${isDarkMode ? 'text-white' : 'text-[#1A1A1A]'}`}>4.8</span>
              <span className={`text-sm ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>(2,547 отзывов)</span>
            </div>
            <p className={`text-sm ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>Более 95% пользователей рекомендуют Yanima</p>
          </div>

          {/* Conditions */}
          <div className={`m-5 mt-0 p-5 rounded-[20px] shadow-lg ${isDarkMode ? 'bg-[#181818] border border-[#4d4d4d]' : 'bg-white border border-[#F0F0F5]'}`}>
            <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-[#1A1A1A]'}`}>Условия акции</h3>
            <div className="space-y-2">
              {partner.conditions.map((condition, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className={`text-sm mt-0.5 ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>•</span>
                  <span className={`text-sm ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>{condition}</span>
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
            <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-[#1A1A1A]'}`}>Как получить подписку</h3>
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
