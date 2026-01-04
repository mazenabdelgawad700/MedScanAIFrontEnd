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

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth");
  };

  return (
    <div className="pd-page">
      <div className="pd-hero">
        <div className="pd-hero-content">
          <div>
            <h1>مرحبًا بعودتك {profile?.fullName}</h1>
            <p className="pd-sub">كيف يمكننا مساعدتك اليوم؟</p>
          </div>
          <button className="pd-logout-btn" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right"></i>
            تسجيل الخروج
          </button>
        </div>
      </div>

      <div className="pd-grid">
        {/* <Card
          title="الملف الطبي"
          subtitle="اعرض وحدث معلوماتك الطبية"
          icon={<span className="pd-ico">👤</span>}
          onClick={() => navigate("/patient/medical-profile")}
        /> */}
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
          <h2 className="pd-section-title">ملخص ملفك الطبي</h2>
          
          <div className="pd-profile-grid">
            {/* Personal Info Card - Clickable */}
            <div 
              className="pd-info-card pd-info-card-clickable"
              onClick={() => navigate("/patient/update-profile")}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && navigate("/patient/update-profile")}
            >
              <div className="pd-info-header">
                <i className="bi bi-person-circle pd-info-icon"></i>
                <h3>المعلومات الشخصية</h3>
                <i className="bi bi-pencil-square pd-edit-icon"></i>
              </div>
              <div className="pd-info-content">
                <div className="pd-info-item">
                  <i className="bi bi-person-fill"></i>
                  <div>
                    <span className="pd-info-label">الاسم</span>
                    <span className="pd-info-value">{profile.fullName}</span>
                  </div>
                </div>
                <div className="pd-info-item">
                  <i className="bi bi-envelope-fill"></i>
                  <div>
                    <span className="pd-info-label">البريد الإلكتروني</span>
                    <span className="pd-info-value">{profile.email}</span>
                  </div>
                </div>
                <div className="pd-info-item">
                  <i className="bi bi-telephone-fill"></i>
                  <div>
                    <span className="pd-info-label">رقم الهاتف</span>
                    <span className="pd-info-value">{profile.phoneNumber}</span>
                  </div>
                </div>
              </div>
              <div className="pd-edit-hint">
                <i className="bi bi-pencil"></i>
                اضغط للتعديل
              </div>
            </div>

            {/* Medical Info Card */}
            <div className="pd-info-card">
              <div className="pd-info-header">
                <i className="bi bi-heart-pulse pd-info-icon"></i>
                <h3>المعلومات الطبية</h3>
              </div>
              <div className="pd-info-content">
                <div className="pd-info-item">
                  <i className="bi bi-clipboard2-pulse"></i>
                  <div>
                    <span className="pd-info-label">الأمراض المزمنة</span>
                    <div className="pd-tags">
                      {profile.chronicDiseases && profile.chronicDiseases.length > 0 ? (
                        profile.chronicDiseases.map((disease, idx) => (
                          <span key={idx} className="pd-tag pd-tag-danger">{disease}</span>
                        ))
                      ) : (
                        <span className="pd-info-value text-muted">لا يوجد</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="pd-info-item">
                  <i className="bi bi-exclamation-triangle"></i>
                  <div>
                    <span className="pd-info-label">الحساسية</span>
                    <div className="pd-tags">
                      {profile.allergies && profile.allergies.length > 0 ? (
                        profile.allergies.map((allergy, idx) => (
                          <span key={idx} className="pd-tag pd-tag-warning">{allergy}</span>
                        ))
                      ) : (
                        <span className="pd-info-value text-muted">لا يوجد</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="pd-info-item">
                  <i className="bi bi-capsule"></i>
                  <div>
                    <span className="pd-info-label">الأدوية الحالية</span>
                    <div className="pd-tags">
                      {profile.currentMedication && profile.currentMedication.length > 0 ? (
                        profile.currentMedication.map((med, idx) => (
                          <span key={idx} className="pd-tag pd-tag-info">{med}</span>
                        ))
                      ) : (
                        <span className="pd-info-value text-muted">لا يوجد</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;
