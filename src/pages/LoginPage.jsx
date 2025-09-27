// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import { useLanguage } from '../LanguageContext';

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useLanguage();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(email, password);
      
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error || 'Đăng nhập thất bại');
      }
    } catch (error) {
      setError('Có lỗi xảy ra khi đăng nhập');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (role) => {
    if (role === 'admin') {
      setEmail('tnttmethienchuariverside@gmail.com');
      setPassword('demo123'); // Mật khẩu demo
    } else {
      setEmail('user@example.com');
      setPassword('demo123');
    }
  };

  return (
    <div className="registration-container">
      <div className="form-section">
        <h2>🔐 Đăng nhập tài khoản</h2>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <label>📧 Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Nhập email của bạn"
            />
          </div>

          <div className="input-container">
            <label>🔒 Mật khẩu:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Nhập mật khẩu"
            />
          </div>

          <button type="submit" disabled={loading} className="primary-btn">
            {loading ? '⏳ Đang đăng nhập...' : '🚀 Đăng nhập'}
          </button>
        </form>

        {/* Demo buttons for testing */}
        <div className="demo-section">
          <h4>Demo Accounts:</h4>
          <div className="button-group">
            <button 
              type="button" 
              onClick={() => handleDemoLogin('admin')}
              className="secondary-button"
            >
              👑 Login as Admin
            </button>
            <button 
              type="button" 
              onClick={() => handleDemoLogin('user')}
              className="secondary-button"
            >
              👤 Login as User
            </button>
          </div>
        </div>

        <div className="auth-links">
          <p>
            Chưa có tài khoản? 
            <Link to="/registration" className="auth-link">
              Đăng ký thành viên ngay
            </Link>
          </p>
          <p>
            <Link to="/" className="auth-link">
              ← Quay lại trang chủ
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;