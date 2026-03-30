import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../../../utils/Constants.ts";
import SignalRService from "../../services/SignalRService";
import "./DoctorDashboard.css";

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
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [actionLoading, setActionLoading] = useState(false);
  const [actionMsg, setActionMsg] = useState("");


  const fetchDoctorData = useCallback(async (showLoading = true) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const payload = decodeJwtPayload(token);
    if (!payload) return;

    const doctorId =
      payload[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
      ] ||
      payload.UserId ||
      payload.sub;

    if (!doctorId) return;

    if (showLoading) setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `${API_BASE}/doctor/GetInfoAndAppointments?DoctorId=${doctorId}`,
        {
          headers: {
            Accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("فشل في جلب بيانات الطبيب");

      const result = await res.json();
      if (!result.succeeded)
        throw new Error(result.message || "استجابة غير متوقعة");

      setDoctor(result.data);
    } catch (err) {
      console.error(err);
      setError("تعذر تحميل بيانات الطبيب. حاول لاحقًا.");
      setDoctor(null);
    } finally {
      if (showLoading) setLoading(false);
    }
  }, []);


  // Auth check on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/auth");

    const payload = decodeJwtPayload(token);
    if (!payload) return navigate("/auth");

    const role =
      payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
      payload.role;
    if (role !== "Doctor") return navigate("/");

    const doctorId =
      payload[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
      ] ||
      payload.UserId ||
      payload.sub;

    if (!doctorId) return navigate("/auth");

    fetchDoctorData();
  }, [navigate, fetchDoctorData]);

  // SignalR real-time updates
  useEffect(() => {
    const handleUpdate = () => {
      console.log("DoctorDashboard: SignalR update received, refreshing...");
      fetchDoctorData(false); // Don't show loading spinner for real-time updates
    };

    const startSignalR = async () => {
      await SignalRService.startConnection();
      SignalRService.on("AppointmentConfirmed", handleUpdate);
      SignalRService.on("AppointmentCancelled", handleUpdate);
    };

    startSignalR();

    return () => {
      SignalRService.off("AppointmentConfirmed", handleUpdate);
      SignalRService.off("AppointmentCancelled", handleUpdate);
    };
  }, [fetchDoctorData]);

  const openPatientModal = (patient) => {
    setSelectedPatient(patient);
    setModalOpen(true);
    setActionMsg("");
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedPatient(null);
    setActionMsg("");
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    navigate("/auth");
  };

  // ✅ Mark appointment as complete
  const handleCompleteAppointment = async () => {
    if (!selectedPatient?.appointmentId) {
      setActionMsg("رقم الموعد غير معروف.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) return navigate("/auth");

    setActionLoading(true);
    setActionMsg("");

    try {
      const res = await fetch(
        `${API_BASE}/appointment/Complete`,
        {
          method: "PUT",
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            appointmentId: selectedPatient.appointmentId,
          }),
        }
      );

      const result = await res.json();

      if (!res.ok || !result.succeeded) {
        throw new Error(result.message || "فشل تحديث الموعد");
      }

      setActionMsg("✅ تم إنهاء الموعد بنجاح");
      // refresh doctor data
      const payload = decodeJwtPayload(token);
      const doctorId =
        payload[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ] ||
        payload.UserId ||
        payload.sub;

      fetchDoctorData(doctorId, token);
    } catch (err) {
      console.error(err);
      setActionMsg("❌ حدث خطأ أثناء إنهاء الموعد");
    } finally {
      setActionLoading(false);
    }
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
              مرحباً، د.{" "}{doctor.doctorName}
            </h1>
            <p className="subtitle">هؤلاء هم مرضاك لهذا اليوم</p>
          </div>

          <div className="header-actions">
            <button 
              className="btn-ai-glow" 
              onClick={() => navigate("/doctor/ai")}
              style={{ marginLeft: "10px" }}
            >
              <i className="bi bi-stars"></i>
              <span>مساعد الذكاء الاصطناعي</span>
            </button>
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
                const time = p.appointmentDate || p.time || "";
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
                      >
                        عرض التفاصيل
                      </button>
                    </div>

                    <div className="appointment-body">
                      <div className="patient-line">
                        <div className="patient-name">{patientName}</div>
                      </div>
                      <div className="reason-line">{p.reason || "—"}</div>
                    </div>

                    <div className="appointment-time">{time}</div>
                  </div>
                );
              })}
          </div>
        </section>
      </div>

      {/* ✅ Patient Modal with Complete button */}
      {modalOpen && selectedPatient && (
        <div className="doc-modal-backdrop" onClick={closeModal}>
          <div
            className="doc-modal"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="doc-modal-header">
              <h3>تفاصيل المريض</h3>
              <button className="doc-modal-close" onClick={closeModal}>
                ✕
              </button>
            </div>

            <div className="doc-modal-body">
              <div className="doc-modal-row">
                <strong>الاسم:</strong>
                <span>{selectedPatient.patientName || "غير محدد"}</span>
              </div>
              <div className="doc-modal-row">
                <strong>الوقت:</strong>
                <span>{selectedPatient.appointmentDate || "—"}</span>
              </div>
              <div className="doc-modal-row">
                <strong>السبب:</strong>
                <span>{selectedPatient.reason || "—"}</span>
              </div>

              <div className="doc-modal-row">
                <strong>الأمراض المزمنة:</strong>
                <div className="list-inline">
                  {Array.isArray(selectedPatient.chronicDiseases) && selectedPatient.chronicDiseases.length
                    ? selectedPatient.chronicDiseases.join("، ")
                    : "لا توجد"}
                </div>
              </div>

              <div className="doc-modal-row">
                <strong>الحساسية:</strong>
                <div className="list-inline">
                  {Array.isArray(selectedPatient.allergies) && selectedPatient.allergies.length
                    ? selectedPatient.allergies.join("، ")
                    : "لا توجد"}
                </div>
              </div>

              <div className="doc-modal-row">
                <strong>الأدوية الحالية:</strong>
                <div className="list-inline">
                  {Array.isArray(selectedPatient.currentMedicine) && selectedPatient.currentMedicine.length
                    ? selectedPatient.currentMedicine.join("، ")
                    : "لا توجد"}
                </div>
              </div>

              {selectedPatient.medicalReport && (
                <div className="doc-modal-report">
                  <strong>التقرير الطبي:</strong>
                  <div className="medical-report-content">
                    {selectedPatient.medicalReport}
                  </div>
                </div>
              )}

              {actionMsg && (
                <div
                  style={{
                    marginTop: "10px",
                    color: actionMsg.includes("✅") ? "green" : "red",
                    fontWeight: "500",
                  }}
                >
                  {actionMsg}
                </div>
              )}
            </div>

            <div className="doc-modal-footer">
              <button
                className="btn-primary"
                onClick={handleCompleteAppointment}
                disabled={actionLoading}
              >
                {actionLoading ? "جارٍ الإنهاء..." : "إنهاء الموعد"}
              </button>
              <button className="btn-ghost" onClick={closeModal}>
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
