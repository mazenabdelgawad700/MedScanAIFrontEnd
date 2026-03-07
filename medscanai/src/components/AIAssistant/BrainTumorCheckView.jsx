import React from "react";
import "./BrainTumorCheckView.css";

// Import step videos
import step1Video from "../../assets/BrainTumorStep1.mp4";
import step2Video from "../../assets/BrainTumorStep2.mp4";
import step3Video from "../../assets/BrainTumorStep3.mp4";
import step4Video from "../../assets/BrainTumorStep4.mp4";
import step5Video from "../../assets/BrainTumorStep5.mp4";

const BrainTumorCheckView = () => {
  const [viewState, setViewState] = React.useState("intro"); // 'intro', 'steps', 'conclusion'
  const [currentStepIndex, setCurrentStepIndex] = React.useState(0);

  const steps = [
    {
      id: 1,
      title: "اختبار التوازن (Balance - Romberg Test)",
      description:
        "1. اختبار التوازن (Balance - Romberg Test)\nالتعليمات للمريض: \"لو سمحت، اقف واضم رجليك الاتنين لبعض على الآخر، ونزل دراعاتك جنبك. دلوقتي عايزك تغمض عينيك وتخليك ثابت في مكانك كده لمدة 30 ثانية من غير ما تتحرك.\"\n\nالملاحظة: لو المريض بدأ يترنح أو يتهز يمين وشمال، أو فقد توازنه أول ما غمض عينه، دي إشارة لمشكلة في التوازن الحسي أو العصبي",
      video: step1Video,
    },
    {
      id: 2,
      title: "التنسيق الحركي (Coordination - Finger-to-Nose)",
      description:
        "2. التنسيق الحركي (Coordination - Finger-to-Nose)\nالتعليمات للمريض: \"افرد دراعك لقدام على الآخر.. دلوقتي عايزك تلمس أرنبة مناخيرك بصباعك السبابة بسرعة وبدقة، وبعدين ترجع تلمس صباعي.. كرر الحركة دي كذا مرة، ودلوقتي جرب تعملها وأنت مغمض عينيك.\"\n\nالملاحظة: وجود \"رعشة\" (Tremor) في الإيد وهي بتقرب من الوش، أو إن المريض مايقدرش يحدد مكان مناخيره بدقة (يخبط في خده مثلاً)، ده مؤشر مهم لمشكلة في التوافق العضلي.",
      video: step2Video,
    },
    {
      id: 3,
      title: "اختبار حركة العين والرؤية (Cranial Nerves - H-Pattern)",
      description:
        "3. اختبار حركة العين والرؤية (Cranial Nerves - H-Pattern)\nالتعليمات للمريض: \"خلي راسك ثابتة خالص وماتحركهاش.. وبعينيك بس، تابع حركة صباعي ده. هحركه يمين وشمال وفوق وتحت، خليك باصص عليه من غير ما تلف رقبتك.\"\n\nالملاحظة: لو المريض اشتكى من \"زغللة\" أو شاف الحاجة اتنين، أو لو عينه مش قادرة تروح للأطراف، أو لو حصلت حركة اهتزازية سريعة للعين (رأرأة - Nystagmus) وهو بيبص للجنب",
      video: step3Video,
    },
    {
      id: 4,
      title: "اختبار القوة العضلية (Motor Strength - Pronator Drift)",
      description:
        "4. اختبار القوة العضلية (Motor Strength - Pronator Drift)\nالتعليمات للمريض: \"اقعد مستريح وارفع دراعاتك الاتنين مفرودين قدامك، وخلي كف إيدك باصص لفوق كأنك شايل صينية. دلوقتي غمض عينيك وخليك رافع إيدك كده وثابت لمدة 20 ثانية.\"\n\nالملاحظة: لو في إيد بدأت \"تلف\" لجوه (كف الإيد يبص للأرض) أو \"تنزل\" لتحت ببطء لوحدها، ده معناه وجود ضعف عصبي خفي في الجنب ده من الجسم",
      video: step4Video,
    },
    {
      id: 5,
      title: "القدرات المعرفية والكلام (Cognitive & Speech)",
      description:
        "5. القدرات المعرفية والكلام (Cognitive & Speech)\nالتعليمات للمريض (في شكل دردشة): \"أخبارك إيه النهاردة؟ حاسس بوجع أو صداع بيجيلك أول ما تصحى من النوم؟ طيب فاكر اسم [شخص مقرب أو مكان بيحبه]؟\"\n\nالملاحظة: ملاحظة أي \"تقل\" في اللسان (Slurred Speech) أو إنه بيعاني عشان يفتكر كلمات بسيطة. كمان التغيير المفاجئ في الشخصية (زي العصبية الزايدة) أو نوبات الصداع اللي بتبقى قوية الصبح وتقل على مدار اليوم، دي كلها مؤشرات قوية جداً",
      video: step5Video,
    },
  ];

  const warningSignsIntro = [
    "صداع قوي خاصة الصبح",
    "مشاكل في التوازن والتنسيق الحركي",
    "مشاكل في الرؤية أو تحرك العين",
    "ضعف عضلي أو شلل جزئي",
    "مشاكل في الكلام أو الفهم",
    "تغييرات في الشخصية أو السلوك",
  ];

  const handleStart = () => {
    setViewState("steps");
    setCurrentStepIndex(0);
  };

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      setViewState("conclusion");
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    } else {
      setViewState("intro");
    }
  };

  const handleRestart = () => {
    setViewState("intro");
    setCurrentStepIndex(0);
  };

  const renderIntro = () => (
    <div className="brain-check-intro-card fade-in">
      <div className="intro-header">
        <i className="bi bi-info-circle"></i>
        <h3>اختبارات عصبية سريعة</h3>
      </div>
      <p className="intro-text">
        سأساعدك تعمل اختبارات عصبية بسيطة في البيت. تابع الخطوات بعناية شديدة وملاحظ أي أعراض قد تظهر:
      </p>
      <ul className="warning-signs-list">
        {warningSignsIntro.map((sign, index) => (
          <li key={index}>
            <i className="bi bi-exclamation-triangle"></i>
            <span>{sign}</span>
          </li>
        ))}
      </ul>
      <button className="brain-check-btn-primary" onClick={handleStart}>
        ابدأ الاختبارات
        <i className="bi bi-arrow-left"></i>
      </button>
    </div>
  );

  const renderStep = () => {
    const step = steps[currentStepIndex];
    return (
      <div className="brain-check-step-container fade-in" key={step.id}>
        <div className="brain-check-progress">
          <span className="step-counter">خطوة {currentStepIndex + 1} من {steps.length}</span>
          <div className="progress-bar">
            <div
              className="progress-fill brain-progress-fill"
              style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="brain-check-step-card active-step">
          <div className="step-content">
            <h4 className="step-title">{step.title}</h4>
            {step.video && (
              <div className="step-video-container">
                <video
                  src={step.video}
                  controls
                  className="step-video"
                >
                  متصفحك لا يدعم تشغيل الفيديو
                </video>
              </div>
            )}
            <p className="step-description">{step.description}</p>
          </div>
        </div>

        <div className="brain-check-navigation">
          <button className="brain-check-btn-secondary" onClick={handlePrev}>
            <i className="bi bi-arrow-right"></i>
            السابق
          </button>
          <button className="brain-check-btn-primary" onClick={handleNext}>
            {currentStepIndex === steps.length - 1 ? "إنهاء الاختبار" : "التالي"}
            <i className="bi bi-arrow-left"></i>
          </button>
        </div>
      </div>
    );
  };

  const renderConclusion = () => (
    <div className="brain-check-conclusion-card fade-in">
      <div className="conclusion-header">
        <i className="bi bi-check-circle"></i>
        <h3>ملاحظات مهمة</h3>
      </div>
      <div className="conclusion-content">
        <div className="conclusion-item">
          <i className="bi bi-hospital"></i>
          <p>لو لاحظت أي أعراض غير طبيعية، استشير الطبيب فوراً</p>
        </div>
        <div className="conclusion-item">
          <i className="bi bi-alarm"></i>
          <p>الصداع المستمر أو الضعف العضلي يحتاج متابعة طبية عاجلة</p>
        </div>
        <div className="conclusion-item">
          <i className="bi bi-share"></i>
          <p>شارك المعلومات دي مع أسرتك وشجعهم على عمل الاختبارات</p>
        </div>
      </div>
      <button className="brain-check-btn-primary restart-btn" onClick={handleRestart}>
        <i className="bi bi-arrow-clockwise"></i>
        إعادة الاختبارات
      </button>
    </div>
  );

  return (
    <div className="brain-check-container" dir="rtl">
      {/* Header Section */}
      <div className="brain-check-header">
        <div className="brain-check-icon-wrapper">
          <i className="bi bi-activity"></i>
        </div>
        <h2 className="brain-check-title">الاختبارات العصبية لسرطان الدماغ</h2>
        <p className="brain-check-subtitle">
          دليلك الكامل للاختبارات العصبية السريعة في 5 خطوات
        </p>
      </div>

      <div className="brain-check-content-area">
        {viewState === "intro" && renderIntro()}
        {viewState === "steps" && renderStep()}
        {viewState === "conclusion" && renderConclusion()}
      </div>

      {/* Credits */}
      <div className="brain-check-credits">
        <p>
          <i className="bi bi-person-badge"></i>
          هذا الدليل مبني على اختبارات عصبية موثوقة للكشف المبكر
        </p>
      </div>
    </div>
  );
};

export default BrainTumorCheckView;
