import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

/**
 * IconButton - переиспользуемая кнопка с иконкой
 * Мемоизирован для оптимизации перерендеров
 */
const IconButton = ({ icon, label, onPress, style, testID }) => {
  return (
    <TouchableOpacity 
      testID={testID} 
      style={[styles.button, style]} 
      onPress={onPress}
      accessibilityLabel={label}
    >
      <View style={styles.circleBackground}>{icon}</View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

export default React.memo(IconButton);

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    width: 80,
  },
  circleBackground: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F0EEFD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    marginTop: 8,
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
});