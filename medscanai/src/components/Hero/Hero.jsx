import { NavLink } from "react-router-dom";
import "./Hero.css";

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-inner">
        <h3 className="hero-title">صحتك، بقوة الذكاء الاصطناعي</h3>
        <p className="hero-sub">
          احصل على رؤى صحية مخصصة، تحدث مع الذكاء الاصطناعي حول أعراضك، واحجز
          مواعيد مع أطباء متخصصين كل ذلك في مكان واحد.
        </p>
        <div className="hero-cta">
          <NavLink className="cta-button" to="/login">
            ابدأ الآن
          </NavLink>
        </div>
      </div>
    </section>
  );
};

export default Hero;
