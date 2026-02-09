/**
 * Service to handle AI/Chatbot API interactions.
 * Connects to the local FastAPI backend.
 */

const API_BASE_URL = 'http://localhost:8005';

/**
 * Sends a message to the AI chatbot.
 * @param {object} params - The parameters for the chat.
 * @param {string} params.message - The message text.
 * @param {string} params.userRole - The role of the user (e.g., 'patient', 'doctor').
 * @returns {Promise<object>} - The response from the chatbot.
 */
export async function sendMessageToChatbot({ message, userRole }) {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: message,
        user_role: userRole,
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
