import { auth, db } from '../config/firebaseConfig';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';

export const login = async (email, password) => {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
};

export const logout = async () => await signOut(auth);

export const observeAuthState = (callback) => onAuthStateChanged(auth, callback);

export const getUserForms = async (email) => {
  const q = query(
    collection(db, 'artifacts', 'mtc-applications', 'public', 'data', 'forms'),
    where('mainInfo.email', '==', email)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};