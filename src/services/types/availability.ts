import { db } from '../config/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { WeeklySchedule } from '../types/availability';

export const saveUserSchedule = async (userId: string, schedule: WeeklySchedule) => {
  try {
    console.log('Saving schedule:', schedule);
    await setDoc(doc(db, 'availability', userId), {
      schedule,
      updatedAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error('Error saving schedule:', error);
    throw error;
  }
};

export const getUserSchedule = async (userId: string): Promise<WeeklySchedule | null> => {
  try {
    const docRef = doc(db, 'availability', userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log('Retrieved schedule:', data.schedule);
      return data.schedule;
    }
    console.log('No schedule found');
    return null;
  } catch (error) {
    console.error('Error getting schedule:', error);
    throw error;
  }
}; 