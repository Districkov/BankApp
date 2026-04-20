import React from 'react';
import { useRouter } from 'next/router';
import MainLayout from '../../src/components/MainLayout';
import { IoArrowBack } from 'react-icons/io5';

export default function Notifications() {
  const router = useRouter();

  return (
    <MainLayout>
      <div className="flex-1 bg-[#F7F7FB] min-h-screen">
        <div className="bg-white px-4 py-4 border-b border-[#E5E5E5] flex justify-between items-center">
          <button onClick={() => router.back()}>
            <IoArrowBack size={24} color="#000" />
          </button>
          <h1 className="text-lg font-semibold text-[#000]">Уведомления</h1>
          <div className="w-8" />
        </div>

        <div className="p-4">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <p className="text-lg text-[#666] text-center">Настройки уведомлений</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
