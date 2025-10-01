import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: 'studio-4185006276-c9a8a',
  appId: '1:818248571629:web:e00b85d0ae4031ee578ae4',
  apiKey: 'AIzaSyCOchAhYDrFnISXJT3aNfL-dAnRq1qXL3M',
  authDomain: 'studio-4185006276-c9a8a.firebaseapp.com',
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
