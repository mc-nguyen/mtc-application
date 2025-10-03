import React, { createContext, useState, useContext } from 'react';
import { translations } from './translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('vi'); // Ngôn ngữ mặc định

  const t = (key) => {
    const keys = key.split('.');
    let value = translations[language];
    for (let k of keys) {
      value = value?.[k];
      if (value === undefined) break;
    }
    return value || key; // fallback là chính key
  };


  const changeLanguage = (lng) => {
    setLanguage(lng);
  };

  return (
    <LanguageContext.Provider value={{ t, changeLanguage, language }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);