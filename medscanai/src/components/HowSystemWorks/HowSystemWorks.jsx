import React, { useState, useEffect, useRef } from "react";
import "./HowSystemWorks.css";

const IconCalendar = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M8 2v4" />
    <path d="M16 2v4" />
    <rect width="18" height="18" x="3" y="4" rx="2" />
    <path d="M3 10h18" />
  </svg>
);

const IconBrain = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 18V5" />
    <path d="M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4" />
    <path d="M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5" />
    <path d="M17.997 5.125a4 4 0 0 1 2.526 5.77" />
    <path d="M18 18a4 4 0 0 0 2-7.464" />
    <path d="M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517" />
    <path d="M6 18a4 4 0 0 1-2-7.464" />
    <path d="M6.003 5.125a4 4 0 0 0-2.526 5.77" />
  </svg>
);

const IconShield = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 3l7 3v5c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6l7-3z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 12l2 2 4-4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const HowSystemWorks = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const cards = [
    {
      title: "ملف طبي آمن",
      desc: "أنشئ ملفك الشخصي مع الأمراض المزمنة والحساسية والأدوية. يقوم الذكاء الاصطناعي بإنشاء تحذيرات دوائية لطبيبك تلقائيًا.",
      icon: <IconShield />,
      iconClass: "icon-blue",
      step: "01",
    },
    {
      title: "مساعد صحي ذكي",
      desc: "تحدث مع الذكاء الاصطناعي حول أعراضك، قم بتحميل الصور، واحصل على تقارير صحية مخصصة مع الخطوات الموصى بها.",
      icon: <IconBrain />,
      iconClass: "icon-purple",
      step: "02",
    },
    {
      title: "مواعيد سهلة",
      desc: "احجز مواعيد مع أطباء متخصصين بناءً على حالتك. يمكن للأطباء الوصول إلى تقارير الذكاء الاصطناعي لرعاية أفضل.",
      icon: <IconCalendar />,
      iconClass: "icon-green",
      step: "03",
    },
  ];

  return (
    <section className={`how-system ${isVisible ? "visible" : ""}`} ref={sectionRef}>
      <div className="how-inner">
        <div className="how-header">
          <span className="how-badge">كيف يعمل النظام</span>
          <h2 className="how-title">ثلاث خطوات بسيطة للرعاية الصحية المثالية</h2>
          <p className="how-subtitle">
            نظامنا مصمم ليكون سهل الاستخدام ويوفر لك تجربة صحية متكاملة
          </p>
        </div>

        <div className="how-timeline">
          <div className="timeline-line" />
          <div className="how-cards">
            {cards.map((c, i) => (
              <article
                className={`how-card ${isVisible ? "animate" : ""}`}
                style={{ animationDelay: `${i * 0.2}s` }}
                key={i}
              >
                <div className="card-step">{c.step}</div>
                <div className={`card-icon ${c.iconClass}`}>{c.icon}</div>
                <h3 className="card-title">{c.title}</h3>
                <p className="card-desc">{c.desc}</p>
                <div className="card-glow" />
              </article>
            ))}
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="floating-shapes">
        <div className="shape shape-1" />
        <div className="shape shape-2" />
        <div className="shape shape-3" />
      </div>
    </section>
  );
};

export default HowSystemWorks;
