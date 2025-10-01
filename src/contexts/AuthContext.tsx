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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        await fetchUserProfile(user);
      } else {
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
    const newUser = userCredential.user;
    const userDocRef = doc(db, "users", newUser.uid);

    // Create user profile in Firestore
    await setDoc(userDocRef, {
      uid: newUser.uid,
      email: newUser.email,
      name: '',
      location: '',
      language: 'en',
      crops: [],
    });
    
    // The user profile will be fetched by the onAuthStateChanged listener
    // ensuring consistency.
    
    return userCredential;
  };

  const logout = () => {
    return signOut(auth);
  };

  const fetchUserProfile = async (user: User) => {
    const docRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setUserProfile(docSnap.data() as UserProfile);
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
