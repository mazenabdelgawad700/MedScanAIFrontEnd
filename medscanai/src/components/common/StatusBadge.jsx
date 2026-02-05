import React from "react";
import { translateStatus, getStatusClass } from "../../utils/formatters";
import "./StatusBadge.css";

/**
 * Reusable status badge component for appointments.
 * Automatically translates and styles based on status.
 */
const StatusBadge = ({ status }) => {
  return (
    <span className={`status-badge ${getStatusClass(status)}`}>
      {translateStatus(status)}
    </span>
  );
};

export default StatusBadge;
