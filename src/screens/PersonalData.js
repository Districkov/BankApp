import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PersonalData({ navigation }) {
  const [userData, setUserData] = useState({
    firstName: 'Иван',
    lastName: 'Иванов',
    email: 'ivan@example.com',
    phone: '+7 (999) 123-45-67',
    birthDate: '15.05.1990'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({...userData});

  const handleSave = () => {
    // Валидация данных
    if (!editedData.firstName.trim() || !editedData.lastName.trim()) {
      Alert.alert('Ошибка', 'Имя и фамилия обязательны для заполнения');
      return;
    }

    if (!editedData.email.includes('@')) {
      Alert.alert('Ошибка', 'Введите корректный email');
      return;
    }

    setUserData({...editedData});
    setIsEditing(false);
    Alert.alert('Успешно', 'Данные сохранены');
  };

  const handleCancel = () => {
    setEditedData({...userData});
    setIsEditing(false);
  };

  const handleEdit = () => {
    setEditedData({...userData});
    setIsEditing(true);
  };

  const fields = [
    {
      key: 'firstName',
      label: 'Имя',
      placeholder: 'Введите имя',
      icon: 'person-outline'
    },
    {
      key: 'lastName',
      label: 'Фамилия',
      placeholder: 'Введите фамилию',
      icon: 'person-outline'
    },
    {
      key: 'email',
      label: 'Email',
      placeholder: 'Введите email',
      icon: 'mail-outline',
      keyboardType: 'email-address'
    },
    {
      key: 'phone',
      label: 'Телефон',
      placeholder: 'Введите телефон',
      icon: 'call-outline',
      keyboardType: 'phone-pad'
    },
    {
      key: 'birthDate',
      label: 'Дата рождения',
      placeholder: 'ДД.ММ.ГГГГ',
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
        <TouchableOpacity onPress={isEditing ? handleCancel : handleEdit}>
          <Text style={styles.editButton}>
            {isEditing ? 'Отмена' : 'Редактировать'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Profile Photo Section */}
        <View style={styles.photoSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {userData.firstName[0]}{userData.lastName[0]}
            </Text>
          </View>
          {isEditing && (
            <TouchableOpacity style={styles.changePhotoButton}>
              <Text style={styles.changePhotoText}>Сменить фото</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Personal Data Form */}
        <View style={styles.formSection}>
          {fields.map((field, index) => (
            <View key={field.key} style={styles.field}>
              <Text style={styles.fieldLabel}>{field.label}</Text>
              <View style={styles.inputContainer}>
                <Ionicons 
                  name={field.icon} 
                  size={20} 
                  color="#666" 
                  style={styles.inputIcon}
                />
                {isEditing ? (
                  <TextInput
                    style={styles.input}
                    value={editedData[field.key]}
                    onChangeText={(text) => setEditedData({
                      ...editedData,
                      [field.key]: text
                    })}
                    placeholder={field.placeholder}
                    placeholderTextColor="#999"
                    editable={isEditing}
                    keyboardType={field.keyboardType || 'default'}
                  />
                ) : (
                  <Text style={styles.displayText}>
                    {userData[field.key]}
                  </Text>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Save Button */}
        {isEditing && (
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Сохранить изменения</Text>
          </TouchableOpacity>
        )}

        {/* Additional Info */}
        {!isEditing && (
          <View style={styles.infoSection}>
            <View style={styles.infoCard}>
              <Ionicons name="information-circle-outline" size={20} color="#666" />
              <Text style={styles.infoText}>
                Для изменения данных нажмите кнопку "Редактировать"
              </Text>
            </View>
          </View>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#F7F7FB'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5'
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000'
  },
  editButton: {
    fontSize: 16,
    color: '#6A2EE8',
    fontWeight: '500'
  },
  container: {
    flex: 1,
  },
  photoSection: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#6A2EE8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
  },
  changePhotoButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F0EBFF',
    borderRadius: 20,
  },
  changePhotoText: {
    color: '#6A2EE8',
    fontSize: 14,
    fontWeight: '500',
  },
  formSection: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  field: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: '#F7F7FB',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    paddingVertical: 14,
  },
  displayText: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    paddingVertical: 14,
  },
  saveButton: {
    backgroundColor: '#6A2EE8',
    marginHorizontal: 16,
    marginTop: 24,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoSection: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F0F0F0',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  bottomSpacer: {
    height: 20,
  },
});