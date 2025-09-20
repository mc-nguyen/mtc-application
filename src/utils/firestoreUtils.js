import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Cấu hình Firebase của bạn
const firebaseConfig = {
    apiKey: "AIzaSyAuEnELYG5yolkh19Kzolthcf8H-aWZzpQ",
    authDomain: "mtc-applications.firebaseapp.com",
    projectId: "mtc-applications",
    storageBucket: "mtc-applications.firebasestorage.app",
    messagingSenderId: "680936685353",
    appId: "1:680936685353:web:3d5e61dcea5c225fc8c138"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;

/**
 * Lưu tất cả dữ liệu form vào Firestore với ID tự động.
 * @param {object} formData - Toàn bộ dữ liệu của form, bao gồm mainInfo, healthInfo, paymentInfo, waiver, v.v.
 * @returns {string|null} ID của tài liệu mới nếu thành công, ngược lại là null.
 */
export const saveAllFormDataToFirestore = async (formData) => {
    // Sử dụng projectId được khai báo trong firebaseConfig
    const projectId = firebaseConfig.projectId;

    try {
        // Tham chiếu đến collection để lưu dữ liệu.
        // Đây là một collection công khai nên không cần userId trong đường dẫn.
        const submissionsCollectionRef = collection(db, 'artifacts', projectId, 'public', 'data', 'formSubmissions');
        
        // Sử dụng addDoc để tự động tạo một tài liệu mới với ID duy nhất.
        // Lưu toàn bộ đối tượng formData vào một document.
        const docRef = await addDoc(submissionsCollectionRef, {
            ...formData, // Lưu tất cả các trường từ formData
            submissionDate: new Date().toISOString()
        });

        console.log("All form data successfully saved with document ID:", docRef.id);
        return docRef.id;
    } catch (e) {
        console.error("Error saving form data:", e);
        return null;
    }
};

// src/utils/firestoreUtils.js - Thêm hàm này
export const saveCampDataToFirestore = async (formData) => {
    const projectId = firebaseConfig.projectId;

    try {
        const campSubmissionsCollectionRef = collection(db, 'artifacts', projectId, 'public', 'data', 'campSubmissions');
        
        const docRef = await addDoc(campSubmissionsCollectionRef, {
            ...formData,
            type: 'BinhMinhCamp', // Thêm type để phân biệt
            submissionDate: new Date().toISOString()
        });

        console.log("Camp registration data successfully saved with ID:", docRef.id);
        return docRef.id;
    } catch (e) {
        console.error("Error saving camp registration data:", e);
        return null;
    }
};