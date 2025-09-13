import React from 'react';
import { useLanguage } from '../LanguageContext';

function LanguageSwitcher() {
  const { changeLanguage } = useLanguage();

  return (
    <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
      <button onClick={() => changeLanguage('vi')} style={{ marginRight: '5px' }}>Tiếng Việt</button>
      <button onClick={() => changeLanguage('en')}>English</button>
    </div>
  );
}

export default LanguageSwitcher;