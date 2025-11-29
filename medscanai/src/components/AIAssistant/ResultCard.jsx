import React from 'react';

const ResultCard = ({ diagnosis, nextSteps, color = 'primary' }) => {
  let steps = [];
  try {
    steps = typeof nextSteps === 'string' ? JSON.parse(nextSteps) : nextSteps;
  } catch (e) {
    console.error("Failed to parse nextSteps", e);
    steps = [];
  }

  return (
    <div className="card shadow-sm border-0 overflow-hidden rounded-4" dir="rtl">
      <div className={`result-card-header bg-${color} bg-gradient p-4`}>
        <div className="d-flex align-items-center">
          <div className="bg-white bg-opacity-25 p-2 rounded-circle ms-3">
            <i className="bi bi-clipboard2-pulse fs-4 text-white"></i>
          </div>
          <h5 className="mb-0 fw-bold text-white">تقرير التحليل</h5>
        </div>
      </div>
      <div className="card-body p-4 bg-white">
        <div className="mb-4">
          <h6 className={`text-${color} fw-bold text-uppercase small mb-2`}>نتيجة التشخيص</h6>
          <p className="card-text lead text-dark">{diagnosis}</p>
        </div>
        
        {steps && steps.length > 0 && (
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
