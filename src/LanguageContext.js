import React, { createContext, useState, useContext } from 'react';
import { translations } from './translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('vi'); // Ngôn ngữ mặc định
  
  const t = (key) => {
    return translations[language][key] || key; // Hàm dịch thuật
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