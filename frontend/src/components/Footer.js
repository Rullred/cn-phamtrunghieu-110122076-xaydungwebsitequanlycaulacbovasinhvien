import React from 'react';
import { FaPhone, FaEnvelope, FaFacebook } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Liên hệ</h3>
            <div className="contact-info">
              <div className="contact-item">
                <FaPhone className="contact-icon" />
                <span>0333633877</span>
              </div>
              <div className="contact-item">
                <FaEnvelope className="contact-icon" />
                <a href="mailto:truongktcn@st.tvu.edu.vn">truongktcn@st.tvu.edu.vn</a>
              </div>
              <div className="contact-item">
                <FaFacebook className="contact-icon" />
                <a 
                  href="https://www.facebook.com/share/1ASWatoneX/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  CET Youth Union
                </a>
              </div>
            </div>
          </div>

          <div className="footer-section">
            <h3>Về chúng tôi</h3>
            <p>Hệ thống quản lý Câu lạc bộ và Hoạt động sinh viên</p>
            <p>Trường Đại học Trà Vinh</p>
          </div>

          <div className="footer-section">
            <img src="/logo-tvu.jpg" alt="TVU Logo" className="footer-logo" />
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 Trường Đại học Trà Vinh. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
