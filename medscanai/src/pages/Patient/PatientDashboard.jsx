import React, { useEffect, useState } from "react";
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
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const payload = JSON.parse(atob(token.split(".")[1]));
        const userId = payload.UserId;

        const response = await fetch(
          "https://localhost:7196/api/patient/GetProfile",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ PatientId: userId }),
          }
        );

        const data = await response.json();
        if (data.succeeded) setProfile(data.data);
      } catch (error) {
        console.error("Failed to load profile", error);
      }
    };

    fetchProfile();
  }, []);

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

      {profile && (
        <div className="pd-profile-summary">
          <div className="pd-profile-box">
            <h2 className="pd-section-title">ملخص ملفك الطبي</h2>
            <p>
              <strong>الاسم:</strong> {profile.fullName}
            </p>
            <p>
              <strong>البريد الإلكتروني:</strong> {profile.email}
            </p>
            <p>
              <strong>رقم الهاتف:</strong> {profile.phoneNumber}
            </p>
            <p>
              <strong>الأمراض المزمنة:</strong>{" "}
              {profile.chronicDiseases.join(", ")}
            </p>
            <p>
              <strong>الحساسية:</strong> {profile.allergies.join(", ")}
            </p>
            <p>
              <strong>الأدوية الحالية:</strong>{" "}
              {profile.currentMedication.join(", ")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;
