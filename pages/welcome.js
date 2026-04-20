import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../src/context/AuthContext';

export default function WelcomeScreen() {
  const { user } = useAuth();
  const userName = user?.username || 'Пользователь';
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/main/home');
    }, 2500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex-1 flex justify-center items-center min-h-screen bg-gradient-to-br from-[#fafafa] via-[#f0e6ff] to-[#e8d5ff]">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-[28px] font-semibold text-black text-center mb-2">
          Добро пожаловать,
        </h1>
        <h2 className="text-2xl font-bold text-primary text-center mb-[60px]">
          {userName}
        </h2>
        
        <div className="mt-5">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
        </div>
      </div>
    </div>
  );
}
