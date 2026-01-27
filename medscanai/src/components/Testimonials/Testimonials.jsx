import React, { useState, useEffect, useRef } from "react";
import "./Testimonials.css";

const IconQuote = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M11.192 15.757c0-.88-.23-1.618-.69-2.217-.326-.412-.768-.683-1.327-.812-.55-.128-1.07-.137-1.54-.028-.16-.95.1-1.956.76-3.022.66-1.065 1.515-1.867 2.558-2.403L9.373 5c-.8.396-1.56.898-2.26 1.505-.71.607-1.34 1.305-1.9 2.094s-.98 1.68-1.25 2.69-.346 2.04-.217 3.1c.168 1.4.62 2.52 1.356 3.35.735.84 1.652 1.26 2.748 1.26.965 0 1.766-.29 2.4-.878.628-.576.94-1.365.94-2.368l.002.004zm9.124 0c0-.88-.23-1.618-.69-2.217-.326-.42-.77-.692-1.327-.817-.56-.124-1.074-.13-1.54-.022-.16-.94.09-1.95.75-3.02.66-1.06 1.514-1.86 2.557-2.4L18.49 5c-.8.396-1.555.898-2.26 1.505-.708.607-1.34 1.305-1.894 2.094-.556.79-.97 1.68-1.24 2.69-.273 1-.345 2.04-.217 3.1.165 1.4.615 2.52 1.35 3.35.732.833 1.646 1.25 2.742 1.25.967 0 1.768-.29 2.402-.876.627-.576.942-1.365.942-2.368v.012z" />
  </svg>
);

const IconStar = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const Testimonials = () => {
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

  const testimonials = [
    {
      name: "أحمد محمد",
      role: "مريض سكري",
      avatar: "أ",
      rating: 5,
      text: "تطبيق رائع ساعدني في متابعة حالتي الصحية بشكل يومي. الذكاء الاصطناعي يعطيني نصائح قيمة جداً.",
    },
    {
      name: "فاطمة علي",
      role: "أم لطفلين",
      avatar: "ف",
      rating: 5,
      text: "أصبح حجز المواعيد أسهل بكثير. أحب كيف يمكنني التحدث مع الذكاء الاصطناعي عن أعراض أطفالي.",
    },
    {
      name: "د. خالد العمري",
      role: "طبيب باطني",
      avatar: "خ",
      rating: 5,
      text: "أداة ممتازة تساعدني في الحصول على معلومات دقيقة عن مرضاي قبل الموعد. توفر الكثير من الوقت.",
    },
  ];

  return (
    <section className={`testimonials ${isVisible ? "visible" : ""}`} ref={sectionRef}>
      <div className="testimonials-inner">
        <div className="testimonials-header">
          <span className="testimonials-badge">آراء المستخدمين</span>
          <h2 className="testimonials-title">ماذا يقول مرضانا عنا</h2>
          <p className="testimonials-subtitle">
            انضم إلى آلاف المستخدمين الراضين عن خدماتنا
          </p>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((t, i) => (
            <article
              className={`testimonial-card ${isVisible ? "animate" : ""}`}
              style={{ animationDelay: `${i * 0.15}s` }}
              key={i}
            >
              <div className="quote-icon">
                <IconQuote />
              </div>
              <p className="testimonial-text">{t.text}</p>
              <div className="testimonial-rating">
                {[...Array(t.rating)].map((_, j) => (
                  <span key={j} className="star">
                    <IconStar />
                  </span>
                ))}
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">{t.avatar}</div>
                <div className="author-info">
                  <h4 className="author-name">{t.name}</h4>
                  <span className="author-role">{t.role}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Background Pattern */}
      <div className="testimonials-pattern" />
    </section>
  );
};

export default Testimonials;
