
import type { Timestamp } from 'firebase/firestore';

export interface UserProfile {
  uid: string;
  email: string;
  name?: string;
  location?: string;
  phoneNumber?: string;
  farmSize?: number;
  language?: 'en' | 'ur' | 'pa' | 'si' | 'ps';
  crops?: string[];
  photoURL?: string;
}

export interface Advisory {
  id: string;
  userId: string;
  createdAt: Timestamp;
  diagnosis: string;
}

    