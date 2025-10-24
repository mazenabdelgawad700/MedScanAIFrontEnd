import React from "react";
import "./HowSystemWorks.css";

const IconCalendar = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="lucide lucide-calendar h-6 w-6 text-green-600"
    aria-hidden="true"
  >
    <path d="M8 2v4"></path>
    <path d="M16 2v4"></path>
    <rect width="18" height="18" x="3" y="4" rx="2"></rect>
    <path d="M3 10h18"></path>
  </svg>
);

const IconBrain = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="lucide lucide-brain h-6 w-6 text-purple-600"
    aria-hidden="true"
  >
    <path d="M12 18V5"></path>
    <path d="M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4"></path>
    <path d="M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5"></path>
    <path d="M17.997 5.125a4 4 0 0 1 2.526 5.77"></path>
    <path d="M18 18a4 4 0 0 0 2-7.464"></path>
    <path d="M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517"></path>
    <path d="M6 18a4 4 0 0 1-2-7.464"></path>
    <path d="M6.003 5.125a4 4 0 0 0-2.526 5.77"></path>
  </svg>
);

const IconShield = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
    <path
      d="M12 3l7 3v5c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6l7-3z"
      stroke="#2B7BE4"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const HowSystemWorks = () => {
  const cards = [
    {
      title: "ملف طبي آمن",
      desc: "أنشئ ملفك الشخصي مع الأمراض المزمنة والحساسية والأدوية. يقوم الذكاء الاصطناعي بإنشاء تحذيرات دوائية لطبيبك تلقائيًا.",
      icon: <IconShield />,
      iconClass: "icon-blue",
    },
    {
      title: "مساعد صحي ذكي",
      desc: "تحدث مع الذكاء الاصطناعي حول أعراضك، قم بتحميل الصور، واحصل على تقارير صحية مخصصة مع الخطوات الموصى بها.",
      icon: <IconBrain />,
      iconClass: "icon-purple",
    },
    {
      title: "مواعيد سهلة",
      desc: "احجز مواعيد مع أطباء متخصصين بناءً على حالتك. يمكن للأطباء الوصول إلى تقارير الذكاء الاصطناعي لرعاية أفضل.",
      icon: <IconCalendar />,
      iconClass: "icon-green",
    },
  ];

  return (
    <section className="how-system">
      <div className="how-inner">
        <h2 className="how-title">كيف يعمل النظام</h2>
        <div className="how-cards">
          {cards.map((c, i) => (
            <article className="how-card" key={i}>
              <div className={`card-icon ${c.iconClass}`}>{c.icon}</div>
              <h3 className="card-title">{c.title}</h3>
              <p className="card-desc">{c.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowSystemWorks;
