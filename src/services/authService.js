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

export class AuthService {
  // Đăng ký tài khoản mới
  static async register(email, password, userData) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Lưu thông tin user vào Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        createdAt: new Date().toISOString(),
        ...userData
      });

      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Đăng nhập
  static async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Đăng xuất
  static async logout() {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Kiểm tra xem email đã tồn tại chưa
  static async checkEmailExists(email) {
    try {
      // Tìm user bằng email trong Firestore
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);

      return !querySnapshot.empty;
    } catch (error) {
      console.error('Error checking email:', error);
      return false;
    }
  }

  // Lấy thông tin user hiện tại
  static getCurrentUser() {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe();
        resolve(user);
      });
    });
  }

  // Lưu form vào tài khoản user
  static async saveFormToUser(userId, formData, formType = 'membership') {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        forms: arrayUnion({
          ...formData,
          formType,
          savedAt: new Date().toISOString(),
          submissionId: formData.id || `temp_${Date.now()}`
        })
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Lấy tất cả forms của user
  static async getUserForms(userId) {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        return userDoc.data().forms || [];
      }
      return [];
    } catch (error) {
      console.error('Error getting user forms:', error);
      return [];
    }
  }
  
  static async getUserFormsByEmail(userEmail) {
    try {
      const forms = [];

      // Lấy forms từ formSubmissions
      const formSubmissionsRef = collection(db, 'artifacts', 'mtc-applications', 'public', 'data', 'formSubmissions');
      const formQuery = query(formSubmissionsRef, where('mainInfo.email', '==', userEmail));
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
      const campQuery = query(campSubmissionsRef, where('mainInfo.email', '==', userEmail));
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
  }

  // Kiểm tra xem user có phải admin không
  static isAdminUser() {
    const user = auth.currentUser;
    return user && user.email === 'tnttmethienchuariverside@gmail.com';
  }

  // Lấy tất cả forms (chỉ dành cho admin)
  static async getAllForms() {
    if (!this.isAdminUser()) {
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
  }
}