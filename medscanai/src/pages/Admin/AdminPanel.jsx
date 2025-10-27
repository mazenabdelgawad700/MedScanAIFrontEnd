import React, { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./AdminPanel.css";

// reuse jwt decode as in other admin pages
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

  return (
    <div className="admin-panel-page">
      <div className="admin-panel-card">
        <header className="admin-panel-header">
          <div>
            <h1>لوحة تحكم المدير</h1>
            <p className="sub">نظرة عامة على النظام والإجراءات السريعة</p>
          </div>
        </header>

        <section className="stats-grid">
          <div className="stat-card">
            <div className="icon">📅</div>
            <div className="stat-body">
              <div className="stat-title">إجمالي المواعيد</div>
              <div className="stat-value">—</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="icon">👩‍⚕️</div>
            <div className="stat-body">
              <div className="stat-title">الأطباء المسجلون</div>
              <div className="stat-value">—</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="icon">🗓️</div>
            <div className="stat-body">
              <div className="stat-title">مواعيد اليوم</div>
              <div className="stat-value">—</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="icon">👥</div>
            <div className="stat-body">
              <div className="stat-title">إجمالي الأطباء</div>
              <div className="stat-value">—</div>
            </div>
          </div>
        </section>

        <section className="appointments-section">
          <h2>مواعيد اليوم</h2>
          <p className="appointments-date">المواعيد المحددة لـ 2025/10/27</p>

          <div className="appointments-list">
            <div className="appointment-item">
              <div className="appointment-time">09:00 ص</div>
              <div className="appointment-info">
                <div className="patient-name">محمد أحمد</div>
                <div className="doctor-name">مع د. سارة أحمد</div>
              </div>
            </div>

            <div className="appointment-item">
              <div className="appointment-time">10:00 ص</div>
              <div className="appointment-info">
                <div className="patient-name">فاطمة علي</div>
                <div className="doctor-name">مع د. سارة أحمد</div>
              </div>
            </div>

            <div className="appointment-item">
              <div className="appointment-time">11:00 ص</div>
              <div className="appointment-info">
                <div className="patient-name">أحمد خالد</div>
                <div className="doctor-name">مع د. محمد علي</div>
              </div>
            </div>
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
        </section>
      </div>
    </div>
  );
};

export default AdminPanel;
