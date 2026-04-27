import '../styles/globals.css'
import { AuthProvider, useAuth } from '../src/context/AuthContext'
import { ThemeProvider } from '../src/context/ThemeContext'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const PUBLIC_PATHS = ['/', '/auth/yandex', '/auth/callback', '/auth/session-limit', '/code', '/code/callback', '/dev/test-auth', '/404']

function AuthGuard({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const isPublic = PUBLIC_PATHS.some(p => router.pathname === p || router.pathname.startsWith('/auth/') || router.pathname.startsWith('/code'));

    if (!isAuthenticated && !isPublic) {
      router.replace('/auth/yandex');
    }
  }, [isAuthenticated, isLoading, router.pathname]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F7F7FB]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated && !PUBLIC_PATHS.some(p => router.pathname === p || router.pathname.startsWith('/auth/') || router.pathname.startsWith('/code'))) {
    return null;
  }

  return children;
}

export default function App({ Component, pageProps }) {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <AuthGuard>
          <Component {...pageProps} />
        </AuthGuard>
      </AuthProvider>
    </ThemeProvider>
  )
}
