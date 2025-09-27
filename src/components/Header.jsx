// src/components/Header.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, isAdmin, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

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

  const handleUserMenuToggle = () => {
    setShowUserMenu(!showUserMenu);
  };

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
    navigate('/');
  };

  return (
    <header className="app-header">
      <div className="header-content">
        {/* Logo */}
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
          
          {/* User info */}
          <div className="user-section">
            {currentUser ? (
              <div className="user-menu-container">
                <button 
                  className="user-info-btn"
                  onClick={handleUserMenuToggle}
                >
                  <span className="user-email">
                    {currentUser.email}
                    {isAdmin && ' 👑'}
                  </span>
                  <span className="dropdown-arrow">▼</span>
                </button>
                
                {showUserMenu && (
                  <div className="user-dropdown">
                    <button 
                      onClick={() => {
                        navigate('/dashboard');
                        setShowUserMenu(false);
                      }}
                      className="dropdown-item"
                    >
                      📊 Dashboard
                    </button>
                    <button 
                      onClick={handleLogout}
                      className="dropdown-item logout-item"
                    >
                      🚪 Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button 
                onClick={() => navigate('/login')}
                className="login-btn"
              >
                🔐 Đăng nhập
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;