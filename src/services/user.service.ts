
'use server';

import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { UserProfile } from '@/lib/types';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

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

  // Create a clean object and only add defined values.
  const dataToSave: { [key: string]: any } = {};
  Object.keys(profileData).forEach(key => {
    const value = profileData[key as keyof typeof profileData];
    if (value !== undefined) {
      dataToSave[key] = value;
    }
  });

  // Do not proceed if there is nothing to save.
  if (Object.keys(dataToSave).length === 0) {
    return;
  }

  const userDocRef = doc(db, 'users', userId);
  
  setDoc(userDocRef, dataToSave, { merge: true })
    .catch((serverError) => {
        const permissionError = new FirestorePermissionError({
            path: userDocRef.path,
            operation: 'update',
            requestResourceData: dataToSave,
        });

        errorEmitter.emit('permission-error', permissionError);
    });
}
