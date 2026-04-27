import { 
  get, 
  post, 
  transfersAPI, 
  accountsAPI 
} from '../../src/utils/api';

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
    it('transferBetweenAccounts uses POST /own', async () => {
      const mockResponse = { transaction_id: 'tx_123' };
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await transfersAPI.transferBetweenAccounts({
        fromAccountId: 'acc1',
        toAccountId: 'acc2',
        amount: 5000,
      });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/own'),
        expect.objectContaining({
          method: 'POST',
        })
      );
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
        expect.stringContaining('/api/accounts/v1'),
        expect.any(Object)
      );
      expect(result).toEqual(mockAccounts);
    });
  });
});
