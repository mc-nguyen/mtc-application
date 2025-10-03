import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';
import './HomePage.css'; // Đảm bảo import file CSS mới

function HomePage() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleRegistrationClick = () => {
    navigate('/registration');
  };

  const handleEventsClick = () => {
    navigate('/events');
  };

  return (
    <div className="home-page">
      <h1>{t('homepage_title')}</h1>
      <p>{t('homepage_subtitle')}</p>
      <button onClick={handleRegistrationClick} className="primary-btn">
        {t('homepage_register_btn')}
      </button>
      <button onClick={handleEventsClick} className="secondary-btn">
        {t('homepage_events_btn')}
      </button>
    </div>
  );
}

export default HomePage;