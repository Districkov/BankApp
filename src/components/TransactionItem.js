import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TransactionItem = ({ transaction, onPress }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'income':
        return { name: 'arrow-down', color: '#159E3A', bgColor: '#E8F5E8' };
      case 'expense':
        return { name: 'arrow-up', color: '#FF3B30', bgColor: '#FFE5E5' };
      default:
        return { name: 'swap-horizontal', color: '#6A2EE8', bgColor: '#F0EBFF' };
    }
  };

  const icon = getIcon(transaction.type);

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={[styles.iconContainer, { backgroundColor: icon.bgColor }]}>
        <Ionicons name={icon.name} size={20} color={icon.color} />
      </View>
      <View style={styles.info}>
        <Text style={styles.title}>{transaction.title}</Text>
        <Text style={styles.date}>{transaction.date}</Text>
      </View>
      <Text style={[
        styles.amount,
        transaction.type === 'income' ? styles.income : styles.expense
      ]}>
        {transaction.amount}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
  },
  income: {
    color: '#159E3A',
  },
  expense: {
    color: '#FF3B30',
  },
});

export default TransactionItem;