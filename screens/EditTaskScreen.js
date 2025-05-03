import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Ionicons } from '@expo/vector-icons';

export default function EditTaskScreen({ route, navigation }) {
  const { task } = route.params;

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [reminderTime, setReminderTime] = useState(
    task.reminderTime ? new Date(task.reminderTime.seconds * 1000) : null
  );
  const [loading, setLoading] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setReminderTime(date);
    hideDatePicker();
  };

  const onUpdateTask = async () => {
    if (title.trim() === '') {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    try {
      setLoading(true);
      const taskRef = doc(db, 'tasks', task.id);

      await updateDoc(taskRef, {
        title,
        description,
        reminderTime: reminderTime,
        scheduledDate: reminderTime || task.createdAt,
      });

      setLoading(false);
      navigation.goBack();
    } catch (error) {
      setLoading(false);
      console.error("Error updating task: ", error);
      Alert.alert('Error', 'Failed to update task');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.label}>Task Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter task title"
            value={title}
            onChangeText={setTitle}
          />

          <Text style={styles.label}>Description (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter task description"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />

          <Text style={styles.label}>Reminder (Optional)</Text>
          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={showDatePicker}
          >
            <Text
              style={[
                styles.datePickerButtonText,
                { color: reminderTime ? '#333' : '#999' }
              ]}
            >
              {reminderTime ? reminderTime.toLocaleString() : 'Set reminder time'}
            </Text>
            <Ionicons name="calendar-outline" size={20} color="#4A90E2" />
          </TouchableOpacity>

          {reminderTime && (
            <TouchableOpacity
              style={styles.clearDateButton}
              onPress={() => setReminderTime(null)}
            >
              <Text style={styles.clearDateButtonText}>Clear reminder</Text>
            </TouchableOpacity>
          )}

          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="datetime"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
            minimumDate={new Date()}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={onUpdateTask}
            disabled={loading}
          >
            <Text style={styles.buttonText}>{loading ? 'Updating...' : 'Update Task'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  formContainer: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 12,
    marginBottom: 10,
  },
  datePickerButtonText: {
    fontSize: 16,
    // color: '#333',
  },
  clearDateButton: {
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  clearDateButtonText: {
    color: '#FF3B30',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#4A90E2',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});