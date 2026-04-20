import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { IoHomeOutline, IoEllipsisHorizontalCircleOutline } from 'react-icons/io5';
import { MdOutlineCreditCard } from 'react-icons/md';

export default function MainLayout({ children }) {
  const router = useRouter();
  const currentPath = router.pathname;

  const tabs = [
    { name: 'Home', path: '/main/home', icon: IoHomeOutline, label: 'Главная' },
    { name: 'Payments', path: '/transfers/payments', icon: MdOutlineCreditCard, label: 'Платежи' },
    { name: 'More', path: '/profile/more', icon: IoEllipsisHorizontalCircleOutline, label: 'Ещё' },
  ];

  return (
    <div className="flex flex-col h-screen">
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
      
      {/* Bottom Tab Navigation */}
      <nav className="h-[72px] pb-2.5 bg-white border-t border-[#E5E5E5] flex flex-row">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentPath === tab.path;
          
          return (
            <Link 
              key={tab.name}
              href={tab.path}
              className="flex-1 flex flex-col items-center justify-center"
            >
              <Icon 
                size={24} 
                color={isActive ? '#6A2EE8' : '#666'} 
              />
              <span 
                className={`text-xs font-medium mt-1 ${
                  isActive ? 'text-primary' : 'text-[#666]'
                }`}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
