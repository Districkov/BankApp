import React, { useState } from 'react';
import { useRouter } from 'next/router';
import MainLayout from '../../src/components/MainLayout';
import { IoArrowBack, IoSearch, IoWarningOutline, IoCardOutline, IoSwapHorizontalOutline, IoLockClosedOutline, IoPhonePortraitOutline, IoCallOutline, IoChatbubbleOutline, IoMailOutline, IoLocationOutline } from 'react-icons/io5';

export default function Support() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const faqCategories = [
    { icon: IoCardOutline, title: 'Карты и счета', count: '12 вопросов', color: '#1A889F' },
    { icon: IoSwapHorizontalOutline, title: 'Переводы и платежи', count: '8 вопросов', color: '#FF6B6B' },
    { icon: IoLockClosedOutline, title: 'Безопасность', count: '6 вопросов', color: '#4ECDC4' },
    { icon: IoPhonePortraitOutline, title: 'Приложение', count: '5 вопросов', color: '#45B7D1' }
  ];

  const popularQuestions = [
    { question: 'Как заблокировать карту?', answer: 'Карту можно заблокировать в разделе "Безопасность" или позвонив в поддержку.' },
    { question: 'Какие лимиты на переводы?', answer: 'Лимиты зависят от типа карты и могут быть изменены в настройках безопасности.' },
    { question: 'Не приходит SMS с кодом', answer: 'Проверьте баланс телефона и настройки блокировки SMS от банка.' }
  ];

  const contactMethods = [
    { icon: IoCallOutline, title: 'Телефон поддержки', subtitle: '8 800 555-35-35', color: '#159E3A', action: () => window.open('tel:88005553535') },
    { icon: IoChatbubbleOutline, title: 'Онлайн-чат', subtitle: 'Круглосуточно', color: '#1A889F', action: () => console.log('Open chat') },
    { icon: IoMailOutline, title: 'Электронная почта', subtitle: 'support@bank.ru', color: '#FFA726', action: () => window.open('mailto:support@bank.ru') },
    { icon: IoLocationOutline, title: 'Отделения банка', subtitle: 'Найти ближайшее', color: '#FF3B30', action: () => console.log('Open map') }
  ];

  return (
    <MainLayout>
      <div className="flex flex-col flex-1 bg-[#F7F7FB]">
        <div className="bg-white px-4 py-4 border-b border-[#E5E5E5] flex justify-between items-center">
          <button onClick={() => router.back()}>
            <IoArrowBack size={24} color="#000" />
          </button>
          <h1 className="text-lg font-semibold text-[#000]">Помощь и поддержка</h1>
          <div className="w-8" />
        </div>

        <div className="flex-1 overflow-y-auto pb-5">
          {/* Search */}
          <div className="p-4">
            <div className="flex items-center bg-white px-4 rounded-xl border border-[#E5E5E5]">
              <IoSearch size={20} color="#666" className="mr-2" />
              <input
                type="text"
                className="flex-1 py-3.5 text-base text-[#000] bg-transparent"
                placeholder="Поиск по вопросам..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Quick Help */}
          <div className="px-4 mb-6">
            <h2 className="text-base font-semibold text-[#666] mb-3">Нужна срочная помощь?</h2>
            <button className="flex items-center bg-[#FFE8E8] p-4 rounded-xl border-l-4 border-danger w-full">
              <div className="mr-3">
                <IoWarningOutline size={24} color="#FF3B30" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-base font-semibold text-[#000] mb-1">Экстренная блокировка</p>
                <p className="text-sm text-[#666]">Заблокируйте карту, если она утеряна</p>
              </div>
              <span className="text-[#999]">›</span>
            </button>
          </div>

          {/* FAQ Categories */}
          <div className="mb-6">
            <h2 className="text-base font-semibold text-[#666] mb-3 px-4">Частые вопросы</h2>
            <div className="flex flex-wrap gap-3 px-4">
              {faqCategories.map((category, index) => (
                <button
                  key={index}
                  className="w-[calc(50%-6px)] bg-white p-4 rounded-xl shadow-sm text-center"
                  onClick={() => console.log('Open category', category.title)}
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2"
                    style={{ backgroundColor: category.color }}
                  >
                    <category.icon size={20} color="#fff" />
                  </div>
                  <p className="text-sm font-semibold text-[#000] mb-1">{category.title}</p>
                  <p className="text-xs text-[#666]">{category.count}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Popular Questions */}
          <div className="mb-6">
            <h2 className="text-base font-semibold text-[#666] mb-3 px-4">Популярные вопросы</h2>
            <div className="px-4 space-y-2">
              {popularQuestions.map((item, index) => (
                <button
                  key={index}
                  className="flex items-center bg-white p-4 rounded-xl shadow-sm w-full"
                  onClick={() => console.log('Open question', item.question)}
                >
                  <div className="flex-1 text-left">
                    <p className="text-base font-medium text-[#000] mb-1">{item.question}</p>
                    <p className="text-sm text-[#666] leading-tight">{item.answer}</p>
                  </div>
                  <span className="text-[#999] ml-2">›</span>
                </button>
              ))}
            </div>
          </div>

          {/* Contact Methods */}
          <div className="mb-6">
            <h2 className="text-base font-semibold text-[#666] mb-3 px-4">Свяжитесь с нами</h2>
            <div className="flex flex-wrap gap-3 px-4">
              {contactMethods.map((method, index) => (
                <button
                  key={index}
                  className="w-[calc(50%-6px)] bg-white p-4 rounded-xl shadow-sm text-center"
                  onClick={method.action}
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2"
                    style={{ backgroundColor: method.color }}
                  >
                    <method.icon size={20} color="#fff" />
                  </div>
                  <p className="text-sm font-semibold text-[#000] mb-1">{method.title}</p>
                  <p className="text-xs text-[#666]">{method.subtitle}</p>
                </button>
              ))}
            </div>
          </div>

          {/* App Info */}
          <div className="px-4 mb-6">
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <IoPhonePortraitOutline size={24} color="#1A889F" />
                <h3 className="text-base font-semibold text-[#000]">О приложении</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center py-2 border-b border-[#F0F0F0]">
                  <span className="text-sm text-[#666]">Версия</span>
                  <span className="text-sm font-medium text-[#000]">1.0.0 (12345)</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-[#F0F0F0]">
                  <span className="text-sm text-[#666]">Обновлено</span>
                  <span className="text-sm font-medium text-[#000]">15 сентября 2024</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-[#F0F0F0]">
                  <span className="text-sm text-[#666]">Разработчик</span>
                  <span className="text-sm font-medium text-[#000]">Verdical Bank</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
