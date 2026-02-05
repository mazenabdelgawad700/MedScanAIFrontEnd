import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ConfirmModal } from "../../components/common";
import { getToken, getUserId } from "../../utils/auth";
import { formatDate, formatTime, isToday } from "../../utils/formatters";
import { API_BASE } from "../../utils/constants";
import SignalRService from "../../services/SignalRService";
import "./Appointments.css";

/** Returns CSS class for appointment status styling */
const getStatusClass = (status) => {
  const classMap = {
    pending: "status-pending",
    confirmed: "status-confirmed",
    completed: "status-completed",
  };
  return classMap[status?.toLowerCase()] || "status-cancelled";
};

/** Translates status to Arabic */
const translateStatus = (status) => {
  const statusMap = {
    pending: "قيد الانتظار",
    confirmed: "مؤكد",
    completed: "مكتمل",
    cancelled: "ملغي",
  };
  return statusMap[status?.toLowerCase()] || status;
};

const Appointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedAptId, setSelectedAptId] = useState(null);

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
        // SignalR notification
        try {
          await SignalRService.invoke("AppointmentCancelled", selectedAptId);
        } catch (e) {
          console.error("SignalR Notify Error", e);
        }
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

  const todayAppointments = appointments.filter((apt) => isToday(apt.date));
  const otherAppointments = appointments.filter((apt) => !isToday(apt.date));

  /** Appointment card component */
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
              <span className="apt-spinner"></span>
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
        <div className="apt-hero-content">
          <div>
            <h1>مواعيدي</h1>
            <p className="apt-sub">تابع حالة مواعيدك الطبية القادمة والسابقة</p>
          </div>
          <button
            className="apt-back-btn"
            onClick={() => navigate("/patient/dashboard")}
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

      {/* Cancel Confirmation Modal */}
      <ConfirmModal
        show={showModal}
        title="تأكيد الإلغاء"
        message={
          <>
            هل أنت متأكد من أنك تريد إلغاء هذا الموعد؟ <br />
            لا يمكن التراجع عن هذا الإجراء.
          </>
        }
        confirmText={
          <>
            <i className="bi bi-x-circle"></i>
            تأكيد الإلغاء
          </>
        }
        cancelText="تراجع"
        onConfirm={executeCancel}
        onCancel={() => setShowModal(false)}
        variant="danger"
      />
    </div>
  );
};

export default Appointments;
