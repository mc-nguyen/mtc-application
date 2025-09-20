// src/config/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

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

// Export các service
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;