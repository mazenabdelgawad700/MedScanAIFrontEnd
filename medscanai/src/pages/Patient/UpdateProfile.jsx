import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UpdateProfile.css";

const UpdateProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    id: "",
    fullName: "",
    email: "",
    phoneNumber: "",
    gender: "",
    dateOfBirth: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/auth");
          return;
        }

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
        if (data.succeeded) {
          setFormData({
            id: userId,
            fullName: data.data.fullName || "",
            email: data.data.email || "",
            phoneNumber: data.data.phoneNumber || "",
            gender: data.data.gender || "",
            dateOfBirth: data.data.dateOfBirth
              ? data.data.dateOfBirth.split("T")[0]
              : "",
          });
        } else {
          setError("فشل في تحميل البيانات");
        }
      } catch (err) {
        console.error("Failed to load profile", err);
        setError("حدث خطأ أثناء تحميل البيانات");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/auth");
        return;
      }

      const response = await fetch(
        "https://localhost:7196/api/patient/UpdateProfile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      if (data.succeeded || response.ok) {
        setSuccess("تم تحديث البيانات بنجاح");
        setTimeout(() => {
          navigate("/patient/dashboard");
        }, 1500);
      } else {
        setError(data.message || "فشل في تحديث البيانات");
      }
    } catch (err) {
      console.error("Failed to update profile", err);
      setError("حدث خطأ أثناء تحديث البيانات");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="up-page">
        <div className="up-loading">
          <div className="up-spinner"></div>
          <p>جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="up-page">
      <div className="up-container">
        <div className="up-header">
          <button className="up-back-btn" onClick={() => navigate("/patient/dashboard")}>
            <i className="bi bi-arrow-right"></i>
            العودة للوحة التحكم
          </button>
          <div className="up-title-section">
            <i className="bi bi-person-gear up-title-icon"></i>
            <div>
              <h1>تحديث الملف الشخصي</h1>
              <p>قم بتحديث معلوماتك الشخصية</p>
            </div>
          </div>
        </div>

        <form className="up-form" onSubmit={handleSubmit}>
          {error && (
            <div className="up-alert up-alert-error">
              <i className="bi bi-exclamation-circle"></i>
              {error}
            </div>
          )}
          {success && (
            <div className="up-alert up-alert-success">
              <i className="bi bi-check-circle"></i>
              {success}
            </div>
          )}

          <div className="up-form-grid">
            <div className="up-form-group">
              <label htmlFor="fullName">
                <i className="bi bi-person-fill"></i>
                الاسم الكامل
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="أدخل الاسم الكامل"
                required
              />
            </div>

            <div className="up-form-group">
              <label htmlFor="email">
                <i className="bi bi-envelope-fill"></i>
                البريد الإلكتروني
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="أدخل البريد الإلكتروني"
                required
              />
            </div>

            <div className="up-form-group">
              <label htmlFor="phoneNumber">
                <i className="bi bi-telephone-fill"></i>
                رقم الهاتف
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="أدخل رقم الهاتف"
                required
              />
            </div>

            <div className="up-form-group">
              <label htmlFor="gender">
                <i className="bi bi-gender-ambiguous"></i>
                الجنس
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">اختر الجنس</option>
                <option value="Male">ذكر</option>
                <option value="Female">أنثى</option>
              </select>
            </div>

            <div className="up-form-group up-form-group-full">
              <label htmlFor="dateOfBirth">
                <i className="bi bi-calendar-event"></i>
                تاريخ الميلاد
              </label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="up-form-actions">
            <button
              type="button"
              className="up-btn up-btn-secondary"
              onClick={() => navigate("/patient/dashboard")}
            >
              <i className="bi bi-x-lg"></i>
              إلغاء
            </button>
            <button
              type="submit"
              className="up-btn up-btn-primary"
              disabled={saving}
            >
              {saving ? (
                <>
                  <span className="up-btn-spinner"></span>
                  جاري الحفظ...
                </>
              ) : (
                <>
                  <i className="bi bi-check-lg"></i>
                  حفظ التغييرات
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;
