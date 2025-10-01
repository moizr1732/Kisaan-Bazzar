"use client";

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import type { UserProfile } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<any>;
  signup: (email: string, pass: string) => Promise<any>;
  logout: () => Promise<void>;
  fetchUserProfile: (user: User) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // This effect will be skipped on the homepage now, but will work on other pages
  useEffect(() => {
    // A quick check to see if we're on the main page. If so, we'll use mock data.
    if (window.location.pathname === '/') {
       setUser({ uid: 'mock-user' } as User);
       setUserProfile({
         uid: 'mock-user',
         email: 'farmer@kisan.com',
         name: 'Ahmad Faisal',
         location: 'Okara, Punjab',
         language: 'pa',
       });
       setLoading(false);
       return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      if (user) {
        setUser(user);
        await fetchUserProfile(user, true); // Check and create profile if missing
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = (email: string, pass: string) => {
    return signInWithEmailAndPassword(auth, email, pass);
  };

  const signup = async (email: string, pass: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    // The onAuthStateChanged listener will handle profile creation.
    return userCredential;
  };

  const logout = () => {
    return signOut(auth);
  };

  const fetchUserProfile = async (user: User, createIfMissing = false) => {
    const docRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setUserProfile(docSnap.data() as UserProfile);
    } else if (createIfMissing) {
      const newProfile: UserProfile = {
        uid: user.uid,
        email: user.email!,
        name: user.displayName || 'New Farmer',
        location: '',
        language: 'en',
        crops: [],
      };
      await setDoc(docRef, newProfile);
      setUserProfile(newProfile);
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    login,
    signup,
    logout,
    fetchUserProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
