import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

export default function TelegramAuthScreen() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/welcome');
    }
  }, [isAuthenticated, router]);

  const handleTelegramLogin = async () => {
    try {
      // Здесь будет логика авторизации через Telegram
      // const response = await authAPI.telegramLogin();
      // await login(response.session_cookie, response.user);
      
      // Для демонстрации
      await login('demo_session_cookie', { id: 1, name: 'Demo User' });
      router.push('/welcome');
    } catch (error) {
      console.error('Telegram login error:', error);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>Вход через Telegram</h1>
        <p style={styles.subtitle}>Авторизуйтесь для продолжения</p>
        <button 
          onClick={handleTelegramLogin}
          style={styles.button}
        >
          Войти через Telegram
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  content: {
    textAlign: 'center',
    padding: '40px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: '24px',
    marginBottom: '16px',
    color: '#333',
  },
  subtitle: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '32px',
  },
  button: {
    backgroundColor: '#6A2EE8',
    color: '#fff',
    border: 'none',
    padding: '16px 32px',
    fontSize: '16px',
    borderRadius: '8px',
    cursor: 'pointer',
  },
};
