import '@testing-library/react-native/extend-expect';

// Моки для Expo модулей
jest.mock('expo-linear-gradient', () => {
  const { View } = require('react-native');
  return { LinearGradient: View };
});

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn().mockResolvedValue(null),
    setItem: jest.fn().mockResolvedValue(undefined),
    removeItem: jest.fn().mockResolvedValue(undefined),
    multiGet: jest.fn().mockResolvedValue([]),
    multiSet: jest.fn().mockResolvedValue(undefined),
    clear: jest.fn().mockResolvedValue(undefined),
  },
}));

// Подавить известные warnings от React Native / Animated
const originalError = console.error;
const originalWarn = console.warn;
const warningsToIgnore = [
  'An update to ForwardRef inside a test was not wrapped in act',
  'ReferenceError: You are trying to `import` a file after the Jest environment',
  'is not a valid icon name',
  'Non-serializable values were found in the navigation state',
  'ViewPropTypes will be removed',
];

// Переопределяем console.error сразу, без использования beforeAll
const newError = (...args) => {
  const message = typeof args[0] === 'string' ? args[0].toString() : '';
  // Проверяем, нужно ли подавить это сообщение
  for (const warning of warningsToIgnore) {
    if (message.includes(warning)) {
      return; // Подавляем это сообщение полностью
    }
  }
  originalError.call(console, ...args);
};

// Переопределяем console.warn сразу
const newWarn = (...args) => {
  const message = typeof args[0] === 'string' ? args[0].toString() : '';
  // Проверяем, нужно ли подавить это сообщение
  for (const warning of warningsToIgnore) {
    if (message.includes(warning)) {
      return; // Подавляем это сообщение полностью
    }
  }
  originalWarn.call(console, ...args);
};

// Устанавливаем переопределенные функции
Object.defineProperty(console, 'error', {
  configurable: true,
  value: newError,
});

Object.defineProperty(console, 'warn', {
  configurable: true,
  value: newWarn,
});

// Cleanup after all tests
afterAll(() => {
  Object.defineProperty(console, 'error', {
    configurable: true,
    value: originalError,
  });
  Object.defineProperty(console, 'warn', {
    configurable: true,
    value: originalWarn,
  });
});
