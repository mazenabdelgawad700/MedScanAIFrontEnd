/**
 * Service to handle AI/Chatbot API interactions.
 * Connects to the local FastAPI backend.
 */
import { getToken } from "../utils/auth.js";

/**
 * Sends a message to the AI chatbot.
 * @param {object} params - The parameters for the chat.
 * @param {string} params.message - The message text.
 * @param {string} params.userRole - The role of the user (e.g., 'patient', 'doctor').
 * @returns {Promise<object>} - The response from the chatbot.
 */
export async function sendMessageToChatbot({ message, userRole }) {
  try {
    const token = getToken();
    const headers = {
      "Content-Type": "application/json",
    };
    
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    
    const response = await fetch(`https://localhost:7196/api/ai/GetChatbotResponse/`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        message: message,
        userRole: userRole,
      }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.detail || `API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error sending message to chatbot:", error);
    throw error;
  }
}
