import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDfD-stk5XxRARd_O3-f_M3RoNVnqwOq9A",
  authDomain: "mira-385911.firebaseapp.com",
  projectId: "mira-385911",
  storageBucket: "mira-385911.firebasestorage.app",
  messagingSenderId: "246143914453",
  appId: "1:246143914453:web:b4f2d385b648f411792d5c",
  measurementId: "G-EKMED6TJFF"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); 