import React from "react";
import "./BreastSelfCheckView.css";

// Import step images
import step1Img from "../../assets/step1.gif";
import step2Img from "../../assets/step2.gif";
import step3Img from "../../assets/step3.gif";
import step4Img from "../../assets/step4.gif";
import step5Img from "../../assets/step5.gif";
import step6Img from "../../assets/step6.gif";

const BreastSelfCheckView = () => {
  const [viewState, setViewState] = React.useState('intro'); // 'intro', 'steps', 'conclusion'
  const [currentStepIndex, setCurrentStepIndex] = React.useState(0);

  const steps = [
    {
      id: 1,
      title: "ارفعي ذراعيكِ فوق رأسك",
      description:
        "قفي قدام المراية وارفعي إيديكِ فوق راسك. شوفي لو في أي تغييرات في شكل الثديين، زي انكماش أو تجعد في الجلد لما بترفعي إيديكِ. لو في كتلة، الجلد بيتشد وبيعمل تجاعيد.",
      image: step1Img,
    },
    {
      id: 2,
      title: "حطي إيديكِ على وركيكِ",
      description:
        "حطي إيديكِ على وركيكِ وشدي كوعيكِ للأمام. دوري على أي تغييرات في الثديين زي ما اتوصف فوق: كتل ظاهرة، اختلافات غير طبيعية بين الثديين، احمرار أو قشور في الجلد.",
      image: step2Img,
    },
    {
      id: 3,
      title: "لفي جسمك من جانب لآخر",
      description:
        "لفي جسمك من الشمال لليمين وبصي على الثديين من كل الزوايا. دوري على أي تغييرات في الشكل أو الحجم أو لون الجلد.",
      image: step3Img,
    },
    {
      id: 4,
      title: "فحص الثدي بـ 3 أصابع وانتِ واقفة",
      description:
        "الفحص الذاتي لازم يتعمل وانتِ واقفة. استخدمي صوابع السبابة والوسطى والبنصر من الإيد التانية لفحص الثدي (يعني الإيد الشمال تفحص الثدي اليمين). ارفعي الدراع اللي جنب الثدي اللي بتفحسيه. اضغطي على الثدي والمنطقة حواليه بحركات دائرية، ودوري على أي كتلة أو أي حاجة مختلفة في نسيج الثدي.",
      image: step4Img,
    },
    {
      id: 5,
      title: "فحص الحلمة",
      description:
        "اضغطي برفق على الحلمة وشوفي لو في أي إفرازات. أي إفراز غير طبيعي لازم تستشيري الدكتور فيه.",
      image: step5Img,
    },
    {
      id: 6,
      title: "فحص الثدي وانتِ مستلقية",
      description:
        "كرري الخطوة الرابعة وانتِ نايمة على ضهرك. حطي وسادة تحت راسك وإيدك ورا راسك. استخدمي الإيد التانية بتلات صوابع (السبابة والوسطى والبنصر) واضغطي على الثدي والمنطقة حواليه بحركات دائرية. زودي الضغط مع كل لفة عشان تفحصي الأنسجة الأعمق.",
      image: step6Img,
    },
    {
      id: 7,
      title: "فحص المناطق المحيطة بالثدي",
      description:
        "بعد ما تفحصي الثديين، مهم تفحصي المناطق اللي حواليهم. استمري في الحركات الدائرية مع زيادة الضغط وانتِ بتتحركي من عظمة الترقوة لعظمة الصدر ولتحت الثدي. ومن تحت الثدي، روحي للمنطقة تحت الإبط ودوري على أي تورم في الغدد الليمفاوية. وكمان افحصي فوق وتحت عظمة الترقوة. دوري على أي كتلة حاسة زي الرخام أو الجوز - حاجة مختلفة عن باقي نسيج الثدي.",
      image: null,
    },
    {
      id: 8,
      title: "اعملي الفحص في نفس الوقت كل شهر",
      description:
        "يُنصح بعمل الفحص من 7 لـ 10 أيام بعد الدورة الشهرية. اعملي الفحص الذاتي للثدي في نفس الوقت كل شهر. الستات اللي في سن اليأس ممكن يعملوا الفحص في أي وقت من الشهر، بس المهم يكون في نفس الوقت تقريباً كل شهر.",
      image: null,
    },
  ];

  const warningSignsIntro = [
    "كتل ظاهرة",
    "اختلافات غير طبيعية بين الثديين",
    "انكماش أو تجعد في نسيج الثدي",
    "احمرار أو قشور أو أي تغيرات غير طبيعية في الجلد أو الحلمات",
    "تغيرات في الحلمة، زي انقلاب الحلمة أو انسحابها للداخل",
  ];

  const handleStart = () => {
    setViewState('steps');
    setCurrentStepIndex(0);
  };

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      setViewState('conclusion');
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    } else {
      setViewState('intro');
    }
  };

  const handleRestart = () => {
    setViewState('intro');
    setCurrentStepIndex(0);
  };

  const renderIntro = () => (
    <div className="breast-check-intro-card fade-in">
      <div className="intro-header">
        <i className="bi bi-info-circle"></i>
        <h3>ابدأي بالبحث عن الفروقات بين الثديين</h3>
      </div>
      <p className="intro-text">
        قفي قدام المراية وبصي على ثدييكِ. دوري على:
      </p>
      <ul className="warning-signs-list">
        {warningSignsIntro.map((sign, index) => (
          <li key={index}>
            <i className="bi bi-exclamation-triangle"></i>
            <span>{sign}</span>
          </li>
        ))}
      </ul>
      <button className="breast-check-btn-primary" onClick={handleStart}>
        ابدأي الفحص
        <i className="bi bi-arrow-left"></i>
      </button>
    </div>
  );

  const renderStep = () => {
    const step = steps[currentStepIndex];
    return (
      <div className="breast-check-step-container fade-in" key={step.id}>
        <div className="breast-check-progress">
          <span className="step-counter">خطوة {currentStepIndex + 1} من {steps.length}</span>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="breast-check-step-card active-step">
          <div className="step-content">
            <h4 className="step-title">{step.title}</h4>
            {step.image && (
              <div className="step-image-container">
                <img
                  src={step.image}
                  alt={`خطوة ${step.id}`}
                  className="step-image"
                />
              </div>
            )}
            <p className="step-description">{step.description}</p>
          </div>
        </div>

        <div className="breast-check-navigation">
          <button className="breast-check-btn-secondary" onClick={handlePrev}>
            <i className="bi bi-arrow-right"></i>
            السابق
          </button>
          <button className="breast-check-btn-primary" onClick={handleNext}>
            {currentStepIndex === steps.length - 1 ? 'إنهاء الفحص' : 'التالي'}
            <i className="bi bi-arrow-left"></i>
          </button>
        </div>
      </div>
    );
  };

  const renderConclusion = () => (
    <div className="breast-check-conclusion-card fade-in">
      <div className="conclusion-header">
        <i className="bi bi-check-circle"></i>
        <h3>ملاحظات مهمة</h3>
      </div>
      <div className="conclusion-content">
        <div className="conclusion-item">
          <i className="bi bi-calendar-check"></i>
          <p>اعملي الفحص بشكل منتظم كل شهر في نفس الوقت</p>
        </div>
        <div className="conclusion-item">
          <i className="bi bi-hospital"></i>
          <p>
            لو لاحظتي أي تغيير غير طبيعي، استشيري الطبيب فوراً
          </p>
        </div>
        <div className="conclusion-item">
          <i className="bi bi-share"></i>
          <p>شاركي المعلومات دي مع صحابك وقرايبك</p>
        </div>
      </div>
      <button className="breast-check-btn-primary restart-btn" onClick={handleRestart}>
        <i className="bi bi-arrow-clockwise"></i>
        إعادة الفحص
      </button>
    </div>
  );

  return (
    <div className="breast-check-container" dir="rtl">
      {/* Header Section */}
      <div className="breast-check-header">
        <div className="breast-check-icon-wrapper">
          <i className="bi bi-heart-pulse"></i>
        </div>
        <h2 className="breast-check-title">الفحص الذاتي لسرطان الثدي</h2>
        <p className="breast-check-subtitle">
          دليلك الكامل للفحص الذاتي للثدي في 8 خطوات بسيطة
        </p>
      </div>

      <div className="breast-check-content-area">
        {viewState === 'intro' && renderIntro()}
        {viewState === 'steps' && renderStep()}
        {viewState === 'conclusion' && renderConclusion()}
      </div>

      {/* Credits */}
      <div className="breast-check-credits">
        <p>
          <i className="bi bi-person-badge"></i>
          هذا الدليل مبني على إرشادات طبية موثوقة للفحص الذاتي للثدي
        </p>
      </div>
    </div>
  );
};

export default BreastSelfCheckView;
