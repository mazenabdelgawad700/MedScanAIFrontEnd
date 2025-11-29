import React from 'react';

const HubView = ({ onSelectTool }) => {
  const tools = [
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
    },
    {
      id: 'chat',
      title: 'محادثة صحية ذكية',
      description: 'احصل على إجابات فورية مدعومة بالذكاء الاصطناعي للاستفسارات الطبية الشائعة',
      icon: 'bi-chat-dots',
      color: 'success'
    }
  ];

  return (
    <div className="container-xl py-4" dir="rtl">
      <div className="mb-5">
        <h2 className="fw-bold text-dark mb-2">مركز نماذج الذكاء الاصطناعي</h2>
        <p className="text-muted lead">اختر أداة ذكاء اصطناعي لبدء التحليل</p>
      </div>
      
      <div className="bg-white p-5 rounded-5 shadow-sm">
        <div className="hub-grid">
          {tools.map((tool) => {
            // Determine border class based on tool
            let borderClass = '';
            if (tool.id === 'brain') {
              borderClass = 'hub-card-bordered-blue';
            } else if (tool.id === 'chat') {
              borderClass = 'hub-card-bordered-green';
            } else {
              borderClass = 'hub-card-bordered-subtle';
            }
            
            return (
              <div key={tool.id} className={`hub-card ${borderClass} p-5 d-flex flex-column align-items-center text-center`}>
                <div className="mb-3 mt-2">
                  <i className={`bi ${tool.icon}`} style={{ fontSize: '80px', color: tool.color === 'primary' ? '#2563eb' : tool.color === 'success' ? '#10b981' : tool.color === 'info' ? '#2563eb' : '#f59e0b' }}></i>
                </div>
                
                <h5 className="fw-bold mb-3">{tool.title}</h5>
                <p className="text-muted small mb-4 px-2" style={{ minHeight: '48px' }}>{tool.description}</p>
                
                <div className="mt-auto d-flex justify-content-center">
                  <button 
                    className={`btn btn-${tool.color} text-white px-4 py-2 rounded-3 fw-medium`}
                    onClick={() => onSelectTool(tool.id)}
                  >
                    تشغيل الأداة
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HubView;
