import { 
  get, 
  post, 
  transfersAPI, 
  accountsAPI 
} from '../../src/utils/api';

// Mock fetch
global.fetch = jest.fn();

describe('API Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('get', () => {
    it('makes GET request with correct headers', async () => {
      const mockResponse = { data: 'test' };
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await get('/api/test', '/endpoint');

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/test/endpoint',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('handles 403 error', async () => {
      global.fetch.mockResolvedValue({
        ok: false,
        status: 403,
        json: async () => ({ message: 'Forbidden' }),
      });

      await expect(get('/api/test', '/endpoint')).rejects.toEqual({
        status: 403,
        message: 'Forbidden',
      });
    });
  });

  describe('post', () => {
    it('makes POST request with body', async () => {
      const mockResponse = { success: true };
      const requestBody = { amount: 1000 };
      
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await post('/api/test', '/endpoint', requestBody);

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/test/endpoint',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(requestBody),
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('transfersAPI', () => {
    it('transferToPhone sends correct data', async () => {
      const mockResponse = { transaction_id: 'tx_123' };
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const transferData = {
        phone: '79001234567',
        amount: 5000,
        message: 'Test'
      };

      const result = await transfersAPI.transferToPhone(transferData);

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/transfers/transfers/phone',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(transferData),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('handles antifraud rejection', async () => {
      global.fetch.mockResolvedValue({
        ok: false,
        status: 403,
        json: async () => ({ message: 'Превышен дневной лимит' }),
      });

      await expect(
        transfersAPI.transferToPhone({
          phone: '79001234567',
          amount: 1000000,
          message: ''
        })
      ).rejects.toEqual({
        status: 403,
        message: 'Превышен дневной лимит',
      });
    });
  });

  describe('accountsAPI', () => {
    it('getAccounts returns account list', async () => {
      const mockAccounts = [
        { id: '1', name: 'Основной', balance: 10000 },
        { id: '2', name: 'Накопительный', balance: 50000 }
      ];
      
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => mockAccounts,
      });

      const result = await accountsAPI.getAccounts();

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/accounts/accounts',
        expect.any(Object)
      );
      expect(result).toEqual(mockAccounts);
    });
  });
});
