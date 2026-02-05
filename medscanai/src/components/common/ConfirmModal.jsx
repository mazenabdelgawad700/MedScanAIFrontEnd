import React from "react";
import "./ConfirmModal.css";

/**
 * Reusable confirmation modal component.
 * Used for delete confirmations, cancel actions, etc.
 */
const ConfirmModal = ({
  show,
  title = "تأكيد",
  message,
  confirmText = "تأكيد",
  cancelText = "إلغاء",
  onConfirm,
  onCancel,
  isLoading = false,
  variant = "danger", // "danger" | "warning" | "primary"
  icon = "bi-exclamation-triangle-fill",
}) => {
  if (!show) return null;

  const variantClass = `confirm-modal-btn-${variant}`;

  return (
    <div className="confirm-modal-overlay" onClick={onCancel}>
      <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
        <div className={`confirm-modal-icon confirm-modal-icon-${variant}`}>
          <i className={`bi ${icon}`}></i>
        </div>
        <h3 className="confirm-modal-title">{title}</h3>
        {message && <p className="confirm-modal-message">{message}</p>}
        <div className="confirm-modal-actions">
          <button
            className="confirm-modal-btn confirm-modal-btn-cancel"
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button
            className={`confirm-modal-btn ${variantClass}`}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="confirm-modal-spinner"></span>
                جاري التنفيذ...
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
