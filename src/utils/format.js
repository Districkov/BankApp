// Форматирование денежных сумм
export const formatAmount = (amount, currency = '₽') => {
  if (typeof amount !== 'number') {
    amount = parseFloat(amount) || 0;
  }
  return `${amount.toLocaleString('ru-RU').replace(/\u00A0/g, ' ')} ${currency}`;
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

  if (format === 'standard') {
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    });
  }

  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  });
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
