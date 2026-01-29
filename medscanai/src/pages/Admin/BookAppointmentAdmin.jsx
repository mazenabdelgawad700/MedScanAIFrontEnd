import { useEffect, useState } from "react";
import "./BookAppointmentAdmin.css"; // New CSS file
import { Link } from "react-router-dom";
import { API_BASE } from "../../../utils/Constants.ts";
import bookImage from "../../assets/bookAppointment.jpg"; // Import image

const BookAppointmentAdmin = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [reason, setReason] = useState("");
  const [patientName, setPatientName] = useState("");
  const [submitMsg, setSubmitMsg] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [isThereDoctors, setIsThereDoctors] = useState(false);

  // Use admin token directly
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/appointment/GetDoctors`, {
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

      const payload = {
        patientName,
        doctorId: selectedDoctor,
        date: formattedDate,
        reason,
        status: "Pending",
      };

      const res = await fetch(`${API_BASE}/appointment/MakeAppointment`, {
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
    <div className="admin-book-page">
      <div className="book-card">
        {/* Image Side - Clean Image Only */}
        <div className="book-image-side">
          <img src={bookImage} alt="Book Appointment" />
        </div>

        {/* Form Side */}
        <div className="book-form-side">
          <div className="book-header">
            <h2>
              <i className="bi bi-calendar-plus-fill text-primary"></i>
              حجز موعد
            </h2>
            <Link to="/admin" className="go-back-link">
              <i className="bi bi-arrow-right"></i>
              عودة للوحة التحكم
            </Link>
          </div>

          {!isThereDoctors && (
            <p className="error-text">لا يوجد أطباء متاحين الآن</p>
          )}

          {isThereDoctors && (
            <>
              {loading ? (
                <p className="loading">جاري تحميل الأطباء...</p>
              ) : error ? (
                <p className="error-text">{error}</p>
              ) : (
                <form onSubmit={handleSubmit} className="admin-book-form">
                  <div className="form-group">
                    <label>
                      <i className="bi bi-person"></i>
                      اسم المريض
                    </label>
                    <input
                      type="text"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder="اكتب اسم المريض..."
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      <i className="bi bi-person-badge"></i>
                      اختر الطبيب
                    </label>
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
                      <label>
                        <i className="bi bi-clock"></i>
                        اختر الوقت المتاح
                      </label>
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
                    <label>
                      <i className="bi bi-card-text"></i>
                      سبب الحجز
                    </label>
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
                    {submitting ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        جاري الحجز...
                      </>
                    ) : (
                      "حجز الموعد"
                    )}
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookAppointmentAdmin;
