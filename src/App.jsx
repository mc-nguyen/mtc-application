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

function App() {
  return (
    <LanguageProvider>
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
  );
}

export default App;