// Separate base URLs for each microservice
const API_BASE_URLS = {
  AUTH: '/api/auth',
  ACCOUNTS: '/api/accounts',
  TRANSFERS: '/api/transfers',
};

/**
 * Получает токен сессии из localStorage
 */
const getSessionToken = () => {
  try {
    const sessionCookie = localStorage.getItem('session_cookie');
    if (!sessionCookie) return null;

    const cookieName = 'YAA_SESS_ID=';
    const cookieValue = sessionCookie.split(';').find(c => c.trim().startsWith(cookieName));
    
    if (cookieValue) {
      return cookieValue.substring(cookieName.length);
    }
    
    return sessionCookie.replace('YAA_SESS_ID=', '').split(';')[0].trim();
  } catch (error) {
    console.error('Error getting session token:', error);
    return null;
  }
};

/**
 * Базовый fetch с автоматической подстановкой заголовков и токена
 */
const apiFetch = async (baseUrl, endpoint, options = {}) => {
  const token = getSessionToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  try {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include',
      mode: 'cors',
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
    console.error('Network error:', error);
    throw { 
      status: 0, 
      message: 'Ошибка сети. Проверьте подключение к интернету.' 
    };
  }
};

/**
 * GET запрос
 */
export const get = async (baseUrl, endpoint) => {
  return apiFetch(baseUrl, endpoint, { method: 'GET' });
};

/**
 * POST запрос
 */
export const post = async (baseUrl, endpoint, body) => {
  return apiFetch(baseUrl, endpoint, {
    method: 'POST',
    body: JSON.stringify(body),
  });
};

/**
 * PUT запрос
 */
export const put = async (baseUrl, endpoint, body) => {
  return apiFetch(baseUrl, endpoint, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
};

/**
 * DELETE запрос
 */
export const del = async (baseUrl, endpoint) => {
  return apiFetch(baseUrl, endpoint, { method: 'DELETE' });
};

// ==================== API методы ====================

/**
 * Авторизация и аутентификация
 */
export const authAPI = {
  // Получить URL для Yandex OAuth авторизации
  getYandexAuthUrl: async () => {
    const response = await fetch(`${API_BASE_URLS.AUTH}/simple/yandex/url`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      throw new Error('Не удалось получить URL авторизации');
    }
    return await response.text();
  },

  // Подтверждение кода из Yandex OAuth
  verifyCode: async (code) => {
    console.log('verifyCode called with code:', code);
    const url = `${API_BASE_URLS.AUTH}/simple/yandex/callback`;
    console.log('verifyCode URL:', url);
    
    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ code }),
    })
      .then(async res => {
        console.log('verifyCode response status:', res.status);
        const text = await res.text();
        console.log('verifyCode response body:', text);
        
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${text}`);
        }
        
        // Если ответ пустой (201), извлекаем cookie из заголовков
        if (res.status === 201 && !text) {
          const setCookie = res.headers.get('set-cookie');
          console.log('Set-Cookie header:', setCookie);
          
          if (setCookie) {
            const match = setCookie.match(/YAA_SESS_ID=([^;]+)/);
            if (match) {
              return { session_cookie: `YAA_SESS_ID=${match[1]}` };
            }
          }
          
          return { success: true };
        }
        
        return JSON.parse(text);
      })
      .catch(err => {
        console.error('verifyCode error:', err);
        throw err;
      });
  },

  // Проверка текущей сессии
  whoami: async () => {
    return get(API_BASE_URLS.AUTH, '/whoami');
  },

  // Выход из системы
  logout: async () => {
    return post(API_BASE_URLS.AUTH, '/logout');
  },
};

/**
 * Пользователь
 */
export const userAPI = {
  // Получить данные текущего пользователя (используем whoami)
  getProfile: async () => {
    return get(API_BASE_URLS.AUTH, '/whoami');
  },

  // Обновить данные пользователя
  updateProfile: async (data) => {
    return put(API_BASE_URLS.AUTH, '/user/profile', data);
  },

  // Получить настройки пользователя
  getSettings: async () => {
    return get(API_BASE_URLS.AUTH, '/user/settings');
  },

  // Обновить настройки
  updateSettings: async (settings) => {
    return put(API_BASE_URLS.AUTH, '/user/settings', settings);
  },
};

/**
 * Счета и карты
 */
export const accountsAPI = {
  // Получить все счета пользователя
  getAccounts: async () => {
    return get(API_BASE_URLS.ACCOUNTS, '/accounts');
  },

  // Получить счёт по ID
  getAccount: async (accountId) => {
    return get(API_BASE_URLS.ACCOUNTS, `/accounts/${accountId}`);
  },

  // Получить баланс счёта
  getBalance: async (accountId) => {
    return get(API_BASE_URLS.ACCOUNTS, `/accounts/${accountId}/balance`);
  },

  // Создать новый счёт
  createAccount: async (data) => {
    return post(API_BASE_URLS.ACCOUNTS, '/accounts', data);
  },
};

/**
 * Транзакции
 */
export const transactionsAPI = {
  // Получить историю транзакций
  getTransactions: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return get(API_BASE_URLS.ACCOUNTS, `/transactions${queryParams ? `?${queryParams}` : ''}`);
  },

  // Получить транзакцию по ID
  getTransaction: async (transactionId) => {
    return get(API_BASE_URLS.ACCOUNTS, `/transactions/${transactionId}`);
  },

  // Получить категории транзакций
  getCategories: async () => {
    return get(API_BASE_URLS.ACCOUNTS, '/transactions/categories');
  },
};

/**
 * Переводы
 */
export const transfersAPI = {
  // Перевод по номеру карты
  transferToCard: async (data) => {
    return post(API_BASE_URLS.TRANSFERS, '/transfers/card', data);
  },

  // Перевод по номеру телефона
  transferToPhone: async (data) => {
    return post(API_BASE_URLS.TRANSFERS, '/transfers/phone', data);
  },

  // Перевод между своими счетами
  transferBetweenAccounts: async (data) => {
    return post(API_BASE_URLS.TRANSFERS, '/transfers/internal', data);
  },

  // Получить лимиты на переводы
  getLimits: async () => {
    return get(API_BASE_URLS.TRANSFERS, '/transfers/limits');
  },
};

/**
 * Контакты
 */
export const contactsAPI = {
  // Получить список контактов
  getContacts: async () => {
    return get(API_BASE_URLS.AUTH, '/contacts');
  },

  // Добавить контакт
  addContact: async (data) => {
    return post(API_BASE_URLS.AUTH, '/contacts', data);
  },

  // Обновить контакт
  updateContact: async (contactId, data) => {
    return put(API_BASE_URLS.AUTH, `/contacts/${contactId}`, data);
  },

  // Удалить контакт
  deleteContact: async (contactId) => {
    return del(API_BASE_URLS.AUTH, `/contacts/${contactId}`);
  },
};

/**
 * Платежи
 */
export const paymentsAPI = {
  // Совершить платёж
  makePayment: async (data) => {
    return post(API_BASE_URLS.TRANSFERS, '/payments', data);
  },

  // Получить историю платежей
  getPayments: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return get(API_BASE_URLS.TRANSFERS, `/payments${queryParams ? `?${queryParams}` : ''}`);
  },
};

/**
 * Статистика и аналитика
 */
export const statsAPI = {
  // Получить статистику по расходам
  getSpendingStats: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return get(API_BASE_URLS.ACCOUNTS, `/stats/spending${queryParams ? `?${queryParams}` : ''}`);
  },

  // Получить статистику по доходам
  getIncomeStats: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return get(API_BASE_URLS.ACCOUNTS, `/stats/income${queryParams ? `?${queryParams}` : ''}`);
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
