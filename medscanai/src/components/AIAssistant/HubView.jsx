import React from "react";
import "./HubView.css";

/** Color configuration for tool cards */
const COLOR_CONFIG = {
  success: {
    gradient: "linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(6, 95, 70, 0.4) 100%)",
    border: "rgba(16, 185, 129, 0.4)",
    shadow: "rgba(16, 185, 129, 0.15)",
    shadowHover: "rgba(16, 185, 129, 0.25)",
    icon: "#10b981",
    buttonBg: "linear-gradient(90deg, #10b981 0%, #059669 100%)",
  },
  primary: {
    gradient: "linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.03))",
    border: "rgba(255, 255, 255, 0.1)",
    borderHover: "rgba(37, 99, 235, 0.5)",
    shadow: "rgba(37, 99, 235, 0.15)",
    icon: "#60a5fa",
    buttonHover: "#2563eb",
    glow: "rgba(37, 99, 235, 0.2)",
  },
  warning: {
    gradient: "linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.03))",
    border: "rgba(255, 255, 255, 0.1)",
    borderHover: "rgba(245, 158, 11, 0.5)",
    shadow: "rgba(245, 158, 11, 0.15)",
    icon: "#fbbf24",
    buttonHover: "#d97706",
    glow: "rgba(245, 158, 11, 0.2)",
  },
  info: {
    gradient: "linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.03))",
    border: "rgba(255, 255, 255, 0.1)",
    borderHover: "rgba(6, 182, 212, 0.5)",
    shadow: "rgba(6, 182, 212, 0.15)",
    icon: "#22d3ee",
    buttonHover: "#0891b2",
    glow: "rgba(6, 182, 212, 0.2)",
  },
  pink: {
    gradient: "linear-gradient(180deg, rgba(236, 72, 153, 0.15), rgba(219, 39, 119, 0.08))",
    border: "rgba(236, 72, 153, 0.3)",
    borderHover: "rgba(236, 72, 153, 0.6)",
    shadow: "rgba(236, 72, 153, 0.25)",
    icon: "#f472b6",
    buttonHover: "#db2777",
    glow: "rgba(236, 72, 153, 0.2)",
  },
  danger: {
    gradient: "linear-gradient(180deg, rgba(239, 68, 68, 0.15), rgba(220, 38, 38, 0.08))",
    border: "rgba(239, 68, 68, 0.3)",
    borderHover: "rgba(239, 68, 68, 0.6)",
    shadow: "rgba(239, 68, 68, 0.25)",
    icon: "#f87171",
    buttonHover: "#dc2626",
    glow: "rgba(239, 68, 68, 0.2)",
  },
};

/** Featured tool card (chatbot) */
const FeaturedToolCard = ({ tool, onSelect }) => (
  <div
    className="featured-tool-card"
    onClick={() => onSelect(tool.id)}
  >
    <div className="featured-tool-glow" />
    <div className="featured-tool-content">
      <div className="featured-tool-icon">
        <i className={`bi ${tool.icon} text-white`}></i>
      </div>
      <h3 className="featured-tool-title">{tool.title}</h3>
      <p className="featured-tool-description">{tool.description}</p>
      <button className="featured-tool-button">
        <i className="bi bi-play-fill"></i>
        ابدأ المحادثة الآن
      </button>
    </div>
  </div>
);

/** Standard tool card for AI models */
const ToolCard = ({ tool, onSelect }) => {
  const colorClass = `tool-card-${tool.color}`;
  
  return (
    <div
      className={`tool-card ${colorClass}`}
      onClick={() => onSelect(tool.id)}
    >
      <div className="tool-card-icon-wrapper">
        <div className={`tool-card-glow tool-card-glow-${tool.color}`} />
        <i className={`bi ${tool.icon} tool-card-icon tool-card-icon-${tool.color}`}></i>
      </div>
      <h5 className="tool-card-title">{tool.title}</h5>
      <p className="tool-card-description">{tool.description}</p>
      <div className="tool-card-button-wrapper">
        <button className={`tool-card-button tool-card-button-${tool.color}`}>
          فتح النموذج
        </button>
      </div>
    </div>
  );
};

/** Women's health tool card (breast self-check) */
const WomensHealthCard = ({ onSelect }) => (
  <div
    className="tool-card tool-card-pink"
    onClick={() => onSelect("breastCheck")}
  >
    <div className="tool-card-icon-wrapper">
      <div className="tool-card-glow tool-card-glow-pink" />
      <i className="bi bi-heart-pulse tool-card-icon tool-card-icon-pink"></i>
    </div>
    <h5 className="tool-card-title">الفحص الذاتي لسرطان الثدي</h5>
    <p className="tool-card-description">
      تعلمي خطوات الفحص الذاتي للثدي للكشف المبكر عن سرطان الثدي
    </p>
    <div className="tool-card-button-wrapper">
      <button className="tool-card-button tool-card-button-pink">
        ابدأي الفحص
      </button>
    </div>
  </div>
);

const HubView = ({ onSelectTool, userGender }) => {
  const tools = [
    {
      id: "chat",
      title: "محادثة صحية ذكية",
      description:
        "احصل على إجابات فورية مدعومة بالذكاء الاصطناعي للاستفسارات الطبية الشائعة",
      icon: "bi-chat-dots",
      color: "success",
    },
    {
      id: "brain",
      title: "تحليل ورم الدماغ",
      description:
        "تحليل صور الرنين المغناطيسي/الأشعة المقطعية للكشف عن الأورام المحتملة داخل الجمجمة",
      icon: "bi-activity",
      color: "primary",
    },
    {
      id: "xray",
      title: "تشخيص الأشعة السينية",
      description:
        "يساعد في تحديد الأنماط في صور الصدر بالأشعة السينية لحالات مختلفة",
      icon: "bi-lungs",
      color: "info",
    },
    {
      id: "skin",
      title: "ذكاء اصطناعي للأمراض الجلدية",
      description: "قم بتحميل صور الجلد لتقييم الحالات الجلدية",
      icon: "bi-person-bounding-box",
      color: "warning",
    },
    {
      id: "lab",
      title: "تحليل نتائج المختبر",
      description: "قم بتحميل صور نتائج التحاليل للحصول على قراءة وتفسير",
      icon: "bi-file-earmark-medical",
      color: "danger",
    },
  ];

  const chatTool = tools.find((t) => t.id === "chat");
  const aiTools = tools.filter((t) => t.id !== "chat");

  return (
    <div className="hub-container" dir="rtl">
      {/* Header */}
      <div className="hub-header">
        <h2 className="hub-title">مركز نماذج الذكاء الاصطناعي</h2>
        <p className="hub-subtitle">اختر أداة ذكاء اصطناعي لبدء التحليل</p>
      </div>

      {/* Featured Chatbot Section */}
      {chatTool && (
        <div className="hub-featured-section">
          <FeaturedToolCard tool={chatTool} onSelect={onSelectTool} />
        </div>
      )}

      {/* AI Models Section */}
      <h4 className="hub-section-title">
        <i className="bi bi-grid-fill text-primary"></i>
        أدوات التحليل الطبي المتخصصة
      </h4>

      <div className="hub-grid">
        {aiTools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} onSelect={onSelectTool} />
        ))}
      </div>

      {/* Women's Health Section (female users only) */}
      {userGender === "Female" && (
        <>
          <h4 className="hub-section-title hub-section-title-pink">
            <i className="bi bi-heart-pulse"></i>
            فحوصات صحة المرأة
          </h4>
          <div className="hub-grid hub-grid-single">
            <WomensHealthCard onSelect={onSelectTool} />
          </div>
        </>
      )}
    </div>
  );
};

export default HubView;
