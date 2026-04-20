import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TransferPhone from '../../../pages/transfers/phone';
import { transfersAPI } from '../../../src/utils/api';

// Mock dependencies
jest.mock('next/router', () => ({
  useRouter: () => ({
    query: {},
    push: jest.fn(),
    back: jest.fn(),
  }),
}));

jest.mock('../../../src/utils/api', () => ({
  accountsAPI: {
    getAccounts: jest.fn(() => Promise.resolve([
      { id: '1', name: 'Основной счёт', balance: 22717.98 }
    ])),
  },
  contactsAPI: {
    getContacts: jest.fn(() => Promise.resolve([])),
  },
  transfersAPI: {
    transferToPhone: jest.fn(),
  },
}));

describe('TransferPhone', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders transfer form', async () => {
    render(<TransferPhone />);
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText('+7 (___) ___-__-__')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('0')).toBeInTheDocument();
    });
  });

  it('validates phone number format', async () => {
    render(<TransferPhone />);
    
    await waitFor(() => {
      const phoneInput = screen.getByPlaceholderText('+7 (___) ___-__-__');
      const submitButton = screen.getByText(/Перевести/);
      
      fireEvent.change(phoneInput, { target: { value: '123' } });
      fireEvent.click(submitButton);
      
      expect(screen.getByText('Неверный номер')).toBeInTheDocument();
    });
  });

  it('validates amount', async () => {
    render(<TransferPhone />);
    
    await waitFor(() => {
      const phoneInput = screen.getByPlaceholderText('+7 (___) ___-__-__');
      const amountInput = screen.getByPlaceholderText('0');
      const submitButton = screen.getByText(/Перевести/);
      
      fireEvent.change(phoneInput, { target: { value: '79001234567' } });
      fireEvent.change(amountInput, { target: { value: '0' } });
      fireEvent.click(submitButton);
      
      expect(screen.getByText('Введите сумму > 0')).toBeInTheDocument();
    });
  });

  it('submits valid transfer', async () => {
    const mockPush = jest.fn();
    jest.spyOn(require('next/router'), 'useRouter').mockReturnValue({
      query: {},
      push: mockPush,
      back: jest.fn(),
    });

    transfersAPI.transferToPhone.mockResolvedValue({ success: true });

    render(<TransferPhone />);
    
    await waitFor(() => {
      const phoneInput = screen.getByPlaceholderText('+7 (___) ___-__-__');
      const amountInput = screen.getByPlaceholderText('0');
      const submitButton = screen.getByText(/Перевести/);
      
      fireEvent.change(phoneInput, { target: { value: '79001234567' } });
      fireEvent.change(amountInput, { target: { value: '1000' } });
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(transfersAPI.transferToPhone).toHaveBeenCalledWith({
        phone: '79001234567',
        amount: 1000,
        message: ''
      });
    });
  });

  it('handles antifraud error', async () => {
    const mockPush = jest.fn();
    jest.spyOn(require('next/router'), 'useRouter').mockReturnValue({
      query: {},
      push: mockPush,
      back: jest.fn(),
    });

    transfersAPI.transferToPhone.mockRejectedValue({
      status: 403,
      message: 'Превышен дневной лимит'
    });

    render(<TransferPhone />);
    
    await waitFor(() => {
      const phoneInput = screen.getByPlaceholderText('+7 (___) ___-__-__');
      const amountInput = screen.getByPlaceholderText('0');
      const submitButton = screen.getByText(/Перевести/);
      
      fireEvent.change(phoneInput, { target: { value: '79001234567' } });
      fireEvent.change(amountInput, { target: { value: '1000' } });
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining('/main/failed')
      );
    });
  });
});
