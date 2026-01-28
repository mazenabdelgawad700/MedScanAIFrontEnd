import React, { useEffect, useState } from "react";
import { API_BASE } from "../../../utils/Constants.ts";
import "./Appointments.css";
import { useNavigate } from "react-router-dom";

const Appointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [selectedAptId, setSelectedAptId] = useState(null);

  const getToken = () => localStorage.getItem("token");

  const getUserId = () => {
    const token = getToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.UserId;
    } catch (e) {
      console.error("Error decoding token", e);
      return null;
    }
  };

  const fetchAppointments = async () => {
    try {
      const userId = getUserId();
      if (!userId) return;

      const response = await fetch(
        `${API_BASE}/appointment/GetPatientAppointments?PatientId=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            accept: "*/*",
          },
        }
      );

      const data = await response.json();
      if (data.succeeded) {
        setAppointments(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch appointments", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCancelClick = (appointmentId) => {
    setSelectedAptId(appointmentId);
    setShowModal(true);
  };

  const executeCancel = async () => {
    if (!selectedAptId) return;
    
    setCancellingId(selectedAptId);
    // Close modal immediately or keep it open with loading state?
    // Let's close it and show loading on the card button or just keep modal open with loading.
    // The user wants UI standards. Dashboard usually shows loading in modal.
    // But here the button on card has loading spinner logic `cancellingId === apt.appointmentId`.
    // Let's simple close modal and let card show spinner or keep modal open.
    // Let's close modal and let the card show the spinner (existing logic).
    setShowModal(false);

    try {
      const response = await fetch(`${API_BASE}/appointment/Cancel`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
          accept: "*/*",
        },
        body: JSON.stringify({ appointmentId: selectedAptId }),
      });

      if (response.ok) {
        // Refresh list
        await fetchAppointments();
      } else {
        alert("فشل إلغاء الموعد. حاول مرة أخرى.");
      }
    } catch (error) {
      console.error("Error cancelling appointment", error);
      alert("حدث خطأ أثناء الإلغاء.");
    } finally {
      setCancellingId(null);
      setSelectedAptId(null);
    }
  };

  const isToday = (dateString) => {
    const d = new Date(dateString);
    const today = new Date();
    return (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  };

  const todayAppointments = appointments.filter((apt) => isToday(apt.date));
  const otherAppointments = appointments.filter((apt) => !isToday(apt.date));

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "status-pending";
      case "confirmed":
        return "status-confirmed";
      case "completed":
        return "status-completed";
      default:
        return "status-cancelled";
    }
  };

  const translateStatus = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "قيد الانتظار";
      case "confirmed":
        return "مؤكد";
      case "completed":
        return "مكتمل";
      case "cancelled":
        return "ملغي";
      default:
        return status;
    }
  };

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleDateString("ar-EG", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleTimeString("ar-EG", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const AppointmentCard = ({ apt, showCancel }) => (
    <div className="apt-card">
      <div className="apt-card-header">
        <div className="apt-card-date">
          <i className="bi bi-calendar-event"></i>
          <span>{formatDate(apt.date)}</span>
        </div>
        <span className={`apt-card-status ${getStatusClass(apt.status)}`}>
          {translateStatus(apt.status)}
        </span>
      </div>
      <div className="apt-card-body">
        <div className="apt-info-row">
          <i className="bi bi-clock"></i>
          <div>
            <span className="apt-info-label">الوقت</span>
            <span className="apt-info-value">{formatTime(apt.date)}</span>
          </div>
        </div>
        <div className="apt-info-row">
          <i className="bi bi-chat-text"></i>
          <div>
            <span className="apt-info-label">سبب الزيارة</span>
            <span className="apt-info-value">{apt.reason}</span>
          </div>
        </div>
        <div className="apt-info-row">
          <i className="bi bi-person"></i>
          <div>
            <span className="apt-info-label">اسم المريض</span>
            <span className="apt-info-value">{apt.patientName}</span>
          </div>
        </div>
      </div>
      {showCancel && apt.status === "Pending" && (
        <div className="apt-card-actions">
          <button
            className="apt-cancel-btn"
            onClick={() => handleCancelClick(apt.appointmentId)}
            disabled={cancellingId === apt.appointmentId}
          >
            {cancellingId === apt.appointmentId ? (
              <span className="apt-spinner" style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff' }}></span>
            ) : (
              <i className="bi bi-x-circle"></i>
            )}
            إلغاء الموعد
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="apt-page">
      <div className="apt-hero">
        <div className="apt-hero-content" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>مواعيدي</h1>
            <p className="apt-sub">تابع حالة مواعيدك الطبية القادمة والسابقة</p>
          </div>
          <button 
            className="apt-back-btn" 
            onClick={() => navigate("/patient/dashboard")}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: '600',
              transition: 'all 0.2s',
              width: 'fit-content',
            }}
          >
            <i className="bi bi-arrow-right"></i>
            العودة الي لوحة التحكم 
          </button>
        </div>
      </div>

      {loading ? (
        <div className="apt-loading">
          <div className="apt-spinner"></div>
        </div>
      ) : (
        <>
          <div className="apt-section">
            <h2 className="apt-section-title">
              <i className="bi bi-calendar-check"></i>
              مواعيد اليوم
            </h2>
            <div className="apt-grid">
              {todayAppointments.length > 0 ? (
                todayAppointments.map((apt) => (
                  <AppointmentCard
                    key={apt.appointmentId}
                    apt={apt}
                    showCancel={true}
                  />
                ))
              ) : (
                <div className="apt-empty">
                  <i className="bi bi-calendar-x"></i>
                  لا توجد مواعيد لهذا اليوم
                </div>
              )}
            </div>
          </div>

          <div className="apt-section">
            <h2 className="apt-section-title">
              <i className="bi bi-clock-history"></i>
              سجل المواعيد
            </h2>
            <div className="apt-grid">
              {otherAppointments.length > 0 ? (
                otherAppointments.map((apt) => (
                  <AppointmentCard
                    key={apt.appointmentId}
                    apt={apt}
                    showCancel={false}
                  />
                ))
              ) : (
                <div className="apt-empty">
                  <i className="bi bi-inbox"></i>
                  لا توجد مواعيد أخرى
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Confirmation Modal */}
      {showModal && (
        <div className="apt-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="apt-modal" onClick={(e) => e.stopPropagation()}>
            <div className="apt-modal-icon">
              <i className="bi bi-exclamation-triangle-fill"></i>
            </div>
            <h3 className="apt-modal-title">تأكيد الإلغاء</h3>
            <p className="apt-modal-message">
              هل أنت متأكد من أنك تريد إلغاء هذا الموعد؟ <br />
              لا يمكن التراجع عن هذا الإجراء.
            </p>
            <div className="apt-modal-actions">
              <button
                className="apt-modal-btn apt-modal-btn-cancel"
                onClick={() => setShowModal(false)}
              >
                تراجع
              </button>
              <button
                className="apt-modal-btn apt-modal-btn-delete"
                onClick={executeCancel}
              >
                <i className="bi bi-x-circle"></i>
                تأكيد الإلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
