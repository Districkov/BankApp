import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Header from '../../src/components/Header';

describe('Header', () => {
  it('должен отображать имя', () => {
    const { getByText } = render(<Header name="Иван" onPress={() => {}} />);
    expect(getByText('Иван')).toBeTruthy();
  });

  it('должен вызывать onPress при нажатии', () => {
    const mockPress = jest.fn();
    const { getByText } = render(<Header name="Иван" onPress={mockPress} />);
    
    fireEvent.press(getByText('Иван'));
    expect(mockPress).toHaveBeenCalledTimes(1);
  });

  it('должен иметь правильный заголовок', () => {
    const { getByText } = render(<Header name="Добро пожаловать" onPress={() => {}} />);
    expect(getByText('Добро пожаловать')).toBeTruthy();
  });
});
