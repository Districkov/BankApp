import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import TransfersScreen from '../../src/screens/transfers/TransfersScreen';
import * as api from '../../src/utils/api';

// Мокаем API
jest.mock('../../src/utils/api', () => ({
  accountsAPI: {
    getAccounts: jest.fn(),
  },
  transfersAPI: {
    transferBetweenAccounts: jest.fn(),
  },
}));

describe('TransfersScreen', () => {
  const mockNavigation = {
    navigate: jest.fn(),
    goBack: jest.fn(),
  };

  const mockAccounts = {
    accounts: [
      {
        id: 'account1',
        name: 'Основной счёт',
        balance: 22717.98,
        color: '#6A2EE8',
      },
      {
        id: 'account2',
        name: 'Накопительный счёт',
        balance: 50000.00,
        color: '#159E3A',
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    api.accountsAPI.getAccounts.mockResolvedValue(mockAccounts);
  });

  it('должен отображаться корректно', async () => {
    const { getByText } = render(<TransfersScreen navigation={mockNavigation} />);
    
    await waitFor(() => {
      expect(getByText('Между счетами')).toBeTruthy();
    });
  });

  it('должен отображать счета', async () => {
    const { getAllByText } = render(<TransfersScreen navigation={mockNavigation} />);
    
    await waitFor(() => {
      expect(getAllByText('Основной счёт').length).toBeGreaterThan(0);
      expect(getAllByText('Накопительный счёт').length).toBeGreaterThan(0);
    });
  });

  it('должен отображать балансы счетов', async () => {
    const { getAllByText } = render(<TransfersScreen navigation={mockNavigation} />);
    
    await waitFor(() => {
      expect(getAllByText('22 717,98 ₽').length).toBeGreaterThan(0);
      expect(getAllByText('50 000,00 ₽').length).toBeGreaterThan(0);
    });
  });

  it('должен позволять выбрать счет для списания', async () => {
    const { getAllByText } = render(<TransfersScreen navigation={mockNavigation} />);

    await waitFor(() => {
      const accountButtons = getAllByText('Накопительный счёт');
      fireEvent.press(accountButtons[0]);
      expect(getAllByText('Основной счёт').length).toBeGreaterThan(0);
    });
  });

  it('должен позволять ввести сумму', async () => {
    const { getByPlaceholderText } = render(<TransfersScreen navigation={mockNavigation} />);
    
    await waitFor(() => {
      const input = getByPlaceholderText('0');
      fireEvent.changeText(input, '1000');
      expect(input.props.value).toBe('1000');
    });
  });

  it('должен отображать кнопку перевода', async () => {
    const { getByText } = render(<TransfersScreen navigation={mockNavigation} />);
    
    await waitFor(() => {
      expect(getByText(/Перевести/i)).toBeTruthy();
    });
  });
});

