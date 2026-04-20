import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [isBalanceHidden, setIsBalanceHidden] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
      return;
    }
    // Загрузка данных
    setIsLoading(false);
  }, [isAuthenticated, router]);

  const quickActions = [
    { title: 'Перевод по номеру', icon: '📱', nav: '/transfer-phone', color: '#159E3A' },
    { title: 'Перевести', icon: '💸', nav: '/transfers', color: '#6A2EE8' },
  ];

  const partners = [
    {
      id: 1,
      name: 'Astra RP',
      discount: 'Эксклюзивные бонусы',
      description: 'GTA 5 RolePlay проект',
      screen: '/partners/astra',
      color: '#FF0000',
    },
    {
      id: 2,
      name: 'Yanima',
      discount: 'Подписка в подарок',
      description: 'Онлайн-просмотр аниме',
      screen: '/partners/yanima',
      color: '#6A2EE8',
    },
  ];

  if (isLoading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loader}>Загрузка...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerTop}>
          <div>
            <p style={styles.greeting}>Добрый день,</p>
            <h2 style={styles.userName}>{user?.name || 'Пользователь'}</h2>
          </div>
          <button onClick={logout} style={styles.logoutButton}>
            Выйти
          </button>
        </div>
      </header>

      {/* Balance Card */}
      <div style={styles.balanceCard}>
        <div style={styles.balanceHeader}>
          <span style={styles.balanceTitle}>Общий баланс</span>
          <button 
            onClick={() => setIsBalanceHidden(!isBalanceHidden)}
            style={styles.hideButton}
          >
            {isBalanceHidden ? '👁️' : '🙈'}
          </button>
        </div>
        <div style={styles.balanceAmount}>
          {isBalanceHidden ? '••••••' : '125 450.00 ₽'}
        </div>
      </div>

      {/* Quick Actions */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Быстрые действия</h3>
        <div style={styles.quickActionsGrid}>
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => router.push(action.nav)}
              style={{...styles.quickActionBtn, borderLeftColor: action.color}}
            >
              <span style={styles.actionIcon}>{action.icon}</span>
              <span style={styles.actionTitle}>{action.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Partners */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Партнёры</h3>
        {partners.map((partner) => (
          <div
            key={partner.id}
            onClick={() => router.push(partner.screen)}
            style={styles.partnerCard}
          >
            <div style={{...styles.partnerLogo, backgroundColor: partner.color}}>
              <span style={styles.partnerLogoText}>{partner.name.charAt(0)}</span>
            </div>
            <div style={styles.partnerInfo}>
              <h4 style={styles.partnerName}>{partner.name}</h4>
              <p style={styles.partnerDiscount}>{partner.discount}</p>
              <p style={styles.partnerDescription}>{partner.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Navigation */}
      <nav style={styles.bottomNav}>
        <button 
          onClick={() => router.push('/home')}
          style={styles.navItem}
        >
          <span style={styles.navIcon}>🏠</span>
          <span style={styles.navLabel}>Главная</span>
        </button>
        <button 
          onClick={() => router.push('/payments')}
          style={styles.navItem}
        >
          <span style={styles.navIcon}>💳</span>
          <span style={styles.navLabel}>Платежи</span>
        </button>
        <button 
          onClick={() => router.push('/more')}
          style={styles.navItem}
        >
          <span style={styles.navIcon}>⋯</span>
          <span style={styles.navLabel}>Ещё</span>
        </button>
      </nav>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    paddingBottom: '80px',
  },
  loadingContainer: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loader: {
    fontSize: '18px',
    color: '#666',
  },
  header: {
    backgroundColor: '#fff',
    padding: '20px',
    borderBottom: '1px solid #e5e5e5',
  },
  headerTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: '14px',
    color: '#666',
    margin: 0,
  },
  userName: {
    fontSize: '20px',
    fontWeight: 'bold',
    margin: '4px 0 0 0',
    color: '#333',
  },
  logoutButton: {
    background: 'none',
    border: '1px solid #ddd',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  balanceCard: {
    backgroundColor: '#6A2EE8',
    margin: '20px',
    padding: '24px',
    borderRadius: '16px',
    color: '#fff',
  },
  balanceHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  balanceTitle: {
    fontSize: '14px',
    opacity: 0.9,
  },
  hideButton: {
    background: 'none',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    padding: 0,
  },
  balanceAmount: {
    fontSize: '32px',
    fontWeight: 'bold',
  },
  section: {
    padding: '0 20px',
    marginBottom: '24px',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '16px',
    color: '#333',
  },
  quickActionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
  },
  quickActionBtn: {
    backgroundColor: '#fff',
    border: 'none',
    borderLeft: '4px solid',
    padding: '16px',
    borderRadius: '12px',
    textAlign: 'left',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
  actionIcon: {
    fontSize: '24px',
    display: 'block',
    marginBottom: '8px',
  },
  actionTitle: {
    fontSize: '14px',
    color: '#333',
  },
  partnerCard: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
  partnerLogo: {
    width: '50px',
    height: '50px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '16px',
  },
  partnerLogoText: {
    color: '#fff',
    fontSize: '20px',
    fontWeight: 'bold',
  },
  partnerInfo: {
    flex: 1,
  },
  partnerName: {
    fontSize: '16px',
    fontWeight: '600',
    margin: '0 0 4px 0',
    color: '#333',
  },
  partnerDiscount: {
    fontSize: '14px',
    color: '#6A2EE8',
    margin: '0 0 4px 0',
  },
  partnerDescription: {
    fontSize: '12px',
    color: '#666',
    margin: 0,
  },
  bottomNav: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTop: '1px solid #e5e5e5',
    display: 'flex',
    justifyContent: 'space-around',
    padding: '8px 0',
  },
  navItem: {
    background: 'none',
    border: 'none',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer',
    padding: '4px 16px',
  },
  navIcon: {
    fontSize: '24px',
    marginBottom: '2px',
  },
  navLabel: {
    fontSize: '12px',
    color: '#666',
  },
};
