
import type { Timestamp } from 'firebase/firestore';
import { z } from 'zod';

export interface Crop {
  slug: string;
  name: string;
  imageUrl?: string;
  icon?: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  name?: string;
  location?: string;
  phoneNumber?: string;
  farmSize?: number;
  language?: 'en' | 'ur' | 'pa' | 'si' | 'ps';
  crops?: Crop[];
  photoURL?: string;
}

export interface Advisory {
  id: string;
  userId: string;
  createdAt: Timestamp;
  diagnosis: string;
}

export const TranslateUIInputSchema = z.object({
  texts: z.array(z.string()).describe('An array of English text strings to be translated.'),
  targetLanguage: z
    .enum(['en', 'ur', 'pa', 'si', 'ps'])
    .describe('The target language code (en: English, ur: Urdu, pa: Punjabi, si: Sindhi, ps: Pashto).'),
});
export type TranslateUIInput = z.infer<typeof TranslateUIInputSchema>;

export const TranslateUIOutputSchema = z.object({
  translations: z.array(z.string()).describe('An array of translated text strings, in the same order as the input.'),
});
export type TranslateUIOutput = z.infer<typeof TranslateUIOutputSchema>;
    