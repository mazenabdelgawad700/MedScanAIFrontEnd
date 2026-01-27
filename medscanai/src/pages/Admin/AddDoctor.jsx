import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../../../utils/Constants.ts"
import "./AddDoctor.css";

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

const SPECIALIZATIONS = [
  { id: 1, name: "أمراض الجلد والشعر والأظافر" },
  { id: 2, name: "طب الأعصاب" },
  { id: 3, name: "أمراض الصدر" },
];

const DAYS = [
  { key: "saturday", label: "السبت" },
  { key: "sunday", label: "الأحد" },
  { key: "monday", label: "الاثنين" },
  { key: "tuesday", label: "الثلاثاء" },
  { key: "wednesday", label: "الأربعاء" },
  { key: "thursday", label: "الخميس" },
  { key: "friday", label: "الجمعة" },
];

const AddDoctor = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    password: "",
    email: "",
    phoneNumber: "",
    yearsOfExperience: 0,
    specializationID: SPECIALIZATIONS[0].id,
  });
  // schedule: { day: { start: "", end: "" } }
  const [schedule, setSchedule] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({
      ...p,
      [name]: name === "yearsOfExperience" ? Number(value) : value,
    }));
  };

  const handleScheduleDayChange = (dayKey, checked) => {
    setSchedule((prev) => {
      const newSchedule = { ...prev };
      if (checked) {
        newSchedule[dayKey] = { start: "", end: "" };
      } else {
        delete newSchedule[dayKey];
      }
      return newSchedule;
    });
  };

  const handleScheduleTimeChange = (dayKey, field, value) => {
    setSchedule((prev) => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    // basic validation
    if (!form.fullName || !form.email || !form.password) {
      setMessage("يرجى ملء الحقول المطلوبة.");
      return;
    }

    // schedule validation: at least one day
    if (Object.keys(schedule).length === 0) {
      setMessage("يرجى تحديد جدول الطبيب (يوم واحد على الأقل)");
      return;
    }
    // check all selected days have start and end
    for (const day of Object.keys(schedule)) {
      if (!schedule[day].start || !schedule[day].end) {
        setMessage("يرجى تحديد وقت البداية والنهاية لكل يوم متاح");
        return;
      }
    }

    // Prepare workDays, startTime, endTime
    const workDays = Object.keys(schedule);
    // Find earliest start and latest end
    let startTime = null;
    let endTime = null;
    workDays.forEach((day) => {
      const s = schedule[day].start;
      const e = schedule[day].end;
      if (!startTime || s < startTime) startTime = s;
      if (!endTime || e > endTime) endTime = e;
    });
    // Ensure .NET TimeSpan format (HH:mm:ss)
    const toTimeSpan = (t) => (t && t.length === 5 ? t + ":00" : t);
    const startTimeSpan = toTimeSpan(startTime);
    const endTimeSpan = toTimeSpan(endTime);

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/auth");

      const res = await fetch(`${API_BASE}/authentication/RegisterDoctor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: form.fullName,
          password: form.password,
          email: form.email,
          phoneNumber: form.phoneNumber,
          yearsOfExperience: form.yearsOfExperience,
          specializationId: Number(form.specializationID),
          workDays,
          startTime: startTimeSpan,
          endTime: endTimeSpan,
        }),
      });

      const data = await res.json();
      if (data && data.succeeded) {
        setMessage("تم إضافة الطبيب بنجاح.");
        setForm({
          fullName: "",
          password: "",
          email: "",
          phoneNumber: "",
          yearsOfExperience: 0,
          specializationID: SPECIALIZATIONS[0].id,
        });
        setSchedule({});
      } else {
        setMessage(data?.message || "حدث خطأ أثناء إضافة الطبيب.");
      }
    } catch (err) {
      console.error(err);
      setMessage("فشل الاتصال بالخادم. حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-doctor-page">
      <div className="add-doctor-card">
        <h1>إضافة طبيب جديد</h1>
        <p className="sub">أدخل معلومات الطبيب لإضافته إلى النظام</p>

        <form className="doctor-form" onSubmit={handleSubmit}>
          <label>
            <div className="label">الاسم الكامل</div>
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="د. محمد أحمد"
              required
            />
          </label>

          <label>
            <div className="label">التخصص</div>
            <select
              name="specializationID"
              value={form.specializationID}
              onChange={handleChange}
            >
              {SPECIALIZATIONS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            <div className="label">البريد الإلكتروني</div>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="doctor@medicare.com"
              required
            />
          </label>

          <label>
            <div className="label">رقم الهاتف</div>
            <input
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              placeholder="+966 50 123 4567"
            />
          </label>

          <label>
            <div className="label">سنوات الخبرة</div>
            <input
              name="yearsOfExperience"
              type="number"
              min="0"
              value={form.yearsOfExperience}
              onChange={handleChange}
            />
          </label>

          <label>
            <div className="label">كلمة المرور</div>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </label>

          {/* Doctor Schedule Section */}
          <div className="schedule-section">
            <div className="label" style={{ marginBottom: 8 }}>
              جدول الطبيب (الأيام المتاحة وأوقات العمل)
            </div>
            <div className="days-row mb-4">
              {DAYS.map((d) => (
                <label key={d.key} style={{display: "flex", flexDirection: "row-reverse", justifyContent: "space-between" }}>
                  <input
                    type="checkbox"
                    checked={!!schedule[d.key]}
                    style={{width: "fit-content"}}
                    onChange={(e) =>
                      handleScheduleDayChange(d.key, e.target.checked)
                    }
                  />
                  <span>{d.label}</span>
                </label>
              ))}
            </div>
            {/* For each selected day, show time pickers */}
            {Object.keys(schedule).length > 0 && (
              <div className="schedule-times">
                {Object.keys(schedule).map((dayKey) => (
                  <div key={dayKey} className="schedule-time-row">
                    <span style={{ minWidth: 70, display: "inline-block" }}>
                      {DAYS.find((d) => d.key === dayKey)?.label}:
                      <br />
                      من
                    </span>
                    <input
                      type="time"
                      value={schedule[dayKey].start}
                      onChange={(e) =>
                        handleScheduleTimeChange(
                          dayKey,
                          "start",
                          e.target.value
                        )
                      }
                      style={{ margin: "0 8px" }}
                    />
                    <span>إلى</span>
                    <input
                      type="time"
                      value={schedule[dayKey].end}
                      onChange={(e) =>
                        handleScheduleTimeChange(dayKey, "end", e.target.value)
                      }
                      style={{ margin: "0 8px" }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {message && <div className="message">{message}</div>}

          <div className="buttons-row">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate("/admin")}
            >
              إلغاء
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "جارٍ الإضافة..." : "إضافة طبيب"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDoctor;
