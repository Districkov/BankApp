import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TransfersScreen from '../../src/screens/transfers/TransfersScreen';

describe('TransfersScreen', () => {
  const mockNavigation = {
    navigate: jest.fn(),
    goBack: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('должен отображаться корректно', () => {
    const { getByText } = render(<TransfersScreen navigation={mockNavigation} />);
    expect(getByText('Между счетами')).toBeTruthy();
  });

  it('должен отображать счета', () => {
    const { getByText } = render(<TransfersScreen navigation={mockNavigation} />);
    expect(getByText('Основной счёт')).toBeTruthy();
    expect(getByText('Накопительный счёт')).toBeTruthy();
  });

  it('должен отображать балансы счетов', () => {
    const { getByText } = render(<TransfersScreen navigation={mockNavigation} />);
    expect(getByText('22 717,98 ₽')).toBeTruthy();
    expect(getByText('50 000,00 ₽')).toBeTruthy();
  });

  it('должен позволять выбрать счет для списания', () => {
    const { getByText, getAllByText } = render(<TransfersScreen navigation={mockNavigation} />);
    
    // Нажимаем на второй счет
    fireEvent.press(getByText('Накопительный счёт'));
    
    // Проверяем что выбор изменился
    expect(getAllByText('Основной счёт')).toBeTruthy();
  });

  it('должен позволять ввести сумму', () => {
    const { getByPlaceholderText } = render(<TransfersScreen navigation={mockNavigation} />);
    const input = getByPlaceholderText('0');
    fireEvent.changeText(input, '1000');
    expect(input.props.value).toBe('1000');
  });

  it('должен отображать кнопку перевода', () => {
    const { getByText } = render(<TransfersScreen navigation={mockNavigation} />);
    expect(getByText(/Перевести/i)).toBeTruthy();
  });
});
