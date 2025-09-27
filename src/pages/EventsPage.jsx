import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';
import LanguageSwitcher from '../components/LanguageSwitcher';

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
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <LanguageSwitcher />
      <h1>{t('events_title')}</h1>
      
      <div style={{ margin: '30px 0' }}>
        <div style={{ 
          border: '1px solid #ddd', 
          borderRadius: '8px', 
          padding: '20px', 
          margin: '20px auto', 
          maxWidth: '400px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3>Bình Minh Camp</h3>
          <p>Summer camping event for youth members</p>
          <button 
            onClick={handleCampRegistrationClick} 
            style={{ 
              margin: '10px', 
              padding: '10px 20px', 
              fontSize: '16px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {t('register_btn')}
          </button>
        </div>
      </div>

      <button 
        onClick={handleBackToHome} 
        style={{ 
          margin: '10px', 
          padding: '10px 20px', 
          fontSize: '16px' 
        }}
      >
        {t('back_to_home')}
      </button>
    </div>
  );
}

export default EventsPage;