/**
 * Authentication utilities for JWT token handling.
 * Consolidates duplicated token logic from multiple components.
 */

/**
 * Safely decodes a JWT token payload.
 * Handles base64url encoding and padding.
 * @param {string} token - The JWT token string
 * @returns {object|null} - Decoded payload or null if invalid
 */
export function decodeJwtPayload(token) {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    
    // Handle base64url encoding
    const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const pad = payload.length % 4;
    const padded = pad ? payload + "=".repeat(4 - pad) : payload;
    
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
}

/**
 * Gets the auth token from localStorage.
 * @returns {string|null} - Token or null if not found
 */
export function getToken() {
  return localStorage.getItem("token");
}

/**
 * Extracts the user ID from the stored JWT token.
 * @returns {string|null} - User ID or null if token is invalid
 */
export function getUserId() {
  const token = getToken();
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.UserId;
  } catch {
    return null;
  }
}

/**
 * Extracts the user role from the stored JWT token.
 * @returns {string} - User role (defaults to "patient")
 */
export function getUserRole() {
  const token = getToken();
  if (!token) return "patient";
  
  try {
    const payload = decodeJwtPayload(token);
    if (!payload) return "patient";
    
    // Check standard and custom claim formats
    const role = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] 
      || payload.role;
    
    return role || "patient";
  } catch {
    return "patient";
  }
}

/**
 * Checks if the current token is expired.
 * @returns {boolean} - True if expired or invalid
 */
export function isTokenExpired() {
  const token = getToken();
  if (!token) return true;
  
  const payload = decodeJwtPayload(token);
  if (!payload || !payload.exp) return true;
  
  const now = Math.floor(Date.now() / 1000);
  return payload.exp < now;
}

/**
 * Clears authentication data from localStorage.
 */
export function clearAuth() {
  localStorage.removeItem("token");
}

/**
 * Creates standard authorization headers for API requests.
 * @returns {object} - Headers object with Authorization if token exists
 */
export function getAuthHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
