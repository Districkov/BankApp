const API_BASE_URLS = {
  AUTH: 'https://bank.korzik.space/api/auth/v1',
  ACCOUNTS: 'https://bank.korzik.space/api/accounts/v1',
  TRANSFERS: 'https://bank.korzik.space/api/transfers/v1',
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
  const url = `${baseUrl}${endpoint}`;

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include',
      cache: 'no-store',
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

    // Пустой ответ (204 No Content или 201 без тела)
    if (response.status === 204 || response.status === 201) {
      const text = await response.text();
      if (!text) return { success: true };
      try { return JSON.parse(text); } catch { return { success: true }; }
    }

    const result = await response.json();
    if (result && result.success && result.data !== undefined) {
      return result.data;
    }
    return result;
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
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Не удалось получить URL авторизации');
    }
    return await response.text();
  },

  // Подтверждение кода из Yandex OAuth
  verifyCode: async (code) => {
    console.log('verifyCode called with code:', code);

    return fetch(`${API_BASE_URLS.AUTH}/simple/yandex/callback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ code }),
    })
      .then(async res => {
        console.log('verifyCode response status:', res.status);

        if (res.status === 300) {
          const data = await res.json();
          const err = new Error('HTTP 300');
          err.status = 300;
          err.data = data;
          throw err;
        }

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`HTTP ${res.status}: ${text}`);
        }

        const text = await res.text();
        let parsed = { success: true };
        if (text) {
          try { parsed = JSON.parse(text); } catch {}
        }

        return { ...parsed, verified: res.status >= 200 && res.status < 300 };
      })
      .catch(err => {
        if (err.status !== 300) {
          console.error('verifyCode error:', err);
        }
        throw err;
      });
  },

  // Проверка текущей сессии
  whoami: async () => {
    const res = await fetch(`${API_BASE_URLS.AUTH}/whoami`, {
      method: 'GET',
      credentials: 'include',
    });
    if (!res.ok) throw { status: res.status, message: 'Unauthorized' };
    return res.json();
  },

  logout: async () => {
    return post(API_BASE_URLS.AUTH, '/logout');
  },

  deleteSession: async (sessionId, preauthSessionId) => {
    const res = await fetch(`${API_BASE_URLS.AUTH}/preauth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ sessionId, preauthSessionId }),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw { status: res.status, message: text || 'Ошибка удаления сессии' };
    }
    const text = await res.text();
    if (text) { try { return JSON.parse(text); } catch {} }
    return { success: true };
  },
};

/**
 * Пользователь
 */
export const userAPI = {
  // Получить данные текущего пользователя (используем whoami)
  getProfile: async () => {
    const res = await fetch(`${API_BASE_URLS.AUTH}/whoami`, { method: 'GET', credentials: 'include' });
    if (!res.ok) throw { status: res.status, message: 'Unauthorized' };
    return res.json();
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
    return get(API_BASE_URLS.ACCOUNTS, '');
  },

  // Получить счёт по ID
  getAccount: async (accountId) => {
    return get(API_BASE_URLS.ACCOUNTS, `/${accountId}`);
  },

  // Получить баланс счёта
  getBalance: async (accountId) => {
    return get(API_BASE_URLS.ACCOUNTS, `/${accountId}/balance`);
  },

  // Создать новый счёт
  createAccount: async (data) => {
    return post(API_BASE_URLS.ACCOUNTS, '', data);
  },
};

/**
 * Транзакции
 */
export const transactionsAPI = {
  // Получить историю транзакций (требует accountId)
  getTransactions: async (accountId, params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return get(API_BASE_URLS.ACCOUNTS, `/${accountId}/history${queryParams ? `?${queryParams}` : ''}`);
  },

  // Получить транзакцию по ID (если есть отдельный эндпоинт)
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
  // Создать перевод
  createTransfer: async (data) => {
    return post(API_BASE_URLS.TRANSFERS, '', data);
  },

  // Перевод по номеру телефона
  transferToPhone: async (data) => {
    return post(API_BASE_URLS.TRANSFERS, '', data);
  },

  // Перевод по номеру карты
  transferToCard: async (data) => {
    return post(API_BASE_URLS.TRANSFERS, '', data);
  },

  // Перевод между своими счетами
  transferBetweenAccounts: async (data) => {
    return post(API_BASE_URLS.TRANSFERS, '', data);
  },

  // Получить все переводы
  getTransfers: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return get(API_BASE_URLS.TRANSFERS, `${queryParams ? `?${queryParams}` : ''}`);
  },

  // Получить перевод по ID
  getTransfer: async (transferId) => {
    return get(API_BASE_URLS.TRANSFERS, `/${transferId}`);
  },

  // Отменить перевод
  cancelTransfer: async (transferId) => {
    return post(API_BASE_URLS.TRANSFERS, `/${transferId}/cancel`);
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
  stats: statsAPI,
};
