import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';

export default function WelcomeScreen() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [fade, setFade] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
      return;
    }
    
    // Анимация появления
    setTimeout(() => setFade(1), 100);
    
    // Автоматический переход на главную через 2 секунды
    const timer = setTimeout(() => {
      router.push('/home');
    }, 2000);

    return () => clearTimeout(timer);
  }, [isAuthenticated, router]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#6A2EE8',
      opacity: fade,
      transition: 'opacity 0.4s ease-in-out',
    }}>
      <div style={{ textAlign: 'center', color: '#fff' }}>
        <h1 style={{ fontSize: '32px', marginBottom: '16px' }}>Добро пожаловать!</h1>
        {user && <p style={{ fontSize: '18px' }}>{user.name}</p>}
        <p style={{ marginTop: '24px', fontSize: '14px', opacity: 0.8 }}>
          Переходим к главному экрану...
        </p>
      </div>
    </div>
  );
}
