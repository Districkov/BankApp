import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '../../../pages/main/home';
import { accountsAPI, userAPI } from '../../../src/utils/api';
import { ThemeProvider } from '../../../src/context/ThemeContext';

jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
}));

jest.mock('next/link', () => {
  return ({ children, href }) => <a href={href}>{children}</a>;
});

jest.mock('../../../src/utils/api', () => ({
  accountsAPI: {
    getAccounts: jest.fn(),
    getAccountHistory: jest.fn(),
  },
  userAPI: {
    getProfile: jest.fn(),
  },
}));

const renderWithTheme = (ui) => render(<ThemeProvider>{ui}</ThemeProvider>);

describe('Home Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('displays loading state initially', () => {
    accountsAPI.getAccounts.mockReturnValue(new Promise(() => {}));
    accountsAPI.getAccountHistory.mockReturnValue(new Promise(() => {}));
    userAPI.getProfile.mockReturnValue(new Promise(() => {}));

    renderWithTheme(<Home />);
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('displays user first name after loading', async () => {
    const mockUser = { first_name: 'Иван', last_name: 'Иванов' };
    const mockAccounts = [
      { id: '1', balance: 10000, currency: { currencyCode: 'RUB', symbol: '₽' } },
    ];

    userAPI.getProfile.mockResolvedValue(mockUser);
    accountsAPI.getAccounts.mockResolvedValue(mockAccounts);
    accountsAPI.getAccountHistory.mockResolvedValue([]);

    renderWithTheme(<Home />);

    await waitFor(() => {
      expect(screen.getByText('Иван')).toBeInTheDocument();
    });
  });

  it('displays partners section', async () => {
    userAPI.getProfile.mockResolvedValue({ first_name: 'Test' });
    accountsAPI.getAccounts.mockResolvedValue([]);
    accountsAPI.getAccountHistory.mockResolvedValue([]);

    renderWithTheme(<Home />);

    await waitFor(() => {
      expect(screen.getByText('Наши партнёры')).toBeInTheDocument();
      expect(screen.getByText('Astra RP')).toBeInTheDocument();
      expect(screen.getByText('Yanima')).toBeInTheDocument();
    });
  });

  it('calculates monthly expenses for selected account', async () => {
    const mockTransactions = [
      { amountChange: -1000, createdAt: new Date().toISOString() },
      { amountChange: -2000, createdAt: new Date().toISOString() },
    ];
    const mockAccounts = [
      { id: '1', balance: 10000, currency: { currencyCode: 'RUB', symbol: '₽' } },
    ];

    userAPI.getProfile.mockResolvedValue({ first_name: 'Test' });
    accountsAPI.getAccounts.mockResolvedValue(mockAccounts);
    accountsAPI.getAccountHistory.mockResolvedValue(mockTransactions);

    renderWithTheme(<Home />);

    await waitFor(() => {
      expect(screen.getByText(/3 000,00/)).toBeInTheDocument();
    });
  });
});
