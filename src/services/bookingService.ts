import { collection, query, where, getDocs, addDoc, serverTimestamp, orderBy, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';

export async function createBooking(userId: string, bookingData: any) {
  try {
    const docRef = await addDoc(collection(db, 'bookings'), {
      ...bookingData,
      userId,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'bookings');
  }
}

export function subscribeToUserBookings(userId: string, callback: (bookings: any[]) => void) {
  const q = query(
    collection(db, 'bookings'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(q, 
    (snapshot) => {
      const bookings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(bookings);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'bookings');
    }
  );
}

export function subscribeToAllBookings(callback: (bookings: any[]) => void) {
  const q = query(
    collection(db, 'bookings'),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(q, 
    (snapshot) => {
      const bookings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(bookings);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'bookings');
    }
  );
}
