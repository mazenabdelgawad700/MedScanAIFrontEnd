import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";
import {API_BASE} from "../../../utils/Constants.ts"


const Auth = () => {
  const [mode, setMode] = useState("login"); // 'login' or 'register'
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    gender: "",
    phone: "",
    dob: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  // If a token exists the user is already authenticated — redirect away from auth page
  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      if (token) navigate("/");
    } catch {
      // ignore storage errors
    }
  }, [navigate]);

  const switchTo = (m) => {
    setMessage(null);
    setMode(m);
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      if (mode === "login") {
        const res = await fetch(`${API_BASE}/authentication/Login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: form.email, password: form.password }),
        });
        const data = await res.json();
        setMessage(data.message || "" + (data.errors || []).join(", "));
        if (data && data.succeeded && data.data) {
          // store token
          localStorage.setItem("token", data.data);
          // decode role from token and redirect appropriately
          try {
            const token = data.data;
            const parts = token.split(".");
            if (parts.length >= 2) {
              const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
              const pad = payload.length % 4;
              const padded = pad ? payload + "=".repeat(4 - pad) : payload;
              const json = atob(padded);
              const claims = JSON.parse(json);
              const role =
                claims[
                  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
                ] || claims.role;
              if (role === "Patient") {
                navigate("/patient/dashboard");
              } else if (role === "Admin") {
                navigate("/admin");
              } else if(role === "Doctor"){
                navigate("/doctor/dashboard");
              }
            } else {
              navigate("/");
            }
          } catch (err) {
            console.error(err);
            navigate("/");
          }
        }
      } else {
        // register patient (include gender, phone number, date of birth)
        const payload = {
          fullName: form.fullName,
          email: form.email,
          password: form.password,
          gender: form.gender,
          phoneNumber: form.phone,
          dateOfBirth: form.dob,
        };
        const res = await fetch(`${API_BASE}/authentication/RegisterPatient`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        setMessage(data.message || "");
        if (data && data.succeeded && data.data) {
          localStorage.setItem("token", data.data);
          // navigate("/");
          setMode("login");
        }
      }
    } catch (err) {
      console.error(err);
      setMessage("حدث خطأ أثناء الاتصال بالخادم. حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-top">
        <h1 className="auth-title">مرحبًا بك في MedScanAI</h1>
        <p className="auth-sub">سجل الدخول للوصول إلى لوحة التحكم الصحية</p>
      </div>

      <div className="auth-card">
        <div className="auth-card-head">
          <button
            className={`tab ${mode === "register" ? "active" : ""}`}
            onClick={() => switchTo("register")}
            aria-pressed={mode === "register"}
          >
            التسجيل
          </button>
          <button
            className={`tab ${mode === "login" ? "active" : ""}`}
            onClick={() => switchTo("login")}
            aria-pressed={mode === "login"}
          >
            تسجيل الدخول
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === "register" && (
            <>
              <label className="field">
                <div className="label">الاسم الكامل</div>
                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={onChange}
                  placeholder="محمد أحمد"
                  required
                />
              </label>

              <label className="field">
                <div className="label">الجنس</div>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={onChange}
                  required
                >
                  <option value="">اختر</option>
                  <option value="Male">ذكر</option>
                  <option value="Female">أنثى</option>
                </select>
              </label>

              <label className="field">
                <div className="label">رقم الهاتف</div>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={onChange}
                  placeholder="05xxxxxxxx"
                  type="tel"
                  required
                />
              </label>

              <label className="field">
                <div className="label">تاريخ الميلاد</div>
                <input
                  name="dob"
                  value={form.dob}
                  onChange={onChange}
                  type="date"
                  required
                />
              </label>
            </>
          )}

          <label className="field">
            <div className="label">البريد الإلكتروني</div>
            <input
              name="email"
              value={form.email}
              onChange={onChange}
              placeholder="your@email.com"
              type="email"
              required
            />
          </label>

          <label className="field">
            <div className="label">كلمة المرور</div>
            <input
              name="password"
              value={form.password}
              onChange={onChange}
              placeholder="●●●●●●●●"
              type="password"
              required
            />
          </label>

          {message && <div className="auth-message">{message}</div>}

          <button className="submit-btn" type="submit" disabled={loading}>
            {loading ? "..." : mode === "login" ? "تسجيل الدخول" : "إنشاء حساب"}
          </button>

          {mode === "login" && (
            <div className="forgot-password-link">
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-button"
              >
                هل نسيت كلمة المرور؟
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Auth;
