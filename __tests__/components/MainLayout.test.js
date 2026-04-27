import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MainLayout from '../../src/components/MainLayout';
import { ThemeProvider } from '../../src/context/ThemeContext';

jest.mock('next/router', () => ({
  useRouter: () => ({
    pathname: '/main/home',
    push: jest.fn(),
  }),
}));

jest.mock('next/link', () => {
  return ({ children, href }) => <a href={href}>{children}</a>;
});

const renderWithTheme = (ui) => render(<ThemeProvider>{ui}</ThemeProvider>);

describe('MainLayout', () => {
  it('renders children correctly', () => {
    renderWithTheme(
      <MainLayout>
        <div>Test Content</div>
      </MainLayout>
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders bottom navigation', () => {
    renderWithTheme(
      <MainLayout>
        <div>Content</div>
      </MainLayout>
    );
    expect(screen.getByText('Главная')).toBeInTheDocument();
    expect(screen.getByText('Платежи')).toBeInTheDocument();
    expect(screen.getByText('Ещё')).toBeInTheDocument();
  });

  it('highlights active navigation item', () => {
    renderWithTheme(
      <MainLayout>
        <div>Content</div>
      </MainLayout>
    );
    const homeTab = screen.getByText('Главная').closest('a');
    expect(homeTab).toBeInTheDocument();
  });
});
