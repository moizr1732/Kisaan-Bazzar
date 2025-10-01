import type { Timestamp } from 'firebase/firestore';

export interface UserProfile {
  uid: string;
  email: string;
  name?: string;
  location?: string;
  phoneNumber?: string;
  farmSize?: number;
  language?: 'en' | 'ur' | 'pa' | 'sd' | 'ps';
  crops?: string[];
}

export interface Advisory {
  id: string;
  userId: string;
  createdAt: Timestamp;
  diagnosis: string;
}
