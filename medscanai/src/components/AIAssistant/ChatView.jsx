import React, { useState, useRef, useEffect } from 'react';

const ChatView = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "مرحبًا! أنا مساعدك الطبي العام. كيف يمكنني مساعدتك اليوم؟", sender: 'bot' }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage = { id: Date.now(), text: inputText, sender: 'user' };
    setMessages(prev => [...prev, newMessage]);
    setInputText("");
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = { 
        id: Date.now() + 1, 
        text: "أفهم قلقك. كمساعد ذكاء اصطناعي، يمكنني تقديم معلومات عامة، لكن يرجى استشارة طبيب للحصول على نصيحة طبية محددة. هل يمكنك إخباري المزيد عن أعراضك؟", 
        sender: 'bot' 
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="d-flex flex-column h-100" style={{ minHeight: '600px', maxHeight: '600px' }} dir="rtl">
      <div className="border-bottom pb-3 mb-3">
        <div className="d-flex align-items-center">
          <div className="bg-primary bg-opacity-10 p-3 rounded-circle text-primary ms-3">
            <i className="bi bi-robot fs-4"></i>
          </div>
          <div>
            <h5 className="mb-0 fw-bold text-dark">مساعد الدردشة الطبية</h5>
            <small className="text-muted">دائمًا هنا لمساعدتك</small>
          </div>
        </div>
      </div>
      
      <div className="flex-grow-1 overflow-auto custom-scrollbar px-2 mb-3">
        <div className="d-flex flex-column gap-3">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`d-flex ${msg.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}
            >
              <div className={`chat-bubble ${msg.sender}`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="d-flex justify-content-start">
              <div className="bg-white border p-3 rounded-3 shadow-sm">
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
            className="form-control form-control-lg ps-4 pe-5 rounded-pill shadow-sm border-0 bg-white"
            placeholder="اكتب سؤالك الصحي..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            style={{ paddingLeft: '60px' }}
          />
          <button 
            type="submit" 
            className="btn btn-primary rounded-circle position-absolute top-50 start-0 translate-middle-y ms-2"
            style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <i className="bi bi-send-fill"></i>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatView;
