import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    const check = () => setIsLogged(Boolean(localStorage.getItem("token")));
    check();
    const onStorage = () => check();
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const handleSignOut = () => {
    try {
      localStorage.removeItem("token");
    } catch (err) {
      void err;
      console.warn(err);
    }
    setIsLogged(false);
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {!isLogged ? (
          <div className="login-button">
            <NavLink to="/auth">تسجيل الدخول</NavLink>
          </div>
        ) : (
          <div className="login-button">
            <button onClick={handleSignOut} aria-label="تسجيل الخروج">
              تسجيل الخروج
            </button>
          </div>
        )}

        <div className="logo">
          <span className="logo-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="lucide lucide-activity h-8 w-8 text-blue-600"
              aria-hidden="true"
            >
              <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"></path>
            </svg>
          </span>
          <span>MedScanAI</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
