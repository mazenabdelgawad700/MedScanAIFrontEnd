import React from "react";
import { useNavigate } from "react-router-dom";
import "./PatientDashboard.css";

const Card = ({ title, subtitle, icon, onClick }) => (
  <div className="pd-card" onClick={onClick} role="button" tabIndex={0}>
    <div className="pd-card-left">
      <div className="pd-card-title">{title}</div>
      <div className="pd-card-sub">{subtitle}</div>
    </div>
    <div className="pd-card-icon">{icon}</div>
  </div>
);

const PatientDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="pd-page">
      <div className="pd-hero">
        <h1>مرحبًا بعودتك</h1>
        <p className="pd-sub">كيف يمكننا مساعدتك اليوم؟</p>
      </div>

      <div className="pd-grid">
        <Card
          title="الملف الطبي"
          subtitle="اعرض وحدث معلوماتك الطبية"
          icon={<span className="pd-ico">👤</span>}
          onClick={() => navigate("/patient/medical-profile")}
        />
        <Card
          title="مواعيدي"
          subtitle="اعرض مواعيدك القادمة والسابقة"
          icon={<span className="pd-ico">🗓️</span>}
          onClick={() => navigate("/patient/appointments")}
        />
        <Card
          title="حجز موعد"
          subtitle="حدد موعدًا لزيارة أطبائنا"
          icon={<span className="pd-ico">📅</span>}
          onClick={() => navigate("/patient/book")}
        />
        <Card
          title="المساعد الصحي الذكي"
          subtitle="تحدث عن أعراضك واحصل على توصيات"
          icon={<span className="pd-ico">💬</span>}
          onClick={() => navigate("/patient/ai")}
        />
      </div>
    </div>
  );
};

export default PatientDashboard;
