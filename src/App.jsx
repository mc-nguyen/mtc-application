import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import Language Context Provider
import { LanguageProvider } from './LanguageContext'; // Import Provider
import { AuthProvider } from './services/AuthContext';

// Import global styles
import './App.css';
import './admin/Admin.css';

// Import all page components
import AdminPage from './admin/AdminPage';
import CampRegistrationForm from './pages/CampRegistrationForm';
import EventsPage from './pages/EventsPage';
import HomePage from './pages/HomePage';
import RegistrationForm from './pages/RegistrationForm';
import ThankYouPage from './pages/ThankYouPage';
import SaveFormPage from './pages/SaveFormPage';
import UserDashboard from './pages/UserDashboard';
import LoginPage from './pages/LoginPage';

// Import Header and Footer
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App">
      <LanguageProvider>
        <AuthProvider>
          <Router>
            <Header />
            <div className="App">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/registration" element={<RegistrationForm />} />
                <Route path="/binh-minh" element={<CampRegistrationForm />} />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/thank-you" element={<ThankYouPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/save-form" element={<SaveFormPage />} />
                <Route path="/dashboard" element={<UserDashboard />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/dashboard" element={<UserDashboard />} />
              </Routes>
            </div>
            <Footer />
          </Router>
        </AuthProvider>
      </LanguageProvider>


    </div >
  );
}

export default App;