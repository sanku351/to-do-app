// HomeScreen.js
import React, { useState, useCallback } from 'react';
import {
  StyleSheet, Text, View, FlatList,
  TouchableOpacity, Alert
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import {
  collection, query, where, orderBy,
  onSnapshot, doc, updateDoc, deleteDoc
} from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { db, auth } from '../firebase/config';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import TaskItem from '../components/TaskItem';

export default function HomeScreen({ navigation }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('dateAdded'); // or 'scheduledDate'

  // Re‑subscribe every time screen gains focus
  useFocusEffect(
    useCallback(() => {
      const userId = auth.currentUser.uid;
      const tasksRef = collection(db, 'tasks');

      const q = query(
        tasksRef,
        where('userId', '==', userId),
        orderBy(sortBy === 'dateAdded' ? 'createdAt' : 'scheduledDate', 'asc')
      );

      const unsubscribe = onSnapshot(
        q,
        { includeMetadataChanges: true },
        snapshot => {
          const list = [];
          snapshot.forEach(doc => {
            list.push({ id: doc.id, ...doc.data() });
          });
          setTasks(list);
          setLoading(false);
        },
        error => {
          console.error('Error fetching tasks: ', error);
          Alert.alert('Error', 'Failed to load tasks');
          setLoading(false);
        }
      );

      return () => unsubscribe();
    }, [sortBy])
  );

  // Schedule push notifications for reminders
  const registerForPushNotificationsAsync = async () => {
    const { status: existing } = await Notifications.getPermissionsAsync();
    let finalStatus = existing;
    if (existing !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      Alert.alert('Warning', 'Notifications permission not granted');
    }
  };

  const scheduleNotification = async task => {
    const when = new Date(task.reminderTime.seconds * 1000);
    if (when > new Date()) {
      await Notifications.scheduleNotificationAsync({
        content: { title: 'Task Reminder', body: task.title },
        trigger: when
      });
    }
  };

  // Toggle complete status
  const toggleTaskStatus = async (id, current) => {
    try {
      const ref = doc(db, 'tasks', id);
      await updateDoc(ref, { completed: !current });
    } catch (e) {
      console.error('Error updating task:', e);
      Alert.alert('Error', 'Failed to update task status');
    }
  };

  // Delete
  const deleteTask = async id => {
    try {
      await deleteDoc(doc(db, 'tasks', id));
    } catch (e) {
      console.error('Error deleting task:', e);
      Alert.alert('Error', 'Failed to delete task');
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error('Error signing out:', e);
      Alert.alert('Error', 'Failed to sign out');
    }
  };

  // Sort toggle
  const toggleSortMethod = () => {
    setSortBy(prev => (prev === 'dateAdded' ? 'scheduledDate' : 'dateAdded'));
  };

  // Request permissions on mount
  React.useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.sortButton} onPress={toggleSortMethod}>
          <Text style={styles.sortButtonText}>
            Sort by: {sortBy === 'dateAdded' ? 'Date Added' : 'Scheduled Date'}
          </Text>
          <Ionicons name="swap-vertical" size={20} color="#4A90E2" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#4A90E2" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text>Loading tasks...</Text>
        </View>
      ) : tasks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No tasks yet</Text>
          <Text style={styles.emptySubText}>Add a task to get started</Text>
        </View>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TaskItem
              task={item}
              onToggleStatus={() => toggleTaskStatus(item.id, item.completed)}
              onEdit={() => navigation.navigate('EditTask', { task: item })}
              onDelete={() => deleteTask(item.id)}
            />
          )}
          contentContainerStyle={styles.listContainer}
        />
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddTask')}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#e0e0e0'
  },
  sortButton: { flexDirection: 'row', alignItems: 'center' },
  sortButtonText: { marginRight: 5, color: '#4A90E2', fontWeight: '500' },
  logoutButton: { padding: 5 },
  listContainer: { paddingHorizontal: 16, paddingTop: 10, paddingBottom: 80 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 18, fontWeight: 'bold', color: '#555' },
  emptySubText: { fontSize: 14, color: '#888', marginTop: 8 },
  addButton: {
    position: 'absolute', bottom: 20, right: 20, width: 60, height: 60,
    borderRadius: 30, backgroundColor: '#4A90E2', justifyContent: 'center',
    alignItems: 'center', elevation: 5, shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 3
  }
});
