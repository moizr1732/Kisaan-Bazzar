import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCOchAhYDrFnISXJT3aNfL-dAnRq1qXL3M",
  authDomain: "studio-4185006276-c9a8a.firebaseapp.com",
  projectId: "studio-4185006276-c9a8a",
  storageBucket: "studio-4185006276-c9a8a.appspot.com",
  messagingSenderId: "818248571629",
  appId: "1:818248571629:web:e00b85d0ae4031ee578ae4"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
