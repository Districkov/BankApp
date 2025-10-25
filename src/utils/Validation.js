// src/utils/Validation.js
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const cleanPhone = phone.replace(/\D/g, '');
  return cleanPhone.length === 11 && (cleanPhone.startsWith('7') || cleanPhone.startsWith('8'));
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validateName = (name) => {
  return name.length >= 2 && /^[a-zA-Zа-яА-ЯёЁ\s-]+$/.test(name);
};

export const validateCode = (code) => {
  return code.length === 6 && /^\d+$/.test(code);
};

export const getValidationErrors = (formData, step = 'register') => {
  const errors = {};

  if (step === 'register') {
    if (!formData.firstName || !validateName(formData.firstName)) {
      errors.firstName = 'Введите корректное имя (минимум 2 буквы)';
    }
    
    if (!formData.lastName || !validateName(formData.lastName)) {
      errors.lastName = 'Введите корректную фамилию (минимум 2 буквы)';
    }
    
    if (!formData.phone || !validatePhone(formData.phone)) {
      errors.phone = 'Введите корректный номер телефона';
    }
    
    if (!formData.email || !validateEmail(formData.email)) {
      errors.email = 'Введите корректный email';
    }
    
    if (!formData.password || !validatePassword(formData.password)) {
      errors.password = 'Пароль должен содержать минимум 6 символов';
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Пароли не совпадают';
    }
  }

  if (step === 'login') {
    if (!formData.phone && !formData.email) {
      errors.login = 'Введите телефон или email';
    } else if (formData.phone && !validatePhone(formData.phone)) {
      errors.phone = 'Введите корректный номер телефона';
    } else if (formData.email && !validateEmail(formData.email)) {
      errors.email = 'Введите корректный email';
    }
    
    if (!formData.password) {
      errors.password = 'Введите пароль';
    }
  }

  if (step === 'forgot') {
    if (!formData.phone || !validatePhone(formData.phone)) {
      errors.phone = 'Введите корректный номер телефона';
    }
  }

  return errors;
};

// Форматирование телефона
export const formatPhone = (text) => {
  const clean = text.replace(/\D/g, '');
  
  if (clean.startsWith('7') || clean.startsWith('8')) {
    const numbers = clean.substring(1);
    let result = '+7 (';
    
    if (numbers.length > 0) {
      result += numbers.substring(0, 3);
    }
    if (numbers.length > 3) {
      result += ') ' + numbers.substring(3, 6);
    }
    if (numbers.length > 6) {
      result += '-' + numbers.substring(6, 8);
    }
    if (numbers.length > 8) {
      result += '-' + numbers.substring(8, 10);
    }
    return result;
  }
  
  return text;
};