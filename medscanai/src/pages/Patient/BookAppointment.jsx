import { useEffect, useState } from "react";
import "./BookAppointment.css";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE } from "../../../utils/Constants.ts";
import SignalRService from "../../services/SignalRService";
import bookAppointmentImg from "../../assets/bookAppointment.jpg";

const BookAppointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [reason, setReason] = useState("");
  const [submitMsg, setSubmitMsg] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [isThereDoctors, setIsThereDoctors] = useState(false);

  const navigate = useNavigate();

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
        const res = await fetch(
          `${API_BASE}/appointment/GetDoctors?patientId=${patientId}`,
          {
            method: "GET",
            headers: {
              Accept: "*/*",
              Authorization: `bearer ${token}`,
            },
          },
        );
        if (!res.ok) throw new Error("فشل في جلب الأطباء");

        const result = await res.json();
        if (result.succeeded && Array.isArray(result.data)) {
          setDoctors(result.data);
          if (result.data.length > 0) setIsThereDoctors(true);
          else setIsThereDoctors(false);
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
  }, [patientId, token]);

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
        minutes,
      );

      const formattedDate = appointmentDate
        .toLocaleString("sv-SE", { hour12: false }) // ISO-like but local
        .replace(" ", "T");

      const res = await fetch(`${API_BASE}/appointment/MakeAppointment`, {
        method: "POST",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
          Authorization: `bearer ${token}`,
        },
        body: JSON.stringify({
          patientId,
          doctorId: selectedDoctor,
          date: formattedDate,
          reason,
          status: "Pending",
        }),
      });
      if (!res.ok) throw new Error("فشل الحجز");
      
      try {
        await SignalRService.invoke("AppointmentCreated");
      } catch (e) {
        console.error("SignalR Booking Error", e);
      }

      setSubmitMsg("تم حجز الموعد بنجاح ✅");
      setSelectedDoctor("");
      setSelectedTime("");
      setReason("");
      setTimeout(() => {
        navigate("/patient/dashboard");
      }, 1000)
    } catch {
      setSubmitMsg("حدث خطأ أثناء الحجز. حاول مرة أخرى.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="appointment-container">
      <div className="appointment-layout">
        <div className="appointment-form-section">
          <h2 className="appointment-title">📅 حجز موعد</h2>

          <Link to="/patient/dashboard" className="go-to-dashboard">
            <i className="bi bi-arrow-right"></i>
            العودة الي لوحة التحكم
          </Link>

          {!isThereDoctors && (
            <p className="text-danger">
              لا يوجد أطباء متاحين الآن، حاول مرة أخرى لاحقًا
            </p>
          )}

          {isThereDoctors && (
            <>
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

                  <button
                    type="submit"
                    disabled={submitting}
                    className="submit-btn"
                  >
                    {submitting ? "جاري الحجز..." : "حجز الموعد"}
                  </button>
                </form>
              )}
            </>
          )}
        </div>

        <div className="appointment-image-section">
          <div className="appointment-image-wrapper">
            <img
              src={bookAppointmentImg}
              alt="حجز موعد طبي - صورة توضيحية"
              className="appointment-image"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
