import React, { useState } from 'react';
import { useRouter } from 'next/router';
import MainLayout from '../../src/components/MainLayout';
import { IoArrowBack, IoSearch, IoCardOutline, IoSwapHorizontalOutline, IoLockClosedOutline, IoPhonePortraitOutline, IoCallOutline, IoChatbubbleOutline, IoMailOutline, IoLocationOutline, IoGlobeOutline } from 'react-icons/io5';
import { useTheme } from '../../src/context/ThemeContext';

export default function Support() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const faqCategories = [
    { icon: IoCardOutline, title: 'Счета и валюта', count: '8 вопросов', color: '#1A889F' },
    { icon: IoSwapHorizontalOutline, title: 'Переводы', count: '6 вопросов', color: '#FF6B6B' },
    { icon: IoLockClosedOutline, title: 'Безопасность', count: '5 вопросов', color: '#4ECDC4' },
    { icon: IoPhonePortraitOutline, title: 'Приложение', count: '4 вопроса', color: '#45B7D1' }
  ];

  const popularQuestions = [
    { question: 'Как создать счёт в валюте?', answer: 'На главной странице нажмите «Создать счёт» и выберите валюту: RUB, USD или EUR.' },
    { question: 'Какие лимиты на переводы?', answer: 'Лимиты зависят от вашего KYC-статуса и могут быть изменены оператором.' },
    { question: 'Как перевести между своими счетами?', answer: 'Перейдите в «Перевести» → «Между счетами», выберите счёт списания и зачисления.' },
    { question: 'Не проходит перевод по телефону', answer: 'Убедитесь, что получатель зарегистрирован в системе. Проверьте, что номер введён корректно.' }
  ];

  const contactMethods = [
    { icon: IoCallOutline, title: 'Телефон поддержки', subtitle: '8 800 555-35-35', color: '#159E3A', action: () => window.open('tel:88005553535') },
    { icon: IoChatbubbleOutline, title: 'Онлайн-чат', subtitle: 'Круглосуточно', color: '#1A889F', action: () => console.log('Open chat') },
    { icon: IoMailOutline, title: 'Электронная почта', subtitle: 'support@bank.korzik.space', color: '#FFA726', action: () => window.open('mailto:support@bank.korzik.space') },
    { icon: IoGlobeOutline, title: 'Сайт', subtitle: 'bank.korzik.space', color: '#AB47BC', action: () => window.open('https://bank.korzik.space', '_blank') }
  ];

  const filteredQuestions = popularQuestions.filter(q =>
    q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MainLayout>
      <div className={`flex flex-col flex-1 ${isDarkMode ? 'bg-[#121212]' : 'bg-[#F8FAFD]'}`}>
        {/* Header */}
        <div className={`flex items-center px-5 py-4 border-b ${isDarkMode ? 'bg-[#181818] border-[#4d4d4d]' : 'bg-white border-[#F0F0F5]'}`}>
          <button onClick={() => router.back()} className="mr-3">
            <IoArrowBack size={24} color={isDarkMode ? '#ffffff' : '#1A1A1A'} />
          </button>
          <h1 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-[#000]'}`}>Поддержка</h1>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Поиск */}
          <div className="px-5 mt-4 mb-4">
            <div className={`flex items-center rounded-xl px-4 py-3 ${isDarkMode ? 'bg-[#181818] border border-[#4d4d4d]' : 'bg-white border border-[#F0F0F5]'}`}>
              <IoSearch size={18} color={isDarkMode ? '#b3b3b3' : '#999'} className="mr-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Найти ответ"
                className={`flex-1 bg-transparent focus:outline-none text-base ${isDarkMode ? 'text-white placeholder-[#666]' : 'text-[#000] placeholder-[#999]'}`}
              />
            </div>
          </div>

          {/* Категории */}
          <div className="px-5 mb-5">
            <h2 className={`text-base font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-[#000]'}`}>Категории</h2>
            <div className="grid grid-cols-2 gap-3">
              {faqCategories.map((cat, idx) => (
                <div
                  key={idx}
                  className={`rounded-xl p-4 ${isDarkMode ? 'bg-[#181818] border border-[#4d4d4d]' : 'bg-white border border-[#F0F0F5] shadow-sm'}`}
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center mb-2" style={{ backgroundColor: cat.color + '20' }}>
                    <cat.icon size={20} color={cat.color} />
                  </div>
                  <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-[#000]'}`}>{cat.title}</p>
                  <p className={`text-xs ${isDarkMode ? 'text-[#666]' : 'text-[#999]'}`}>{cat.count}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Популярные вопросы */}
          <div className="px-5 mb-5">
            <h2 className={`text-base font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-[#000]'}`}>Популярные вопросы</h2>
            <div className="space-y-2">
              {filteredQuestions.map((q, idx) => (
                <FAQItem key={idx} question={q.question} answer={q.answer} isDarkMode={isDarkMode} />
              ))}
            </div>
          </div>

          {/* Контакты */}
          <div className="px-5 mb-8">
            <h2 className={`text-base font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-[#000]'}`}>Связаться с нами</h2>
            <div className="space-y-2">
              {contactMethods.map((method, idx) => (
                <button
                  key={idx}
                  onClick={method.action}
                  className={`w-full flex items-center p-4 rounded-xl ${isDarkMode ? 'bg-[#181818] border border-[#4d4d4d]' : 'bg-white border border-[#F0F0F5] shadow-sm'}`}
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: method.color + '20' }}>
                    <method.icon size={20} color={method.color} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-[#000]'}`}>{method.title}</p>
                    <p className={`text-xs ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>{method.subtitle}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

function FAQItem({ question, answer, isDarkMode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`rounded-xl overflow-hidden ${isDarkMode ? 'bg-[#181818] border border-[#4d4d4d]' : 'bg-white border border-[#F0F0F5] shadow-sm'}`}>
      <button
        className="w-full flex items-center justify-between p-4 text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={`text-sm font-medium pr-3 ${isDarkMode ? 'text-white' : 'text-[#000]'}`}>{question}</span>
        <IoArrowBack
          size={16}
          color={isDarkMode ? '#b3b3b3' : '#999'}
          className={`transform transition-transform ${isOpen ? 'rotate-[-90deg]' : 'rotate-[-90deg]'}`}
          style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}
        />
      </button>
      {isOpen && (
        <div className={`px-4 pb-4 ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>
          <p className="text-sm">{answer}</p>
        </div>
      )}
    </div>
  );
}
