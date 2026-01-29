import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";

// small helper to decode jwt payload safely
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

const Navbar = () => {
  const navigate = useNavigate();
  const [isLogged, setIsLogged] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPatient, setIsPatient] = useState(false);
  const [isDoctor, setIsDoctor] = useState(false);

  const checkAuth = () => {
    const token = localStorage.getItem("token");
    setIsLogged(Boolean(token));

    if (!token) {
      setIsAdmin(false);
      setIsPatient(false);
      setIsDoctor(false);
      return;
    }

    const payload = decodeJwtPayload(token);
    if (!payload) {
      setIsAdmin(false);
      setIsPatient(false);
      setIsDoctor(false);
      return;
    }

    const role =
      payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
      payload.role;
    const exp = payload.exp;
    const now = Math.floor(Date.now() / 1000);

    if (exp && exp < now) {
      // token expired
      try {
        localStorage.removeItem("token");
      } catch (e) {
        console.log(e);
      }
      setIsLogged(false);
      setIsAdmin(false);
      setIsPatient(false);
      setIsDoctor(false);
      return;
    }

    setIsAdmin(role === "Admin");
    setIsPatient(role === "Patient");
    setIsDoctor(role === "Doctor");
  };

  useEffect(() => {
    checkAuth();
    const onStorage = () => checkAuth();
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const handleSignOut = () => {
    try {
      localStorage.removeItem("token");
    } catch (err) {
      console.warn(err);
    }
    setIsLogged(false);
    setIsAdmin(false);
    setIsPatient(false);
    setIsDoctor(false);
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* left area: auth controls + role-based links */}
        <div className="login-button">
          {!isLogged ? (
            <NavLink to="/auth" className="auth-link">
              تسجيل الدخول
            </NavLink>
          ) : (
            <button
              onClick={handleSignOut}
              className="logout-btn-nav"
              aria-label="تسجيل الخروج"
            >
              تسجيل الخروج
            </button>
          )}

          {isAdmin && (
            <NavLink to="/admin" className="admin-inline-link">
              لوحة المشرف
            </NavLink>
          )}

          {isPatient && (
            <NavLink to="/patient/dashboard" className="admin-inline-link">
              لوحة التحكم
            </NavLink>
          )}

          {isDoctor && (
            <NavLink to="/doctor/dashboard" className="admin-inline-link">
              لوحة التحكم
            </NavLink>
          )}
        </div>

        {/* center logo */}
        <div className="logo">
          <span className="logo-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-activity h-8 w-8 text-blue-600"
              aria-hidden="true"
            >
              <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" />
            </svg>
          </span>
          <span>MedScanAI</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
