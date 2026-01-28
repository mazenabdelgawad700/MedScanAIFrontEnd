import { useEffect, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./Doctors.css";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";
import { API_BASE } from "../../../utils/Constants.ts";
import activeDoctorsImg from "../../assets/activeDoctors.jpg";
import allDoctorsImg from "../../assets/allDoctors.jpg";

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

const Doctors = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const activeFilter =
    searchParams.get("active") === "1" || searchParams.get("active") === "true";

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

  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const url = activeFilter
        ? `${API_BASE}/doctor/GetActive`
        : `${API_BASE}/doctor/GetAll`;
      const res = await fetch(url, { headers });
      const data = await res.json();
      if (data && data.succeeded) {
        setDoctors(data.data || []);
      } else {
        setError(data.message || "فشل الحصول على الأطباء");
      }
    } catch (err) {
      console.error(err);
      setError("فشل الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  }, [activeFilter]);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  // confirmation modal state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const onRequestToggle = (doc) => {
    setSelectedDoctor(doc);
    setConfirmOpen(true);
  };

  const performToggle = async () => {
    if (!selectedDoctor) return;
    setConfirmLoading(true);
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      // backend expects doctor id in the request body (JSON).
      // POST to the endpoint without a query string and include the id in the body.
      const endpoint = selectedDoctor.isActive
        ? `${API_BASE}/doctor/DeleteDoctor`
        : `${API_BASE}/doctor/RestoreDoctor`;

      // include both forms to be tolerant to server naming (camelCase / PascalCase)
      const payload = {
        doctorId: selectedDoctor.id,
        DoctorId: selectedDoctor.id,
      };

      const res = await fetch(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data && data.succeeded) {
        // refresh
        await fetchDoctors();
        // notify counts to update
        window.dispatchEvent(new Event("countsUpdated"));
        setConfirmOpen(false);
        setSelectedDoctor(null);
      } else {
        alert(data?.message || "فشل العملية");
      }
    } catch (err) {
      console.error(err);
      alert("فشل الاتصال بالخادم");
    } finally {
      setConfirmLoading(false);
    }
  };

  return (
    <div className="doctors-page">
      <div className="doctors-container">
        <div className="doctors-header">
          <div className="page-info">
            <span className="page-breadcrumb">لوحة التحكم</span>
            <i className="bi bi-chevron-left"></i>
            <span className="page-title">
              {activeFilter ? "الأطباء النشطون" : "قائمة الأطباء المسجلين"}
            </span>
          </div>
          <button className="back-link" onClick={() => navigate("/admin")}>
            <i className="bi bi-arrow-right"></i>
            لوحة التحكم
          </button>
        </div>

        <div className="doctors-content-wrapper">
          {/* Image Section */}
          <div className="doctors-image-section">
            <div className="image-card">
              <img
                src={activeFilter ? activeDoctorsImg : allDoctorsImg}
                alt={activeFilter ? "Active Doctors" : "All Doctors"}
                className="content-image"
              />
              <div className="image-overlay">
                <h2 className="image-title">
                  {activeFilter ? "الأطباء النشطون" : "قائمة الأطباء المسجلين"}
                </h2>
                <p className="image-subtitle">
                  {activeFilter
                    ? "إدارة الأطباء النشطين في النظام"
                    : "عرض جميع الأطباء المسجلين"}
                </p>
              </div>
            </div>
          </div>

          {/* List Section */}
          <div className="doctors-card">
            {loading && (
              <div className="loading">
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                جارٍ تحميل البيانات...
              </div>
            )}

            {error && (
              <div className="error">
                <i className="bi bi-exclamation-triangle me-2"></i>
                {error}
              </div>
            )}

            {!loading && !error && (
              <div className="doctors-list">
                {doctors.length === 0 && (
                  <div className="empty">
                    <i className="bi bi-inbox fs-1 d-block mb-3 opacity-50"></i>
                    لا توجد سجلات حالياً
                  </div>
                )}
                {doctors.map((d) => (
                  <div key={d.id} className="doctor-row">
                    <div className="doctor-main">
                      <div className="doctor-name">
                        <i className="bi bi-person-badge-fill text-primary"></i>
                        {d.fullName}
                      </div>
                      <div className="doctor-email">
                        <i className="bi bi-envelope"></i>
                        {d.email}
                      </div>
                    </div>
                    <div className="doctor-right">
                      <div className="doctor-phone">
                        <i className="bi bi-telephone"></i>
                        {d.phoneNumber}
                      </div>
                      {/* On the active-doctors view we don't show action buttons */}
                      {!activeFilter && (
                        <div className="doctor-actions">
                          <button
                            className={
                              d.isActive ? "btn-danger" : "btn-success"
                            }
                            onClick={() => onRequestToggle(d)}
                          >
                            {d.isActive ? (
                              <>
                                <i className="bi bi-person-x-fill"></i>
                                تعطيل
                              </>
                            ) : (
                              <>
                                <i className="bi bi-person-check-fill"></i>
                                استعادة
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <ConfirmModal
              open={confirmOpen}
              title={
                selectedDoctor
                  ? selectedDoctor.isActive
                    ? "تعطيل الطبيب"
                    : "استعادة الطبيب"
                  : "تأكيد"
              }
              message={
                selectedDoctor
                  ? `${selectedDoctor.fullName} — هل أنت متأكد من المتابعة؟`
                  : "هل أنت متأكد؟"
              }
              onConfirm={performToggle}
              onCancel={() => {
                setConfirmOpen(false);
                setSelectedDoctor(null);
              }}
              confirmLabel={
                selectedDoctor && selectedDoctor.isActive ? "تعطيل" : "استعادة"
              }
              cancelLabel={"إلغاء"}
              loading={confirmLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Doctors;
