import React, { useState } from 'react';
import ResultCard from './ResultCard';

const ModelView = ({ title, description, icon, color = 'primary' }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleAnalyze = () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    
    setTimeout(() => {
      setIsAnalyzing(false);
      setResult({
        Diagnose: "بناءً على تحليل الصورة المقدمة، هناك مؤشرات تشير إلى شذوذ محتمل يتوافق مع الأنماط المبكرة. ومع ذلك، يتطلب التشخيص النهائي الارتباط السريري.",
        NextSteps: JSON.stringify([
          "استشر أخصائيًا للحصول على مراجعة تفصيلية",
          "حدد موعدًا لفحص متابعة بالرنين المغناطيسي/الأشعة المقطعية إذا أوصى الطبيب",
          "راقب أي أعراض مصاحبة"
        ]),
        somethingIdonotremeber: "fsdfsdfsdf"
      });
    }, 2000);
  };

  return (
    <div className="h-100 d-flex flex-column" dir="rtl">
      <div className="text-center mb-4">
        <div className={`d-inline-flex align-items-center justify-content-center p-3 rounded-circle bg-${color} bg-opacity-10 text-${color} mb-3`}>
          <i className={`bi ${icon} display-6`}></i>
        </div>
        <h2 className="fw-bold text-dark">{title}</h2>
        <p className="text-muted lead fs-6">{description}</p>
      </div>

      <div className="row justify-content-center flex-grow-1">
        <div className="col-md-10 col-lg-8">
          <div className="card border-0 shadow-none bg-transparent">
            <div className="card-body p-0">
              <div className="mb-4 position-relative">
                <input 
                  type="file" 
                  accept="image/*" 
                  className="position-absolute w-100 h-100 opacity-0" 
                  style={{ zIndex: 10, cursor: 'pointer' }}
                  onChange={handleImageChange}
                  id="imageUpload"
                />
                <div className={`upload-area p-5 text-center ${isAnalyzing ? 'pulse-animation' : ''}`}>
                  {selectedImage ? (
                    <div className="position-relative">
                      <img 
                        src={selectedImage} 
                        alt="معاينة" 
                        className="img-fluid rounded shadow-sm" 
                        style={{ maxHeight: '300px', objectFit: 'contain' }} 
                      />
                      {isAnalyzing && (
                        <div className="position-absolute top-50 start-50 translate-middle">
                          <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
                            <span className="visually-hidden">جاري التحميل...</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-muted py-4">
                      <i className={`bi bi-cloud-arrow-up display-4 text-${color} mb-3 d-block`}></i>
                      <h5 className="fw-semibold">اسحب الصورة هنا أو انقر للتصفح</h5>
                      <p className="small mb-0">يدعم JPG، PNG، DICOM</p>
                    </div>
                  )}
                </div>
              </div>

              <button 
                className={`btn btn-${color} w-100 py-3 rounded-pill fw-bold shadow-sm transition-all`} 
                onClick={handleAnalyze}
                disabled={!selectedImage || isAnalyzing}
                style={{ transform: isAnalyzing ? 'scale(0.98)' : 'scale(1)' }}
              >
                {isAnalyzing ? 'جاري تحليل الصورة...' : 'بدء التحليل'}
              </button>
            </div>
          </div>

          {result && (
            <div className="fade-in-up mt-4">
              <ResultCard 
                diagnosis={result.Diagnose} 
                nextSteps={result.NextSteps} 
                color={color}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModelView;
