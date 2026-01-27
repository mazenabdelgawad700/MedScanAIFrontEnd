import { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { API_BASE } from "../../../utils/Constants.ts";
import "./CreateAdmin.css";

// Helper to safely decode JWT payload (base64url)
function decodeJwtPayload(token) {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    // Add padding
    const pad = payload.length % 4;
    const padded = pad ? payload + "=".repeat(4 - pad) : payload;
    const json = atob(padded);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

const CreateAdmin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    // Ensure user is logged in and has Admin role
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth");
      return;
    }

    const payload = decodeJwtPayload(token);
    if (!payload) {
      // invalid token -> force login
      localStorage.removeItem("token");
      navigate("/auth");
      return;
    }

    const role =
      payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
      payload.role;
    const exp = payload.exp;
    const now = Math.floor(Date.now() / 1000);
    if (exp && exp < now) {
      localStorage.removeItem("token");
      navigate("/auth");
      return;
    }

    if (role !== "Admin") {
      // not an admin
      navigate("/");
      return;
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!form.userName || !form.email || !form.password) {
      setMessage("جميع الحقول مطلوبة");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setMessage("كلمتا المرور غير متطابقتين");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/authentication/RegisterAdmin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userName: form.userName,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();
      if (data && data.succeeded) {
        setMessage("تم إنشاء المشرف بنجاح");
        setForm({ userName: "", email: "", password: "", confirmPassword: "" });
      } else {
        setMessage(data?.message || "حدث خطأ أثناء إنشاء المشرف");
      }
    } catch (err) {
      console.error(err);
      setMessage("فشل الاتصال بالخادم. حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-admin-page">
      <div className="create-admin-card">
        <h1>إنشاء مشرف جديد</h1>
        <p>
          يمكنك هنا إنشاء حساب مشرف آخر. هذا الإجراء خاص بمستخدمين المشرف فقط.
        </p>

        <div className="back-to-admin">
          <NavLink to="/admin">العودة إلى لوحة المشرف</NavLink>
        </div>

        <form onSubmit={handleSubmit} className="create-admin-form">
          <label>
            <div className="label">اسم المستخدم</div>
            <input
              name="userName"
              value={form.userName}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            <div className="label">البريد الإلكتروني</div>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
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

          <label>
            <div className="label">تأكيد كلمة المرور</div>
            <input
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
          </label>

          {message && <div className="message">{message}</div>}

          <button type="submit" disabled={loading}>
            {loading ? "جارٍ الإنشاء..." : "إنشاء مشرف"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateAdmin;
