// Константы приложения
export const APP_CONSTANTS = {
  APP_NAME: 'BANKAPP',
  VERSION: '1.0.0',
  SUPPORT_EMAIL: 'support@bankapp.com',
  SUPPORT_PHONE: '+7 (800) 123-45-67',
};

// Константы для карт
export const CARD_TYPES = {
  BLACK: 'Black',
  PLATINUM: 'Platinum',
  VIRTUAL: 'Virtual',
};

export const CARD_SYSTEMS = {
  VISA: 'Visa',
  MASTERCARD: 'Mastercard',
  MIR: 'Mir',
};

// Константы для операций
export const TRANSACTION_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense',
  TRANSFER: 'transfer',
};

export const TRANSACTION_CATEGORIES = {
  FOOD: 'food',
  TRANSPORT: 'transport',
  SHOPPING: 'shopping',
  ENTERTAINMENT: 'entertainment',
  BILLS: 'bills',
  HEALTH: 'health',
  OTHER: 'other',
};

// Константы для переводов
export const TRANSFER_TYPES = {
  PHONE: 'phone',
  CARD: 'card',
  ACCOUNT: 'account',
  QR: 'qr',
};

// Лимиты и ограничения
export const LIMITS = {
  MIN_TRANSFER_AMOUNT: 1,
  MAX_TRANSFER_AMOUNT: 1000000,
  DAILY_TRANSFER_LIMIT: 500000,
  CARD_NUMBER_LENGTH: 16,
  PHONE_NUMBER_LENGTH: 11,
};

// Сообщения об ошибках
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Ошибка сети. Проверьте подключение к интернету.',
  INVALID_CARD_NUMBER: 'Неверный номер карты',
  INVALID_PHONE_NUMBER: 'Неверный номер телефона',
  INVALID_AMOUNT: 'Неверная сумма',
  INSUFFICIENT_FUNDS: 'Недостаточно средств',
  TRANSFER_LIMIT_EXCEEDED: 'Превышен лимит перевода',
};

// Сообщения об успехе
export const SUCCESS_MESSAGES = {
  TRANSFER_SUCCESS: 'Перевод выполнен успешно',
  PAYMENT_SUCCESS: 'Платеж выполнен успешно',
  CARD_CREATED: 'Карта создана успешно',
  SETTINGS_SAVED: 'Настройки сохранены',
};