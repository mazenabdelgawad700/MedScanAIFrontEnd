import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "./ConfirmEmail.css";

const API_BASE = "https://localhost:7196/api/authentication";

const ConfirmEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
      return;
    }
  }, [navigate]);

  useEffect(() => {
    const confirmEmail = async () => {
      const userId = searchParams.get("userId");
      const token = searchParams.get("token");

      if (!userId || !token) {
        setStatus("error");
        return;
      }

      try {
        const response = await fetch(
          `${API_BASE}/ConfirmEmail?UserId=${encodeURIComponent(
            userId
          )}&Token=${encodeURIComponent(token)}`,
          {
            method: "GET",
          }
        );

        const data = await response.json();
        if (data.succeeded) {
          setStatus("success");
        } else {
          setStatus("error");
        }
      } catch {
        setStatus("error");
      }
    };

    confirmEmail();
  }, [searchParams]);

  return (
    <div className="confirm-page">
      <div className="confirm-card">
        {status === "verifying" && (
          <>
            <div className="confirm-icon loading">⌛</div>
            <h1 className="confirm-title">جارٍ التحقق من بريدك الإلكتروني</h1>
            <p className="confirm-text">يرجى الانتظار لحظة...</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="confirm-icon success">✓</div>
            <h1 className="confirm-title">تم تأكيد بريدك الإلكتروني</h1>
            <p className="confirm-text">
              شكراً لك على التحقق من بريدك الإلكتروني. يمكنك الآن استخدام حسابك.
            </p>
            <button
              className="confirm-button"
              onClick={() => navigate("/auth")}
            >
              تسجيل الدخول
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <div className="confirm-icon error">!</div>
            <h1 className="confirm-title">حدث خطأ</h1>
            <p className="confirm-text">
              عذراً، لم نتمكن من تأكيد بريدك الإلكتروني. يرجى المحاولة مرة أخرى
              أو التواصل مع الدعم.
            </p>
            <button className="confirm-button" onClick={() => navigate("/")}>
              العودة للرئيسية
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ConfirmEmail;
