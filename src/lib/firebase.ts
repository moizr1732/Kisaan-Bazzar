// Suggested code may be subject to a license. Learn more: ~LicenseLog:299203630.
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  "projectId": "studio-4185006276-c9a8a",
  "appId": "1:818248571629:web:e00b85d0ae4031ee578ae4",
  "apiKey": "AIzaSyCOchAhYDrFnISXJT3aNfL-dAnRq1qXL3M",
  "authDomain": "studio-4185006276-c9a8a.firebaseapp.com",
  "storageBucket": "studio-4185006276-c9a8a.appspot.com",
  "messagingSenderId": "818248571629",
  "measurementId": "G-5G3W84K7C1"
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
const auth = getAuth(app);
const db = getFirestore(app);

export { app, analytics, auth, db };
