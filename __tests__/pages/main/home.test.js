import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '../../../pages/main/home';
import { accountsAPI, userAPI, transactionsAPI } from '../../../src/utils/api';

// Mock dependencies
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock('../../../src/utils/api', () => ({
  accountsAPI: {
    getAccounts: jest.fn(),
  },
  userAPI: {
    getProfile: jest.fn(),
  },
  transactionsAPI: {
    getTransactions: jest.fn(),
  },
}));

describe('Home Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('displays loading state initially', () => {
    accountsAPI.getAccounts.mockReturnValue(new Promise(() => {}));
    userAPI.getProfile.mockReturnValue(new Promise(() => {}));
    transactionsAPI.getTransactions.mockReturnValue(new Promise(() => {}));

    render(<Home />);
    
    expect(screen.getByRole('status', { hidden: true })).toBeInTheDocument();
  });

  it('displays user data after loading', async () => {
    const mockUser = { first_name: 'Иван', last_name: 'Иванов' };
    const mockAccounts = [
      { id: '1', balance: 10000 },
      { id: '2', balance: 20000 }
    ];

    userAPI.getProfile.mockResolvedValue(mockUser);
    accountsAPI.getAccounts.mockResolvedValue(mockAccounts);
    transactionsAPI.getTransactions.mockResolvedValue([]);

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText('Иван')).toBeInTheDocument();
    });
  });

  it('calculates total balance correctly', async () => {
    const mockAccounts = [
      { id: '1', balance: 10000.50 },
      { id: '2', balance: 20000.75 }
    ];

    userAPI.getProfile.mockResolvedValue({ first_name: 'Test' });
    accountsAPI.getAccounts.mockResolvedValue(mockAccounts);
    transactionsAPI.getTransactions.mockResolvedValue([]);

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText(/30 001,25 ₽/)).toBeInTheDocument();
    });
  });

  it('displays partners section', async () => {
    userAPI.getProfile.mockResolvedValue({ first_name: 'Test' });
    accountsAPI.getAccounts.mockResolvedValue([]);
    transactionsAPI.getTransactions.mockResolvedValue([]);

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText('Наши партнёры')).toBeInTheDocument();
      expect(screen.getByText('Astra RP')).toBeInTheDocument();
      expect(screen.getByText('Yanima')).toBeInTheDocument();
    });
  });

  it('calculates monthly expenses', async () => {
    const mockTransactions = [
      { amount: -1000, date: new Date().toISOString() },
      { amount: -2000, date: new Date().toISOString() }
    ];

    userAPI.getProfile.mockResolvedValue({ first_name: 'Test' });
    accountsAPI.getAccounts.mockResolvedValue([]);
    transactionsAPI.getTransactions.mockResolvedValue(mockTransactions);

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText(/3 000,00 ₽/)).toBeInTheDocument();
    });
  });
});
