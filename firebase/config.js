// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import {  initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from "@react-native-async-storage/async-storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBQzAmOJMRJYcY-A_qzxMm1afbBAnr3VI4",
  authDomain: "todo-app-2894d.firebaseapp.com",
  projectId: "todo-app-2894d",
  storageBucket: "todo-app-2894d.firebasestorage.app",
  messagingSenderId: "555005922852",
  appId: "1:555005922852:web:a1a3662f21feeb252f12b1",
  measurementId: "G-1932K0SF4L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});