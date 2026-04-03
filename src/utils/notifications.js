import { Platform } from 'react-native';

/**
 * Запрос разрешения на push-уведомления (для web)
 */
export const requestNotificationPermission = async () => {
  if (Platform.OS === 'web' && 'Notification' in window) {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return false;
};

/**
 * Проверка разрешения на уведомления
 */
export const hasNotificationPermission = () => {
  if (Platform.OS === 'web' && 'Notification' in window) {
    return Notification.permission === 'granted';
  }
  return false;
};

/**
 * Показать push-уведомление
 */
export const showNotification = (title, options = {}) => {
  if (Platform.OS === 'web' && 'Notification' in window) {
    if (Notification.permission === 'granted') {
      const notification = new Notification(title, {
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        ...options,
      });

      // Автозакрытие через 5 секунд
      setTimeout(() => notification.close(), 5000);

      return notification;
    }
  }
  return null;
};

/**
 * Уведомление об успешном переводе
 */
export const notifyTransferSuccess = (amount, type = 'Перевод') => {
  return showNotification('Перевод выполнен ✓', {
    body: `${type} на сумму ${amount} ₽ успешно завершён`,
    tag: 'transfer-success',
  });
};
