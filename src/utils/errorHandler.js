/**
 * ErrorHandler - утилита для централизованной обработки ошибок
 */

export class ApiError extends Error {
  constructor(status, message, data = null) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = 'ApiError';
  }
}

/**
 * Классификация ошибок по типам
 */
export const ERROR_TYPES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  SERVER_ERROR: 'SERVER_ERROR',
  SESSION_LIMIT: 'SESSION_LIMIT',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
};

/**
 * Получает тип ошибки по статус коду
 */
export const getErrorType = (status) => {
  if (status === 0) return ERROR_TYPES.NETWORK_ERROR;
  if (status === 300) return ERROR_TYPES.SESSION_LIMIT;
  if (status === 401) return ERROR_TYPES.UNAUTHORIZED;
  if (status === 403) return ERROR_TYPES.FORBIDDEN;
  if (status === 404) return ERROR_TYPES.NOT_FOUND;
  if (status === 422) return ERROR_TYPES.VALIDATION_ERROR;
  if (status >= 500) return ERROR_TYPES.SERVER_ERROR;
  return ERROR_TYPES.UNKNOWN_ERROR;
};

/**
 * Получает пользовательское сообщение об ошибке
 */
export const getErrorMessage = (error) => {
  if (typeof error === 'string') {
    return error;
  }

  if (error instanceof ApiError) {
    return error.message;
  }

  if (error.message) {
    return error.message;
  }

  return 'Произошла неизвестная ошибка';
};

/**
 * Логирование ошибок
 */
export const logError = (error, context = '') => {
  const timestamp = new Date().toISOString();
  const errorLog = {
    timestamp,
    context,
    status: error.status,
    message: error.message,
    stack: error.stack,
  };

  if (__DEV__) {
    console.error(`[${timestamp}] ${context}:`, errorLog);
  }

  // Здесь можно отправить ошибку на сервер логирования
  // sendToErrorTracker(errorLog);
};

/**
 * Retry функция для сетевых операций
 */
export const retryAsync = async (
  fn,
  maxRetries = 3,
  delay = 1000,
  backoffMultiplier = 2
) => {
  let lastError;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Не повторяем для 4xx ошибок (кроме 408, 429)
      if (
        error.status >= 400 &&
        error.status < 500 &&
        error.status !== 408 &&
        error.status !== 429
      ) {
        throw error;
      }

      // Последняя попытка - не ждем
      if (i === maxRetries - 1) {
        break;
      }

      // Экспоненциальный backoff
      const waitTime = delay * Math.pow(backoffMultiplier, i);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }

  throw lastError;
};

/**
 * Обработчик ошибок для экран/компонента
 */
export const handleApiError = (error, onSessionLimit, onUnauthorized) => {
  const errorType = getErrorType(error.status);

  switch (errorType) {
    case ERROR_TYPES.SESSION_LIMIT:
      onSessionLimit?.();
      break;
    case ERROR_TYPES.UNAUTHORIZED:
      onUnauthorized?.();
      break;
    case ERROR_TYPES.NETWORK_ERROR:
      return 'Ошибка сети. Проверьте подключение к интернету.';
    case ERROR_TYPES.SERVER_ERROR:
      return 'Сервер недоступен. Попробуйте позже.';
    case ERROR_TYPES.VALIDATION_ERROR:
      return error.message || 'Проверьте введенные данные.';
    default:
      return getErrorMessage(error);
  }
};
