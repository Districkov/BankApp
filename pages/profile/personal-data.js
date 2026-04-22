import React from 'react';
import { useRouter } from 'next/router';
import MainLayout from '../../src/components/MainLayout';
import { IoArrowBack } from 'react-icons/io5';
import { useTheme } from '../../src/context/ThemeContext';

export default function PersonalData() {
  const router = useRouter();
  const { isDarkMode } = useTheme();

  return (
    <MainLayout>
      <div className={`flex flex-col flex-1 ${isDarkMode ? 'bg-[#121212]' : 'bg-[#F7F7FB]'}`}>
        <div className={`px-4 py-4 border-b flex justify-between items-center ${isDarkMode ? 'bg-[#181818] border-[#4d4d4d]' : 'bg-white border-[#E5E5E5]'}`}>
          <button onClick={() => router.back()}>
            <IoArrowBack size={24} color={isDarkMode ? '#fff' : '#000'} />
          </button>
          <h1 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-[#000]'}`}>Личные данные</h1>
          <div className="w-8" />
        </div>

        <div className="p-4">
          <div className={`rounded-xl p-6 shadow-sm ${isDarkMode ? 'bg-[#181818] border border-[#4d4d4d]' : 'bg-white'}`}>
            <div className="mb-4">
              <label className={`text-sm mb-2 block ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>Имя</label>
              <input
                type="text"
                className={`w-full p-4 rounded-xl text-base border ${isDarkMode ? 'bg-[#1f1f1f] border-[#4d4d4d] text-white' : 'bg-[#F7F7FB] border-[#E5E5E5] text-[#000]'}`}
                defaultValue="Иван"
              />
            </div>
            <div className="mb-4">
              <label className={`text-sm mb-2 block ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>Фамилия</label>
              <input
                type="text"
                className={`w-full p-4 rounded-xl text-base border ${isDarkMode ? 'bg-[#1f1f1f] border-[#4d4d4d] text-white' : 'bg-[#F7F7FB] border-[#E5E5E5] text-[#000]'}`}
                defaultValue="Соломин"
              />
            </div>
            <div className="mb-4">
              <label className={`text-sm mb-2 block ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>Телефон</label>
              <input
                type="tel"
                className={`w-full p-4 rounded-xl text-base border ${isDarkMode ? 'bg-[#1f1f1f] border-[#4d4d4d] text-[#666]' : 'bg-[#F7F7FB] border-[#E5E5E5] text-[#000]'}`}
                defaultValue="+7 926 718-55-52"
                disabled
              />
            </div>
            <div className="mb-4">
              <label className={`text-sm mb-2 block ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>Email</label>
              <input
                type="email"
                className={`w-full p-4 rounded-xl text-base border ${isDarkMode ? 'bg-[#1f1f1f] border-[#4d4d4d] text-white' : 'bg-[#F7F7FB] border-[#E5E5E5] text-[#000]'}`}
                defaultValue="ert34vh@gmail.com"
              />
            </div>
            <button className="w-full bg-primary text-white py-4 rounded-xl font-semibold text-base mt-2">
              Сохранить изменения
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
