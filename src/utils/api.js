import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const API_BASE_URL = 'https://bank.korzik.space/api/auth/v1';
const ACCOUNTS_BASE_URL = 'https://bank.korzik.space/api/accounts/v1';
const TRANSFERS_BASE_URL = 'https://bank.korzik.space/api/transfers/v1';

/**
 * Получает токен сессии из AsyncStorage
 */
const getSessionToken = async () => {
  try {
    const sessionCookie = await AsyncStorage.getItem('session_cookie');
    if (!sessionCookie) return null;

    const cookieName = 'YAA_SESS_ID=';
    const cookieValue = sessionCookie.split(';').find(c => c.trim().startsWith(cookieName));

    if (cookieValue) {
      return cookieValue.substring(cookieName.length);
    }

    // Если токен сохранён без имени куки
    return sessionCookie.replace('YAA_SESS_ID=', '').split(';')[0].trim();
  } catch (error) {
    console.error('Error getting session token:', error);
    return null;
  }
};

/**
 * Базовый fetch с автоматической подстановкой заголовков и токена
 */
const apiFetch = async (endpoint, options = {}, baseUrl = API_BASE_URL) => {
  const token = await getSessionToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(Platform.OS !== 'web' && token && { 'Cookie': `YAA_SESS_ID=${token}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include',
    });

    // Обработка 300 статуса (Multiple Choices / Session Limit)
    if (response.status === 300) {
      const data = await response.json();
      throw { status: 300, data };
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw {
        status: response.status,
        message: errorData.message || 'Ошибка запроса'
      };
    }

    // Пустой ответ (204 No Content)
    if (response.status === 204) {
      return null;
    }

    return await response.json();
  } catch (error) {
    if (error.status) {
      throw error;
    }
    // Сетевая ошибка
    throw {
      status: 0,
      message: 'Ошибка сети. Проверьте подключение к интернету.'
    };
  }
};

/**
 * GET запрос
 */
export const get = async (endpoint, baseUrl = API_BASE_URL) => {
  return apiFetch(endpoint, { method: 'GET' }, baseUrl);
};

/**
 * POST запрос
 */
export const post = async (endpoint, body, baseUrl = API_BASE_URL) => {
  return apiFetch(endpoint, {
    method: 'POST',
    body: JSON.stringify(body),
  }, baseUrl);
};

/**
 * PUT запрос
 */
export const put = async (endpoint, body, baseUrl = API_BASE_URL) => {
  return apiFetch(endpoint, {
    method: 'PUT',
    body: JSON.stringify(body),
  }, baseUrl);
};

/**
 * DELETE запрос
 */
export const del = async (endpoint, baseUrl = API_BASE_URL) => {
  return apiFetch(endpoint, { method: 'DELETE' }, baseUrl);
};

// ==================== API методы ====================

/**
 * Авторизация и аутентификация
 */
export const authAPI = {
  // Получить URL для Telegram авторизации
  getTelegramAuthUrl: async () => {
    const response = await fetch(`${API_BASE_URL}/simple/telegram/url`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      throw new Error('Не удалось получить URL авторизации');
    }
    return await response.text();
  },

  // Подтверждение кода из Telegram
  verifyCode: async (code) => {
    return post('/simple/telegram/callback', { code });
  },

  // Проверка текущей сессии
  whoami: async () => {
    return get('/whoami');
  },

  // Выход из системы
  logout: async () => {
    return post('/logout');
  },
};

/**
 * Пользователь
 */
export const userAPI = {
  // Получить данные текущего пользователя
  getProfile: async () => {
    return get('/user/profile');
  },

  // Обновить данные пользователя
  updateProfile: async (data) => {
    return put('/user/profile', data);
  },

  // Получить настройки пользователя
  getSettings: async () => {
    return get('/user/settings');
  },

  // Обновить настройки
  updateSettings: async (settings) => {
    return put('/user/settings', settings);
  },
};

/**
 * Счета и карты
 */
export const accountsAPI = {
  // Получить все счета пользователя
  getAccounts: async () => {
    return get('/accounts', ACCOUNTS_BASE_URL);
  },

  // Получить счёт по ID
  getAccount: async (accountId) => {
    return get(`/accounts/${accountId}`, ACCOUNTS_BASE_URL);
  },

  // Получить баланс счёта
  getBalance: async (accountId) => {
    return get(`/accounts/${accountId}/balance`, ACCOUNTS_BASE_URL);
  },

  // Создать новый счёт
  createAccount: async (data) => {
    return post('/accounts', data, ACCOUNTS_BASE_URL);
  },
};

/**
 * Транзакции
 */
export const transactionsAPI = {
  // Получить историю транзакций
  getTransactions: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return get(`/transactions${queryParams ? `?${queryParams}` : ''}`);
  },

  // Получить транзакцию по ID
  getTransaction: async (transactionId) => {
    return get(`/transactions/${transactionId}`);
  },

  // Получить категории транзакций
  getCategories: async () => {
    return get('/transactions/categories');
  },
};

/**
 * Переводы
 */
export const transfersAPI = {
  // Проверка доступности сервиса переводов
  ping: async () => {
    return get('/ping', TRANSFERS_BASE_URL);
  },

  // Перевод по номеру карты
  transferToCard: async (data) => {
    return post('/transfers/card', data, TRANSFERS_BASE_URL);
  },

  // Перевод по номеру телефона
  transferToPhone: async (data) => {
    return post('/transfers/phone', data, TRANSFERS_BASE_URL);
  },

  // Перевод между своими счетами
  transferBetweenAccounts: async (data) => {
    return post('/transfers/internal', data, TRANSFERS_BASE_URL);
  },

  // Получить лимиты на переводы
  getLimits: async () => {
    return get('/transfers/limits', TRANSFERS_BASE_URL);
  },
};

/**
 * Контакты
 */
export const contactsAPI = {
  // Получить список контактов
  getContacts: async () => {
    return get('/contacts');
  },

  // Добавить контакт
  addContact: async (data) => {
    return post('/contacts', data);
  },

  // Обновить контакт
  updateContact: async (contactId, data) => {
    return put(`/contacts/${contactId}`, data);
  },

  // Удалить контакт
  deleteContact: async (contactId) => {
    return del(`/contacts/${contactId}`);
  },
};

/**
 * Платежи
 */
export const paymentsAPI = {
  // Совершить платёж
  makePayment: async (data) => {
    return post('/payments', data);
  },

  // Получить историю платежей
  getPayments: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return get(`/payments${queryParams ? `?${queryParams}` : ''}`);
  },
};

/**
 * Статистика и аналитика
 */
export const statsAPI = {
  // Получить статистику по расходам
  getSpendingStats: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return get(`/stats/spending${queryParams ? `?${queryParams}` : ''}`);
  },

  // Получить статистику по доходам
  getIncomeStats: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return get(`/stats/income${queryParams ? `?${queryParams}` : ''}`);
  },
};

export default {
  auth: authAPI,
  user: userAPI,
  accounts: accountsAPI,
  transactions: transactionsAPI,
  transfers: transfersAPI,
  contacts: contactsAPI,
  payments: paymentsAPI,
  stats: statsAPI,
};
