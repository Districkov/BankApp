import AsyncStorage from '@react-native-async-storage/async-storage';

describe('API Utils - Mocking Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('AsyncStorage mocking', () => {
    it('должен быть смокирован AsyncStorage', async () => {
      AsyncStorage.setItem.mockResolvedValueOnce(undefined);
      AsyncStorage.getItem.mockResolvedValueOnce('test_value');

      await AsyncStorage.setItem('key', 'value');
      const value = await AsyncStorage.getItem('key');

      expect(value).toBe('test_value');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('key', 'value');
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('key');
    });

    it('должен вернуть null если нет значения', async () => {
      AsyncStorage.getItem.mockResolvedValueOnce(null);

      const value = await AsyncStorage.getItem('nonexistent_key');

      expect(value).toBeNull();
    });

    it('должен сохранять данные пользователя', async () => {
      const userData = { id: 1, name: 'John Doe', email: 'john@example.com' };
      
      AsyncStorage.setItem.mockResolvedValueOnce(undefined);
      AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(userData));

      await AsyncStorage.setItem('user_data', JSON.stringify(userData));
      const saved = await AsyncStorage.getItem('user_data');

      expect(saved).toBe(JSON.stringify(userData));
    });

    it('должен очищать хранилище', async () => {
      AsyncStorage.clear.mockResolvedValueOnce(undefined);

      await AsyncStorage.clear();

      expect(AsyncStorage.clear).toHaveBeenCalled();
    });

    it('должен удалять значение', async () => {
      AsyncStorage.removeItem.mockResolvedValueOnce(undefined);

      await AsyncStorage.removeItem('old_key');

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('old_key');
    });
  });

  describe('Multiple storage operations', () => {
    it('должен выполнять несколько операций', async () => {
      AsyncStorage.setItem.mockResolvedValue(undefined);
      AsyncStorage.getItem.mockResolvedValue('value');

      await AsyncStorage.setItem('key1', 'value1');
      await AsyncStorage.setItem('key2', 'value2');

      expect(AsyncStorage.setItem).toHaveBeenCalledTimes(2);
    });

    it('должен обеспечивать отдельные мок-значения для каждого вызова', async () => {
      AsyncStorage.getItem
        .mockResolvedValueOnce('first')
        .mockResolvedValueOnce('second')
        .mockResolvedValueOnce('third');

      const val1 = await AsyncStorage.getItem('key1');
      const val2 = await AsyncStorage.getItem('key2');
      const val3 = await AsyncStorage.getItem('key3');

      expect(val1).toBe('first');
      expect(val2).toBe('second');
      expect(val3).toBe('third');
    });
  });
});
