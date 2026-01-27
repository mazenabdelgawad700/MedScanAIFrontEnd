import React, { useState, useEffect, useRef } from "react";
import { API_BASE } from "../../../utils/Constants.ts";
import "./WhyUs.css";

const IconUsers = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const IconAI = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 8V4H8" />
    <rect width="16" height="12" x="4" y="8" rx="2" />
    <path d="M2 14h2" />
    <path d="M20 14h2" />
    <path d="M15 13v2" />
    <path d="M9 13v2" />
  </svg>
);

const IconShieldCheck = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const IconClock = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const WhyUs = () => {
  const [patientCount, setPatientCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetchPatientCount = async () => {
      try {
        const response = await fetch(`${API_BASE}/patient/GetPatientsCount`);
        if (response.ok) {
          const data = await response.json();
          setPatientCount(data);
        }
      } catch (error) {
        console.error("Error fetching patient count:", error);
        setPatientCount(500); // Fallback value
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatientCount();
  }, []);

  const stats = [
    {
      icon: <IconUsers />,
      value: isLoading ? "..." : `${patientCount.data.count * 10}+`,
      label: "مريض يثق بنا",
      color: "stat-blue",
    },
    {
      icon: <IconAI />,
      value: "٩٨٪",
      label: "دقة التشخيص",
      color: "stat-purple",
    },
    {
      icon: <IconShieldCheck />,
      value: "١٠٠٪",
      label: "أمان البيانات",
      color: "stat-green",
    },
    {
      icon: <IconClock />,
      value: "٢٤/٧",
      label: "دعم متواصل",
      color: "stat-orange",
    },
  ];

  const features = [
    {
      title: "تقنية ذكاء اصطناعي متقدمة",
      desc: "نستخدم أحدث نماذج الذكاء الاصطناعي لتحليل الأعراض وتقديم تشخيصات دقيقة وموثوقة.",
    },
    {
      title: "فريق طبي متخصص",
      desc: "أطباء معتمدون ومتخصصون في مختلف المجالات الطبية جاهزون لخدمتك.",
    },
    {
      title: "خصوصية تامة",
      desc: "نضمن سرية بياناتك الطبية بأعلى معايير الأمان والتشفير.",
    },
    {
      title: "سهولة الاستخدام",
      desc: "واجهة بسيطة وسهلة تمكنك من الوصول لجميع الخدمات بنقرات قليلة.",
    },
  ];

  return (
    <section className={`why-us ${isVisible ? "visible" : ""}`} ref={sectionRef}>
      <div className="why-us-inner">
        <div className="why-us-header">
          <span className="why-us-badge">لماذا نحن؟</span>
          <h2 className="why-us-title">رعاية صحية ذكية تستحقها</h2>
          <p className="why-us-subtitle">
            نجمع بين التكنولوجيا المتقدمة والخبرة الطبية لنقدم لك أفضل تجربة صحية
          </p>
        </div>

        {/* Stats Section */}
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div
              className={`stat-card ${stat.color} ${isVisible ? "animate" : ""}`}
              style={{ animationDelay: `${index * 0.1}s` }}
              key={index}
            >
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Features Section */}
        <div className="features-grid">
          {features.map((feature, index) => (
            <div
              className={`feature-card ${isVisible ? "animate" : ""}`}
              style={{ animationDelay: `${0.4 + index * 0.1}s` }}
              key={index}
            >
              <div className="feature-number">{index + 1}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-desc">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUs;

