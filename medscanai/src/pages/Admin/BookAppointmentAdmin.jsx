import { useEffect, useState } from "react";
import "../Patient/BookAppointment.css";
import { Link } from "react-router-dom";

const API_BASE = "https://localhost:7196/api/appointment";

const BookAppointmentAdmin = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [reason, setReason] = useState("");
  const [patientName, setPatientName] = useState(""); // ✅ new field
  const [submitMsg, setSubmitMsg] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [isThereDoctors, setIsThereDoctors] = useState(false);

  // ✅ use admin token directly (no patientId)
  const token = localStorage.getItem("token");

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
          setIsThereDoctors(result.data.length > 0);
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

  // ✅ updated submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitMsg(null);

    if (!patientName.trim() || !selectedDoctor || !selectedTime || !reason) {
      setSubmitMsg("يرجى إدخال اسم المريض واختيار الطبيب والوقت وكتابة السبب.");
      return;
    }

    setSubmitting(true);
    try {
      const today = new Date();
      const [time, period] = selectedTime.split(" ");
      let [hours, minutes] = time.split(":").map(Number);

      if (period === "PM" && hours < 12) hours += 12;
      if (period === "AM" && hours === 12) hours = 0;

      // ✅ Create a Date object in local time (Egypt time)
      const appointmentDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        hours,
        minutes
      );

      // ✅ Format without converting to UTC (keep it local)
      const formattedDate = appointmentDate
        .toLocaleString("sv-SE", { hour12: false }) // ISO-like but local
        .replace(" ", "T"); // e.g. "2025-10-30T15:55:00"

      // ✅ Updated payload
      const payload = {
        patientName,
        doctorId: selectedDoctor,
        date: formattedDate, // <--- send this one
        reason,
        status: "Pending",
      };

      const res = await fetch(`${API_BASE}/MakeAppointment`, {
        method: "POST",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
          Authorization: `bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("فشل الحجز");

      setSubmitMsg("تم حجز الموعد بنجاح ✅");
      setSelectedDoctor("");
      setSelectedTime("");
      setReason("");
      setPatientName("");
    } catch (err) {
      console.error(err);
      setSubmitMsg("حدث خطأ أثناء الحجز. حاول مرة أخرى.");
    } finally {
      setSubmitting(false);
    }

  };

  return (
    <div className="appointment-container">
      <h2 className="appointment-title">📅 حجز موعد جديد (للمشرف)</h2>

      <Link to="/admin" className="go-to-dashboard">
        ← العودة إلى لوحة التحكم
      </Link>

      {!isThereDoctors && (
        <p className="text-red">
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
                <label>اسم المريض:</label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="اكتب اسم المريض..."
                  required
                />
              </div>

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
  );
};

export default BookAppointmentAdmin;
