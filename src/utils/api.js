const API_BASE_URLS = {
  AUTH: 'https://bank.korzik.space/api/auth/v1',
  ACCOUNTS: 'https://bank.korzik.space/api/accounts/v1',
  TRANSFERS: 'https://bank.korzik.space/api/transfers/v1',
};

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
    console.error('Network error:', error);
    throw { 
      status: 0, 
      message: 'Ошибка сети. Проверьте подключение к интернету.' 
    };
  }
};

export const get = async (baseUrl, endpoint) => {
  return apiFetch(baseUrl, endpoint, { method: 'GET' });
};

export const post = async (baseUrl, endpoint, body) => {
  return apiFetch(baseUrl, endpoint, {
    method: 'POST',
    body: JSON.stringify(body),
  });
};

export const put = async (baseUrl, endpoint, body) => {
  return apiFetch(baseUrl, endpoint, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
};

export const del = async (baseUrl, endpoint) => {
  return apiFetch(baseUrl, endpoint, { method: 'DELETE' });
};

export const patch = async (baseUrl, endpoint, body) => {
  return apiFetch(baseUrl, endpoint, { method: 'PATCH', body: JSON.stringify(body) });
};

// ==================== Auth API ====================

export const authAPI = {


  getYandexAuthUrl: async () => {
    const response = await fetch(`${API_BASE_URLS.AUTH}/simple/yandex/url`, {
      method: 'GET',
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Не удалось получить URL авторизации');
    }
    return await response.text();
  },

  verifyCode: async (code) => {
    return fetch(`${API_BASE_URLS.AUTH}/simple/yandex/callback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      credentials: 'include',
      body: `code=${encodeURIComponent(code)}`,
    })
      .then(async res => {
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

  whoami: async () => {
    const res = await fetch(`${API_BASE_URLS.AUTH}/whoami`, {
      method: 'GET',
      credentials: 'include',
    });
    if (!res.ok) throw { status: res.status, message: 'Unauthorized' };
    return res.json();
  },

  preauth: async (sessionId, preauthSessionId) => {
    return post(API_BASE_URLS.AUTH, '/preauth', { sessionId, preauthSessionId });
  },

  getSessions: async () => {
    return get(API_BASE_URLS.AUTH, '/sessions');
  },

  deleteSession: async (sessionId) => {
    return del(API_BASE_URLS.AUTH, `/sessions${sessionId ? `?sessionId=${sessionId}` : ''}`);
  },

  logout: async () => {
    return del(API_BASE_URLS.AUTH, '/sessions');
  },
};

// ==================== Users API ====================

export const userAPI = {
  getProfile: async () => {
    const res = await fetch(`${API_BASE_URLS.AUTH}/whoami`, { method: 'GET', credentials: 'include' });
    if (!res.ok) throw { status: res.status, message: 'Unauthorized' };
    return res.json();
  },

  createUser: async (data) => {
    return post(API_BASE_URLS.AUTH, '/users', data);
  },

  getUsers: async () => {
    return get(API_BASE_URLS.AUTH, '/users');
  },

  getUserByPhone: async (phone) => {
    const cleanPhone = phone.replace(/\D/g, '');
    return get(API_BASE_URLS.AUTH, `/users/phone/${cleanPhone}`);
  },

  getUserById: async (id) => {
    return get(API_BASE_URLS.AUTH, `/users/${id}`);
  },

  updateUser: async (id, data) => {
    return patch(API_BASE_URLS.AUTH, `/users/${id}`, data);
  },

  updateUserRole: async (id, role) => {
    return patch(API_BASE_URLS.AUTH, `/users/${id}/role`, { role });
  },

  updateUserKyc: async (id, kycData) => {
    return patch(API_BASE_URLS.AUTH, `/users/${id}/kyc`, kycData);
  },

  registerUser: async (data) => {
    return post(API_BASE_URLS.AUTH, '/user/new', data);
  },
};

// ==================== Accounts API ====================

export const accountsAPI = {
  ping: async () => {
    return get(API_BASE_URLS.ACCOUNTS, '/ping');
  },

  getAccounts: async () => {
    return get(API_BASE_URLS.ACCOUNTS, '');
  },

  getAccount: async (accountId) => {
    return get(API_BASE_URLS.ACCOUNTS, `/${accountId}`);
  },

  createAccount: async (currencyCode) => {
    return post(API_BASE_URLS.ACCOUNTS, '', { currencyCode });
  },

  getAccountHistory: async (accountId, params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return get(API_BASE_URLS.ACCOUNTS, `/${accountId}/history${queryParams ? `?${queryParams}` : ''}`);
  },

  updateAccountStatus: async (accountId, status) => {
    return patch(API_BASE_URLS.ACCOUNTS, `/${accountId}/status`, { status });
  },

  getCurrencies: async () => {
    return get(API_BASE_URLS.ACCOUNTS, '/currencies');
  },

  getExchangeRates: async () => {
    return get(API_BASE_URLS.ACCOUNTS, '/currencies/rates');
  },

  convertCurrency: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return get(API_BASE_URLS.ACCOUNTS, `/currencies/convert${queryParams ? `?${queryParams}` : ''}`);
  },
};

// ==================== Transfers API ====================

export const transfersAPI = {
  ping: async () => {
    return get(API_BASE_URLS.TRANSFERS, '/ping');
  },

  transferToPhone: async ({ phone, amount, message }) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const recipient = await get(API_BASE_URLS.AUTH, `/users/phone/${cleanPhone}`);
    const recipientUserId = String(recipient.id || recipient.data?.id || recipient.userId || '');
    return post(API_BASE_URLS.TRANSFERS, '', {
      idempotencyKey: crypto.randomUUID(),
      recipientUserId,
      amount,
      description: message,
      transferType: 'SBP',
    });
  },

  transferToCard: async ({ cardNumber, amount, message }) => {
    return post(API_BASE_URLS.TRANSFERS, '', {
      idempotencyKey: crypto.randomUUID(),
      recipientUserId: cardNumber,
      amount,
      description: message,
      transferType: 'PAYMENT_ORDER',
    });
  },

  transferBetweenAccounts: async ({ fromAccountId, toAccountId, amount }) => {
    return post(API_BASE_URLS.TRANSFERS, '/own', {
      idempotencyKey: crypto.randomUUID(),
      senderAccountId: fromAccountId,
      recipientAccountId: toAccountId,
      amount,
    });
  },

  getTransfers: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return get(API_BASE_URLS.TRANSFERS, `${queryParams ? `?${queryParams}` : ''}`);
  },

  getTransfer: async (transferId) => {
    return get(API_BASE_URLS.TRANSFERS, `/${transferId}`);
  },

  cancelTransfer: async (transferId) => {
    return post(API_BASE_URLS.TRANSFERS, `/${transferId}/cancel`);
  },

  getTransferEvents: async (transferId) => {
    return get(API_BASE_URLS.TRANSFERS, `/${transferId}/events`);
  },

  getReviewQueue: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return get(API_BASE_URLS.TRANSFERS, `/reviews/queue${queryParams ? `?${queryParams}` : ''}`);
  },

  approveTransfer: async (transferId) => {
    return post(API_BASE_URLS.TRANSFERS, `/${transferId}/approve`);
  },

  rejectTransfer: async (transferId) => {
    return post(API_BASE_URLS.TRANSFERS, `/${transferId}/reject`);
  },
};

export default {
  auth: authAPI,
  user: userAPI,
  accounts: accountsAPI,
  transfers: transfersAPI,
};
