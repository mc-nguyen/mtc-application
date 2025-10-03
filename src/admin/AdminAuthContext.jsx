import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../config/firebaseConfig';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const AdminAuthContext = createContext();
export const useAdminAuth = () => useContext(AdminAuthContext);

export const AdminAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkAdminRole = async (email) => {
    try {
      const ref = doc(db, 'artifacts', 'mtc-applications', 'public', 'data', 'email', email);
      const snap = await getDoc(ref);
      return snap.exists() && snap.data().role === 'admin';
    } catch (err) {
      console.error('Role check failed:', err);
      return false;
    }
  };

  const login = async (email, password) => {
    setError(null);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const isAdminUser = await checkAdminRole(result.user.email);
      if (!isAdminUser) throw new Error('Không có quyền admin');
      setUser(result.user);
      setIsAdmin(true);
    } catch (err) {
      setError(err.message);
      setUser(null);
      setIsAdmin(false);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setIsAdmin(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const isAdminUser = await checkAdminRole(currentUser.email);
        setUser(currentUser);
        setIsAdmin(isAdminUser);
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AdminAuthContext.Provider value={{ user, isAdmin, login, logout, loading, error }}>
      {children}
    </AdminAuthContext.Provider>
  );
};