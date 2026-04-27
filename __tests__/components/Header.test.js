import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from '../../src/components/Header';
import { ThemeProvider } from '../../src/context/ThemeContext';

const renderWithTheme = (ui) => render(<ThemeProvider>{ui}</ThemeProvider>);

describe('Header', () => {
  it('должен отображать имя', () => {
    renderWithTheme(<Header name="Иван" onClick={() => {}} />);
    expect(screen.getByText('Иван')).toBeInTheDocument();
  });

  it('должен вызывать onClick при нажатии', () => {
    const mockClick = jest.fn();
    renderWithTheme(<Header name="Иван" onClick={mockClick} />);
    fireEvent.click(screen.getByText('Иван'));
    expect(mockClick).toHaveBeenCalledTimes(1);
  });

  it('должен иметь правильный заголовок', () => {
    renderWithTheme(<Header name="Добро пожаловать" onClick={() => {}} />);
    expect(screen.getByText('Добро пожаловать')).toBeInTheDocument();
  });
});
