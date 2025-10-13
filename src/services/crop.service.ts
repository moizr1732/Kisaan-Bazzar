
'use server';

import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Crop } from '@/lib/types';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

/**
 * Updates the 'crops' array for a specific user in Firestore.
 *
 * @param userId The ID of the user to update.
 * @param crops The new array of crops to be saved.
 * @returns A promise that resolves when the update is complete.
 */
export async function updateUserCrops(
  userId: string,
  crops: Crop[]
): Promise<void> {
  if (!userId) {
    throw new Error('User ID is required to update crops.');
  }
  const userDocRef = doc(db, 'users', userId);
  const dataToSave = { crops: crops };

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
