import React, { useState, useRef, useEffect } from 'react';
import { getUserRole } from "../../utils/auth";
import { sendMessageToChatbot } from "../../services/aiService";
import "./HubView.css";

const ChatView = () => {
  const isDoctor = getUserRole() === "Doctor";
  const messagesEndRef = useRef(null);

  // Define language resources
  const text = {
    ar: {
      welcome: "مرحبًا! أنا مساعدك الطبي العام. كيف يمكنني مساعدتك اليوم؟",
      title: "مساعد الدردشة الطبية",
      subtitle: "دائمًا هنا لمساعدتك",
      placeholder: "اكتب سؤالك الصحي...",
      response: "أفهم قلقك. كمساعد ذكاء اصطناعي، يمكنني تقديم معلومات عامة، لكن يرجى استشارة طبيب للحصول على نصيحة طبية محددة. هل يمكنك إخباري المزيد عن أعراضك؟"
    },
    en: {
      welcome: "Hello! I am your General Medical Assistant. How can I help you today?",
      title: "Medical Chat Assistant",
      subtitle: "Always here to help",
      placeholder: "Type your health question...",
      response: "I understand your concern. As an AI assistant, I can provide general information, but please consult a doctor for specific medical advice. Can you tell me more about your symptoms?"
    }
  };

  const t = isDoctor ? text.en : text.ar;
  const dir = isDoctor ? "ltr" : "rtl";

  const [messages, setMessages] = useState([
    { id: 1, text: t.welcome, sender: 'bot' }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage = { id: Date.now(), text: inputText, sender: 'user' };
    setMessages(prev => [...prev, newMessage]);
    setInputText("");
    setIsTyping(true);

    try {
      const role = getUserRole(); 
      // Ensure we pass 'patient' or 'doctor' in lowercase as backend expectation might be case sensitive or specific keys
      // The user example showed "user_role": "patient", so we will format it accordingly.
      // getUserRole() returns "patient" by default or "Doctor" etc. 
      // We will lowercase it to be safe: "patient", "doctor".
      const formattedRole = role ? role.toLowerCase() : "patient";

      const data = await sendMessageToChatbot({
        message: newMessage.text,
        userRole: formattedRole
      });

      // Assuming backend returns { response: "..." } or similar.
      // If the backend returns just the string or a different field, this might need adjustment.
      // Based on common patterns and the user's focus on "text report", we expect a 'response' or 'message' field.
      // We'll check for 'response' first, then 'message', then string.
      const botReplyText = data.response || data.message || (typeof data === 'string' ? data : t.response);

      const botResponse = { 
        id: Date.now() + 1, 
        text: botReplyText, 
        sender: 'bot' 
      };
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error("Failed to send message:", error);
      // Optional: Add an error message to the chat
      const errorResponse = {
        id: Date.now() + 1,
        text: isDoctor ? "Sorry, I'm having trouble connecting right now." : "عذراً، أواجه مشكلة في الاتصال حالياً.",
        sender: 'bot'
      };
       setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="d-flex flex-column h-100" style={{ minHeight: '600px', maxHeight: '600px' }} dir={dir}>
      <div className="border-bottom border-secondary pb-3 mb-3">
        <div className="d-flex align-items-center">
          <div className={`p-3 rounded-circle text-primary bg-primary bg-opacity-10 ${isDoctor ? 'me-3' : 'ms-3'}`}>
            <i className="bi bi-robot fs-4"></i>
          </div>
          <div>
            <h5 className="mb-0 fw-bold text-white">{t.title}</h5>
            <small className="text-white opacity-75">{t.subtitle}</small>
          </div>
        </div>
      </div>
      
      <div className="flex-grow-1 overflow-auto custom-scrollbar px-2 mb-3">
        <div className="d-flex flex-column gap-3">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`d-flex ${msg.sender === 'user' ? (isDoctor ? 'justify-content-end' : 'justify-content-end') : (isDoctor ? 'justify-content-start' : 'justify-content-start')}`}
              style={{
                 flexDirection: msg.sender === 'user' ? 'row' : 'row',
                 justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              <div 
                className={`p-3 rounded-4 shadow-sm ${msg.sender === 'user' ? 'bg-primary text-white' : 'bg-white bg-opacity-10 text-white border border-light border-opacity-10'}`}
                style={{ maxWidth: '80%' }}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="d-flex justify-content-start">
              <div className="bg-white bg-opacity-10 border border-light border-opacity-10 p-3 rounded-3 shadow-sm">
                <div className="spinner-dots">
                  <span className="spinner-grow spinner-grow-sm me-1 text-primary" role="status" aria-hidden="true"></span>
                  <span className="spinner-grow spinner-grow-sm me-1 text-primary" role="status" aria-hidden="true"></span>
                  <span className="spinner-grow spinner-grow-sm text-primary" role="status" aria-hidden="true"></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="mt-auto">
        <form onSubmit={handleSendMessage} className="position-relative">
          <input
            type="text"
            className={`form-control form-control-lg rounded-pill shadow-sm border-0 bg-white bg-opacity-10 text-white placeholder-light ${isDoctor ? 'pe-5 ps-4' : 'ps-5 pe-4'}`}
            placeholder={t.placeholder}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            style={{ 
              paddingLeft: isDoctor ? '20px' : '60px',
              paddingRight: isDoctor ? '60px' : '20px'
             }}
          />
          <button 
            type="submit" 
            className={`btn btn-primary rounded-circle position-absolute top-50 translate-middle-y ${isDoctor ? 'end-0 me-2' : 'start-0 ms-2'}`}
            style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <i className={`bi ${isDoctor ? 'bi-send-fill' : 'bi-send-fill'}`}></i>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatView;

