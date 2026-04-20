import React from 'react';
import { useRouter } from 'next/router';
import MainLayout from '../../src/components/MainLayout';
import { IoArrowBack } from 'react-icons/io5';

export default function PersonalData() {
  const router = useRouter();

  return (
    <MainLayout>
      <div className="flex-1 bg-[#F7F7FB] min-h-screen">
        <div className="bg-white px-4 py-4 border-b border-[#E5E5E5] flex justify-between items-center">
          <button onClick={() => router.back()}>
            <IoArrowBack size={24} color="#000" />
          </button>
          <h1 className="text-lg font-semibold text-[#000]">Личные данные</h1>
          <div className="w-8" />
        </div>

        <div className="p-4">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="mb-4">
              <label className="text-sm text-[#666] mb-2 block">Имя</label>
              <input
                type="text"
                className="w-full bg-[#F7F7FB] p-4 rounded-xl text-base border border-[#E5E5E5]"
                defaultValue="Иван"
              />
            </div>
            <div className="mb-4">
              <label className="text-sm text-[#666] mb-2 block">Фамилия</label>
              <input
                type="text"
                className="w-full bg-[#F7F7FB] p-4 rounded-xl text-base border border-[#E5E5E5]"
                defaultValue="Соломин"
              />
            </div>
            <div className="mb-4">
              <label className="text-sm text-[#666] mb-2 block">Телефон</label>
              <input
                type="tel"
                className="w-full bg-[#F7F7FB] p-4 rounded-xl text-base border border-[#E5E5E5]"
                defaultValue="+7 926 718-55-52"
                disabled
              />
            </div>
            <div className="mb-4">
              <label className="text-sm text-[#666] mb-2 block">Email</label>
              <input
                type="email"
                className="w-full bg-[#F7F7FB] p-4 rounded-xl text-base border border-[#E5E5E5]"
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
