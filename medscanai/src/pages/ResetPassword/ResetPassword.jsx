import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./ResetPassword.css";

const API_BASE = "https://localhost:7196/api/authentication";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    // Redirect if user is logged in
    const authToken = localStorage.getItem("token");
    if (authToken) {
      navigate("/");
      return;
    }

    // Validate URL parameters
    const resetToken = searchParams.get("token");
    const email = searchParams.get("email");
    if (!resetToken || !email) {
      setMessage("رابط إعادة تعيين كلمة المرور غير صالح");
    }
  }, [navigate, searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setMessage("كلمات المرور غير متطابقة");
      return;
    }

    const resetPasswordToken = searchParams.get("token");
    const email = searchParams.get("email");

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`${API_BASE}/ResetPassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          newPassword: form.password,
          resetPasswordToken,
        }),
      });

      const data = await response.json();

      if (data.succeeded) {
        setMessage("تم إعادة تعيين كلمة المرور بنجاح");
        setTimeout(() => navigate("/auth"), 2000);
      } else {
        setMessage(data.message || "حدث خطأ. يرجى المحاولة مرة أخرى");
      }
    } catch {
      setMessage("حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="reset-password-page">
      <div className="reset-password-card">
        <h1>إعادة تعيين كلمة المرور</h1>
        <p>الرجاء إدخال كلمة المرور الجديدة</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>كلمة المرور الجديدة</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="●●●●●●●●"
              required
            />
          </div>

          <div className="form-group">
            <label>تأكيد كلمة المرور</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="●●●●●●●●"
              required
            />
          </div>

          {message && <div className="message">{message}</div>}

          <button type="submit" disabled={loading}>
            {loading ? "جارٍ إعادة التعيين..." : "إعادة تعيين كلمة المرور"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
