import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function SuccessScreen({ navigation, route }) {
  const { amount, type = 'перевод' } = route.params || {};
  const [secondsLeft, setSecondsLeft] = useState(6);
  const [showContent, setShowContent] = useState(false);

  // Анимационные значения
  const expandAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const contentFadeAnim = useRef(new Animated.Value(0)).current;
  const staticIconFadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Последовательность анимаций
    Animated.sequence([
      // Быстрое исчезновение галочки и расширение круга
      Animated.parallel([
        // Галочка быстро исчезает
        Animated.timing(staticIconFadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        // Круг расширяется
        Animated.timing(expandAnim, {
          toValue: 1,
          duration: 350, // Уменьшил до 350ms
          useNativeDriver: true,
        }),
      ]),
      // Исчезновение круга и появление контента одновременно
      Animated.parallel([
        // Круг исчезает
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        // Контент появляется
        Animated.timing(contentFadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        })
      ])
    ]).start(() => {
      setShowContent(true);
    });

    // Таймер для отсчета секунд
    const countdownTimer = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(countdownTimer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Автоматическое закрытие через 6 секунд
    const closeTimer = setTimeout(() => {
      navigation.replace('Main');
    }, 6000);

    return () => {
      clearTimeout(closeTimer);
      clearInterval(countdownTimer);
    };
  }, [navigation, expandAnim, fadeAnim, contentFadeAnim, staticIconFadeAnim]);

  // Интерполяции для анимации расширения круга
  const expandScale = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 25]
  });

  // Круг полностью исчезает
  const circleOpacity = fadeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1]
  });

  // Галочка быстро исчезает в начале
  const staticIconOpacity = staticIconFadeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1]
  });

  // Интерполяции для появления контента
  const contentOpacity = contentFadeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1]
  });

  const contentScale = contentFadeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 1]
  });

  return (
    <View style={styles.container}>
      {/* Статичная галочка (быстро исчезает в начале анимации) */}
      <Animated.View 
        style={[
          styles.staticIcon,
          {
            opacity: staticIconOpacity
          }
        ]}
      >
        <Ionicons name="checkmark" size={48} color="#fff" />
      </Animated.View>

      {/* Анимированный расширяющийся зеленый круг */}
      <Animated.View 
        style={[
          styles.expandingCircle,
          {
            opacity: circleOpacity,
            transform: [{ scale: expandScale }]
          }
        ]}
      />

      {/* Контент (появляется через 350ms) */}
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: contentOpacity,
            transform: [{ scale: contentScale }]
          }
        ]}
      >
        <View style={styles.successIcon}>
          <Ionicons name="checkmark" size={48} color="#fff" />
        </View>
        
        <Text style={styles.successTitle}>Успешно!</Text>
        
        <Text style={styles.successText}>
          {type} на сумму{'\n'}
          <Text style={styles.amountText}>{amount} ₽</Text>{'\n'}
          выполнен успешно
        </Text>

        <TouchableOpacity 
          style={styles.closeButton}
          onPress={() => navigation.replace('Main')}
        >
          <Text style={styles.closeButtonText}>Закрыть</Text>
        </TouchableOpacity>

        <Text style={styles.autoCloseText}>
          Автоматически закроется через {secondsLeft} {secondsLeft === 1 ? 'секунду' : secondsLeft < 5 ? 'секунды' : 'секунд'}
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F7FB',
  },
  // Статичная галочка (центр экрана) - быстро исчезает
  staticIcon: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#159E3A',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  // Расширяющийся зеленый круг (полностью исчезает)
  expandingCircle: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#159E3A',
    zIndex: 15,
  },
  // Контент с БЕЛЫМ фоном
  content: {
    backgroundColor: '#fff',
    marginHorizontal: 24,
    padding: 32,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    zIndex: 25,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#159E3A',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    marginBottom: 16,
    textAlign: 'center',
  },
  successText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  amountText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#159E3A',
  },
  closeButton: {
    backgroundColor: '#6A2EE8',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  autoCloseText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});