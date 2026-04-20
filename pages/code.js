import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function CodeRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Получаем полный URL
    const fullPath = window.location.pathname + window.location.search + window.location.hash;
    
    // Ищем код в разных форматах
    // Формат 1: /code=XXXXX
    const pathMatch = fullPath.match(/\/code=([^&?#]+)/);
    
    // Формат 2: ?code=XXXXX
    const searchParams = new URLSearchParams(window.location.search);
    const queryCode = searchParams.get('code');
    
    // Формат 3: #code=XXXXX
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const hashCode = hashParams.get('code');
    
    const code = pathMatch?.[1] || queryCode || hashCode;
    
    console.log('Code redirect page - Full path:', fullPath);
    console.log('Code extracted:', code);
    
    if (code) {
      // Перенаправляем на правильный callback с кодом
      router.replace(`/auth/callback?code=${code}`);
    } else {
      // Если код не найден, возвращаем на страницу входа
      console.error('Code not found in URL');
      router.replace('/auth/yandex');
    }
  }, [router]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      flexDirection: 'column',
      gap: '10px'
    }}>
      <div style={{ 
        width: '40px', 
        height: '40px', 
        border: '4px solid #8B5CF6', 
        borderTopColor: 'transparent',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <p>Обработка авторизации...</p>
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
