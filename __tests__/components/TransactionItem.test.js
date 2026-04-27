import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TransactionItem from '../../src/components/TransactionItem';
import { ThemeProvider } from '../../src/context/ThemeContext';

const renderWithTheme = (ui) => render(<ThemeProvider>{ui}</ThemeProvider>);

describe('TransactionItem', () => {
  const mockTransaction = {
    title: 'Перевод',
    date: '15 мар. 2024',
    amount: '-1 000 ₽',
    type: 'expense',
  };

  it('должен отображать данные транзакции', () => {
    renderWithTheme(
      <TransactionItem transaction={mockTransaction} onClick={() => {}} />
    );
    expect(screen.getByText('Перевод')).toBeInTheDocument();
    expect(screen.getByText('15 мар. 2024')).toBeInTheDocument();
    expect(screen.getByText('-1 000 ₽')).toBeInTheDocument();
  });

  it('должен вызывать onClick при нажатии', () => {
    const mockClick = jest.fn();
    renderWithTheme(
      <TransactionItem transaction={mockTransaction} onClick={mockClick} />
    );
    fireEvent.click(screen.getByText('Перевод'));
    expect(mockClick).toHaveBeenCalledTimes(1);
  });

  it('должен работать с типом income', () => {
    const incomeTransaction = { ...mockTransaction, type: 'income', amount: '+5 000 ₽' };
    renderWithTheme(
      <TransactionItem transaction={incomeTransaction} onClick={() => {}} />
    );
    expect(screen.getByText('+5 000 ₽')).toBeInTheDocument();
  });

  it('должен работать с типом transfer', () => {
    const transferTransaction = { ...mockTransaction, type: 'transfer' };
    renderWithTheme(
      <TransactionItem transaction={transferTransaction} onClick={() => {}} />
    );
    expect(screen.getByText('Перевод')).toBeInTheDocument();
  });
});
