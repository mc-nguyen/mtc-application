import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';
import LanguageSwitcher from '../components/LanguageSwitcher';
import './EventsPage.css'; // Đảm bảo import file CSS mới

function EventsPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleCampRegistrationClick = () => {
    navigate('/binh-minh');
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="events-page">
      <LanguageSwitcher />
      <h1>{t('events_title')}</h1>
      
      <div className="events-list">
        <div className="event-card">
          <h3>Bình Minh Camp</h3>
          <p>Summer camping event for youth members</p>
          <button 
            onClick={handleCampRegistrationClick} 
            className="register-btn"
          >
            {t('register_btn')}
          </button>
        </div>
      </div>

      <button 
        onClick={handleBackToHome} 
        className="back-btn"
      >
        {t('back_to_home')}
      </button>
    </div>
  );
}

export default EventsPage;