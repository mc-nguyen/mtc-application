import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import RegistrationForm from './components/RegistrationForm';
import ThankYouPage from './components/ThankYouPage';
import { LanguageProvider } from './LanguageContext'; // Import Provider
import './App.css';
import CampRegistrationForm from './components/CampRegistrationForm';
import EventsPage from './components/EventsPage';
import AdminPage from './admin/AdminPage';
import './admin/Admin.css';
import LanguageSwitcher from './components/LanguageSwitcher';

function App() {
  return (
    <div className="App">
      <LanguageProvider>
        <header className="app-header">
          <div className="container">
            <div className="header-content">
              <a href="/" className="logo">
                <span className="logo-icon">🌟</span>
                TNTT Mẹ Thiên Chúa
              </a>
              <LanguageSwitcher />
            </div>
          </div>
        </header>

        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/registration" element={<RegistrationForm />} />
              <Route path="/binh-minh" element={<CampRegistrationForm />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/thank-you" element={<ThankYouPage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
          </div>
        </Router>
      </LanguageProvider>

      <footer className="app-footer">
        <div className="container">
          <div className="footer-content">
            <p>&copy; 2025 TNTT Mẹ Thiên Chúa. All rights reserved.</p>
            <div className="footer-links">
              <a href="/privacy">Privacy Policy</a>
              <a href="/terms">Terms of Service</a>
              <a href="/contact">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div >
  );
}

export default App;