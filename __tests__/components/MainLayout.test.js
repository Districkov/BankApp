import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MainLayout from '../../src/components/MainLayout';

// Mock useRouter
jest.mock('next/router', () => ({
  useRouter: () => ({
    pathname: '/main/home',
    push: jest.fn(),
  }),
}));

describe('MainLayout', () => {
  it('renders children correctly', () => {
    render(
      <MainLayout>
        <div>Test Content</div>
      </MainLayout>
    );
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders bottom navigation', () => {
    render(
      <MainLayout>
        <div>Content</div>
      </MainLayout>
    );
    
    // Проверяем наличие навигационных элементов
    expect(screen.getByText('Главная')).toBeInTheDocument();
    expect(screen.getByText('Операции')).toBeInTheDocument();
    expect(screen.getByText('Платежи')).toBeInTheDocument();
    expect(screen.getByText('Ещё')).toBeInTheDocument();
  });

  it('highlights active navigation item', () => {
    render(
      <MainLayout>
        <div>Content</div>
      </MainLayout>
    );
    
    const homeButton = screen.getByText('Главная').closest('button');
    expect(homeButton).toHaveClass('text-primary');
  });
});
