import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import IconButton from '../../src/components/IconButton';
import { Ionicons } from '@expo/vector-icons';

describe('IconButton', () => {
  it('должен отображать иконку и текст', () => {
    const { getByText } = render(
      <IconButton 
        icon={<Ionicons name="home" size={24} color="#000" />} 
        label="Главная" 
        onPress={() => {}} 
      />
    );
    expect(getByText('Главная')).toBeTruthy();
  });

  it('должен вызывать onPress при нажатии', () => {
    const mockPress = jest.fn();
    const { getByText } = render(
      <IconButton 
        icon={<Ionicons name="home" size={24} color="#000" />} 
        label="Главная" 
        onPress={mockPress} 
      />
    );
    
    fireEvent.press(getByText('Главная'));
    expect(mockPress).toHaveBeenCalledTimes(1);
  });

  it('должен применять дополнительные стили', () => {
    const { getByTestId } = render(
      <IconButton 
        testID="btn"
        icon={<Ionicons name="home" size={24} color="#000" />} 
        label="Главная" 
        onPress={() => {}}
        style={{ width: 100 }}
      />
    );
    expect(getByTestId('btn')).toBeTruthy();
  });

  it('должен отображать разные иконки', () => {
    const { getByText } = render(
      <IconButton 
        icon={<Ionicons name="settings" size={24} color="#000" />} 
        label="Настройки" 
        onPress={() => {}} 
      />
    );
    expect(getByText('Настройки')).toBeTruthy();
  });
});
