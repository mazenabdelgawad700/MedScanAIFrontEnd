import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import "./AreYouReady.css";

const IconArrowLeft = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 12H5" />
    <path d="m12 19-7-7 7-7" />
  </svg>
);

const AreYouReady = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className={`are-ready ${isVisible ? "visible" : ""}`} ref={sectionRef}>
      {/* Animated Background */}
      <div className="cta-bg-elements">
        <div className="cta-circle cta-circle-1" />
        <div className="cta-circle cta-circle-2" />
        <div className="cta-circle cta-circle-3" />
      </div>

      <div className="are-inner">
        <div className="cta-badge">ابدأ رحلتك الصحية</div>
        <h2 className="are-title">هل أنت مستعد للسيطرة على صحتك؟</h2>
        <p className="are-sub">
          انضم إلى آلاف المرضى الذين يستخدمون MedScanAI بالفعل لإدارة صحتهم بذكاء
        </p>
        <div className="cta-buttons">
          <NavLink to="/auth" className="are-cta primary" aria-label="إنشاء حساب">
            إنشاء حساب مجاني
            <IconArrowLeft />
          </NavLink>
          <NavLink to="/auth" className="are-cta secondary" aria-label="تسجيل الدخول">
            تسجيل الدخول
          </NavLink>
        </div>

        {/* Trust Badges */}
        <div className="trust-badges">
          <div className="trust-badge">
            <span className="badge-icon">🔒</span>
            <span>بياناتك آمنة</span>
          </div>
          <div className="trust-badge">
            <span className="badge-icon">⚡</span>
            <span>تسجيل سريع</span>
          </div>
          <div className="trust-badge">
            <span className="badge-icon">💳</span>
            <span>بدون رسوم</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AreYouReady;
