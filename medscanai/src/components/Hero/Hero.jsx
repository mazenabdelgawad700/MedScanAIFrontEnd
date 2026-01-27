import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "./Hero.css";
import med1 from "../../assets/med1.jpg";
import med2 from "../../assets/med2.jpg";

const Hero = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const images = [med1, med2];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  const handleScrollDown = () => {
    const nextSection = document.querySelector(".why-us");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="hero">
      {/* Background Image Slider */}
      <div className="hero-bg-slider">
        {images.map((img, index) => (
          <div
            key={index}
            className={`hero-bg-slide ${index === currentImage ? "active" : ""}`}
            style={{ backgroundImage: `url(${img})` }}
          />
        ))}
        <div className="hero-overlay" />
      </div>

      <div className="hero-inner">
        <span className="hero-badge">مدعوم بالذكاء الاصطناعي</span>
        <h1 className="hero-title">صحتك، بقوة الذكاء الاصطناعي</h1>
        <p className="hero-sub">
          احصل على رؤى صحية مخصصة، تحدث مع الذكاء الاصطناعي حول أعراضك، واحجز
          مواعيد مع أطباء متخصصين — كل ذلك في مكان واحد.
        </p>
        <div className="hero-cta">
          <NavLink className="cta-button primary" to="/auth">
            ابدأ الآن
          </NavLink>
          <NavLink className="cta-button secondary" to="/auth">
            تعرف علينا
          </NavLink>
        </div>
      </div>

      {/* Scroll Indicator - Positioned outside hero-inner for better placement */}
      <button
        className="scroll-indicator"
        onClick={handleScrollDown}
        aria-label="Scroll down"
      >
        <div className="scroll-mouse">
          <div className="scroll-wheel" />
        </div>
        <div className="scroll-arrows">
          <span className="arrow-1" />
          <span className="arrow-2" />
        </div>
      </button>
    </section>
  );
};

export default Hero;

