import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

/**
 * Header - компонент заголовка с мемоизацией
 * Предотвращает ненужные перерендеры
 */
const Header = ({ name, onPress }) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onPress} style={styles.touchable}>
        <Text style={styles.name}>{name}</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
    </View>
  );
};

export default React.memo(Header);

const styles = StyleSheet.create({
  header: {
    paddingTop: 18,
    paddingHorizontal: 16,
    backgroundColor: '#F7F7FB',
  },
  name: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0B0B0B',
  },
  touchable: {
    paddingVertical: 8,
  },
  separator: {
    height: 12,
  },
});