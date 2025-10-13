
'use server';

import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { UserProfile } from '@/lib/types';

/**
 * Updates a user's profile in Firestore.
 * It will not write `undefined` values to Firestore.
 *
 * @param userId The ID of the user to update.
 * @param profileData The partial user profile data to update.
 * @returns A promise that resolves when the update is complete.
 */
export async function updateUserProfile(
  userId: string,
  profileData: Partial<UserProfile>
): Promise<void> {
  if (!userId) {
    throw new Error('User ID is required to update a profile.');
  }

  // Create a copy of the data to safely modify
  const dataToSave = { ...profileData };

  // Firestore does not allow `undefined` values.
  // We need to remove any keys that have an undefined value.
  Object.keys(dataToSave).forEach(key => {
    if (dataToSave[key as keyof typeof dataToSave] === undefined) {
      delete dataToSave[key as keyof typeof dataToSave];
    }
  });

  const userDocRef = doc(db, 'users', userId);
  await setDoc(userDocRef, dataToSave, { merge: true });
}
