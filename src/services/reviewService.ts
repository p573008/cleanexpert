import { collection, query, getDocs, addDoc, serverTimestamp, orderBy, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';

export async function createReview(userId: string, userName: string, reviewData: any) {
  try {
    await addDoc(collection(db, 'reviews'), {
      ...reviewData,
      userId,
      userName,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'reviews');
  }
}

export function subscribeToReviews(callback: (reviews: any[]) => void) {
  const q = query(
    collection(db, 'reviews'),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(q, 
    (snapshot) => {
      const reviews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(reviews);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'reviews');
    }
  );
}
