import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../src/context/AuthContext';
import { useTheme } from '../src/context/ThemeContext';

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const { isDarkMode } = useTheme();
  const router = useRouter();

  useEffect(() => {
    console.log('Index page - isLoading:', isLoading, 'isAuthenticated:', isAuthenticated);
    if (!isLoading) {
      if (isAuthenticated) {
        console.log('Redirecting to /main/home');
        router.replace('/main/home');
      } else {
        console.log('Redirecting to /auth/yandex');
        router.replace('/auth/yandex');
      }
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <div className={`flex items-center justify-center min-h-screen ${isDarkMode ? 'bg-[#121212]' : 'bg-[#F7F7FB]'}`}>
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
    </div>
  );
}
