import {
  formatAmount,
  formatPhoneNumber,
  formatDate,
  maskSensitiveData,
} from '../../src/utils/format';

describe('formatAmount', () => {
  it('должен форматировать число с символом рубля', () => {
    expect(formatAmount(1000)).toBe('1 000 ₽');
  });

  it('должен форматировать строковое число', () => {
    expect(formatAmount('5000')).toBe('5 000 ₽');
  });

  it('должен использовать другую валюту', () => {
    expect(formatAmount(100, '$')).toBe('100 $');
  });

  it('должен возвращать 0 ₽ для некорректных данных', () => {
    expect(formatAmount(null)).toBe('0 ₽');
    expect(formatAmount(undefined)).toBe('0 ₽');
    expect(formatAmount('abc')).toBe('0 ₽');
  });

  it('должен форматировать большие числа', () => {
    expect(formatAmount(1000000)).toBe('1 000 000 ₽');
  });

  it('должен форматировать числа с копейками', () => {
    expect(formatAmount(1234.56)).toBe('1 234,56 ₽');
  });
});

describe('formatPhoneNumber', () => {
  it('должен форматировать российский номер', () => {
    expect(formatPhoneNumber('79991234567')).toBe('+7 (999) 123-45-67');
  });

  it('должен возвращать пустую строку для null', () => {
    expect(formatPhoneNumber(null)).toBe('');
  });

  it('должен возвращать очищенный номер для коротких номеров', () => {
    expect(formatPhoneNumber('12345')).toBe('12345');
  });

  it('должен обрабатывать номер с 8', () => {
    expect(formatPhoneNumber('89991234567')).toBe('+7 (999) 123-45-67');
  });
});

describe('formatDate', () => {
  it('должен форматировать дату в коротком формате', () => {
    const date = '2024-03-15T10:00:00Z';
    const result = formatDate(date, 'short');
    expect(result).toMatch(/\d{1,2} [а-яА-Я]{3,9}/);
  });

  it('должен форматировать дату в длинном формате', () => {
    const date = '2024-03-15T10:00:00Z';
    const result = formatDate(date, 'long');
    expect(result).toMatch(/\d{1,2} [а-яА-Я]{3,9} \d{4}/);
  });

  it('должен форматировать дату в стандартном формате', () => {
    const date = '2024-03-15T10:00:00Z';
    const result = formatDate(date, 'standard');
    expect(result).toMatch(/\d{1,2}\.\d{1,2}\.\d{4}/);
  });
});

describe('maskSensitiveData', () => {
  it('должен скрывать среднюю часть данных', () => {
    expect(maskSensitiveData('1234567890123456')).toBe('1234********3456');
  });

  it('должен возвращать пустую строку для null', () => {
    expect(maskSensitiveData(null)).toBe('');
  });

  it('должен скрывать все данные если строка короткая', () => {
    expect(maskSensitiveData('1234')).toBe('****');
  });

  it('должен скрывать данные с разным количеством видимых символов', () => {
    expect(maskSensitiveData('123456789', 2)).toBe('12*****89');
  });
});
