import React from "react";
import "./LoadingSpinner.css";

/**
 * Reusable loading spinner component.
 * Supports different sizes and contexts.
 */
const LoadingSpinner = ({
  size = "medium", // "small" | "medium" | "large"
  text = "",
  fullPage = false,
  inline = false,
}) => {
  const sizeClass = `loading-spinner-${size}`;

  if (fullPage) {
    return (
      <div className="loading-spinner-fullpage">
        <div className={`loading-spinner ${sizeClass}`}></div>
        {text && <p className="loading-spinner-text">{text}</p>}
      </div>
    );
  }

  if (inline) {
    return (
      <span className="loading-spinner-inline">
        <span className={`loading-spinner ${sizeClass}`}></span>
        {text && <span className="loading-spinner-text-inline">{text}</span>}
      </span>
    );
  }

  return (
    <div className="loading-spinner-container">
      <div className={`loading-spinner ${sizeClass}`}></div>
      {text && <p className="loading-spinner-text">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
