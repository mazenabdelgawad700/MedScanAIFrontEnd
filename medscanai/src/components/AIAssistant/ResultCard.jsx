import React from 'react';

const ResultCard = ({ diagnosis, diagnosisEn, nextSteps, advice, confidence, title, color = 'primary' }) => {
  let steps = [];
  try {
    steps = typeof nextSteps === 'string' ? JSON.parse(nextSteps) : nextSteps;
  } catch (e) {
    console.error("Failed to parse nextSteps", e);
    steps = [];
  }

  // Simple markdown parser for bold text
  const formatAdvice = (text) => {
    if (!text) return null;
    return text.split(/(\*\*.*?\*\*)/g).map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="text-dark">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="card shadow-sm border-0 overflow-hidden rounded-4" dir="rtl">
      <div className={`result-card-header bg-${color} bg-gradient p-4`}>
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <div className="bg-white bg-opacity-25 p-2 rounded-circle ms-3">
              <i className="bi bi-clipboard2-pulse fs-4 text-white"></i>
            </div>
            <h5 className="mb-0 fw-bold text-white">{title}</h5>
          </div>
          {confidence && (
            <span className="badge bg-white text-primary rounded-pill px-3 py-2 fw-bold dir-ltr">
              نسبة الثقة  {confidence}
            </span>
          )}
        </div>
      </div>
      <div className="card-body p-4 bg-white">
        <div className="mb-4">
          <h6 className={`text-${color} fw-bold text-uppercase small mb-2`}>النتيجة</h6>
          <p className="card-text lead text-dark fw-bold mb-1">{diagnosis}</p>
          {diagnosisEn && (
            <p className="text-muted small dir-ltr text-end mb-0">{diagnosisEn}</p>
          )}
        </div>
        
        {advice && (
          <div>
            <h6 className={`text-${color} fw-bold text-uppercase small mb-3`}>النصائح والتوصيات</h6>
            <div className="p-3 rounded-3 bg-light border-end border-4 border-secondary">
              <div className="mb-0 text-secondary fw-medium" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8' }}>
                {formatAdvice(advice)}
              </div>
            </div>
          </div>
        )}

        {/* Fallback for legacy nextSteps array if advice is not provided */}
        {!advice && steps && steps.length > 0 && (
          <div>
            <h6 className={`text-${color} fw-bold text-uppercase small mb-3`}>الخطوات التالية الموصى بها</h6>
            <div className="d-flex flex-column gap-2">
              {steps.map((step, index) => (
                <div key={index} className="d-flex align-items-start p-3 rounded-3 bg-light border-end border-4 border-secondary">
                  <i className={`bi bi-check-circle-fill text-${color} ms-3 mt-1`}></i>
                  <span className="text-secondary fw-medium">{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultCard;
