import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';

/**
 * LoadingSpinner - простой спиннер загрузки
 */
export const LoadingSpinner = ({ size = 'large', color = '#6A2EE8', message }) => (
  <View style={styles.container}>
    <ActivityIndicator size={size} color={color} />
    {message && <Text style={styles.text}>{message}</Text>}
  </View>
);

/**
 * SkeletonPlaceholder - плейсхолдер для загружающихся данных
 */
export const SkeletonPlaceholder = ({ width = '100%', height = 16, style }) => (
  <View
    style={[
      styles.skeleton,
      {
        width,
        height,
      },
      style,
    ]}
  />
);

/**
 * CardSkeleton - скелет для карточки данных
 */
export const CardSkeleton = () => (
  <View style={styles.cardSkeleton}>
    <View style={styles.skeletonRow}>
      <SkeletonPlaceholder width={60} height={60} style={styles.skeletonAvatar} />
      <View style={{ flex: 1 }}>
        <SkeletonPlaceholder width="60%" height={16} style={{ marginBottom: 8 }} />
        <SkeletonPlaceholder width="40%" height={14} />
      </View>
    </View>
    <SkeletonPlaceholder width="100%" height={1} style={styles.separator} />
    <SkeletonPlaceholder width="30%" height={14} style={{ marginBottom: 8 }} />
    <SkeletonPlaceholder width="50%" height={18} />
  </View>
);

/**
 * ListItemSkeleton - скелет для элемента списка
 */
export const ListItemSkeleton = () => (
  <View style={styles.listItemSkeleton}>
    <SkeletonPlaceholder width={40} height={40} style={styles.skeletonIcon} />
    <View style={{ flex: 1 }}>
      <SkeletonPlaceholder width="70%" height={16} style={{ marginBottom: 6 }} />
      <SkeletonPlaceholder width="50%" height={12} />
    </View>
  </View>
);

/**
 * EmptyState - экран пустого состояния
 */
export const EmptyState = ({ icon, title, message, actionButton, style }) => (
  <View style={[styles.emptyContainer, style]}>
    {icon && <Text style={styles.emptyIcon}>{icon}</Text>}
    <Text style={styles.emptyTitle}>{title}</Text>
    {message && <Text style={styles.emptyMessage}>{message}</Text>}
    {actionButton}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  text: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  skeleton: {
    backgroundColor: '#E8E8E8',
    borderRadius: 4,
  },
  cardSkeleton: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  skeletonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  skeletonAvatar: {
    borderRadius: 30,
    marginRight: 12,
  },
  separator: {
    marginVertical: 12,
  },
  listItemSkeleton: {
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  skeletonIcon: {
    borderRadius: 20,
    marginRight: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
});
