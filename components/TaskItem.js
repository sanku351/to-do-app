import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TaskItem({ task, onToggleStatus, onEdit, onDelete }) {
  const reminderDate = task.reminderTime
    ? new Date(task.reminderTime.seconds * 1000) 
    : null;

  return (
    <View style={[
      styles.container, 
      task.completed ? styles.completedContainer : null
    ]}>
      <TouchableOpacity 
        style={styles.checkbox} 
        onPress={onToggleStatus}
      >
        <Ionicons 
          name={task.completed ? "checkmark-circle" : "ellipse-outline"} 
          size={24} 
          color={task.completed ? "#4CAF50" : "#4A90E2"} 
        />
      </TouchableOpacity>
      
      <View style={styles.content}>
        <Text style={[
          styles.title, 
          task.completed ? styles.completedText : null
        ]}>
          {task.title}
        </Text>
        
        {task.description ? (
          <Text style={[
            styles.description, 
            task.completed ? styles.completedText : null
          ]}>
            {task.description}
          </Text>
        ) : null}
        
        {reminderDate ? (
          <View style={styles.reminderContainer}>
            <Ionicons name="time-outline" size={14} color="#888" />
            <Text style={styles.reminderText}>
              {reminderDate.toLocaleString()}
            </Text>
          </View>
        ) : null}
      </View>
      
      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={onEdit}
        >
          <Ionicons name="pencil-outline" size={20} color="#4A90E2" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={onDelete}
        >
          <Ionicons name="trash-outline" size={20} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  completedContainer: {
    backgroundColor: '#f9f9f9',
  },
  checkbox: {
    marginRight: 10,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  reminderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  reminderText: {
    fontSize: 12,
    color: '#888',
    marginLeft: 4,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 5,
    marginLeft: 5,
  },
});