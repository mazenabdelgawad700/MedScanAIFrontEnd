import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ModelView from './ModelView';
import ChatView from './ChatView';
import HubView from './HubView';
import './AIAssistant.css';

const AssistantLayout = () => {
  const [currentView, setCurrentView] = useState('hub');
  const navigate = useNavigate();

  const renderContent = () => {
    switch (currentView) {
      case 'hub':
        return <HubView onSelectTool={setCurrentView} />;
      case 'brain':
        return (
          <ModelView 
            title="Brain Tumor Analysis" 
            description="Advanced AI analysis for MRI scans to detect potential anomalies."
            icon="bi-activity"
            color="primary"
          />
        );
      case 'xray':
        return (
          <ModelView 
            title="X-Ray Diagnostics" 
            description="Rapid screening of X-ray images for bone fractures and lung conditions."
            icon="bi-lungs"
            color="info"
          />
        );
      case 'skin':
        return (
          <ModelView 
            title="Dermatology AI" 
            description="Dermatological analysis for skin conditions and allergic reactions."
            icon="bi-person-bounding-box"
            color="warning"
            apiEndpoint="http://localhost:8000/predict"
          />
        );
      case 'chat':
        return <ChatView />;
      default:
        return <HubView onSelectTool={setCurrentView} />;
    }
  };

  return (
    <div className="ai-assistant-container p-4">
      <div className="container-xl">
        {/* Back to Dashboard Button */}
        <div className="mb-4" dir="rtl">
          <button 
            className="btn btn-outline-primary shadow-sm rounded-pill px-4 fw-bold"
            onClick={() => navigate('/patient/dashboard')}
          >
            <i className="bi bi-house-door me-2"></i>
            العودة إلى لوحة التحكم
          </button>
        </div>

        {/* Back to Hub Button (shown when not on hub) */}
        {currentView !== 'hub' && (
          <div className="mb-4" dir="rtl">
            <button 
              className="btn btn-light shadow-sm rounded-pill px-4 fw-bold text-primary"
              onClick={() => setCurrentView('hub')}
            >
              <i className="bi bi-arrow-right me-2"></i>
              العودة إلى مركز النماذج
            </button>
          </div>
        )}

        <div className={currentView === 'hub' ? '' : 'glass-card p-4 fade-in-up'}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AssistantLayout;
