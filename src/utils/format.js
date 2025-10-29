import { CARD_SYSTEMS } from './constants';

// Форматирование денежных сумм
export const formatAmount = (amount, currency = '₽') => {
  if (typeof amount !== 'number') {
    amount = parseFloat(amount) || 0;
  }
  return `${amount.toLocaleString('ru-RU')} ${currency}`;
};

// Форматирование номера карты
export const formatCardNumber = (number, visible = false) => {
  if (!number) return '';
  
  const cleaned = number.toString().replace(/\s+/g, '');
  
  if (visible) {
    return cleaned.replace(/(.{4})/g, '$1 ').trim();
  } else {
    const firstSix = cleaned.slice(0, 6);
    const lastFour = cleaned.slice(-4);
    return `${firstSix}******${lastFour}`.replace(/(.{4})/g, '$1 ').trim();
  }
};

// Форматирование номера телефона
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  
  const cleaned = phone.toString().replace(/\D/g, '');
  
  if (cleaned.length === 11) {
    return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 9)}-${cleaned.slice(9)}`;
  }
  
  return cleaned;
};

// Форматирование даты
export const formatDate = (dateString, format = 'short') => {
  const date = new Date(dateString);
  
  if (format === 'short') {
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
    });
  }
  
  if (format === 'long') {
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }
  
  return date.toLocaleDateString('ru-RU');
};

// Определение платежной системы по номеру карты
export const getCardSystem = (cardNumber) => {
  const firstDigit = cardNumber.toString().charAt(0);
  
  switch (firstDigit) {
    case '4':
      return CARD_SYSTEMS.VISA;
    case '5':
      return CARD_SYSTEMS.MASTERCARD;
    case '2':
      return CARD_SYSTEMS.MIR;
    default:
      return CARD_SYSTEMS.MASTERCARD;
  }
};

// Скрытие чувствительных данных
export const maskSensitiveData = (data, visibleChars = 4) => {
  if (!data) return '';
  
  const str = data.toString();
  if (str.length <= visibleChars * 2) {
    return '*'.repeat(str.length);
  }
  
  const firstVisible = str.slice(0, visibleChars);
  const lastVisible = str.slice(-visibleChars);
  const maskedLength = str.length - visibleChars * 2;
  
  return `${firstVisible}${'*'.repeat(maskedLength)}${lastVisible}`;
};