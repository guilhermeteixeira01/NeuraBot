// src/services/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCvz5o4wmsoK4ostTeRcy_rTMh4A_sjmtQ",
  authDomain: "neurabot-dashboard.firebaseapp.com",
  projectId: "neurabot-dashboard",
  storageBucket: "neurabot-dashboard.firebasestorage.app",
  messagingSenderId: "556445022573",
  appId: "1:556445022573:web:2839edb463a5b4d7e28264",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
