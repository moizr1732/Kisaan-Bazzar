
'use server';

import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Crop } from '@/lib/types';

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
  await setDoc(userDocRef, { crops: crops }, { merge: true });
}
