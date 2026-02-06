import React from 'react';
import { getUserRole } from "../../utils/auth";
import "./HubView.css"; // Ensure simplified CSS is available if not globally

const ResultCard = ({ diagnosis, diagnosisEn, nextSteps, advice, confidence, title, color = 'primary' }) => {
  const isDoctor = getUserRole() === "Doctor";
  
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
        return <strong key={index} className="text-white bg-light bg-opacity-10 px-1 rounded">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="result-card" dir={isDoctor ? "ltr" : "rtl"}>
      <div className={`result-card-header`}>
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <div className={`p-2 rounded-circle ${isDoctor ? 'me-3' : 'ms-3'} bg-${color} bg-opacity-10 text-${color}`}>
              <i className="bi bi-clipboard2-pulse fs-4"></i>
            </div>
            <h5 className="mb-0 fw-bold text-white">{title}</h5>
          </div>
          {confidence && (
            <span className={`badge bg-${color} bg-opacity-10 text-${color} border border-${color} border-opacity-25 rounded-pill px-3 py-2 fw-bold`} dir="ltr">
              {confidence}
            </span>
          )}
        </div>
      </div>
      
      <div className="result-card-body">
        <div className="mb-4">
          <h6 className={`text-${color} fw-bold text-uppercase small mb-2`}>النتيجة</h6>
          <p className="lead text-white fw-bold mb-1">{diagnosis}</p>
          {diagnosisEn && (
            <p className={`text-glass-muted small mb-0 ${isDoctor ? 'text-start' : 'text-end'}`} dir="ltr">{diagnosisEn}</p>
          )}
        </div>
        
        {advice && (
          <div>
            <h6 className={`text-${color} fw-bold text-uppercase small mb-3`}>النصائح والتوصيات</h6>
            <div className={`result-card-section border-${isDoctor ? 'start' : 'end'} border-4 border-${color} ${isDoctor ? 'border-opacity-50' : ''}`}>
              <div className="mb-0 text-glass fw-medium" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8' }}>
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
                <div key={index} className={`d-flex align-items-start result-card-section border-${isDoctor ? 'start' : 'end'} border-4 border-${color} ${isDoctor ? 'border-opacity-50' : ''}`}>
                  <i className={`bi bi-check-circle-fill text-${color} ${isDoctor ? 'me-3' : 'ms-3'} mt-1`}></i>
                  <span className="text-glass fw-medium">{step}</span>
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
