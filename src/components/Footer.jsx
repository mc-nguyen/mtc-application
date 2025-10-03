import React from 'react';
import { Link } from 'react-router-dom'; // Sử dụng Link thay cho <a> nếu có thể
import './Footer.css'; // Import file CSS mới

function Footer() {
  return (
    <footer className="app-footer">
      <div className="container">
        <div className="footer-content">
          <p>&copy; 2025 TNTT Mẹ Thiên Chúa. All rights reserved.</p>
          <div className="footer-links">
            {/* Sử dụng <Link> để điều hướng nội bộ trong ứng dụng React */}
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;