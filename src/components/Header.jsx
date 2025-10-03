import React, { useState, useRef, useEffect } from 'react'; // THÊM useRef, useEffect (Tùy chọn)
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '../LanguageContext';
import './Header.css';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  // THÊM: State để quản lý hiển thị dropdown
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null); // Để xử lý click ra ngoài (tăng UX)

  // Hàm chuyển đổi trạng thái dropdown
  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };
  
  // Hàm xử lý click vào mục dropdown và điều hướng
  const handleDropdownClick = (path) => {
    navigate(path);
    setIsDropdownOpen(false); // Đóng dropdown sau khi click
  };

  // Logic đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Kiểm tra xem có đang trong Router context không
  if (!navigate || !location) {
    console.warn('Header is not inside Router context');
    return (
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">⛪</span>
            <span>TNTT Mẹ Thiên Chúa</span>
          </div>
          <LanguageSwitcher />
        </div>
      </header>
    );
  }

  const handleAuthClick = () => {
    if (user) {
      logout();
    } else {
      navigate('/login');
    }
  };

  return (
    <header className="app-header">
      <div className="header-content">
        {/* Logo (giữ nguyên) */}
        <div
          className="logo"
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer' }}
        >
          <span className="logo-icon">⛪</span>
          <span>TNTT Mẹ Thiên Chúa</span>
        </div>

        {/* Right section */}
        <div className="header-right">
          <LanguageSwitcher />

          {/* User info - SỬA ĐỔI THÀNH DROPDOWN */}
          <div className="user-section" ref={dropdownRef}>
            {user ? (
              <div className="dropdown-container">
                <button 
                  className="dropdown-toggle"
                  onClick={toggleDropdown}
                  // Thêm class 'active' nếu dropdown đang mở để tạo hiệu ứng
                  aria-expanded={isDropdownOpen}
                >
                  <span className="user-email">{user.email}</span>
                  {/* Có thể thêm icon mũi tên (▼) ở đây */}
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="dropdown-menu">
                    <button onClick={() => handleDropdownClick('/profile')}>
                      Profile
                    </button>
                    <button onClick={() => handleDropdownClick('/dashboard')}> 
                      Applications
                    </button>
                    <button onClick={() => handleDropdownClick('/settings')}>
                      Settings
                    </button>
                    <div className="dropdown-divider"></div>
                    <button onClick={logout} className="logout-btn">
                      {t('logout')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={handleAuthClick}>{t('login.submit')}</button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;