import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';

export default function PersonalData({ navigation }) {
  const { user } = useAuth();

  // Получаем данные пользователя из AuthContext
  const firstName = user?.firstName || user?.name || 'Не указано';
  const lastName = user?.lastName || '';
  const email = user?.email || 'Не указано';
  const phone = user?.phone || 'Не указано';
  const birthDate = user?.birthDate || 'Не указано';
  const initials = `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase() || firstName[0].toUpperCase();

  const fields = [
    {
      key: 'firstName',
      label: 'Имя',
      value: firstName,
      icon: 'person-outline'
    },
    {
      key: 'lastName',
      label: 'Фамилия',
      value: lastName || 'Не указано',
      icon: 'person-outline'
    },
    {
      key: 'email',
      label: 'Email',
      value: email,
      icon: 'mail-outline'
    },
    {
      key: 'phone',
      label: 'Телефон',
      value: phone,
      icon: 'call-outline'
    },
    {
      key: 'birthDate',
      label: 'Дата рождения',
      value: birthDate,
      icon: 'calendar-outline'
    }
  ];

  return (
    <View style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Личная информация</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Profile Photo Section */}
        <View style={styles.photoSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {initials}
            </Text>
          </View>
        </View>

        {/* Personal Data Display */}
        <View style={styles.formSection}>
          {fields.map((field, index) => (
            <View key={field.key} style={styles.field}>
              <Text style={styles.fieldLabel}>{field.label}</Text>
              <View style={styles.dataContainer}>
                <Ionicons
                  name={field.icon}
                  size={20}
                  color="#666"
                  style={styles.dataIcon}
                />
                <Text style={styles.dataText}>
                  {field.value}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#F8FAFD'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F5'
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  container: {
    flex: 1,
  },
  photoSection: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#6A2EE8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '700',
  },
  formSection: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  field: {
    marginBottom: 24,
  },
  fieldLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontWeight: '600',
  },
  dataContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0F0F5',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#F8FAFD',
  },
  dataIcon: {
    marginRight: 12,
  },
  dataText: {
    flex: 1,
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  bottomSpacer: {
    height: 30,
  },
});