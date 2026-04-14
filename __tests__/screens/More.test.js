import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import More from '../../src/screens/profile/More';
import * as api from '../../src/utils/api';

// Мокаем API
jest.mock('../../src/utils/api', () => ({
  accountsAPI: {
    getAccounts: jest.fn(),
  },
}));

describe('More Screen', () => {
  const mockNavigation = {
    navigate: jest.fn(),
  };

  const mockAccounts = {
    accounts: [
      { id: '1', name: 'Основной счёт', balance: 27466.16 },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    api.accountsAPI.getAccounts.mockResolvedValue(mockAccounts);
  });

  it('должен отображаться корректно', async () => {
    const { getByText } = render(<More navigation={mockNavigation} />);
    await waitFor(() => {
      expect(getByText('Ещё')).toBeTruthy();
    });
  });

  it('должен отображать профиль пользователя', async () => {
    const { getByText } = render(<More navigation={mockNavigation} />);
    await waitFor(() => {
      expect(getByText('Пользователь')).toBeTruthy();
    });
  });

  it('должен отображать контактную информацию', async () => {
    const { getByText } = render(<More navigation={mockNavigation} />);
    await waitFor(() => {
      expect(getByText('Телефон не указан')).toBeTruthy();
      expect(getByText('Email не указан')).toBeTruthy();
    });
  });

  it('должен отображать баланс', async () => {
    const { getByText } = render(<More navigation={mockNavigation} />);
    await waitFor(() => {
      expect(getByText('27 466,16 ₽')).toBeTruthy();
    });
  });

  it('должен переходить к настройкам при нажатии на профиль', async () => {
    const { getByText } = render(<More navigation={mockNavigation} />);
    await waitFor(() => {
      fireEvent.press(getByText('Пользователь'));
      expect(mockNavigation.navigate).toHaveBeenCalledWith('Settings');
    });
  });

  it('должен отображать раздел Аккаунт', async () => {
    const { getByText } = render(<More navigation={mockNavigation} />);
    await waitFor(() => {
      expect(getByText('Аккаунт')).toBeTruthy();
    });
  });

  it('должен отображать раздел Помощь', async () => {
    const { getByText } = render(<More navigation={mockNavigation} />);
    await waitFor(() => {
      expect(getByText('Помощь')).toBeTruthy();
    });
  });

  it('должен переходить к истории операций', async () => {
    const { getByText } = render(<More navigation={mockNavigation} />);
    await waitFor(() => {
      fireEvent.press(getByText('История операций'));
      expect(mockNavigation.navigate).toHaveBeenCalledWith('TransactionHistory');
    });
  });

  it('должен переходить в службу поддержки', async () => {
    const { getByText } = render(<More navigation={mockNavigation} />);
    await waitFor(() => {
      fireEvent.press(getByText('Служба поддержки'));
      expect(mockNavigation.navigate).toHaveBeenCalledWith('Support');
    });
  });

  it('должен отображать кнопку выхода', async () => {
    const { getByText } = render(<More navigation={mockNavigation} />);
    await waitFor(() => {
      expect(getByText('Выйти')).toBeTruthy();
    });
  });
});

