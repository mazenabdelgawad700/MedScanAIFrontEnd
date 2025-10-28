import React from "react";
import "./ConfirmModal.css";

const ConfirmModal = ({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel = "نعم",
  cancelLabel = "إلغاء",
  loading = false,
}) => {
  if (!open) return null;

  return (
    <div className="confirm-overlay">
      <div className="confirm-card" role="dialog" aria-modal="true">
        <div className="confirm-header">
          <h3>{title}</h3>
        </div>
        <div className="confirm-body">{message}</div>
        <div className="confirm-actions">
          <button
            className="btn-secondary"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelLabel}
          </button>
          <button
            className="btn-primary"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "جارٍ..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
