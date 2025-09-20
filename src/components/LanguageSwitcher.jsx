import React from 'react';
import { useLanguage } from '../LanguageContext';
import './LanguageSwitcher.css'; // Tạo file CSS mới cho LanguageSwitcher

function LanguageSwitcher() {
  const { changeLanguage, currentLanguage } = useLanguage();

  return (
    <div className="language-switcher">
      <button 
        onClick={() => changeLanguage('vi')} 
        className={currentLanguage === 'vi' ? 'active' : ''}
      >
        VI
      </button>
      <span className="language-divider">|</span>
      <button 
        onClick={() => changeLanguage('en')}
        className={currentLanguage === 'en' ? 'active' : ''}
      >
        EN
      </button>
    </div>
  );
}

export default LanguageSwitcher;