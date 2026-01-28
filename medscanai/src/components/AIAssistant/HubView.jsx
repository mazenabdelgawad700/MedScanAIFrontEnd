import React from 'react';

const HubView = ({ onSelectTool }) => {
  const tools = [
    {
      id: 'chat',
      title: 'محادثة صحية ذكية',
      description: 'احصل على إجابات فورية مدعومة بالذكاء الاصطناعي للاستفسارات الطبية الشائعة',
      icon: 'bi-chat-dots',
      color: 'success'
    },
    {
      id: 'brain',
      title: 'تحليل ورم الدماغ',
      description: 'تحليل صور الرنين المغناطيسي/الأشعة المقطعية للكشف عن الأورام المحتملة داخل الجمجمة',
      icon: 'bi-activity',
      color: 'primary'
    },
    {
      id: 'xray',
      title: 'تشخيص الأشعة السينية',
      description: 'يساعد في تحديد الأنماط في صور الصدر بالأشعة السينية لحالات مختلفة',
      icon: 'bi-lungs',
      color: 'info'
    },
    {
      id: 'skin',
      title: 'ذكاء اصطناعي للأمراض الجلدية',
      description: 'قم بتحميل صور الجلد لتقييم الحالات الجلدية',
      icon: 'bi-person-bounding-box',
      color: 'warning'
    }
  ];

  const commanderTool = tools.find(t => t.id === 'chat');
  const soldierTools = tools.filter(t => t.id !== 'chat');

  return (
    <div className="container-xl py-4" dir="rtl">
      <div className="mb-5 text-center">
        <h2 className="fw-bold mb-2 text-white">مركز نماذج الذكاء الاصطناعي</h2>
        <p className="text-white-50 lead">اختر أداة ذكاء اصطناعي لبدء التحليل</p>
      </div>

      {/* Commander Section - Chatbot */}
      {commanderTool && (
        <div className="row justify-content-center mb-5">
          <div className="col-12 text-center">
            {/* <div className="d-flex align-items-center justify-content-center gap-2 mb-3">
               <span className="badge bg-warning text-dark rounded-pill px-3 py-2 fs-6">
                 <i className="bi bi-star-fill me-1"></i> المميز
               </span>
            </div> */}
            
            <div 
              className="featured-tool-card position-relative overflow-hidden rounded-5 p-5 mx-auto"
              style={{
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(6, 95, 70, 0.4) 100%)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                backdropFilter: 'blur(20px)',
                maxWidth: '800px',
                boxShadow: '0 20px 50px rgba(16, 185, 129, 0.15)',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onClick={() => onSelectTool(commanderTool.id)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 30px 60px rgba(16, 185, 129, 0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 20px 50px rgba(16, 185, 129, 0.15)';
              }}
            >
              <div className="position-absolute top-0 start-0 w-100 h-100" 
                   style={{
                     background: 'radial-gradient(circle at top right, rgba(16, 185, 129, 0.3), transparent 60%)',
                     pointerEvents: 'none'
                   }} 
              />
              
              <div className="d-flex flex-column align-items-center position-relative" style={{ zIndex: 2 }}>
                <div className="feature-icon-wrapper mb-4 p-4 rounded-circle"
                     style={{
                       background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                       boxShadow: '0 0 40px rgba(16, 185, 129, 0.4)'
                     }}
                >
                  <i className={`bi ${commanderTool.icon} text-white`} style={{ fontSize: '48px' }}></i>
                </div>
                
                <h3 className="fw-bold text-white mb-3 display-6">{commanderTool.title}</h3>
                <p className="text-white-50 fs-5 mb-4" style={{ maxWidth: '600px' }}>{commanderTool.description}</p>
                
                <button 
                  className="btn btn-lg btn-success text-white px-5 py-3 rounded-pill fw-bold shadow-lg"
                  style={{
                    background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
                    border: 'none',
                    letterSpacing: '0.5px'
                  }}
                >
                  <i className="bi bi-play-fill me-2 fs-4 align-middle"></i>
                  ابدأ المحادثة الآن
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Soldiers Section - Other Models */}
      <h4 className="text-white fw-bold mb-4 text-center opacity-75">
        <i className="bi bi-grid-fill me-2 text-primary"></i>
        أدوات التحليل الطبي المتخصصة
      </h4>

      <div className="hub-grid">
        {soldierTools.map((tool) => (
          <div 
            key={tool.id} 
            className="hub-card p-4 d-flex flex-column align-items-center text-center position-relative overflow-hidden"
            style={{
              background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.03))',
              borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'pointer',
              height: '100%'
            }}
            onClick={() => onSelectTool(tool.id)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.borderColor = tool.color === 'primary' ? 'rgba(37, 99, 235, 0.5)' : tool.color === 'warning' ? 'rgba(245, 158, 11, 0.5)' : 'rgba(37, 99, 235, 0.5)';
              e.currentTarget.style.boxShadow = `0 20px 40px ${tool.color === 'primary' ? 'rgba(37, 99, 235, 0.15)' : tool.color === 'warning' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(37, 99, 235, 0.15)'}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div className="mb-4 mt-2 position-relative">
              <div 
                className="position-absolute top-50 start-50 translate-middle"
                style={{
                  width: '60px',
                  height: '60px',
                  background: tool.color === 'primary' ? 'rgba(37, 99, 235, 0.2)' : tool.color === 'warning' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(6, 182, 212, 0.2)',
                  borderRadius: '50%',
                  filter: 'blur(20px)',
                  zIndex: 0
                }}
              />
              <i 
                className={`bi ${tool.icon} position-relative`} 
                style={{ 
                  fontSize: '56px', 
                  color: tool.color === 'primary' ? '#60a5fa' : tool.color === 'warning' ? '#fbbf24' : '#22d3ee',
                  zIndex: 1
                }}
              ></i>
            </div>
            
            <h5 className="fw-bold mb-3 text-white">{tool.title}</h5>
            <p className="small text-white-50 mb-4 px-2" style={{ minHeight: '40px' }}>{tool.description}</p>
            
            <div className="mt-auto w-100">
              <button 
                className={`btn w-100 py-2 rounded-3 fw-medium`}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = tool.color === 'primary' ? '#2563eb' : tool.color === 'warning' ? '#d97706' : '#0891b2';
                  e.currentTarget.style.borderColor = 'transparent';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                فتح النموذج
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HubView;
