import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./AdminPanel.css";

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

const AdminPanel = () => {
  const navigate = useNavigate();

  // ✅ Auth check
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
    if (role !== "Admin") return navigate("/");
  }, [navigate]);

  // ✅ Doctor counts
  const [doctorsCount, setDoctorsCount] = useState("—");
  const [activeDoctorsCount, setActiveDoctorsCount] = useState("—");

  const fetchCounts = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const [allRes, activeRes] = await Promise.all([
        fetch("https://localhost:7196/api/doctor/GetCount", { headers }),
        fetch("https://localhost:7196/api/doctor/GetActiveCount", { headers }),
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

  // ✅ Today's Appointments
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(true);

  const fetchTodayAppointments = async () => {
    try {
      setAppointmentsLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(
        "https://localhost:7196/api/appointment/GetForToday",
        {
          headers: {
            Accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
        }
      );
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


  const [confirmingId, setConfirmingId] = useState(null);
  const [confirmedIds, setConfirmedIds] = useState([]);


  const handleConfirmAppointment = async (appointmentId) => {
    if (!appointmentId) return;

    setConfirmingId(appointmentId);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setConfirmingId(null);
        return navigate("/auth");
      }

      const res = await fetch(
        "https://localhost:7196/api/appointment/Confirm",
        {
          method: "POST",
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ appointmentId }),
        }
      );

      const result = await res.json();

      if (res.ok && result.succeeded) {
        // ✅ Mark as confirmed in local state
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
    try {
      localStorage.removeItem("token");
    } catch (err) {
      console.warn(err);
    }
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
          <button onClick={handleSignOut} className="logout-btn btn-danger">
            تسجيل الخروج
          </button>
        </header>

        <section className="stats-grid">
          <div
            className="stat-card clickable"
            onClick={() => navigate("/admin/doctors")}
          >
            <div className="icon">👩‍⚕️</div>
            <div className="stat-body">
              <div className="stat-title">الأطباء المسجلون</div>
              <div className="stat-value">{doctorsCount}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="icon">🗓️</div>
            <div className="stat-body">
              <div className="stat-title">مواعيد اليوم</div>
              <div className="stat-value">{todayAppointments.length}</div>
            </div>
          </div>

          <div
            className="stat-card clickable"
            onClick={() => navigate("/admin/doctors?active=1")}
          >
            <div className="icon">👥</div>
            <div className="stat-body">
              <div className="stat-title">الأطباء النشطون</div>
              <div className="stat-value">{activeDoctorsCount}</div>
            </div>
          </div>
        </section>

        {/* ✅ Today Appointments Section */}
        <section className="appointments-section">
          <h2>مواعيد اليوم</h2>
          <p className="appointments-date">
            المواعيد المحددة لـ{" "}
            {new Date().getDate() +
              "/" +
              (new Date().getMonth() + 1) +
              "/" +
              new Date().getFullYear()}
          </p>

          <div className="appointments-list">
            {appointmentsLoading ? (
              <div className="loading-text">جاري تحميل المواعيد...</div>
            ) : todayAppointments.length === 0 ? (
              <div className="empty-text">لا توجد مواعيد اليوم.</div>
            ) : (
              todayAppointments.map((appt, idx) => (
                <div key={idx} className="appointment-item">
                  <div className="appointment-time">{appt.time}</div>
                  <div className="appointment-info">
                    <div className="patient-name">{appt.patientName}</div>
                    <div className="doctor-name">مع {appt.doctorName}</div>
                  </div>
                  {confirmedIds.includes(appt.id) ? (
                    <div className="confirmed-msg">تم التأكيد ✅</div>
                  ) : appt.status === "Pending" ? (
                    <button
                      className="btn btn-primary"
                      onClick={() => handleConfirmAppointment(appt.id)}
                      disabled={confirmingId === appt.id}
                      style={{ width: "fit-content" }}
                    >
                      {confirmingId === appt.id ? "جاري التأكيد..." : "تأكيد"}
                    </button>
                  ) : (
                    <div className="confirmed-msg">تم التأكيد ✅</div>
                  )}
                </div>
              ))
            )}
          </div>
        </section>

        <section className="actions-row">
          <div className="action-card doctor">
            <div className="action-head">
              <div className="action-icon">+</div>
            </div>
            <div className="action-body">
              <h3>إضافة طبيب جديد</h3>
              <p>تسجيل طبيب جديد في النظام</p>
              <NavLink className="action-link" to="/admin/add-doctor">
                الانتقال
              </NavLink>
            </div>
          </div>

          <div className="action-card admin">
            <div className="action-head">
              <div className="action-icon">👤</div>
            </div>
            <div className="action-body">
              <h3>إنشاء مشرف جديد</h3>
              <p>إنشاء حساب مشرف آخر</p>
              <NavLink className="action-link" to="/admin/create-admin">
                الانتقال
              </NavLink>
            </div>
          </div>

          <div className="action-card admin">
            <div className="action-head">
              <div className="action-icon">👤</div>
            </div>
            <div className="action-body">
              <h3>حدد موعدًا</h3>
              <p>حجز موعد للمريض</p>
              <NavLink className="action-link" to="/admin/book-appointment">
                الانتقال
              </NavLink>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminPanel;
