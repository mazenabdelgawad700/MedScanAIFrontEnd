import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";
import { API_BASE } from "../../../utils/Constants.ts";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if user is logged in
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`${API_BASE}/authentication/ResetPasswordEmail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.succeeded) {
        setMessage(
          "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني"
        );
      } else {
        setMessage(data.message || "حدث خطأ. يرجى المحاولة مرة أخرى");
      }
    } catch {
      setMessage("حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-card">
        <h1>نسيت كلمة المرور؟</h1>
        <p>أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>البريد الإلكتروني</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>

          {message && <div className="message">{message}</div>}

          <button type="submit" disabled={loading}>
            {loading ? "جارٍ الإرسال..." : "إرسال رابط إعادة التعيين"}
          </button>

          <button
            type="button"
            className="back-button"
            onClick={() => navigate("/auth")}
          >
            العودة لتسجيل الدخول
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
