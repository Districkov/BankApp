import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../src/context/AuthContext';
import { useTheme } from '../src/context/ThemeContext';

export default function WelcomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { isDarkMode } = useTheme();

  const userName = user?.first_name || (() => {
    try {
      const stored = JSON.parse(localStorage.getItem('user_data') || '{}');
      return stored.first_name || '';
    } catch { return ''; }
  })();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/main/home');
    }, 2500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className={`flex-1 min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gradient-to-br from-[#121212] via-[#1a1a2e] to-[#16213e]' : 'bg-gradient-to-br from-[#fafafa] via-[#f0e6ff] to-[#e8d5ff]'}`}>
      <div className="text-center">
        <h1 className={`text-[28px] font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-[#000]'}`}>Добро пожаловать,</h1>
        <h2 className="text-2xl font-bold text-primary mb-[60px]">{userName}</h2>
        
        <div className="mt-5">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto" />
        </div>
      </div>
    </div>
  );
}
