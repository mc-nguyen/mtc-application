// src/pages/LogIn.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import { useLanguage } from '../LanguageContext';
import './LoginPage.css'; // Đảm bảo import file CSS mới
import { checkAdminRole } from '../utils/firestoreUtils';

const LogIn = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // BƯỚC 1: ĐĂNG NHẬP (Lấy userCredential)
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;
      
      // BƯỚC 2: KIỂM TRA VAI TRÒ (ROLE CHECK)
      const isAdmin = await checkAdminRole(user.email);
      
      // BƯỚC 3: CHUYỂN HƯỚNG CÓ ĐIỀU KIỆN
      if (isAdmin) {
        navigate('/admin'); // Chuyển đến trang Admin
      } else {
        navigate('/dashboard'); // Chuyển đến trang Dashboard cho user thường
      }

    } catch (err) {
      console.error('Login failed:', err);
      // Giữ nguyên logic xử lý lỗi
      setError(t('login.invalidCredentials')); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <h2>{t('login.title')}</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder={t('login.emailPlaceholder')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder={t('login.passwordPlaceholder')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? t('login.loading') : t('login.submit')}
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default LogIn;