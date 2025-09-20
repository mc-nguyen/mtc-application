import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

function HomePage() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleRegistrationClick = () => {
    navigate('/registration');
  };

  const handleEventsClick = () => {
    navigate('/events'); // Dẫn đến trang events mới
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      
      <h1>{t('homepage_title')}</h1>
      <p>{t('homepage_subtitle')}</p>
      <button onClick={handleRegistrationClick} style={{ margin: '10px', padding: '10px 20px', fontSize: '16px' }}>
        {t('homepage_register_btn')}
      </button>
      <button onClick={handleEventsClick} style={{ margin: '10px', padding: '10px 20px', fontSize: '16px' }}>
        {t('homepage_events_btn')}
      </button>
    </div>
  );
}

export default HomePage;