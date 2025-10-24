import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <p>© MedScanAI {new Date().getFullYear()}، جميع الحقوق محفوظة.</p>
        <p>هذا نموذج تعليمي للأغراض التعليمية.</p>
      </div>
    </footer>
  );
};

export default Footer;
