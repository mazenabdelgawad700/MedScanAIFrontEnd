import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DoctorDashboard.css";

// safe JWT decode (returns payload or null)
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

export default function DoctorDashboard() {
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null); // for modal
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/auth");

    const payload = decodeJwtPayload(token);
    if (!payload) return navigate("/auth");

    const role =
      payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
      payload.role;
    if (role !== "Doctor") return navigate("/");

    // try different claim names for user id
    const doctorId =
      payload[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
      ] ||
      payload.UserId ||
      payload.sub;

    if (!doctorId) return navigate("/auth");

    fetchDoctorData(doctorId, token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const fetchDoctorData = async (doctorId, token) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `https://localhost:7196/api/doctor/GetInfoAndAppointments?DoctorId=${doctorId}`,
        {
          headers: {
            Accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("فشل في جلب بيانات الطبيب");
      }

      const result = await res.json();
      if (!result.succeeded) {
        throw new Error(result.message || "استجابة غير متوقعة");
      }

      setDoctor(result.data);
    } catch (err) {
      console.error(err);
      setError("تعذر تحميل بيانات الطبيب. حاول لاحقًا.");
      setDoctor(null);
    } finally {
      setLoading(false);
    }
  };

  const openPatientModal = (patient) => {
    setSelectedPatient(patient);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedPatient(null);
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="docroot" dir="rtl">
        <div className="container">
          <div className="header-skeleton" />
          <div className="center-msg">جاري التحميل...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="docroot" dir="rtl">
        <div className="container">
          <div className="header">
            <div>
              <h1>لوحة تحكم الطبيب</h1>
              <p className="subtitle">تسجيل الدخول مطلوب</p>
            </div>
            <div className="header-actions">
              <button className="btn-ghost" onClick={handleSignOut}>
                تسجيل الخروج
              </button>
            </div>
          </div>

          <div className="center-msg error">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="docroot" dir="rtl">
      <div className="container">
        <div className="header">
          <div>
            <h1>
              مرحباً، د.{" "}
              <span className="doctor-name">{doctor.doctorName}</span>
            </h1>
            <p className="subtitle">هؤلاء هم مرضاك لهذا اليوم</p>
          </div>

          <div className="header-actions">
            <button className="btn-ghost" onClick={handleSignOut}>
              تسجيل الخروج
            </button>
          </div>
        </div>

        {/* stats */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-icon">📅</div>
            <div className="stat-body">
              <div className="stat-title">مرضى اليوم</div>
              <div className="stat-value">{doctor.patients?.length || 0}</div>
            </div>
          </div>
        </div>

        {/* appointments list */}
        <section className="appointments-section">
          <div className="appointments-header">
            <h2>مواعيد اليوم</h2>
            <div className="appointments-meta">
              <div className="date-pill">
                {/* formatted date like 29/10/2025 */}
                {new Date().getDate()}/{new Date().getMonth() + 1}/
                {new Date().getFullYear()}
              </div>
            </div>
          </div>

          <div className="appointments-card">
            {(!doctor.patients || doctor.patients.length === 0) && (
              <div className="empty">لا توجد مواعيد اليوم.</div>
            )}

            {doctor.patients &&
              doctor.patients.map((p, idx) => {
                // Some responses might use appointmentDate, some appointmentDate/time names —
                const time =
                  p.appointmentDate || p.time || p.AppointmentDate || "";
                const patientName =
                  p.patientName || p.patientName === ""
                    ? p.patientName
                    : "زائر";
                return (
                  <div key={idx} className="appointment-row">
                    <div className="appointment-left">
                      <button
                        className="details-btn"
                        onClick={() => openPatientModal(p)}
                        aria-label="عرض التفاصيل"
                      >
                        عرض التفاصيل
                      </button>
                    </div>

                    <div className="appointment-body">
                      <div className="patient-line">
                        <div className="patient-name">
                          {patientName}
                        </div>
                        <div className="badges">
                          {/* sample badges depending on flags */}
                          {p.hasAiReport && (
                            <span className="badge ai">AI تقرير</span>
                          )}
                          {p.hasMedicationWarning && (
                            <span className="badge warn">تحذير دوائي</span>
                          )}
                        </div>
                      </div>

                      <div className="reason-line">{p.reason || "—"}</div>

                      <div className="meta-line">
                        <div className="blood-type">
                          {p.bloodType ? `فصيلة الدم: ${p.bloodType}` : ""}
                        </div>
                        <div className="status">{p.status ? p.status : ""}</div>
                      </div>
                    </div>

                    <div className="appointment-time">{time}</div>
                  </div>
                );
              })}
          </div>
        </section>
      </div>

      {/* Patient Modal */}
      {modalOpen && selectedPatient && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>تفاصيل المريض</h3>
              <button
                className="modal-close"
                onClick={closeModal}
                aria-label="إغلاق"
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="modal-row">
                <strong>الاسم:</strong>
                <span>{selectedPatient.patientName || "غير محدد"}</span>
              </div>
              <div className="modal-row">
                <strong>الوقت:</strong>
                <span>
                  {selectedPatient.appointmentDate ||
                    selectedPatient.time ||
                    "—"}
                </span>
              </div>
              <div className="modal-row">
                <strong>السبب:</strong>
                <span>{selectedPatient.reason || "—"}</span>
              </div>

              <div className="modal-row">
                <strong>الأمراض المزمنة:</strong>
                <div className="list-inline">
                  {selectedPatient.chronicDiseases &&
                  selectedPatient.chronicDiseases.length > 0
                    ? selectedPatient.chronicDiseases.join("، ")
                    : "لا توجد"}
                </div>
              </div>

              <div className="modal-row">
                <strong>الحساسية:</strong>
                <div className="list-inline">
                  {selectedPatient.allergies &&
                  selectedPatient.allergies.length > 0
                    ? selectedPatient.allergies.join("، ")
                    : "لا توجد"}
                </div>
              </div>

              <div className="modal-row">
                <strong>الأدوية الحالية:</strong>
                <div className="list-inline">
                  {selectedPatient.currentMedicine &&
                  selectedPatient.currentMedicine.length > 0
                    ? selectedPatient.currentMedicine.join("، ")
                    : "لا توجد"}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-primary" onClick={closeModal}>
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
