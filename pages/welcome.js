import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../src/context/AuthContext';

export default function WelcomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const userName = user?.first_name || 'Пользователь';

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/main/home');
    }, 2500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex-1 min-h-screen bg-gradient-to-br from-[#fafafa] via-[#f0e6ff] to-[#e8d5ff] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-[28px] font-semibold text-[#000] mb-2">Добро пожаловать,</h1>
        <h2 className="text-2xl font-bold text-primary mb-[60px]">{userName}</h2>
        
        <div className="mt-5">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto" />
        </div>
      </div>
    </div>
  );
}
