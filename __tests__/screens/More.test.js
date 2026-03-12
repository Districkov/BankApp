import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import More from '../../src/screens/profile/More';

describe('More Screen', () => {
  const mockNavigation = {
    navigate: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('должен отображаться корректно', () => {
    const { getByText } = render(<More navigation={mockNavigation} />);
    expect(getByText('Ещё')).toBeTruthy();
  });

  it('должен отображать профиль пользователя', () => {
    const { getByText } = render(<More navigation={mockNavigation} />);
    expect(getByText('Иван')).toBeTruthy();
  });

  it('должен отображать контактную информацию', () => {
    const { getByText } = render(<More navigation={mockNavigation} />);
    expect(getByText('+7 926 718-55-52')).toBeTruthy();
    expect(getByText('ert34vh@gmail.com')).toBeTruthy();
  });

  it('должен отображать баланс', () => {
    const { getByText } = render(<More navigation={mockNavigation} />);
    expect(getByText('27 466,16 ₽')).toBeTruthy();
  });

  it('должен переходить к настройкам при нажатии на профиль', () => {
    const { getByText } = render(<More navigation={mockNavigation} />);
    fireEvent.press(getByText('Иван'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Settings');
  });

  it('должен отображать раздел Аккаунт', () => {
    const { getByText } = render(<More navigation={mockNavigation} />);
    expect(getByText('Аккаунт')).toBeTruthy();
  });

  it('должен отображать раздел Помощь', () => {
    const { getByText } = render(<More navigation={mockNavigation} />);
    expect(getByText('Помощь')).toBeTruthy();
  });

  it('должен переходить к истории операций', () => {
    const { getByText } = render(<More navigation={mockNavigation} />);
    fireEvent.press(getByText('История операций'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('TransactionHistory');
  });

  it('должен переходить в службу поддержки', () => {
    const { getByText } = render(<More navigation={mockNavigation} />);
    fireEvent.press(getByText('Служба поддержки'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Support');
  });

  it('должен отображать кнопку выхода', () => {
    const { getByText } = render(<More navigation={mockNavigation} />);
    expect(getByText('Выйти')).toBeTruthy();
  });
});
