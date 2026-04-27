import React from 'react';
import { useRouter } from 'next/router';
import MainLayout from '../../src/components/MainLayout';
import { IoArrowBack, IoLanguageOutline, IoMoonOutline, IoLockClosedOutline } from 'react-icons/io5';
import { useTheme } from '../../src/context/ThemeContext';

export default function Settings() {
  const router = useRouter();
  const { isDarkMode, toggleTheme } = useTheme();

  const settingsSections = [
    {
      title: 'Безопасность',
      items: [
        {
          icon: IoLockClosedOutline,
          title: 'Смена пароля',
          description: 'Изменить пароль от аккаунта',
          screen: '/profile/change-password'
        }
      ]
    },
    {
      title: 'Основные',
      items: [
        {
          icon: IoLanguageOutline,
          title: 'Язык',
          description: 'Русский',
          isStatic: true
        }
      ]
    }
  ];

  return (
    <MainLayout>
      <div className={`flex flex-col flex-1 ${isDarkMode ? 'bg-[#121212]' : 'bg-[#F7F7FB]'}`}>
        <div className={`px-4 py-4 border-b flex justify-between items-center ${isDarkMode ? 'bg-[#181818] border-[#4d4d4d]' : 'bg-white border-[#E5E5E5]'}`}>
          <button onClick={() => router.back()}>
            <IoArrowBack size={24} color={isDarkMode ? '#fff' : '#000'} />
          </button>
          <h1 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-[#000]'}`}>Настройки</h1>
          <div className="w-8" />
        </div>

        <div className="flex-1 overflow-y-auto pb-5">
          {/* Quick Settings */}
          <div className={`m-4 rounded-2xl p-4 shadow-sm ${isDarkMode ? 'bg-[#181818] border border-[#4d4d4d]' : 'bg-white'}`}>
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <IoMoonOutline size={22} color="#1A889F" />
                <span className={`text-base font-medium ${isDarkMode ? 'text-white' : 'text-[#000]'}`}>Темная тема</span>
              </div>
              <button
                className={`w-12 h-6 rounded-full transition-colors ${
                  isDarkMode ? 'bg-primary' : 'bg-[#E5E5E5]'
                }`}
                onClick={toggleTheme}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    isDarkMode ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Settings Sections */}
          {settingsSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-6">
              <h2 className={`text-base font-semibold mb-3 px-4 ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>{section.title}</h2>
              <div className={`mx-4 rounded-xl overflow-hidden shadow-sm ${isDarkMode ? 'bg-[#181818] border border-[#4d4d4d]' : 'bg-white'}`}>
                {section.items.map((item, itemIndex) => (
                  item.isStatic ? (
                    <div
                      key={itemIndex}
                      className={`flex items-center justify-between p-4 border-b last:border-b-0 ${isDarkMode ? 'border-[#4d4d4d]' : 'border-[#F0F0F0]'}`}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-[#2d2d2d]' : 'bg-[#E0F4F8]'}`}>
                          <item.icon size={20} color="#1A889F" />
                        </div>
                        <div className="flex-1">
                          <p className={`text-base font-medium mb-0.5 ${isDarkMode ? 'text-white' : 'text-[#000]'}`}>{item.title}</p>
                          <p className={`text-xs ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>{item.description}</p>
                        </div>
                      </div>
                      <div className={`px-3 py-1.5 rounded-lg ${isDarkMode ? 'bg-[#2d2d2d]' : 'bg-[#F0F0F0]'}`}>
                        <span className={`text-sm font-medium ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>{item.description}</span>
                      </div>
                    </div>
                  ) : (
                    <button
                      key={itemIndex}
                      className={`flex items-center justify-between p-4 border-b last:border-b-0 w-full ${isDarkMode ? 'border-[#4d4d4d]' : 'border-[#F0F0F0]'}`}
                      onClick={() => router.push(item.screen)}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-[#2d2d2d]' : 'bg-[#E0F4F8]'}`}>
                          <item.icon size={20} color="#1A889F" />
                        </div>
                        <div className="flex-1 text-left">
                          <p className={`text-base font-medium mb-0.5 ${isDarkMode ? 'text-white' : 'text-[#000]'}`}>{item.title}</p>
                          <p className={`text-xs ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>{item.description}</p>
                        </div>
                      </div>
                      <span className={isDarkMode ? 'text-[#b3b3b3]' : 'text-[#999]'}>›</span>
                    </button>
                  )
                ))}
              </div>
            </div>
          ))}

          {/* App Info */}
          <div className="text-center p-5">
            <p className={`text-sm mb-1 ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>Версия 1.0.0</p>
            <p className={`text-xs ${isDarkMode ? 'text-[#666]' : 'text-[#999]'}`}>Сборка 12345</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
