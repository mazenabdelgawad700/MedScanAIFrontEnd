import React, { useEffect, useState } from "react";
import "./MedicalProfile.css";
import { Link } from "react-router-dom";

const MedicalProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  const getUserIdFromToken = (token) => {
    try {
      const base64Payload = token.split(".")[1];
      const payload = JSON.parse(atob(base64Payload));
      return payload.UserId;
    } catch (error) {
      console.error("Error parsing token:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!token) {
          setError("User not authenticated");
          setLoading(false);
          return;
        }

        const userId = getUserIdFromToken(token);
        if (!userId) {
          setError("Invalid token");
          setLoading(false);
          return;
        }

        const response = await fetch(
          "https://localhost:7196/api/patient/GetProfile",
          {
            method: "POST",
            headers: {
              Authorization: `bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              patientId: userId,
            }),
          }
        );

        const data = await response.json();
        if (data.succeeded) {
          setProfile(data.data);
        } else {
          setError("Failed to fetch profile data");
        }
      } catch (err) {
        setError("Error fetching profile data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  if (loading) {
    return <div className="medical-profile">جاري التحميل...</div>;
  }

  if (error) {
    return <div className="medical-profile">حدث خطأ: {error}</div>;
  }

  if (!profile) {
    return <div className="medical-profile">لم يتم العثور على بيانات</div>;
  }

  return (
    <div className="medical-profile">
      <div className="header">
        <h2 className="section-title">الملف الطبي</h2>
        <Link to="/patient/dashboard" className="back-link">
          العودة إلى لوحة التحكم ←
        </Link>
      </div>

      <div className="profile-container">
        <h3 className="subtitle">المعلومات الشخصية</h3>
        <div className="personal-info">
          <div className="info-row">
            <span className="info-label">الاسم:</span>
            <span className="info-value">{profile.fullName}</span>
          </div>
          <div className="info-row">
            <span className="info-label">البريد الإلكتروني:</span>
            <span className="info-value">{profile.email}</span>
          </div>
          <div className="info-row">
            <span className="info-label">جهة الاتصال في حالات الطوارئ:</span>
            <span className="info-value">{profile.phoneNumber}</span>
          </div>
        </div>

        <div className="medical-section">
          <h3>الامراض المزمنة</h3>
          <div className="medical-tags">
            {profile.chronicDiseases.map((disease, index) => (
              <span key={index} className="medical-tag">
                {disease}
              </span>
            ))}
          </div>
        </div>

        <div className="medical-section">
          <h3>الحساسية</h3>
          <div className="medical-tags">
            {profile.allergies.map((allergy, index) => (
              <span key={index} className="medical-tag allergy">
                {allergy}
              </span>
            ))}
          </div>
        </div>

        <div className="medical-section">
          <h3>الأدوية الحالية</h3>
          <div className="medical-tags">
            {profile.currentMedication.map((medication, index) => (
              <span key={index} className="medical-tag medication">
                {medication}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalProfile;
