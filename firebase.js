import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyCVJ7BH9qfaWnSSAoRki-buWrk-qBqITMQ',
  authDomain: 'social-mixer-31ea7.firebaseapp.com',
  projectId: 'social-mixer-31ea7',
  storageBucket: 'social-mixer-31ea7.appspot.com',
  messagingSenderId: '784968674817',
  appId: '1:784968674817:web:b8b2e721eafa38974a9a00',
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const storage = getStorage();

export { app, db, storage };
