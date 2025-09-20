// src/utils/firestoreUtils.js
import { db } from '../config/firebaseConfig';
import { collection, addDoc } from "firebase/firestore";

/**
 * Lưu tất cả dữ liệu form vào Firestore với ID tự động.
 * @param {object} formData - Toàn bộ dữ liệu của form
 * @returns {string|null} ID của tài liệu mới nếu thành công
 */
export const saveAllFormDataToFirestore = async (formData) => {
    try {
        const submissionsCollectionRef = collection(db, 'artifacts', 'mtc-applications', 'public', 'data', 'formSubmissions');
        
        const docRef = await addDoc(submissionsCollectionRef, {
            ...formData,
            submissionDate: new Date().toISOString()
        });

        console.log("All form data successfully saved with ID:", docRef.id);
        return docRef.id;
    } catch (e) {
        console.error("Error saving form data:", e);
        return null;
    }
};

/**
 * Lưu dữ liệu đăng ký camp vào Firestore
 * @param {object} formData - Dữ liệu đăng ký camp
 * @returns {string|null} ID của tài liệu mới nếu thành công
 */
export const saveCampDataToFirestore = async (formData) => {
    try {
        const campSubmissionsCollectionRef = collection(db, 'artifacts', 'mtc-applications', 'public', 'data', 'campSubmissions');
        
        const docRef = await addDoc(campSubmissionsCollectionRef, {
            ...formData,
            type: 'BinhMinhCamp',
            submissionDate: new Date().toISOString()
        });

        console.log("Camp registration data successfully saved with ID:", docRef.id);
        return docRef.id;
    } catch (e) {
        console.error("Error saving camp registration data:", e);
        return null;
    }
};