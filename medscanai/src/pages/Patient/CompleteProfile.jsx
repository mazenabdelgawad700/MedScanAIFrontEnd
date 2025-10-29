import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CompleteProfile.css";

// Helper to decode JWT and extract role
function decodeJwtPayload(token) {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const pad = payload.length % 4;
    const padded = pad ? payload + "=".repeat(4 - pad) : payload;
    const json = atob(padded);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

const CompleteProfile = () => {
  const navigate = useNavigate();
  const [chronicDiseases, setChronicDiseases] = useState([""]);
  const [allergies, setAllergies] = useState([""]);
  const [currentMedication, setCurrentMedication] = useState([""]);
  // aiReport kept for potential backend flag later; currently unused in UI
  // eslint-disable-next-line no-unused-vars
  const [aiReport] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Only allow logged-in patients
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/auth");
    const payload = decodeJwtPayload(token);
    if (!payload) {
      localStorage.removeItem("token");
      return navigate("/auth");
    }
    const role =
      payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
      payload.role;
    const exp = payload.exp;
    const now = Math.floor(Date.now() / 1000);
    if (exp && exp < now) {
      localStorage.removeItem("token");
      return navigate("/auth");
    }
    if (role !== "Patient") return navigate("/auth");
  }, [navigate]);

  // Handlers for dynamic array fields
  const handleArrayChange = (setter, arr, idx, value) => {
    const updated = arr.slice();
    updated[idx] = value;
    setter(updated);
  };

  const handleAddField = (setter, arr) => {
    setter([...arr, ""]);
  };

  const handleRemoveField = (setter, arr, idx) => {
    if (arr.length === 1) return;
    const updated = arr.slice();
    updated.splice(idx, 1);
    setter(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);
    try {
      const token = localStorage.getItem("token");
      const payload = decodeJwtPayload(token);
      const patientId = payload && (payload.UserId || payload.userId);
      if (!patientId) throw new Error("لم يتم العثور على معرف المستخدم.");
      // build body but do not include empty arrays to avoid sending empty arrays to server
      const body = { patientId };
      const cd = chronicDiseases.map((v) => v.trim()).filter((v) => v !== "");
      const cm = currentMedication.map((v) => v.trim()).filter((v) => v !== "");
      const al = allergies.map((v) => v.trim()).filter((v) => v !== "");
      if (cd.length > 0) body.chronicDiseases = cd;
      if (cm.length > 0) body.currentMedication = cm;
      if (al.length > 0) body.allergies = al;
      const res = await fetch(
        "https://localhost:7196/api/patient/CreateProfile",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        }
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "فشل حفظ البيانات. حاول مرة أخرى.");
      }
      setSuccess(true);
      // after successful profile creation, navigate to dashboard
      navigate("/patient/dashboard");
    } catch (err) {
      setError(err.message || "فشل حفظ البيانات. حاول مرة أخرى.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="complete-profile-bg">
      <div className="complete-profile-card">
        <div className="profile-header">
          <img
            src="/assets/logo.svg"
            alt="logo"
            className="profile-logo"
            style={{ width: 48, height: 48 }}
          />
          <h2>أكمل ملفك الطبي</h2>
          <div className="profile-subtitle">
            دعنا نقوم بإعداد معلوماتك الطبية
          </div>
        </div>
        <form className="profile-form" onSubmit={handleSubmit}>
          <div className="profile-section-title">المعلومات الطبية</div>
          {/* Chronic Diseases */}
          <div className="profile-field-group">
            <label className="profile-label">الأمراض المزمنة</label>
            <button
              type="button"
              className="profile-add-btn"
              onClick={() =>
                handleAddField(setChronicDiseases, chronicDiseases)
              }
              tabIndex={-1}
              style={{ marginBottom: "8px", alignSelf: "flex-start" }}
            >
              إضافة
            </button>
            {chronicDiseases.map((val, idx) => (
              <div className="profile-row" key={idx}>
                <input
                  type="text"
                  className="profile-input"
                  placeholder="مثال: السكري، ارتفاع ضغط الدم"
                  value={val}
                  onChange={(e) =>
                    handleArrayChange(
                      setChronicDiseases,
                      chronicDiseases,
                      idx,
                      e.target.value
                    )
                  }
                  autoComplete="off"
                />
                {chronicDiseases.length > 1 && (
                  <button
                    type="button"
                    className="profile-remove-btn profile-remove-btn-red"
                    onClick={() =>
                      handleRemoveField(
                        setChronicDiseases,
                        chronicDiseases,
                        idx
                      )
                    }
                    tabIndex={-1}
                  >
                    حذف
                  </button>
                )}
              </div>
            ))}
          </div>
          {/* Allergies */}
          <div className="profile-field-group">
            <label className="profile-label">الحساسية</label>
            <button
              type="button"
              className="profile-add-btn"
              onClick={() => handleAddField(setAllergies, allergies)}
              tabIndex={-1}
              style={{ marginBottom: "8px", alignSelf: "flex-start" }}
            >
              إضافة
            </button>
            {allergies.map((val, idx) => (
              <div className="profile-row" key={idx}>
                <input
                  type="text"
                  className="profile-input"
                  placeholder="مثال: البنسلين، الفول السوداني"
                  value={val}
                  onChange={(e) =>
                    handleArrayChange(
                      setAllergies,
                      allergies,
                      idx,
                      e.target.value
                    )
                  }
                  autoComplete="off"
                />
                {allergies.length > 1 && (
                  <button
                    type="button"
                    className="profile-remove-btn profile-remove-btn-red"
                    onClick={() =>
                      handleRemoveField(setAllergies, allergies, idx)
                    }
                    tabIndex={-1}
                  >
                    حذف
                  </button>
                )}
              </div>
            ))}
          </div>
          {/* Current Medication */}
          <div className="profile-field-group">
            <label className="profile-label">الأدوية الحالية</label>
            <button
              type="button"
              className="profile-add-btn"
              onClick={() =>
                handleAddField(setCurrentMedication, currentMedication)
              }
              tabIndex={-1}
              style={{ marginBottom: "8px", alignSelf: "flex-start" }}
            >
              إضافة
            </button>
            {currentMedication.map((val, idx) => (
              <div className="profile-row" key={idx}>
                <input
                  type="text"
                  className="profile-input"
                  placeholder="مثال: ميتفورمين، استينوبريل"
                  value={val}
                  onChange={(e) =>
                    handleArrayChange(
                      setCurrentMedication,
                      currentMedication,
                      idx,
                      e.target.value
                    )
                  }
                  autoComplete="off"
                />
                {currentMedication.length > 1 && (
                  <button
                    type="button"
                    className="profile-remove-btn profile-remove-btn-red"
                    onClick={() =>
                      handleRemoveField(
                        setCurrentMedication,
                        currentMedication,
                        idx
                      )
                    }
                    tabIndex={-1}
                  >
                    حذف
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className="profile-info-box">
            <div className="profile-info-text">
              <strong>تقرير تحذير الأدوية بالذكاء الاصطناعي:</strong>
              &nbsp;بمجرد إكمال ملفك الشخصي، سيقوم الذكاء الاصطناعي تلقائياً
              بإنشاء تقرير تحذير الأدوية لطبيبك. سيكون هذا التقرير متاحاً للطبيب
              أثناء المواعيد.
            </div>
            <div className="profile-info-icon" aria-hidden>
              ✓
            </div>
          </div>
          {error && <div className="profile-error">{error}</div>}
          {success && (
            <div className="profile-success">تم حفظ البيانات بنجاح!</div>
          )}
          <div className="buttons">
            <button
              className="btn btn-danger"
              type="button"
              onClick={() => navigate("/patient/dashboard")}
            >
              لدي ملف تعريفي بالفعل
            </button>

            <button
              type="submit"
              className="profile-submit-btn"
              disabled={submitting}
            >
              {submitting ? "جارٍ الحفظ..." : "إكمال الملف الشخصي"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfile;
