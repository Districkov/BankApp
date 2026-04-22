import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTheme } from '../src/context/ThemeContext';

export default function CodeRedirect() {
  const router = useRouter();
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const fullPath = window.location.pathname + window.location.search + window.location.hash;
    
    const pathMatch = fullPath.match(/\/code=([^&?#]+)/);
    
    const searchParams = new URLSearchParams(window.location.search);
    const queryCode = searchParams.get('code');
    
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const hashCode = hashParams.get('code');
    
    const code = pathMatch?.[1] || queryCode || hashCode;
    
    console.log('Code redirect page - Full path:', fullPath);
    console.log('Code extracted:', code);
    
    if (code) {
      router.replace(`/auth/callback?code=${code}`);
    } else {
      console.error('Code not found in URL');
      router.replace('/auth/yandex');
    }
  }, [router]);

  return (
    <div className={`flex justify-center items-center min-h-screen ${isDarkMode ? 'bg-[#121212]' : 'bg-[#F7F7FB]'}`} style={{ flexDirection: 'column', gap: '10px' }}>
      <div style={{ 
        width: '40px', 
        height: '40px', 
        border: '4px solid #8B5CF6', 
        borderTopColor: 'transparent',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <p className={isDarkMode ? 'text-[#b3b3b3]' : 'text-[#666]'}>Обработка авторизации...</p>
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
