// src/components/SaveFormPage.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import { useLanguage } from '../LanguageContext';
import { AuthService } from '../services/authService';

function SaveFormPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { currentUser, register, login, saveForm } = useAuth();
  
  const { formData, isCamp = false } = location.state || {};
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [action, setAction] = useState(''); // 'login', 'register', 'skip'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!formData) {
      navigate('/');
      return;
    }

    // Auto-fill email từ form data nếu có
    if (formData.mainInfo?.email) {
      setEmail(formData.mainInfo.email);
      checkExistingAccount(formData.mainInfo.email);
    }
  }, [formData, navigate]);

  const checkExistingAccount = async (email) => {
    try {
      const exists = await AuthService.checkEmailExists(email);
      if (exists) {
        setAction('login');
      }
    } catch (error) {
      console.error('Error checking email:', error);
    }
  };

  const handleSaveForm = async () => {
    if (!formData) return;

    setLoading(true);
    setError('');

    try {
      let result;

      if (action === 'register') {
        result = await register(email, password, {
          fullName,
          initialFormData: formData
        });
      } else if (action === 'login') {
        result = await login(email, password);
      }

      if (result && result.success) {
        // Lưu form vào tài khoản
        const saveResult = await saveForm(formData, isCamp ? 'camp' : 'membership');
        
        if (saveResult.success) {
          navigate('/thank-you', { 
            state: { formData, isCamp, savedToAccount: true } 
          });
        } else {
          setError('Lỗi khi lưu form: ' + saveResult.error);
        }
      } else {
        setError(result?.error || 'Có lỗi xảy ra');
      }
    } catch (error) {
      setError('Có lỗi xảy ra: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    navigate('/thank-you', { 
      state: { formData, isCamp, savedToAccount: false } 
    });
  };

  if (!formData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="save-form-page">
      <div className="save-form-container">
        <h1>{t('save_form_title')}</h1>
        <p>{t('save_form_description')}</p>

        {/* Thông tin form preview */}
        <div className="form-preview">
          <h3>Thông tin đăng ký</h3>
          <p><strong>Họ tên:</strong> {`${formData.mainInfo?.givenName} ${formData.mainInfo?.lastName}`}</p>
          <p><strong>Email:</strong> {formData.mainInfo?.email}</p>
          <p><strong>Loại:</strong> {isCamp ? 'Đăng ký Trại' : 'Đăng ký Thành viên'}</p>
        </div>

        {/* Form lựa chọn */}
        <div className="save-options">
          {!action ? (
            <>
              <button 
                onClick={() => setAction('register')}
                className="option-btn primary"
              >
                📝 Tạo tài khoản mới & Lưu form
              </button>
              
              <button 
                onClick={() => setAction('login')}
                className="option-btn secondary"
              >
                🔐 Đã có tài khoản? Đăng nhập
              </button>
              
              <button 
                onClick={handleSkip}
                className="option-btn skip"
              >
                ⏭️ Bỏ qua, không lưu tài khoản
              </button>
            </>
          ) : (
            <div className="auth-form">
              {action === 'register' && (
                <div className="form-group">
                  <label>Họ và tên đầy đủ:</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nhập họ tên đầy đủ"
                  />
                </div>
              )}
              
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={action === 'login'} // Không cho sửa email khi login
                />
              </div>
              
              <div className="form-group">
                <label>Mật khẩu:</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={action === 'register' ? 'Tạo mật khẩu mới' : 'Nhập mật khẩu'}
                />
              </div>

              {error && <div className="error-message">{error}</div>}

              <div className="auth-actions">
                <button 
                  onClick={handleSaveForm}
                  disabled={loading || !email || !password || (action === 'register' && !fullName)}
                  className="save-btn"
                >
                  {loading ? 'Đang xử lý...' : 'Lưu form & Tiếp tục'}
                </button>
                
                <button 
                  onClick={() => setAction('')}
                  className="back-btn"
                >
                  ← Quay lại lựa chọn
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Thông báo lợi ích */}
        <div className="benefits">
          <h4>Lợi ích khi lưu tài khoản:</h4>
          <ul>
            <li>✓ Theo dõi trạng thái đơn đăng ký</li>
            <li>✓ Đăng ký nhanh cho các sự kiện tiếp theo</li>
            <li>✓ Xem lại lịch sử đăng ký</li>
            <li>✓ Nhận thông báo từ ban tổ chức</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SaveFormPage;