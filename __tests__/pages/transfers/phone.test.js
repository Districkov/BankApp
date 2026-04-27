import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TransferPhone from '../../../pages/transfers/phone';
import { transfersAPI, accountsAPI } from '../../../src/utils/api';
import { ThemeProvider } from '../../../src/context/ThemeContext';

jest.mock('next/router', () => ({
  useRouter: () => ({
    query: {},
    push: jest.fn(),
    back: jest.fn(),
  }),
}));

jest.mock('next/link', () => {
  return ({ children, href }) => <a href={href}>{children}</a>;
});

jest.mock('../../../src/utils/api', () => ({
  accountsAPI: {
    getAccounts: jest.fn(() => Promise.resolve([
      { id: '1', balance: 22717.98, currency: { currencyCode: 'RUB', symbol: '₽' } }
    ])),
    getAccountHistory: jest.fn(() => Promise.resolve([])),
  },
  transfersAPI: {
    transferToPhone: jest.fn(),
  },
  userAPI: {
    getProfile: jest.fn(),
  },
}));

const renderWithTheme = (ui) => render(<ThemeProvider>{ui}</ThemeProvider>);

describe('TransferPhone', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders transfer form', async () => {
    renderWithTheme(<TransferPhone />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('+7 ___ ___-__-__')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('0.00')).toBeInTheDocument();
    });
  });

  it('disables submit button when form is invalid', async () => {
    renderWithTheme(<TransferPhone />);

    await waitFor(() => {
      expect(screen.getByText('Перевести')).toBeDisabled();
    });
  });

  it('enables submit button when form is valid', async () => {
    renderWithTheme(<TransferPhone />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('+7 ___ ___-__-__')).toBeInTheDocument();
    });

    const phoneInput = screen.getByPlaceholderText('+7 ___ ___-__-__');
    fireEvent.change(phoneInput, { target: { value: '79001234567' } });

    const amountInput = screen.getByPlaceholderText('0.00');
    fireEvent.change(amountInput, { target: { value: '1000' } });

    await waitFor(() => {
      expect(screen.getByText('Перевести')).not.toBeDisabled();
    });
  });

  it('calls transferToPhone on valid form submit', async () => {
    transfersAPI.transferToPhone.mockResolvedValue({ success: true });

    renderWithTheme(<TransferPhone />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('+7 ___ ___-__-__')).toBeInTheDocument();
    });

    const phoneInput = screen.getByPlaceholderText('+7 ___ ___-__-__');
    fireEvent.change(phoneInput, { target: { value: '79001234567' } });

    const amountInput = screen.getByPlaceholderText('0.00');
    fireEvent.change(amountInput, { target: { value: '1000' } });

    const submitButton = screen.getByText('Перевести');
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(transfersAPI.transferToPhone).toHaveBeenCalledWith({
        phone: '79001234567',
        amount: 1000,
        message: '',
      });
    });
  });

  it('shows account balance from loaded accounts', async () => {
    renderWithTheme(<TransferPhone />);

    await waitFor(() => {
      expect(screen.getAllByText(/22 717,98/).length).toBeGreaterThan(0);
    });
  });
});
