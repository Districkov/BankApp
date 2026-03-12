import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TransactionItem from '../../src/components/TransactionItem';

describe('TransactionItem', () => {
  const mockTransaction = {
    title: 'Перевод',
    date: '15 мар. 2024',
    amount: '-1 000 ₽',
    type: 'expense',
  };

  it('должен отображать данные транзакции', () => {
    const { getByText } = render(
      <TransactionItem transaction={mockTransaction} onPress={() => {}} />
    );
    expect(getByText('Перевод')).toBeTruthy();
    expect(getByText('15 мар. 2024')).toBeTruthy();
    expect(getByText('-1 000 ₽')).toBeTruthy();
  });

  it('должен вызывать onPress при нажатии', () => {
    const mockPress = jest.fn();
    const { getByText } = render(
      <TransactionItem transaction={mockTransaction} onPress={mockPress} />
    );
    
    fireEvent.press(getByText('Перевод'));
    expect(mockPress).toHaveBeenCalledTimes(1);
  });

  it('должен работать с типом income', () => {
    const incomeTransaction = { ...mockTransaction, type: 'income', amount: '+5 000 ₽' };
    const { getByText } = render(
      <TransactionItem transaction={incomeTransaction} onPress={() => {}} />
    );
    expect(getByText('+5 000 ₽')).toBeTruthy();
  });

  it('должен работать с типом transfer', () => {
    const transferTransaction = { ...mockTransaction, type: 'transfer' };
    const { getByText } = render(
      <TransactionItem transaction={transferTransaction} onPress={() => {}} />
    );
    expect(getByText('Перевод')).toBeTruthy();
  });

  it('должен отображать правильные цвета для expense', () => {
    const { getByText } = render(
      <TransactionItem transaction={mockTransaction} onPress={() => {}} />
    );
    const amountElement = getByText('-1 000 ₽');
    expect(amountElement.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ color: '#FF3B30' })
      ])
    );
  });

  it('должен отображать правильные цвета для income', () => {
    const incomeTransaction = { ...mockTransaction, type: 'income', amount: '+5 000 ₽' };
    const { getByText } = render(
      <TransactionItem transaction={incomeTransaction} onPress={() => {}} />
    );
    const amountElement = getByText('+5 000 ₽');
    expect(amountElement.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ color: '#159E3A' })
      ])
    );
  });
});
