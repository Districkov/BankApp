import React from 'react';
import { useRouter } from 'next/router';
import MainLayout from '../../src/components/MainLayout';
import { IoArrowBack } from 'react-icons/io5';
import { useTheme } from '../../src/context/ThemeContext';

export default function Notifications() {
  const router = useRouter();
  const { isDarkMode } = useTheme();

  return (
    <MainLayout>
      <div className={`flex flex-col flex-1 ${isDarkMode ? 'bg-[#121212]' : 'bg-[#F7F7FB]'}`}>
        <div className={`px-4 py-4 border-b flex justify-between items-center ${isDarkMode ? 'bg-[#181818] border-[#4d4d4d]' : 'bg-white border-[#E5E5E5]'}`}>
          <button onClick={() => router.back()}>
            <IoArrowBack size={24} color={isDarkMode ? '#fff' : '#000'} />
          </button>
          <h1 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-[#000]'}`}>Уведомления</h1>
          <div className="w-8" />
        </div>

        <div className="p-4">
          <div className={`rounded-xl p-6 shadow-sm ${isDarkMode ? 'bg-[#181818] border border-[#4d4d4d]' : 'bg-white'}`}>
            <p className={`text-lg text-center ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>Настройки уведомлений</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
