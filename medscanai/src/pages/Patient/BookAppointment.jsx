import { useEffect, useState } from "react";
import "./BookAppointment.css";
import { Link } from "react-router-dom";

const API_BASE = "https://localhost:7196/api/appointment";

const BookAppointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [reason, setReason] = useState("");
  const [submitMsg, setSubmitMsg] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Get token and patientId from localStorage/token
  const token = localStorage.getItem("token");
  const getUserIdFromToken = (token) => {
    try {
      const base64Payload = token.split(".")[1];
      const payload = JSON.parse(atob(base64Payload));
      return payload.UserId;
    } catch {
      return null;
    }
  };
  const patientId = getUserIdFromToken(token);

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/GetDoctors`, {
          method: "GET",
          headers: {
            Accept: "*/*",
            Authorization: `bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("فشل في جلب الأطباء");

        const result = await res.json();
        if (result.succeeded && Array.isArray(result.data)) {
          setDoctors(result.data);
        } else {
          throw new Error(result.message || "استجابة غير متوقعة من الخادم");
        }
      } catch (err) {
        console.error(err);
        setError("تعذر تحميل قائمة الأطباء.");
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchDoctors();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitMsg(null);
    if (!selectedDoctor || !selectedTime || !reason) {
      setSubmitMsg("يرجى اختيار طبيب ووقت وكتابة سبب الحجز.");
      return;
    }
    setSubmitting(true);
    try {
      const today = new Date();
      const [time, period] = selectedTime.split(" ");
      let [hours, minutes] = time.split(":").map(Number);
      if (period === "PM" && hours < 12) hours += 12;
      if (period === "AM" && hours === 12) hours = 0;

      const appointmentDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        hours,
        minutes
      ).toISOString();

      const res = await fetch(`${API_BASE}/MakeAppointment`, {
        method: "POST",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
          Authorization: `bearer ${token}`,
        },
        body: JSON.stringify({
          patientId,
          doctorId: selectedDoctor,
          date: appointmentDate,
          reason,
          status: "Pending",
        }),
      });
      if (!res.ok) throw new Error("فشل الحجز");
      setSubmitMsg("تم حجز الموعد بنجاح ✅");
      setSelectedDoctor("");
      setSelectedTime("");
      setReason("");
    } catch {
      setSubmitMsg("حدث خطأ أثناء الحجز. حاول مرة أخرى.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="appointment-container">
      <h2 className="appointment-title">📅 حجز موعد</h2>

      <Link to="/patient/dashboard" className="go-to-dashboard">
        العودة الي لوحة التحكم
      </Link>

      {loading ? (
        <p className="loading">جاري تحميل الأطباء...</p>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : (
        <form onSubmit={handleSubmit} className="appointment-form">
          <div className="form-group">
            <label>اختر الطبيب:</label>
            <select
              value={selectedDoctor}
              onChange={(e) => {
                setSelectedDoctor(e.target.value);
                setSelectedTime("");
              }}
              required
            >
              <option value="">-- اختر الطبيب --</option>
              {doctors.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.fullName} ({doc.specialization})
                </option>
              ))}
            </select>
          </div>

          {selectedDoctor && (
            <div className="form-group">
              <label>اختر الوقت المتاح:</label>
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                required
              >
                <option value="">-- اختر الوقت --</option>
                {(
                  doctors.find((d) => d.id === selectedDoctor)
                    ?.availableStartTimes || []
                ).map((t, idx) => (
                  <option key={idx} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="form-group">
            <label>سبب الحجز:</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              required
              placeholder="اكتب سبب الحجز..."
            />
          </div>

          {submitMsg && (
            <div
              className={`submit-message ${
                submitMsg.includes("نجاح") ? "success" : "error"
              }`}
            >
              {submitMsg}
            </div>
          )}

          <button type="submit" disabled={submitting} className="submit-btn">
            {submitting ? "جاري الحجز..." : "حجز الموعد"}
          </button>
        </form>
      )}
    </div>
  );
};

export default BookAppointment;
