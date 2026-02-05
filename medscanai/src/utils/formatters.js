/**
 * Formatting utilities for dates, times, and status values.
 * Provides consistent Arabic locale formatting across the application.
 */

/**
 * Formats a date string to Arabic locale with full details.
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted date (e.g., "الجمعة، 5 فبراير 2024")
 */
export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("ar-EG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Formats a date string to Arabic locale time.
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted time (e.g., "02:30 م")
 */
export function formatTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleTimeString("ar-EG", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Checks if a date is today.
 * @param {string} dateString - ISO date string
 * @returns {boolean} - True if the date is today
 */
export function isToday(dateString) {
  const date = new Date(dateString);
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

/**
 * Translates appointment status to Arabic.
 * @param {string} status - English status value
 * @returns {string} - Arabic translation
 */
export function translateStatus(status) {
  const statusMap = {
    pending: "قيد الانتظار",
    confirmed: "مؤكد",
    completed: "مكتمل",
    cancelled: "ملغي",
  };
  return statusMap[status?.toLowerCase()] || status;
}

/**
 * Returns CSS class name for appointment status styling.
 * @param {string} status - English status value
 * @returns {string} - CSS class name
 */
export function getStatusClass(status) {
  const classMap = {
    pending: "status-pending",
    confirmed: "status-confirmed",
    completed: "status-completed",
  };
  return classMap[status?.toLowerCase()] || "status-cancelled";
}

/**
 * Formats today's date in Arabic locale.
 * @returns {string} - Formatted date string
 */
export function formatTodayDate() {
  return new Date().toLocaleDateString("ar-EG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
