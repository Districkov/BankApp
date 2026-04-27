import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import IconButton from '../../src/components/IconButton';
import { ThemeProvider } from '../../src/context/ThemeContext';

const renderWithTheme = (ui) => render(<ThemeProvider>{ui}</ThemeProvider>);

describe('IconButton', () => {
  it('должен отображать текст кнопки', () => {
    renderWithTheme(
      <IconButton icon={<span>icon</span>} label="Главная" onClick={() => {}} />
    );
    expect(screen.getByText('Главная')).toBeInTheDocument();
  });

  it('должен вызывать onClick при нажатии', () => {
    const mockClick = jest.fn();
    renderWithTheme(
      <IconButton icon={<span>icon</span>} label="Главная" onClick={mockClick} />
    );
    fireEvent.click(screen.getByText('Главная'));
    expect(mockClick).toHaveBeenCalledTimes(1);
  });

  it('должен отображать иконку', () => {
    renderWithTheme(
      <IconButton icon={<span data-testid="custom-icon">icon</span>} label="Главная" onClick={() => {}} />
    );
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('должен отображать разные кнопки', () => {
    renderWithTheme(
      <IconButton icon={<span>icon</span>} label="Настройки" onClick={() => {}} />
    );
    expect(screen.getByText('Настройки')).toBeInTheDocument();
  });
});
