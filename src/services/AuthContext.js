// src/services/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { 
  doc, setDoc, getDoc, updateDoc, arrayUnion,
  collection, query, where, getDocs 
} from 'firebase/firestore';
import { auth, db } from '../config/firebaseConfig';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsAdmin(user && user.email === 'tnttmethienchuariverside@gmail.com');
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Đăng ký tài khoản mới
  const register = async (email, password, userData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Lưu thông tin user vào Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        fullName: userData.fullName,
        createdAt: new Date().toISOString(),
        ...userData
      });
      
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Đăng nhập
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Đăng xuất
  const logout = async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Lấy forms của user theo email
  const getUserForms = async () => {
    if (!currentUser) return [];
    
    try {
      const forms = [];
      
      // Lấy forms từ formSubmissions
      const formSubmissionsRef = collection(db, 'artifacts', 'mtc-applications', 'public', 'data', 'formSubmissions');
      const formQuery = query(formSubmissionsRef, where('mainInfo.email', '==', currentUser.email));
      const formSnapshot = await getDocs(formQuery);
      
      formSnapshot.forEach(doc => {
        forms.push({
          id: doc.id,
          type: 'membership',
          ...doc.data()
        });
      });
      
      // Lấy forms từ campSubmissions
      const campSubmissionsRef = collection(db, 'artifacts', 'mtc-applications', 'public', 'data', 'campSubmissions');
      const campQuery = query(campSubmissionsRef, where('mainInfo.email', '==', currentUser.email));
      const campSnapshot = await getDocs(campQuery);
      
      campSnapshot.forEach(doc => {
        forms.push({
          id: doc.id,
          type: 'camp',
          ...doc.data()
        });
      });
      
      return forms;
    } catch (error) {
      console.error('Error getting user forms:', error);
      return [];
    }
  };

  // Lấy tất cả forms (chỉ admin)
  const getAllForms = async () => {
    if (!isAdmin) {
      throw new Error('Unauthorized: Admin access required');
    }
    
    try {
      const forms = [];
      
      // Lấy tất cả membership forms
      const formSubmissionsRef = collection(db, 'artifacts', 'mtc-applications', 'public', 'data', 'formSubmissions');
      const formSnapshot = await getDocs(formSubmissionsRef);
      
      formSnapshot.forEach(doc => {
        forms.push({
          id: doc.id,
          type: 'membership',
          ...doc.data()
        });
      });
      
      // Lấy tất cả camp forms
      const campSubmissionsRef = collection(db, 'artifacts', 'mtc-applications', 'public', 'data', 'campSubmissions');
      const campSnapshot = await getDocs(campSubmissionsRef);
      
      campSnapshot.forEach(doc => {
        forms.push({
          id: doc.id,
          type: 'camp',
          ...doc.data()
        });
      });
      
      return forms;
    } catch (error) {
      console.error('Error getting all forms:', error);
      throw error;
    }
  };

  const value = {
    currentUser,
    isAdmin,
    register,
    login,
    logout,
    getUserForms,
    getAllForms
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};