import React, { useState } from 'react';
import { useRouter } from 'next/router';
import MainLayout from '../../src/components/MainLayout';
import { IoArrowBack, IoPersonOutline, IoNotificationsOutline, IoLanguageOutline } from 'react-icons/io5';

export default function Settings() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(true);

  const settingsSections = [
    {
      title: 'Основные',
      items: [
        {
          icon: IoPersonOutline,
          title: 'Личные данные',
          description: 'Имя, email, телефон',
          screen: '/profile/personal-data'
        },
        {
          icon: IoNotificationsOutline,
          title: 'Уведомления',
          description: 'Настройка оповещений',
          screen: '/profile/notifications'
        },
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
      <div className="flex-1 bg-[#F7F7FB] min-h-screen">
        <div className="bg-white px-4 py-4 border-b border-[#E5E5E5] flex justify-between items-center">
          <button onClick={() => router.back()}>
            <IoArrowBack size={24} color="#000" />
          </button>
          <h1 className="text-lg font-semibold text-[#000]">Настройки</h1>
          <div className="w-8" />
        </div>

        <div className="flex-1 overflow-y-auto pb-5">
          {/* Quick Settings */}
          <div className="bg-white m-4 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <IoNotificationsOutline size={22} color="#6A2EE8" />
                <span className="text-base font-medium text-[#000]">Уведомления</span>
              </div>
              <button
                className={`w-12 h-6 rounded-full transition-colors ${
                  notifications ? 'bg-primary' : 'bg-[#E5E5E5]'
                }`}
                onClick={() => setNotifications(!notifications)}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    notifications ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Settings Sections */}
          {settingsSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-6">
              <h2 className="text-base font-semibold text-[#666] mb-3 px-4">{section.title}</h2>
              <div className="bg-white mx-4 rounded-xl overflow-hidden shadow-sm">
                {section.items.map((item, itemIndex) => (
                  item.isStatic ? (
                    <div
                      key={itemIndex}
                      className="flex items-center justify-between p-4 border-b border-[#F0F0F0] last:border-b-0"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-9 h-9 rounded-full bg-[#F0EBFF] flex items-center justify-center">
                          <item.icon size={20} color="#6A2EE8" />
                        </div>
                        <div className="flex-1">
                          <p className="text-base font-medium text-[#000] mb-0.5">{item.title}</p>
                          <p className="text-xs text-[#666]">{item.description}</p>
                        </div>
                      </div>
                      <div className="px-3 py-1.5 bg-[#F0F0F0] rounded-lg">
                        <span className="text-sm text-[#666] font-medium">{item.description}</span>
                      </div>
                    </div>
                  ) : (
                    <button
                      key={itemIndex}
                      className="flex items-center justify-between p-4 border-b border-[#F0F0F0] last:border-b-0 w-full"
                      onClick={() => router.push(item.screen)}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-9 h-9 rounded-full bg-[#F0EBFF] flex items-center justify-center">
                          <item.icon size={20} color="#6A2EE8" />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-base font-medium text-[#000] mb-0.5">{item.title}</p>
                          <p className="text-xs text-[#666]">{item.description}</p>
                        </div>
                      </div>
                      <span className="text-[#999]">›</span>
                    </button>
                  )
                ))}
              </div>
            </div>
          ))}

          {/* App Info */}
          <div className="text-center p-5">
            <p className="text-sm text-[#666] mb-1">Версия 1.0.0</p>
            <p className="text-xs text-[#999]">Сборка 12345</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
