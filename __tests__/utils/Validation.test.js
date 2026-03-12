import {
  validateEmail,
  validatePhone,
  validatePassword,
  validateName,
  validateCode,
  getValidationErrors,
  formatPhone,
} from '../../src/utils/Validation';

describe('validateEmail', () => {
  it('должен принимать корректный email', () => {
    expect(validateEmail('test@example.com')).toBe(true);
    expect(validateEmail('user.name@domain.ru')).toBe(true);
    expect(validateEmail('test+tag@example.co.uk')).toBe(true);
  });

  it('должен отклонять некорректный email', () => {
    expect(validateEmail('invalid')).toBe(false);
    expect(validateEmail('test@')).toBe(false);
    expect(validateEmail('@example.com')).toBe(false);
    expect(validateEmail('')).toBe(false);
    expect(validateEmail('test@.com')).toBe(false);
  });
});

describe('validatePhone', () => {
  it('должен принимать корректный номер', () => {
    expect(validatePhone('79991234567')).toBe(true);
    expect(validatePhone('89991234567')).toBe(true);
  });

  it('должен отклонять некорректный номер', () => {
    expect(validatePhone('12345')).toBe(false);
    expect(validatePhone('7999123456')).toBe(false);
    expect(validatePhone('')).toBe(false);
    expect(validatePhone('799912345678')).toBe(false);
  });

  it('должен очищать нецифровые символы', () => {
    expect(validatePhone('+7 (999) 123-45-67')).toBe(true);
    expect(validatePhone('+7-999-123-45-67')).toBe(true);
  });
});

describe('validatePassword', () => {
  it('должен принимать пароль от 6 символов', () => {
    expect(validatePassword('123456')).toBe(true);
    expect(validatePassword('password')).toBe(true);
    expect(validatePassword('123456789')).toBe(true);
  });

  it('должен отклонять пароль короче 6 символов', () => {
    expect(validatePassword('12345')).toBe(false);
    expect(validatePassword('')).toBe(false);
    expect(validatePassword('abc')).toBe(false);
  });
});

describe('validateName', () => {
  it('должен принимать корректное имя', () => {
    expect(validateName('Иван')).toBe(true);
    expect(validateName('John')).toBe(true);
    expect(validateName('Анна-Мария')).toBe(true);
    expect(validateName('Сергей Иванович')).toBe(true);
  });

  it('должен отклонять имя короче 2 символов', () => {
    expect(validateName('А')).toBe(false);
    expect(validateName('')).toBe(false);
  });

  it('должен отклонять имена с цифрами', () => {
    expect(validateName('Иван123')).toBe(false);
    expect(validateName('123')).toBe(false);
  });

  it('должен отклонять имена со спецсимволами', () => {
    expect(validateName('Иван@')).toBe(false);
    expect(validateName('Иван#')).toBe(false);
  });
});

describe('validateCode', () => {
  it('должен принимать 6-значный код', () => {
    expect(validateCode('123456')).toBe(true);
    expect(validateCode('000000')).toBe(true);
    expect(validateCode('999999')).toBe(true);
  });

  it('должен отклонять нецифровой код', () => {
    expect(validateCode('12345a')).toBe(false);
    expect(validateCode('abcdef')).toBe(false);
    expect(validateCode('12345!')).toBe(false);
  });

  it('должен отклонять код не из 6 цифр', () => {
    expect(validateCode('12345')).toBe(false);
    expect(validateCode('1234567')).toBe(false);
    expect(validateCode('1234')).toBe(false);
  });
});

describe('formatPhone', () => {
  it('должен форматировать номер с кодом 7', () => {
    expect(formatPhone('79991234567')).toBe('+7 (999) 123-45-67');
    expect(formatPhone('79991234567')).toBe('+7 (999) 123-45-67');
  });

  it('должен форматировать номер с кодом 8', () => {
    expect(formatPhone('89991234567')).toBe('+7 (999) 123-45-67');
  });

  it('должен форматировать номер с форматированием', () => {
    expect(formatPhone('+7 999 123 45 67')).toBe('+7 (999) 123-45-67');
    expect(formatPhone('+7-999-123-45-67')).toBe('+7 (999) 123-45-67');
  });

  it('должен обрабатывать частичный номер', () => {
    expect(formatPhone('799912')).toBe('+7 (999) 12');
    expect(formatPhone('79991234')).toBe('+7 (999) 123-4');
  });
});

describe('getValidationErrors', () => {
  describe('step = register', () => {
    it('должен отклонить пустую форму', () => {
      const errors = getValidationErrors({}, 'register');
      expect(errors.firstName).toBeDefined();
      expect(errors.lastName).toBeDefined();
      expect(errors.phone).toBeDefined();
      expect(errors.email).toBeDefined();
      expect(errors.password).toBeDefined();
    });

    it('должен проверить совпадение паролей', () => {
      const errors = getValidationErrors({
        firstName: 'Иван',
        lastName: 'Иванов',
        phone: '79991234567',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password124',
      }, 'register');
      expect(errors.confirmPassword).toBeDefined();
    });

    it('должен принять корректную регистрацию', () => {
      const errors = getValidationErrors({
        firstName: 'Иван',
        lastName: 'Иванов',
        phone: '79991234567',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      }, 'register');
      expect(Object.keys(errors).length).toBe(0);
    });
  });

  describe('step = login', () => {
    it('должен отклонить пустой логин', () => {
      const errors = getValidationErrors({}, 'login');
      expect(errors.login).toBeDefined();
    });

    it('должен проверить корректность email при входе', () => {
      const errors = getValidationErrors({
        email: 'invalid',
        password: 'password',
      }, 'login');
      expect(errors.email).toBeDefined();
    });

    it('должен принять вход с телефоном', () => {
      const errors = getValidationErrors({
        phone: '79991234567',
        password: 'password',
      }, 'login');
      expect(errors.phone).toBeUndefined();
    });

    it('должен принять вход с email', () => {
      const errors = getValidationErrors({
        email: 'test@example.com',
        password: 'password',
      }, 'login');
      expect(errors.email).toBeUndefined();
    });
  });

  describe('step = forgot', () => {
    it('должен проверить номер телефона при восстановлении', () => {
      const errors = getValidationErrors({
        phone: 'invalid',
      }, 'forgot');
      expect(errors.phone).toBeDefined();
    });

    it('должен принять корректный номер при восстановлении', () => {
      const errors = getValidationErrors({
        phone: '79991234567',
      }, 'forgot');
      expect(errors.phone).toBeUndefined();
    });
  });
});
