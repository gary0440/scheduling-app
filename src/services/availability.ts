import { db } from '../config/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import type { WeeklySchedule } from '../types/availability';

export const saveUserSchedule = async (userId: string, schedule: WeeklySchedule) => {
  console.log('Saving for user:', userId);
  console.log('Schedule data:', schedule);

  try {
    const docRef = doc(db, 'availability', userId);
    await setDoc(docRef, { schedule });
    console.log('Save successful');
    return true;
  } catch (error) {
    console.error('Save failed:', error);
    throw error;
  }
};

export const getUserSchedule = async (userId: string): Promise<WeeklySchedule | null> => {
  console.log('Getting schedule for user:', userId);

  try {
    const docRef = doc(db, 'availability', userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log('Found schedule:', data.schedule);
      return data.schedule;
    }

    console.log('No schedule found');
    return null;
  } catch (error) {
    console.error('Get schedule failed:', error);
    throw error;
  }
}; 