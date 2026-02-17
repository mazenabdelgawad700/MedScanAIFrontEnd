import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ModelView from "./ModelView";
import ChatView from "./ChatView";
import HubView from "./HubView";
import BreastSelfCheckView from "./BreastSelfCheckView";
import { getToken, getUserId, getUserRole } from "../../utils/auth";
import { API_BASE } from "../../utils/constants";
import "./AIAssistant.css";

/** Model configuration for each AI view type */
const MODEL_CONFIG = {
  brain: {
    title: "Brain Tumor Analysis",
    description: "Advanced AI analysis for MRI scans to detect potential anomalies.",
    icon: "bi-activity",
    color: "primary",
    titleCard: "تقرير تحليل ورم الدماغ",
    apiEndpoint: "http://localhost:8001/predict",
  },
  xray: {
    title: "X-Ray Diagnostics",
    description: "Rapid screening of X-ray images for bone fractures and lung conditions.",
    icon: "bi-lungs",
    color: "info",
    titleCard: "تقرير الاشعة المقطعية",
    apiEndpoint: "http://localhost:8002/predict",
  },
  skin: {
    title: "Dermatology AI",
    description: "Dermatological analysis for skin conditions and allergic reactions.",
    icon: "bi-person-bounding-box",
    color: "warning",
    titleCard: "نتيجة تحليل الصورة",
    apiEndpoint: "http://localhost:8000/predict",
  },
  lab: {
    title: "Lab Results Analysis",
    description: "Analyze medical lab reports for insights.",
    icon: "bi-file-earmark-medical",
    color: "danger",
    titleCard: "نتيجة تحليل المختبر",
    apiEndpoint: "http://localhost:8005/images/analyze-with-history",
    requiresPatientId: true,
  },
};

const AssistantLayout = () => {
  const [currentView, setCurrentView] = useState("hub");
  const [userGender, setUserGender] = useState(null);
  const navigate = useNavigate();

  // Fetch user profile to get gender
  useEffect(() => {
    const fetchUserGender = async () => {
      try {
        const role = getUserRole();
        if (role === "Doctor") return;

        const token = getToken();
        if (!token) return;

        const userId = getUserId();
        if (!userId) return;

        const response = await fetch(`${API_BASE}/patient/GetProfile`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ PatientId: userId }),
        });

        const data = await response.json();
        if (data.succeeded && data.data) {
          setUserGender(data.data.gender);
        }
      } catch (error) {
        console.error("Failed to fetch user gender", error);
      }
    };

    fetchUserGender();
  }, []);

  const renderContent = () => {
    switch (currentView) {
      case "hub":
        return <HubView onSelectTool={setCurrentView} userGender={userGender} />;
      
      case "brain":
      case "xray":
      case "skin": 
      case "lab": {
        const config = MODEL_CONFIG[currentView];
        const userId = getUserId();
        return (
          <ModelView
            title={config.title}
            description={config.description}
            icon={config.icon}
            color={config.color}
            titleCard={config.titleCard}
            apiEndpoint={config.apiEndpoint}
            requiresPatientId={config.requiresPatientId}
            patientId={userId}
          />
        );
      }
      
      case "chat":
        return <ChatView />;
      
      case "breastCheck":
        return <BreastSelfCheckView />;
      
      default:
        return <HubView onSelectTool={setCurrentView} userGender={userGender} />;
    }
  };

  return (
    <div className="ai-assistant-container p-4">
      <div className="container-xl">
        {/* Back to Dashboard Button */}
        <div className="mb-4" dir="rtl">
          <button
            className="btn btn-outline-primary shadow-sm rounded-pill px-4 fw-bold"
            style={{ color: "#fff" }}
            onClick={() => {
              const role = getUserRole();
              navigate(role === "Doctor" ? "/doctor/dashboard" : "/patient/dashboard");
            }}
          >
            <i className="bi bi-house-door ms-2"></i>
            العودة إلى لوحة التحكم
          </button>
        </div>

        {/* Back to Hub Button (shown when not on hub) */}
        {currentView !== "hub" && (
          <div className="mb-4" dir="rtl">
            <button
              className="btn btn-light shadow-sm rounded-pill px-4 fw-bold text-white"
              onClick={() => setCurrentView("hub")}
            >
              <i className="bi bi-arrow-right me-2"></i>
              العودة إلى مركز النماذج
            </button>
          </div>
        )}

        <div className={currentView === "hub" ? "" : "glass-card p-4 fade-in-up"}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AssistantLayout;
