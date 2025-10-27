import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddDoctor.css";

const API_BASE = "https://localhost:7196/api/authentication";

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    // basic validation
    if (!form.fullName || !form.email || !form.password) {
      setMessage("يرجى ملء الحقول المطلوبة.");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/auth");

      const res = await fetch(`${API_BASE}/RegisterDoctor`, {
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
          specializationID: Number(form.specializationID),
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
