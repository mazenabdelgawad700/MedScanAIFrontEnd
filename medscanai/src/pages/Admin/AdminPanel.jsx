import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getToken, decodeJwtPayload, isTokenExpired, getAuthHeaders } from "../../utils/auth";
import { formatTodayDate } from "../../utils/formatters";
import { API_BASE } from "../../utils/constants";
import SignalRService from "../../services/SignalRService";
import "./AdminPanel.css";

const AdminPanel = () => {
  const navigate = useNavigate();

  // Auth check on mount
  useEffect(() => {
    const token = getToken();
    if (!token) return navigate("/auth");
    
    const payload = decodeJwtPayload(token);
    if (!payload) {
      localStorage.removeItem("token");
      return navigate("/auth");
    }
    
    const role = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || payload.role;
    
    if (isTokenExpired()) {
      localStorage.removeItem("token");
      return navigate("/auth");
    }
    
    if (role !== "Admin") return navigate("/");
  }, [navigate]);

  // Doctor counts
  const [doctorsCount, setDoctorsCount] = useState("—");
  const [activeDoctorsCount, setActiveDoctorsCount] = useState("—");

  const fetchCounts = async () => {
    try {
      const headers = getAuthHeaders();

      const [allRes, activeRes] = await Promise.all([
        fetch(`${API_BASE}/doctor/GetCount`, { headers }),
        fetch(`${API_BASE}/doctor/GetActiveCount`, { headers }),
      ]);

      if (allRes.ok) {
        const a = await allRes.json();
        setDoctorsCount(a?.data ?? "—");
      }
      if (activeRes.ok) {
        const b = await activeRes.json();
        setActiveDoctorsCount(b?.data ?? "—");
      }
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    fetchCounts();
    const onCounts = () => fetchCounts();
    window.addEventListener("countsUpdated", onCounts);
    return () => window.removeEventListener("countsUpdated", onCounts);
  }, []);

  // Today's Appointments
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(true);

  const fetchTodayAppointments = async () => {
    try {
      setAppointmentsLoading(true);
      const token = getToken();
      const res = await fetch(`${API_BASE}/appointment/GetForToday`, {
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!res.ok) throw new Error("فشل في تحميل مواعيد اليوم");
      
      const result = await res.json();
      if (result.succeeded && Array.isArray(result.data)) {
        setTodayAppointments(result.data);
      } else {
        setTodayAppointments([]);
      }
    } catch (err) {
      console.error(err);
      setTodayAppointments([]);
    } finally {
      setAppointmentsLoading(false);
    }
  };

  useEffect(() => {
    fetchTodayAppointments();
  }, []);

  // SignalR real-time updates
  useEffect(() => {
    const handleUpdate = () => {
      console.log("AdminPanel: SignalR update received, refreshing...");
      fetchCounts();
      fetchTodayAppointments();
    };

    const startSignalR = async () => {
      await SignalRService.startConnection();
      SignalRService.on("AppointmentCreated", handleUpdate);
      SignalRService.on("AppointmentCancelled", handleUpdate);
    };

    startSignalR();

    return () => {
      SignalRService.off("AppointmentCreated", handleUpdate);
      SignalRService.off("AppointmentCancelled", handleUpdate);
    };
  }, []);

  const [confirmingId, setConfirmingId] = useState(null);
  const [confirmedIds, setConfirmedIds] = useState([]);

  const handleConfirmAppointment = async (appointmentId) => {
    if (!appointmentId) return;

    setConfirmingId(appointmentId);

    try {
      const token = getToken();
      if (!token) {
        setConfirmingId(null);
        return navigate("/auth");
      }

      const res = await fetch(`${API_BASE}/appointment/Confirm`, {
        method: "POST",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ appointmentId }),
      });

      const result = await res.json();

      if (res.ok && result.succeeded) {
        setConfirmedIds((prev) => [...prev, appointmentId]);
      } else {
        console.error("فشل في تأكيد الموعد:", result.message);
      }
    } catch (err) {
      console.error("Error confirming appointment:", err);
    } finally {
      setConfirmingId(null);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    navigate("/auth");
  };

  return (
    <div className="admin-panel-page">
      <div className="admin-panel-card">
        <header className="admin-panel-header">
          <div>
            <h1>لوحة تحكم المدير</h1>
            <p className="sub">نظرة عامة على النظام والإجراءات السريعة</p>
          </div>
          <button onClick={handleSignOut} className="logout-btn">
            <i className="bi bi-box-arrow-left ms-2"></i>
            تسجيل الخروج
          </button>
        </header>

        {/* KPI Stats Grid */}
        <section className="stats-grid">
          <div
            className="stat-card-admin blue clickable"
            onClick={() => navigate("/admin/doctors")}
          >
            <div className="icon-wrapper">
              <i className="bi bi-person-badge-fill"></i>
            </div>
            <div className="stat-body">
              <div className="stat-title">الأطباء المسجلون</div>
              <div className="stat-value">{doctorsCount}</div>
            </div>
          </div>

          <div className="stat-card-admin purple">
            <div className="icon-wrapper">
              <i className="bi bi-calendar-check-fill"></i>
            </div>
            <div className="stat-body">
              <div className="stat-title">مواعيد اليوم</div>
              <div className="stat-value">{todayAppointments.length}</div>
            </div>
          </div>

          <div
            className="stat-card-admin green clickable"
            onClick={() => navigate("/admin/doctors?active=1")}
          >
            <div className="icon-wrapper">
              <i className="bi bi-activity"></i>
            </div>
            <div className="stat-body">
              <div className="stat-title">الأطباء النشطون</div>
              <div className="stat-value">{activeDoctorsCount}</div>
            </div>
          </div>
        </section>

        {/* Today Appointments Section */}
        <section className="appointments-section">
          <h2>
            <i className="bi bi-calendar-day text-primary"></i>
            مواعيد اليوم
          </h2>
          <p className="appointments-date">
            <i className="bi bi-clock me-2"></i>
            {formatTodayDate()}
          </p>

          <div className="appointments-list">
            {appointmentsLoading ? (
              <div className="loading-text">
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                جاري تحميل المواعيد...
              </div>
            ) : todayAppointments.length === 0 ? (
              <div className="empty-text">
                <i className="bi bi-calendar-x fs-1 d-block mb-3 opacity-25"></i>
                لا توجد مواعيد لهذا اليوم.
              </div>
            ) : (
              todayAppointments.map((appt, idx) => (
                <div key={idx} className="appointment-item">
                  <div className="appointment-time">{appt.time}</div>
                  <div className="appointment-info">
                    <div className="patient-name">{appt.patientName}</div>
                    <div className="doctor-name">
                      <i className="bi bi-stethoscope ms-1"></i>
                      مع د. {appt.doctorName}
                    </div>
                  </div>
                  {confirmedIds.includes(appt.id) ? (
                    <div className="confirmed-msg">
                      <i className="bi bi-check-circle-fill"></i>
                      تم التأكيد
                    </div>
                  ) : appt.status === "Pending" ? (
                    <button
                      className="btn btn-primary"
                      onClick={() => handleConfirmAppointment(appt.id)}
                      disabled={confirmingId === appt.id}
                    >
                      {confirmingId === appt.id ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          جاري...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-lg ms-1"></i>
                          تأكيد
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="confirmed-msg">
                      <i className="bi bi-check-circle-fill"></i>
                      تم التأكيد
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="actions-row">
          <div className="action-card" onClick={() => navigate("/admin/add-doctor")}>
            <div className="action-icon action-icon-blue">
              <i className="bi bi-person-plus-fill"></i>
            </div>
            <div className="action-body">
              <h3>إضافة طبيب جديد</h3>
              <p>تسجيل طبيب جديد في النظام وإعداد الملف الشخصي</p>
              <NavLink className="action-link" to="/admin/add-doctor">
                الانتقال <i className="bi bi-arrow-left"></i>
              </NavLink>
            </div>
          </div>

          <div className="action-card" onClick={() => navigate("/admin/create-admin")}>
            <div className="action-icon action-icon-purple">
              <i className="bi bi-shield-lock-fill"></i>
            </div>
            <div className="action-body">
              <h3>إنشاء مشرف جديد</h3>
              <p>إضافة حساب مشرف جديد بصلاحيات إدارية كاملة</p>
              <NavLink className="action-link" to="/admin/create-admin">
                الانتقال <i className="bi bi-arrow-left"></i>
              </NavLink>
            </div>
          </div>

          <div className="action-card" onClick={() => navigate("/admin/book-appointment")}>
            <div className="action-icon action-icon-green">
              <i className="bi bi-calendar-plus-fill"></i>
            </div>
            <div className="action-body">
              <h3>حجز موعد</h3>
              <p>حجز موعد جديد لمريض مع أحد الأطباء المتاحين</p>
              <NavLink className="action-link" to="/admin/book-appointment">
                الانتقال <i className="bi bi-arrow-left"></i>
              </NavLink>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminPanel;
