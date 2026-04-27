import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import MainLayout from '../../src/components/MainLayout';
import { IoArrowBack } from 'react-icons/io5';
import { useTheme } from '../../src/context/ThemeContext';
import { userAPI } from '../../src/utils/api';

export default function PersonalData() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await userAPI.getProfile();
      setProfileData(data);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className={`flex-1 flex items-center justify-center ${isDarkMode ? 'bg-[#121212]' : 'bg-[#F7F7FB]'}`}>
          <div className={`animate-spin rounded-full h-12 w-12 border-4 border-t-transparent ${isDarkMode ? 'border-[#1A889F]' : 'border-primary'}`} />
        </div>
      </MainLayout>
    );
  }

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
              <p className={`w-full p-4 rounded-xl text-base ${isDarkMode ? 'bg-[#1f1f1f] text-white' : 'bg-[#F7F7FB] text-[#000]'}`}>
                {profileData?.first_name || '—'}
              </p>
            </div>
            <div className="mb-4">
              <label className={`text-sm mb-2 block ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>Фамилия</label>
              <p className={`w-full p-4 rounded-xl text-base ${isDarkMode ? 'bg-[#1f1f1f] text-white' : 'bg-[#F7F7FB] text-[#000]'}`}>
                {profileData?.last_name || '—'}
              </p>
            </div>
            <div className="mb-4">
              <label className={`text-sm mb-2 block ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>Телефон</label>
              <p className={`w-full p-4 rounded-xl text-base ${isDarkMode ? 'bg-[#1f1f1f] text-[#666]' : 'bg-[#F7F7FB] text-[#000]'}`}>
                {profileData?.phone_number || '—'}
              </p>
            </div>
            <div className="mb-4">
              <label className={`text-sm mb-2 block ${isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}`}>Email</label>
              <p className={`w-full p-4 rounded-xl text-base ${isDarkMode ? 'bg-[#1f1f1f] text-white' : 'bg-[#F7F7FB] text-[#000]'}`}>
                {profileData?.email || '—'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
