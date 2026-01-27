import React from "react";
import { NavLink } from "react-router-dom";
import "./Footer.css";

const IconHeart = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "الرئيسية", path: "/" },
    { name: "تسجيل الدخول", path: "/auth" },
    { name: "إنشاء حساب", path: "/auth" },
  ];

  const services = [
    "المساعد الصحي الذكي",
    "حجز المواعيد",
    "الملف الطبي",
    "تحليل الأعراض",
  ];

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        {/* Main Footer Content */}
        <div className="footer-grid">
          {/* Brand Section */}
          <div className="footer-brand">
            <div className="brand-logo">
              <span className="logo-icon">🏥</span>
              <span className="logo-text">MedScanAI</span>
            </div>
            <p className="brand-desc">
              منصة طبية ذكية تجمع بين قوة الذكاء الاصطناعي والخبرة الطبية لتقديم أفضل رعاية صحية.
            </p>
            <div className="social-links">
              <a href="#" className="social-link" aria-label="Twitter">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                </svg>
              </a>
              <a href="#" className="social-link" aria-label="LinkedIn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              <a href="#" className="social-link" aria-label="Instagram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-links">
            <h4 className="footer-title">روابط سريعة</h4>
            <ul className="links-list">
              {quickLinks.map((link, i) => (
                <li key={i}>
                  <NavLink to={link.path}>{link.name}</NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="footer-links">
            <h4 className="footer-title">خدماتنا</h4>
            <ul className="links-list">
              {services.map((service, i) => (
                <li key={i}>
                  <span>{service}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-contact">
            <h4 className="footer-title">تواصل معنا</h4>
            <div className="contact-info">
              <p>📧 support@medscanai.com</p>
              <p>📞 +966 50 123 4567</p>
              <p>📍 الرياض، المملكة العربية السعودية</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div className="copyright">
            <p>© MedScanAI {currentYear}، جميع الحقوق محفوظة.</p>
          </div>
          <div className="made-with">
            <span>صُنع بـ</span>
            <span className="heart"><IconHeart /></span>
            <span>للأغراض التعليمية</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
