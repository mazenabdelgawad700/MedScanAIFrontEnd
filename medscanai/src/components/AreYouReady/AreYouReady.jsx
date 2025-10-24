import React from "react";
import { NavLink } from "react-router-dom";
import "./AreYouReady.css";

const AreYouReady = () => {
  return (
    <section className="are-ready">
      <div className="are-inner">
        <h2 className="are-title">هل أنت مستعد للسيطرة على صحتك؟</h2>
        <p className="are-sub">
          انضم إلى آلاف المرضى الذين يستخدمون MedScanAI بالفعل
        </p>
        <NavLink to="/auth" className="are-cta" aria-label="إنشاء حساب">
          إنشاء حساب
        </NavLink>
      </div>
    </section>
  );
};

export default AreYouReady;
